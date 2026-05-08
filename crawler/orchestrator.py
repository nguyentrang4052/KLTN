import asyncio
import os
from playwright.async_api import async_playwright
from redis_service import redis_service
from db_service import db_service
from cleaner import clean_job
from crawlers.topcv import TopCVCrawler
from crawlers.careerviet import CareerVietCrawler
from crawlers.careerlink import CareerLinkCrawler
import requests


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

#===========================STREAM===================

async def run_crawl(query: str, quick_mode: bool = False):
    """Chạy crawl với 2 chế độ: quick (2 pages) hoặc full (20 pages)"""
    errors = []
    
    # Quyết định số trang dựa trên mode
    max_pages = 2 if quick_mode else MAX_PAGES_PER_CATEGORY
    
    async def _run_platform(name: str, CrawlerClass):
        print(f"\n{'='*60}")
        mode_str = "🚀 FAST" if quick_mode else "🔍 DEEP"
        print(f"[{mode_str}] [{name.upper()}] Bắt đầu crawl...")
        print(f"{'='*60}")
        
        try:
            async with async_playwright() as p:
                count = await asyncio.wait_for(
                    _process_platform(p, name, CrawlerClass, query, max_pages=max_pages, quick_mode=quick_mode),
                    timeout=PLATFORM_TIMEOUT,
                )
            print(f"[{name.upper()}] ✅ Hoàn thành {mode_str}: {count} jobs")
            notify_new_jobs(count)
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
    mode_str = "FAST" if quick_mode else "DEEP"
    
    print(f"\n{'='*60}")
    print(f"[ORCHESTRATOR] [{mode_str}] Tổng jobs: {total}")
    if errors:
        print(f"[ORCHESTRATOR] Platform lỗi ({len(errors)}):")
        for e in errors:
            print(f"  - {e}")
    print(f"{'='*60}")

    # Chỉ publish done khi là deep crawl (kết thúc hoàn toàn)
    if not quick_mode:
        await redis_service.publish_done(total)
    
    return total

# Trong orchestrator.py - sửa _process_platform để kiểm tra query trước khi chạy category

async def _process_platform(p, platform: str, CrawlerClass, query: str, max_pages: int, quick_mode: bool) -> int:
    count = 0
    crawler = CrawlerClass(p)
    
    # ===== QUAN TRỌNG: Nếu có query, search trực tiếp, không lặp category =====
    if query and query.strip():
        print(f"\n[{platform}] 🔍 SEARCH MODE: '{query}'")
        return await _search_by_keyword_stream(crawler, platform, query, max_pages)
    
    # ===== Nếu không có query, fallback về category mode cũ =====
    if not quick_mode:  # Chỉ crawl category khi không phải quick mode hoặc không có query
        return await _process_by_category(crawler, platform, query, max_pages, quick_mode)
    
    return 0

