import sqlite3

conn = sqlite3.connect('client-server/tourism.db')
cur = conn.cursor()
try:
    cur.execute('SELECT id, name, location, type, image_url, created_at FROM places ORDER BY id DESC LIMIT 10')
    rows = cur.fetchall()
    if not rows:
        print('No places found in DB yet')
    else:
        for r in rows:
            print(r)
finally:
    conn.close()
