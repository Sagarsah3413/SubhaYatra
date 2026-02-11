"""
Migration: Add travel_month column to recommendations table
"""
import sqlite3
import os

def migrate():
    # Try multiple possible database locations
    possible_paths = [
        'tourism.db',
        'client-server/tourism.db',
        'app/tourism.db',
        'client-server/app/tourism.db',
        'instance/tourism.db',
        'client-server/instance/tourism.db'
    ]
    
    db_path = None
    for path in possible_paths:
        if os.path.exists(path):
            db_path = path
            break
    
    if not db_path:
        print("❌ Database not found in any expected location")
        print("Searched:")
        for path in possible_paths:
            print(f"  - {path}")
        return
    
    print(f"📂 Migrating database: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if recommendations table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='recommendations'")
        if not cursor.fetchone():
            print("✅ Recommendations table doesn't exist yet - will be created with travel_month column")
            conn.close()
            return
        
        # Check current columns
        cursor.execute("PRAGMA table_info(recommendations)")
        columns = [col[1] for col in cursor.fetchall()]
        
        print(f"\n📋 Current columns: {', '.join(columns)}")
        
        if 'travel_month' in columns:
            print("✅ Column 'travel_month' already exists - no migration needed")
        else:
            print("\n🔧 Adding 'travel_month' column...")
            cursor.execute("ALTER TABLE recommendations ADD COLUMN travel_month TEXT")
            conn.commit()
            print("✅ Successfully added 'travel_month' column")
            
            # Verify
            cursor.execute("PRAGMA table_info(recommendations)")
            new_columns = [col[1] for col in cursor.fetchall()]
            print(f"\n📋 Updated columns: {', '.join(new_columns)}")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    print("="*70)
    print("DATABASE MIGRATION: Add travel_month to recommendations")
    print("="*70)
    migrate()
    print("\n✅ Migration complete!")
