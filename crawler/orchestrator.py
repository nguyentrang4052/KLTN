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


# async def run_crawl(query: str):
#     """Khởi chạy 3 platform SONG SONG"""
#     errors = []

#     async def _run_platform(name: str, CrawlerClass):
#         print(f"\\n{'='*60}")
#         print(f"[{name.upper()}] Bắt đầu crawl...")
#         print(f"{'='*60}")
#         try:
#             async with async_playwright() as p:
#                 count = await asyncio.wait_for(
#                     _process_platform(p, name, CrawlerClass, query),
#                     timeout=PLATFORM_TIMEOUT,
#                 )
#             print(f"[{name.upper()}] ✅ Hoàn thành: {count} jobs")
#             return count
#         except asyncio.TimeoutError:
#             msg = f"{name}: Timeout sau {PLATFORM_TIMEOUT}s"
#             errors.append(msg)
#             print(f"[{name.upper()}] ⏱️ {msg}")
#             return 0
#         except Exception as e:
#             msg = f"{name}: {str(e)[:200]}"
#             errors.append(msg)
#             print(f"[{name.upper()}] ❌ Lỗi: {e}")
#             return 0

#     results = await asyncio.gather(
#         *[_run_platform(name, cls) for name, cls in CRAWLERS.items()],
#         return_exceptions=False,
#     )

#     total = sum(results)

#     print(f"\\n{'='*60}")
#     print(f"[ORCHESTRATOR] Tổng jobs: {total}")
#     if errors:
#         print(f"[ORCHESTRATOR] Platform lỗi ({len(errors)}):")
#         for e in errors:
#             print(f"  - {e}")
#     print(f"{'='*60}")

#     await redis_service.publish_done(total)
#     return total


# async def _process_platform(p, platform: str, CrawlerClass, query: str) -> int:
#     """
#     Xử lý 1 platform với logic cache ĐÃ SỬA:
#     - Chỉ cập nhật cache với links đã CRAWL THÀNH CÔNG
#     - Links chưa crawl giữ nguyên để lần sau vẫn thấy là "mới"
#     """
#     count = 0
#     crawler = CrawlerClass(p)
#     crawled_success_in_session = []  # Track links đã crawl OK trong session này

#     try:
#         categories = await crawler.get_categories(query)
#     except Exception as e:
#         print(f"[{platform}] ❌ Lỗi get_categories: {e}")
#         return 0

#     print(f"[{platform}] {len(categories)} categories")
#     for category in categories:
#         if MAX_JOBS_PER_SESSION > 0 and count >= MAX_JOBS_PER_SESSION:
#             print(f"[{platform}] Đạt giới hạn MAX_JOBS_PER_SESSION")
#             break

#         cat_name = category.get("name", category.get("title", "unknown"))

#         try:
#             # Lấy tất cả links từ web (2 trang đầu)
#             current_links = await crawler.get_job_links(category, max_pages=MAX_PAGES_PER_CATEGORY)
#         except Exception as e:
#             print(f"[{platform}/{cat_name}] Lỗi get_job_links: {e}")
#             continue

#         if not current_links:
#             print(f"[{platform}/{cat_name}] Không có link nào")
#             continue

#         print(f"[{platform}/{cat_name}] Lấy được {len(current_links)} links từ web" )

#         # Xác định links thực sự mới (chưa từng thấy trong cache)
#         truly_new_links, _ = await redis_service.get_new_links_only(
#             platform, cat_name, current_links
#         )

#         if not truly_new_links:
#             print(f"[{platform}/{cat_name}] Không có job mới thực sự")
#             continue

#         print(f"[{platform}/{cat_name}] {len(truly_new_links)} job mới thực sự chưa từng thấy")

#         # Giới hạn số job crawl nếu cần
#         links_to_crawl = truly_new_links
#         if MAX_JOBS_PER_SESSION > 0:
#             remaining = MAX_JOBS_PER_SESSION - count
#             if remaining <= 0:
#                 break
#             links_to_crawl = truly_new_links[:remaining]

#         print(f"[{platform}/{cat_name}] Sẽ crawl {len(links_to_crawl)}/{len(truly_new_links)} links")

