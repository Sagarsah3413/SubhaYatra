import os
import csv

# Path to your main project folder
# Correct path to your images
dataset_folder = "datasets/project_imgfold/project_images"
csv_file = "datasets/data.csv"

# Function to generate metadata per folder
def generate_metadata(folder_name):
    return {
        "type": "hotel",  # You can adjust based on folder naming
        "name": folder_name,
        "location": "",
        "description": "",
        "tags": ""
    }

with open(csv_file, "w", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["type", "name", "location", "description", "tags", "image_url"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for folder in os.listdir(dataset_folder):
        folder_path = os.path.join(dataset_folder, folder)
        if os.path.isdir(folder_path):
            metadata = generate_metadata(folder)
            # Get all image paths in this folder
            images = [
                os.path.join(folder_path, img) 
                for img in os.listdir(folder_path)
                if img.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
            ]
            # Join multiple images into a comma-separated string
            image_urls = ",".join(images)
            writer.writerow({
                **metadata,
                "image_url": image_urls
            })

print(f"✅ CSV generated at {csv_file}")
