from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv  # ✅ Load .env

# Add the app directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from .database import init_db, db
from .routes.search import search_blueprint
from .routes.users import users_blueprint
from .routes.rooms import rooms_blueprint
from .routes.chat_routes import chat_bp
from .routes.admin import admin_bp   # ⭐ Admin routes (login + dashboard)
from .routes.places import places_bp
from .routes.wishlist import wishlist_bp
from .routes.hotels import hotels_bp

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
    app = Flask(__name__, static_folder=None)

    # -----------------------------
    # Database configuration
    # -----------------------------
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///./tourism.db"
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
        "http://127.0.0.1:3000"
    ], supports_credentials=True)

    # -----------------------------
    # Initialize DB
    # -----------------------------
    init_db()

    # -----------------------------
    # Register blueprints/routes
    # -----------------------------
    app.register_blueprint(search_blueprint, url_prefix="/api")
    app.register_blueprint(users_blueprint, url_prefix="/users")
    app.register_blueprint(rooms_blueprint, url_prefix="/rooms")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(places_bp, url_prefix="/api")
    app.register_blueprint(wishlist_bp, url_prefix="/api")
    app.register_blueprint(hotels_bp, url_prefix="/api")
    app.register_blueprint(admin_bp)  # Admin login/dashboard routes

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
    
    app.run(debug=True, host="0.0.0.0", port=8000)
