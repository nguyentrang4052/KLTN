/**
 * crawl.controller.ts
 * ─────────────────────────────────────────────────────────────
 * Controller xử lý luồng real-time giữa React và Python crawler.
 *
 * ENDPOINTS:
 *   GET  /crawl/stream   → SSE stream — React giữ connection, nhận job real-time
 *   POST /crawl/search   → User search → trigger Python crawler + trả DB results ngay
 *   GET  /crawl/status   → Trạng thái crawler (đang chạy không)
 * ─────────────────────────────────────────────────────────────
 */

import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Sse,
  MessageEvent,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { CrawlService } from './crawl.service';
import { JobsService } from '../jobs/jobs.service';
import { OptionalJwtGuard } from '../guards/optional-jwt';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/interfaces/jwt-user.interface';

class SearchDto {
  query?: string;
  session_id?: string;
  locations?: string[];
  industryId?: number;
  page?: number;
  limit?: number;
}

@Controller('crawl')
export class CrawlController {
  constructor(
    private readonly crawlService: CrawlService,
    private readonly jobsService: JobsService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // SSE STREAM
  // ─────────────────────────────────────────────────────────────

  /**
   * Server-Sent Events endpoint.
   * React giữ connection này mở để nhận job real-time.
   *
   * Usage từ React:
   *   const es = new EventSource('/crawl/stream?session_id=abc123');
   *   es.onmessage = (e) => { const job = JSON.parse(e.data); ... }
   *
   * NestJS @Sse decorator tự xử lý Content-Type: text/event-stream
   * và giữ connection mở cho đến khi Observable complete.
   */
  @Sse('stream')
  stream(@Query('session_id') sessionId?: string): Observable<MessageEvent> {
    return this.crawlService.createStream(sessionId).pipe(
      map((event) => ({
        data: JSON.stringify(event),
        type: event.type,
      })),
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SEARCH + TRIGGER CRAWL
  // ─────────────────────────────────────────────────────────────

  /**
   * Endpoint chính khi user nhấn Search.
   *
   * 2 việc song song:
   *   1. Query DB ngay → trả về kết quả hiện có (user thấy ngay)
   *   2. Trigger Python crawler → kết quả mới push qua SSE (realtime)
   *
   * React nhận 2 luồng:
   *   - HTTP response này: data hiện có từ DB
   *   - SSE stream: data mới từ crawler
   */
  @Post('search')
  @UseGuards(OptionalJwtGuard)
  async search(@Body() dto: SearchDto, @GetUser() user?: JwtUser) {
    const { query = '', session_id, ...jobQueryParams } = dto;

    // Chạy song song: trigger crawl + query DB
    const [crawlResult, dbResult] = await Promise.all([
      this.crawlService.triggerSearch(query, session_id),
      this.jobsService.getJobs(
        {
          keyword: query || undefined,
          locations: dto.locations,
          industryId: dto.industryId,
          page: dto.page ?? 1,
          limit: dto.limit ?? 9,
          sort: 'newest',
        },
        user?.sub,
      ),
    ]);

    return {
      // Data từ DB (hiển thị ngay)
      ...dbResult,

      // Thông tin crawler (để React biết có đang crawl không)
      crawler: {
        crawling: crawlResult.crawling,
        source: crawlResult.source,
        message: crawlResult.message,
        session_id,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // STATUS
  // ─────────────────────────────────────────────────────────────

  @Get('status')
  async getStatus() {
    const pythonAlive = await this.crawlService.checkPythonHealth();
    return {
      python_service: pythonAlive ? 'up' : 'down',
    };
  }
}