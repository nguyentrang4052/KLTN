"""
crawlers/topcv.py — Async adapter từ topcv(2).py gốc.
"""
import asyncio
import random
import json
import os
import time
from urllib.parse import urljoin
from playwright.async_api import Browser, TimeoutError as PlaywrightTimeout
from .base import BaseCrawler
import re
from curl_cffi import requests as curl_requests
from bs4 import BeautifulSoup


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
            # Dùng firefox thay vì chromium (khó bị Cloudflare detect hơn)
            self._browser = await self.playwright.firefox.launch(
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage"]
            )
        return self._browser

# XÓA DÒNG NÀY Ở ĐẦU FILE
# from playwright_stealth import stealth_async

# Trong _new_page(), thay thế bằng:
    async def _new_page(self, block_resources: bool = False):
        browser = await self._browser_()
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            locale="vi-VN",
            viewport={"width": 1280, "height": 800},
            timezone_id="Asia/Ho_Chi_Minh",
            extra_http_headers={
                "Accept-Language": "vi-VN,vi;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            }
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
        
        # Anti-detect script thay thế playwright_stealth
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'plugins', {get: () => [1,2,3,4,5]});
            Object.defineProperty(navigator, 'languages', {get: () => ['vi-VN', 'vi', 'en-US', 'en']});
            window.chrome = { runtime: {} };
            Object.defineProperty(navigator, 'hardwareConcurrency', {get: () => 8});
            Object.defineProperty(navigator, 'deviceMemory', {get: () => 8});
            
            // Xóa traces của automation
            delete navigator.__proto__.webdriver;
            
            // Spoof permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' 
                    ? Promise.resolve({state: Notification.permission}) 
                    : originalQuery(parameters)
            );
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
    # HARDCODED CATEGORIES (từ DOM topcv.vn - tránh Cloudflare)
    # Cập nhật lại nếu TopCV thay đổi cấu trúc URL.
    # =========================
    STATIC_CATEGORIES = [
        {"title": "Kinh doanh - Bán hàng",                                    "url": "https://www.topcv.vn/tim-viec-lam-kinh-doanh-ban-hang-cr1"},
        {"title": "Marketing - PR - Quảng cáo",                               "url": "https://www.topcv.vn/tim-viec-lam-marketing-pr-quang-cao-cr92"},
        {"title": "Chăm sóc khách hàng (Customer Service) - Vận hành",        "url": "https://www.topcv.vn/tim-viec-lam-cham-soc-khach-hang-customer-service-van-hanh-cr158"},
        {"title": "Nhân sự - Hành chính - Pháp chế",                          "url": "https://www.topcv.vn/tim-viec-lam-nhan-su-hanh-chinh-phap-che-cr177"},
        {"title": "Công nghệ Thông tin",                                       "url": "https://www.topcv.vn/tim-viec-lam-cong-nghe-thong-tin-cr257"},
        {"title": "Tài chính - Ngân hàng - Bảo hiểm",                         "url": "https://www.topcv.vn/tim-viec-lam-tai-chinh-ngan-hang-bao-hiem-cr206"},
        {"title": "Bất động sản",                                              "url": "https://www.topcv.vn/tim-viec-lam-bat-dong-san-cr333"},
        {"title": "Kế toán - Kiểm toán - Thuế",                               "url": "https://www.topcv.vn/tim-viec-lam-ke-toan-kiem-toan-thue-cr392"},
        {"title": "Sản xuất",                                                  "url": "https://www.topcv.vn/tim-viec-lam-san-xuat-cr417"},
        {"title": "Giáo dục - Đào tạo",                                        "url": "https://www.topcv.vn/tim-viec-lam-giao-duc-dao-tao-cr477"},
        {"title": "Bán lẻ - Dịch vụ đời sống",                                "url": "https://www.topcv.vn/tim-viec-lam-ban-le-dich-vu-doi-song-cr544"},
        {"title": "Phim và truyền hình - Báo chí - Xuất bản",                 "url": "https://www.topcv.vn/tim-viec-lam-phim-va-truyen-hinh-bao-chi-xuat-ban-cr612"},
        {"title": "Điện - Điện tử - Viễn thông",                              "url": "https://www.topcv.vn/tim-viec-lam-dien-dien-tu-vien-thong-cr644"},
        {"title": "Logistics - Thu mua - Kho - Vận tải",                       "url": "https://www.topcv.vn/tim-viec-lam-logistics-thu-mua-kho-van-tai-cr711"},
        {"title": "Tư vấn chuyên môn",                                         "url": "https://www.topcv.vn/tim-viec-lam-tu-van-chuyen-mon-cr750"},
        {"title": "Dược - Y tế - Sức khoẻ - Công nghệ sinh học",              "url": "https://www.topcv.vn/tim-viec-lam-duoc-y-te-suc-khoe-cong-nghe-sinh-hoc-cr781"},
        {"title": "Thiết kế",                                                   "url": "https://www.topcv.vn/tim-viec-lam-thiet-ke-cr826"},
        {"title": "Nhà hàng - Khách sạn - Du lịch",                            "url": "https://www.topcv.vn/tim-viec-lam-nha-hang-khach-san-du-lich-cr857"},
        {"title": "Năng lượng - Môi trường - Nông nghiệp",                     "url": "https://www.topcv.vn/tim-viec-lam-nang-luong-moi-truong-nong-nghiep-cr883"},
        {"title": "Nhóm nghề khác",                                             "url": "https://www.topcv.vn/tim-viec-lam-nhom-nghe-khac-cr899"},
    ]

    # =========================
    # STEP 1: CATEGORIES
    # =========================
    async def get_categories(self, query: str = "") -> list[dict]:
        """
        Trả về categories từ danh sách tĩnh (tránh Cloudflare block khi dùng Playwright).
        Thử fetch live từ curl_cffi trước; nếu lỗi/bị block thì fallback về STATIC_CATEGORIES.
        """
        categories = []
        seen = set()

        # === THỬ LẤY LIVE TỪ CURL_CFFI ===
        try:
            print("[TopCV] Thử lấy categories từ curl_cffi...")
            session = curl_requests.Session(impersonate="chrome120")
            resp = session.get(
                BASE_URL,
                headers={
                    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8",
                    "Referer": "https://www.google.com/",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
                timeout=20,
            )

            if resp.status_code == 200 and not any(x in resp.text for x in CLOUDFLARE_MARKERS):
                soup = BeautifulSoup(resp.text, "html.parser")
                for a in soup.select(".top-category--item h3 a"):
                    title = a.get_text(strip=True)
                    href = a.get("href")
                    if title and href:
                        url = urljoin(BASE_URL, href)
                        if url not in seen:
                            seen.add(url)
                            categories.append({"title": title, "url": url})

                if categories:
                    print(f"[TopCV] ✅ curl_cffi lấy được {len(categories)} categories")
                else:
                    print("[TopCV] ⚠️ curl_cffi OK nhưng không parse được categories")
            else:
                print(f"[TopCV] ⚠️ curl_cffi status={resp.status_code} hoặc bị Cloudflare")

        except Exception as e:
            print(f"[TopCV] curl_cffi lỗi: {e}")

        # === FALLBACK VỀ STATIC NẾU LIVE TRỐNG ===
        if not categories:
            print("[TopCV] Dùng STATIC_CATEGORIES làm fallback")
            categories = list(self.STATIC_CATEGORIES)

        # === FILTER THEO QUERY ===
        if query:
            q = query.lower()
            filtered = [c for c in categories if q in c["title"].lower()]
            if filtered:
                categories = filtered
            else:
                # Query không khớp category nào → dùng URL search trực tiếp
                categories = [{
                    "title": query,
                    "url": f"{BASE_URL}/tim-viec-lam?keyword={query}",
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
    # STEP 3: JOB DETAIL — dùng curl_cffi, không dùng Playwright
    # =========================
    async def get_job_detail(self, url: str, industry: str) -> dict:
        await self._rate_limit()

        # Tách job_url nếu là format "job_url|company_url" (giống CareerLink)
        if "|" in url:
            job_url, _ = url.split("|", 1)
        else:
            job_url = url

        html = await self._fetch_html(job_url)
        if not html:
            return None

        soup = BeautifulSoup(html, "html.parser")

        # ===== TITLE =====
        title = ""
        for sel in ["h1.job-detail__info--title", ".job-detail__info h1", "h1"]:
            el = soup.select_one(sel)
            if el:
                title = self._clean(el.get_text())
                if title:
                    break
        if not title:
            # fallback: <title> tag
            title_tag = soup.find("title")
            title = self._clean(title_tag.get_text()) if title_tag else ""
        if not title:
            print(f"[TopCV] ❌ Không lấy được title: {job_url}")
            return None

        # ===== SALARY + DEADLINE =====
        salary = ""
        salary_el = soup.select_one(".job-detail__info--section-content-value")
        if salary_el:
            salary = self._clean(salary_el.get_text())

        deadline = ""
        deadline_el = soup.select_one(".job-detail__info--deadline-date")
        if deadline_el:
            deadline = self._clean(deadline_el.get_text())

        # ===== EXPERIENCE =====
        experience = ""
        for sec in soup.select(".job-detail__info--section-content"):
            t_el = sec.select_one(".job-detail__info--section-content-title")
            v_el = sec.select_one(".job-detail__info--section-content-value")
            if t_el and v_el and "kinh nghiệm" in t_el.get_text().lower():
                experience = self._clean(v_el.get_text())
                break

        # ===== DESCRIPTION / REQUIREMENT / BENEFIT =====
        def _section_text(keyword: str) -> str:
            for sec in soup.select(SELECTORS["description_block"]):
                h3 = sec.select_one("h3")
                if h3 and keyword.lower() in h3.get_text().lower():
                    content = sec.select_one(SELECTORS["description_content"])
                    if content:
                        return content.get_text(separator="\n").strip()
            return ""

        description = _section_text("Mô tả công việc")
        requirement  = _section_text("Yêu cầu ứng viên")
        benefit      = _section_text("Quyền lợi")

        # ===== WORKING TIME =====
        working_time = ""
        for sec in soup.select(SELECTORS["description_block"]):
            h3 = sec.select_one("h3")
            if h3 and "Thời gian làm việc" in h3.get_text():
                items = sec.select(SELECTORS["working_time"])
                working_time = " | ".join(
                    self._clean(i.get_text()) for i in items if i.get_text(strip=True)
                )
                break

        # ===== LOCATION =====
        short_location = ""
        location = ""
        loc_items = soup.select(".job-description__item--content div[style*='margin-bottom']")
        if loc_items:
            first = loc_items[0]
            strong = first.select_one("strong")
            if strong:
                short_location = self._clean(strong.get_text().replace(":", ""))
            full_text = self._clean(first.get_text())
            if full_text:
                location = re.sub(r"^-?\s*", "", full_text)

        # ===== SKILLS =====
        skills = [
            a.get("title", "").strip()
            for a in soup.select(".job-tags__group-list-tag a.item.search-from-tag.link")
            if a.get("title")
        ]
        print(f"[TopCV] {title} - {len(skills)} skills")

        # ===== JOB TYPE =====
        job_type = ""
        for info in soup.select(".box-general-group-info"):
            label = info.select_one(".box-general-group-info-title")
            if label and "Hình thức làm việc" in label.get_text():
                value = info.select_one(".box-general-group-info-value")
                if value:
                    job_type = self._clean(value.get_text())
                break

        # ===== COMPANY =====
        company_name = "Không rõ"
        company_url_val = None
        for sel in ["a.name", ".company-name a", "h3.company-name", ".job-company a"]:
            el = soup.select_one(sel)
            if el:
                company_name = self._clean(el.get_text()) or "Không rõ"
                company_url_val = el.get("href")
                break

        if company_name == "Không rõ":
            logo_el = soup.select_one("a.company-logo img")
            if logo_el:
                alt = logo_el.get("alt", "")
                if alt:
                    company_name = self._clean(alt) or "Không rõ"
                parent = soup.select_one("a.company-logo")
                if parent:
                    company_url_val = parent.get("href")

        if company_url_val:
            company_url_val = urljoin(BASE_URL, company_url_val)

        company_data = await self._crawl_company(company_url_val, location, company_name)

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
                "sourceLink": job_url,
            },
            "company": company_data,
            "skills": skills,
            "_conflict_key": "sourceLink",
        }

    async def _fetch_html(self, url: str, retries: int = 3) -> str | None:
        """Fetch HTML bằng curl_cffi, retry nếu bị block."""
        for attempt in range(retries):
            try:
                resp = curl_requests.get(
                    url,
                    impersonate="chrome120",
                    headers={
                        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Referer": "https://www.topcv.vn/",
                    },
                    timeout=25,
                )
                if resp.status_code != 200:
                    print(f"[TopCV] ⚠️ HTTP {resp.status_code}: {url}")
                    if attempt < retries - 1:
                        await asyncio.sleep(3 * (attempt + 1))
                    continue
                html = resp.text
                if any(x in html for x in ["Sorry, you have been blocked", "cf-browser-verification", "Just a moment", "Checking your browser"]):
                    print(f"[TopCV] 🚫 Bị block (attempt {attempt+1}): {url}")
                    if attempt < retries - 1:
                        await asyncio.sleep(10 * (attempt + 1))
                    continue
                return html
            except Exception as e:
                print(f"[TopCV] ❌ Lỗi fetch (attempt {attempt+1}): {e}")
                if attempt < retries - 1:
                    await asyncio.sleep(3)
        return None

    async def _get_section_by_keyword(self, page, keyword):
        """Giữ lại cho compatibility, không dùng trong get_job_detail mới."""
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
    # STEP 4: COMPANY — dùng curl_cffi
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
        html = await self._fetch_html(company_url)

        if not html:
            return {
                "companyName": fallback_name or "Không rõ",
                "companyWebsite": company_url,
                "address": location or "",
                "companyLogo": None,
                "companySize": None,
                "companyProfile": None,
            }

        try:
            soup = BeautifulSoup(html, "html.parser")

            # Size
            company_size = None
            for el in soup.select(".company-subdetail-info-text"):
                text = self._clean(el.get_text())
                if text and "nhân viên" in text.lower():
                    company_size = text
                    break

            # Logo
            company_logo = None
            logo_el = soup.select_one(".company-image-logo img")
            if logo_el:
                company_logo = logo_el.get("src")

            # Profile
            profile_parts = [
                self._clean(p.get_text())
                for p in soup.select(".company-info .content p")[:10]
                if self._clean(p.get_text())
            ]
            company_profile = "\n".join(profile_parts) if profile_parts else None

            return {
                "companyName": fallback_name or "Không rõ",
                "companyWebsite": company_url,
                "address": location or "",
                "companyLogo": company_logo,
                "companySize": company_size,
                "companyProfile": company_profile,
            }
        except Exception as e:
            print(f"[TopCV] Lỗi parse company {company_url}: {e}")
            return {
                "companyName": fallback_name or "Không rõ",
                "companyWebsite": company_url,
                "address": location or "",
                "companyLogo": None,
                "companySize": None,
                "companyProfile": None,
            }

    async def get_job_links_for_page(self, category: dict, page: int) -> tuple[list[str], bool]:
        """Lấy links từ 1 page cụ thể - DÙNG CURL_CFFI BYPASS CLOUDFLARE"""
        print(f"[TopCV] === Bắt đầu get_job_links_for_page: page={page} ===")
        
        links = []
        seen = set()
        base_url = category["url"]
        
        # Build URL
        if page > 1:
            if "?" in base_url:
                url = f"{base_url}&page={page}"
            else:
                url = f"{base_url}?page={page}"
        else:
            url = base_url
        
        print(f"[TopCV] Truy cập URL: {url}")
        
        try:
            # === DÙNG CURL_CFFI THAY VÌ PLAYWRIGHT ===
            resp = curl_requests.get(
                url,
                impersonate="chrome120",
                headers={
                    "Accept-Language": "vi-VN,vi;q=0.9",
                    "Referer": "https://www.google.com/",
                },
                timeout=20
            )
            
            print(f"[TopCV] Response status: {resp.status_code}")
            
            if resp.status_code != 200:
                print(f"[TopCV] ❌ Status không 200: {resp.status_code}")
                return [], False
            
            html = resp.text
            
            # Check Cloudflare challenge
            if any(x in html for x in ["Attention Required!", "cf-browser-verification", "Just a moment"]):
                print(f"[TopCV] ⚠️ Vẫn gặp Cloudflare challenge")
                return [], False
            
            # Parse bằng BeautifulSoup
            soup = BeautifulSoup(html, "html.parser")
            
            # Tìm job links - thử nhiều selector
            selectors = [
                "h3.title a[href*='/viec-lam/']",
                ".job-item h3 a[href*='/viec-lam/']",
                "a[href*='/viec-lam/']",
            ]
            
            elements = []
            for sel in selectors:
                elements = soup.select(sel)
                if len(elements) >= 5:
                    print(f"[TopCV] Dùng selector: {sel} ({len(elements)} items)")
                    break
            
            print(f"[TopCV] Số elements: {len(elements)}")
            
            for el in elements:
                try:
                    href = el.get("href")
                    if href:
                        full = urljoin(BASE_URL, href)
                        # Chỉ lấy link job, không lấy link category
                        if full not in seen and "/viec-lam/" in full and not "/viec-lam/c" in full:
                            seen.add(full)
                            links.append(full)
                except:
                    continue
            
            print(f"[TopCV] Tổng links unique: {len(links)}")
            if links:
                print(f"[TopCV] Link đầu tiên: {links[0]}")
            
            # Check next page
            has_next = False
            try:
                # Check nút next
                next_btn = soup.select_one("a[rel='next']:not(.disabled)")
                if next_btn:
                    has_next = True
                
                # Hoặc check pagination text
                if not has_next:
                    paginate_el = soup.select_one("#job-listing-paginate-text")
                    if paginate_el:
                        text = paginate_el.get_text()
                        m = re.search(r"(\d+)\s*/\s*(\d+)", text)
                        if m:
                            current, total = int(m.group(1)), int(m.group(2))
                            has_next = current < total
                            print(f"[TopCV] Page {current}/{total}")
                            
            except Exception as e:
                print(f"[TopCV] Lỗi check next: {e}")
                has_next = False
            
            return links, has_next
            
        except Exception as e:
            print(f"[TopCV] ❌ Lỗi curl_cffi: {e}")
            return [], False
        finally:
            print(f"[TopCV] === Kết thúc ===")



    async def search_by_keyword(self, keyword: str, page: int = 1) -> tuple[list[str], bool]:
        """Search TopCV với URL đúng: /tim-viec-lam-{keyword}"""
        if not keyword:
            return await self.get_categories("")
        
        ctx, page_obj = await self._new_page()
        
        try:
            # Format: /tim-viec-lam-business-analyst?type_keyword=1&sba=1...
            # Hoặc đơn giản: /tim-viec-lam?keyword=business+analyst
            keyword_formatted = '-'.join(keyword.split())

            print(f"[TopCV Search] Tìm kiếm: {keyword_formatted} (page {page})")
            
            if page == 1:
                url = f"https://www.topcv.vn/tim-viec-lam-{keyword_formatted}?type_keyword=1&sba=1"

            else:
                url = f"https://www.topcv.vn/tim-viec-lam-{keyword_formatted}?type_keyword=1&sba=1&page={page}"

            print(f"[TopCV Search] 🔗 Truy cập: {url}")
            print(f"[TopCV Search] 🔍 Tìm keyword: '{keyword}' (slug: '{keyword_formatted}')")
            
            
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
                            parent = await el.evaluate("el => el.closest('.job-item, .job-listing')")
                            company_el = None
                            if parent:
                                # Tìm trong parent container
                                company_el = await el.evaluate("""el => {
                                    const container = el.closest('.job-item, .job-listing, [class*="job"]');
                                    if (!container) return null;
                                    const comp = container.querySelector('a[href*="/cong-ty/"], .company-name a, a.name');
                                    return comp ? comp.getAttribute('href') : null;
                                }""")
                            
                            company_url = urljoin(BASE_URL, company_el) if company_el else ""
                            
                            # Format giống CareerLink: "job_url|company_url"
                            if company_url:
                                links.append(f"{full}|{company_url}")
                            else:
                                links.append(full)  # Fallback nếu không có company
                            

                            # links.append(full)
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