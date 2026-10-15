"""
Tourism Recommendation System Backend Package
"""

__version__ = "1.0.0"
__author__ = "Tourism Recommendation System Team"

# Make the create_app function available at package level


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
