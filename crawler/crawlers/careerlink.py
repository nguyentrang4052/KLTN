import asyncio
import re
import random
from datetime import datetime, timedelta
from urllib.parse import urljoin
from playwright.async_api import Browser
from .base import BaseCrawler

BASE_URL = "https://www.careerlink.vn"

class CareerLinkCrawler(BaseCrawler):
    def __init__(self, playwright):
        self.playwright = playwright
        self._browser: Browser | None = None

    async def _get_browser(self) -> Browser:
        if not self._browser:
            self._browser = await self.playwright.chromium.launch(
                headless=True, # Nếu vẫn không ra, hãy đổi thành False để kiểm tra tận mắt
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                ]
            )
        return self._browser

    async def _new_page(self):
        browser = await self._get_browser()
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            viewport={"width": 1440, "height": 900}
        )
        page = await ctx.new_page()
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        return page

    async def _goto_and_wait(self, page, url: str):
        try:
            # Không dùng networkidle vì CareerLink có nhiều script tracking gây treo
            await page.goto(url, timeout=60000, wait_until="load")
            
            # Giả lập cuộn chuột từ từ để trang load danh sách job
            for i in range(3):
                await page.mouse.wheel(0, 400)
                await asyncio.sleep(0.5)
            
            await asyncio.sleep(random.uniform(2, 3))
            return True
        except Exception as e:
            print(f"[CareerLink] Lỗi truy cập: {e}")
            return False

    async def get_categories(self, query: str = "") -> list[dict]:
        page = await self._new_page()
        categories = []
        try:
            ok = await self._goto_and_wait(page, BASE_URL)
            print("ALLOOOOOOOOOOOOOOOOO")
            if not ok: 
                print("[CareerLink] ❌ Không thể truy cập trang chủ")
                return []

            # Lấy categories từ trang chủ
            await page.wait_for_selector(".categories-section", timeout=10000)
            print("ĐÃ TẢI XONG TRANG CHỦ, BẮT ĐẦU LẤY DANH SÁCH CATEGORIES")
            # cats = await page.evaluate("""
            #     () => {
            #         const results = [];
            #         document.querySelectorAll(".categories-section a.clickable-outside").forEach(a => {
            #             const h5 = a.querySelector("h5");
            #             if (h5) results.push({ name: h5.innerText.trim(), href: a.getAttribute("href") });
            #         });
            #         return results;
            #     }
            # """)

            cats = await page.evaluate("""
                () => {
                    const map = new Map();
                    document.querySelectorAll(".categories-section a.clickable-outside").forEach(a => {
                        const name = a.querySelector("h5")?.innerText.trim();
                        const href = a.getAttribute("href");
                        if (name && href && !map.has(href)) {
                            map.set(href, { name, href });
                        }
                    });
                    return Array.from(map.values());
                }
                """)
            for item in cats:
                categories.append({"name": item["name"], "url": urljoin(BASE_URL, item["href"])})
        finally:
            await page.context.close()

        if query:
            categories = [c for c in categories if query.lower() in c["name"].lower()]
        print(f"[CareerLink] Danh sách categories: {[c['name'] for c in categories]}")
        return categories

    # async def get_job_links(self, category: dict, max_pages: int = 2) -> list[str]:
    #     combined_links = []
    #     url = category["url"]
    #     page_count = 0
    #     page = await self._new_page()

    #     try:
    #         while page_count <= max_pages:
    #             print(f"[CareerLink] Thử lấy link tại: {url}")
    #             ok = await self._goto_and_wait(page, url)
    #             if not ok: break

    #             # Chờ container job xuất hiện
    #             try:
    #                 await page.wait_for_selector("a.job-link", timeout=10000)
                    
    #             except:
    #                 # Nếu không thấy thẻ a.job-link, thử lấy toàn bộ thẻ a có chứa /tim-viec-lam/
    #                 pass

    #             # Trích xuất link bằng Javascript (mạnh mẽ hơn selector của Playwright)
    #             pairs = await page.evaluate("""
    #                 () => {
    #                     const data = [];
    #                     // Tìm tất cả các link job có class job-link hoặc nằm trong danh sách job
    #                     const links = document.querySelectorAll("a.job-link, .media-body a[href*='/tim-viec-lam/']");
    #                     links.forEach(a => {
    #                         const href = a.getAttribute("href");
    #                         if (href && href.includes("/tim-viec-lam/") && !href.includes("/tim-viec-lam/c")) {
    #                             // Tìm link công ty đi kèm
    #                             const container = a.closest(".media-body");
    #                             const compA = container ? container.querySelector("a.job-company") : null;
    #                             data.push({
    #                                 job: href,
    #                                 company: compA ? compA.getAttribute("href") : ""
    #                             });
    #                         }
    #                     });
    #                     return data;
    #                 }
    #             """)
                
    #             if not pairs:
    #                 print(f"[CareerLink] ❌ Vẫn không tìm thấy link nào tại {category['name']}")
    #                 break

    #             for p in pairs:
    #                 j_url = urljoin(BASE_URL, p['job']).split('?')[0]
    #                 c_url = urljoin(BASE_URL, p['company']) if p['company'] else ""
    #                 pair = f"{j_url}|{c_url}"
    #                 if pair not in combined_links:
    #                     combined_links.append(pair)

    #             # Chuyển trang
    #             next_btn = await page.query_selector("a[rel='next']")
    #             if not next_btn: break
    #             url = urljoin(BASE_URL, await next_btn.get_attribute("href"))
    #             page_count += 1
    #     finally:
    #         print(f"[CareerLink] Trang {page_count}: +{len(combined_links)} jobs")
    #         await page.context.close()
        
    #     return combined_links

    async def get_job_links(self, category: dict, max_pages: int = 0) -> list[str]:
        ctx_page = await self._new_page()
        page = ctx_page  # vì bạn đang return page thôi

        combined_links = []
        seen = set()

        url = category["url"]
        page_num = 1

        try:
            while True:
                if max_pages > 0 and page_num > max_pages:
                    break

                # ✅ LOG GIỐNG CAREERVIET
                print(f"[CareerLink] Page {page_num}")

                ok = await self._goto_and_wait(page, url)
                if not ok:
                    break

                try:
                    await page.wait_for_selector("a.job-link", timeout=10000)
                except:
                    pass

                pairs = await page.evaluate(""" ... """)

                if not pairs:
                    print("[CareerLink] ❌ Không còn job")
                    break

                before = len(combined_links)

                for p in pairs:
                    j_url = urljoin(BASE_URL, p['job']).split('?')[0]
                    c_url = urljoin(BASE_URL, p['company']) if p['company'] else ""
                    pair = f"{j_url}|{c_url}"

                    if pair not in seen:
                        seen.add(pair)
                        combined_links.append(pair)

                added = len(combined_links) - before

                # ✅ LOG GIỐNG TOPCV
                print(f"[CareerLink] Trang {page_num}: +{added} jobs")

                # next page
                next_btn = await page.query_selector("a[rel='next']")
                if not next_btn:
                    print("[CareerLink] ✅ Hết trang")
                    break

                url = urljoin(BASE_URL, await next_btn.get_attribute("href"))
                page_num += 1
                # chống block nhẹ
                await asyncio.sleep(random.uniform(1.5, 3))

                # 🛡️ safeguard (rất nên có)
                if page_num > 200:
                    print("[CareerLink] ⚠️ Stop at 200 pages")
                    break

        finally:
            await page.context.close()

        print(f"[CareerLink] {category['name']}: {len(combined_links)} jobs")
        return combined_links
    

    async def get_job_detail(self, combined_url: str, industry: str) -> dict:
        if "|" in combined_url:
            job_url, company_url = combined_url.split("|")
        else:
            job_url, company_url = combined_url, ""

        page = await self._new_page()
        try:
            ok = await self._goto_and_wait(page, job_url)
            if not ok: return None

            await page.wait_for_selector("h1.job-title", timeout=10000)

            title = (await page.inner_text("h1.job-title")).strip()
            salary = await page.evaluate("() => document.querySelector('#job-salary span.text-primary')?.innerText.trim() || 'Thỏa thuận'")
            experience = await page.evaluate("() => document.querySelector('i.cli-suitcase-simple + span')?.innerText.trim() || ''")
            
            # Ngày đăng
            date_text = await page.evaluate("() => document.querySelector('#job-date .date-from')?.innerText || ''")
            m = re.search(r"\d{2}-\d{2}-\d{4}", date_text)
            posted_at = m.group() if m else ""

            # Hạn nộp
            deadline = ""
            deadline_text = await page.evaluate("() => document.querySelector('.day-expired b')?.innerText || ''")
            if posted_at and deadline_text:
                days_m = re.search(r"(\d+)", deadline_text)
                if days_m:
                    dt = datetime.strptime(posted_at, "%d-%m-%Y") + timedelta(days=int(days_m.group(1)))
                    deadline = dt.strftime("%d-%m-%Y")

            description = await page.evaluate("() => document.querySelector('#section-job-description .rich-text-content')?.innerText.trim() || ''")
            requirement = await page.evaluate("() => document.querySelector('#section-job-skills .rich-text-content')?.innerText.trim() || ''")
            benefit = await page.evaluate("""
                    () => {
                        return Array.from(document.querySelectorAll('#section-job-benefits .job-benefit-item span'))
                            .map(el => el.innerText.trim())
                            .join('\\n');
                    }
                    """)
            job_type = await page.evaluate("""() => {
                        const labels = Array.from(document.querySelectorAll('.summary-label'));
                        const el = labels.find(e => e.innerText.includes('Loại công việc'));
                        return el?.nextElementSibling?.innerText.trim() || '';
                    }
                    """)
            
            # Thông tin công ty
            short_location = await page.evaluate("() => document.querySelector('#job-location span')?.innerText.trim() || ''")
            location = await page.evaluate("() => document.querySelector('.contact-person li:has(i.cli-location)')?.innerText.trim() || ''")

            company_data = {"companyName": "Không rõ", "companyWebsite": company_url, "address": location or short_location}
            if company_url:
                try:
                    await page.goto(company_url, wait_until="domcontentloaded", timeout=20000)
                    await page.wait_for_selector("h5.company-name", timeout=10000)
                    company_data.update({
                        "companyName": (await page.inner_text("h5.company-name")).strip(),
                        "companyLogo": await page.get_attribute("img.mw-100", "src") or "",
                        "companySize": await page.evaluate("() => document.querySelector('[itemprop=numberOfEmployees]')?.innerText.trim() || ''"),
                        "companyProfile": await page.evaluate("() => document.querySelector('.company-profile')?.innerText.trim() || ''")
                    })
                except: pass

            return {
                "industry": industry,
                "job": {
                    "title": title,
                    "shortLocation": short_location,
                    "location": location or short_location,
                    "salary": salary,
                    "description": description,
                    "requirement": requirement,
                    "benefit": benefit,
                    "jobType": job_type,
                    "experienceYear": experience,
                    "postedAt": posted_at,
                    "deadline": deadline,
                    "sourcePlatform": "CareerLink",
                    "sourceLink": job_url,
                },
                "company": company_data
            }
        except:
            return None
        finally:
            await page.context.close()

    async def close(self):
        if self._browser:
            await self._browser.close()












    async def get_job_links_for_page(self, category: dict, page: int) -> tuple[list[str], bool]:
        url = category["url"]
        
        if page > 1:
            if "?" in url:
                url = f"{url}&page={page}"
            else:
                url = f"{url}?page={page}"
        
        print(f"[CareerLink Debug] Truy cập: {url}")
        
        page_obj = await self._new_page()
        combined_links = []
        
        try:
            ok = await self._goto_and_wait(page_obj, url)
            if not ok:
                print(f"[CareerLink Debug] Không thể truy cập")
                return [], False

            # Chờ selector
            try:
                await page_obj.wait_for_selector("a.job-link", timeout=10000)
            except:
                print(f"[CareerLink Debug] Không tìm thấy a.job-link")

            pairs = await page_obj.evaluate("""
                () => {
                    const data = [];
                    const links = document.querySelectorAll("a.job-link, .media-body a[href*='/tim-viec-lam/']");
                    links.forEach(a => {
                        const href = a.getAttribute("href");
                        if (href && href.includes("/tim-viec-lam/") && !href.includes("/tim-viec-lam/c")) {
                            const container = a.closest(".media-body");
                            const compA = container ? container.querySelector("a.job-company") : null;
                            data.push({
                                job: href,
                                company: compA ? compA.getAttribute("href") : ""
                            });
                        }
                    });
                    return data;
                }
            """)

            print(f"[CareerLink Debug] Tìm thấy {len(pairs)} pairs")

            for p in pairs:
                j_url = urljoin(BASE_URL, p['job']).split('?')[0]
                c_url = urljoin(BASE_URL, p['company']) if p['company'] else ""
                pair = f"{j_url}|{c_url}"
                combined_links.append(pair)

            # Check next
            has_next = False
            try:
                next_btn = await page_obj.query_selector("a[rel='next']")
                has_next = next_btn is not None
            except:
                pass

            return combined_links, has_next

        except Exception as e:
            print(f"[CareerLink] Lỗi page {page}: {e}")
            return [], False
        finally:
            await page_obj.context.close()






    async def search_by_keyword(self, keyword: str, page: int = 1) -> tuple[list[str], bool]:
        """Search CareerLink: /viec-lam?keyword=..."""
        if not keyword:
            return await self.get_categories("")
        
        page_obj = await self._new_page()
        
        try:
            # CareerLink dùng query param
            url = f"https://www.careerlink.vn/viec-lam?keyword={keyword.replace(' ', '+')}&page={page}"
            
            print(f"[CareerLink Search] Truy cập: {url}")
            
            ok = await self._goto_and_wait(page_obj, url)
            if not ok:
                return [], False
            
            # Lấy links
            pairs = await page_obj.evaluate("""
                () => {
                    const data = [];
                    document.querySelectorAll("a.job-link").forEach(a => {
                        const href = a.getAttribute("href");
                        if (href && href.includes("/tim-viec-lam/")) {
                            data.push({job: href});
                        }
                    });
                    return data;
                }
            """)
            
            links = []
            for p in pairs:
                j_url = urljoin(BASE_URL, p['job']).split('?')[0]
                if j_url not in links:
                    links.append(j_url)
            
            has_next = len(links) >= 20  # CareerLink thường 20-25 job/page
            
            print(f"[CareerLink Search] Tìm thấy {len(links)} jobs")
            return links, has_next
            
        except Exception as e:
            print(f"[CareerLink Search] ❌ Lỗi: {e}")
            return [], False
        finally:
            await page_obj.context.close()