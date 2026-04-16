import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private prisma: PrismaService,
        private mailerService: MailerService,
    ) {}

    // Lấy tất cả notifications của user kèm thông tin job
    async getUserNotifications(userID: number) {
        return this.prisma.notification.findMany({
            where: { userID },
            orderBy: { createdAt: 'desc' },
            include: {
                job: {
                    include: {
                        company: {
                            select: {
                                companyName: true,
                                companyLogo: true,
                            }
                        }
                    }
                }
            }
        });
    }

    // Đánh dấu đã đọc
    async markAsRead(id: number, userID: number) {
        const notif = await this.prisma.notification.findFirst({
            where: { id, userID }
        });
        
        if (!notif) throw new Error('Notification not found');

        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    // Lấy preference
    async getEmailPreference(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { userID: userId },
            select: {
                userID: true,
                fullName: true,
                emailNotificationsEnabled: true,
                account: { select: { email: true } },
            },
        });
        if (!user) throw new Error('User not found');
        return {
            userId: user.userID,
            email: user.account.email,
            fullName: user.fullName,
            emailNotificationsEnabled: user.emailNotificationsEnabled ?? false,
        };
    }

    // Cập nhật preference
    async updateEmailPreference(userId: number, enabled: boolean) {
        return this.prisma.user.update({
            where: { userID: userId },
            data: { emailNotificationsEnabled: enabled },
            select: { userID: true, emailNotificationsEnabled: true },
        });
    }

    // 🔔 TẠO NOTIFICATION + GỬI EMAIL NGAY
    async createNotificationAndSendEmail(
        userID: number, 
        job: any, 
        type: 'expired' | 'deadline',
        hoursLeft?: number
    ) {
        // Kiểm tra đã có notification chưa
        const existed = await this.prisma.notification.findFirst({
            where: { userID, jobID: job.jobID, type },
        });
        
        if (existed) {
            this.logger.log(`Notification already exists for user ${userID}, job ${job.jobID}`);
            return { created: false, reason: 'Already exists', notification: existed };
        }

        // Tạo notification
        const notification = await this.prisma.notification.create({
            data: {
                userID,
                jobID: job.jobID,
                title: type === 'expired' ? 'Việc làm đã hết hạn' : 'Việc làm sắp hết hạn',
                content: job.title,
                type,
                isRead: false,
                emailSent: false,
            },
        });

        this.logger.log(`✅ Created notification ${notification.id} for user ${userID}`);

        // Gửi email ngay
        const emailResult = await this.sendEmailForNotification(
            notification.id,
            userID,
            job,
            type,
            hoursLeft
        );

        return {
            created: true,
            notification,
            emailSent: emailResult.sent,
            emailError: emailResult.error,
        };
    }

    // 📧 Gửi email với template card đẹp
    private async sendEmailForNotification(
        notificationId: number,
        userId: number,
        job: any,
        type: 'expired' | 'deadline',
        hoursLeft?: number
    ) {
        const preference = await this.getEmailPreference(userId);
        
        if (!preference.emailNotificationsEnabled) {
            return { sent: false, reason: 'User disabled email notifications' };
        }

        const isExpired = type === 'expired';
        const safeHoursLeft = hoursLeft ?? 0;

        // Lấy thông tin đầy đủ của job kèm company
        const jobDetail = await this.prisma.job.findUnique({
            where: { jobID: job.jobID },
            include: {
                company: {
                    select: {
                        companyName: true,
                        companyLogo: true,
                        companyWebsite: true,
                    }
                }
            }
        });

        if (!jobDetail) {
            return { sent: false, reason: 'Job not found' };
        }

        try {
            await this.mailerService.sendMail({
                to: preference.email,
                subject: this.getEmailSubject(jobDetail, isExpired, safeHoursLeft),
                html: this.buildJobCardEmail(jobDetail, preference.fullName, isExpired, safeHoursLeft),
            });

            // Đánh dấu đã gửi email
            await this.prisma.notification.update({
                where: { id: notificationId },
                data: { emailSent: true },
            });

            this.logger.log(`✅ Email sent to ${preference.email}`);
            return { sent: true };
        } catch (error: any) {
            this.logger.error(`❌ Failed to send email:`, error.message);
            return { sent: false, error: error.message };
        }
    }

    // ⏰ CRON JOB
    @Cron('*/5 * * * *')
    async checkDeadlines() {
        this.logger.log('🔄 Checking job deadlines...');

        const savedJobs = await this.prisma.savedJob.findMany({
            include: { 
                job: true, 
                user: { include: { account: true } } 
            },
        });

        const now = new Date();

        for (const item of savedJobs) {
            const { job, user } = item;
            if (!job?.deadline) continue;

            const diffMs = new Date(job.deadline).getTime() - now.getTime();
            const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
            const isExpired = diffMs <= 0;

            if (hoursLeft > 24 && !isExpired) continue;

            const type = isExpired ? 'expired' : 'deadline';

            await this.createNotificationAndSendEmail(
                user.userID,
                job,
                type,
                isExpired ? 0 : hoursLeft
            );
        }
    }

    // Template helpers
    private getEmailSubject(job: any, isExpired: boolean, hoursLeft: number): string {
        const companyName = job.company?.companyName || 'Công ty';
        if (isExpired) return `❌ [GZ Connect] "${job.title}" tại ${companyName} đã hết hạn`;
        if (hoursLeft <= 24) return `⏰ [GZ Connect] Gấp! Còn ${hoursLeft}h - ${job.title} | ${companyName}`;
        return `🔔 [GZ Connect] Nhắc nhở: ${job.title} | ${companyName}`;
    }

    // 🎨 TEMPLATE EMAIL CARD ĐẸP
    private buildJobCardEmail(
        job: any, 
        fullName: string | null, 
        isExpired: boolean, 
        hoursLeft: number
    ): string {
        const urgencyColor = isExpired ? '#dc3545' : hoursLeft <= 24 ? '#D4820A' : '#2E6040';
        const urgencyBg = isExpired ? '#FEE2E2' : hoursLeft <= 24 ? '#FEF3C7' : '#D1FAE5';
        const statusText = isExpired ? 'ĐÃ HẾT HẠN ỨNG TUYỂN' : `CÒN ${hoursLeft} GIỜ`;
        
        const companyName = job.company?.companyName || 'Chưa cập nhật';
        const companyLogo = job.company?.companyLogo 
            ? `${process.env.BASE_URL}/api${job.company.companyLogo}`
            : 'https://via.placeholder.com/60?text=Logo';
        
        const deadline = job.deadline 
            ? new Date(job.deadline).toLocaleString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : 'Chưa cập nhật';

        const salary = job.salary || 'Thương lượng';
        const location = job.location || 'Chưa cập nhật';
        const jobType = job.jobType || 'Full-time';

        return `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thông báo việc làm - GZ Connect</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background-color: #f3f4f6;
                    color: #1f2937;
                    line-height: 1.6;
                }
                
                .email-wrapper {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                }
                
                /* Header */
                .header {
                    background: linear-gradient(135deg, ${urgencyColor} 0%, ${isExpired ? '#991b1b' : '#1e40af'} 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .header-icon {
                    font-size: 48px;
                    margin-bottom: 15px;
                }
                
                .header h1 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                
                .header-status {
                    display: inline-block;
                    background: rgba(255,255,255,0.2);
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                /* Content */
                .content {
                    padding: 30px;
                }
                
                .greeting {
                    font-size: 16px;
                    color: #4b5563;
                    margin-bottom: 25px;
                }
                
                .greeting strong {
                    color: #1f2937;
                }
                
                /* Alert Box */
                .alert-box {
                    background: ${urgencyBg};
                    border-left: 4px solid ${urgencyColor};
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 25px;
                }
                
                .alert-box p {
                    color: ${urgencyColor};
                    font-weight: 500;
                }
                
                /* Job Card */
                .job-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    margin-bottom: 25px;
                }
                
                .job-card-header {
                    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                    padding: 25px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .company-logo {
                    width: 70px;
                    height: 70px;
                    border-radius: 12px;
                    object-fit: cover;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .company-info h2 {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 6px;
                }
                
                .company-name {
                    font-size: 14px;
                    color: #6b7280;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .job-card-body {
                    padding: 25px;
                }
                
                .detail-row {
                    display: flex;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #f3f4f6;
                }
                
                .detail-row:last-child {
                    border-bottom: none;
                }
                
                .detail-icon {
                    width: 40px;
                    height: 40px;
                    background: #f3f4f6;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    font-size: 18px;
                }
                
                .detail-content {
                    flex: 1;
                }
                
                .detail-label {
                    font-size: 12px;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 2px;
                }
                
                .detail-value {
                    font-size: 15px;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .deadline-value {
                    color: ${urgencyColor};
                }
                
                /* CTA Button */
                .cta-section {
                    text-align: center;
                    padding: 10px 0 20px;
                }
                
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #2E6040 0%, #1e40af 100%);
                    color: white;
                    padding: 16px 40px;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(46, 96, 64, 0.3);
                    transition: transform 0.2s;
                }
                
                .cta-button:hover {
                    transform: translateY(-2px);
                }
                
                .expired-cta {
                    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
                    box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                }
                
                /* Footer */
                .footer {
                    background: #f9fafb;
                    padding: 30px;
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                }
                
                .footer-text {
                    font-size: 13px;
                    color: #6b7280;
                    margin-bottom: 15px;
                }
                
                .footer-links {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .footer-links a {
                    color: #2E6040;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 500;
                }
                
                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .social-icon {
                    width: 36px;
                    height: 36px;
                    background: #e5e7eb;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    font-size: 16px;
                }
                
                .copyright {
                    font-size: 12px;
                    color: #9ca3af;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <!-- Header -->
                <div class="header">
                    <div class="header-icon">${isExpired ? '❌' : '⏰'}</div>
                    <h1>${isExpired ? 'Việc làm đã hết hạn' : 'Sắp hết hạn ứng tuyển'}</h1>
                    <div class="header-status">${statusText}</div>
                </div>
                
                <!-- Content -->
                <div class="content">
                    <p class="greeting">
                        Xin chào <strong>${fullName || 'bạn'}</strong>,
                    </p>
                    
                    <div class="alert-box">
                        <p>
                            ${isExpired 
                                ? 'Công việc bạn đã lưu đã <strong>hết hạn ứng tuyển</strong>. Đừng buồn, còn nhiều cơ hội khác đang chờ bạn!' 
                                : 'Công việc bạn đã lưu <strong>sắp hết hạn ứng tuyển</strong>. Hãy nhanh tay để không bỏ lỡ cơ hội tuyệt vời này!'}
                        </p>
                    </div>
                    
                    <!-- Job Card -->
                    <div class="job-card">
                        <div class="job-card-header">
                            <img src="${companyLogo}" alt="${companyName}" class="company-logo">
                            <div class="company-info">
                                <h2>${job.title}</h2>
                                <div class="company-name">
                                    🏢 ${companyName}
                                </div>
                            </div>
                        </div>
                        
                        <div class="job-card-body">
                            <div class="detail-row">
                                <div class="detail-icon">💰</div>
                                <div class="detail-content">
                                    <div class="detail-label">Mức lương</div>
                                    <div class="detail-value">${salary}</div>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-icon">📍</div>
                                <div class="detail-content">
                                    <div class="detail-label">Địa điểm</div>
                                    <div class="detail-value">${location}</div>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-icon">💼</div>
                                <div class="detail-content">
                                    <div class="detail-label">Loại công việc</div>
                                    <div class="detail-value">${jobType}</div>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-icon">⏰</div>
                                <div class="detail-content">
                                    <div class="detail-label">Hạn chót</div>
                                    <div class="detail-value deadline-value">${deadline}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- CTA -->
                    <div class="cta-section">
                        <a href="${process.env.FRONTEND_URL}/home/job/${job.jobID}" 
                           class="cta-button ${isExpired ? 'expired-cta' : ''}">
                            ${isExpired ? '🔍 Tìm việc khác' : '⚡ Ứng tuyển ngay'}
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <p class="footer-text">
                        Bạn nhận được email này vì đã bật thông báo qua email trên GZ Connect.
                    </p>
                    
                    <div class="footer-links">
                        <a href="${process.env.FRONTEND_URL}/settings">Cài đặt thông báo</a>
                        <a href="${process.env.FRONTEND_URL}/saved-jobs">Việc đã lưu</a>
                        <a href="${process.env.FRONTEND_URL}/help">Trợ giúp</a>
                    </div>
                    
                    <div class="social-links">
                        <a href="#" class="social-icon">📧</a>
                        <a href="#" class="social-icon">💬</a>
                        <a href="#" class="social-icon">📱</a>
                    </div>
                    
                    <p class="copyright">
                        © 2024 GZ Connect. Tất cả quyền được bảo lưu.<br>
                        Đây là email tự động, vui lòng không trả lời.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}