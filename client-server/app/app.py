from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

from .database import init_db, db
from .routes.search import search_blueprint
from .routes.users import users_blueprint
from .routes.rooms import rooms_blueprint
from .routes.chat_routes import chat_bp
from .routes.admin import admin_bp   # ⭐ ADMIN IMPORT


def create_app():
    app = Flask(__name__, static_folder=None)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///./tourism.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    CORS(app, origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ], supports_credentials=True)

    # ❌ No table creation
    init_db()

    # Register existing routes
    app.register_blueprint(search_blueprint, url_prefix="/api")
    app.register_blueprint(users_blueprint, url_prefix="/users")
    app.register_blueprint(rooms_blueprint, url_prefix="/rooms")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")

    from .routes.places import places_bp
    app.register_blueprint(places_bp, url_prefix="/api")

    # ⭐ ADMIN ROUTE
    app.register_blueprint(admin_bp)

    @app.route("/")
    def index():
        return jsonify({"message": "Backend is running successfully!"})

    @app.route("/datasets/<path:filename>")
    def datasets_files(filename):
        datasets_dir = os.path.join(os.getcwd(), "datasets")
        return send_from_directory(datasets_dir, filename)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=8000)
