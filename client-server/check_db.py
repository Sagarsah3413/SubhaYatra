import sqlite3
import os

# Check both possible database locations
db_paths = [
    'tourism.db',
    'app/tourism.db'
]

for db_path in db_paths:
    if os.path.exists(db_path):
        print(f"📊 Found database: {db_path}")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [table[0] for table in cursor.fetchall()]
        print(f"Tables: {tables}")
        
        conn.close()
        break
else:
    print("❌ No database found. Need to create tables first.")