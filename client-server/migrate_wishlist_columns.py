"""
Migration script to add missing columns to wishlists table
Run this once to update the database schema
"""
import sqlite3
import os

# Path to the database
db_path = os.path.join(os.path.dirname(__file__), 'tourism.db')

def migrate_wishlist_table():
    """Add missing columns to wishlists table"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check existing columns
        cursor.execute("PRAGMA table_info(wishlists)")
        existing_columns = [column[1] for column in cursor.fetchall()]
        print(f"Existing columns: {existing_columns}")
        
        columns_to_add = [
            ('place_identifier', 'TEXT'),
            ('place_name', 'TEXT'),
            ('place_type', 'TEXT'),
            ('place_location', 'TEXT'),
            ('place_image_url', 'TEXT'),
            ('place_description', 'TEXT')
        ]
        
        for column_name, column_type in columns_to_add:
            if column_name not in existing_columns:
                print(f"Adding '{column_name}' column...")
                cursor.execute(f"""
                    ALTER TABLE wishlists 
                    ADD COLUMN {column_name} {column_type}
                """)
                conn.commit()
                print(f"✓ {column_name} column added successfully!")
            else:
                print(f"✓ {column_name} column already exists")
        
        # Verify final schema
        cursor.execute("PRAGMA table_info(wishlists)")
        final_columns = cursor.fetchall()
        
        print("\n" + "="*50)
        print("Final wishlists table schema:")
        print("="*50)
        for col in final_columns:
            print(f"  {col[1]:<25} {col[2]:<10} {'NOT NULL' if col[3] else ''}")
        
        # Count wishlist items
        cursor.execute("SELECT COUNT(*) FROM wishlists")
        count = cursor.fetchone()[0]
        print(f"\nTotal wishlist items: {count}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Wishlist Table Migration Script")
    print("=" * 50)
    migrate_wishlist_table()
    print("=" * 50)
    print("Migration complete!")
