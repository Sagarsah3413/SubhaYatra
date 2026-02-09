import sqlite3

conn = sqlite3.connect('app/tourism.db')
cursor = conn.cursor()

# Check events for place_id 3
cursor.execute('SELECT COUNT(*) FROM events WHERE place_id = 3')
count = cursor.fetchone()[0]
print(f'Events for place_id 3: {count}')

if count > 0:
    cursor.execute('SELECT id, name, venue, month_season, event_type, description FROM events WHERE place_id = 3')
    event = cursor.fetchone()
    print(f'\nEvent details:')
    print(f'  ID: {event[0]}')
    print(f'  Name: {event[1]}')
    print(f'  Venue: {event[2]}')
    print(f'  Season: {event[3]}')
    print(f'  Type: {event[4]}')
    print(f'  Description: {event[5][:100]}...')

# Check total events
cursor.execute('SELECT COUNT(*) FROM events')
total = cursor.fetchone()[0]
print(f'\nTotal events in database: {total}')

# Check places with events
cursor.execute('SELECT COUNT(DISTINCT place_id) FROM events')
places_with_events = cursor.fetchone()[0]
print(f'Places with events: {places_with_events}')

conn.close()
