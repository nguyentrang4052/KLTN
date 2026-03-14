import redis

r = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

def push_job_url(url):

    if r.sadd("job_urls", url):   # chống trùng
        r.lpush("job_queue", url)


def pop_job_url():

    item = r.brpop("job_queue")

    return item[1] if item else None


def push_raw_job(data):

    r.lpush("raw_jobs", data)


def pop_raw_job():

    item = r.brpop("raw_jobs")

    return item[1] if item else None