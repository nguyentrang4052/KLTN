import redis
import json
import asyncio
from scrapling.fetchers import AsyncFetcher

r = redis.Redis(host="redis", port=6379)

async def worker():

    while True:

        job_url = r.brpop("topcv_job_queue")[1].decode()

        fetcher = AsyncFetcher()
        page = await fetcher.get(job_url)

        data = {
            "url": job_url,
            "html": page.html
        }

        r.lpush("topcv_raw_jobs", json.dumps(data))


asyncio.run(worker())