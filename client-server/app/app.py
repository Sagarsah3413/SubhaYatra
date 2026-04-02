"""
Flask application factory.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env from client-server/
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))


def create_app():
    app = Flask(__name__, instance_relative_config=False)

    # ── Database ──────────────────────────────────────────────────────────────
    # Place tourism.db at client-server/tourism.db (not inside instance/)
    db_path = os.path.join(os.path.dirname(__file__), '..', 'tourism.db')
    db_path = os.path.abspath(db_path)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS(app, origins=[
        "http://localhost:5173", "http://localhost:5174", "http://localhost:5175",
        "http://127.0.0.1:5173", "http://127.0.0.1:5174",
        "https://roamiowanderly-eyk8dfgy6-sagar-kumar-sahs-projects.vercel.app",
    ], supports_credentials=True)

    # ── Init DB (creates all tables) ──────────────────────────────────────────
    from .database import init_db
    init_db(app)

    # ── Register blueprints ───────────────────────────────────────────────────
    from .routes.users        import users_bp
    from .routes.places       import places_bp
    from .routes.hotels       import hotels_bp
    from .routes.restaurants  import restaurants_bp
    from .routes.reviews      import reviews_bp
    from .routes.wishlist     import wishlist_bp
    from .routes.search       import search_bp
    from .routes.recommendations import recommendations_bp
    from .routes.admin        import admin_bp
    from .routes.chat_routes  import chat_bp
    from .routes.contact      import contact_bp
    from .routes.itinerary    import itinerary_bp

    app.register_blueprint(users_bp,           url_prefix="/api")
    app.register_blueprint(places_bp,          url_prefix="/api")
    app.register_blueprint(hotels_bp,          url_prefix="/api")
    app.register_blueprint(restaurants_bp,     url_prefix="/api")
    app.register_blueprint(reviews_bp,         url_prefix="/api")
    app.register_blueprint(wishlist_bp,        url_prefix="/api")
    app.register_blueprint(search_bp,          url_prefix="/api")
    app.register_blueprint(recommendations_bp, url_prefix="/api")
    app.register_blueprint(admin_bp,           url_prefix="/api")
    app.register_blueprint(chat_bp,            url_prefix="/api/chat")
    app.register_blueprint(contact_bp,         url_prefix="/api")
    app.register_blueprint(itinerary_bp,       url_prefix="/api")

    @app.route("/")
    def index():
        return jsonify({"message": "Tourism API is running."})

    # ── Serve dataset images as static files ──────────────────────────────────
    import os as _os
    from flask import send_from_directory

    datasets_path = _os.path.abspath(_os.path.join(_os.path.dirname(__file__), '..', 'datasets'))

    @app.route('/api/images/destinations/<path:filename>')
    def serve_destination_image(filename):
        from urllib.parse import unquote
        filename = unquote(filename)
        folder = _os.path.join(datasets_path, 'destination_images')
        return send_from_directory(folder, filename)

    @app.route('/api/images/hotels/<path:filename>')
    def serve_hotel_image(filename):
        from urllib.parse import unquote
        filename = unquote(filename)
        folder = _os.path.join(datasets_path, 'hotel_images')
        return send_from_directory(folder, filename)

    @app.route('/api/images/restaurants/<path:filename>')
    def serve_restaurant_image(filename):
        from urllib.parse import unquote
        filename = unquote(filename)
        folder = _os.path.join(datasets_path, 'restaurant_images')
        return send_from_directory(folder, filename)

    return app
