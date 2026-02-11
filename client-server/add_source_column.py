"""
Migration script to add source column to places table
This distinguishes between dataset places and user submissions
"""
import sqlite3
import os

# Path to the database
db_path = os.path.join(os.path.dirname(__file__), 'tourism.db')

def add_source_column():
    """Add source column to places table if it doesn't exist"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if source column exists
        cursor.execute("PRAGMA table_info(places)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'source' not in columns:
            print("Adding 'source' column to places table...")
            # Add source column with default value 'dataset' for existing places
            cursor.execute("""
                ALTER TABLE places 
                ADD COLUMN source TEXT DEFAULT 'dataset'
            """)
            conn.commit()
            print("✓ Source column added successfully!")
            print("✓ All existing places marked as 'dataset'")
            
            # Count places by source
            cursor.execute("SELECT source, COUNT(*) FROM places GROUP BY source")
            counts = cursor.fetchall()
            print("\nCurrent distribution:")
            for source, count in counts:
                print(f"  - {source}: {count} places")
        else:
            print("✓ Source column already exists")
            
    except Exception as e:
        print(f"✗ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Place Source Migration Script")
    print("=" * 50)
    add_source_column()
    print("=" * 50)
    print("Migration complete!")
