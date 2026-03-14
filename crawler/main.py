import asyncio
from spiders.spiders_topcv import run

async def main():

    while True:

        await run()

        await asyncio.sleep(600)


asyncio.run(main())