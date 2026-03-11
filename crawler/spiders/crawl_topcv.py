import requests
from bs4 import BeautifulSoup


def crawl_job(link):

    res = requests.get(link)

    soup = BeautifulSoup(res.text, "html.parser")

    job = {}

    job["title"] = soup.select_one(".job-title").text.strip()

    job["company"] = soup.select_one(".company-name").text.strip()

    job["location"] = soup.select_one(".job-location").text.strip()

    job["salary"] = soup.select_one(".salary").text.strip()

    job["description"] = soup.select_one(".job-description").text.strip()

    job["sourcePlatform"] = "TopCV"

    job["sourceLink"] = link

    return job