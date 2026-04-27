import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { AIRecommendationService } from './ai-job-recommendation.service';

@Injectable()
export class RecommendationCron {
  private readonly logger = new Logger(RecommendationCron.name);

  constructor(
    private prisma: PrismaService,
    private aiRecommendation: AIRecommendationService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  // @Cron('* * * * *')
  async recomputeStaleRecommendations() {
    this.logger.log('Cron: checking stale recommendations...');

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Lấy danh sách userID có data cũ hơn 1 giờ
    const staleUsers = await this.prisma.jobRecommendation.groupBy({
      by: ['userID'],
      having: {
        createdAt: { _max: { lt: oneHourAgo } },
      },
    });

    this.logger.log(
      `Found ${staleUsers.length} users with stale recommendations`,
    );

    for (const { userID } of staleUsers) {
      const account = await this.prisma.user.findUnique({
        where: { userID },
        select: { accountID: true },
      });
      if (!account) continue;

      try {
        await this.aiRecommendation.computeAndSaveRecommendations(
          account.accountID,
        );
      } catch (err) {
        this.logger.error(`Failed recompute for userID=${userID}`, err);
      }
    }
  }
}
