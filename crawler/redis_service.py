import json
import hashlib
import redis.asyncio as aioredis
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# TTL (Time To Live)
TTL_LINK_LIST   = 3_600 * 3     # 3 giờ - danh sách link để detect mới
TTL_CRAWLED_SET = 86_400 * 7    # 7 ngày - link đã crawl thành công
TTL_CONTENT_HASH = 86_400 * 7   # 7 ngày - hash nội dung job


class RedisService:
    def __init__(self):
        self.client: aioredis.Redis | None = None

    async def connect(self):
        self.client = await aioredis.from_url(REDIS_URL, decode_responses=True)

    async def disconnect(self):
        if self.client:
            await self.client.aclose()

    # ─────────────────────────────────────────────
    # NHÓM 1: Cache danh sách link (detect job mới)
    # ─────────────────────────────────────────────
    def _link_list_key(self, platform: str, category: str) -> str:
        return f"link_list:{platform}:{category}"

    async def get_link_list(self, platform: str, category: str) -> list[str] | None:
        """Lấy danh sách link đã thấy lần trước. None nếu chưa có."""
        raw = await self.client.get(self._link_list_key(platform, category))
        return json.loads(raw) if raw else None

    async def set_link_list(self, platform: str, category: str, links: list[str]):
        """Lưu danh sách link đã thấy (KHÔNG có nghĩa là đã crawl xong)."""
        await self.client.setex(
            self._link_list_key(platform, category),
            TTL_LINK_LIST,
            json.dumps(links)
        )

    async def get_new_links_only(
        self, 
        platform: str, 
        category: str, 
        current_links: list[str]
    ) -> tuple[list[str], list[str]]:
        """
        Trả về tuple: (truly_new_links, all_links_for_cache)
        - truly_new_links: links chưa từng thấy trong cache (isNewJob=True)
        - all_links_for_cache: tất cả links để cập nhật cache
        """
        cached = await self.get_link_list(platform, category)
        if cached is None:
            # Lần đầu crawl category này → tất cả đều là mới
            return current_links, current_links
        
        cached_set = set(cached)
        current_set = set(current_links)
        
        # Links thực sự mới (chưa từng thấy trong cache)
        truly_new = list(current_set - cached_set)
        # Tất cả links để cập nhật cache (merge cũ + mới)
        all_links = list(cached_set | current_set)
        
        return truly_new, all_links

    # ─────────────────────────────────────────────
    # NHÓM 2: Set các link đÃ CRAWL THÀNH CÔNG
    # CHỈ lưu khi đã insert DB thành công
    # ─────────────────────────────────────────────
    def _crawled_set_key(self, platform: str) -> str:
        return f"crawled_links:{platform}"

    async def is_already_crawled(self, platform: str, source_link: str) -> bool:
        """Kiểm tra link đã được crawl thành công trước đó."""
        if not source_link:
            return False
        return bool(await self.client.sismember(
            self._crawled_set_key(platform), source_link
        ))

    async def mark_as_crawled(self, platform: str, source_link: str):
        """
        ĐÁNH DẤU link đã CRAWL THÀNH CÔNG.
        CHỈ gọi khi đã insert DB thành công.
        """
        if not source_link:
            return
        key = self._crawled_set_key(platform)
        await self.client.sadd(key, source_link)
        await self.client.expire(key, TTL_CRAWLED_SET)

    async def mark_many_as_crawled(self, platform: str, links: list[str]):
        """Batch version - chỉ gọi khi đã insert DB thành công."""
        if not links:
            return
        key = self._crawled_set_key(platform)
        await self.client.sadd(key, *links)
        await self.client.expire(key, TTL_CRAWLED_SET)

    # ─────────────────────────────────────────────
    # NHÓM 3: Content Hash - Chống trùng & detect thay đổi
    # ─────────────────────────────────────────────
    def _hash_key(self, source_link: str) -> str:
        link_hash = hashlib.md5(source_link.encode()).hexdigest()[:16]
        return f"job_hash:{link_hash}"

    def _compute_content_hash(self, raw_job: dict) -> str:
        """Hash các field có thể thay đổi để detect update."""
        j = raw_job.get("job", {})
        content = "|".join([
            str(j.get("title", "")),
            str(j.get("salary", "")),
            str(j.get("deadline", "")),
            str(j.get("jobType", "")),
        ])
        return hashlib.md5(content.encode("utf-8")).hexdigest()

    async def has_content_changed(self, raw_job: dict) -> bool:
        """So sánh hash hiện tại với hash lưu trong Redis."""
        source_link = raw_job.get("job", {}).get("sourceLink", "")
        if not source_link:
            return True
        new_hash = self._compute_content_hash(raw_job)
        old_hash = await self.client.get(self._hash_key(source_link))
        return new_hash != old_hash

    async def save_content_hash(self, raw_job: dict):
        """Lưu hash sau khi đã upsert vào DB thành công."""
        source_link = raw_job.get("job", {}).get("sourceLink", "")
        if not source_link:
            return
        new_hash = self._compute_content_hash(raw_job)
        await self.client.setex(
            self._hash_key(source_link),
            TTL_CONTENT_HASH,
            new_hash
        )

    # ─────────────────────────────────────────────
    # NHÓM 4: Pub/Sub - Push real-time về NestJS
    # ─────────────────────────────────────────────
    async def publish_job(self, job_data: dict):
        """Publish job đã xử lý xong."""
        await self.client.publish(
            "crawl:jobs",
            json.dumps(job_data, ensure_ascii=False, default=str)
        )

    async def publish_done(self, total: int):
        """Signal kết thúc crawl session."""
        await self.client.publish(
            "crawl:jobs",
            json.dumps({"__done__": True, "total": total})
        )


redis_service = RedisService()

