from bs4 import BeautifulSoup

def clean(data):

    soup = BeautifulSoup(data["html"], "lxml")

    title = soup.select_one("h1")
    company = soup.select_one(".company-name")
    location = soup.select_one(".job-location")

    job = {

        "title": title.text.strip() if title else "",
        "company": company.text.strip() if company else "",
        "location": location.text.strip() if location else "",
        "url": data["url"]

    }

    return job