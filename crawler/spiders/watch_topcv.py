import requests
from bs4 import BeautifulSoup
from utils.redis_client import redis_client

URL = "https://www.topcv.vn/tim-viec-lam"


def watch_topcv():

    res = requests.get(URL)

    soup = BeautifulSoup(res.text, "html.parser")

    jobs = soup.select(".job-item a")

    for job in jobs:

        link = job["href"]

        key = f"seen:{link}"

        if not redis_client.exists(key):

            redis_client.set(key, 1, ex=3600)

            redis_client.lpush("queue:jobs", link)

            print("New job detected:", link)