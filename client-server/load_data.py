import pandas as pd
import time
from app import models, database

def load_csv_to_table(db, df, model, column_map):
    """
    Load a DataFrame into the given SQLAlchemy model table.
    Filters out rows missing required fields.
    Returns number of inserted and skipped records.
    """
    records = []
    skipped = 0
    required_field = list(column_map.keys())[0]  # first CSV column is required

    for _, row in df.iterrows():
        # Skip rows missing required value
        if pd.isna(row.get(required_field)) or row.get(required_field) == "":
            skipped += 1
            continue

        # Only include columns that exist in model
        data = {db_col: row[csv_col] for csv_col, db_col in column_map.items() if csv_col in row}
        records.append(model(**data))

    if records:
        db.add_all(records)
        db.commit()

    return len(records), skipped

def main():
    db = database.SessionLocal()

    # Read CSV files
    hotel_df = pd.read_csv("datasets/hotel.csv").dropna(how="all")
    restaurant_df = pd.read_csv("datasets/restaurants.csv").dropna(how="all")
    attraction_df = pd.read_csv("datasets/attraction.csv").dropna(how="all")

    # Column mapping: CSV column -> model attribute
    hotel_map = {
        "Hotel Name": "name",
        "Location": "location",
        "Description": "description",
        "Tags": "tags"
    }

    restaurant_map = {
        "Name": "name",
        "Location": "location",
        "Description": "description",
        "Tags": "tags"
    }

    attraction_map = {
        "Destination Name": "name",        # CSV "Destination Name" → DB "name"
        "District": "location",       # CSV "District" → DB "location"
        "Activities": "description",  # CSV "Activities" → DB "description"
        "Tags": "tags"                # CSV "Tags" → DB "tags"
    }

    # Load hotels
    start = time.time()
    inserted, skipped = load_csv_to_table(db, hotel_df, models.Hotel, hotel_map)
    print(f"✅ Hotels: Inserted {inserted}, Skipped {skipped}, Time taken: {time.time() - start:.2f}s")

    # Load restaurants
    start = time.time()
    inserted, skipped = load_csv_to_table(db, restaurant_df, models.Restaurant, restaurant_map)
    print(f"✅ Restaurants: Inserted {inserted}, Skipped {skipped}, Time taken: {time.time() - start:.2f}s")

    # Load attractions
    start = time.time()
    inserted, skipped = load_csv_to_table(db, attraction_df, models.Attraction, attraction_map)
    print(f"✅ Attractions: Inserted {inserted}, Skipped {skipped}, Time taken: {time.time() - start:.2f}s")

    print("🎉 All valid data successfully loaded!")

if __name__ == "__main__":
    main()
