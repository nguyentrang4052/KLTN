"""
link_checker.py
─────────────────────────────────────────────────────────────
MỤC ĐÍCH: Định kỳ kiểm tra tất cả sourceLink trong DB còn sống không.
          Nếu link trả về 404 / gone / lỗi kết nối liên tục → xóa job.

THIẾT KẾ:
  - Dùng aiohttp (không cần Playwright — chỉ cần HTTP HEAD/GET)
  - Batch nhỏ + semaphore để tránh spam request
  - Retry 2 lần trước khi kết luận link chết
  - Xóa cascade: JobSkill → JobSourceTracking → Job
    (Company giữ lại vì có thể còn job khác của cùng công ty)
  - Cấu hình qua env var

ENV VARS:
  LINK_CHECK_INTERVAL_DAYS   = 3      (chu kỳ chạy, mặc định 3 ngày)
  LINK_CHECK_CONCURRENCY     = 10     (số request đồng thời)
  LINK_CHECK_TIMEOUT_SECONDS = 15     (timeout mỗi request)
  LINK_CHECK_RETRY_COUNT     = 2      (số lần retry trước khi kết luận chết)
  LINK_CHECK_BATCH_SIZE      = 50     (số job xử lý mỗi batch)
  LINK_CHECK_BATCH_DELAY     = 2      (giây nghỉ giữa các batch)
─────────────────────────────────────────────────────────────
"""
import os
import asyncio
from datetime import datetime, timedelta
from contextlib import contextmanager

import aiohttp
import psycopg2
import psycopg2.extras

from db_service import get_db_url

# ─────────────────────────────────────────────────────────────
# CẤU HÌNH
# ─────────────────────────────────────────────────────────────
LINK_CHECK_INTERVAL_DAYS   = int(os.getenv("LINK_CHECK_INTERVAL_DAYS",   "3"))
LINK_CHECK_CONCURRENCY     = int(os.getenv("LINK_CHECK_CONCURRENCY",     "10"))
LINK_CHECK_TIMEOUT_SECONDS = int(os.getenv("LINK_CHECK_TIMEOUT_SECONDS", "15"))
LINK_CHECK_RETRY_COUNT     = int(os.getenv("LINK_CHECK_RETRY_COUNT",     "2"))
LINK_CHECK_BATCH_SIZE      = int(os.getenv("LINK_CHECK_BATCH_SIZE",      "50"))
LINK_CHECK_BATCH_DELAY     = int(os.getenv("LINK_CHECK_BATCH_DELAY",     "2"))

# HTTP status code kết luận là "link chết"
DEAD_STATUS_CODES = {404, 410}  # 404 Not Found, 410 Gone

# User-Agent để không bị block
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; JobCrawlerBot/1.0; "
        "+https://github.com/your-repo)"
    ),
    "Accept": "text/html,application/xhtml+xml,*/*",
}


# ─────────────────────────────────────────────────────────────
# DB HELPERS
# ─────────────────────────────────────────────────────────────

@contextmanager
def _get_conn():
    conn = psycopg2.connect(get_db_url())
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _fetch_jobs_to_check(limit: int = 0) -> list[dict]:
    """
    Lấy tất cả job có sourceLink để kiểm tra.
    Ưu tiên job cũ hơn (postedAt ASC) — job mới ít có nguy cơ chết hơn.
    """
    with _get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            query = """
                SELECT "jobID", "sourceLink", "sourcePlatform", "title"
                FROM "Job"
                WHERE "sourceLink" IS NOT NULL
                  AND "sourceLink" != ''
                ORDER BY COALESCE("postedAt", "discoveredAt") ASC NULLS LAST
            """
            if limit > 0:
                query += f" LIMIT {limit}"
            cur.execute(query)
            return [dict(row) for row in cur.fetchall()]


