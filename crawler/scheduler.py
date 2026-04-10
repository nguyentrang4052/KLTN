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












# """
# scheduler.py
# ─────────────────────────────────────────────────────────────
# Scheduler với graceful shutdown support và Fast Search mode.
# ─────────────────────────────────────────────────────────────
# """
# import asyncio
# import os
# from datetime import datetime
# from orchestrator import run_crawl  # Đảm bảo import đúng

# CRAWL_INTERVAL_MINUTES = int(os.getenv("CRAWL_INTERVAL_MINUTES", "2"))

# _crawl_lock = asyncio.Lock()
# _immediate_event = asyncio.Event()
# _fast_search_event = asyncio.Event()  # Event cho fast search
# _shutdown_event = asyncio.Event()  # Thêm event để signal shutdown

# _current_session: dict = {
#     "running": False,
#     "started_at": None,
#     "query": "",
#     "triggered_by": "scheduler",
#     "mode": "deep",  # "fast" hoặc "deep"
# }


# def get_status() -> dict:
#     return {
#         "running": _current_session["running"],
#         "started_at": _current_session["started_at"].isoformat() if _current_session["started_at"] else None,
#         "query": _current_session["query"],
#         "triggered_by": _current_session["triggered_by"],
#         "mode": _current_session.get("mode", "deep"),
#         "next_scheduled_in_minutes": CRAWL_INTERVAL_MINUTES,
#     }


# async def trigger_immediate(query: str = ""):
#     """Trigger deep crawl ngay lập tức"""
#     if _crawl_lock.locked():
#         print(f"[SCHEDULER] Search trigger nhưng đang crawl — bỏ qua")
#         return False

#     _current_session["query"] = query
#     _current_session["triggered_by"] = "search"
#     _immediate_event.set()
#     print(f"[SCHEDULER] Deep crawl triggered: sẽ chạy crawl ngay cho query='{query}'")
#     return True


# async def trigger_fast_search(query: str = "") -> bool:
#     """Trigger fast search (1 page search keyword) ngay lập tức"""
#     print(f"[SCHEDULER] 🚀 FAST SEARCH TRIGGERED: query='{query}'")
    
#     # Nếu đang crawl, đợi hoàn thành rồi mới chạy fast search
#     if _crawl_lock.locked():
#         print(f"[SCHEDULER] Đang crawl, đợi...")
#         # Không block, chỉ set event để loop xử lý sau
#         pass
    
#     _current_session["query"] = query
#     _current_session["triggered_by"] = "fast_search"
#     _fast_search_event.set()
    
#     return True


# async def _run_fast_then_deep(query: str):
#     """Chạy fast trước (2 pages), sau đó deep (full) ngay sau"""
#     # 1. FAST CRAWL - 2 pages/category
#     print(f"[SCHEDULER] === BẮT ĐẦU FAST CRAWL ===")
#     await _run_one_session(query=query, triggered_by="fast_search", quick_mode=True)
    
#     # 2. DEEP CRAWL - Full ngay sau khi fast xong (không thả lock)
#     print(f"[SCHEDULER] === CHUYỂN SANG DEEP CRAWL ===")
#     await _run_one_session(query=query, triggered_by="fast_search:continuation", quick_mode=False)


# async def _run_one_session(query: str = "", triggered_by: str = "scheduler", quick_mode: bool = False):
#     """Chạy 1 session với mode cụ thể"""
#     async with _crawl_lock:
#         _current_session["running"] = True
#         _current_session["started_at"] = datetime.now()
#         _current_session["query"] = query
#         _current_session["triggered_by"] = triggered_by
#         _current_session["mode"] = "fast" if quick_mode else "deep"
        
#         mode_str = "🚀 FAST" if quick_mode else "🔍 DEEP"
#         print(f"\n[SCHEDULER] {mode_str} ▶ Bắt đầu crawl — trigger={triggered_by}, query='{query}'")
        
#         try:
#             await run_crawl(query, quick_mode=quick_mode)
#         except Exception as e:
#             print(f"[SCHEDULER] ✗ Lỗi session {mode_str}: {e}")
#         finally:
#             _current_session["running"] = False
#             print(f"[SCHEDULER] ✓ Hoàn tất {mode_str}")


# async def scheduler_loop():
#     """Loop chính: ưu tiên fast search, sau đó deep crawl"""
#     print(f"[SCHEDULER] Khởi động — interval={CRAWL_INTERVAL_MINUTES} phút")
    
#     # Chạy ngay lần đầu (deep)
#     await _run_one_session(triggered_by="scheduler:startup", quick_mode=False)

#     while not _shutdown_event.is_set():
#         try:
#             # Ưu tiên 1: Fast Search (user vừa search) - Chạy fast rồi deep liền sau
#             if _fast_search_event.is_set():
#                 _fast_search_event.clear()
#                 query = _current_session.get("query", "")
#                 # Chạy cả fast lẫn deep trong cùng 1 lock để đảm bảo deep chạy ngay sau fast
#                 await _run_fast_then_deep(query)
#                 continue

#             # Ưu tiên 2: Immediate trigger thông thường (deep only)
#             if _immediate_event.is_set():
#                 _immediate_event.clear()
#                 query = _current_session.get("query", "")
#                 await _run_one_session(query=query, triggered_by="search", quick_mode=False)
#                 continue

