import asyncio
from scrapling.fetchers import AsyncFetcher
from utils.redis_client import push_job_url

BASE_URL = "https://www.topcv.vn/viec-lam"


async def crawl_topcv(page_num):

    url = f"{BASE_URL}?page={page_num}"

    fetcher = AsyncFetcher(headless=True)
    page = await fetcher.get(url)

    links = page.css("a::attr(href)").getall()

    for link in links:

        if "/viec-lam/" in link:

            job_url = f"https://www.topcv.vn{link}"
            
            print(job_url)

            push_job_url(job_url)


async def run():

    for page in range(1,5):

        await crawl_topcv(page)