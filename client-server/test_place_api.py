"""
Test script to verify place API returns events
"""
import requests
import json

# Test a place that should have events (from our check_events.py output)
# Place ID 3 = "koshi tappu wildlife reserve" has "Koshi Tappu Bird-Watch Season" event

place_id = 3
url = f"http://localhost:8000/api/places/{place_id}"

print(f"Testing API endpoint: {url}")
print("=" * 80)

try:
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        
        print(f"\n✅ Place Name: {data.get('name')}")
        print(f"📍 Location: {data.get('location')}")
        
        # Check if events are in response
        if 'events' in data:
            events = data['events']
            print(f"\n🎉 Events Found: {len(events)}")
            
            if events:
                print("\nEvent Details:")
                print("-" * 80)
                for i, event in enumerate(events, 1):
                    print(f"\n{i}. {event.get('name')}")
                    print(f"   Venue: {event.get('venue')}")
                    print(f"   Season: {event.get('month_season')}")
                    print(f"   Type: {event.get('event_type')}")
                    print(f"   Description: {event.get('description', '')[:100]}...")
            else:
                print("⚠️ Events array is empty")
        else:
            print("\n❌ 'events' key NOT found in response")
            print("\nResponse keys:", list(data.keys()))
        
        # Show full response structure
        print("\n" + "=" * 80)
        print("Full Response Structure:")
        print(json.dumps(data, indent=2)[:1000])  # First 1000 chars
        
    else:
        print(f"❌ Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
except Exception as e:
    print(f"❌ Error: {e}")