async def _search_by_keyword_stream(crawler, platform: str, keyword: str, max_pages: int) -> int:
    """Search trực tiếp keyword - FAST MODE"""
    count = 0
    
    print(f"\n[{platform}] 🚀 === BẮT ĐẦU FAST SEARCH ===")
    print(f"[{platform}] 🔍 Keyword: '{keyword}'")
    
    # Kiểm tra crawler có method search_by_keyword không
    if not hasattr(crawler, 'search_by_keyword'):
        print(f"[{platform}] ❌ crawler không có method search_by_keyword!")
        return 0
    
    # Chỉ lấy page 1
    links, has_next = await crawler.search_by_keyword(keyword, page=1)
    
    print(f"[{platform}] 📊 Kết quả: {len(links)} links, has_next={has_next}")
    
    # ✅ LOG TẤT CẢ LINKS TÌM ĐƯỢC
    print(f"[{platform}] 🔗 Links chứa keyword '{keyword}':")

    for i, link in enumerate(links[:20], 1):  # Log tối đa 20 link
        # Tách job_url nếu là format "job|company" (CareerLink)
        display_link = link.split("|")[0] if "|" in link else link
        # Kiểm tra link có chứa keyword không (case insensitive)
        keyword_in_link = keyword.replace(' ', '-') in display_link
        match_icon = "✅" if keyword_in_link else "⚠️"
        print(f"[{platform}]   {match_icon} {i}. {display_link[:80]}")
    
    if len(links) > 20:
        print(f"[{platform}]   ... và {len(links) - 20} links khác")
    
    if not links:
        print(f"[{platform}] ⚠️ Không tìm thấy job nào cho keyword '{keyword}'")
        return 0
    
    # Crawl chi tiết...
    for idx, link in enumerate(links[:15], 1):
        try:
            # CareerLink trả về pair "job_url|company_url"
            if "|" in link:
                job_url, company_url = link.split("|")
            else:
                job_url, company_url = link, ""
            
            # ✅ LOG LINK ĐANG CRAWL
            print(f"\n[{platform}] 🔍 [{idx}/{min(len(links), 15)}] Crawling: {job_url}")
            print(f"[{platform}]    📍 Company URL: {company_url or 'N/A'}")
            
            if await redis_service.is_already_crawled(platform, job_url):
                print(f"[{platform}]    ⏩ Đã crawl trước đó, skip")
                continue
            
            # Gọi get_job_detail
            raw = await crawler.get_job_detail(link, keyword)
            
            if not raw:
                print(f"[{platform}]    ❌ Không lấy được data")
                continue
            
            # Check dup
            is_dup, original = await redis_service.check_and_store_fingerprint(raw, link)
            if is_dup:
                print(f"[{platform}]    ♻️ Trùng nội dung với: {original or 'N/A'}")
                await redis_service.mark_as_crawled(platform, link)
                continue
            
            # Log job info tìm được
            job_title = raw.get('job', {}).get('title', 'N/A')
            company_name = raw.get('company', {}).get('companyName', 'N/A')
            print(f"[{platform}]    📋 Title: {job_title}")
            print(f"[{platform}]    🏢 Company: {company_name}")
            
            # Process
            raw["industrySourcePlatform"] = PLATFORM_NAMES.get(platform, platform)
            raw["isNewJob"] = True
            cleaned = clean_job(raw)
            
            if "skills" not in cleaned:
                cleaned["skills"] = raw.get("skills", [])

            

                        # Sau khi clean_job
            print(f"[CareerViet] DEBUG cleaned keys: {cleaned.keys()}")
            print(f"[CareerViet] DEBUG cleaned.job: {cleaned.get('job', {}).get('title')}")
            print(f"[CareerViet] DEBUG cleaned.company: {cleaned.get('company', {}).get('companyName')}")
            print(f"[CareerViet] DEBUG isNewJob: {cleaned.get('isNewJob')}")
            print(f"[CareerViet] DEBUG industrySourcePlatform: {cleaned.get('industrySourcePlatform')}")

            company = raw.get("company", {})
            comp_name_clean = (company.get("companyName") or "").strip().lower()
            if not comp_name_clean or comp_name_clean in ["không rõ", "unknown", "n/a"]:
                print(f"[{platform}]    ❌ Company không hợp lệ, skip")
                continue

            result = db_service.upsert_job(cleaned)
            
            if result and result.get("jobID"):
                # Thêm jobID vào cleaned để publish
                cleaned["jobID"] = result["jobID"]
                cleaned["isNewJob"] = result.get("isNewJob", True)
                
                await redis_service.publish_job(cleaned)
                count += 1
                print(f"[{platform}]    ✅ SUCCESS: jobID={result['jobID']}")
            else:
                print(f"[{platform}]    ❌ Insert DB thất bại")
                            
        except Exception as e:
            print(f"[{platform}]    ❌ Lỗi: {str(e)[:100]}")
            continue
    
    # ✅ LOG KẾT THÚC
    print(f"\n[{platform}] ✅ === HOÀN THÀNH FAST SEARCH ===")
    print(f"[{platform}]    Tổng: {count}/{min(len(links), 15)} jobs thành công")
    print(f"[{platform}]    Keyword: '{keyword}'")
    
    # Publish signal fast done
    await redis_service.publish_job({
        "__fast_done__": True,
        "platform": platform,
        "count": count,
        "keyword": keyword
    })
    
    return count