#         # Crawl từng link
#         category_success_links = []  # Links thành công trong category này
        
#         for i, link in enumerate(links_to_crawl):
#             try:
#                 # Double check: đã crawl thành công trước đó chưa?
#                 if await redis_service.is_already_crawled(platform, link):
#                     print(f"[{platform}] ⏩ Skip (đã crawl OK trước đó): {link}")
#                     category_success_links.append(link)  # Vẫn coi như đã xử lý
#                     continue

#                 # Crawl detail
#                 raw = await crawler.get_job_detail(link, cat_name)
#                 print(
#                     f"[{platform}] Crawled: {link} - {'OK' if raw else 'NO DATA'}")
#                 if not raw:
#                     print(f"[{platform}] ❌ Crawl failed (no data): {link}")
#                     continue  # KHÔNG thêm vào success, sẽ thử lại lần sau

#                 # ── THÊM MỚI: kiểm tra trùng nội dung ──────────────────────
#                 is_dup, original_link = await redis_service.check_and_store_fingerprint(raw, link)
#                 if is_dup:
#                     print(f"[{platform}] ♻️  Trùng nội dung với: {(original_link or '')}")
#                     print(f"[{platform}]    Bỏ qua: {link}")
#                     # Vẫn đánh dấu link này là đã "xử lý" để không crawl lại
#                     await redis_service.mark_as_crawled(platform, link)
#                     category_success_links.append(link)
#                     continue

#                 # Thêm metadata
#                 raw["industrySourcePlatform"] = PLATFORM_NAMES.get(platform, platform)
#                 raw["isNewJob"] = True
                
#                 cleaned = clean_job(raw)
                
#                 if "industrySourcePlatform" not in cleaned:
#                     cleaned["industrySourcePlatform"] = PLATFORM_NAMES.get(platform, platform)
#                 if "isNewJob" not in cleaned:
#                     cleaned["isNewJob"] = True
#                 if "skills" not in cleaned:
#                     cleaned["skills"] = raw.get("skills", [])

#                 # Validate company
#                 company = raw.get("company", {})
#                 company_name = (company.get("companyName") or "").strip().lower()
#                 if not company_name or company_name in ["không rõ", "unknown", "n/a"]:
#                     print(f"[{platform}] [SKIP] Company không hợp lệ: {link}")
#                     continue

#                 # Insert DB
#                 result = db_service.upsert_job(cleaned)
                
#                 # CHỈ khi insert thành công mới đánh dấu crawled và thêm vào success list
#                 await redis_service.mark_as_crawled(platform, link)
#                 category_success_links.append(link)
#                 crawled_success_in_session.append(link)
                
#                 # Publish real-time
#                 await redis_service.publish_job(cleaned)
#                 count += 1

#                 if (i + 1) % 5 == 0:
#                     print(f"[{platform}] Progress: {count} jobs (category: {cat_name})")

#             except Exception as e:
#                 print(f"[{platform}] Lỗi crawl {link[:60]}: {str(e)}")
#                 continue  # KHÔNG thêm vào success, sẽ thử lại lần sau

#         # === FIX CHÍNH: Cập nhật cache ===
#         # Lấy cache cũ
#         old_cached = await redis_service.get_link_list(platform, cat_name) or []
        
#         # Tạo cache mới: giữ links cũ + thêm links vừa crawl THÀNH CÔNG
#         # Links thất bại KHÔNG được thêm vào cache → lần sau vẫn thấy là "mới"
#         new_cache = list(set(old_cached + category_success_links))
        
#         try:
#             await redis_service.set_link_list(platform, cat_name, new_cache)
#             print(f"[{platform}/{cat_name}] ✅ Cache updated: {len(old_cached)} old + {len(category_success_links)} new success = {len(new_cache)} total")
#             print(f"[{platform}/{cat_name}]    Links chưa crawl: {len(truly_new_links) - len(category_success_links)} (sẽ thử lại lần sau)")
#         except Exception as e:
#             print(f"[{platform}] Lỗi cập nhật cache: {e}")

