"""
Script to completely reset the database and reload data
"""
import sqlite3
import os

def reset_database():
    db_path = 'app/tourism.db'
    if not os.path.exists(db_path):
        db_path = 'tourism.db'
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("🔧 Resetting database...")
    
    # Drop all tables
    tables = ['events', 'restaurants', 'hotels', 'places']
    for table in tables:
        try:
            cursor.execute(f"DROP TABLE IF EXISTS {table}")
            print(f"✅ Dropped {table} table")
        except Exception as e:
            print(f"⚠️  Error dropping {table}: {e}")
    
    # Recreate places table
    cursor.execute("""
        CREATE TABLE places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL,
            location VARCHAR,
            type VARCHAR,
            description TEXT,
            tags VARCHAR,
            image_url VARCHAR,
            latitude REAL,
            longitude REAL,
            best_season VARCHAR,
            activities TEXT,
            difficulty_level VARCHAR,
            accessibility TEXT,
            transportation TEXT,
            province VARCHAR,
            rating REAL,
            all_images TEXT,
            created_at VARCHAR
        )
    """)
    print("✅ Created places table")
    
    # Recreate hotels table
    cursor.execute("""
        CREATE TABLE hotels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL,
            location VARCHAR,
            description TEXT,
            tags VARCHAR,
            image_url VARCHAR,
            rating REAL,
            price_range VARCHAR,
            place_id INTEGER,
            all_images TEXT,
            FOREIGN KEY (place_id) REFERENCES places(id)
        )
    """)
    print("✅ Created hotels table")
    
    # Recreate restaurants table
    cursor.execute("""
        CREATE TABLE restaurants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL,
            location VARCHAR,
            description TEXT,
            tags VARCHAR,
            image_url VARCHAR,
            rating REAL,
            price_range VARCHAR,
            place_id INTEGER,
            all_images TEXT,
            FOREIGN KEY (place_id) REFERENCES places(id)
        )
    """)
    print("✅ Created restaurants table")
    
    # Recreate events table
    cursor.execute("""
        CREATE TABLE events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL,
            venue VARCHAR,
            month_season VARCHAR,
            event_type VARCHAR,
            description TEXT,
            place_id INTEGER,
            FOREIGN KEY (place_id) REFERENCES places(id)
        )
    """)
    print("✅ Created events table")
    
    conn.commit()
    conn.close()
    
    print("\n✅ Database reset completed!")
    print("\nNow run: python load_dataset_simple.py")

if __name__ == "__main__":
    print("="*60)
    print("RESET DATABASE")
    print("="*60)
    reset_database()
