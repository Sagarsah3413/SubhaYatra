"""
Initialize Chat Database Tables
This script creates the necessary tables for the chat functionality.
"""

from app.database import db
from app.models import Chat, Message, SearchHistory
from app import create_app

def init_chat_tables():
    """Create chat-related tables in the database"""
    app = create_app()
    
    with app.app_context():
        print("Creating chat tables...")
        
        # Create all tables defined in the models
        db.create_all()
        
        print("✅ Chat tables created successfully!")
        print("Tables created:")
        print("  - chat")
        print("  - message")
        print("  - search_history")
        
        # Verify tables exist
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        
        print(f"\nAll tables in database: {tables}")
        
        if 'chat' in tables and 'message' in tables and 'search_history' in tables:
            print("\n✅ All chat tables verified!")
        else:
            print("\n⚠️ Warning: Some tables may be missing")

if __name__ == "__main__":
    init_chat_tables()