#     print(f"[{platform}] Tổng số job đã crawl thành công: {count}")
#     print(f"[{platform}] Tổng links đã thêm vào cache: {len(crawled_success_in_session)}")
#     return count





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

# SỬA Ở ĐÂY: Thêm tham số quick_mode vào signature
# async def _process_platform(p, platform: str, CrawlerClass, query: str, max_pages: int, quick_mode: bool) -> int:
#     """Xử lý 1 platform theo kiểu stream với log chi tiết"""
#     count = 0
#     crawler = CrawlerClass(p)
    
#     try:
#         categories = await crawler.get_categories(query)
#     except Exception as e:
#         print(f"[{platform}] ❌ Lỗi get_categories: {e}")
#         return 0

#     print(f"[{platform}] {len(categories)} categories | Stream mode | Max {max_pages if max_pages > 0 else '∞'} pages/cate")
    
#     for category in categories:
#         if not quick_mode and MAX_JOBS_PER_SESSION > 0 and count >= MAX_JOBS_PER_SESSION:
#             print(f"[{platform}] Đạt giới hạn MAX_JOBS_PER_SESSION ({MAX_JOBS_PER_SESSION})")
#             break

#         cat_name = category.get("name", category.get("title", "unknown"))
#         cat_url = category.get("url", "N/A")
#         print(f"\n{'='*60}")
#         print(f"[{platform}/{cat_name}] Bắt đầu stream crawl...")
#         print(f"[{platform}/{cat_name}] URL gốc: {cat_url}")
        
#         page_num = 1
#         category_total_new = 0
#         category_total_skip = 0
        
#         while True:
#             # Check giới hạn max_pages
#             if max_pages > 0 and page_num > max_pages:
#                 print(f"[{platform}/{cat_name}] Đạt max_pages={max_pages}, dừng category")
#                 break
            
#             # Check giới hạn job (deep mode)
#             if not quick_mode and MAX_JOBS_PER_SESSION > 0 and count >= MAX_JOBS_PER_SESSION:
#                 break
            
#             # ===== 1. LẤY LINKS TỪ PAGE =====
#             try:
#                 links, has_next = await crawler.get_job_links_for_page(category, page_num)
#             except Exception as e:
#                 print(f"[{platform}/{cat_name}] ❌ Lỗi lấy links page {page_num}: {e}")
#                 break
            
#             if not links:
#                 print(f"[{platform}/{cat_name}] Page {page_num}: Không có links, kết thúc category")
#                 break
            
#             print(f"\n[{platform}/{cat_name}] 📄 PAGE {page_num}: {len(links)} links từ web")
            
#             # ===== 2. PHÂN LOẠI LINKS =====
#             # Kiểm tra links đã crawl (Redis crawled_links)
#             already_crawled = []
#             truly_new_links = []
            
#             for link in links:
#                 if await redis_service.is_already_crawled(platform, link):
#                     already_crawled.append(link)
#                 else:
#                     truly_new_links.append(link)
            
#             category_total_skip += len(already_crawled)
            
#             # Log phân loại
#             if already_crawled:
#                 print(f"[{platform}/{cat_name}]   ⏩ Đã crawl trước đó: {len(already_crawled)} links (skip)")
#                 # Log 2 ví dụ đầu để debug
#                 # for i, link in enumerate(already_crawled):
#                 #     print(f"[{platform}/{cat_name}]      - {link}...")
            
#             if truly_new_links:
#                 print(f"[{platform}/{cat_name}]   🆕 Mới cần crawl: {len(truly_new_links)} links")
#             else:
#                 print(f"[{platform}/{cat_name}]   ✅ Không có job mới ở page này")
#                 # Nếu 3 page liên tiếp không có link mới thì dừng (tránh loop)
#                 if page_num >= 3:
#                     print(f"[{platform}/{cat_name}]   🛑 Dừng vì không có job mới ở nhiều page liên tiếp")
#                 if not has_next:
#                     break
#                 page_num += 1
#                 await asyncio.sleep(0.5)
#                 continue
            
#             # ===== 3. CRAWL CHI TIẾT TỪNG LINK MỚI =====
#             page_success_count = 0
            
