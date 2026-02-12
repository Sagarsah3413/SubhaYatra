cd"""
Migration script to add status column to places table
Run this once to update the database schema
"""
import sqlite3
import os

# Path to the database
db_path = os.path.join(os.path.dirname(__file__), 'tourism.db')

def add_status_column():
    """Add status column to places table if it doesn't exist"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if status column exists
        cursor.execute("PRAGMA table_info(places)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'status' not in columns:
            print("Adding 'status' column to places table...")
            # Add status column with default value 'approved' for existing places
            cursor.execute("""
                ALTER TABLE places 
                ADD COLUMN status TEXT DEFAULT 'approved'
            """)
            conn.commit()
            print("✓ Status column added successfully!")
            print("✓ All existing places set to 'approved' status")
        else:
            print("✓ Status column already exists")
            
    except Exception as e:
        print(f"✗ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Place Status Migration Script")
    print("=" * 50)
    add_status_column()
    print("=" * 50)
    print("Migration complete!")
