# Tourism Recommendation System - Backend

Flask-based backend API for the Tourism Recommendation System.

## Quick Start

### Start Backend Server

```bash
python -m app.app
```

Server will run on: `http://localhost:8000`

## Essential Files

- `app/` - Main application code
  - `app.py` - Flask application entry point
  - `models.py` - Database models
  - `routes/` - API endpoints
  - `database.py` - Database configuration

- `datasets/` - Dataset files and images
  - `dataset_with_all_image_path.csv` - Places data
  - `destination_images/` - Place images

- `tourism.db` - SQLite database (757 places)

- `requirements.txt` - Python dependencies

- `load_dataset_simple.py` - Load CSV data into database

- `verify_data.py` - Check database contents

## API Endpoints

- `GET /` - Health check
- `POST /api/recommendations` - Get personalized recommendations
- `GET /api/recommendations/stats` - Get statistics
- `GET /datasets/<path>` - Serve dataset images

## Database

- **SQLite** database with 757 places
- Includes: name, location, type, description, tags, images, ratings, etc.

## Verify Setup

```bash
# Check database
python verify_data.py

# Should show: 757 places
```

## Requirements

- Python 3.9+
- Flask
- SQLAlchemy
- Flask-CORS

Install: `pip install -r requirements.txt`
