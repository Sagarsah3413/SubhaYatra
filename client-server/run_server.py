#!/usr/bin/env python3
"""
Clean server runner for Roamio Wanderly Backend
This eliminates the module import warning.
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and create the app
from app.app import create_app

if __name__ == "__main__":
    print("🌄 Starting Roamio Wanderly Backend Server...")
    print("📍 Server will run at: http://localhost:8000")
    print("🌐 CORS enabled for frontend at: http://localhost:5173")
    print("=" * 50)
    
    # Create and run the Flask app
    app = create_app()
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True,
        use_reloader=True
    )