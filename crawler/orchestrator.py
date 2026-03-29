import asyncio
import os
from playwright.async_api import async_playwright
from redis_service import redis_service
from db_service import db_service
from cleaner import clean_job
from crawlers.topcv import TopCVCrawler
from crawlers.careerviet import CareerVietCrawler
from crawlers.careerlink import CareerLinkCrawler

PLATFORM_NAMES = {
    "topcv":      "TopCV",
    "careerviet": "CareerViet",
    "careerlink": "CareerLink",
}

MAX_PAGES_PER_CATEGORY = int(os.getenv("MAX_PAGES_PER_CATEGORY", "20"))
MAX_JOBS_PER_SESSION   = int(os.getenv("MAX_JOBS_PER_SESSION",   "0"))
PLATFORM_TIMEOUT       = int(os.getenv("PLATFORM_TIMEOUT",       "600"))

CRAWLERS = {
    "topcv":      TopCVCrawler,
    "careerviet": CareerVietCrawler,
    "careerlink": CareerLinkCrawler,
}


async def run_crawl(query: str):
    """Khởi chạy 3 platform SONG SONG"""
    errors = []

    async def _run_platform(name: str, CrawlerClass):
        print(f"\\n{'='*60}")
        print(f"[{name.upper()}] Bắt đầu crawl...")
        print(f"{'='*60}")
        try:
            async with async_playwright() as p:
                count = await asyncio.wait_for(
                    _process_platform(p, name, CrawlerClass, query),
                    timeout=PLATFORM_TIMEOUT,
                )
            print(f"[{name.upper()}] ✅ Hoàn thành: {count} jobs")
            return count
        except asyncio.TimeoutError:
            msg = f"{name}: Timeout sau {PLATFORM_TIMEOUT}s"
            errors.append(msg)
            print(f"[{name.upper()}] ⏱️ {msg}")
            return 0
        except Exception as e:
            msg = f"{name}: {str(e)[:200]}"
            errors.append(msg)
            print(f"[{name.upper()}] ❌ Lỗi: {e}")
            return 0

    results = await asyncio.gather(
        *[_run_platform(name, cls) for name, cls in CRAWLERS.items()],
        return_exceptions=False,
    )

    total = sum(results)

    print(f"\\n{'='*60}")
    print(f"[ORCHESTRATOR] Tổng jobs: {total}")
    if errors:
        print(f"[ORCHESTRATOR] Platform lỗi ({len(errors)}):")
        for e in errors:
            print(f"  - {e}")
    print(f"{'='*60}")

    await redis_service.publish_done(total)
    return total


