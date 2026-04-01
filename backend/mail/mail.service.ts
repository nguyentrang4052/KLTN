import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: config.get<number>('MAIL_PORT'),
      secure: false,
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

    const jobRows = jobs
      .map((job) => {
        const sourceColor = SOURCE_COLORS[job.sourcePlatform] ?? '#666';
        return `
      <div style="
        border: 1px solid #E5E0D8; border-radius: 10px;
        padding: 14px 16px; margin-bottom: 12px;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <div style="font-size: 15px; font-weight: 700; color: #1C1510; flex: 1;">
            ${job.title ?? 'Chưa có tiêu đề'}
          </div>
          ${job.sourcePlatform ? `
            <span style="
              font-size: 10px; font-weight: 800;
              padding: 2px 8px; border-radius: 4px;
              background: ${sourceColor}18;
              color: ${sourceColor};
              border: 1px solid ${sourceColor}40;
              white-space: nowrap; flex-shrink: 0;
            ">${job.sourcePlatform}</span>
          `
              : ''
          }
        </div>
        <div style="font-size: 13px; color: #6B5E50; margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 6px;">
          ${job.company?.companyName ? `<span>🏢 ${job.company.companyName}</span>` : ''}
          ${job.shortLocation ? `<span>📍 ${job.shortLocation}</span>` : ''}
          ${job.salary ? `<span>💰 ${job.salary}</span>` : ''}
        </div>
        <a href="${job.sourceLink ?? '#'}" style="
          display: inline-block;
          padding: 7px 16px; border-radius: 7px;
          background: rgb(35,42,162); color: #fff;
          font-size: 12px; font-weight: 700; text-decoration: none;
        ">Xem việc làm →</a>
      </div>
    `;
      })
      .join('');

    await this.transporter.sendMail({
      from: `"GZCONNECT" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: `[GZCONNECT] ${jobs.length} việc làm mới cho "${keyword}"`,
      html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: rgb(35, 42, 162);">GZCONNECT</h2>
        <p>Có <strong>${jobs.length} việc làm mới</strong> phù hợp với từ khóa <strong>"${keyword}"</strong>:</p>
        ${jobRows}
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          Bạn nhận được email này vì đã đăng ký thông báo việc làm trên GZCONNECT.
        </p>
      </div>
    `,
    });
  }
}
