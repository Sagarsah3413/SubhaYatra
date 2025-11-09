from app import database, models

db = database.SessionLocal()

sample_data = [
    models.SearchItem(title="Kathmandu Durbar Square", description="Historic site in central Kathmandu", tags="heritage,temple"),
    models.SearchItem(title="Pokhara Lakeside Resort", description="Beautiful lakeside resort with boating", tags="resort,pokhara,hotel"),
    models.SearchItem(title="Everest View Hotel", description="Hotel with panoramic Everest view", tags="hotel,everest"),
]

db.add_all(sample_data)
db.commit()
db.close()

print("✅ Sample data inserted successfully!")
