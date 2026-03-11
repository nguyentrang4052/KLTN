import hashlib
from utils.redis_client import redis_client


def generate_job_hash(job):

    key = (
        str(job.get("title","")) +
        str(job.get("company","")) +
        str(job.get("location",""))
    )

    return hashlib.sha256(key.encode()).hexdigest()


def is_duplicate(job):

    job_hash = generate_job_hash(job)

    if redis_client.exists(job_hash):
        return True

    redis_client.set(job_hash,1,ex=2592000)

    return False