#             for idx, link in enumerate(truly_new_links, 1):
#                 # Double check (tránh race condition)
#                 if await redis_service.is_already_crawled(platform, link):
#                     print(f"[{platform}/{cat_name}]   ⚠️ Link {idx}/{len(truly_new_links)} vừa được crawl bởi tiến trình khác, skip")
#                     continue
                
#                 try:
#                     print(f"[{platform}/{cat_name}]   🔍 Crawling {idx}/{len(truly_new_links)}: {link}")
                    
#                     raw = await crawler.get_job_detail(link, cat_name)
#                     if not raw:
#                         print(f"[{platform}/{cat_name}]   ❌ Không lấy được data")
#                         continue

#                     # Check duplicate nội dung
#                     is_dup, original = await redis_service.check_and_store_fingerprint(raw, link)
#                     if is_dup:
#                         print(f"[{platform}/{cat_name}]   ♻️ Trùng nội dung với: {original if original else 'N/A'}...")
#                         await redis_service.mark_as_crawled(platform, link)
#                         continue

#                     # Process data
#                     raw["industrySourcePlatform"] = PLATFORM_NAMES.get(platform, platform)
#                     raw["isNewJob"] = True
#                     cleaned = clean_job(raw)
                    
#                     if "skills" not in cleaned:
#                         cleaned["skills"] = raw.get("skills", [])

#                     # Validate company
#                     company = raw.get("company", {})
#                     company_name = (company.get("companyName") or "").strip().lower()
#                     if not company_name or company_name in ["không rõ", "unknown", "n/a"]:
#                         print(f"[{platform}/{cat_name}]   ❌ Company không hợp lệ")
#                         continue

#                     # Insert DB
#                     result = db_service.upsert_job(cleaned)
                    
#                     if result:
#                         await redis_service.mark_as_crawled(platform, link)
#                         page_success_count += 1
#                         category_total_new += 1
                        
#                         # Publish real-time
#                         await redis_service.publish_job(cleaned)
                        
#                         job_title = cleaned.get('job', {}).get('title', 'N/A')
#                         print(f"[{platform}/{cat_name}]   ✓ SUCCESS: {job_title}...")
                        
#                         # Tăng global count
#                         count += 1
                        
#                         # Check giới hạn sau mỗi job thành công
#                         if not quick_mode and MAX_JOBS_PER_SESSION > 0 and count >= MAX_JOBS_PER_SESSION:
#                             print(f"[{platform}/{cat_name}]   ⚠️ Đạt giới hạn MAX_JOBS_PER_SESSION")
#                             break
#                     else:
#                         print(f"[{platform}/{cat_name}]   ❌ Insert DB thất bại")

#                 except Exception as e:
#                     print(f"[{platform}/{cat_name}]   ❌ Lỗi crawl: {str(e)}")
#                     continue
            
#             # ===== 4. SUMMARY PAGE =====
#             print(f"[{platform}/{cat_name}] 📊 Page {page_num} summary: {page_success_count} jobs mới, skip {len(already_crawled)} đã crawl")
            
#             # Update cache (chỉ links thành công mới vào cache)
#             if page_success_count > 0:
#                 all_success_links = await redis_service.get_link_list(platform, cat_name) or []
#                 # Thêm links vừa crawl thành công
#                 newly_crawled = truly_new_links[:page_success_count]  # Giả định crawl theo thứ tự
#                 new_cache = list(set(all_success_links + newly_crawled))
#                 await redis_service.set_link_list(platform, cat_name, new_cache)
            
#             # ===== 5. CHECK NEXT PAGE =====
#             if not has_next:
#                 print(f"[{platform}/{cat_name}] 🏁 Hết pages (has_next=False)")
#                 break
            
#             page_num += 1
#             await asyncio.sleep(0.5)
        
#         # Summary category
#         print(f"[{platform}/{cat_name}] 🎯 CATEGORY SUMMARY: {category_total_new} jobs mới, {category_total_skip} đã crawl trước đó")
#         print(f"{'='*60}")
    
#     return count


# async def _process_platform(p, platform: str, CrawlerClass, query: str, max_pages: int, quick_mode: bool) -> int:
#     count = 0
#     crawler = CrawlerClass(p)
    
