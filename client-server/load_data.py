import csv
from app import models, database

db = database.SessionLocal()

with open("datasets/data.csv", newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Split multiple image paths by comma
        images = row["image_url"].split(",") if row["image_url"] else []

        # Create one item per type
        if row["type"].lower() == "hotel":
            db.add(models.Hotel(
                name=row["name"],
                location=row.get("location", ""),
                description=row.get("description", ""),
                tags=row.get("tags", ""),
                image_url=images[0] if images else None  # you can store first image only
            ))
        elif row["type"].lower() == "restaurant":
            db.add(models.Restaurant(
                name=row["name"],
                location=row.get("location", ""),
                description=row.get("description", ""),
                tags=row.get("tags", ""),
                image_url=images[0] if images else None
            ))
        elif row["type"].lower() == "attraction":
            db.add(models.Attraction(
                name=row["name"],
                location=row.get("location", ""),
                description=row.get("description", ""),
                tags=row.get("tags", ""),
                image_url=images[0] if images else None
            ))

db.commit()
db.close()
print("✅ Dataset loaded into database successfully!")
