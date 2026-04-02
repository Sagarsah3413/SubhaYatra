import os
import cloudinary
import cloudinary.uploader

# Configure once from env vars
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
    secure=True,
)

# Folder names per content type
FOLDERS = {
    "place":      "tourism/places",
    "hotel":      "tourism/hotels",
    "restaurant": "tourism/restaurants",
    "review":     "tourism/reviews",
    "avatar":     "tourism/avatars",
}


from typing import List, Optional


def upload_image(file_storage, content_type: str = "place") -> Optional[str]:
    
    if not file_storage or not file_storage.filename:
        return None

    folder = FOLDERS.get(content_type, "tourism/misc")

    try:
        result = cloudinary.uploader.upload(
            file_storage,
            folder=folder,
            resource_type="image",
            overwrite=False,
            quality="auto",
            fetch_format="auto",
        )
        return result.get("secure_url")
    except Exception as e:
        print(f"❌ Cloudinary upload failed ({content_type}): {e}")
        return None


def upload_multiple(files: list, content_type: str = "place") -> List[str]:
    
    urls = []
    for f in files:
        url = upload_image(f, content_type)
        if url:
            urls.append(url)
    return urls


def delete_image(public_id: str) -> bool:
   
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception as e:
        print(f"❌ Cloudinary delete failed: {e}")
        return False
