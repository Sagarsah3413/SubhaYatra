"""
Main entry point for running the Tourism Recommendation System backend as a module.
Usage: python -m app
"""

from .app import create_app

def main():
    """Main function to start the Flask application"""
    app = create_app()
    print("🚀 Starting Tourism Recommendation System Backend Server...")
    print("📍 Server running at: http://localhost:8000")
    print("🌐 CORS enabled for frontend at: http://localhost:5173")
    print("📊 Database: SQLite (tourism.db)")
    print("=" * 50)
    
    app.run(debug=True, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()