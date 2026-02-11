import sqlite3
import os

paths = ['tourism.db', 'client-server/tourism.db', 'app/tourism.db', 'client-server/app/tourism.db']

for path in paths:
    if os.path.exists(path):
        print(f"\n📂 Found: {path}")
        conn = sqlite3.connect(path)
        cursor = conn.cursor()
        
        # List all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print(f"Tables: {[t[0] for t in tables]}")
        
        # Check recommendations table
        if ('recommendations',) in tables:
            print("\n⚠️ RECOMMENDATIONS TABLE EXISTS!")
            cursor.execute("PRAGMA table_info(recommendations)")
            cols = cursor.fetchall()
            print("Recommendations columns:")
            for col in cols:
                print(f"  - {col[1]} ({col[2]})")
            
            # Count records
            cursor.execute("SELECT COUNT(*) FROM recommendations")
            count = cursor.fetchone()[0]
            print(f"\nRecords: {count}")
        
        conn.close()
