#!/usr/bin/env python3
"""
Migration script to add search history functionality to the chat system
"""

import os
import sys
from datetime import datetime
import sqlite3

def migrate_database():
    """Add search history table and update existing tables"""
    
    print("🔄 Starting database migration for search history...")
    
    # Connect to SQLite database
    db_path = os.path.join(os.path.dirname(__file__), 'tourism.db')
    if not os.path.exists(db_path):
        db_path = os.path.join(os.path.dirname(__file__), 'app', 'tourism.db')
    
    print(f"📊 Database path: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if search_history table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='search_history'")
        if not cursor.fetchone():
            print("📊 Creating search_history table...")
            cursor.execute('''
                CREATE TABLE search_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id VARCHAR NOT NULL,
                    chat_id INTEGER,
                    query VARCHAR NOT NULL,
                    query_type VARCHAR DEFAULT 'general',
                    response_summary TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_favorite BOOLEAN DEFAULT 0,
                    FOREIGN KEY (chat_id) REFERENCES chat (id)
                )
            ''')
            print("✅ search_history table created successfully!")
        else:
            print("✅ search_history table already exists")
        
        # Check if Chat table has new columns
        cursor.execute("PRAGMA table_info(chat)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'updated_at' not in columns:
            print("🔄 Adding updated_at column to chat table...")
            cursor.execute('ALTER TABLE chat ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP')
            print("✅ updated_at column added to chat table")
        
        if 'is_active' not in columns:
            print("🔄 Adding is_active column to chat table...")
            cursor.execute('ALTER TABLE chat ADD COLUMN is_active BOOLEAN DEFAULT 1')
            print("✅ is_active column added to chat table")
        
        # Update existing chats
        cursor.execute('UPDATE chat SET updated_at = created_at WHERE updated_at IS NULL')
        cursor.execute('UPDATE chat SET is_active = 1 WHERE is_active IS NULL')
        
        conn.commit()
        print("🎉 Database migration completed successfully!")
        
        # Verify tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [table[0] for table in cursor.fetchall()]
        print(f"📊 Available tables: {', '.join(tables)}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Chat Search History Migration Tool")
    print("=" * 50)
    
    success = migrate_database()
    
    if success:
        print("\n🎉 Migration completed successfully!")
        print("🔄 Restart your backend server to use the new features.")
    else:
        print("\n❌ Migration failed. Please check the errors above.")