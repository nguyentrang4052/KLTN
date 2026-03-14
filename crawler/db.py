import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="RecruitmentDB",
    user="postgres",
    password="123456"
)

cur = conn.cursor()


def save_job(job):

    cur.execute(
        """
        INSERT INTO job (title, company, location, sourceLink)
        VALUES (%s,%s,%s,%s)
        ON CONFLICT (url) DO NOTHING
        """,
        (
            job["title"],
            job["company"],
            job["location"],
            job["url"]
        )
    )

    conn.commit()