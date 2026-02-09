"""
Test script to verify backend is returning events
"""
import requests
import json

print("="*60)
print("TESTING BACKEND EVENTS API")
print("="*60)

# Test place with known events (place_id = 3)
place_id = 3
url = f'http://localhost:8000/api/places/{place_id}'

print(f"\n📡 Requesting: {url}")

try:
    response = requests.get(url)
    print(f"✅ Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        
        print(f"\n📦 Response Keys: {list(data.keys())}")
        print(f"\n📍 Place: {data.get('name')}")
        print(f"🏨 Hotels: {len(data.get('hotels', []))}")
        print(f"🍽️  Restaurants: {len(data.get('restaurants', []))}")
        print(f"🎉 Events: {len(data.get('events', []))}")
        
        if data.get('events'):
            print(f"\n✅ EVENTS FOUND!")
            for event in data['events']:
                print(f"\n  Event: {event.get('name')}")
                print(f"  Venue: {event.get('venue')}")
                print(f"  Season: {event.get('month_season')}")
                print(f"  Type: {event.get('event_type')}")
        else:
            print(f"\n❌ NO EVENTS IN RESPONSE!")
            print(f"\n⚠️  Backend server needs to be restarted!")
            print(f"   The code is updated but the server is using old code.")
            
    else:
        print(f"❌ Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend!")
    print("   Make sure backend is running on http://localhost:8000")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)
