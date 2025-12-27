import requests

url = 'http://127.0.0.1:8000/api/places'
files = {
    'image_1': open('client/src/assets/Kathmandu.jpeg', 'rb'),
    'image_2': open('client/src/assets/Basantapur.jpeg', 'rb')
}
data = {
    'name': 'E2E Test Place via script',
    'location': 'Kathmandu',
    'type': 'Attraction',
    'description': 'Place created during automated end-to-end test',
    'tags': 'test,e2e,automated'
}

resp = requests.post(url, data=data, files=files)
print('STATUS', resp.status_code)
print('BODY', resp.text)
