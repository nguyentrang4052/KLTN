import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  CreateSubscriptionDto,
  ConfirmPaymentDto,
  RefundDto,
} from '../dto/subscription.dto';

import { PayOS } from '@payos/node';

const PLANS_CONFIG = {
  free: { displayName: 'Free', monthlyPrice: 0, yearlyPrice: 0 },
  pro: { displayName: 'Pro', monthlyPrice: 10000, yearlyPrice: 15000 },
  elite: { displayName: 'Elite', monthlyPrice: 10000, yearlyPrice: 15000 },
};

@Injectable()
export class SubscriptionService {
  private payos: any;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.payos = new PayOS({
      clientId: this.config.get('PAYOS_CLIENT_ID'),
      apiKey: this.config.get('PAYOS_API_KEY'),
      checksumKey: this.config.get('PAYOS_CHECKSUM_KEY'),
    });
  }

  private currentMonth(): string {
    return new Date().toISOString().slice(0, 7);
  }

  private async grantQuota(
    userID: number,
    planName: string,
    billing: string,
    tx?: any,
  ): Promise<void> {
    const db = tx ?? this.prisma;

    const plan = await db.subscriptionPlan.findFirst({
      where: { name: planName },
      include: { limits: true },
    });
    if (!plan?.limits) return;

    const month = this.currentMonth();
    const { jobSuggestPerDay, cvAnalysisPerMonth, cvMatchCheckCount } =
      plan.limits;

    const UNLIMITED = 999;
    const multiplier = billing === 'yearly' ? 12 : 1;

    const cvAnalysisGrant =
      cvAnalysisPerMonth >= UNLIMITED
        ? UNLIMITED
        : cvAnalysisPerMonth * multiplier;

    const cvMatchGrant =
      cvMatchCheckCount >= UNLIMITED
        ? UNLIMITED
        : cvMatchCheckCount * multiplier;

    const resolveTotal = (current: number | undefined, incoming: number) => {
      if (incoming >= UNLIMITED) return UNLIMITED;
      if ((current ?? 0) >= UNLIMITED) return UNLIMITED;
      return { increment: incoming };
    };

    const existing = await db.userQuota.findUnique({
      where: { userID_month: { userID, month } },
    });

    if (existing) {
      await db.userQuota.update({
        where: { userID_month: { userID, month } },
        data: {
          jobSuggestPerDay,
          cvAnalysisTotal: resolveTotal(
            existing.cvAnalysisTotal,
            cvAnalysisGrant,
          ),
          cvMatchCheckTotal: resolveTotal(
            existing.cvMatchCheckTotal,
            cvMatchGrant,
          ),
        },
      });
    } else {
      await db.userQuota.create({
        data: {
          userID,
          month,
          jobSuggestPerDay,
          cvAnalysisTotal: cvAnalysisGrant,
          cvMatchCheckTotal: cvMatchGrant,
          cvAnalysisUsed: 0,
          cvMatchCheckUsed: 0,
        },
      });
    }
  }

  private async revokeQuota(userID: number, tx?: any): Promise<void> {
    const db = tx ?? this.prisma;
    const month = this.currentMonth();

    const existing = await db.userQuota.findUnique({
      where: { userID_month: { userID, month } },
    });
    if (!existing) return;

    await db.userQuota.update({
      where: { userID_month: { userID, month } },
      data: {
        jobSuggestPerDay: 3,
        cvAnalysisTotal: existing.cvAnalysisUsed,
        cvMatchCheckTotal: existing.cvMatchCheckUsed,
      },
    });
  }

  async getUserQuota(accountID: number) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const month = this.currentMonth();
    const quota = await this.prisma.userQuota.findUnique({
      where: { userID_month: { userID: user.userID, month } },
    });

    if (!quota) {
      const freeLimits = await this.prisma.planLimit.findFirst({
        where: { plan: { name: 'free' } },
      });
      return {
        month,
        jobSuggestPerDay: freeLimits?.jobSuggestPerDay ?? 3,
        cvAnalysisTotal: freeLimits?.cvAnalysisPerMonth ?? 0,
        cvAnalysisUsed: 0,
        cvAnalysisRemaining: freeLimits?.cvAnalysisPerMonth ?? 0,
        cvMatchCheckTotal: freeLimits?.cvMatchCheckCount ?? 0,
        cvMatchCheckUsed: 0,
        cvMatchCheckRemaining: freeLimits?.cvMatchCheckCount ?? 0,
      };
    }

    const UNLIMITED = 999;
    const remaining = (total: number, used: number) =>
      total >= UNLIMITED ? UNLIMITED : Math.max(0, total - used);

    return {
      month: quota.month,
      jobSuggestPerDay: quota.jobSuggestPerDay,
      cvAnalysisTotal: quota.cvAnalysisTotal,
      cvAnalysisUsed: quota.cvAnalysisUsed,
      cvAnalysisRemaining: remaining(
        quota.cvAnalysisTotal,
        quota.cvAnalysisUsed,
      ),
      cvMatchCheckTotal: quota.cvMatchCheckTotal,
      cvMatchCheckUsed: quota.cvMatchCheckUsed,
      cvMatchCheckRemaining: remaining(
        quota.cvMatchCheckTotal,
        quota.cvMatchCheckUsed,
      ),
    };
  }

  async checkAndConsumeQuota(
    accountID: number,
    feature: 'cvAnalysis' | 'cvMatchCheck',
  ) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const month = this.currentMonth();
    const quota = await this.prisma.userQuota.findUnique({
      where: { userID_month: { userID: user.userID, month } },
    });

    const FEATURE_LABEL: Record<string, string> = {
      cvAnalysis: 'Phân tích CV',
      cvMatchCheck: 'Kiểm tra độ phù hợp CV',
    };
    const UNLIMITED = 999;

    if (!quota) {
      throw new BadRequestException(
        `Bạn đã hết lượt ${FEATURE_LABEL[feature]} tháng này. Vui lòng nâng cấp gói.`,
      );
    }

    if (feature === 'cvAnalysis') {
      if (
        quota.cvAnalysisTotal < UNLIMITED &&
        quota.cvAnalysisUsed >= quota.cvAnalysisTotal
      ) {
        throw new BadRequestException(
          `Bạn đã dùng hết ${quota.cvAnalysisTotal} lượt Phân tích CV tháng này.`,
        );
      }
      await this.prisma.userQuota.update({
        where: { userID_month: { userID: user.userID, month } },
        data: { cvAnalysisUsed: { increment: 1 } },
      });
    }

    if (feature === 'cvMatchCheck') {
      if (
        quota.cvMatchCheckTotal < UNLIMITED &&
        quota.cvMatchCheckUsed >= quota.cvMatchCheckTotal
      ) {
        throw new BadRequestException(
          `Bạn đã dùng hết ${quota.cvMatchCheckTotal} lượt Kiểm tra độ phù hợp CV tháng này.`,
        );
      }
      await this.prisma.userQuota.update({
        where: { userID_month: { userID: user.userID, month } },
        data: { cvMatchCheckUsed: { increment: 1 } },
      });
    }

    return { success: true, feature };
  }


  async subscribe(accountID: number, dto: CreateSubscriptionDto) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (dto.planName === 'free')
      throw new BadRequestException('Không thể đăng ký gói Free');

    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: dto.planName },
    });
    if (!plan) throw new NotFoundException('Plan not found');

    const existing = await this.prisma.userSubscription.findFirst({
      where: {
        userID: user.userID,
        status: 'active',
        expiresAt: { gt: new Date() },
        plan: { name: dto.planName },
        billing: dto.billing,
      },
    });
    if (existing)
      throw new BadRequestException(
        `Bạn đang sử dụng gói ${plan.displayName} ${dto.billing === 'yearly' ? 'hàng năm' : 'hàng tháng'} rồi`,
      );

    const amount =
      dto.billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    const orderCode = Date.now();
    const frontendUrl = this.config.get('FRONTEND_URL');

    const now = new Date();
    const expiresAt = new Date(now);
    if (dto.billing === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const payosRes = await this.payos.paymentRequests.create({
      orderCode,
      amount,
      description: `${plan.displayName} ${dto.billing === 'yearly' ? 'nam' : 'thang'}`,
      returnUrl: `${frontendUrl}/services/checkout/payment?orderCode=${orderCode}&status=success`,
      cancelUrl: `${frontendUrl}/services?status=cancel`,
      items: [{ name: `Goi ${plan.displayName}`, quantity: 1, price: amount }],
    });

    const { subscription, payment } = await this.prisma.$transaction(
      async (tx) => {
        const subscription = await tx.userSubscription.create({
          data: {
            userID: user.userID,
            planID: plan.id,
            billing: dto.billing,
            status: 'pending',
            startedAt: now,
            expiresAt,
            autoRenew: false,
          },
          include: { plan: true },
        });

        const payment = await tx.payment.create({
          data: {
            userID: user.userID,
            subscriptionID: subscription.id,
            amount,
            status: 'pending',
            method: 'QR_CODE',
            transactionRef: `${orderCode}`,
          },
        });

        return { subscription, payment };
      },
    );

    return {
      subscription: {
        id: subscription.id,
        planName: subscription.plan.name,
        displayName: subscription.plan.displayName,
        billing: subscription.billing,
        status: subscription.status,
      },
      payment: {
        id: payment.id,
        amount: payment.amount,
        transactionRef: payment.transactionRef,
        status: payment.status,
        checkoutUrl: payosRes.checkoutUrl,
        qrCode: payosRes.qrCode,
      },
    };
  }


  async confirmPayment(dto: ConfirmPaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { transactionRef: dto.transactionRef },
      include: { subscription: { include: { plan: true } } },
    });
    if (!payment) throw new NotFoundException('Không tìm thấy giao dịch');

    if (payment.status === 'success') {
      return {
        success: true,
        status: 'success',
        message: 'Gói đã được kích hoạt thành công!',
      };
    }

    try {
      const orderCode = Number(dto.transactionRef);
      const payosPayment = await this.payos.paymentRequests.get(orderCode);

      if (payosPayment.status === 'PAID') {
        await this.prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: 'success', paidAt: new Date() },
          });

          await tx.userSubscription.updateMany({
            where: {
              userID: payment.userID,
              status: 'active',
              id: { not: payment.subscriptionID },
            },
            data: { status: 'cancelled', autoRenew: false },
          });

          await tx.userSubscription.update({
            where: { id: payment.subscriptionID },
            data: { status: 'active' },
          });

          await this.grantQuota(
            payment.userID,
            payment.subscription.plan.name,
            payment.subscription.billing,
            tx,
          );
        });

        return {
          success: true,
          status: 'success',
          message: 'Thanh toán thành công! Gói đã được kích hoạt.',
        };
      }

      return {
        success: false,
        status: payosPayment.status,
        message: 'Giao dịch chưa hoàn tất. Vui lòng thanh toán và thử lại.',
      };
    } catch (err) {
      console.error('[PayOS] confirmPayment error:', err);
      return {
        success: false,
        status: 'pending',
        message: 'Không thể kiểm tra trạng thái giao dịch. Vui lòng thử lại.',
      };
    }
  }


  async requestRefund(accountID: number, dto: RefundDto) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const payment = await this.prisma.payment.findFirst({
      where: { userID: user.userID, status: 'success' },
      include: { subscription: true },
      orderBy: { paidAt: 'desc' },
    });
    if (!payment)
      throw new NotFoundException('Không có giao dịch hợp lệ để hoàn tiền');
    if (!payment.paidAt)
      throw new BadRequestException('Thông tin thanh toán không hợp lệ');

    const daysSincePaid = Math.floor(
      (Date.now() - new Date(payment.paidAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSincePaid > 7)
      throw new BadRequestException('Đã quá 7 ngày, không thể hoàn tiền');

    const existingRequest = await this.prisma.refundRequest.findFirst({
      where: {
        paymentID: payment.id,
        status: { in: ['pending', 'approved'] },
      },
    });
    if (existingRequest)
      throw new BadRequestException(
        'Giao dịch này đã có yêu cầu hoàn tiền đang xử lý',
      );

    await this.prisma.$transaction(async (tx) => {
      await tx.refundRequest.create({
        data: {
          userID: user.userID,
          paymentID: payment.id,
          reason: dto.reason,
          accountNumber: dto.accountNumber,
          accountName: dto.accountName,
          bankName: dto.bankName,
          status: 'pending',
        },
      });

      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'refund_pending' },
      });

      await tx.userSubscription.update({
        where: { id: payment.subscriptionID },
        data: { status: 'cancelled', autoRenew: false },
      });

      await this.revokeQuota(user.userID, tx);
    });

    return {
      success: true,
      message:
        'Yêu cầu hoàn tiền đã được ghi nhận. Admin sẽ chuyển tiền vào tài khoản của bạn trong 7–14 ngày làm việc.',
      amount: payment.amount,
    };
  }

  async cancelSubscription(accountID: number) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const sub = await this.prisma.userSubscription.findFirst({
      where: { userID: user.userID, status: 'active' },
      orderBy: { startedAt: 'desc' },
    });
    if (!sub) throw new NotFoundException('Không có gói đang active');

    await this.prisma.userSubscription.update({
      where: { id: sub.id },
      data: { status: 'cancelled' },
    });

    await this.revokeQuota(user.userID);

    return {
      message: 'Đã huỷ gói dịch vụ. Quota sẽ được thu hồi ngay.',
      expiresAt: sub.expiresAt,
    };
  }

  async getCurrentSubscription(accountID: number) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const sub = await this.prisma.userSubscription.findFirst({
      where: {
        userID: user.userID,
        status: 'active',
        expiresAt: { gt: new Date() },
      },
      include: { plan: true },
      orderBy: { startedAt: 'desc' },
    });

    if (!sub) {
      const freePlan = await this.prisma.subscriptionPlan.findFirst({
        where: { name: 'free' },
        include: { limits: true },
      });
      return {
        planName: 'free',
        displayName: 'Free',
        billing: null,
        status: 'active',
        expiresAt: null,
        autoRenew: false,
        plan: freePlan,
      };
    }

    return {
      subscriptionID: sub.id,
      planName: sub.plan.name,
      displayName: sub.plan.displayName,
      billing: sub.billing,
      status: sub.status,
      startedAt: sub.startedAt,
      expiresAt: sub.expiresAt,
      autoRenew: false,
      plan: sub.plan,
    };
  }

  async getPaymentHistory(accountID: number) {
    const user = await this.prisma.user.findFirst({
      where: { accountID },
      select: { userID: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const payments = await this.prisma.payment.findMany({
      where: {
        userID: user.userID,
        status: { in: ['success', 'refund_pending', 'refunded'] },
      },
      include: { subscription: { include: { plan: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map((p) => ({
      id: p.id,
      planName: p.subscription.plan.displayName,
      billing: p.subscription.billing,
      amount: p.amount,
      method: p.method,
      status: p.status,
      transactionRef: p.transactionRef,
      paidAt: p.paidAt,
      createdAt: p.createdAt,
    }));
  }

  async getAllPlans() {
    return this.prisma.subscriptionPlan.findMany({
      include: { limits: true },
      orderBy: { monthlyPrice: 'asc' },
    });
  }

  async seedPlans() {
    for (const [name, config] of Object.entries(PLANS_CONFIG)) {
      await this.prisma.subscriptionPlan.upsert({
        where: { name },
        update: config,
        create: { name, ...config },
      });
    }
  }
}
