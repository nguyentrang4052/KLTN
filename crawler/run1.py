import time
from spiders.watch_topcv import watch_topcv
from worker import start_worker
import threading


def watcher_loop():

    while True:

        watch_topcv()

        time.sleep(30)


threading.Thread(target=watcher_loop).start()

start_worker()  