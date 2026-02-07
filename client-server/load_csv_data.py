"""
Load data from dataset_with_all_image_path.csv into separate tables:
- Places (destinations)
- Hotels (hotel_name_1, hotel_name_2, hotel_name_3)
- Restaurants (restaurant_name_1, restaurant_name_2, restaurant_name_3)
"""

import csv
import json
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app.models import Place, Hotel, Restaurant

def load_data_from_csv():
    """Load data from CSV into database tables"""
    
    # Initialize database
    init_db()
    
    session = SessionLocal()
    
    try:
        # Get the correct path relative to this script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(script_dir, "datasets", "dataset_with_all_image_path.csv")
        
        if not os.path.exists(csv_path):
            print(f"❌ CSV file not found: {csv_path}")
            return
        
        print(f"📂 Reading CSV file: {csv_path}")
        
        places_count = 0
        hotels_count = 0
        restaurants_count = 0
        
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                # Extract place data
                destination_name = row.get('destination', '').strip()
                if not destination_name:
                    continue
                
                # Parse destination images
                dest_images = []
                if row.get('destination_image_path'):
                    dest_images = [img.strip() for img in row['destination_image_path'].split(';') if img.strip()]
                
                # Helper function to parse coordinates
                def parse_coordinate(coord_str):
                    if not coord_str:
                        return None
                    try:
                        # Remove degree symbol and convert
                        return float(coord_str.replace('°', '').strip())
                    except:
                        return None
                
                # Create Place
                place = Place(
                    name=destination_name,
                    location=row.get('district', ''),
                    type=row.get('main_category', ''),
                    description=row.get('description', ''),
                    tags=row.get('tags', ''),
                    image_url=dest_images[0] if dest_images else None,
                    latitude=parse_coordinate(row.get('latitude')),
                    longitude=parse_coordinate(row.get('longitude')),
                    best_season=row.get('best_season', ''),
                    activities=row.get('activities', ''),
                    difficulty_level=row.get('difficulty_level', ''),
                    accessibility=row.get('accessibility', ''),
                    transportation=row.get('transportation', ''),
                    province=row.get('province', ''),
                    all_images=json.dumps(dest_images) if dest_images else None
                )
                session.add(place)
                session.flush()  # Get the place ID
                places_count += 1
                
                # Create Hotels (hotel_name_1, hotel_name_2, hotel_name_3)
                for i in range(1, 4):
                    hotel_name = row.get(f'hotel_name_{i}', '').strip()
                    if hotel_name and hotel_name != 'NO':
                        # Parse hotel images
                        hotel_images = []
                        if row.get(f'hotel{i}_image_path'):
                            hotel_images = [img.strip() for img in row[f'hotel{i}_image_path'].split(';') if img.strip()]
                        
                        hotel = Hotel(
                            name=hotel_name,
                            location=row.get(f'hotel_location_{i}', ''),
                            description=row.get(f'hotel_review_short_{i}', ''),
                            tags='',
                            image_url=hotel_images[0] if hotel_images else None,
                            rating=float(row[f'hotel_rating_approx_{i}']) if row.get(f'hotel_rating_approx_{i}') and row[f'hotel_rating_approx_{i}'] not in ['NO', 'No', ''] else None,
                            price_range=row.get(f'hotel_price_{i}', ''),
                            place_id=place.id,
                            all_images=json.dumps(hotel_images) if hotel_images else None
                        )
                        session.add(hotel)
                        hotels_count += 1
                
                # Create Restaurants (restaurant_name_1, restaurant_name_2, restaurant_name_3)
                for i in range(1, 4):
                    restaurant_name = row.get(f'restaurant_name_{i}', '').strip()
                    if restaurant_name and restaurant_name != 'NO':
                        # Parse restaurant images
                        restaurant_images = []
                        if row.get(f'restaurant{i}_image_path'):
                            restaurant_images = [img.strip() for img in row[f'restaurant{i}_image_path'].split(';') if img.strip()]
                        
                        restaurant = Restaurant(
                            name=restaurant_name,
                            location=row.get(f'restaurant_location_name_{i}', ''),
                            description='',  # No description in CSV
                            tags='',
                            image_url=restaurant_images[0] if restaurant_images else None,
                            rating=float(row[f'restaurant_rating_{i}']) if row.get(f'restaurant_rating_{i}') and row[f'restaurant_rating_{i}'] not in ['NO', 'No', ''] else None,
                            price_range=row.get(f'restaurant_price_range_{i}', ''),
                            place_id=place.id,
                            all_images=json.dumps(restaurant_images) if restaurant_images else None
                        )
                        session.add(restaurant)
                        restaurants_count += 1
        
        # Commit all changes
        session.commit()
        
        print(f"\n✅ Data loaded successfully!")
        print(f"📍 Places: {places_count}")
        print(f"🏨 Hotels: {hotels_count}")
        print(f"🍴 Restaurants: {restaurants_count}")
        print(f"📊 Total records: {places_count + hotels_count + restaurants_count}")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Error loading data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    print("🚀 Starting data load from CSV...")
    load_data_from_csv()
