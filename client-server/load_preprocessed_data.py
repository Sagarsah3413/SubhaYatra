#!/usr/bin/env python3
"""
Script to load preprocessed dataset into the database
"""

import sys
import os
import csv
import json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Place, Hotel, Restaurant, Attraction

def clean_text(text):
    """Clean and format text data"""
    if not text or text.strip() == '' or text.upper() == 'NO':
        return None
    return text.strip()

def parse_price_range(price_text):
    """Parse price range from text"""
    if not price_text or price_text.upper() == 'NO':
        return None
    
    price_mapping = {
        'Low (~$10–20)': 'budget',
        'Medium (~$35–60)': 'mid-range', 
        'High (~$90+)': 'luxury'
    }
    
    return price_mapping.get(price_text, 'mid-range')

def parse_images(image_path_text):
    """Parse semicolon-separated image paths"""
    if not image_path_text or image_path_text.upper() == 'NO':
        return []
    
    # Split by semicolon and clean paths
    paths = [path.strip() for path in image_path_text.split(';') if path.strip()]
    return paths

def load_preprocessed_dataset():
    """Load the preprocessed dataset into database"""
    print("🔄 Loading preprocessed dataset...")
    
    db = SessionLocal()
    try:
        # Clear existing data
        print("🗑️ Clearing existing data...")
        db.query(Place).delete()
        db.query(Hotel).delete()
        db.query(Restaurant).delete()
        db.query(Attraction).delete()
        db.commit()
        
        dataset_path = os.path.join(os.path.dirname(__file__), 'datasets', 'dataset_with_all_image_path.csv')
        
        if not os.path.exists(dataset_path):
            print(f"❌ Dataset file not found: {dataset_path}")
            return False
        
        places_added = 0
        hotels_added = 0
        restaurants_added = 0
        
        with open(dataset_path, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            for row in reader:
                try:
                    # Extract destination data
                    destination_id = int(row['destination_id'])
                    destination_name = clean_text(row['destination'])
                    district = clean_text(row['district'])
                    best_season = clean_text(row['best_season'])
                    tags = clean_text(row['tags'])
                    main_category = clean_text(row['main_category'])
                    activities = clean_text(row['activities'])
                    difficulty_level = clean_text(row['difficulty_level'])
                    accessibility = clean_text(row['accessibility'])
                    latitude = float(row['latitude']) if row['latitude'] else None
                    longitude = float(row['longitude']) if row['longitude'] else None
                    province = clean_text(row['province'])
                    description = clean_text(row['description'])
                    transportation = clean_text(row['transportation'])
                    
                    # Parse destination images
                    destination_images = parse_images(row.get('destination_image_path', ''))
                    main_image = destination_images[0] if destination_images else None
                    
                    # Create Place (Destination/Attraction)
                    place = Place(
                        name=destination_name,
                        location=f"{district}, Nepal",
                        type=main_category.lower().replace(' & ', '_').replace(' ', '_') if main_category else 'attraction',
                        description=description,
                        tags=tags.lower().replace(' ', ',') if tags else '',
                        image_url=main_image,
                        latitude=latitude,
                        longitude=longitude,
                        best_season=best_season,
                        activities=activities,
                        difficulty_level=difficulty_level,
                        accessibility=accessibility,
                        transportation=transportation,
                        province=province,
                        all_images=json.dumps(destination_images) if destination_images else None
                    )
                    db.add(place)
                    db.flush()  # Get the ID
                    places_added += 1
                    
                    # Add Hotels (up to 3 per destination)
                    for i in range(1, 4):
                        hotel_name = clean_text(row.get(f'hotel_name_{i}'))
                        if hotel_name:
                            hotel_location = clean_text(row.get(f'hotel_location_{i}'))
                            hotel_review = clean_text(row.get(f'hotel_review_short_{i}'))
                            hotel_rating = row.get(f'hotel_rating_approx_{i}')
                            hotel_price = parse_price_range(row.get(f'hotel_price_{i}'))
                            hotel_images = parse_images(row.get(f'hotel{i}_image_path', ''))
                            
                            hotel = Hotel(
                                name=hotel_name,
                                location=hotel_location or f"{district}, Nepal",
                                description=hotel_review or f"Quality accommodation in {destination_name}",
                                tags=f"hotel,{district.lower()},{destination_name.lower().replace(' ', ',')}",
                                image_url=hotel_images[0] if hotel_images else None,
                                rating=float(hotel_rating) if hotel_rating and hotel_rating != 'NO' else None,
                                price_range=hotel_price,
                                place_id=place.id,
                                all_images=json.dumps(hotel_images) if hotel_images else None
                            )
                            db.add(hotel)
                            hotels_added += 1
                    
                    # Add Restaurants (up to 3 per destination)
                    for i in range(1, 4):
                        restaurant_name = clean_text(row.get(f'restaurant_name_{i}'))
                        if restaurant_name:
                            restaurant_location = clean_text(row.get(f'restaurant_location_name_{i}'))
                            restaurant_rating = row.get(f'restaurant_rating_{i}')
                            restaurant_price = parse_price_range(row.get(f'restaurant_price_range_{i}'))
                            restaurant_images = parse_images(row.get(f'restaurant{i}_image_path', ''))
                            
                            restaurant = Restaurant(
                                name=restaurant_name,
                                location=restaurant_location or f"{district}, Nepal",
                                description=f"Local dining experience in {destination_name}",
                                tags=f"restaurant,{district.lower()},{destination_name.lower().replace(' ', ',')}",
                                image_url=restaurant_images[0] if restaurant_images else None,
                                rating=float(restaurant_rating) if restaurant_rating and restaurant_rating != 'NO' else None,
                                price_range=restaurant_price,
                                place_id=place.id,
                                all_images=json.dumps(restaurant_images) if restaurant_images else None
                            )
                            db.add(restaurant)
                            restaurants_added += 1
                    
                except Exception as e:
                    print(f"⚠️ Error processing row {row.get('destination_id', 'unknown')}: {e}")
                    continue
        
        # Commit all changes
        db.commit()
        
        print(f"✅ Successfully loaded preprocessed dataset!")
        print(f"📍 Places added: {places_added}")
        print(f"🏨 Hotels added: {hotels_added}")
        print(f"🍽️ Restaurants added: {restaurants_added}")
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error loading dataset: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = load_preprocessed_dataset()
    if success:
        print("🎉 Dataset loading completed successfully!")
    else:
        print("💥 Dataset loading failed!")