#!/usr/bin/env python3
"""
Initialize Flask-SQLAlchemy database tables for chat functionality
"""

import os
import sys

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.app import create_app
from app.database import db
from app.models import Chat, Message, SearchHistory

def init_flask_db():
    """Initialize Flask-SQLAlchemy database tables"""
    print("🚀 Flask Database Initialization")
    print("=" * 40)
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        print("🔄 Creating Flask-SQLAlchemy tables...")
        
        # Create all tables
        db.create_all()
        
        # Check if tables were created
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        print(f"📊 Available tables: {', '.join(tables)}")
        
        # Verify chat tables exist
        chat_tables = ['chat', 'message', 'search_history']
        missing_tables = [table for table in chat_tables if table not in tables]
        
        if missing_tables:
            print(f"❌ Missing tables: {', '.join(missing_tables)}")
            return False
        else:
            print("✅ All chat tables created successfully!")
            
            # Test database connection
            try:
                # Try to query each table using db.session
                chat_count = db.session.query(Chat).count()
                message_count = db.session.query(Message).count()
                search_count = db.session.query(SearchHistory).count()
                
                print(f"📈 Table counts:")
                print(f"   - Chats: {chat_count}")
                print(f"   - Messages: {message_count}")
                print(f"   - Search History: {search_count}")
                
                print("🎉 Flask database initialized successfully!")
                return True
                
            except Exception as e:
                print(f"❌ Error testing database: {e}")
                return False

if __name__ == "__main__":
    success = init_flask_db()
    if success:
        print("\n✅ Database is ready for chat functionality!")
    else:
        print("\n❌ Database initialization failed!")
        sys.exit(1)