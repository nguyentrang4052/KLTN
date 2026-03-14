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
}
