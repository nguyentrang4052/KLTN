from utils.redis_client import redis_client
from spiders.crawl_topcv import crawl_job
from utils.dedup import is_duplicate
from utils.save_jobs import save_job


def start_worker():

    print("Worker started")

    while True:

        job = redis_client.brpop("queue:jobs")

        link = job[1]

        data = crawl_job(link)

        if is_duplicate(data):

            print("Duplicate job skip")

            continue

        save_job(data)