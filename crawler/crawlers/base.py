"""
base.py
─────────────────────────────────────────────────────────────
MỤC ĐÍCH: Định nghĩa interface bắt buộc cho mọi crawler.

Tại sao cần abstract base?
  Orchestrator gọi get_categories / get_job_links / get_job_detail
  mà không cần biết đang làm việc với website nào.
  Nếu sau này thêm VietnamWorks, ITviec... chỉ cần tạo class mới
  kế thừa BaseCrawler, Orchestrator không cần sửa gì.
─────────────────────────────────────────────────────────────
"""
from abc import ABC, abstractmethod


class BaseCrawler(ABC):

    @abstractmethod
    async def get_categories(self, query: str) -> list[dict]:
        """
        Trả về danh sách category/industry phù hợp với query.
        Mỗi item: {"name": str, "url": str}
        Nếu query rỗng → trả về tất cả categories.
        """
        ...

    @abstractmethod
    async def get_job_links(self, category: dict, max_pages: int = 2) -> list[str]:
        """
        Crawl tối đa max_pages trang của category,
        trả về list các URL job detail.
        Chỉ lấy URL, không crawl detail — để nhanh.
        """
        ...

    @abstractmethod
    async def get_job_detail(self, url: str, industry: str) -> dict:
        """
        Crawl chi tiết 1 job từ URL.
        Trả về raw dict với format chuẩn:
        {"industry": str, "job": {...}, "company": {...}}
        """
        ...




    



    @abstractmethod
    async def get_job_links_for_page(self, category: dict, page: int) -> tuple[list[str], bool]:
        """
        Lấy links từ 1 page cụ thể.
        Trả về: (list_links, has_next_page)
        """
        ...