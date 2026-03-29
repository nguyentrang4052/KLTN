"""
crawlers/careerviet.py — Async adapter từ career_viet.py gốc.
Mỗi platform có browser riêng để tránh conflict.
"""
import asyncio
from random import random
import re
import json
import os
from urllib.parse import urljoin
from playwright.async_api import Browser, TimeoutError as PlaywrightTimeout
from .base import BaseCrawler
import unicodedata

BASE_URL = "https://careerviet.vn"
COOKIES_FILE = "careerviet_cookies.json"


class CareerVietCrawler(BaseCrawler):

    def __init__(self, playwright):
        self.playwright = playwright
        self._browser: Browser | None = None

    async def _browser_(self) -> Browser:
        if not self._browser:
            self._browser = await self.playwright.chromium.launch(
                headless=True,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                ]
            )
        return self._browser

    async def _new_page(self):
        browser = await self._browser_()
        ctx = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            locale="vi-VN",
            viewport={"width": 1280, "height": 800},
            timezone_id="Asia/Ho_Chi_Minh",
        )
        
        if os.path.exists(COOKIES_FILE):
            try:
                with open(COOKIES_FILE, "r", encoding="utf-8") as f:
                    await ctx.add_cookies(json.load(f))
            except:
                pass
        
        page = await ctx.new_page()
        await page.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
        )
        return ctx, page

    async def _save_cookies(self, ctx):
        try:
            cookies = await ctx.cookies()
            with open(COOKIES_FILE, "w", encoding="utf-8") as f:
                json.dump(cookies, f, ensure_ascii=False, indent=2)
        except:
            pass

    async def _random_wait(self, min_ms=500, max_ms=1200):
        await asyncio.sleep(random.uniform(min_ms, max_ms) / 1000)

    # =========================
    # STEP 1: CATEGORIES
    # =========================
    async def get_categories(self, query: str = "") -> list[dict]:
        ctx, page = await self._new_page()
        categories = []
        seen = set()

        try:
            await page.goto(BASE_URL, timeout=30000, wait_until="domcontentloaded")
            await page.wait_for_timeout(1000)

            for _ in range(10):
                try:
                    btn = await page.query_selector(".swiper-next")
                    if btn:
                        await btn.click()
                        await page.wait_for_timeout(400)
                except:
                    break

            items = await page.query_selector_all(".career-key .item a")
            
            for item in items:
                try:
                    name = (await item.inner_text()).strip()
                    href = await item.get_attribute("href")
                    url = urljoin(BASE_URL, href)
                    
                    if url not in seen and name:
                        seen.add(url)
                        categories.append({"name": name, "url": url})
                except:
                    continue

        except Exception as e:
            print(f"[CareerViet] Lỗi get_categories: {e}")
        finally:
            await self._save_cookies(ctx)
            await ctx.close()

        if query:
            q = query.lower()
            categories = [c for c in categories if q in c["name"].lower()]

        print(f"[CareerViet] {len(categories)} categories")
        return categories

    # =========================
    # STEP 2: JOB LINKS
    # =========================
    async def get_job_links(self, category: dict, max_pages: int = 2) -> list[str]:
        ctx, page = await self._new_page()
        job_links = []
        seen = set()
        
        try:
            await page.goto(category["url"], timeout=30000, wait_until="domcontentloaded")

            # ✅ FIX 1: scroll để trigger lazy load
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(1000)

            # ✅ FIX 2: wait đúng element (QUAN TRỌNG NHẤT)
            await page.wait_for_function(
                "() => document.querySelectorAll('a.job_link').length > 0",
                timeout=15000
            )

            page_num = 1
            
            while True:
                if max_pages > 0 and page_num > max_pages:
                    break

                print(f"[CareerViet] Page {page_num}")

                # scroll mỗi page
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await page.wait_for_timeout(800)

                job_nodes = await page.query_selector_all("a.job_link")

                for job in job_nodes:
                    try:
                        href = await job.get_attribute("href")
                        if not href:
                            continue
                            
                        job_link = urljoin(BASE_URL, href)

                        # ✅ FIX 3: bỏ filter /viec-lam/
                        if job_link not in seen:
                            seen.add(job_link)
                            job_links.append(job_link)

                    except:
                        continue

                # ===== PAGINATION =====
                next_page_num = page_num + 1

                page_btn = await page.query_selector(
                    f".pagination li a:has-text('{next_page_num}')"
                )

                if not page_btn:
                    break

                try:
                    first_job_before = await page.get_attribute("a.job_link", "href")

                    await page_btn.click()

                    # ✅ FIX 4: wait page change đúng cách
                    await page.wait_for_function(
                        """(oldLink) => {
                            const el = document.querySelector('a.job_link');
                            return el && el.getAttribute('href') !== oldLink;
                        }""",
                        arg=first_job_before,
                        timeout=10000,
                    )

                    page_num += 1

                except:
                    break

        except Exception as e:
            print(f"[CareerViet] Lỗi get_job_links: {e}")
        finally:
            await self._save_cookies(ctx)
            await ctx.close()

        print(f"[CareerViet] {category.get('name', 'unknown')}: {len(job_links)} links")
        return job_links

    # =========================
    # STEP 3: JOB DETAIL
    # =========================
    def _clean_section_text(self, text: str) -> str:
        if not text:
            return ""

        patterns = [
            r"^\s*MÔ TẢ CÔNG VIỆC\s*:?\s*",
            r"^\s*YÊU CẦU CÔNG VIỆC\s*:?\s*",
            r"^\s*THÔNG TIN KHÁC\s*:?\s*",
            r"^\s*JOB DESCRIPTION\s*:?\s*",
            r"^\s*REQUIREMENT[S]?\s*:?\s*",
            r"^\s*ADDITIONAL INFORMATION\s*:?\s*",
        ]

        for p in patterns:
            text = re.sub(p, "", text, flags=re.IGNORECASE)

        return text.strip()
    async def get_job_detail(self, url: str, industry: str) -> dict:
        ctx, page = await self._new_page()
        
        try:
            await page.goto(url, timeout=30000, wait_until="networkidle")
            
            await page.wait_for_selector(
                "h1.title, .head-right h2, .head-left .title h2, "
                ".intro_job h1, .apply-now-content h1",
                timeout=30000
            )

            async def gt(sel, default=""):
                try:
                    el = await page.query_selector(sel)
                    return (await el.inner_text()).strip() if el else default
                except:
                    return default

            # Title multi-layout
            title = ""
            for sel in [
                "h1.title", ".head-right h2", ".head-left .title h2",
                ".head-left h2", ".intro_job h1", ".apply-now-content h1"
            ]:
                title = await gt(sel)
                if title:
                    break

            # Location
            short_location = await gt(".info-place-detail .place") or await gt(".bg-blue .map a")
            location = await gt(".info-place-detail span")

            # Fields
            posted_at = await gt("li:has-text('Ngày cập nhật') p")
            job_type = await gt("li:has-text('Hình thức') p")
            salary = await gt("li:has-text('Lương') p")
            experience = await gt("li:has-text('Kinh nghiệm') p")
            deadline = await gt("li:has-text('Hết hạn nộp') p")

            # Table layout
            table_data = await self._parse_info_table(page)
            salary = salary or table_data.get("lương", "")
            job_type = job_type or table_data.get("hình thức", "")
            experience = experience or table_data.get("kinh nghiệm", "")
            deadline = deadline or table_data.get("hết hạn nộp", "")
            posted_at = posted_at or table_data.get("ngày cập nhật", "")

            # Fallback
            if not salary:
                salary = await gt(".box-info .green strong, .green")
            if not experience:
                experience = await gt(".DetailJobNew li:has-text('Kinh nghiệm') p")
            if not deadline:
                deadline = await gt(".DetailJobNew li:has-text('Hết hạn nộp') p")

            # Benefit
            benefit_nodes = await page.query_selector_all(".welfare-list li, .right-welfares li")
            benefit = "\n".join([
                (await b.inner_text()).strip()
                for b in benefit_nodes if await b.inner_text()
            ])

            # Description/Requirement/Other

            description = requirement = other = ""
            
            sections = await page.query_selector_all(".full-content")
            for section in sections:
                title_nodes = await section.query_selector_all(".title-icon, h3.detail-title")
                
                for title_node in title_nodes:
                    try:
                        t = (await title_node.inner_text()).lower().strip()
                        
                        content_block_handle = await title_node.evaluate_handle(
                            """(el) => {
                                let next = el.nextElementSibling;
                                while (next) {
                                    if (next.classList && next.classList.contains('detail-row'))
                                        return next;
                                    next = next.nextElementSibling;
                                }
                                return null;
                            }"""
                        )
                        content_block = content_block_handle.as_element()
                        if not content_block:
                            continue
                        
                        nodes = await content_block.query_selector_all("p, li, br")
                        text = "\n".join([
                            (await n.inner_text()).strip()
                            for n in nodes if await n.inner_text()
                        ]).strip()
                        
                        if not text:
                            text = await content_block.inner_text()
                        
                        if any(k in t for k in ["mô tả", "job summary", "description"]):
                            description = text
                        elif any(k in t for k in ["yêu cầu", "requirement"]):
                            requirement = text
                        elif any(k in t for k in ["thông tin khác", "additional"]):
                            other = text
                    except:
                        continue

            # Fallback
            if not description or not requirement:
                blocks = await page.query_selector_all(".detail-row")
                for block in blocks:
                    try:
                        t_el = await block.query_selector(".detail-title")
                        t = (await t_el.inner_text()).lower().strip() if t_el else ""
                        text = await block.inner_text()
                        
                        if "mô tả" in t:
                            description = description or text
                        elif "yêu cầu" in t:
                            requirement = requirement or text
                        elif "thông tin khác" in t:
                            other = other or text
                    except:
                        continue


            # Company
            company_name = ""
            company_url = ""

            company_a = await page.query_selector(
                ".company-info a.company-name, "
                ".logo-company a, "
                ".company-name a, "
                "a.company-name"
            )

            if company_a:
                company_name = (await company_a.inner_text()).strip()
                href = await company_a.get_attribute("href")
                if href:
                    company_url = urljoin(BASE_URL, href)

            # 🚀 fallback nếu không có link
            if not company_name:
                company_name = await gt(".company-info .company-name") or "Không rõ"

            company = await self._crawl_company(company_url)

            # 🚀 ensure name luôn có
            if not company.get("companyName"):
                company["companyName"] = company_name or "Không rõ"

            return {
                "industry": industry,
                "job": {
                    "title": title,
                    "shortLocation": short_location,
                    "location": location,
                    "salary": salary,
                    "description": self._clean_section_text(description),
                    "requirement": self._clean_section_text(requirement),
                    "other": self._clean_section_text(other),
                    "benefit": benefit,
                    "jobType": job_type,
                    "workingTime": "",
                    "experienceYear": experience,
                    "postedAt": posted_at,
                    "deadline": deadline,
                    "sourcePlatform": "CareerViet",
                    "sourceLink": url,
                },
                "company": company,
            }
        finally:
            await self._save_cookies(ctx)
            await ctx.close()

    async def _parse_info_table(self, page) -> dict:
        data = {}
        try:
            rows = await page.query_selector_all(".box-info table tr")
            for row in rows:
                try:
                    key_el = await row.query_selector("td.name")
                    val_el = await row.query_selector("td.content")
                    if key_el and val_el:
                        key = (await key_el.inner_text()).lower().strip().rstrip(":")
                        key = re.sub(r"\s+", " ", key)
                        data[key] = (await val_el.inner_text()).strip()
                except:
                    continue
        except:
            pass
        return data

    # =========================
    # STEP 4: COMPANY
    # =========================
    async def _crawl_company(self, url: str) -> dict:
        if not url:
            return {"companyName": "Không rõ", "companyWebsite": ""}

        ctx, page = await self._new_page()
        
        try:
            await page.goto(url, timeout=30000, wait_until="networkidle")
            # await page.wait_for_selector(".company-info, #cp_company_name", timeout=10000)
            try:
                await page.wait_for_selector(
                    ".company-info, #cp_company_name",
                    timeout=20000
                )
            except:
                # retry lần 2 (nhiều page load chậm)
                await page.wait_for_timeout(2000)
                await page.wait_for_selector(
                    ".company-info, #cp_company_name",
                    timeout=10000
                )

            async def gt(sel, default=""):
                try:
                    el = await page.query_selector(sel)
                    return (await el.inner_text()).strip() if el else default
                except:
                    return default

            # Name
            name = await gt(".company-info h1.name") or await gt("#cp_company_name") or await gt(".company-info .company-name")

            # Size
            size = ""
            size_node = await page.query_selector("li:has-text('Quy mô')")
            if size_node:
                size = (await size_node.inner_text()).split(":")[-1].strip()
            
            if not size:
                size_node = await page.query_selector("#cp_company_name + ul li span:has-text('Quy mô')")
                if size_node:
                    raw = await size_node.inner_text()
                    m = re.search(r"(\d[\d\.\-]*)", raw)
                    if m:
                        size = m.group(1)
            
            if size and "nhân viên" not in size.lower():
                size = f"{size} nhân viên"

            # Logo
            logo = ""
            for sel in [".company-info .img img", ".logo img"]:
                img = await page.query_selector(sel)
                if img:
                    src = await img.get_attribute("src") or ""
                    if "url=" in src:
                        m = re.search(r"url=(.*?)&", src)
                        logo = m.group(1).replace("%3A", ":").replace("%2F", "/") if m else src
                    else:
                        logo = src
                    if logo:
                        break

            # Profile
            profile = ""
            for sel in [
                    ".intro-section-1 .main-text",
                    ".cp_aboutus_item_content .content_fck p, .cp_aboutus_item_content .content_fck li",
                    ".text.main-color-3"
                ]:
                nodes = await page.query_selector_all(sel)
                if nodes:
                    profile = "\n".join([(await n.inner_text()).strip() for n in nodes])
                    if profile:
                        break

            # Address
            address = ""
            for sel in [".company-info .content p", "#cp_company_name + ul li:first-child", ".company-info .company-location"]:
                address = await gt(sel)
                if address:
                    address = re.sub(r"Địa chỉ", "", address, flags=re.IGNORECASE).strip()
                    break

            return {
                "companyName": name or "Không rõ",
                "companyWebsite": url,
                "address": address,
                "companyLogo": logo,
                "companySize": size,
                "companyProfile": profile,
            }
        except Exception as e:
            print(f"[CareerViet] Lỗi company {url} - {name or 'Không rõ'}: {e}")
            return {"companyName": "Không rõ", "companyWebsite": url}
        finally:
            await self._save_cookies(ctx)
            await ctx.close()