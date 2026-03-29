"""
scheduler.py
─────────────────────────────────────────────────────────────
Scheduler với graceful shutdown support.
─────────────────────────────────────────────────────────────
"""
import asyncio
import os
from datetime import datetime
from orchestrator import run_crawl

CRAWL_INTERVAL_MINUTES = int(os.getenv("CRAWL_INTERVAL_MINUTES", "2"))

_crawl_lock = asyncio.Lock()
_immediate_event = asyncio.Event()
_shutdown_event = asyncio.Event()  # Thêm event để signal shutdown

_current_session: dict = {
    "running": False,
    "started_at": None,
    "query": "",
    "triggered_by": "scheduler",
}


def get_status() -> dict:
    return {
        "running": _current_session["running"],
        "started_at": _current_session["started_at"].isoformat() if _current_session["started_at"] else None,
        "query": _current_session["query"],
        "triggered_by": _current_session["triggered_by"],
        "next_scheduled_in_minutes": CRAWL_INTERVAL_MINUTES,
    }


async def trigger_immediate(query: str = ""):
    if _crawl_lock.locked():
        print(f"[SCHEDULER] Search trigger nhưng đang crawl — bỏ qua")
        return False

    _current_session["query"] = query
    _current_session["triggered_by"] = "search"
    _immediate_event.set()
    print(f"[SCHEDULER] Search trigger: sẽ chạy crawl ngay cho query='{query}'")
    return True


async def _run_one_session(query: str = "", triggered_by: str = "scheduler"):
    async with _crawl_lock:
        _current_session["running"] = True
        _current_session["started_at"] = datetime.now()
        _current_session["query"] = query
        _current_session["triggered_by"] = triggered_by
        print(f"\n[SCHEDULER] ▶ Bắt đầu crawl — trigger={triggered_by}, query='{query}'")
        try:
            await run_crawl(query)
        except Exception as e:
            print(f"[SCHEDULER] ✗ Lỗi session crawl: {e}")
        finally:
            _current_session["running"] = False
            print(f"[SCHEDULER] ✓ Hoàn tất crawl session")


# async def scheduler_loop():
#     print(f"[SCHEDULER] Khởi động — interval={CRAWL_INTERVAL_MINUTES} phút")

#     # Chạy ngay lần đầu
#     await _run_one_session(triggered_by="scheduler:startup")

#     while not _shutdown_event.is_set():  # Check shutdown event
#         try:
#             await asyncio.wait_for(
#                 _immediate_event.wait(),
#                 timeout=CRAWL_INTERVAL_MINUTES * 60
#             )
#             _immediate_event.clear()
#             query = _current_session.get("query", "")
#             await _run_one_session(query=query, triggered_by="search")

#         except asyncio.TimeoutError:
#             await _run_one_session(triggered_by="scheduler:interval")
#         except asyncio.CancelledError:
#             print("[SCHEDULER] Nhận tín hiệu dừng")
#             break

#     print("[SCHEDULER] Đã dừng hoàn toàn")
async def scheduler_loop():
    print(f"[SCHEDULER] Khởi động — interval={CRAWL_INTERVAL_MINUTES} phút")

    # chạy ngay lần đầu
    await _run_one_session(triggered_by="scheduler:startup")

    while not _shutdown_event.is_set():
        try:
            # Ưu tiên trigger ngay nếu có search
            if _immediate_event.is_set():
                _immediate_event.clear()
                query = _current_session.get("query", "")
                await _run_one_session(query=query, triggered_by="search")
                continue

            # ⏳ CHỜ SAU KHI CRAWL XONG
            print(f"[SCHEDULER] ⏳ Chờ {CRAWL_INTERVAL_MINUTES} phút...")
            await asyncio.wait_for(
                _shutdown_event.wait(),
                timeout=CRAWL_INTERVAL_MINUTES * 60
            )

            if _shutdown_event.is_set():
                break

            await _run_one_session(triggered_by="scheduler:interval")

        except asyncio.TimeoutError:
            # hết thời gian chờ → crawl tiếp
            await _run_one_session(triggered_by="scheduler:interval")

        except asyncio.CancelledError:
            print("[SCHEDULER] Nhận tín hiệu dừng")
            break

    print("[SCHEDULER] Đã dừng hoàn toàn")

def shutdown():
    """Gọi từ lifespan để signal shutdown"""
    _shutdown_event.set()
    _immediate_event.set()