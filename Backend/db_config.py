import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="blue_store",
        user="postgres",
        password="090909"
    )
