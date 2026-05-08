import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { AIRecommendationService } from './ai-job-recommendation.service';
import { ActiveUsersGateway } from '../websocket-gateway/active-users.gateway';
import { JobsService } from './jobs.service';

@Injectable()
export class RecommendationCron {
  private readonly logger = new Logger(RecommendationCron.name);

  constructor(
    private prisma: PrismaService,
    private aiRecommendation: AIRecommendationService,
    private activeUsersGateway: ActiveUsersGateway,
    private jobsService: JobsService,
  ) { }

  // @Cron(CronExpression.EVERY_HOUR)
  @Cron('* * * * *')
  // @Cron('0 */30 * * * *')
  async recomputeStaleRecommendations() {
    const activeAccountIDs = this.activeUsersGateway.getActiveAccountIDs();
    if (activeAccountIDs.size === 0) return;

    for (const accountID of activeAccountIDs) {
      try {
        const hasChanged =
          await this.aiRecommendation.computeAndSaveRecommendations(accountID);

        if (hasChanged) {
          await this.jobsService.incrementRecommendationQuota(accountID);

          this.logger.log(
            `Recommendation changed → quota incremented for accountID=${accountID}`,
          );
        }
      } catch (err) {
        this.logger.error(`Failed recompute for accountID=${accountID}`, err);
      }
    }
  }
}