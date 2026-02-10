"""
Database migration script to add missing columns
Run this to update the database schema
"""

import sqlite3
import os

# Path to the database
DB_PATH = "tourism.db"

def migrate_database():
    """Add missing columns to existing tables"""
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Database file not found: {DB_PATH}")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        print("🔄 Starting database migration...")
        
        # Check if places table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='places'")
        if not cursor.fetchone():
            print("⚠️  Places table doesn't exist. Creating new database...")
            conn.close()
            return
        
        # Get current columns in places table
        cursor.execute("PRAGMA table_info(places)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"📋 Current columns in places table: {', '.join(columns)}")
        
        # Add missing columns
        migrations_applied = 0
        
        # Add rating column if missing
        if 'rating' not in columns:
            print("➕ Adding 'rating' column to places table...")
            cursor.execute("ALTER TABLE places ADD COLUMN rating REAL")
            migrations_applied += 1
            print("   ✅ Added 'rating' column")
        
        # Add all_images column if missing
        if 'all_images' not in columns:
            print("➕ Adding 'all_images' column to places table...")
            cursor.execute("ALTER TABLE places ADD COLUMN all_images TEXT")
            migrations_applied += 1
            print("   ✅ Added 'all_images' column")
        
        # Add created_at column if missing
        if 'created_at' not in columns:
            print("➕ Adding 'created_at' column to places table...")
            cursor.execute("ALTER TABLE places ADD COLUMN created_at TEXT")
            migrations_applied += 1
            print("   ✅ Added 'created_at' column")
        
        # Add status column if missing
        if 'status' not in columns:
            print("➕ Adding 'status' column to places table...")
            cursor.execute("ALTER TABLE places ADD COLUMN status TEXT DEFAULT 'approved'")
            migrations_applied += 1
            print("   ✅ Added 'status' column")
        
        # Add source column if missing
        if 'source' not in columns:
            print("➕ Adding 'source' column to places table...")
            cursor.execute("ALTER TABLE places ADD COLUMN source TEXT DEFAULT 'dataset'")
            migrations_applied += 1
            print("   ✅ Added 'source' column")
        
        conn.commit()
        
        if migrations_applied > 0:
            print(f"\n✅ Migration completed! Applied {migrations_applied} changes.")
        else:
            print("\n✅ Database is up to date. No migrations needed.")
        
        # Verify the changes
        cursor.execute("PRAGMA table_info(places)")
        updated_columns = [row[1] for row in cursor.fetchall()]
        print(f"\n📋 Updated columns in places table: {', '.join(updated_columns)}")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {str(e)}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Database Migration Script")
    print("=" * 60)
    print()
    
    migrate_database()
    
    print()
    print("=" * 60)
    print("Migration process completed!")
    print("You can now restart the backend server.")
    print("=" * 60)
