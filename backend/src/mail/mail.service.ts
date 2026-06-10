import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: Number(config.get('MAIL_PORT')),
      secure: Number(config.get('MAIL_PORT')) === 465,
      family: 4,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASS'),
      },
    });
  }

  async sendOtp(email: string, otp: string) {
    await this.transporter.sendMail({
      from: `"GZCONNECT" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: `[GZCONNECT] Mã xác minh của bạn: ${otp}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: rgb(35, 42, 162);">GZCONNECT</h2>
          <p>Mã xác minh đặt lại mật khẩu của bạn là:</p>
          <div style="
            font-size: 36px; font-weight: 700; letter-spacing: 8px;
            color: #0F0D0B; background: #F5F0E8;
            padding: 20px; text-align: center; border-radius: 12px;
            margin: 24px 0;
          ">${otp}</div>
          <p style="color: #888; font-size: 13px;">
            Mã có hiệu lực trong <strong>10 phút</strong>.<br/>
            Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.
          </p>
        </div>
      `,
    });
  }

  async sendAlertConfirmation(email: string, keyword: string) {
    await this.transporter.sendMail({
      from: `"GZCONNECT" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: `[GZCONNECT] Đã đăng ký thông báo: "${keyword}"`,
      html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: rgb(35, 42, 162);">GZCONNECT</h2>
        <p>Bạn đã đăng ký nhận thông báo việc làm cho từ khóa:</p>
        <div style="
          font-size: 20px; font-weight: 700;
          color: rgb(35,42,162); background: #F0F1FF;
          padding: 16px; text-align: center; border-radius: 10px;
          margin: 20px 0;
        ">${keyword}</div>
        <p style="color: #888; font-size: 13px;">
          Chúng tôi sẽ gửi tối đa 1 email/ngày khi có việc làm mới phù hợp.<br/>
          Nếu muốn huỷ, bạn có thể huỷ bất cứ lúc nào trên website.
        </p>
      </div>
    `,
    });
  }

  async sendJobAlert(email: string, keyword: string, jobs: any[]) {
    const SOURCE_COLORS: Record<string, string> = {
      TopCV: '#00B14F',
      CareerLink: '#D0392A',
      CareerViet: '#1565C0',
    };

    const jobRows = jobs.map((job) => {
      const sourceColor = SOURCE_COLORS[job.sourcePlatform] ?? '#6B5E50';
      const logoLetter = job.company?.companyName?.[0]?.toUpperCase() ?? '?';
      return `
      <tr>
        <td style="padding: 0 0 16px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="
            border: 1px solid #E8E0D0; border-radius: 12px;
            overflow: hidden; background: #FEFCF7;
          ">
            <tr>
              <td style="padding: 18px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="44" valign="top" style="padding-right: 14px;">
                      <div style="
                        width: 44px; height: 44px; border-radius: 10px;
                        background: linear-gradient(135deg, #1565C0, #1E88E5);
                        text-align: center; line-height: 44px;
                        font-size: 18px; font-weight: 800; color: #fff;
                        font-family: sans-serif;
                      ">${job.company?.companyLogo ? '' : logoLetter}</div>
                    </td>
                    <td valign="top">
                      <div style="font-size: 15px; font-weight: 700; color: #1C1510; margin-bottom: 4px; line-height: 1.4;">
                        ${job.title ?? 'Chưa có tiêu đề'}
                      </div>
                      <div style="font-size: 12px; color: #6B5E50; margin-bottom: 10px;">
                        ${job.company?.companyName ? `<span style="margin-right:10px;">🏢 ${job.company.companyName}</span>` : ''}
                        ${job.shortLocation ? `<span style="margin-right:10px;">📍 ${job.shortLocation}</span>` : ''}
                        ${job.salary ? `<span style="color: #C0412A; font-weight: 600;">💰 ${job.salary}</span>` : '<span style="color:#9A8D80;">💰 Thỏa thuận</span>'}
                      </div>
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-right: 8px;">
                            <span style="
                              display: inline-block;
                              font-size: 10px; font-weight: 800;
                              padding: 3px 10px; border-radius: 5px;
                              background: ${sourceColor}18;
                              color: ${sourceColor};
                              border: 1px solid ${sourceColor}40;
                            ">${job.sourcePlatform ?? ''}</span>
                          </td>
                          <td>
                            <a href="${this.config.get('FRONTEND_URL')}/jobs?keyword=${encodeURIComponent(job.title ?? '')}" style="
                              display: inline-block;
                              padding: 6px 16px; border-radius: 7px;
                              background: rgb(35,42,162); color: #fff;
                              font-size: 12px; font-weight: 700;
                              text-decoration: none; letter-spacing: 0.3px;
                            ">Xem việc làm →</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
    }).join('');

    await this.transporter.sendMail({
      from: `"GZCONNECT" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: `[GZCONNECT] ${jobs.length} việc làm mới cho "${keyword}"`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#F5F0E8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="
              background: #232AA2;
              border-radius: 16px 16px 0 0;
              padding: 28px 32px;
              text-align: center;
            ">
              <div style="font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px;">
                GZ<span style="opacity: 0.7;">CONNECT</span>
              </div>
              <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px;">
                Nền tảng tìm việc thông minh
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background: #fff; padding: 28px 32px;">

              <!-- Title -->
              <div style="margin-bottom: 20px;">
                <div style="font-size: 18px; font-weight: 700; color: #1C1510; margin-bottom: 6px;">
                  🔔 Có ${jobs.length} việc làm mới cho bạn!
                </div>
                <div style="font-size: 13px; color: #6B5E50;">
                  Từ khóa: <span style="
                    background: rgba(35,42,162,0.08);
                    color: rgb(35,42,162);
                    font-weight: 700;
                    padding: 2px 10px;
                    border-radius: 5px;
                    border: 1px solid rgba(35,42,162,0.2);
                  ">${keyword}</span>
                </div>
              </div>

              <!-- Jobs -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${jobRows}
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 8px;">
                <tr>
                  <td align="center">
                    <a href="${this.config.get('FRONTEND_URL')}/jobs?keyword=${encodeURIComponent(keyword)}" style="
                      display: inline-block;
                      padding: 12px 28px; border-radius: 10px;
                     background: #232AA2;
                      color: #fff; font-size: 14px; font-weight: 700;
                      text-decoration: none; letter-spacing: 0.3px;
                    ">Xem tất cả việc làm →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background: #F5F0E8;
              border-radius: 0 0 16px 16px;
              padding: 20px 32px;
              text-align: center;
            ">
              <div style="font-size: 12px; color: #9A8D80; line-height: 1.7;">
                Bạn nhận được email này vì đã đăng ký thông báo việc làm trên <strong>GZCONNECT</strong>.<br/>
                Muốn huỷ đăng ký? Truy cập website và xoá từ khóa trong mục thông báo.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    });
  }

  async sendPaymentInvoice(
    email: string,
    data: {
      fullName?: string;
      planDisplayName: string;
      billing: string;
      amount: number;
      transactionRef: string;
      paidAt: Date;
      expiresAt: Date;
    },
  ) {
    const fmt = (d: Date) =>
      new Date(d).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    const billingLabel = data.billing === 'yearly' ? 'Hàng năm' : 'Hàng tháng';
    const amountFmt = data.amount.toLocaleString('vi-VN') + ' VND';

    await this.transporter.sendMail({
      from: `"GZCONNECT" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: `[GZCONNECT] Hóa đơn thanh toán gói ${data.planDisplayName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#232AA2;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
            GZ<span style="opacity:0.7;">CONNECT</span>
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">Xác nhận thanh toán</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#fff;padding:32px;">

          <div style="font-size:42px;text-align:center;margin-bottom:8px;">✅</div>
          <div style="font-size:20px;font-weight:700;color:#1C1510;text-align:center;margin-bottom:4px;">
            Thanh toán thành công!
          </div>
          <div style="font-size:14px;color:#6B5E50;text-align:center;margin-bottom:28px;">
            ${data.fullName ? `Xin chào <strong>${data.fullName}</strong>, g` : 'G'}ói dịch vụ của bạn đã được kích hoạt.
          </div>

          <!-- Invoice box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <div style="font-size:12px;font-weight:700;color:#9A8D80;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">
                Chi tiết hóa đơn
              </div>

              ${[
          [
            'Gói dịch vụ',
            `<strong style="color:#232AA2;">${data.planDisplayName}</strong>`,
          ],
          ['Chu kỳ', billingLabel],
          [
            'Mã giao dịch',
            `<code style="font-size:12px;background:#fff;padding:2px 8px;border-radius:4px;">${data.transactionRef}</code>`,
          ],
          ['Ngày thanh toán', fmt(data.paidAt)],
          ['Hết hạn', fmt(data.expiresAt)],
        ]
          .map(
            ([label, value]) => `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                <tr>
                  <td style="font-size:13px;color:#6B5E50;width:50%;">${label}</td>
                  <td style="font-size:13px;color:#1C1510;text-align:right;">${value}</td>
                </tr>
              </table>`,
          )
          .join('')}

              <div style="border-top:2px solid #E8E0D0;margin:12px 0;"></div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:15px;font-weight:700;color:#1C1510;">Tổng thanh toán</td>
                  <td style="font-size:18px;font-weight:800;color:#232AA2;text-align:right;">${amountFmt}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${this.config.get('FRONTEND_URL') ?? '#'}/services" style="
                display:inline-block;padding:12px 28px;border-radius:10px;
                background:#232AA2;color:#fff;font-size:14px;font-weight:700;
                text-decoration:none;">Xem gói dịch vụ của tôi →</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F5F0E8;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
          <div style="font-size:12px;color:#9A8D80;line-height:1.7;">
            Email này được gửi tự động từ <strong>GZCONNECT</strong>.<br/>
            Nếu bạn không thực hiện giao dịch này, vui lòng liên hệ hỗ trợ ngay.
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
  }

  async sendSubscriptionExpiringSoon(
    email: string,
    data: {
      fullName?: string;
      planDisplayName: string;
      billing: string;
      expiresAt: Date;
      daysLeft: number;
    },
  ) {
    const fmt = (d: Date) =>
      new Date(d).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    await this.transporter.sendMail({
      from: `"GZCONNECT" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: `[GZCONNECT] Gói ${data.planDisplayName} của bạn sắp hết hạn (còn ${data.daysLeft} ngày)`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td style="background:#232AA2;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:800;color:#fff;">GZ<span style="opacity:0.7;">CONNECT</span></div>
          <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">Thông báo dịch vụ</div>
        </td></tr>

        <tr><td style="background:#fff;padding:32px;">
          <div style="font-size:42px;text-align:center;margin-bottom:8px;">⏳</div>
          <div style="font-size:20px;font-weight:700;color:#1C1510;text-align:center;margin-bottom:4px;">
            Gói dịch vụ sắp hết hạn
          </div>
          <div style="font-size:14px;color:#6B5E50;text-align:center;margin-bottom:28px;">
            ${data.fullName ? `Xin chào <strong>${data.fullName}</strong>, ` : ''}gói <strong style="color:#232AA2;">${data.planDisplayName}</strong> của bạn sẽ hết hạn sau <strong style="color:#C0412A;">${data.daysLeft} ngày</strong>.
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF3C7;border-radius:10px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px;color:#6B5E50;">Gói hiện tại</td>
                  <td style="font-size:13px;font-weight:700;color:#232AA2;text-align:right;">${data.planDisplayName}</td>
                </tr>
                <tr><td colspan="2" style="padding:6px 0;"></td></tr>
                <tr>
                  <td style="font-size:13px;color:#6B5E50;">Ngày hết hạn</td>
                  <td style="font-size:13px;font-weight:700;color:#C0412A;text-align:right;">${fmt(data.expiresAt)}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <div style="font-size:13px;color:#6B5E50;text-align:center;margin-bottom:20px;">
            Gia hạn ngay để không bị gián đoạn trải nghiệm tìm việc thông minh của bạn.
          </div>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${this.config.get('FRONTEND_URL') ?? '#'}/services" style="
                display:inline-block;padding:12px 28px;border-radius:10px;
                background:#232AA2;color:#fff;font-size:14px;font-weight:700;
                text-decoration:none;">Xem gói dịch vụ →</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="background:#F5F0E8;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
          <div style="font-size:12px;color:#9A8D80;line-height:1.7;">
            Bạn nhận được email này vì đang sử dụng dịch vụ trả phí tại <strong>GZCONNECT</strong>.
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
  }

  async sendSavedJobDeadlineAlert(
    email: string,
    data: {
      fullName?: string;
      jobs: Array<{
        jobID: number;
        title: string;
        companyName: string;
        deadline: Date;
        hoursLeft: number;
        sourceLink?: string;
      }>;
    },
  ) {
    const fmt = (d: Date) =>
      new Date(d).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    const jobRows = data.jobs
      .map((job) => {
        const isExpired = job.hoursLeft <= 0;
        const urgency = isExpired
          ? { color: '#DC2626', bg: '#FEE2E2', label: 'Đã hết hạn', icon: '❌' }
          : job.hoursLeft <= 24
            ? {
              color: '#D97706',
              bg: '#FEF3C7',
              label: `Còn ${job.hoursLeft}h`,
              icon: '🔥',
            }
            : {
              color: '#2563EB',
              bg: '#EFF6FF',
              label: `Còn ${Math.floor(job.hoursLeft / 24)} ngày`,
              icon: '⏰',
            };

        return `
    <tr><td style="padding:0 0 12px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8E0D0;border-radius:10px;background:#FEFCF7;">
        <tr><td style="padding:16px 18px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="font-size:14px;font-weight:700;color:#1C1510;margin-bottom:4px;">${job.title ?? 'Chưa có tiêu đề'}</div>
                <div style="font-size:12px;color:#6B5E50;margin-bottom:10px;">🏢 ${job.companyName} &nbsp;•&nbsp; 📅 Hết hạn: ${fmt(job.deadline)}</div>
                <span style="display:inline-block;font-size:11px;font-weight:700;padding:3px 10px;border-radius:5px;background:${urgency.bg};color:${urgency.color};border:1px solid ${urgency.color}40;">
                  ${urgency.icon} ${urgency.label}
                </span>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>`;
      })
      .join('');

    await this.transporter.sendMail({
      from: `"GZCONNECT" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: `[GZCONNECT] ${data.jobs.length} việc làm đã lưu sắp hết hạn`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td style="background:#232AA2;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:800;color:#fff;">GZ<span style="opacity:0.7;">CONNECT</span></div>
          <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">Nhắc nhở việc làm đã lưu</div>
        </td></tr>

        <tr><td style="background:#fff;padding:28px 32px;">
          <div style="font-size:18px;font-weight:700;color:#1C1510;margin-bottom:6px;">
            ⏰ Đừng bỏ lỡ cơ hội việc làm!
          </div>
          <div style="font-size:13px;color:#6B5E50;margin-bottom:20px;">
            ${data.fullName ? `Xin chào <strong>${data.fullName}</strong>, ` : ''}bạn có <strong>${data.jobs.length} việc làm đã lưu</strong> sắp hết hạn.
          </div>

          <table width="100%" cellpadding="0" cellspacing="0">${jobRows}</table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
            <tr><td align="center">
              <a href="${this.config.get('FRONTEND_URL') ?? '#'}/saved-jobs" style="
                display:inline-block;padding:12px 28px;border-radius:10px;
                background:#232AA2;color:#fff;font-size:14px;font-weight:700;
                text-decoration:none;">Xem việc làm đã lưu →</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="background:#F5F0E8;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
          <div style="font-size:12px;color:#9A8D80;line-height:1.7;">
            Bạn nhận được email này vì đã lưu việc làm trên <strong>GZCONNECT</strong>.<br/>
            Truy cập website để quản lý danh sách việc làm đã lưu.
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
  }
}