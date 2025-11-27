import csv
from database import SessionLocal
from models import Hotel, Restaurant, Attraction

db = SessionLocal()

with open("datasets/data.csv", newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        images = row["image_url"].split(",") if row["image_url"] else []
        if row["type"].lower() == "hotel":
            db.add(Hotel(
                name=row["name"],
                location=row.get("location", ""),
                description=row.get("description", ""),
                tags=row.get("tags", ""),
                image_url=images[0] if images else None
            ))
        elif row["type"].lower() == "restaurant":
            db.add(Restaurant(
                name=row["name"],
                location=row.get("location", ""),
                description=row.get("description", ""),
                tags=row.get("tags", ""),
                image_url=images[0] if images else None
            ))
        elif row["type"].lower() == "attraction":
            db.add(Attraction(
                name=row["name"],
                location=row.get("location", ""),
                description=row.get("description", ""),
                tags=row.get("tags", ""),
                image_url=images[0] if images else None
            ))

db.commit()
db.close()
print("✅ Dataset loaded into database successfully!")
