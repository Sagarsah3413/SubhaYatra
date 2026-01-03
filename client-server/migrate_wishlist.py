#!/usr/bin/env python3
"""
Migration script to add wishlist table to existing database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models import Wishlist
from sqlalchemy import text

def migrate_wishlist():
    """Add wishlist table to existing database"""
    print("🔄 Starting wishlist table migration...")
    
    try:
        # Check if wishlist table already exists
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='wishlists'"
            ))
            if result.fetchone():
                print("✅ Wishlist table already exists!")
                return
        
        # Create wishlist table
        Wishlist.__table__.create(engine, checkfirst=True)
        print("✅ Wishlist table created successfully!")
        
        # Add some sample wishlist data for demo user
        from app.database import SessionLocal
        from app.models import Place
        
        db = SessionLocal()
        try:
            # Get first 3 places from database
            places = db.query(Place).limit(3).all()
            
            if places:
                demo_user_id = "demo_user_123"
                for place in places:
                    wishlist_item = Wishlist(
                        user_id=demo_user_id,
                        place_id=place.id
                    )
                    db.add(wishlist_item)
                
                db.commit()
                print(f"✅ Added {len(places)} sample wishlist items for demo user!")
            else:
                print("⚠️ No places found in database. Add some places first.")
                
        except Exception as e:
            db.rollback()
            print(f"⚠️ Error adding sample data: {e}")
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    print("🎉 Wishlist migration completed successfully!")
    return True

if __name__ == "__main__":
    migrate_wishlist()