"""
Seed the database with dataset_with_all_image_path.csv
Run from: client-server/  →  python maintenance/seed_db.py
"""
import csv, json, os, sys

# ── resolve paths ──────────────────────────────────────────────────────────────
HERE    = os.path.dirname(os.path.abspath(__file__))
ROOT    = os.path.dirname(HERE)                       # client-server/
DB_PATH = os.path.join(ROOT, 'tourism.db')
# also check app/ subfolder
if not os.path.exists(DB_PATH):
    DB_PATH = os.path.join(ROOT, 'app', 'tourism.db')
CSV_PATH = os.path.join(ROOT, 'datasets', 'dataset_with_all_image_path.csv')

print(f"DB  : {DB_PATH}  (exists={os.path.exists(DB_PATH)})")
print(f"CSV : {CSV_PATH} (exists={os.path.exists(CSV_PATH)})")

if not os.path.exists(CSV_PATH):
    print("ERROR: CSV not found"); sys.exit(1)
if not os.path.exists(DB_PATH):
    print("ERROR: DB not found — start the server once first to create tables"); sys.exit(1)

import sqlite3
conn   = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Check places table exists
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='places'")
if not cursor.fetchone():
    print("ERROR: 'places' table missing — run the server once to init DB"); sys.exit(1)

# ── wipe existing seeded data (keep user-submitted records) ───────────────────
cursor.execute("DELETE FROM places      WHERE source='dataset' OR source IS NULL OR source=''")
cursor.execute("DELETE FROM hotels      WHERE source='dataset' OR source IS NULL OR source=''")
cursor.execute("DELETE FROM restaurants WHERE source='dataset' OR source IS NULL OR source=''")
cursor.execute("DELETE FROM events")
print("Cleared old dataset rows.")

def coord(s):
    try:    return float(s.replace('\u00b0', '').strip()) if s else None
    except: return None

def rating_from_hotels(row):
    vals = []
    for i in range(1, 4):
        s = row.get(f'hotel_rating_approx_{i}', '').strip()
        if s and s.upper() not in ('NO', ''):
            try: vals.append(float(s))
            except: pass
    return round(sum(vals)/len(vals), 1) if vals else 4.0

SKIP = {'', 'no', 'n/a', 'none'}

places_n = hotels_n = restaurants_n = events_n = 0

with open(CSV_PATH, encoding='utf-8') as f:
    for row in csv.DictReader(f):
        name = row.get('destination', '').strip()
        if not name:
            continue

        # destination images
        imgs = [i.strip() for i in row.get('destination_image_path', '').split(';') if i.strip()]

        cursor.execute("""
            INSERT INTO places
              (name, location, province, type, description, tags,
               image_url, all_images, latitude, longitude,
               best_season, activities, difficulty_level,
               accessibility, transportation, rating,
               status, source, created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))
        """, (
            name,
            row.get('district', '').strip(),
            row.get('province', '').strip(),
            row.get('main_category', '').strip(),
            row.get('description', '').strip(),
            row.get('tags', '').strip(),
            imgs[0] if imgs else None,
            json.dumps(imgs) if imgs else None,
            coord(row.get('latitude')),
            coord(row.get('longitude')),
            row.get('best_season', '').strip(),
            row.get('activities', '').strip(),
            row.get('difficulty_level', '').strip(),
            row.get('accessibility', '').strip(),
            row.get('transportation', '').strip(),
            rating_from_hotels(row),
            'approved', 'dataset',
        ))
        place_id = cursor.lastrowid
        places_n += 1

        # hotels
        for i in range(1, 4):
            hname = row.get(f'hotel_name_{i}', '').strip()
            if not hname or hname.lower() in SKIP:
                continue
            hr = row.get(f'hotel_rating_approx_{i}', '').strip()
            try:    hrating = float(hr)
            except: hrating = 4.0
            hprice = row.get(f'hotel_price_{i}', '').strip() or 'Price not available'
            if hprice.lower() in SKIP: hprice = 'Price not available'
            himgs = [x.strip() for x in row.get(f'hotel{i}_image_path', '').split(';') if x.strip()]
            cursor.execute("""
                INSERT INTO hotels
                  (name, location, description, rating, price_range,
                   place_id, image_url, all_images, status, source,
                   created_at, updated_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))
            """, (
                hname,
                row.get(f'hotel_location_{i}', '').strip(),
                row.get(f'hotel_review_short_{i}', '').strip(),
                hrating, hprice, place_id,
                himgs[0] if himgs else None,
                json.dumps(himgs) if himgs else None,
                'approved', 'dataset',
            ))
            hotels_n += 1

        # restaurants
        for i in range(1, 4):
            rname = row.get(f'restaurant_name_{i}', '').strip()
            if not rname or rname.lower() in SKIP:
                continue
            rr = row.get(f'restaurant_rating_{i}', '').strip()
            try:    rrating = float(rr)
            except: rrating = 4.0
            rprice = row.get(f'restaurant_price_range_{i}', '').strip() or 'Price not available'
            if rprice.lower() in SKIP: rprice = 'Price not available'
            rimgs = [x.strip() for x in row.get(f'restaurant{i}_image_path', '').split(';') if x.strip()]
            cursor.execute("""
                INSERT INTO restaurants
                  (name, location, rating, price_range,
                   place_id, image_url, all_images, status, source,
                   created_at, updated_at)
                VALUES (?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))
            """, (
                rname,
                row.get(f'restaurant_location_name_{i}', '').strip(),
                rrating, rprice, place_id,
                rimgs[0] if rimgs else None,
                json.dumps(rimgs) if rimgs else None,
                'approved', 'dataset',
            ))
            restaurants_n += 1

        # event
        ename = row.get('event_name', '').strip()
        if ename and ename.lower() not in SKIP:
            cursor.execute("""
                INSERT INTO events (name, venue, month_season, event_type, description, place_id, created_at, updated_at)
                VALUES (?,?,?,?,?,?,datetime('now'),datetime('now'))
            """, (
                ename,
                row.get('event_venue', '').strip(),
                row.get('event_month_season', '').strip(),
                row.get('event_type', '').strip(),
                row.get('event_description', '').strip(),
                place_id,
            ))
            events_n += 1

        if places_n % 200 == 0:
            print(f"  {places_n} places loaded…")

conn.commit()
conn.close()

print(f"\nDone!")
print(f"  Places      : {places_n}")
print(f"  Hotels      : {hotels_n}")
print(f"  Restaurants : {restaurants_n}")
print(f"  Events      : {events_n}")