#     # ===== QUAN TRỌNG: Nếu có query, search trực tiếp, không lặp category =====
#     if query and query.strip():
#         print(f"\n[{platform}] 🔍 SEARCH MODE: '{query}'")
#         return await _search_by_keyword_stream(crawler, platform, query, max_pages)
    
#     # ===== Nếu không có query, fallback về category mode cũ =====
#     return await _process_by_category(crawler, platform, query, max_pages, quick_mode)


# async def _search_by_keyword_stream(crawler, platform: str, keyword: str, max_pages: int) -> int:
#     """Search trực tiếp keyword"""
#     count = 0
    
#     print(f"[{platform}] 🔍 BẮT ĐẦU SEARCH BY KEYWORD: '{keyword}'")
#     print(f"[{platform}] Gọi crawler.search_by_keyword()...")
    
#     # Kiểm tra crawler có method search_by_keyword không
#     if not hasattr(crawler, 'search_by_keyword'):
#         print(f"[{platform}] ❌ crawler không có method search_by_keyword!")
#         return 0
    
#     # Chỉ lấy page 1
#     links, has_next = await crawler.search_by_keyword(keyword, page=1)
    
#     print(f"[{platform}] Kết quả search: {len(links)} links, has_next={has_next}")
    
#     if not links:
#         print(f"[{platform}] ⚠️ Không tìm thấy job nào")
#         return 0
    
#     # Crawl chi tiết...
#     for idx, link in enumerate(links[:15], 1):  # Giới hạn 15 job cho nhanh
#         try:
#             # CareerLink trả về pair "job_url|company_url"
#             if "|" in link:
#                 job_url, company_url = link.split("|")
#             else:
#                 job_url, company_url = link, ""
            
#             if await redis_service.is_already_crawled(platform, job_url):
#                 continue
            
#             print(f"[{platform}] 🔍 Crawling {idx}/{min(len(links), 15)}: {job_url[:50]}...")
            
#             # Gọi get_job_detail với URL job
#             raw = await crawler.get_job_detail(link, keyword)  # link = "job|company" cho CareerLink
#             if not raw:
#                 continue
            
#             # Check dup
#             is_dup, _ = await redis_service.check_and_store_fingerprint(raw, link)
#             if is_dup:
#                 await redis_service.mark_as_crawled(platform, link)
#                 continue
            
#             # Process
#             raw["industrySourcePlatform"] = PLATFORM_NAMES.get(platform, platform)
#             raw["isNewJob"] = True
#             cleaned = clean_job(raw)
            
#             if "skills" not in cleaned:
#                 cleaned["skills"] = raw.get("skills", [])

#             company = raw.get("company", {})
#             company_name = (company.get("companyName") or "").strip().lower()
#             if not company_name or company_name in ["không rõ", "unknown", "n/a"]:
#                 continue

#             result = db_service.upsert_job(cleaned)
            
#             # if result:
#             #     await redis_service.mark_as_crawled(platform, job_url)
#             #     await redis_service.publish_job(cleaned)
#             #     count += 1
#             #     print(f"[{platform}] ✅ SUCCESS: {cleaned.get('job', {}).get('title', 'N/A')}")



#             if result and result.get("jobID"):
#                 # Thêm jobID vào cleaned để publish
#                 cleaned["jobID"] = result["jobID"]
#                 cleaned["isNewJob"] = result.get("isNewJob", True)
                
#                 await redis_service.publish_job(cleaned)
#                 count += 1
#                 print(f"[{platform}] ✅ SUCCESS: jobID={result['jobID']}, {cleaned.get('job', {}).get('title', 'N/A')}")
                            
#         except Exception as e:
#             print(f"[{platform}] ❌ Lỗi: {e}")
#             continue
    
#     print(f"[{platform}] ✅ HOÀN THÀNH SEARCH: {count} jobs")
#     await redis_service.publish_job({
#         "__fast_done__": True,  # Signal đặc biệt cho frontend
#         "platform": platform,
#         "count": count,
#         "keyword": keyword
#     })
    
#     return count



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