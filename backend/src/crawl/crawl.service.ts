/**
 * crawl.service.ts
 * ─────────────────────────────────────────────────────────────
 * Trung gian giữa NestJS ↔ Python Crawler Service ↔ Redis Pub/Sub.
 *
 * TRÁCH NHIỆM:
 *   1. Gọi Python /search khi user tìm kiếm
 *   2. Subscribe Redis channel "crawl:jobs" để nhận job real-time
 *   3. Broadcast job đến đúng SSE client (theo session_id)
 *   4. Dọn dẹp connection khi client disconnect
 *
 * PATTERN SSE (Server-Sent Events):
 *   Client kết nối GET /jobs/stream → NestJS giữ connection mở
 *   → Python push job lên Redis → NestJS nhận → forward qua SSE
 *   → React nhận từng job real-time, update UI
 * ─────────────────────────────────────────────────────────────
 */

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject, Observable } from 'rxjs';
import { createClient } from 'redis';

export interface CrawlJobEvent {
  type: 'job' | 'done' | 'error';
  data?: any;
  total?: number;
  error?: string;
}

@Injectable()
export class CrawlService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CrawlService.name);

  // Redis subscriber client (riêng biệt với client chính)
  private subscriber: ReturnType<typeof createClient> | null = null;

  // Map session_id → Subject để broadcast đến đúng SSE client
  // Mỗi SSE connection tạo 1 Subject, cleanup khi client disconnect
  private sessions = new Map<string, Subject<CrawlJobEvent>>();

  // Subject chung cho tất cả client (broadcast toàn bộ)
  private globalSubject = new Subject<CrawlJobEvent>();

  private readonly pythonServiceUrl: string;
  private readonly redisUrl: string;

  constructor(private configService: ConfigService) {
    this.pythonServiceUrl =
      this.configService.get<string>('PYTHON_CRAWLER_URL') ??
      'http://localhost:8000';
    this.redisUrl =
      this.configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
  }

  // ─────────────────────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────

  async onModuleInit() {
    await this.connectRedisSubscriber();
  }

  async onModuleDestroy() {
    await this.subscriber?.quit();
    this.globalSubject.complete();
    this.sessions.forEach((s) => s.complete());
  }

  // ─────────────────────────────────────────────────────────────
  // REDIS SUBSCRIBER
  // ─────────────────────────────────────────────────────────────

  private async connectRedisSubscriber() {
    this.subscriber = createClient({ url: this.redisUrl });

    this.subscriber.on('error', (err) => {
      this.logger.error(`Redis subscriber error: ${err.message}`);
    });

    await this.subscriber.connect();

    // Subscribe channel "crawl:jobs" — Python push job vào đây
    await this.subscriber.subscribe('crawl:jobs', (message) => {
      this.handleRedisMessage(message);
    });

    this.logger.log('Redis subscriber connected → channel: crawl:jobs');
  }

  private handleRedisMessage(message: string) {
    try {
      const data = JSON.parse(message);

      // Signal kết thúc crawl session
      if (data.__done__) {
        const event: CrawlJobEvent = { type: 'done', total: data.total };
        this.broadcastToAll(event);
        return;
      }

      // Job data bình thường
      const event: CrawlJobEvent = { type: 'job', data };
      this.broadcastToAll(event);
    } catch (err) {
      this.logger.warn(`Invalid Redis message: ${message}`);
    }
  }

  private broadcastToAll(event: CrawlJobEvent) {
    // Broadcast đến global (tất cả client đang listen)
    this.globalSubject.next(event);

    // Broadcast đến từng session cụ thể
    this.sessions.forEach((subject) => subject.next(event));
  }

  // ─────────────────────────────────────────────────────────────
  // SSE STREAM — Controller gọi để lấy Observable
  // ─────────────────────────────────────────────────────────────

  /**
   * Tạo Observable cho 1 SSE connection.
   * Controller subscribe Observable này và stream về client.
   * Tự động cleanup khi client disconnect.
   */
  createStream(sessionId?: string): Observable<CrawlJobEvent> {
    if (!sessionId) {
      // Không có session → dùng global stream
      return this.globalSubject.asObservable();
    }

    // Tạo session-specific subject
    const subject = new Subject<CrawlJobEvent>();
    this.sessions.set(sessionId, subject);

    return new Observable((observer) => {
      const sub = subject.subscribe(observer);
      return () => {
        // Client disconnect → cleanup
        sub.unsubscribe();
        subject.complete();
        this.sessions.delete(sessionId);
        this.logger.debug(`SSE session ${sessionId} disconnected`);
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TRIGGER CRAWL — Gọi Python service
  // ─────────────────────────────────────────────────────────────

  /**
   * Gọi Python /search khi user nhấn tìm kiếm.
   * Python sẽ trigger crawl ngay nếu đang rảnh,
   * hoặc để crawler hiện tại tiếp tục nếu đang bận.
   */
  async triggerSearch(query: string, sessionId?: string): Promise<{
    crawling: boolean;
    source: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.pythonServiceUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, session_id: sessionId ?? '' }),
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      if (!response.ok) {
        throw new Error(`Python service returned ${response.status}`);
      }

      const result = await response.json() as {
        crawling: boolean;
        source: string;
        message: string;
      };

      this.logger.log(
        `Search trigger: query="${query}", source=${result.source}`,
      );
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to trigger crawl: ${message}`);
      // Không throw — nếu Python service down thì NestJS vẫn trả data từ DB
      return {
        crawling: false,
        source: 'error',
        message: 'Crawler service không phản hồi, dùng dữ liệu có sẵn',
      };
    }
  }

  /**
   * Kiểm tra Python service còn sống không.
   * Dùng trong health check.
   */
  async checkPythonHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.pythonServiceUrl}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
