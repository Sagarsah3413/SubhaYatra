import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'datasets', 'nepal_tourism.db')
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("Tables in database:")
for table in tables:
    print(f"  - {table[0]}")

conn.close()
