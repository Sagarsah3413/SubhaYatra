#!/usr/bin/env python3
"""
Initialize chat tables in the database
"""

import os
import sys
import sqlite3

def create_chat_tables():
    """Create chat and message tables"""
    
    print("🔄 Creating chat tables...")
    
    db_path = 'tourism.db'
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create chat table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR NOT NULL,
                title VARCHAR DEFAULT 'New Chat',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        print("✅ chat table created")
        
        # Create message table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS message (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chat_id INTEGER NOT NULL,
                sender VARCHAR NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (chat_id) REFERENCES chat (id)
            )
        ''')
        print("✅ message table created")
        
        # Ensure search_history table exists with correct structure
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS search_history (
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
        print("✅ search_history table created")
        
        conn.commit()
        
        # Verify tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [table[0] for table in cursor.fetchall()]
        print(f"📊 All tables: {', '.join(tables)}")
        
        conn.close()
        print("🎉 Chat tables initialized successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Chat Tables Initialization")
    print("=" * 40)
    
    success = create_chat_tables()
    
    if success:
        print("\n✅ Database is ready for chat functionality!")
    else:
        print("\n❌ Failed to initialize chat tables.")