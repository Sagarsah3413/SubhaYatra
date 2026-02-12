"""
Simple script to load CSV data into database
Run this to populate your places, hotels, and restaurants tables with real dataset
"""
import csv
import json
import sqlite3
import os

def load_data():
    # Connect to database
    db_path = 'tourism.db'
    if not os.path.exists(db_path):
        db_path = 'app/tourism.db'
    if not os.path.exists(db_path):
        db_path = 'instance/tourism.db'
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # CSV path - try multiple locations
    csv_paths = [
        'datasets/dataset_with_all_image_path.csv',
        '../datasets/dataset_with_all_image_path.csv',
        'client-server/datasets/dataset_with_all_image_path.csv'
    ]
    
    csv_path = None
    for path in csv_paths:
        if os.path.exists(path):
            csv_path = path
            break
    
    if not csv_path:
        print(f"❌ CSV file not found in any of these locations:")
        for path in csv_paths:
            print(f"   - {path}")
        return
    
    print(f"📂 Reading CSV: {csv_path}")
    
    # Clear existing dataset data only (keep user submissions)
    cursor.execute("DELETE FROM places WHERE source = 'dataset' OR source IS NULL")
    cursor.execute("DELETE FROM hotels WHERE place_id NOT IN (SELECT id FROM places)")
    cursor.execute("DELETE FROM restaurants WHERE place_id NOT IN (SELECT id FROM places)")
    cursor.execute("DELETE FROM events WHERE place_id NOT IN (SELECT id FROM places)")
    print("🗑️  Cleared existing dataset places (kept user submissions)")
    
    places_count = 0
    hotels_count = 0
    restaurants_count = 0
    events_count = 0
    
    with open(csv_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            destination_name = row.get('destination', '').strip()
            if not destination_name:
                continue
            
            # Parse images
            dest_images = []
            if row.get('destination_image_path'):
                dest_images = [img.strip() for img in row['destination_image_path'].split(';') if img.strip()]
            
            # Parse coordinates
            def parse_coord(coord_str):
                if not coord_str:
                    return None
                try:
                    return float(coord_str.replace('°', '').strip())
                except:
                    return None
            
            # Parse rating from hotels
            def parse_rating(row):
                ratings = []
                for i in range(1, 4):
                    rating_str = row.get(f'hotel_rating_approx_{i}', '')
                    if rating_str and rating_str not in ['NO', 'No', '']:
                        try:
                            ratings.append(float(rating_str))
                        except:
                            pass
                return sum(ratings) / len(ratings) if ratings else 4.0
            
            # Insert place
            cursor.execute("""
                INSERT INTO places (
                    name, location, type, description, tags, image_url,
                    latitude, longitude, best_season, activities,
                    difficulty_level, accessibility, transportation,
                    province, rating, all_images, source, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                destination_name,
                row.get('district', ''),
                row.get('main_category', ''),
                row.get('description', ''),
                row.get('tags', ''),
                dest_images[0] if dest_images else None,
                parse_coord(row.get('latitude')),
                parse_coord(row.get('longitude')),
                row.get('best_season', ''),
                row.get('activities', ''),
                row.get('difficulty_level', ''),
                row.get('accessibility', ''),
                row.get('transportation', ''),
                row.get('province', ''),
                parse_rating(row),
                json.dumps(dest_images) if dest_images else None,
                'dataset',  # source
                'approved'  # status - dataset places are pre-approved
            ))
            
            place_id = cursor.lastrowid
            places_count += 1
            
            # Insert hotels (1-3 hotels per place)
            for i in range(1, 4):
                hotel_name = row.get(f'hotel_name_{i}', '').strip()
                if hotel_name and hotel_name not in ['NO', 'No', '']:
                    hotel_location = row.get(f'hotel_location_{i}', '').strip()
                    hotel_review = row.get(f'hotel_review_short_{i}', '').strip()
                    hotel_rating_str = row.get(f'hotel_rating_approx_{i}', '').strip()
                    hotel_price = row.get(f'hotel_price_{i}', '').strip()
                    
                    # Parse hotel rating
                    hotel_rating = 4.0
                    if hotel_rating_str and hotel_rating_str not in ['NO', 'No', '']:
                        try:
                            hotel_rating = float(hotel_rating_str)
                        except:
                            pass
                    
                    # Keep original price range format from CSV
                    # e.g., "Low (~$10–20)", "Medium (~$35–60)", "High (~$90+)"
                    if not hotel_price or hotel_price in ['NO', 'No', '']:
                        hotel_price = 'Price not available'
                    
                    # Parse hotel images
                    hotel_images = []
                    hotel_image_path = row.get(f'hotel{i}_image_path', '').strip()
                    if hotel_image_path and hotel_image_path not in ['NO', 'No', '']:
                        hotel_images = [img.strip() for img in hotel_image_path.split(';') if img.strip()]
                    
                    cursor.execute("""
                        INSERT INTO hotels (
                            name, location, description, rating, price_range,
                            place_id, image_url, all_images
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        hotel_name,
                        hotel_location,
                        hotel_review,
                        hotel_rating,
                        hotel_price,  # Original price range from CSV
                        place_id,
                        hotel_images[0] if hotel_images else None,
                        json.dumps(hotel_images) if hotel_images else None
                    ))
                    hotels_count += 1
            
            # Insert restaurants (1-3 restaurants per place)
            for i in range(1, 4):
                restaurant_name = row.get(f'restaurant_name_{i}', '').strip()
                if restaurant_name and restaurant_name not in ['NO', 'No', '']:
                    restaurant_location = row.get(f'restaurant_location_name_{i}', '').strip()
                    restaurant_rating_str = row.get(f'restaurant_rating_{i}', '').strip()
                    restaurant_price = row.get(f'restaurant_price_range_{i}', '').strip()
                    
                    # Parse restaurant rating
                    restaurant_rating = 4.0
                    if restaurant_rating_str and restaurant_rating_str not in ['NO', 'No', '']:
                        try:
                            restaurant_rating = float(restaurant_rating_str)
                        except:
                            pass
                    
                    # Keep original price range format from CSV
                    # e.g., "Low (~$10–20)", "Medium (~$35–60)", "High (~$90+)"
                    if not restaurant_price or restaurant_price in ['NO', 'No', '']:
                        restaurant_price = 'Price not available'
                    
                    # Parse restaurant images
                    restaurant_images = []
                    restaurant_image_path = row.get(f'restaurant{i}_image_path', '').strip()
                    if restaurant_image_path and restaurant_image_path not in ['NO', 'No', '']:
                        restaurant_images = [img.strip() for img in restaurant_image_path.split(';') if img.strip()]
                    
                    cursor.execute("""
                        INSERT INTO restaurants (
                            name, location, rating, price_range,
                            place_id, image_url, all_images
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (
                        restaurant_name,
                        restaurant_location,
                        restaurant_rating,
                        restaurant_price,  # Original price range from CSV
                        place_id,
                        restaurant_images[0] if restaurant_images else None,
                        json.dumps(restaurant_images) if restaurant_images else None
                    ))
                    restaurants_count += 1
            
            # Insert event if exists
            event_name = row.get('event_name', '').strip()
            if event_name and event_name not in ['NO', 'No', '']:
                event_venue = row.get('event_venue', '').strip()
                event_month_season = row.get('event_month_season', '').strip()
                event_type = row.get('event_type', '').strip()
                event_description = row.get('event_description', '').strip()
                
                cursor.execute("""
                    INSERT INTO events (
                        name, venue, month_season, event_type, description, place_id
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    event_name,
                    event_venue,
                    event_month_season,
                    event_type,
                    event_description,
                    place_id
                ))
                events_count += 1
            
            if places_count % 100 == 0:
                print(f"  Loaded {places_count} places, {hotels_count} hotels, {restaurants_count} restaurants, {events_count} events...")
    
    conn.commit()
    conn.close()
    
    print(f"\n✅ Successfully loaded:")
    print(f"   📍 {places_count} places")
    print(f"   🏨 {hotels_count} hotels")
    print(f"   🍽️  {restaurants_count} restaurants")
    print(f"   🎉 {events_count} events")
    print(f"\nSample places:")
    
    # Show sample
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name, location, tags FROM places LIMIT 5")
    for i, row in enumerate(cursor.fetchall(), 1):
        print(f"{i}. {row[0]} ({row[1]})")
        print(f"   Tags: {row[2]}")
    
    print(f"\nSample hotels with prices:")
    cursor.execute("SELECT name, location, price_range FROM hotels LIMIT 5")
    for i, row in enumerate(cursor.fetchall(), 1):
        print(f"{i}. {row[0]} - {row[2]}")
    
    print(f"\nSample restaurants with prices:")
    cursor.execute("SELECT name, location, price_range FROM restaurants LIMIT 5")
    for i, row in enumerate(cursor.fetchall(), 1):
        print(f"{i}. {row[0]} - {row[2]}")
    
    print(f"\nSample events:")
    cursor.execute("SELECT name, month_season, event_type FROM events LIMIT 5")
    for i, row in enumerate(cursor.fetchall(), 1):
        print(f"{i}. {row[0]} ({row[1]}) - {row[2]}")
    
    conn.close()

if __name__ == "__main__":
    print("="*60)
    print("LOADING DATASET INTO DATABASE")
    print("="*60)
    load_data()
