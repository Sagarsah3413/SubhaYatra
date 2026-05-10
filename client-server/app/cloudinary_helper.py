"""
Cloudinary upload helper.
Falls back to local filesystem storage when Cloudinary is not configured.
"""

import os
import cloudinary
import cloudinary.uploader
from werkzeug.utils import secure_filename

# ── Init ──────────────────────────────────────────────────────────────────────

CLOUD_NAME  = os.environ.get("CLOUDINARY_CLOUD_NAME", "")
API_KEY     = os.environ.get("CLOUDINARY_API_KEY", "")
API_SECRET  = os.environ.get("CLOUDINARY_API_SECRET", "")

CLOUDINARY_ENABLED = bool(
    CLOUD_NAME and CLOUD_NAME != "your_cloud_name" and
    API_KEY    and API_KEY    != "your_api_key" and
    API_SECRET and API_SECRET != "your_api_secret"
)

if CLOUDINARY_ENABLED:
    cloudinary.config(
        cloud_name = CLOUD_NAME,
        api_key    = API_KEY,
        api_secret = API_SECRET,
        secure     = True,
    )
    print(f"✅ Cloudinary configured: cloud={CLOUD_NAME}")
else:
    print("⚠️  Cloudinary not configured — using local filesystem storage")


# ── Folder mapping ────────────────────────────────────────────────────────────

_FOLDER_MAP = {
    "place":      "tourism/places",
    "hotel":      "tourism/hotels",
    "restaurant": "tourism/restaurants",
    "review":     "tourism/reviews",
    "general":    "tourism/uploads",
}

_LOCAL_DIR_MAP = {
    "place":      os.path.join(os.getcwd(), "datasets", "destination_images"),
    "hotel":      os.path.join(os.getcwd(), "datasets", "hotel_images"),
    "restaurant": os.path.join(os.getcwd(), "datasets", "restaurant_images"),
    "review":     os.path.join(os.getcwd(), "uploads", "reviews"),
    "general":    os.path.join(os.getcwd(), "datasets", "uploads"),
}

_URL_PREFIX_MAP = {
    "place":      "/datasets/destination_images",
    "hotel":      "/datasets/hotel_images",
    "restaurant": "/datasets/restaurant_images",
    "review":     "/uploads/reviews",
    "general":    "/datasets/uploads",
}


# ── Public API ────────────────────────────────────────────────────────────────

def upload_image(file_storage, item_type: str = "general", item_id=None) -> dict:
    """
    Upload a FileStorage object.
    Returns: { "url": str, "public_id": str|None, "source": "cloudinary"|"local" }
    """
    item_type = item_type.lower()
    folder    = _FOLDER_MAP.get(item_type, "tourism/uploads")

    if CLOUDINARY_ENABLED:
        return _upload_cloudinary(file_storage, folder, item_type, item_id)
    else:
        return _upload_local(file_storage, item_type, item_id)


def delete_image(url_or_public_id: str) -> bool:
    """Delete an image by its URL or Cloudinary public_id."""
    if not url_or_public_id:
        return False

    if CLOUDINARY_ENABLED and not url_or_public_id.startswith("/"):
        # Looks like a Cloudinary URL or public_id
        try:
            public_id = _extract_public_id(url_or_public_id)
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            print(f"Cloudinary delete error: {e}")
            return False
    else:
        # Local file
        try:
            local_path = os.path.join(os.getcwd(), url_or_public_id.lstrip("/"))
            if os.path.exists(local_path):
                os.remove(local_path)
            return True
        except Exception as e:
            print(f"Local delete error: {e}")
            return False


def is_cloudinary_url(url: str) -> bool:
    return bool(url and "cloudinary.com" in url)


# ── Internal ──────────────────────────────────────────────────────────────────

def _upload_cloudinary(file_storage, folder: str, item_type: str, item_id) -> dict:
    try:
        public_id = None
        if item_id:
            filename = secure_filename(file_storage.filename)
            name_no_ext = os.path.splitext(filename)[0]
            public_id = f"{folder}/{item_type}_{item_id}_{name_no_ext}"

        result = cloudinary.uploader.upload(
            file_storage,
            folder=folder,
            public_id=public_id,
            overwrite=True,
            resource_type="image",
            transformation=[{"quality": "auto", "fetch_format": "auto"}],
        )
        return {
            "url":       result["secure_url"],
            "public_id": result["public_id"],
            "source":    "cloudinary",
        }
    except Exception as e:
        print(f"Cloudinary upload failed, falling back to local: {e}")
        return _upload_local(file_storage, item_type, item_id)


def _upload_local(file_storage, item_type: str, item_id) -> dict:
    local_dir  = _LOCAL_DIR_MAP.get(item_type, _LOCAL_DIR_MAP["general"])
    url_prefix = _URL_PREFIX_MAP.get(item_type, _URL_PREFIX_MAP["general"])

    if item_id:
        local_dir  = os.path.join(local_dir, f"item_{item_id}")
        url_prefix = f"{url_prefix}/item_{item_id}"

    os.makedirs(local_dir, exist_ok=True)
    filename  = secure_filename(file_storage.filename)
    save_path = os.path.join(local_dir, filename)
    file_storage.save(save_path)

    return {
        "url":       f"{url_prefix}/{filename}",
        "public_id": None,
        "source":    "local",
    }


def _extract_public_id(url: str) -> str:
    """Extract Cloudinary public_id from a secure URL."""
    # e.g. https://res.cloudinary.com/cloud/image/upload/v123/tourism/places/abc.jpg
    # → tourism/places/abc
    try:
        parts = url.split("/upload/")
        if len(parts) == 2:
            path = parts[1]
            # Remove version prefix (v12345/)
            if path.startswith("v") and "/" in path:
                path = path.split("/", 1)[1]
            # Remove extension
            path = os.path.splitext(path)[0]
            return path
    except Exception:
        pass
    return url
