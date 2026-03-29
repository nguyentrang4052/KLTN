import asyncio
import re
import json
import os
from datetime import datetime, timedelta
from urllib.parse import urljoin
from playwright.async_api import Browser, TimeoutError as PlaywrightTimeout
from .base import BaseCrawler

BASE_URL = "https://www.careerlink.vn"
COOKIES_FILE = "careerlink_cookies.json"


class CareerLinkCrawler(BaseCrawler):

    def __init__(self, playwright):
        self.playwright = playwright
        self._browser: Browser | None = None

    async def _browser_(self):
        if not self._browser:
            self._browser = await self.playwright.chromium.launch(
                headless=False,
                args=["--disable-blink-features=AutomationControlled"]
            )
        return self._browser

    async def _new_context_and_page(self):
        """Tạo context và page mới - giống code gốc"""
        browser = await self._browser_()
        
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="vi-VN"
        )

        # Load cookies nếu có
        if os.path.exists(COOKIES_FILE):
            try:
                with open(COOKIES_FILE, "r", encoding="utf-8") as f:
                    await context.add_cookies(json.load(f))
            except:
                pass

        page = await context.new_page()
        
        # Stealth script giống code gốc
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
        """)

        return context, page

    async def _save_cookies(self, context):
        try:
            cookies = await context.cookies()
            with open(COOKIES_FILE, "w", encoding="utf-8") as f:
                json.dump(cookies, f, ensure_ascii=False, indent=2)
        except:
            pass

    async def _random_sleep(self, min_sec=1, max_sec=2):
        await asyncio.sleep(__import__('random').uniform(min_sec, max_sec))

    async def is_captcha(self, page):
        content = await page.content()
        content_lower = content.lower()
        return "hcaptcha" in content_lower or "không phải robot" in content_lower or "cloudflare" in content_lower

    async def goto(self, page, url, retry=2, timeout=60000):
        """Goto với retry - giống code gốc"""
        for attempt in range(retry):
            try:
                await page.goto(url, timeout=timeout)
                await self._random_sleep(1, 2)
                
                if not await self.is_captcha(page):
                    return True
                    
                print(f"[CareerLink] ⚠️ Captcha attempt {attempt+1}, đợi...")
                await asyncio.sleep(3)
                
            except Exception as e:
                print(f"[CareerLink] Lỗi goto attempt {attempt+1}: {e}")
                if attempt == retry - 1:
                    return False
                await asyncio.sleep(2)
        
        return False

    async def get_text(self, element):
        try:
            return (await element.inner_text()).strip()
        except:
            return ""

    async def get_attr(self, element, attr):
        try:
            return await element.get_attribute(attr)
        except:
            return None

    # =========================
    # STEP 1: CATEGORIES
    # =========================
    async def get_categories(self, query: str = "") -> list[dict]:
        context, page = await self._new_context_and_page()
        categories = []
        
        try:
            print("[CareerLink] Đang lấy categories...")
            
            success = await self.goto(page, BASE_URL)
            if not success:
                print("[CareerLink] ❌ Không thể load trang chủ")
                return []
            
            # Selector GIỐNG CODE GỐC
            await page.wait_for_selector(".categories-section", timeout=10000)
            
            items = await page.query_selector_all(
                ".categories-section .slick-slide:not(.slick-cloned) a.clickable-outside"
            )
            
            print(f"[CareerLink] Tìm thấy {len(items)} category items")
            
            seen = set()
            for item in items:
                try:
                    # Lấy name từ h5.h4 hoặc span - giống code gốc
                    name_el = await item.query_selector("h5.h4")
                    if not name_el:
                        name_el = await item.query_selector("span")
                    
                    name = await self.get_text(name_el)
                    href = await self.get_attr(item, "href")
                    
                    if href:
                        link = urljoin(BASE_URL, href)
                        if link not in seen and name:
                            seen.add(link)
                            categories.append({"name": name, "url": link})
                except Exception as e:
                    print(f"[CareerLink]   Lỗi parse item: {e}")
                    continue
                    
        except Exception as e:
            print(f"[CareerLink] ❌ Lỗi get_categories: {e}")
        finally:
            await self._save_cookies(context)
            await context.close()

        if query and categories:
            q = query.lower()
            categories = [c for c in categories if q in c["name"].lower()]
        
        print(f"[CareerLink] ✅ {len(categories)} categories")
        return categories

    # =========================
    # STEP 2: JOB LINKS
    # =========================
    async def get_job_links(self, category: dict, max_pages: int = 2) -> list[str]:
        context, page = await self._new_context_and_page()
        job_links = []
        seen = set()
        url = category["url"]
        page_count = 0
        
        try:
            while page_count < max_pages:
                print(f"[CareerLink] Đang lấy trang {page_count + 1}: {url[:60]}...")
                
                success = await self.goto(page, url)
                if not success:
                    break
                
                # Selector GIỐNG CODE GỐC
                try:
                    await page.wait_for_selector("ul.list-group", timeout=10000)
                except:
                    print("[CareerLink] Không tìm thấy list-group, thử selector khác...")
                    try:
                        await page.wait_for_selector(".job-list, .job-item", timeout=5000)
                    except:
                        break
                
                # Selector GIỐNG CODE GỐC
                items = await page.query_selector_all("a.job-link.clickable-outside")
                
                if not items:
                    # Fallback
                    items = await page.query_selector_all("a[href*='/viec-lam/']")
                
                print(f"[CareerLink]   Tìm thấy {len(items)} job items")
                
                for item in items:
                    href = await self.get_attr(item, "href")
                    if href:
                        link = urljoin(BASE_URL, href)
                        if link not in seen:
                            seen.add(link)
                            job_links.append(link)
                
                page_count += 1
                
                # Next page - GIỐNG CODE GỐC
                next_btn = await page.query_selector("a[rel='next'].page-link")
                if not next_btn:
                    print("[CareerLink]   Không có next page")
                    break
                    
                next_href = await self.get_attr(next_btn, "href")
                if not next_href:
                    break
                    
                url = urljoin(BASE_URL, next_href)
                await self._random_sleep(2, 3)
                
        except Exception as e:
            print(f"[CareerLink] Lỗi get_job_links: {e}")
        finally:
            await self._save_cookies(context)
            await context.close()
        
        print(f"[CareerLink] Tổng: {len(job_links)} links")
        return job_links

    # =========================
    # STEP 3: JOB DETAIL - ĐÃ SỬA ĐỦ FIELD
    # =========================
    def _clean_date_text(self, text: str) -> str:
        if not text:
            return ""
        
        # bỏ label
        text = re.sub(r"Ngày đăng tuyển", "", text, flags=re.IGNORECASE)
        
        # bỏ xuống dòng + space thừa
        text = re.sub(r"\s+", " ", text)
        
        return text.strip()
    
    def _parse_deadline(self, posted_at: str, days_text: str) -> str:
        try:
            if not posted_at or not days_text:
                return ""

            match = re.search(r"(\d+)", days_text)
            if not match:
                return ""

            days = int(match.group(1))

            posted_date = datetime.strptime(posted_at, "%d-%m-%Y")
            deadline_date = posted_date + timedelta(days=days)

            return deadline_date.strftime("%d-%m-%Y")

        except Exception as e:
            print(f"[CareerLink] Lỗi parse deadline: {e}")
            return ""
        
    async def get_job_detail(self, url: str, industry: str) -> dict:
        context, page = await self._new_context_and_page()
        
        try:
            success = await self.goto(page, url)
            if not success:
                return None
            
            # Selector GIỐNG CODE GỐC
            await page.wait_for_selector("h1.job-title", timeout=10000)
            
            title = await self.get_text(await page.query_selector("h1.job-title"))
            print(f"[CareerLink] [JOB] {title[:50]}...")
            
            # === LẤY TẤT CẢ FIELD THEO CODE GỐC ===
            
            # shortLocation - từ #job-location span
            short_location = await self.get_text(await page.query_selector("#job-location span"))
            
            # salary - từ #job-salary span.text-primary
            salary = await self.get_text(await page.query_selector("#job-salary span.text-primary"))
            
            # experienceYear - từ i.cli-suitcase-simple + span
            experience = await self.get_text(await page.query_selector("i.cli-suitcase-simple + span"))
            
                # === FIX: PARSE postedAt VỚI NHIỀU FORMAT ===
            posted_at = ""
            raw_posted = ""
            
            # Thử nhiều selectors
            posted_selectors = [
                "#job-date .date-from",
                "#job-date",
                ".date-from",
                ".posted-date",
                "[class*='posted']",
                ".job-date"
            ]
            
            for sel in posted_selectors:
                try:
                    el = await page.query_selector(sel)
                    if el:
                        raw_posted = await self.get_text(el)
                        if raw_posted:
                            break
                except:
                    continue
            
            # Parse với nhiều patterns
            if raw_posted:
            # dd-mm-yyyy
                match = re.search(r"(\d{1,2})-(\d{1,2})-(\d{4})", raw_posted)
                if match:
                    posted_at = f"{match.group(1).zfill(2)}-{match.group(2).zfill(2)}-{match.group(3)}"
                else:
                    # dd/mm/yyyy
                    match = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", raw_posted)
                    if match:
                        posted_at = f"{match.group(1).zfill(2)}-{match.group(2).zfill(2)}-{match.group(3)}"
                    else:
                        # yyyy-mm-dd
                        match = re.search(r"(\d{4})-(\d{1,2})-(\d{1,2})", raw_posted)
                        if match:
                            posted_at = f"{match.group(3).zfill(2)}-{match.group(2).zfill(2)}-{match.group(1)}"
                        
                    
            # === FIX: PARSE deadline ===
            deadline = ""
            raw_deadline = ""
            
            # Thử nhiều selectors cho deadline
            deadline_selectors = [
                ".day-expired b",
                ".day-expired",
                ".deadline",
                "[class*='expire']",
                "[class*='deadline']",
                ".job-deadline"
            ]
            
            for sel in deadline_selectors:
                try:
                    el = await page.query_selector(sel)
                    if el:
                        raw_deadline = await self.get_text(el)
                        if raw_deadline:
                            break
                except:
                    continue
            
            # Parse deadline
            if raw_deadline and posted_at:
                deadline = self._parse_deadline(posted_at, raw_deadline)
            
            
            # description - GIỐNG CODE GỐC
            content = await page.query_selector("#section-job-description .rich-text-content")
            if content:
                li_nodes = await content.query_selector_all("li")
                if li_nodes:
                    description = "\\n".join([f"- {await self.get_text(li)}" for li in li_nodes])
                else:
                    raw_html = await content.inner_html()
                    raw_html = re.sub(r"<br\\s*/?>", "\\n", raw_html)
                    description = re.sub(r"<[^>]+>", "", raw_html).strip()
            else:
                description = ""
            
            # requirement - GIỐNG CODE GỐC: .raw-content p, .raw-content li
            req_nodes = await page.query_selector_all(".raw-content p, .raw-content li")
            requirement = "\\n".join([await self.get_text(node) for node in req_nodes])
            
            # benefit - GIỐNG CODE GỐC: .job-benefit-item span
            ben_nodes = await page.query_selector_all(".job-benefit-item span")
            benefit = "\\n".join([await self.get_text(b) for b in ben_nodes])
            
            # jobType - GIỐNG CODE GỐC: .summary-label:has-text('Loại công việc') + div
            job_type = await self.get_text(
                await page.query_selector(".summary-label:has-text('Loại công việc') + div")
            )
            
            # location - GIỐNG CODE GỐC: .contact-person li:has(i.cli-location)
            location_container = await page.query_selector(".contact-person li:has(i.cli-location)")
            location = await self.get_text(location_container)
            
            # Company - GIỐNG CODE GỐC
            company_link_el = await page.query_selector(".company-info a")
            company_href = await self.get_attr(company_link_el, "href") if company_link_el else ""
            company_link = urljoin(BASE_URL, company_href)
            
            company = await self._crawl_company(context, company_link, location)
            
            # === RETURN ĐỦ TẤT CẢ FIELD ===
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
                    "other": "",  # Field này không có trong code gốc, để trống
                    "jobType": job_type,
                    "workingTime": "",  # Field này không có trong code gốc, để trống
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
        finally:
            await self._save_cookies(context)
            await context.close()


    async def _crawl_company(self, context, url: str, location: str) -> dict:
        """Crawl company - GIỐNG CODE GỐC"""
        page = await context.new_page()
        
        try:
            success = await self.goto(page, url)
            if not success:
                raise Exception("Cannot load company page")
            
            await page.wait_for_selector("h5.company-name", timeout=10000)
            
            # === LẤY TẤT CẢ FIELD COMPANY THEO CODE GỐC ===
            company_name = await self.get_text(await page.query_selector("h5.company-name"))
            logo_src = await self.get_attr(await page.query_selector("img.mw-100"), "src")
            company_size = await self.get_text(await page.query_selector("[itemprop='numberOfEmployees']"))
            
            profile_nodes = await page.query_selector_all(".company-profile p")
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
        finally:
            await page.close()