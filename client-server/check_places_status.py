"""
Check the status distribution of places in the database
"""
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'tourism.db')

def check_places_status():
    """Check status distribution of all places"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get total count
        cursor.execute("SELECT COUNT(*) FROM places")
        total = cursor.fetchone()[0]
        
        # Get count by status
        cursor.execute("SELECT status, COUNT(*) FROM places GROUP BY status")
        status_counts = cursor.fetchall()
        
        # Get some sample places
        cursor.execute("SELECT id, name, status, created_at FROM places ORDER BY id DESC LIMIT 10")
        recent_places = cursor.fetchall()
        
        print(f"\n{'='*60}")
        print("PLACES STATUS DISTRIBUTION")
        print(f"{'='*60}")
        print(f"\nTotal Places: {total}")
        print(f"\nBreakdown by Status:")
        for status, count in status_counts:
            print(f"  - {status or 'NULL'}: {count}")
        
        print(f"\n{'='*60}")
        print("RECENT 10 PLACES:")
        print(f"{'='*60}")
        print(f"{'ID':<6} {'Name':<40} {'Status':<12} {'Created'}")
        print("-" * 60)
        for place_id, name, status, created in recent_places:
            name_short = (name[:37] + '...') if len(name) > 40 else name
            status_display = status or 'NULL'
            created_short = (created[:19] if created else 'N/A')
            print(f"{place_id:<6} {name_short:<40} {status_display:<12} {created_short}")
        
        print(f"{'='*60}\n")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_places_status()