def _delete_job_cascade(job_id: int, source_link: str) -> bool:
    """
    Xóa job và toàn bộ dữ liệu liên quan:
      JobSkill → JobSourceTracking → Job
    Company KHÔNG xóa (có thể còn job khác cùng công ty).
    Trả về True nếu xóa thành công.
    """
    try:
        with _get_conn() as conn:
            with conn.cursor() as cur:
                # 1. Xóa JobSkill
                cur.execute(
                    'DELETE FROM "JobSkill" WHERE "jobID" = %s',
                    (job_id,)
                )
                # 2. Xóa JobSourceTracking
                cur.execute(
                    'DELETE FROM "JobSourceTracking" WHERE "jobID" = %s',
                    (job_id,)
                )
                # 3. Xóa Job chính
                cur.execute(
                    'DELETE FROM "Job" WHERE "jobID" = %s',
                    (job_id,)
                )
                deleted = cur.rowcount
                return deleted > 0
    except Exception as e:
        print(f"[LINK CHECKER] ❌ Lỗi xóa job {job_id} ({source_link[:60]}): {e}")
        return False


# ─────────────────────────────────────────────────────────────
# HTTP CHECK
# ─────────────────────────────────────────────────────────────

async def _check_link(
    session: aiohttp.ClientSession,
    semaphore: asyncio.Semaphore,
    url: str,
) -> bool:
    """
    Kiểm tra 1 URL còn sống không.
    Trả về True nếu SỐNG, False nếu CHẾT (404/410).

    Logic:
    1. Thử HEAD request (nhanh, không tải body)
    2. Nếu server không hỗ trợ HEAD → thử GET với stream (đọc tối thiểu)
    3. Retry LINK_CHECK_RETRY_COUNT lần nếu lỗi mạng
    4. Lỗi mạng liên tục → coi là SỐNG (tránh xóa nhầm do mạng chập chờn)
    """
    async with semaphore:
        timeout = aiohttp.ClientTimeout(total=LINK_CHECK_TIMEOUT_SECONDS)
        network_errors = 0

        for attempt in range(LINK_CHECK_RETRY_COUNT + 1):
            try:
                # Thử HEAD trước
                async with session.head(
                    url,
                    headers=HEADERS,
                    timeout=timeout,
                    allow_redirects=True,
                    ssl=False,  # Bỏ qua lỗi SSL cert hết hạn
                ) as resp:
                    status = resp.status

                    # HEAD bị từ chối → thử GET
                    if status in (405, 403, 400):
                        async with session.get(
                            url,
                            headers=HEADERS,
                            timeout=timeout,
                            allow_redirects=True,
                            ssl=False,
                        ) as get_resp:
                            status = get_resp.status

                    if status in DEAD_STATUS_CODES:
                        return False  # CHẾT

                    return True  # SỐNG (2xx, 3xx, 5xx → không xóa)

            except (
                aiohttp.ClientConnectorError,
                aiohttp.ServerTimeoutError,
                aiohttp.TooManyRedirects,
                asyncio.TimeoutError,
            ):
                network_errors += 1
                if attempt < LINK_CHECK_RETRY_COUNT:
                    await asyncio.sleep(2 ** attempt)  # exponential backoff: 1s, 2s
                continue

            except Exception:
                # Lỗi không xác định → giữ job, không xóa
                return True

        # Hết retry mà vẫn lỗi mạng → coi là SỐNG (tránh xóa nhầm)
        print(f"[LINK CHECKER] ⚠️  Lỗi mạng liên tục ({network_errors}x), bỏ qua: {url[:70]}")
        return True


# ─────────────────────────────────────────────────────────────
# MAIN SERVICE
# ─────────────────────────────────────────────────────────────

