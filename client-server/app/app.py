from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv  # ✅ Load .env

# Add the app directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from .database import init_db, db, init_flask_db
from .routes.search import search_blueprint
from .routes.users import users_blueprint
from .routes.rooms import rooms_blueprint
from .routes.chat_routes import chat_bp
from .routes.admin import admin_bp   # ⭐ Admin routes (login + dashboard)
from .routes.places import places_bp
from .routes.wishlist import wishlist_bp
from .routes.hotels import hotels_bp
from .routes.restaurants import restaurants_bp
from .routes.images import images_bp
from .routes.recommendations import recommendations_bp  # ⭐ Recommendations routes
from .routes.reviews import reviews_bp  # ⭐ Reviews routes
from .routes.contact import contact_bp  # ⭐ Contact form routes
from .routes.clerk_sync import clerk_sync_bp  # ⭐ Clerk user sync + webhook
from .routes.analytics import analytics_bp    # ⭐ Analytics / admin dashboard
from .routes.tracking import tracking_bp      # ⭐ Search / recommendation / itinerary tracking
from .routes.saved_itineraries import saved_itineraries_bp  # ⭐ Saved itineraries
# Removed place_details_bp - using places_bp instead which has events support

# -----------------------------
# Load .env from backend folder
# -----------------------------
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

# -----------------------------
# Ensure Clerk server API key exists
# -----------------------------
CLERK_API_KEY = os.environ.get("CLERK_API_KEY")
if not CLERK_API_KEY:
    print("⚠️ CLERK_API_KEY not found. Add it to client-server/.env")

def create_app():
    # Disable instance folder creation by setting instance_relative_config=False
    # and explicitly setting instance_path to None
    app = Flask(__name__, static_folder=None, instance_relative_config=False)

    # -----------------------------
    # Database configuration
    # -----------------------------
    # Use absolute path to ensure Flask-SQLAlchemy and SessionLocal use the same DB file
    import os as _os
    db_path = _os.path.join(_os.getcwd(), "tourism.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    # -----------------------------
    # CORS setup
    # -----------------------------
    CORS(app, origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:3000",
        "https://roamiowanderly-eyk8dfgy6-sagar-kumar-sahs-projects.vercel.app/"
    ], supports_credentials=True)

    # -----------------------------
    # Initialize DB
    # -----------------------------
    init_db()
    init_flask_db(app)  # Create Flask-SQLAlchemy tables

    # -----------------------------
    # Initialize Cloudinary
    # -----------------------------
    from .cloudinary_helper import CLOUDINARY_ENABLED  # triggers config on import
    if CLOUDINARY_ENABLED:
        print("☁️  Cloudinary image storage: ACTIVE")
    else:
        print("📁  Image storage: local filesystem (add Cloudinary keys to .env to enable cloud)")

    # -----------------------------
    # Register blueprints/routes
    # -----------------------------
    app.register_blueprint(search_blueprint, url_prefix="/api")
    app.register_blueprint(users_blueprint, url_prefix="/users")
    app.register_blueprint(rooms_blueprint, url_prefix="/rooms")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(places_bp, url_prefix="/api")  # ⭐ Main places routes with events support
    app.register_blueprint(wishlist_bp, url_prefix="/api")
    app.register_blueprint(hotels_bp, url_prefix="/api")
    app.register_blueprint(restaurants_bp, url_prefix="/api")
    app.register_blueprint(images_bp, url_prefix="/api")
    app.register_blueprint(recommendations_bp, url_prefix="/api")  # Recommendations routes
    app.register_blueprint(reviews_bp, url_prefix="/api")  # Reviews routes
    app.register_blueprint(contact_bp, url_prefix="/api")  # Contact form routes
    app.register_blueprint(clerk_sync_bp, url_prefix="/api")   # Clerk sync + webhook
    app.register_blueprint(analytics_bp, url_prefix="/api")    # Analytics
    app.register_blueprint(tracking_bp, url_prefix="/api")     # Tracking
    app.register_blueprint(saved_itineraries_bp, url_prefix="/api")  # Saved itineraries
    # Removed place_details_bp registration - using places_bp instead
    app.register_blueprint(admin_bp, url_prefix="/api")  # Admin login/dashboard routes

    # -----------------------------
    # Root route
    # -----------------------------
    @app.route("/")
    def index():
        return jsonify({"message": "Backend is running successfully!"})

    # -----------------------------
    # Serve datasets files
    # -----------------------------
    @app.route("/datasets/<path:filename>")
    def datasets_files(filename):
        datasets_dir = os.path.join(os.getcwd(), "datasets")
        return send_from_directory(datasets_dir, filename)

    # -----------------------------
    # Serve uploaded review images
    # -----------------------------
    @app.route("/uploads/reviews/<path:filename>")
    def review_images(filename):
        uploads_dir = os.path.join(os.getcwd(), "uploads", "reviews")
        return send_from_directory(uploads_dir, filename)

    return app

# -----------------------------
# Run the Flask app
# -----------------------------
if __name__ == "__main__":
    app = create_app()
    print("🚀 Starting Tourism Recommendation System Backend Server...")
    print("📍 Server running at: http://localhost:8000")
    print("🌐 CORS enabled for frontend at: http://localhost:5173")
    print("📊 Database: SQLite (tourism.db)")
    print("=" * 50)
    
    app.run(debug=True, host="0.0.0.0", port=10000)
