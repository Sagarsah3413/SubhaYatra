import sqlite3
import os

# Try different database paths
db_paths = [
    'app/tourism.db',
    'client-server/app/tourism.db',
    'tourism.db',
    'instance/tourism.db',
    'client-server/instance/tourism.db'
]

conn = None
for db_path in db_paths:
    if os.path.exists(db_path):
        print(f'✅ Found database at: {db_path}')
        conn = sqlite3.connect(db_path)
        break

if not conn:
    print('❌ Database not found in any expected location')
    exit(1)

cursor = conn.cursor()

# Count total events
cursor.execute('SELECT COUNT(*) FROM events')
total = cursor.fetchone()[0]
print(f'✅ Total events in database: {total}')

# Get sample events with place names
cursor.execute('''
    SELECT e.name, e.venue, e.month_season, e.event_type, p.name as place_name 
    FROM events e 
    JOIN places p ON e.place_id = p.id 
    WHERE e.name IS NOT NULL AND e.name != 'NO' AND e.name != ''
    LIMIT 10
''')

print('\n📅 Sample events from dataset:')
print('=' * 80)
for i, row in enumerate(cursor.fetchall(), 1):
    event_name, venue, season, event_type, place_name = row
    print(f'\n{i}. {event_name}')
    print(f'   📍 Place: {place_name}')
    print(f'   🏛️  Venue: {venue}')
    print(f'   📆 Season: {season}')
    print(f'   🎭 Type: {event_type}')

conn.close()
