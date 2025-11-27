# app/app.py
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os
from .database import init_db
from .routes.search import search_blueprint
from .routes.users import users_blueprint
from .routes.rooms import rooms_blueprint

def create_app():
    app = Flask(__name__, static_folder=None)
    origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]
    CORS(app, origins=origins, supports_credentials=True)

    # Initialize DB
    init_db()

    # Register Blueprints
    app.register_blueprint(search_blueprint, url_prefix="/api")
    app.register_blueprint(users_blueprint, url_prefix="/users")
    app.register_blueprint(rooms_blueprint, url_prefix="/rooms")

    @app.route("/")
    def index():
        return jsonify({"message": "Backend is running successfully!"})

    # Serve static datasets
    @app.route("/datasets/<path:filename>")
    def datasets_files(filename):
        datasets_dir = os.path.join(os.getcwd(), "datasets")
        return send_from_directory(datasets_dir, filename)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=8000)
