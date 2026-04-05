import asyncio
import sys
import os
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse


# Load .env TRƯỚC mọi thứ
from dotenv import load_dotenv
load_dotenv()

# ⚠️ FIX: Windows + Playwright cần ProactorEventLoop
if sys.platform == "win32":
    loop = asyncio.ProactorEventLoop()
    asyncio.set_event_loop(loop)

# Import services
from redis_service import redis_service


# from scheduler import scheduler_loop, trigger_immediate, get_status


from scheduler import (
    scheduler_loop, 
    trigger_immediate, 
    trigger_fast_search,  # Thêm import này
    get_status
)



from maintenance import maintenance_loop, maintenance_service
from link_checker import link_checker_loop, link_checker_service, LINK_CHECK_INTERVAL_DAYS  # 👈 Thêm mới

# Kiểm tra env
print(f"[Main] DATABASE_URL: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}")
print(f"[Main] REDIS_URL: {os.getenv('REDIS_URL', 'NOT SET')}")
print(f"[Main] RESET_ISNEWJOB_AFTER_HOURS: {os.getenv('RESET_ISNEWJOB_AFTER_HOURS', '48 (default)')}")
print(f"[Main] LINK_CHECK_INTERVAL_DAYS: {os.getenv('LINK_CHECK_INTERVAL_DAYS', '3 (default)')}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ===== STARTUP =====

    # Kết nối Redis
    await redis_service.connect()
    print("[Main] ✅ Redis connected.")

    # Khởi động scheduler (crawl theo interval)
    scheduler_task = asyncio.create_task(scheduler_loop())
    print("[Main] ✅ Scheduler started.")

    # Khởi động maintenance loop (reset isNewJob sau 2 ngày)
    maintenance_task = asyncio.create_task(maintenance_loop())
    print("[Main] ✅ Maintenance started (auto reset isNewJob).")

    # Khởi động link checker loop (xóa job chết sau 3 ngày)  👈 Thêm mới
    link_checker_task = asyncio.create_task(link_checker_loop())
    print(f"[Main] ✅ Link Checker started (kiểm tra link chết mỗi {LINK_CHECK_INTERVAL_DAYS} ngày).")

    yield

    # ===== SHUTDOWN =====
    print("[Main] Shutting down...")

    for task in [scheduler_task, maintenance_task, link_checker_task]:
        task.cancel()

    for task in [scheduler_task, maintenance_task, link_checker_task]:
        try:
            await task
        except asyncio.CancelledError:
            pass

    await redis_service.disconnect()
    print("[Main] Redis disconnected.")


app = FastAPI(title="Job Crawler Service", lifespan=lifespan)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["POST", "GET"],
#     allow_headers=["*"],
# )


origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Nếu dùng Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả methods
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str = ""
    session_id: str = ""


class CrawlRequest(BaseModel):
    query: str = ""
    session_id: str = ""


@app.post("/search-smart")
async def search_smart(req: SearchRequest):
    """1. Trả về DB ngay, 2. Crawl mới ngầm, 3. Publish job mới realtime"""
    from db_service import get_db_url
    import psycopg2, psycopg2.extras

    existing_jobs = []
    try:
        conn = psycopg2.connect(get_db_url())
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT * FROM "Job"
            WHERE title ILIKE %s OR description ILIKE %s OR "sourcePlatform" ILIKE %s
            ORDER BY "discoveredAt" DESC
            LIMIT 20
        """, (f"%{req.query}%", f"%{req.query}%", f"%{req.query}%"))
        existing_jobs = [dict(row) for row in cur.fetchall()]
        cur.close()
        conn.close()
        print(f"[SearchSmart] Tìm thấy {len(existing_jobs)} jobs trong DB")
    except Exception as e:
        print(f"[SearchSmart] Lỗi query DB: {e}")

    # Trigger crawl ngầm (FAST mode)
    if req.query:
        asyncio.create_task(trigger_fast_search(req.query))

    return {
        "status": "ok",
        "source": "db_first",
        "existing_jobs": existing_jobs,
        "count": len(existing_jobs),
        "crawling": bool(req.query),
        "message": f"Hiển thị {len(existing_jobs)} việc làm từ DB. Đang tìm thêm việc mới..."
    }

@app.post("/crawl")
async def trigger_crawl(req: CrawlRequest, background_tasks: BackgroundTasks):
    triggered = await trigger_immediate(req.query)
    return {
        "status": "started" if triggered else "already_running",
        "query": req.query,
    }


@app.get("/status")
async def get_crawler_status():
    return get_status()


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "scheduler": get_status(),
        "maintenance": {
            "auto_reset_isnewjob_after_hours": int(os.getenv("RESET_ISNEWJOB_AFTER_HOURS", "48")),
            "interval_hours": int(os.getenv("MAINTENANCE_INTERVAL_HOURS", "6")),
        },
        "link_checker": {
            "check_interval_days": LINK_CHECK_INTERVAL_DAYS,
            "concurrency": int(os.getenv("LINK_CHECK_CONCURRENCY", "10")),
            "timeout_seconds": int(os.getenv("LINK_CHECK_TIMEOUT_SECONDS", "15")),
        },
    }



@app.get("/stream")
async def stream_jobs():
    async def event_generator():
        # Subscribe Redis channel crawl:jobs
        pubsub = redis_service.client.pubsub()
        await pubsub.subscribe("crawl:jobs")
        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                if message:
                    yield f"data: {message['data']}\n\n"
                await asyncio.sleep(0.1)
        finally:
            await pubsub.unsubscribe("crawl:jobs")
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")



# ===== ADMIN ENDPOINTS =====

@app.post("/admin/reset-new-jobs")
async def admin_reset_new_jobs():
    """Trigger reset isNewJob ngay lập tức"""
    count = await maintenance_service.reset_old_new_jobs()
    return {
        "action": "reset_old_new_jobs",
        "reset_count": count,
        "reset_after_hours": int(os.getenv("RESET_ISNEWJOB_AFTER_HOURS", "48")),
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/admin/new-jobs-stats")
async def admin_new_jobs_stats():
    """Thống kê job mới hiện tại"""
    from datetime import timedelta
    from db_service import get_db_url
    import psycopg2

    try:
        conn = psycopg2.connect(get_db_url())
        cur = conn.cursor()

        cur.execute('SELECT COUNT(*) FROM "Job" WHERE "isNewJob" = true')
        total_new = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM \"Job\" WHERE \"discoveredAt\" >= NOW() - INTERVAL '24 hours'")
        last_24h = cur.fetchone()[0]

        cutoff_soon = datetime.now() - timedelta(hours=42)
        cur.execute('SELECT COUNT(*) FROM "Job" WHERE "isNewJob" = true AND "discoveredAt" < %s', (cutoff_soon,))
        expiring_soon = cur.fetchone()[0]

        cur.close()
        conn.close()

        return {
            "total_new_jobs": total_new,
            "discovered_last_24h": last_24h,
            "expiring_soon_next_6h": expiring_soon,
            "auto_reset_after_hours": int(os.getenv("RESET_ISNEWJOB_AFTER_HOURS", "48")),
        }
    except Exception as e:
        return {"error": str(e)}


# ─── Link Checker Admin ──────────────────────────────────────

@app.post("/admin/check-dead-links")
async def admin_check_dead_links(
    background_tasks: BackgroundTasks,
    limit: int = 0,
):
    """
    Trigger kiểm tra link chết ngay lập tức (chạy nền).
    limit=0 → kiểm tra toàn bộ DB.
    limit=N → chỉ kiểm tra N job cũ nhất (để test nhanh).
    """
    background_tasks.add_task(_run_link_check_bg, limit)
    return {
        "action": "check_dead_links",
        "status": "started_in_background",
        "limit": limit if limit > 0 else "all",
        "timestamp": datetime.now().isoformat(),
    }


async def _run_link_check_bg(limit: int):
    """Wrapper chạy link check trong background task của FastAPI."""
    try:
        stats = await link_checker_service.run_check(limit=limit)
        print(f"[Main] Admin link check hoàn tất: {stats}")
    except Exception as e:
        print(f"[Main] Admin link check lỗi: {e}")


@app.get("/admin/dead-link-stats")
async def admin_dead_link_stats():
    """Thống kê nhanh về số lượng job trong DB (không check link thực)."""
    from db_service import get_db_url
    import psycopg2

    try:
        conn = psycopg2.connect(get_db_url())
        cur = conn.cursor()

        cur.execute('SELECT COUNT(*) FROM "Job"')
        total_jobs = cur.fetchone()[0]

        cur.execute('SELECT COUNT(*) FROM "Job" WHERE "sourceLink" IS NOT NULL AND "sourceLink" != \'\'')
        jobs_with_link = cur.fetchone()[0]

        cur.execute('SELECT COUNT(*) FROM "Job" WHERE "isActive" = false')
        inactive_jobs = cur.fetchone()[0]

        # Thống kê theo platform
        cur.execute("""
            SELECT "sourcePlatform", COUNT(*) as cnt
            FROM "Job"
            WHERE "sourceLink" IS NOT NULL
            GROUP BY "sourcePlatform"
            ORDER BY cnt DESC
        """)
        by_platform = {row[0]: row[1] for row in cur.fetchall()}

        cur.close()
        conn.close()

        return {
            "total_jobs": total_jobs,
            "jobs_with_source_link": jobs_with_link,
            "inactive_jobs": inactive_jobs,
            "by_platform": by_platform,
            "link_checker_config": {
                "interval_days": LINK_CHECK_INTERVAL_DAYS,
                "concurrency": int(os.getenv("LINK_CHECK_CONCURRENCY", "10")),
                "timeout_seconds": int(os.getenv("LINK_CHECK_TIMEOUT_SECONDS", "15")),
                "retry_count": int(os.getenv("LINK_CHECK_RETRY_COUNT", "2")),
                "batch_size": int(os.getenv("LINK_CHECK_BATCH_SIZE", "50")),
            },
        }
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)