async def _process_by_category(crawler, platform: str, query: str, max_pages: int, quick_mode: bool) -> int:
    """Mode cũ: Duyệt tất cả categories (khi không có keyword)"""
    count = 0
    
    try:
        categories = await crawler.get_categories(query)
    except Exception as e:
        print(f"[{platform}] ❌ Lỗi get_categories: {e}")
        return 0


    print(f"[{platform}] {len(categories)} categories | Max {max_pages} pages/cate")
    for category in categories:
        if not quick_mode and MAX_JOBS_PER_SESSION > 0 and count >= MAX_JOBS_PER_SESSION:
            print(f"[{platform}] Đạt giới hạn MAX_JOBS_PER_SESSION")
            break

        cat_name = category.get("name", category.get("title", "unknown"))
        cat_url = category.get("url", "N/A")
        print(f"\n[{platform}/{cat_name}] Bắt đầu stream crawl...")
        print(f"[{platform}/{cat_name}] URL: {cat_url}")

        
        page_num = 1
        category_success_links = []
        total_pages_processed = 0
        
        while True:
            if max_pages > 0 and page_num > max_pages:
                break
                
            try:
                links, has_next = await crawler.get_job_links_for_page(category, page_num)
                total_pages_processed += 1

                
                if not links:
                    print(f"[{platform}/{cat_name}] Page {page_num}: Không có links")
                    break
                
                print(f"[{platform}/{cat_name}] Page {page_num}: {len(links)} links")

                # Kiểm tra links mới
                truly_new_links = []
                for link in links:
                    if not await redis_service.is_already_crawled(platform, link):
                        truly_new_links.append(link)
                
                print(f"[{platform}/{cat_name}] Links mới: {len(truly_new_links)}/{len(links)}")
                
                if truly_new_links:
                    # Crawl chi tiết từng link
                    for link in truly_new_links:
                        if not quick_mode and MAX_JOBS_PER_SESSION > 0 and count >= MAX_JOBS_PER_SESSION:
                            break

                        try:
                            raw = await crawler.get_job_detail(link, cat_name)
                            if not raw:
                                continue

                            is_dup, _ = await redis_service.check_and_store_fingerprint(raw, link)
                            if is_dup:
                                await redis_service.mark_as_crawled(platform, link)
                                category_success_links.append(link)
                                continue

                            raw["industrySourcePlatform"] = PLATFORM_NAMES.get(platform, platform)
                            raw["isNewJob"] = True
                            cleaned = clean_job(raw)
                            
                            if "skills" not in cleaned:
                                cleaned["skills"] = raw.get("skills", [])

                            company = raw.get("company", {})
                            company_name = (company.get("companyName") or "").strip().lower()
                            if not company_name or company_name in ["không rõ", "unknown", "n/a"]:
                                continue

                            result = db_service.upsert_job(cleaned)
                            if result and result.get("jobID"):
                                # Thêm jobID vào cleaned để publish
                                cleaned["jobID"] = result["jobID"]
                                cleaned["isNewJob"] = result.get("isNewJob", True)
                                
                                await redis_service.mark_as_crawled(platform, link)
                                category_success_links.append(link)
                                await redis_service.publish_job(cleaned)
                                count += 1
                                print(f"[{platform}] ✅ SUCCESS: jobID={result['jobID']}, {cleaned.get('job', {}).get('title', 'N/A')}")

                        except Exception as e:
                            print(f"[{platform}] ❌ Lỗi crawl: {link} - {e}")
                            continue
                
                # Update cache
                if category_success_links:
                    old_cached = await redis_service.get_link_list(platform, cat_name) or []
                    new_cache = list(set(old_cached + category_success_links))
                    await redis_service.set_link_list(platform, cat_name, new_cache)

                if not has_next:
                    break
                    
                page_num += 1
                await asyncio.sleep(0.5)

            except Exception as e:
                print(f"[{platform}/{cat_name}] ❌ Lỗi page {page_num}: {e}")
                break

        print(f"[{platform}/{cat_name}] Hoàn thành: {count} jobs ({total_pages_processed} pages)")
    
    return count

async def trigger_fast_search(keyword: str):
    """Crawl FAST mode cho query search"""
    from crawler_services import run_crawl
    await run_crawl(query=keyword, quick_mode=True)


def notify_new_jobs(count: int):
    if count <= 0:
        return
    try:
        requests.post(
            "http://localhost:3000/api/jobs/internal/broadcast-new-jobs",
            json={"count": count, "secret": os.getenv("INTERNAL_SECRET", "")},
            timeout=3,
        )
        print(f"[ORCHESTRATOR] 📡 Notified backend: {count} new jobs")
    except Exception as e:
        print(f"[ORCHESTRATOR] ⚠️ Notify failed: {e}")