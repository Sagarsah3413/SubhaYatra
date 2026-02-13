"""
Debug script to check uploaded places and their images
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'tourism.db')
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), 'datasets', 'uploads')

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Get user-submitted places
cursor.execute("""
    SELECT id, name, location, image_url, source, status 
    FROM places 
    WHERE source = 'user_submission'
    ORDER BY id DESC
    LIMIT 10
""")

places = cursor.fetchall()

print("=" * 80)
print("USER-SUBMITTED PLACES")
print("=" * 80)

if not places:
    print("No user-submitted places found.")
else:
    for place in places:
        place_id, name, location, image_url, source, status = place
        print(f"\nPlace ID: {place_id}")
        print(f"Name: {name}")
        print(f"Location: {location}")
        print(f"Status: {status}")
        print(f"Image URL: {image_url}")
        
        # Check if image file exists
        if image_url:
            # Remove /datasets/ prefix if present
            if image_url.startswith('/datasets/'):
                file_path = image_url.replace('/datasets/', '')
                full_path = os.path.join(os.path.dirname(__file__), 'datasets', file_path)
            else:
                full_path = os.path.join(os.path.dirname(__file__), image_url.lstrip('/'))
            
            if os.path.exists(full_path):
                file_size = os.path.getsize(full_path)
                print(f"✓ Image file exists: {full_path} ({file_size} bytes)")
            else:
                print(f"✗ Image file NOT FOUND: {full_path}")
        else:
            print("✗ No image URL set")

# Check uploads directory
print("\n" + "=" * 80)
print("UPLOADS DIRECTORY")
print("=" * 80)
print(f"Path: {UPLOADS_DIR}")

if os.path.exists(UPLOADS_DIR):
    files = os.listdir(UPLOADS_DIR)
    if files:
        print(f"Found {len(files)} files:")
        for f in files[:10]:  # Show first 10
            file_path = os.path.join(UPLOADS_DIR, f)
            file_size = os.path.getsize(file_path)
            print(f"  - {f} ({file_size} bytes)")
    else:
        print("Directory is empty")
else:
    print("✗ Uploads directory does not exist!")

conn.close()
