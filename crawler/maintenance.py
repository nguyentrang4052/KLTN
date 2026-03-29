import os
import asyncio
from datetime import datetime, timedelta
from contextlib import contextmanager
import psycopg2
from db_service import get_db_url

# Cấu hình: Sau bao lâu thì reset isNewJob (mặc định 2 ngày)
RESET_ISNEWJOB_AFTER_HOURS = int(os.getenv("RESET_ISNEWJOB_AFTER_HOURS", "48"))


class MaintenanceService:
    """Service thực hiện các tác vụ bảo trì database định kỳ"""
    
    @contextmanager
    def _get_conn(self):
        conn = psycopg2.connect(get_db_url())
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    async def reset_old_new_jobs(self) -> int:
        """
        Reset isNewJob = false cho các job đã quá 2 ngày từ discoveredAt.
        Trả về số lượng job đã được reset.
        """
        cutoff_time = datetime.now() - timedelta(hours=RESET_ISNEWJOB_AFTER_HOURS)
        
        try:
            with self._get_conn() as conn:
                with conn.cursor() as cur:
                    # Đếm số job sẽ bị reset (để log)
                    cur.execute("""
                        SELECT COUNT(*) FROM "Job"
                        WHERE "isNewJob" = true 
                          AND "discoveredAt" < %s
                    """, (cutoff_time,))
                    
                    count_to_reset = cur.fetchone()[0]
                    
                    if count_to_reset == 0:
                        return 0
                    
                    # Thực hiện reset
                    cur.execute("""
                        UPDATE "Job"
                        SET "isNewJob" = false
                        WHERE "isNewJob" = true 
                          AND "discoveredAt" < %s
                    """, (cutoff_time,))
                    
                    print(f"[MAINTENANCE] Reset {count_to_reset} jobs từ 'new' → 'old' (>{RESET_ISNEWJOB_AFTER_HOURS}h)")
                    return count_to_reset
                    
        except Exception as e:
            print(f"[MAINTENANCE] ❌ Lỗi reset old new jobs: {e}")
            return 0

    async def cleanup_expired_tracking(self, days: int = 30) -> int:
        """
        Xóa bản ghi JobSourceTracking cũ hơn X ngày (tùy chọn).
        Giữ lại để thống kê, nhưng có thể dọn sau 30-90 ngày.
        """
        cutoff = datetime.now() - timedelta(days=days)
        
        try:
            with self._get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        DELETE FROM "JobSourceTracking"
                        WHERE "crawledAt" < %s
                    """, (cutoff,))
                    
                    deleted = cur.rowcount
                    if deleted > 0:
                        print(f"[MAINTENANCE] Đã xóa {deleted} tracking records cũ (>{days} ngày)")
                    return deleted
        except Exception as e:
            print(f"[MAINTENANCE] ❌ Lỗi cleanup tracking: {e}")
            return 0

    async def run_maintenance_cycle(self):
        """Chạy một chu kỳ bảo trì đầy đủ"""
        print(f"\\n[MAINTENANCE] Bắt đầu chu kỳ bảo trì - {datetime.now().isoformat()}")
        
        # 1. Reset isNewJob cũ
        reset_count = await self.reset_old_new_jobs()
        
        # 2. Cleanup tracking cũ (tùy chọn, mỗi 7 ngày một lần)
        if datetime.now().hour == 3:  # Chỉ chạy lúc 3h sáng
            await self.cleanup_expired_tracking(days=30)
        
        print(f"[MAINTENANCE] Hoàn tất - Reset {reset_count} jobs\\n")
        return reset_count


maintenance_service = MaintenanceService()


async def maintenance_loop():
    """
    Background task chạy định kỳ để bảo trì.
    Mặc định: Chạy mỗi 6 giờ (có thể cấu hình bằng MAINTENANCE_INTERVAL_HOURS)
    """
    interval_hours = int(os.getenv("MAINTENANCE_INTERVAL_HOURS", "6"))
    interval_seconds = interval_hours * 3600
    
    print(f"[MAINTENANCE LOOP] Khởi động - chạy mỗi {interval_hours} giờ")
    print(f"[MAINTENANCE LOOP] Auto reset isNewJob sau {RESET_ISNEWJOB_AFTER_HOURS} giờ ({RESET_ISNEWJOB_AFTER_HOURS//24} ngày)")
    
    while True:
        try:
            await asyncio.sleep(interval_seconds)
            await maintenance_service.run_maintenance_cycle()
        except asyncio.CancelledError:
            print("[MAINTENANCE LOOP] Nhận tín hiệu dừng")
            break
        except Exception as e:
            print(f"[MAINTENANCE LOOP] Lỗi: {e}")
            await asyncio.sleep(60)  # Chờ 1 phút rồi thử lại