#             # Ưu tiên 3: Chờ interval → deep crawl định kỳ
#             print(f"[SCHEDULER] ⏳ Chờ {CRAWL_INTERVAL_MINUTES} phút...")
#             await asyncio.wait_for(
#                 _shutdown_event.wait(),
#                 timeout=CRAWL_INTERVAL_MINUTES * 60
#             )

#             if _shutdown_event.is_set():
#                 break

#             await _run_one_session(triggered_by="scheduler:interval", quick_mode=False)

#         except asyncio.TimeoutError:
#             await _run_one_session(triggered_by="scheduler:interval", quick_mode=False)
#         except asyncio.CancelledError:
#             print("[SCHEDULER] Nhận tín hiệu dừng")
#             break

#     print("[SCHEDULER] Đã dừng hoàn toàn")


# def shutdown():
#     """Gọi từ lifespan để signal shutdown"""
#     _shutdown_event.set()
#     _immediate_event.set()
#     _fast_search_event.set()





"""
scheduler.py
─────────────────────────────────────────────────────────────
Scheduler với fast search ưu tiên - Cancel task đang chạy.
─────────────────────────────────────────────────────────────
"""
import asyncio
import os
from datetime import datetime
from orchestrator import run_crawl

CRAWL_INTERVAL_MINUTES = int(os.getenv("CRAWL_INTERVAL_MINUTES", "2"))

_crawl_lock = asyncio.Lock()
_immediate_event = asyncio.Event()
_fast_search_event = asyncio.Event()
_shutdown_event = asyncio.Event()
_current_task = None  # Lưu task đang chạy để cancel

_current_session: dict = {
    "running": False,
    "started_at": None,
    "query": "",
    "triggered_by": "scheduler",
    "mode": "deep",
}

def get_status() -> dict:
    return {
        "running": _current_session["running"],
        "started_at": _current_session["started_at"].isoformat() if _current_session["started_at"] else None,
        "query": _current_session["query"],
        "triggered_by": _current_session["triggered_by"],
        "mode": _current_session.get("mode", "deep"),
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
    """Trigger fast search - Cancel crawl hiện tại nếu có"""
    print(f"[SCHEDULER] 🚀 FAST SEARCH TRIGGERED: query='{query}'")
    
    global _current_task
    
    # Cancel task đang chạy nếu có
    if _current_task and not _current_task.done():
        print(f"[SCHEDULER] ⚠️ Hủy crawl hiện tại để chạy fast search...")
        _current_task.cancel()
        try:
            await _current_task
        except asyncio.CancelledError:
            print(f"[SCHEDULER] ✓ Đã hủy crawl cũ")
    
    _current_session["query"] = query
    _current_session["triggered_by"] = "fast_search"
    _fast_search_event.set()
    return True

async def _run_one_session(query: str = "", triggered_by: str = "scheduler", quick_mode: bool = False):
    """Chạy 1 session"""
    global _current_task
    
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
        except asyncio.CancelledError:
            print(f"[SCHEDULER] ⏹️ Crawl bị hủy (cancelled)")
            raise
        except Exception as e:
            print(f"[SCHEDULER] ✗ Lỗi: {e}")
        finally:
            _current_session["running"] = False
            print(f"[SCHEDULER] ✓ Hoàn tất {mode_str}")

async def scheduler_loop():
    """Loop chính"""
    global _current_task
    
    print(f"[SCHEDULER] Khởi động — interval={CRAWL_INTERVAL_MINUTES} phút")
    
    # Chạy ngay lần đầu
    _current_task = asyncio.create_task(_run_one_session(triggered_by="scheduler:startup", quick_mode=False))
    await _current_task

    while not _shutdown_event.is_set():
        try:
            # Ưu tiên: Fast Search
            if _fast_search_event.is_set():
                _fast_search_event.clear()
                query = _current_session.get("query", "")
                
                # Chạy fast search
                _current_task = asyncio.create_task(
                    _run_one_session(query=query, triggered_by="fast_search", quick_mode=True)
                )
                await _current_task
                
                # Sau fast search, chạy deep ngay
                print(f"[SCHEDULER] === CHUYỂN SANG DEEP CRAWL ===")
                _current_task = asyncio.create_task(
                    _run_one_session(query=query, triggered_by="fast_search:deep", quick_mode=False)
                )
                await _current_task
                continue

            # Chờ interval
            print(f"[SCHEDULER] ⏳ Chờ {CRAWL_INTERVAL_MINUTES} phút...")
            await asyncio.wait_for(_shutdown_event.wait(), timeout=CRAWL_INTERVAL_MINUTES * 60)
            
            if _shutdown_event.is_set():
                break

            # Deep crawl định kỳ
            _current_task = asyncio.create_task(
                _run_one_session(triggered_by="scheduler:interval", quick_mode=False)
            )
            await _current_task

        except asyncio.TimeoutError:
            _current_task = asyncio.create_task(
                _run_one_session(triggered_by="scheduler:interval", quick_mode=False)
            )
            await _current_task
        except asyncio.CancelledError:
            print("[SCHEDULER] Nhận tín hiệu dừng")
            break

    print("[SCHEDULER] Đã dừng hoàn toàn")

def shutdown():
    _shutdown_event.set()
    _fast_search_event.set()