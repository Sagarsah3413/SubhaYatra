#!/usr/bin/env python3
"""
Image Organization Script for Tourism Database
This script helps organize and validate images in the datasets directory
"""

import os
import json
import shutil
from pathlib import Path
import sys

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Place, Hotel, Restaurant

def get_image_extensions():
    """Get supported image extensions"""
    return {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'}

def scan_directory_images(directory):
    """Scan a directory for images and return organized data"""
    if not os.path.exists(directory):
        print(f"Directory does not exist: {directory}")
        return {}
    
    image_data = {}
    extensions = get_image_extensions()
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if Path(file).suffix.lower() in extensions:
                rel_path = os.path.relpath(root, directory)
                if rel_path not in image_data:
                    image_data[rel_path] = []
                image_data[rel_path].append(file)
    
    return image_data

def organize_destination_images():
    """Organize destination images by location/place name"""
    print("🏔️  Organizing destination images...")
    
    dest_dir = "datasets/destination_images"
    if not os.path.exists(dest_dir):
        print(f"Destination images directory not found: {dest_dir}")
        return
    
    image_data = scan_directory_images(dest_dir)
    
    print(f"Found {len(image_data)} destination folders:")
    for folder, images in image_data.items():
        print(f"  📁 {folder}: {len(images)} images")
    
    return image_data

def organize_hotel_images():
    """Organize hotel images"""
    print("🏨 Organizing hotel images...")
    
    hotel_dir = "datasets/hotel_images"
    if not os.path.exists(hotel_dir):
        print(f"Hotel images directory not found: {hotel_dir}")
        return
    
    image_data = scan_directory_images(hotel_dir)
    
    print(f"Found {len(image_data)} hotel folders:")
    for folder, images in image_data.items():
        print(f"  📁 {folder}: {len(images)} images")
    
    return image_data

def organize_restaurant_images():
    """Organize restaurant images"""
    print("🍽️  Organizing restaurant images...")
    
    restaurant_dir = "datasets/restaurant_images"
    if not os.path.exists(restaurant_dir):
        print(f"Restaurant images directory not found: {restaurant_dir}")
        return
    
    image_data = scan_directory_images(restaurant_dir)
    
    print(f"Found {len(image_data)} restaurant folders:")
    for folder, images in image_data.items():
        print(f"  📁 {folder}: {len(images)} images")
    
    return image_data

def update_database_image_paths():
    """Update database with correct image paths"""
    print("💾 Updating database with image paths...")
    
    session = SessionLocal()
    try:
        # Update Places
        places = session.query(Place).all()
        for place in places:
            place_name = place.name.replace(" ", "_").replace("/", "_")
            
            # Look for matching folder in destination_images
            dest_dir = f"datasets/destination_images/{place_name}"
            if os.path.exists(dest_dir):
                images = []
                for file in os.listdir(dest_dir):
                    if Path(file).suffix.lower() in get_image_extensions():
                        images.append(f"/datasets/destination_images/{place_name}/{file}")
                
                if images:
                    place.image_url = images[0]  # Set first image as primary
                    place.all_images = json.dumps(images)
                    print(f"  ✅ Updated {place.name}: {len(images)} images")
        
        # Update Hotels
        hotels = session.query(Hotel).all()
        for hotel in hotels:
            hotel_name = hotel.name.replace(" ", "_").replace("/", "_")
            
            # Look for matching folder in hotel_images
            hotel_dir = f"datasets/hotel_images/{hotel_name}"
            if os.path.exists(hotel_dir):
                images = []
                for file in os.listdir(hotel_dir):
                    if Path(file).suffix.lower() in get_image_extensions():
                        images.append(f"/datasets/hotel_images/{hotel_name}/{file}")
                
                if images:
                    hotel.image_url = images[0]
                    hotel.all_images = json.dumps(images)
                    print(f"  ✅ Updated {hotel.name}: {len(images)} images")
        
        # Update Restaurants
        restaurants = session.query(Restaurant).all()
        for restaurant in restaurants:
            restaurant_name = restaurant.name.replace(" ", "_").replace("/", "_")
            
            # Look for matching folder in restaurant_images
            restaurant_dir = f"datasets/restaurant_images/{restaurant_name}"
            if os.path.exists(restaurant_dir):
                images = []
                for file in os.listdir(restaurant_dir):
                    if Path(file).suffix.lower() in get_image_extensions():
                        images.append(f"/datasets/restaurant_images/{restaurant_name}/{file}")
                
                if images:
                    restaurant.image_url = images[0]
                    restaurant.all_images = json.dumps(images)
                    print(f"  ✅ Updated {restaurant.name}: {len(images)} images")
        
        session.commit()
        print("✅ Database updated successfully!")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Error updating database: {e}")
    finally:
        session.close()

def validate_image_integrity():
    """Validate that all images are accessible and not corrupted"""
    print("🔍 Validating image integrity...")
    
    from PIL import Image
    
    corrupted_images = []
    total_images = 0
    
    for img_type, directory in [
        ("Destinations", "datasets/destination_images"),
        ("Hotels", "datasets/hotel_images"),
        ("Restaurants", "datasets/restaurant_images")
    ]:
        if not os.path.exists(directory):
            continue
            
        print(f"\n📂 Checking {img_type}...")
        
        for root, dirs, files in os.walk(directory):
            for file in files:
                if Path(file).suffix.lower() in get_image_extensions():
                    total_images += 1
                    file_path = os.path.join(root, file)
                    
                    try:
                        with Image.open(file_path) as img:
                            img.verify()  # Verify image integrity
                    except Exception as e:
                        corrupted_images.append((file_path, str(e)))
                        print(f"  ❌ Corrupted: {file_path}")
    
    print(f"\n📊 Validation Results:")
    print(f"  Total images checked: {total_images}")
    print(f"  Corrupted images: {len(corrupted_images)}")
    
    if corrupted_images:
        print("\n🚨 Corrupted Images:")
        for img_path, error in corrupted_images:
            print(f"  - {img_path}: {error}")
    else:
        print("✅ All images are valid!")

def generate_image_report():
    """Generate a comprehensive report of all images"""
    print("📋 Generating image report...")
    
    report = {
        "timestamp": str(os.path.getctime(".")),
        "directories": {},
        "database_stats": {},
        "summary": {}
    }
    
    # Scan directories
    for img_type, directory in [
        ("destination_images", "datasets/destination_images"),
        ("hotel_images", "datasets/hotel_images"),
        ("restaurant_images", "datasets/restaurant_images")
    ]:
        if os.path.exists(directory):
            image_data = scan_directory_images(directory)
            total_images = sum(len(images) for images in image_data.values())
            
            report["directories"][img_type] = {
                "path": directory,
                "folders": len(image_data),
                "total_images": total_images,
                "folders_detail": {folder: len(images) for folder, images in image_data.items()}
            }
    
    # Database stats
    session = SessionLocal()
    try:
        report["database_stats"] = {
            "places_total": session.query(Place).count(),
            "places_with_images": session.query(Place).filter(Place.image_url.isnot(None)).count(),
            "hotels_total": session.query(Hotel).count(),
            "hotels_with_images": session.query(Hotel).filter(Hotel.image_url.isnot(None)).count(),
            "restaurants_total": session.query(Restaurant).count(),
            "restaurants_with_images": session.query(Restaurant).filter(Restaurant.image_url.isnot(None)).count(),
        }
    finally:
        session.close()
    
    # Summary
    total_dirs = sum(data["folders"] for data in report["directories"].values())
    total_images = sum(data["total_images"] for data in report["directories"].values())
    
    report["summary"] = {
        "total_directories": total_dirs,
        "total_images": total_images,
        "average_images_per_directory": round(total_images / total_dirs, 2) if total_dirs > 0 else 0
    }
    
    # Save report
    with open("image_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print("📄 Report saved to: image_report.json")
    
    # Print summary
    print(f"\n📊 Summary:")
    print(f"  Total directories: {total_dirs}")
    print(f"  Total images: {total_images}")
    print(f"  Average images per directory: {report['summary']['average_images_per_directory']}")

def main():
    """Main function to run all organization tasks"""
    print("🚀 Starting Image Organization Script")
    print("=" * 50)
    
    # Create directories if they don't exist
    os.makedirs("datasets/destination_images", exist_ok=True)
    os.makedirs("datasets/hotel_images", exist_ok=True)
    os.makedirs("datasets/restaurant_images", exist_ok=True)
    os.makedirs("datasets/uploads", exist_ok=True)
    
    # Run organization tasks
    organize_destination_images()
    print()
    organize_hotel_images()
    print()
    organize_restaurant_images()
    print()
    
    # Update database
    update_database_image_paths()
    print()
    
    # Generate report
    generate_image_report()
    print()
    
    # Validate images (optional - requires PIL)
    try:
        validate_image_integrity()
    except ImportError:
        print("⚠️  PIL not installed. Skipping image validation.")
        print("   Install with: pip install Pillow")
    
    print("\n✅ Image organization complete!")

if __name__ == "__main__":
    main()