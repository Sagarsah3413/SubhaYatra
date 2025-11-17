# reset_db_and_seed.py
from app import models, database

# 1️⃣ Connect to DB
db = database.SessionLocal()

# 2️⃣ Drop all old tables (careful, this deletes existing data)
models.Base.metadata.drop_all(bind=database.engine)
print("Dropped all tables.")

# 3️⃣ Recreate tables with updated schema (includes image_url)
models.Base.metadata.create_all(bind=database.engine)
print("Created tables with updated schema.")

# 4️⃣ Sample data
sample_data = [
    # Hotels
    models.Hotel(
        name="Everest View Hotel",
        location="Namche Bazaar",
        description="Hotel with panoramic Everest view",
        tags="hotel,everest,nature",
        image_url="https://example.com/everest.jpg"
    ),
    models.Hotel(
        name="Pokhara Lakeside Resort",
        location="Pokhara",
        description="Beautiful lakeside resort with boating",
        tags="resort,hotel,pokhara,lake",
        image_url="https://example.com/pokhara.jpg"
    ),
    models.Hotel(
        name="Kathmandu Grand Hotel",
        location="Kathmandu",
        description="Luxury hotel in heart of the city",
        tags="hotel,luxury,kathmandu",
        image_url="https://example.com/kathmandu_grand.jpg"
    ),

    # Restaurants
    models.Restaurant(
        name="Cafe Annapurna",
        location="Pokhara",
        description="Cozy cafe by the lake serving coffee and pastries",
        tags="cafe,coffee,breakfast,pokhara",
        image_url="https://example.com/cafe.jpg"
    ),
    models.Restaurant(
        name="Thamel Food Court",
        location="Kathmandu",
        description="Variety of Nepali dishes in one place",
        tags="restaurant,nepali,thamel",
        image_url="https://example.com/thamel.jpg"
    ),
    models.Restaurant(
        name="Himalayan Pizza",
        location="Lalitpur",
        description="Delicious pizza with Himalayan touch",
        tags="restaurant,pizza,himalaya",
        image_url="https://example.com/pizza.jpg"
    ),

    # Attractions
    models.Attraction(
        name="Kathmandu Durbar Square",
        location="Kathmandu",
        description="Historic site in central Kathmandu with temples and palaces",
        tags="heritage,temple,kathmandu",
        image_url="https://example.com/durbar.jpg"
    ),
    models.Attraction(
        name="Patan Durbar Square",
        location="Patan",
        description="Ancient palace with museums and temples",
        tags="heritage,temple,museum",
        image_url="https://example.com/patan.jpg"
    ),
    models.Attraction(
        name="Swayambhunath Stupa",
        location="Kathmandu",
        description="Famous Buddhist stupa with panoramic city views",
        tags="stupa,buddhist,kathmandu",
        image_url="https://example.com/swayambhu.jpg"
    ),
    models.Attraction(
        name="Fewa Lake",
        location="Pokhara",
        description="Beautiful lake surrounded by mountains, ideal for boating",
        tags="lake,pokhara,nature",
        image_url="https://example.com/fewa.jpg"
    ),
]

# 5️⃣ Add data and commit
db.add_all(sample_data)
db.commit()
db.close()

print("✅ Database reset and sample data inserted successfully!")
