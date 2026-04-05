# """
# scheduler.py
# ─────────────────────────────────────────────────────────────
# Scheduler với graceful shutdown support.
# ─────────────────────────────────────────────────────────────
# """
# import asyncio
# import os
# from datetime import datetime
# from orchestrator import run_crawl

# CRAWL_INTERVAL_MINUTES = int(os.getenv("CRAWL_INTERVAL_MINUTES", "2"))

# _crawl_lock = asyncio.Lock()
# _immediate_event = asyncio.Event()
# _shutdown_event = asyncio.Event()  # Thêm event để signal shutdown

# _current_session: dict = {
#     "running": False,
#     "started_at": None,
#     "query": "",
#     "triggered_by": "scheduler",
# }


# def get_status() -> dict:
#     return {
#         "running": _current_session["running"],
#         "started_at": _current_session["started_at"].isoformat() if _current_session["started_at"] else None,
#         "query": _current_session["query"],
#         "triggered_by": _current_session["triggered_by"],
#         "next_scheduled_in_minutes": CRAWL_INTERVAL_MINUTES,
#     }


# async def trigger_immediate(query: str = ""):
#     if _crawl_lock.locked():
#         print(f"[SCHEDULER] Search trigger nhưng đang crawl — bỏ qua")
#         return False

#     _current_session["query"] = query
#     _current_session["triggered_by"] = "search"
#     _immediate_event.set()
#     print(f"[SCHEDULER] Search trigger: sẽ chạy crawl ngay cho query='{query}'")
#     return True


# async def _run_one_session(query: str = "", triggered_by: str = "scheduler"):
#     async with _crawl_lock:
#         _current_session["running"] = True
#         _current_session["started_at"] = datetime.now()
#         _current_session["query"] = query
#         _current_session["triggered_by"] = triggered_by
#         print(f"\n[SCHEDULER] ▶ Bắt đầu crawl — trigger={triggered_by}, query='{query}'")
#         try:
#             await run_crawl(query)
#         except Exception as e:
#             print(f"[SCHEDULER] ✗ Lỗi session crawl: {e}")
#         finally:
#             _current_session["running"] = False
#             print(f"[SCHEDULER] ✓ Hoàn tất crawl session")


# # async def scheduler_loop():
# #     print(f"[SCHEDULER] Khởi động — interval={CRAWL_INTERVAL_MINUTES} phút")

# #     # Chạy ngay lần đầu
# #     await _run_one_session(triggered_by="scheduler:startup")

# #     while not _shutdown_event.is_set():  # Check shutdown event
# #         try:
# #             await asyncio.wait_for(
# #                 _immediate_event.wait(),
# #                 timeout=CRAWL_INTERVAL_MINUTES * 60
# #             )
# #             _immediate_event.clear()
# #             query = _current_session.get("query", "")
# #             await _run_one_session(query=query, triggered_by="search")

# #         except asyncio.TimeoutError:
# #             await _run_one_session(triggered_by="scheduler:interval")
# #         except asyncio.CancelledError:
# #             print("[SCHEDULER] Nhận tín hiệu dừng")
# #             break

# #     print("[SCHEDULER] Đã dừng hoàn toàn")
# async def scheduler_loop():
#     print(f"[SCHEDULER] Khởi động — interval={CRAWL_INTERVAL_MINUTES} phút")

#     # chạy ngay lần đầu
#     await _run_one_session(triggered_by="scheduler:startup")

#     while not _shutdown_event.is_set():
#         try:
#             # Ưu tiên trigger ngay nếu có search
#             if _immediate_event.is_set():
#                 _immediate_event.clear()
#                 query = _current_session.get("query", "")
#                 await _run_one_session(query=query, triggered_by="search")
#                 continue

#             # ⏳ CHỜ SAU KHI CRAWL XONG
#             print(f"[SCHEDULER] ⏳ Chờ {CRAWL_INTERVAL_MINUTES} phút...")
#             await asyncio.wait_for(
#                 _shutdown_event.wait(),
#                 timeout=CRAWL_INTERVAL_MINUTES * 60
#             )

#             if _shutdown_event.is_set():
#                 break

#             await _run_one_session(triggered_by="scheduler:interval")

#         except asyncio.TimeoutError:
#             # hết thời gian chờ → crawl tiếp
#             await _run_one_session(triggered_by="scheduler:interval")

#         except asyncio.CancelledError:
#             print("[SCHEDULER] Nhận tín hiệu dừng")
#             break

#     print("[SCHEDULER] Đã dừng hoàn toàn")

# def shutdown():
#     """Gọi từ lifespan để signal shutdown"""
#     _shutdown_event.set()
#     _immediate_event.set()












"""
scheduler.py
─────────────────────────────────────────────────────────────
Scheduler với graceful shutdown support và Fast Search mode.
─────────────────────────────────────────────────────────────
"""
import asyncio
import os
from datetime import datetime
from orchestrator import run_crawl  # Đảm bảo import đúng

CRAWL_INTERVAL_MINUTES = int(os.getenv("CRAWL_INTERVAL_MINUTES", "2"))

_crawl_lock = asyncio.Lock()
_immediate_event = asyncio.Event()
_fast_search_event = asyncio.Event()  # Event cho fast search
_shutdown_event = asyncio.Event()  # Thêm event để signal shutdown

