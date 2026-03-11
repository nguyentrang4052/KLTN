import json
import time


def save_job(job):

    filename = f"jobs/job_{int(time.time())}.json"

    with open(filename, "w") as f:
        json.dump(job, f)

    print("Saved:", filename)