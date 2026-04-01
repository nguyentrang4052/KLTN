import asyncio
import re
import json
import os
import random
from datetime import datetime, timedelta
from urllib.parse import urljoin
from playwright.async_api import Browser, TimeoutError as PlaywrightTimeout
from .base import BaseCrawler

BASE_URL = "https://www.careerlink.vn"
COOKIES_FILE = "careerlink_cookies.json"
USER_DATA_DIR = "./careerlink_user_data"


class CareerLinkCrawler(BaseCrawler):

    def __init__(self, playwright):
        self.playwright = playwright
        self._browser = None
        self._context = None
        self._page = None

    async def init_session(self):
        """Khởi tạo session với persistent context"""
        if self._page:
            return

        print("[CareerLink] Khởi tạo session...")

        self._context = await self.playwright.chromium.launch_persistent_context(
            USER_DATA_DIR,
            headless=False,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-web-security",
                "--disable-features=IsolateOrigins,site-per-process",
                "--window-size=1366,768",
                "--start-maximized",
                "--no-first-run",
                "--disable-dev-shm-usage",
            ],
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1366, "height": 768},
            locale="vi-VN",
            timezone_id="Asia/Ho_Chi_Minh",
        )

        self._page = await self._context.new_page()

        # Stealth scripts
        await self._page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', { 
                get: () => [
                    {name: "Chrome PDF Plugin", filename: "internal-pdf-viewer"},
                    {name: "Chrome PDF Viewer", filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai"},
                    {name: "Native Client", filename: "internal-nacl-plugin"}
                ] 
            });
            Object.defineProperty(navigator, 'languages', { get: () => ['vi-VN', 'vi', 'en-US', 'en'] });
            delete navigator.__proto__.webdriver;
            window.chrome = { runtime: {}, app: {} };
        """)

        # Warm up - truy cập trang chủ
        print("[CareerLink] Warming up...")
        try:
            await self._page.goto(BASE_URL, timeout=60000, wait_until="networkidle")
            await asyncio.sleep(3)
            
            if await self._is_cloudflare_challenge():
                await self._solve_cloudflare_challenge()
            
            print("[CareerLink] ✅ Session ready")
        except Exception as e:
            print(f"[CareerLink] Warm up warning: {e}")

    async def _is_cloudflare_challenge(self):
        """Kiểm tra Cloudflare challenge"""
        try:
            content = await self._page.content()
            indicators = [
                "challenge-platform", "cf-browser-verification", "turnstile",
                "checking your browser", "please wait", "just a moment",
                "ray id", "cf-im-under-attack"
            ]
            return any(ind in content.lower() for ind in indicators)
        except:
            return False

    async def _solve_cloudflare_challenge(self):
        """Xử lý Cloudflare challenge"""
        print("[CareerLink] Đang đợi Cloudflare challenge...")
        max_wait = 30
        waited = 0
        
        while await self._is_cloudflare_challenge() and waited < max_wait:
            try:
                await self._page.click("input[type='checkbox']", timeout=1000)
            except:
                pass
            await asyncio.sleep(2)
            waited += 2
        
        if await self._is_cloudflare_challenge():
            print("[CareerLink] ⚠️ Timeout chờ Cloudflare")
            return False
        
        print("[CareerLink] ✅ Đã vượt qua Cloudflare")
        await asyncio.sleep(3)
        return True

    async def _random_sleep(self, min_sec=2, max_sec=4):
        await asyncio.sleep(random.uniform(min_sec, max_sec))

    async def goto(self, url, retry=2, timeout=60000):
        """Goto URL với xử lý Cloudflare"""
        if not self._page:
            await self.init_session()

        for attempt in range(retry):
            try:
                await self._random_sleep(1, 2)
                
                response = await self._page.goto(url, timeout=timeout, wait_until="networkidle")
                await asyncio.sleep(3)
                
                if await self._is_cloudflare_challenge():
                    print(f"[CareerLink] Phát hiện Cloudflare")
                    success = await self._solve_cloudflare_challenge()
                    if not success:
                        if attempt < retry - 1:
                            continue
                        return False
                
                # Cuộn trang
                for _ in range(random.randint(2, 4)):
                    await self._page.mouse.wheel(0, random.randint(200, 500))
                    await asyncio.sleep(random.uniform(0.5, 1))
                
                return True
                
            except Exception as e:
                print(f"[CareerLink] Lỗi goto lần {attempt+1}: {e}")
                if attempt == retry - 1:
                    return False
                await asyncio.sleep(3)
        
        return False

    async def get_text(self, selector):
        try:
            el = await self._page.query_selector(selector)
            if el:
                return (await el.inner_text()).strip()
        except:
            pass
        return ""

    async def get_attr(self, selector, attr):
        try:
            el = await self._page.query_selector(selector)
            if el:
                return await el.get_attribute(attr)
        except:
            pass
        return None

    # =========================
    # STEP 1: CATEGORIES
    # =========================
    async def get_categories(self, query: str = "") -> list[dict]:
        """
        Lấy danh sách categories từ section:
        - Container: .categories-section.py-4.arrow-bottom
        - Card: .category-bg.category-card
        - Link: a.clickable-outside với href="/viec-lam/{slug}/{id}"
        - Tên: h4.h4.mb-1.text-line-clamp-3
        """
        await self.init_session()
        categories = []
        
        try:
            print("[CareerLink] Đang lấy categories...")
            
            success = await self.goto(BASE_URL)
            if not success:
                print("[CareerLink] ❌ Không thể load trang chủ")
                return []
            
            # Đợi section categories load
            try:
                await self._page.wait_for_selector(".categories-section", timeout=15000)
            except:
                print("[CareerLink] ⚠️ Không tìm thấy .categories-section")
            
            # Lấy categories sử dụng selector chính xác
            category_cards = await self._page.query_selector_all(
                ".categories-section .category-bg.category-card"
            )
            
            print(f"[CareerLink] Tìm thấy {len(category_cards)} category cards")
            
            seen = set()
            for card in category_cards:
                try:
                    # Tìm thẻ a chứa link
                    link_el = await card.query_selector("a.clickable-outside")
                    if not link_el:
                        continue
                    
                    # Lấy href
                    href = await link_el.get_attribute("href")
                    if not href or not href.startswith("/viec-lam/"):
                        continue
                    
                    # Lấy tên category từ h5.h4
                    name_el = await link_el.query_selector("h5.h4, h5.text-line-clamp-3")
                    name = ""
                    if name_el:
                        name = (await name_el.inner_text()).strip()
                    
                    if href and name:
                        full_url = urljoin(BASE_URL, href)
                        if full_url not in seen:
                            seen.add(full_url)
                            categories.append({
                                "name": name,
                                "url": full_url
                            })
                            print(f"[CareerLink]   + {name}: {href}")
                            
                except Exception as e:
                    print(f"[CareerLink]   Lỗi parse category: {e}")
                    continue
                    
        except Exception as e:
            print(f"[CareerLink] ❌ Lỗi get_categories: {e}")
            import traceback
            traceback.print_exc()

        if query and categories:
            q = query.lower()
            categories = [c for c in categories if q in c["name"].lower()]
        
        print(f"[CareerLink] ✅ {len(categories)} categories")
        return categories

    # =========================
    # STEP 2: JOB LINKS & COMPANY LINKS
    # =========================
    async def get_job_links(self, category: dict, max_pages: int = 2) -> list[str]:
        """
        Lấy danh sách job links từ category page.
        Company links được lưu vào self._last_company_links để truy cập sau nếu cần.
        """
        job_links = []
        self._last_company_links = []  # Reset
        seen_jobs = set()
        seen_companies = set()
        url = category["url"]
        page_count = 0

        try:
            while page_count < max_pages:
                print(f"[CareerLink] Đang lấy trang {page_count + 1}: {url}")

                success = await self.goto(url)
                if not success:
                    break

                # Đợi load
                try:
                    await self._page.wait_for_selector("ul.list-group.mt-4", timeout=15000)
                except:
                    break

                # LẤY JOB LINKS
                job_items = await self._page.query_selector_all(
                    "ul.list-group.mt-4 li a.job-link.clickable-outside"
                )
                
                print(f"[CareerLink]   Tìm thấy {len(job_items)} job items")
                
                for item in job_items:
                    try:
                        href = await item.get_attribute("href")
                        title = await item.get_attribute("title") or ""
                        
                        if href and "/tim-viec-lam/" in href:
                            full_url = urljoin(BASE_URL, href)
                            clean_url = full_url.split("?")[0]
                            
                            if clean_url not in seen_jobs:
                                seen_jobs.add(clean_url)
                                job_links.append(full_url)
                                print(f"[CareerLink]     [JOB] {title[:50]}")
                    except:
                        continue

                # LẤY COMPANY LINKS (lưu vào biến instance, không return)
                company_selectors = [
                    "ul.list-group.mt-4 li a.text-dark.job-company.mb-1",
                    "ul.list-group.mt-4 li a.job-company",
                    "ul.list-group.mt-4 li a[href^='/viec-lam-cua/']"
                ]
                
                company_items = []
                for selector in company_selectors:
                    company_items = await self._page.query_selector_all(selector)
                    if company_items:
                        break
                
                for item in company_items:
                    try:
                        href = await item.get_attribute("href")
                        company_name = (await item.inner_text()).strip()
                        
                        if href and "/viec-lam-cua/" in href:
                            full_url = urljoin(BASE_URL, href)
                            clean_url = full_url.split("?")[0]
                            
                            if clean_url not in seen_companies:
                                seen_companies.add(clean_url)
                                self._last_company_links.append(full_url)
                                print(f"[CareerLink]     [COMPANY] {company_name[:50]}")
                    except:
                        continue

                # PAGINATION
                page_count += 1
                next_btn = await self._page.query_selector("a[rel='next'].page-link")
                if not next_btn:
                    break
                    
                next_href = await next_btn.get_attribute("href")
                if not next_href or next_href == "#":
                    break
                    
                url = urljoin(BASE_URL, next_href)
                await self._random_sleep(3, 5)

        except Exception as e:
            print(f"[CareerLink] Lỗi get_job_links: {e}")
            import traceback
            traceback.print_exc()

        print(f"[CareerLink] ✅ Tổng job links: {len(job_links)}, company links: {len(self._last_company_links)}")
        return job_links  # Chỉ return list[str] như các crawler khác

    def get_last_company_links(self) -> list[str]:
        """Lấy company links từ lần gọi get_job_links gần nhất"""
        return getattr(self, '_last_company_links', [])

    # =========================
    # STEP 3: JOB DETAIL
    # =========================
    async def get_job_detail(self, url: str, industry: str) -> dict:
        """Lấy chi tiết job từ URL"""
        await self.init_session()
        
        try:
            success = await self.goto(url)
            if not success:
                return None
            
            await self._page.wait_for_selector("h1.job-title", timeout=10000)
            
            title = await self.get_text("h1.job-title")
            print(f"[CareerLink] [JOB] {title[:50]}...")
            
            short_location = await self.get_text("#job-location span")
            salary = await self.get_text("#job-salary span.text-primary")
            experience = await self.get_text("i.cli-suitcase-simple + span")
            
            # Parse postedAt
            raw_posted = await self.get_text("#job-date .date-from") or await self.get_text("#job-date")
            posted_at = ""
            if raw_posted:
                match = re.search(r"(\d{1,2})[-/](\d{1,2})[-/](\d{4})", raw_posted)
                if match:
                    posted_at = f"{match.group(1).zfill(2)}-{match.group(2).zfill(2)}-{match.group(3)}"
            
            # Parse deadline
            raw_deadline = await self.get_text(".day-expired b") or await self.get_text(".day-expired")
            deadline = ""
            if raw_deadline and posted_at:
                try:
                    days = int(re.search(r"(\d+)", raw_deadline).group(1))
                    posted_date = datetime.strptime(posted_at, "%d-%m-%Y")
                    deadline = (posted_date + timedelta(days=days)).strftime("%d-%m-%Y")
                except:
                    pass
            
            # Description
            desc_html = await self._page.evaluate("""
                () => {
                    const el = document.querySelector("#section-job-description .rich-text-content");
                    return el ? el.innerHTML : "";
                }
            """)
            if desc_html:
                desc_text = re.sub(r"<br\\s*/?>", "\\n", desc_html)
                description = re.sub(r"<[^>]+>", "", desc_text).strip()
            else:
                description = ""
            
            # Requirements
            req_nodes = await self._page.query_selector_all(".raw-content p, .raw-content li")
            requirement = "\\n".join([await self.get_text(node) for node in req_nodes])
            
            # Benefits
            ben_nodes = await self._page.query_selector_all(".job-benefit-item span")
            benefit = "\\n".join([await self.get_text(b) for b in ben_nodes])
            
            job_type = await self.get_text(".summary-label:has-text('Loại công việc') + div")
            location = await self.get_text(".contact-person li:has(i.cli-location)")
            
            # Company
            company_href = await self.get_attr(".company-info a", "href")
            company_link = urljoin(BASE_URL, company_href) if company_href else ""
            company = await self._crawl_company(company_link, location)
            
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
                    "workingTime": "",
                    "experienceYear": experience,
                    "postedAt": posted_at,
                    "deadline": deadline,
                    "sourcePlatform": "CareerLink",
                    "sourceLink": url,
                },
                "company": company,
            }
            
        except Exception as e:
            print(f"[CareerLink] Lỗi get_job_detail: {e}")
            import traceback
            traceback.print_exc()
            return None

    async def _crawl_company(self, url: str, location: str) -> dict:
        """Crawl company info"""
        if not url:
            return {
                "companyName": "Không rõ",
                "companyWebsite": "",
                "address": location,
                "companyLogo": "",
                "companySize": "",
                "companyProfile": "",
            }
        
        try:
            success = await self.goto(url)
            if not success:
                raise Exception("Cannot load company page")
            
            await self._page.wait_for_selector("h5.company-name", timeout=10000)
            
            company_name = await self.get_text("h5.company-name")
            logo_src = await self.get_attr("img.mw-100", "src")
            company_size = await self.get_text("[itemprop='numberOfEmployees']")
            
            profile_nodes = await self._page.query_selector_all(".company-profile p")
            company_profile = "\\n".join([await self.get_text(p) for p in profile_nodes])
            
            return {
                "companyName": company_name or "Không rõ",
                "companyWebsite": url,
                "address": location,
                "companyLogo": logo_src or "",
                "companySize": company_size or "",
                "companyProfile": company_profile,
            }
            
        except Exception as e:
            print(f"[CareerLink] Lỗi crawl company: {e}")
            return {
                "companyName": "Không rõ",
                "companyWebsite": url,
                "address": location,
                "companyLogo": "",
                "companySize": "",
                "companyProfile": "",
            }

    async def close(self):
        """Đóng browser"""
        if self._context:
            await self._context.close()