"""
Add travel_month column to recommendations table
"""
import sqlite3
import os

def add_travel_month_column():
    # Find database
    db_paths = [
        'client-server/app/tourism.db',
        'app/tourism.db',
        'tourism.db',
        'instance/tourism.db',
        'client-server/instance/tourism.db'
    ]
    
    db_path = None
    for path in db_paths:
        if os.path.exists(path):
            db_path = path
            break
    
    if not db_path:
        print("❌ Database not found")
        return
    
    print(f"📂 Found database at: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if recommendations table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='recommendations'")
        if not cursor.fetchone():
            print("⚠️  Recommendations table doesn't exist yet - it will be created when first recommendation is made")
            print("✅ No migration needed")
            return
        
        # Check if column already exists
        cursor.execute("PRAGMA table_info(recommendations)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'travel_month' in columns:
            print("✅ Column 'travel_month' already exists")
        else:
            # Add the column
            cursor.execute("""
                ALTER TABLE recommendations 
                ADD COLUMN travel_month TEXT
            """)
            conn.commit()
            print("✅ Added 'travel_month' column to recommendations table")
        
        # Verify
        cursor.execute("PRAGMA table_info(recommendations)")
        print("\n📋 Current recommendations table structure:")
        for col in cursor.fetchall():
            print(f"   {col[1]} ({col[2]})")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("="*60)
    print("ADDING TRAVEL_MONTH COLUMN TO RECOMMENDATIONS TABLE")
    print("="*60)
    add_travel_month_column()