_current_session: dict = {
    "running": False,
    "started_at": None,
    "query": "",
    "triggered_by": "scheduler",
    "mode": "deep",  # "fast" hoặc "deep"
}


def get_status() -> dict:
    return {
        "running": _current_session["running"],
        "started_at": _current_session["started_at"].isoformat() if _current_session["started_at"] else None,
        "query": _current_session["query"],
        "triggered_by": _current_session["triggered_by"],
        "mode": _current_session.get("mode", "deep"),
        "next_scheduled_in_minutes": CRAWL_INTERVAL_MINUTES,
    }


async def trigger_immediate(query: str = ""):
    """Trigger deep crawl ngay lập tức"""
    if _crawl_lock.locked():
        print(f"[SCHEDULER] Search trigger nhưng đang crawl — bỏ qua")
        return False

    _current_session["query"] = query
    _current_session["triggered_by"] = "search"
    _immediate_event.set()
    print(f"[SCHEDULER] Deep crawl triggered: sẽ chạy crawl ngay cho query='{query}'")
    return True


async def trigger_fast_search(query: str = "") -> bool:
    """Trigger fast search (2 pages) ngay lập tức"""
    # Không check lock ở đây, vì fast search có thể chen ngang deep crawl
    # nhưng sẽ đợi deep crawl xong mới chạy (do _crawl_lock)
    _current_session["query"] = query
    _current_session["triggered_by"] = "fast_search"
    _fast_search_event.set()
    print(f"[SCHEDULER] 🚀 Fast search triggered: '{query}'")
    return True


async def _run_fast_then_deep(query: str):
    """Chạy fast trước (2 pages), sau đó deep (full) ngay sau"""
    # 1. FAST CRAWL - 2 pages/category
    print(f"[SCHEDULER] === BẮT ĐẦU FAST CRAWL ===")
    await _run_one_session(query=query, triggered_by="fast_search", quick_mode=True)
    
    # 2. DEEP CRAWL - Full ngay sau khi fast xong (không thả lock)
    print(f"[SCHEDULER] === CHUYỂN SANG DEEP CRAWL ===")
    await _run_one_session(query=query, triggered_by="fast_search:continuation", quick_mode=False)


async def _run_one_session(query: str = "", triggered_by: str = "scheduler", quick_mode: bool = False):
    """Chạy 1 session với mode cụ thể"""
    async with _crawl_lock:
        _current_session["running"] = True
        _current_session["started_at"] = datetime.now()
        _current_session["query"] = query
        _current_session["triggered_by"] = triggered_by
        _current_session["mode"] = "fast" if quick_mode else "deep"
        
        mode_str = "🚀 FAST" if quick_mode else "🔍 DEEP"
        print(f"\n[SCHEDULER] {mode_str} ▶ Bắt đầu crawl — trigger={triggered_by}, query='{query}'")
        
        try:
            await run_crawl(query, quick_mode=quick_mode)
        except Exception as e:
            print(f"[SCHEDULER] ✗ Lỗi session {mode_str}: {e}")
        finally:
            _current_session["running"] = False
            print(f"[SCHEDULER] ✓ Hoàn tất {mode_str}")


async def scheduler_loop():
    """Loop chính: ưu tiên fast search, sau đó deep crawl"""
    print(f"[SCHEDULER] Khởi động — interval={CRAWL_INTERVAL_MINUTES} phút")
    
    # Chạy ngay lần đầu (deep)
    await _run_one_session(triggered_by="scheduler:startup", quick_mode=False)

    while not _shutdown_event.is_set():
        try:
            # Ưu tiên 1: Fast Search (user vừa search) - Chạy fast rồi deep liền sau
            if _fast_search_event.is_set():
                _fast_search_event.clear()
                query = _current_session.get("query", "")
                # Chạy cả fast lẫn deep trong cùng 1 lock để đảm bảo deep chạy ngay sau fast
                await _run_fast_then_deep(query)
                continue

            # Ưu tiên 2: Immediate trigger thông thường (deep only)
            if _immediate_event.is_set():
                _immediate_event.clear()
                query = _current_session.get("query", "")
                await _run_one_session(query=query, triggered_by="search", quick_mode=False)
                continue

            # Ưu tiên 3: Chờ interval → deep crawl định kỳ
            print(f"[SCHEDULER] ⏳ Chờ {CRAWL_INTERVAL_MINUTES} phút...")
            await asyncio.wait_for(
                _shutdown_event.wait(),
                timeout=CRAWL_INTERVAL_MINUTES * 60
            )

            if _shutdown_event.is_set():
                break

            await _run_one_session(triggered_by="scheduler:interval", quick_mode=False)

        except asyncio.TimeoutError:
            await _run_one_session(triggered_by="scheduler:interval", quick_mode=False)
        except asyncio.CancelledError:
            print("[SCHEDULER] Nhận tín hiệu dừng")
            break

    print("[SCHEDULER] Đã dừng hoàn toàn")


def shutdown():
    """Gọi từ lifespan để signal shutdown"""
    _shutdown_event.set()
    _immediate_event.set()
    _fast_search_event.set()