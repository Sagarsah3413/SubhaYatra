#!/usr/bin/env python3
"""
Script to add sample places data for wishlist functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Place, Wishlist

def add_sample_places():
    """Add sample places data to the database"""
    print("🔄 Adding sample places data...")
    
    db = SessionLocal()
    try:
        # Check if places already exist
        existing_places = db.query(Place).count()
        if existing_places > 0:
            print(f"✅ Found {existing_places} existing places in database!")
            return
        
        # Sample places data for Nepal tourism
        sample_places = [
            Place(
                name="Everest Base Camp Trek",
                location="Solukhumbu, Nepal",
                type="trekking",
                description="Epic journey to the base of the world's highest mountain with stunning Himalayan views and Sherpa culture.",
                tags="trekking,mountains,adventure,everest,himalayas",
                image_url="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"
            ),
            Place(
                name="Annapurna Circuit Trek",
                location="Annapurna Region, Nepal",
                type="trekking",
                description="Classic trek through diverse landscapes from subtropical to alpine zones with breathtaking mountain views.",
                tags="trekking,circuit,mountains,annapurna,adventure",
                image_url="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
            ),
            Place(
                name="Chitwan National Park Safari",
                location="Chitwan, Nepal",
                type="wildlife",
                description="Wildlife adventure in Nepal's first national park with rhinos, tigers, and diverse bird species.",
                tags="wildlife,safari,nature,chitwan,animals",
                image_url="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800"
            ),
            Place(
                name="Kathmandu Durbar Square",
                location="Kathmandu, Nepal",
                type="heritage",
                description="Historic palace complex with ancient temples, courtyards, and traditional Newari architecture.",
                tags="heritage,culture,temples,kathmandu,history",
                image_url="https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800"
            ),
            Place(
                name="Pokhara Lakeside",
                location="Pokhara, Nepal",
                type="nature",
                description="Serene lakeside town with stunning mountain reflections, boating, and adventure activities.",
                tags="lake,nature,pokhara,mountains,relaxation",
                image_url="https://images.unsplash.com/photo-1544967882-6abaa7b2aa9b?w=800"
            ),
            Place(
                name="Langtang Valley Trek",
                location="Langtang, Nepal",
                type="trekking",
                description="Beautiful valley trek with Tamang culture, alpine forests, and spectacular mountain views.",
                tags="trekking,valley,culture,langtang,mountains",
                image_url="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800"
            ),
            Place(
                name="Bhaktapur Durbar Square",
                location="Bhaktapur, Nepal",
                type="heritage",
                description="Medieval city with well-preserved palaces, temples, and traditional pottery workshops.",
                tags="heritage,medieval,culture,bhaktapur,pottery",
                image_url="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800"
            ),
            Place(
                name="Gokyo Lakes Trek",
                location="Everest Region, Nepal",
                type="trekking",
                description="High-altitude trek to pristine turquoise lakes with views of Everest and surrounding peaks.",
                tags="trekking,lakes,everest,high-altitude,pristine",
                image_url="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
            ),
            Place(
                name="Bandipur Village",
                location="Bandipur, Nepal",
                type="culture",
                description="Charming hilltop village with preserved Newari architecture and panoramic mountain views.",
                tags="village,culture,newari,hilltop,traditional",
                image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ),
            Place(
                name="Rara Lake",
                location="Mugu, Nepal",
                type="nature",
                description="Nepal's largest lake surrounded by pristine forests and snow-capped mountains in remote western Nepal.",
                tags="lake,pristine,remote,nature,largest",
                image_url="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
            )
        ]
        
        # Add places to database
        db.add_all(sample_places)
        db.commit()
        
        print(f"✅ Added {len(sample_places)} sample places to database!")
        
        # Add some to demo user's wishlist
        demo_user_id = "demo_user_123"
        wishlist_places = sample_places[:3]  # First 3 places
        
        for place in wishlist_places:
            db.refresh(place)  # Get the ID after commit
            wishlist_item = Wishlist(
                user_id=demo_user_id,
                place_id=place.id
            )
            db.add(wishlist_item)
        
        db.commit()
        print(f"✅ Added {len(wishlist_places)} places to demo user's wishlist!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error adding sample data: {e}")
        return False
    finally:
        db.close()
    
    print("🎉 Sample places data added successfully!")
    return True

if __name__ == "__main__":
    add_sample_places()