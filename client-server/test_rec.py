import urllib.request, json

payload = json.dumps({
    "name": "Test", "age": "25", "phone": "9800000000",
    "travellers": "2", "tripDuration": "4-7",
    "travelMonth": "October",
    "tripTypes": ["⛰️ Natural Attractions"]
}).encode()

req = urllib.request.Request(
    'http://localhost:8000/api/recommendations',
    data=payload,
    headers={'Content-Type': 'application/json'},
    method='POST'
)
try:
    with urllib.request.urlopen(req) as r:
        d = json.loads(r.read())
        print('Success:', d.get('success'))
        print('Total:', d.get('total_matches'))
        if d.get('recommendations'):
            p = d['recommendations'][0]
            print('First place:', p['name'])
            print('Images:', len(p.get('all_images', [])))
            print('First img:', (p.get('all_images') or ['NONE'])[0][:60])
        else:
            print('No recommendations returned')
            print('Response keys:', list(d.keys()))
except Exception as e:
    print('ERROR:', e)
