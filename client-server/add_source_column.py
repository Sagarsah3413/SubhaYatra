"""
Migration script to add source column to hotels and restaurants tables
Run this script once to update the database schema
"""
import sqlite3
import os

# Get the database path
db_path = os.path.join(os.path.dirname(__file__), 'tourism.db')

def add_source_columns():
    """Add source column to hotels and restaurants tables if it doesn't exist"""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check and add source column to hotels table
        cursor.execute("PRAGMA table_info(hotels)")
        hotel_columns = [column[1] for column in cursor.fetchall()]
        
        if 'source' not in hotel_columns:
            print("Adding 'source' column to hotels table...")
            cursor.execute("ALTER TABLE hotels ADD COLUMN source TEXT DEFAULT 'dataset'")
            print("✓ Successfully added 'source' column to hotels table")
        else:
            print("✓ 'source' column already exists in hotels table")
        
        # Check and add source column to restaurants table
        cursor.execute("PRAGMA table_info(restaurants)")
        restaurant_columns = [column[1] for column in cursor.fetchall()]
        
        if 'source' not in restaurant_columns:
            print("Adding 'source' column to restaurants table...")
            cursor.execute("ALTER TABLE restaurants ADD COLUMN source TEXT DEFAULT 'dataset'")
            print("✓ Successfully added 'source' column to restaurants table")
        else:
            print("✓ 'source' column already exists in restaurants table")
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error adding source columns: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Database Migration: Add Source Column to Hotels & Restaurants")
    print("=" * 60)
    success = add_source_columns()
    print("=" * 60)
    if success:
        print("Migration completed successfully!")
        print("\nNote: All existing hotels and restaurants are marked as 'dataset'.")
        print("New submissions through AddPlace form will be marked as 'user_submission'.")
    else:
        print("Migration failed. Please check the error above.")
    print("=" * 60)