class LinkCheckerService:
    """
    Service kiểm tra và dọn dẹp job có link chết.
    """

    async def run_check(self, limit: int = 0) -> dict:
        """
        Chạy 1 lần kiểm tra đầy đủ.
        limit=0 → kiểm tra tất cả job trong DB.
        Trả về stats dict.
        """
        start_time = datetime.now()
        print(f"\n[LINK CHECKER] {'='*55}")
        print(f"[LINK CHECKER] Bắt đầu kiểm tra link - {start_time.isoformat()}")

        # 1. Lấy danh sách job cần check
        jobs = _fetch_jobs_to_check(limit=limit)
        total = len(jobs)

        if total == 0:
            print("[LINK CHECKER] Không có job nào cần kiểm tra.")
            return {"total": 0, "alive": 0, "dead": 0, "deleted": 0, "errors": 0}

        print(f"[LINK CHECKER] Tổng cộng {total} jobs cần kiểm tra")
        print(f"[LINK CHECKER] Cấu hình: concurrency={LINK_CHECK_CONCURRENCY}, timeout={LINK_CHECK_TIMEOUT_SECONDS}s, retry={LINK_CHECK_RETRY_COUNT}")

        # 2. Tạo semaphore để giới hạn concurrency
        semaphore = asyncio.Semaphore(LINK_CHECK_CONCURRENCY)
        stats = {"total": total, "alive": 0, "dead": 0, "deleted": 0, "errors": 0}

        # 3. Chia thành batches để có thể log progress + nghỉ giữa batch
        batches = [
            jobs[i : i + LINK_CHECK_BATCH_SIZE]
            for i in range(0, total, LINK_CHECK_BATCH_SIZE)
        ]

        connector = aiohttp.TCPConnector(limit=LINK_CHECK_CONCURRENCY + 5)
        async with aiohttp.ClientSession(connector=connector) as session:
            for batch_idx, batch in enumerate(batches, 1):
                print(
                    f"[LINK CHECKER] Batch {batch_idx}/{len(batches)} "
                    f"({len(batch)} jobs)..."
                )

                # Chạy song song trong batch
                tasks = [
                    _check_link(session, semaphore, job["sourceLink"])
                    for job in batch
                ]
                results = await asyncio.gather(*tasks, return_exceptions=True)

                # Xử lý kết quả
                dead_in_batch = 0
                for job, is_alive in zip(batch, results):
                    if isinstance(is_alive, Exception):
                        stats["errors"] += 1
                        continue

                    if is_alive:
                        stats["alive"] += 1
                    else:
                        stats["dead"] += 1
                        # Xóa job chết
                        ok = _delete_job_cascade(
                            job["jobID"], job["sourceLink"]
                        )
                        if ok:
                            stats["deleted"] += 1
                            dead_in_batch += 1
                            print(
                                f"[LINK CHECKER] 🗑️  Đã xóa job chết: "
                                f"[{job.get('sourcePlatform', '?')}] "
                                f"{job.get('title', 'N/A')[:50]} | "
                                f"{job['sourceLink'][:60]}"
                            )

                if dead_in_batch:
                    print(f"[LINK CHECKER] Batch {batch_idx}: Xóa {dead_in_batch} jobs chết")

                # Nghỉ giữa batch để tránh spam
                if batch_idx < len(batches):
                    await asyncio.sleep(LINK_CHECK_BATCH_DELAY)

        # 4. Tổng kết
        elapsed = (datetime.now() - start_time).total_seconds()
        print(f"\n[LINK CHECKER] {'='*55}")
        print(f"[LINK CHECKER] ✅ Hoàn tất sau {elapsed:.1f}s")
        print(f"[LINK CHECKER] Tổng: {total} | Còn sống: {stats['alive']} | "
              f"Chết: {stats['dead']} | Đã xóa: {stats['deleted']} | Lỗi: {stats['errors']}")
        print(f"[LINK CHECKER] {'='*55}\n")

        return stats


link_checker_service = LinkCheckerService()


# ─────────────────────────────────────────────────────────────
# BACKGROUND LOOP
# ─────────────────────────────────────────────────────────────

async def link_checker_loop():
    """
    Background task chạy định kỳ mỗi LINK_CHECK_INTERVAL_DAYS ngày.

    Chạy lần đầu SAU 3 ngày (không chạy ngay khi startup)
    vì lúc startup job còn mới, link chắc chắn còn sống.
    """
    interval_seconds = LINK_CHECK_INTERVAL_DAYS * 86400

    print(
        f"[LINK CHECKER LOOP] Khởi động — "
        f"chạy mỗi {LINK_CHECK_INTERVAL_DAYS} ngày"
    )

    while True:
        try:
            print(
                f"[LINK CHECKER LOOP] ⏳ Chờ {LINK_CHECK_INTERVAL_DAYS} ngày "
                f"trước khi kiểm tra lần đầu..."
            )
            await asyncio.sleep(interval_seconds)
            await link_checker_service.run_check()

        except asyncio.CancelledError:
            print("[LINK CHECKER LOOP] Nhận tín hiệu dừng")
            break
        except Exception as e:
            print(f"[LINK CHECKER LOOP] ❌ Lỗi: {e}")
            await asyncio.sleep(300)  # Chờ 5 phút rồi thử lại