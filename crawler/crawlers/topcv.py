"""
crawlers/topcv.py — Async adapter từ topcv(2).py gốc.
"""
import asyncio
import random
import re
import json
import os
import time
from urllib.parse import urljoin
from playwright.async_api import Browser, TimeoutError as PlaywrightTimeout
from .base import BaseCrawler

BASE_URL = "https://www.topcv.vn"
COOKIES_FILE = "topcv_cookies.json"

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
]

CLOUDFLARE_MARKERS = [
    "Checking your browser",
    "cf-browser-verification",
    "Just a moment...",
    "Enable JavaScript and cookies to continue",
    "cf_clearance",
]

SELECTORS = {
    "job_list": "h3.title a",
    "next_page": "ul.pagination li a[rel='next']",
    "description_block": ".job-description__item",
    "description_content": ".job-description__item--content",
    "working_time": ".job-description__item--content-list",
}


class TopCVCrawler(BaseCrawler):

    def __init__(self, playwright, requests_per_minute: int = 15):
        self.playwright = playwright
        self._browser: Browser | None = None
        self.min_request_interval = 60.0 / requests_per_minute
        self._last_request_time = 0
        self._lock = asyncio.Lock()

    async def _rate_limit(self):
        async with self._lock:
            now = time.time()
            elapsed = now - self._last_request_time
            if elapsed < self.min_request_interval:
                await asyncio.sleep(self.min_request_interval - elapsed)
            self._last_request_time = time.time()

    async def _browser_(self):
        if not self._browser:
            self._browser = await self.playwright.chromium.launch(
                headless=True,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--disable-web-security",
                ]
            )
        return self._browser

    async def _new_page(self, block_resources: bool = False):
        browser = await self._browser_()
        ctx = await browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={"width": 1440, "height": 900},
            locale="vi-VN",
            timezone_id="Asia/Ho_Chi_Minh",
            extra_http_headers={"Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8"},
        )
        
        if os.path.exists(COOKIES_FILE):
            try:
                with open(COOKIES_FILE, "r", encoding="utf-8") as f:
                    await ctx.add_cookies(json.load(f))
            except:
                pass
        
        if block_resources:
            await ctx.route(
                "**/*",
                lambda route, req: (
                    route.abort()
                    if req.resource_type in ["image", "stylesheet", "font", "media"]
                    else route.continue_()
                ),
            )
        
        page = await ctx.new_page()
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'plugins', {get: () => [1,2,3,4,5]});
            window.chrome = { runtime: {} };
        """)
        return ctx, page

    async def _save_cookies(self, ctx):
        try:
            cookies = await ctx.cookies()
            with open(COOKIES_FILE, "w", encoding="utf-8") as f:
                json.dump(cookies, f, ensure_ascii=False, indent=2)
        except:
            pass

    async def _random_wait(self, min_ms=800, max_ms=2000):
        await asyncio.sleep(random.uniform(min_ms, max_ms) / 1000)

    async def _human_scroll(self, page):
        height = await page.evaluate("() => document.body.scrollHeight")
        steps = random.randint(2, 4)
        for i in range(steps):
            y = int(height * (i + 1) / steps)
            await page.evaluate(f"window.scrollTo(0, {y})")
            await asyncio.sleep(random.uniform(0.1, 0.3))

    def _clean(self, text):
        if not text:
            return ""
        return re.sub(r"\s+", " ", str(text)).strip()

    @staticmethod
    def get_upsert_conflict_fields() -> list[str]:
        """
        Trả về danh sách field dùng cho ON CONFLICT khi upsert vào DB.
        DB phải có UNIQUE constraint trên các field này.
        Chạy migration trước:
            ALTER TABLE jobs ADD CONSTRAINT jobs_sourcelink_unique UNIQUE ("sourceLink");
        """
        return ["sourceLink"]

    # =========================
    # STEP 1: CATEGORIES
    # =========================
    async def get_categories(self, query: str = "") -> list[dict]:
        ctx, page = await self._new_page()
        categories = []
        seen = set()

        try:
            await self._rate_limit()
            await page.goto(BASE_URL, wait_until="domcontentloaded", timeout=30000)

            # ✅ Đợi đúng element cần dùng
            await page.wait_for_selector(".top-category--item h3 a", state="attached", timeout=10000)


            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(500)

            # ✅ Scroll hết carousel
            while True:
                try:
                    next_btn = page.locator(".btn-next.btn-navigation")

                    if await next_btn.count() == 0:
                        break

                    class_attr = await next_btn.get_attribute("class") or ""
                    aria_disabled = await next_btn.get_attribute("aria-disabled")

                    if "disabled" in class_attr or aria_disabled == "true":
                        break

                    await next_btn.click()
                    await page.wait_for_timeout(500)

                except:
                    break

            # ✅ Đợi DOM stable sau khi scroll xong
            await page.wait_for_function("""
            () => {
                const items = document.querySelectorAll('.top-category--item h3 a');
                return items.length > 5;
            }
            """)

            # ✅ Lấy data bằng evaluate (tránh lỗi locator async)
            data = await page.evaluate("""
            () => {
                return Array.from(document.querySelectorAll('.top-category--item h3 a'))
                    .map(a => ({
                        title: a.innerText.trim(),
                        href: a.getAttribute('href')
                    }));
            }
            """)

            # ✅ Build list + remove duplicate
            for item in data:
                title = item.get("title")
                href = item.get("href")

                if href:
                    url = urljoin(BASE_URL, href)
                    if url not in seen:
                        seen.add(url)
                        categories.append({
                            "title": title,
                            "url": url
                        })

        except Exception as e:
            print(f"[TopCV] Lỗi get_categories: {e}")

        finally:
            await self._save_cookies(ctx)
            await ctx.close()

        # ✅ Filter theo query
        if query:
            q = query.lower()
            categories = [c for c in categories if q in c["title"].lower()]

        # ✅ fallback nếu không có category match
        if not categories and query:
            categories = [{
                "title": query,
                "url": f"{BASE_URL}/tim-viec-lam?keyword={query}"
            }]

        print(f"[TopCV] {len(categories)} categories")
        return categories

    # =========================
    # STEP 2: JOB LINKS
    # =========================
    async def get_job_links(self, category: dict, max_pages: int = 2) -> list[str]:
        ctx, page = await self._new_page()
        links = []
        seen = set()
        base_url = category["url"]
        
        try:
            await self._rate_limit()
            await page.goto(base_url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(2000)

            total_pages = 1
            try:
                text = await page.inner_text("#job-listing-paginate-text")
                m = re.search(r"/\s*(\d+)", text)
                if m:
                    total_pages = int(m.group(1))
            except:
                pass

            pages_to_crawl = total_pages if max_pages == 0 else min(max_pages, total_pages)
            print(f"[TopCV] {category.get('title', 'unknown')}: {pages_to_crawl} trang")

            for page_num in range(1, pages_to_crawl + 1):
                if page_num > 1:
                    if "?" in base_url:
                        current_url = f"{base_url}&page={page_num}"
                    else:
                        current_url = f"{base_url}?page={page_num}"
                    
                    await self._rate_limit()
                    await page.goto(current_url, wait_until="domcontentloaded", timeout=30000)
                    await page.wait_for_timeout(1200)

                page_content = await page.content()
                if any(x in page_content for x in CLOUDFLARE_MARKERS):
                    print(f"[TopCV] 🚫 Cloudflare danh sách trang {page_num}, chờ 20s...")
                    await asyncio.sleep(20)
                    continue

                elements = await page.query_selector_all(SELECTORS["job_list"])
                for el in elements:
                    try:
                        href = await el.get_attribute("href")
                        if href:
                            full = urljoin(BASE_URL, href)
                            if full not in seen and "/viec-lam/" in full:
                                seen.add(full)
                                links.append(full)
                    except:
                        continue

                print(f"[TopCV] Trang {page_num}: +{len(elements)} jobs")
                await self._random_wait(800, 1500)

        except Exception as e:
            print(f"[TopCV] Lỗi get_job_links: {e}")
        finally:
            await self._save_cookies(ctx)
            await ctx.close()

        print(f"[TopCV] Tổng: {len(links)} links")
        return links

    # =========================
    # STEP 3: JOB DETAIL
    # =========================
    async def get_job_detail(self, url: str, industry: str) -> dict:
        await self._rate_limit()
        ctx, page = await self._new_page()

        try:
            # ===== LOAD PAGE (RETRY với Cloudflare) =====
            loaded_ok = False
            for attempt in range(3):
                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                except Exception:
                    if attempt == 2:
                        return None
                    await asyncio.sleep(2)
                    continue

                # ===== CLOUDFLARE CHECK =====
                try:
                    page_content = await page.content()
                except Exception:
                    return None

                if any(x in page_content for x in CLOUDFLARE_MARKERS):
                    print(f"[TopCV] 🚫 Cloudflare (attempt {attempt+1}): {url}")
                    wait_time = 15 + attempt * 15  # 15s, 30s, 45s
                    await asyncio.sleep(wait_time)
                    if attempt == 2:
                        return None
                    # Tạo context mới để lấy cookies sạch
                    try:
                        await ctx.close()
                    except Exception:
                        pass
                    ctx, page = await self._new_page()
                    try:
                        await page.goto(BASE_URL, wait_until="domcontentloaded", timeout=20000)
                        await asyncio.sleep(4)
                    except Exception:
                        pass
                    continue

                loaded_ok = True
                break  # Không bị Cloudflare, thoát loop

            if not loaded_ok:
                return None

            # ===== WAIT + SCROLL =====
            await page.wait_for_timeout(1500)
            await self._human_scroll(page)
            await page.wait_for_timeout(1000)

            # ===== GET TITLE (FIX TIMEOUT) =====
            title = ""
            for sel in [
                "h1.job-detail__info--title",  # giữ nguyên selector cũ
                ".job-detail__info h1",
                "h1"
            ]:
                try:
                    el = await page.query_selector(sel)
                    if el:
                        t = (await el.inner_text()).strip()
                        if t:
                            title = t
                            break
                except:
                    continue

            if not title:
                try:
                    title = await page.title()
                except:
                    title = ""

            if not title:
                print(f"[TopCV] ❌ Không lấy được title: {url}")
                return None

            # ===== BASIC INFO (GIỮ NGUYÊN) =====
            basic_info = await page.evaluate("""
                () => {
                    const result = {};
                    const salary = document.querySelector('.job-detail__info--section-content-value');
                    result.salary = salary ? salary.innerText.trim() : null;
                    const deadline = document.querySelector('.job-detail__info--deadline-date');
                    result.deadline = deadline ? deadline.innerText.trim() : null;
                    return result;
                }
            """)
            salary = basic_info.get('salary') or ""
            deadline = basic_info.get('deadline') or ""

            # ===== EXPERIENCE (GIỮ NGUYÊN) =====
            experience = ""
            sections = await page.query_selector_all(".job-detail__info--section-content")
            for sec in sections:
                try:
                    title_el = await sec.query_selector(".job-detail__info--section-content-title")
                    value_el = await sec.query_selector(".job-detail__info--section-content-value")
                    if title_el and value_el:
                        if "kinh nghiệm" in (await title_el.inner_text()).lower():
                            experience = self._clean(await value_el.inner_text())
                            break
                except:
                    continue

            # ===== DESCRIPTION (GIỮ NGUYÊN) =====
            description = await self._get_section_by_keyword(page, "Mô tả công việc") or ""
            requirement = await self._get_section_by_keyword(page, "Yêu cầu ứng viên") or ""
            benefit = await self._get_section_by_keyword(page, "Quyền lợi") or ""

            # ===== WORKING TIME (GIỮ NGUYÊN) =====
            working_time = ""
            sections = await page.query_selector_all(SELECTORS["description_block"])
            for sec in sections:
                try:
                    h3 = await sec.query_selector("h3")
                    if h3 and "Thời gian làm việc" in await h3.inner_text():
                        items = await sec.query_selector_all(SELECTORS["working_time"])
                        working_time = " | ".join([
                            self._clean(await i.inner_text())
                            for i in items if await i.inner_text()
                        ])
                        break
                except:
                    continue

            # ===== LOCATION (GIỮ NGUYÊN) =====
            short_location = ""
            location = ""
            loc_items = await page.query_selector_all(
                ".job-description__item--content div[style*='margin-bottom']"
            )
            if loc_items:
                first = loc_items[0]
                strong = await first.query_selector("strong")
                if strong:
                    short_location = self._clean(
                        (await strong.inner_text()).replace(":", "")
                    )
                full_text = self._clean(await first.inner_text())
                if full_text:
                    location = re.sub(r"^-?\s*", "", full_text)

            # ===== SKILLS (GIỮ NGUYÊN) =====
            skills = await page.evaluate("""
                () => Array.from(document.querySelectorAll('.job-tags__group-list-tag a.item.search-from-tag.link'))
                    .map(a => a.getAttribute('title'))
                    .filter(t => t)
                    .map(t => t.trim())
            """)
            print(f"[TopCV] {title} - {len(skills)} skills")
            # ===== JOB TYPE (GIỮ NGUYÊN) =====
            job_type = ""
            infos = await page.query_selector_all(".box-general-group-info")
            for info in infos:
                try:
                    label = await info.query_selector(".box-general-group-info-title")
                    if label and "Hình thức làm việc" in await label.inner_text():
                        value = await info.query_selector(".box-general-group-info-value")
                        if value:
                            job_type = self._clean(await value.inner_text())
                            break
                except:
                    continue

            # ===== COMPANY (GIỮ NGUYÊN) =====
            company_el = await page.query_selector(
                "a.name, .company-name a, h3.company-name, .job-company a"
            )
            company_name = "Không rõ"
            company_url = None
            
            if company_el:
                company_name = self._clean(await company_el.inner_text()) or "Không rõ"
                company_url = await company_el.get_attribute("href")

            if company_name == "Không rõ":
                logo_el = await page.query_selector("a.company-logo img")
                if logo_el:
                    alt = await logo_el.get_attribute("alt")
                    if alt:
                        company_name = self._clean(alt) or "Không rõ"
                    parent = await page.query_selector("a.company-logo")
                    if parent:
                        company_url = await parent.get_attribute("href")

            company_data = await self._crawl_company(company_url, location, company_name)

            return {
                "industry": industry,
                "job": {
                    "title": title,
                    "shortLocation": short_location,
                    "location": location,
                    "salary": salary,
                    "description": description,
                    "requirement": requirement,
                    "benefit": benefit,
                    "other": "",
                    "jobType": job_type,
                    "workingTime": working_time,
                    "experienceYear": experience,
                    "postedAt": "",
                    "deadline": deadline,
                    "sourcePlatform": "TopCV",
                    "sourceLink": url,
                },
                "company": company_data,
                "skills": skills,
                # conflict_key dùng để upsert đúng field có unique constraint
                "_conflict_key": "sourceLink",
            }

        finally:
            await self._save_cookies(ctx)
            await ctx.close()

    async def _get_section_by_keyword(self, page, keyword):
        sections = await page.query_selector_all(SELECTORS["description_block"])
        for sec in sections:
            try:
                h3 = await sec.query_selector("h3")
                if h3 and keyword.lower() in (await h3.inner_text()).lower():
                    content = await sec.query_selector(SELECTORS["description_content"])
                    if content:
                        return (await content.inner_text()).strip()
            except:
                continue
        return ""

    # =========================
    # STEP 4: COMPANY - FIX LỖI NoneType
    # =========================
    async def _crawl_company(self, company_url: str, location: str, fallback_name: str):
        if not company_url:
            return {
                "companyName": fallback_name or "Không rõ",
                "companyWebsite": None,
                "address": location or "",
                "companyLogo": None,
                "companySize": None,
                "companyProfile": None,
            }

        await self._rate_limit()
        ctx, page = await self._new_page(block_resources=True)
        
        try:
            await page.goto(company_url, wait_until="domcontentloaded", timeout=20000)
            await page.wait_for_timeout(800)

            # Size - FIX: đảm bảo không None
            company_size = None
            try:
                elements = await page.query_selector_all(".company-subdetail-info-text")
                for el in elements:
                    text = await el.inner_text()
                    text_clean = self._clean(text)
                    if text_clean and "nhân viên" in text_clean.lower():
                        company_size = text_clean
                        break
            except:
                pass

            # Logo
            company_logo = None
            try:
                logo_el = await page.query_selector(".company-image-logo img")
                if logo_el:
                    company_logo = await logo_el.get_attribute("src")
            except:
                pass

            # Profile - FIX: đảm bảo không có None trong list
            company_profile = None
            try:
                profile_items = await page.query_selector_all(".company-info .content p")
                profile_parts = []
                for p in profile_items[:10]:
                    try:
                        text = await p.text_content()
                        if text:
                            cleaned = self._clean(text)
                            if cleaned:
                                profile_parts.append(cleaned)
                    except:
                        continue
                company_profile = "\n".join(profile_parts) if profile_parts else None
            except Exception as e:
                print(f"[TopCV] Lỗi lấy profile: {e}")

            return {
                "companyName": fallback_name or "Không rõ",
                "companyWebsite": company_url,
                "address": location or "",
                "companyLogo": company_logo,
                "companySize": company_size,
                "companyProfile": company_profile,
            }
        except Exception as e:
            print(f"[TopCV] Lỗi company {company_url}: {e}")
            return {
                "companyName": fallback_name or "Không rõ",
                "companyWebsite": company_url,
                "address": location or "",
                "companyLogo": None,
                "companySize": None,
                "companyProfile": None,
            }
        finally:
            await ctx.close()





    async def get_job_links_for_page(self, category: dict, page: int) -> tuple[list[str], bool]:
        """Lấy links từ 1 page cụ thể"""
        print(f"[TopCV Debug] === Bắt đầu get_job_links_for_page: page={page} ===")
        
        ctx, page_obj = await self._new_page()
        links = []
        seen = set()
        
        try:
            await self._rate_limit()
            
            # Build URL
            base_url = category["url"]
            if page > 1:
                if "?" in base_url:
                    url = f"{base_url}&page={page}"
                else:
                    url = f"{base_url}?page={page}"
            else:
                url = base_url
            
            print(f"[TopCV Debug] Truy cập URL: {url}")
            
            # ===== SỬA: Dùng domcontentloaded thay vì networkidle =====
            # networkidle hay timeout vì TopCV có nhiều tracking scripts
            try:
                response = await page_obj.goto(url, wait_until="domcontentloaded", timeout=30000)
                print(f"[TopCV Debug] Response status: {response.status if response else 'None'}")
            except Exception as e:
                print(f"[TopCV Debug] Lỗi goto: {e}, thử lại với load...")
                try:
                    response = await page_obj.goto(url, wait_until="load", timeout=30000)
                except:
                    print(f"[TopCV Debug] Vẫn lỗi, trả về rỗng")
                    return [], False
            
            # Chờ lâu hơn để JS render (thay vì đợi networkidle)
            await page_obj.wait_for_timeout(2500)
            
            # Check Cloudflare
            title = await page_obj.title()
            content = await page_obj.content()
            
            if any(marker in content for marker in CLOUDFLARE_MARKERS) or "Just a moment" in title:
                print(f"[TopCV Debug] ⚠️ Cloudflare detected, đợi 20s...")
                await asyncio.sleep(20)
                # Thử reload
                await page_obj.reload(wait_until="domcontentloaded", timeout=30000)
                await page_obj.wait_for_timeout(2000)

            print(f"[TopCV Debug] Page title: {title}")

            # Chờ selector với timeout hợp lý
            try:
                # Thử nhiều selector khác nhau
                selectors = ["h3.title a", ".job-item h3 a", ".job-title a", "a[href*='/viec-lam/']"]
                found = False
                for sel in selectors:
                    try:
                        await page_obj.wait_for_selector(sel, timeout=8000)
                        found = True
                        print(f"[TopCV Debug] Tìm thấy selector: {sel}")
                        break
                    except:
                        continue
                
                if not found:
                    print(f"[TopCV Debug] Không tìm thấy selector nào")
                    return [], False
                    
            except Exception as e:
                print(f"[TopCV Debug] Lỗi chờ selector: {e}")
                return [], False

            # Lấy links - dùng evaluate để chắc chắn
            elements = await page_obj.query_selector_all("h3.title a")
            if not elements:
                elements = await page_obj.query_selector_all(".job-item h3 a")
            if not elements:
                elements = await page_obj.query_selector_all("a[href*='/viec-lam/']")

            print(f"[TopCV Debug] Số elements: {len(elements)}")

            for i, el in enumerate(elements):
                try:
                    href = await el.get_attribute("href")
                    if href:
                        full = urljoin(BASE_URL, href)
                        if full not in seen and "/viec-lam/" in full and not "/viec-lam/c" in full:
                            seen.add(full)
                            links.append(full)
                except:
                    continue

            print(f"[TopCV Debug] Tổng links unique: {len(links)}")
            if links:
                print(f"[TopCV Debug] Link đầu tiên: {links[0]}")

            # Check next page
            has_next = False
            try:
                next_btn = await page_obj.query_selector("a[rel='next']:not(.disabled)")
                if next_btn:
                    has_next = True
                
                if not has_next:
                    # Check pagination text
                    paginate_el = await page_obj.query_selector("#job-listing-paginate-text")
                    if paginate_el:
                        text = await paginate_el.inner_text()
                        import re
                        m = re.search(r"(\d+)\s*/\s*(\d+)", text)
                        if m:
                            current, total = int(m.group(1)), int(m.group(2))
                            has_next = current < total
                            print(f"[TopCV Debug] Page {current}/{total}")
                        
            except Exception as e:
                print(f"[TopCV Debug] Lỗi check next: {e}")
                has_next = False

            return links, has_next
            
        except Exception as e:
            print(f"[TopCV Debug] ❌ Lỗi nghiêm trọng: {e}")
            return [], False
        finally:
            await self._save_cookies(ctx)
            await ctx.close()
            print(f"[TopCV Debug] === Kết thúc ===")



    async def search_by_keyword(self, keyword: str, page: int = 1) -> tuple[list[str], bool]:
        """Search TopCV với URL đúng: /tim-viec-lam-{keyword}"""
        if not keyword:
            return await self.get_categories("")
        
        ctx, page_obj = await self._new_page()
        
        try:
            # Format: /tim-viec-lam-business-analyst?type_keyword=1&sba=1...
            # Hoặc đơn giản: /tim-viec-lam?keyword=business+analyst
            keyword_slug = keyword.lower().replace(' ', '-')
            
            if page == 1:
                url = f"https://www.topcv.vn/tim-viec-lam-{keyword_slug}?type_keyword=1&sba=1"
            else:
                url = f"https://www.topcv.vn/tim-viec-lam-{keyword_slug}?type_keyword=1&sba=1&page={page}"
            
            print(f"[TopCV Search] Truy cập: {url}")
            
            await self._rate_limit()
            await page_obj.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page_obj.wait_for_timeout(2000)
            
            # Check Cloudflare
            content = await page_obj.content()
            if any(x in content for x in CLOUDFLARE_MARKERS):
                print(f"[TopCV Search] ⚠️ Cloudflare, đợi 15s...")
                await asyncio.sleep(15)
                await page_obj.reload(wait_until="domcontentloaded", timeout=30000)
                await page_obj.wait_for_timeout(2000)
            
            # Lấy links - dùng selector cũ nhưng chắc chắn hơn
            elements = await page_obj.query_selector_all("h3.title a")
            if not elements:
                # Thử selector dự phòng
                elements = await page_obj.query_selector_all("div.job-item h3 a")
            
            links = []
            seen = set()
            
            for el in elements:
                try:
                    href = await el.get_attribute("href")
                    if href:
                        full = urljoin(BASE_URL, href)
                        if full not in seen and "/viec-lam/" in full:
                            seen.add(full)
                            links.append(full)
                except:
                    continue
            
            # Check next page
            has_next = False
            try:
                # Tìm số page hiện tại và tổng số page
                paginate_text = await page_obj.inner_text("#job-listing-paginate-text")
                import re
                m = re.search(r"(\d+)\s*/\s*(\d+)", paginate_text)
                if m:
                    current, total = int(m.group(1)), int(m.group(2))
                    has_next = current < total
                    print(f"[TopCV Search] Page {current}/{total}")
                else:
                    # Fallback: check nút next
                    next_btn = await page_obj.query_selector("a[rel='next']:not(.disabled)")
                    has_next = next_btn is not None
            except:
                has_next = False
            
            print(f"[TopCV Search] Tìm thấy {len(links)} jobs, has_next={has_next}")
            return links, has_next
            
        except Exception as e:
            print(f"[TopCV Search] ❌ Lỗi: {e}")
            return [], False
        finally:
            await self._save_cookies(ctx)
            await ctx.close()