import json
from utils.redis_client import pop_raw_job
from cleaner.clean_topcv import clean
from db import save_job


while True:

    raw = pop_raw_job()

    if not raw:
        continue

    data = json.loads(raw)

    job = clean(data["html"])

    job["url"] = data["url"]

    save_job(job)