async def _process_platform(p, platform: str, CrawlerClass, query: str) -> int:
    """
    Xử lý 1 platform với logic cache ĐÃ SỬA:
    - Chỉ cập nhật cache với links đã CRAWL THÀNH CÔNG
    - Links chưa crawl giữ nguyên để lần sau vẫn thấy là "mới"
    """
    count = 0
    crawler = CrawlerClass(p)
    crawled_success_in_session = []  # Track links đã crawl OK trong session này

    try:
        categories = await crawler.get_categories(query)
    except Exception as e:
        print(f"[{platform}] ❌ Lỗi get_categories: {e}")
        return 0

    print(f"[{platform}] {len(categories)} categories")

    for category in categories:
        if MAX_JOBS_PER_SESSION > 0 and count >= MAX_JOBS_PER_SESSION:
            print(f"[{platform}] Đạt giới hạn MAX_JOBS_PER_SESSION")
            break

        cat_name = category.get("name", category.get("title", "unknown"))

        try:
            # Lấy tất cả links từ web (2 trang đầu)
            current_links = await crawler.get_job_links(category, max_pages=MAX_PAGES_PER_CATEGORY)
        except Exception as e:
            print(f"[{platform}/{cat_name}] Lỗi get_job_links: {e}")
            continue

        if not current_links:
            print(f"[{platform}/{cat_name}] Không có link nào")
            continue

        print(f"[{platform}/{cat_name}] Lấy được {len(current_links)} links từ web")

        # Xác định links thực sự mới (chưa từng thấy trong cache)
        truly_new_links, _ = await redis_service.get_new_links_only(
            platform, cat_name, current_links
        )

        if not truly_new_links:
            print(f"[{platform}/{cat_name}] Không có job mới thực sự")
            continue

        print(f"[{platform}/{cat_name}] {len(truly_new_links)} job mới thực sự chưa từng thấy")

        # Giới hạn số job crawl nếu cần
        links_to_crawl = truly_new_links
        if MAX_JOBS_PER_SESSION > 0:
            remaining = MAX_JOBS_PER_SESSION - count
            if remaining <= 0:
                break
            links_to_crawl = truly_new_links[:remaining]

        print(f"[{platform}/{cat_name}] Sẽ crawl {len(links_to_crawl)}/{len(truly_new_links)} links")

        # Crawl từng link
        category_success_links = []  # Links thành công trong category này
        
        for i, link in enumerate(links_to_crawl):
            try:
                # Double check: đã crawl thành công trước đó chưa?
                if await redis_service.is_already_crawled(platform, link):
                    print(f"[{platform}] ⏩ Skip (đã crawl OK trước đó): {link[:60]}")
                    category_success_links.append(link)  # Vẫn coi như đã xử lý
                    continue

                # Crawl detail
                raw = await crawler.get_job_detail(link, cat_name)
                if not raw:
                    print(f"[{platform}] ❌ Crawl failed (no data): {link[:60]}")
                    continue  # KHÔNG thêm vào success, sẽ thử lại lần sau

                # Thêm metadata
                raw["industrySourcePlatform"] = PLATFORM_NAMES.get(platform, platform)
                raw["isNewJob"] = True
                
                cleaned = clean_job(raw)
                
                if "industrySourcePlatform" not in cleaned:
                    cleaned["industrySourcePlatform"] = PLATFORM_NAMES.get(platform, platform)
                if "isNewJob" not in cleaned:
                    cleaned["isNewJob"] = True
                if "skills" not in cleaned:
                    cleaned["skills"] = raw.get("skills", [])

                # Validate company
                company = raw.get("company", {})
                company_name = (company.get("companyName") or "").strip().lower()
                if not company_name or company_name in ["không rõ", "unknown", "n/a"]:
                    print(f"[{platform}] [SKIP] Company không hợp lệ: {link}")
                    continue

                # Insert DB
                result = db_service.upsert_job(cleaned)
                
                # CHỈ khi insert thành công mới đánh dấu crawled và thêm vào success list
                await redis_service.mark_as_crawled(platform, link)
                category_success_links.append(link)
                crawled_success_in_session.append(link)
                
                # Publish real-time
                await redis_service.publish_job(cleaned)
                count += 1

                if (i + 1) % 5 == 0:
                    print(f"[{platform}] Progress: {count} jobs (category: {cat_name})")

            except Exception as e:
                print(f"[{platform}] Lỗi crawl {link[:60]}: {str(e)[:80]}")
                continue  # KHÔNG thêm vào success, sẽ thử lại lần sau

        # === FIX CHÍNH: Cập nhật cache ===
        # Lấy cache cũ
        old_cached = await redis_service.get_link_list(platform, cat_name) or []
        
        # Tạo cache mới: giữ links cũ + thêm links vừa crawl THÀNH CÔNG
        # Links thất bại KHÔNG được thêm vào cache → lần sau vẫn thấy là "mới"
        new_cache = list(set(old_cached + category_success_links))
        
        try:
            await redis_service.set_link_list(platform, cat_name, new_cache)
            print(f"[{platform}/{cat_name}] ✅ Cache updated: {len(old_cached)} old + {len(category_success_links)} new success = {len(new_cache)} total")
            print(f"[{platform}/{cat_name}]    Links chưa crawl: {len(truly_new_links) - len(category_success_links)} (sẽ thử lại lần sau)")
        except Exception as e:
            print(f"[{platform}] Lỗi cập nhật cache: {e}")

    print(f"[{platform}] Tổng số job đã crawl thành công: {count}")
    print(f"[{platform}] Tổng links đã thêm vào cache: {len(crawled_success_in_session)}")
    return count
