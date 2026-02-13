"""
Migration script to add status column to hotels and restaurants tables
Run this script to add the status column for approval workflow
"""

import sqlite3
import os

# Path to the database (same as in database.py)
DB_PATH = os.path.join(os.path.dirname(__file__), 'tourism.db')

def add_status_columns():
    """Add status column to hotels and restaurants tables"""
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at: {DB_PATH}")
        print("Please run the application first to create the database.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if status column exists in hotels table
        cursor.execute("PRAGMA table_info(hotels)")
        hotels_columns = [column[1] for column in cursor.fetchall()]
        
        if 'status' not in hotels_columns:
            print("Adding status column to hotels table...")
            cursor.execute("""
                ALTER TABLE hotels 
                ADD COLUMN status TEXT DEFAULT 'approved'
            """)
            print("✓ Status column added to hotels table")
        else:
            print("✓ Status column already exists in hotels table")
        
        # Check if status column exists in restaurants table
        cursor.execute("PRAGMA table_info(restaurants)")
        restaurants_columns = [column[1] for column in cursor.fetchall()]
        
        if 'status' not in restaurants_columns:
            print("Adding status column to restaurants table...")
            cursor.execute("""
                ALTER TABLE restaurants 
                ADD COLUMN status TEXT DEFAULT 'approved'
            """)
            print("✓ Status column added to restaurants table")
        else:
            print("✓ Status column already exists in restaurants table")
        
        # Commit changes
        conn.commit()
        print("\n✅ Migration completed successfully!")
        
        # Show summary
        cursor.execute("SELECT COUNT(*) FROM hotels")
        hotels_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM restaurants")
        restaurants_count = cursor.fetchone()[0]
        
        print(f"\nDatabase Summary:")
        print(f"  - Hotels: {hotels_count}")
        print(f"  - Restaurants: {restaurants_count}")
        
    except sqlite3.Error as e:
        print(f"❌ Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Adding Status Column to Hotels and Restaurants Tables")
    print("=" * 60)
    print(f"Database path: {DB_PATH}")
    add_status_columns()
