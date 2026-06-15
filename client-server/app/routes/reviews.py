from flask import Blueprint, request, jsonify
from datetime import datetime
from ..database import SessionLocal
from ..models import Review
import json
import os
from werkzeug.utils import secure_filename

reviews_bp = Blueprint("reviews", __name__)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads", "reviews")
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@reviews_bp.route("/reviews", methods=["POST"])
def create_review():
    """Create a new review"""
    try:
        db = SessionLocal()
        
        # Get form data
        name = request.form.get("name")
        email = request.form.get("email")
        place = request.form.get("place")
        visit_date = request.form.get("visitDate")
        review_type = request.form.get("type")
        rating = request.form.get("rating")
        review_text = request.form.get("review")
        recommend = request.form.get("recommend", "yes")
        
        # Validate required fields
        if not all([name, email, place, rating, review_text]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Handle image uploads
        image_paths = []
        for i in range(1, 5):  # Support up to 4 images
            file_key = f"image_{i}"
            if file_key in request.files:
                file = request.files[file_key]
                if file and file.filename and allowed_file(file.filename):
                    # Create unique filename
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename = secure_filename(f"{timestamp}_{i}_{file.filename}")
                    filepath = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(filepath)
                    image_paths.append(f"/uploads/reviews/{filename}")
        
        # Create review
        new_review = Review(
            name=name,
            email=email,
            place=place,
            visit_date=visit_date,
            type=review_type,
            rating=int(rating),
            review=review_text,
            recommend=recommend,
            images=json.dumps(image_paths) if image_paths else None,
            status="pending",
            created_at=datetime.utcnow()
        )
        
        db.add(new_review)
        db.commit()
        db.refresh(new_review)
        
        return jsonify({
            "message": "Review submitted successfully",
            "review_id": new_review.id,
            "status": "pending"
        }), 201
        
    except Exception as e:
        print(f"Error creating review: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@reviews_bp.route("/reviews", methods=["GET"])
def get_reviews():
    """Get all reviews (with optional filters)"""
    try:
        db = SessionLocal()
        
        # Get query parameters
        status = request.args.get("status")  # pending, approved, rejected
        place = request.args.get("place")
        limit = request.args.get("limit", type=int)
        
        # Build query
        query = db.query(Review)
        
        if status:
            query = query.filter(Review.status == status)
        if place:
            query = query.filter(Review.place.ilike(f"%{place}%"))
        
        # Order by created_at descending
        query = query.order_by(Review.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        
        reviews = query.all()
        
        # Format response
        reviews_list = []
        for review in reviews:
            reviews_list.append({
                "id": review.id,
                "name": review.name,
                "email": review.email,
                "place": review.place,
                "visit_date": review.visit_date,
                "type": review.type,
                "rating": review.rating,
                "review": review.review,
                "recommend": review.recommend,
                "images": json.loads(review.images) if review.images else [],
                "status": review.status,
                "created_at": review.created_at.isoformat() if review.created_at else None,
                "approved_at": review.approved_at.isoformat() if review.approved_at else None,
                "admin_notes": review.admin_notes
            })
        
        return jsonify({
            "reviews": reviews_list,
            "total": len(reviews_list)
        }), 200
        
    except Exception as e:
        print(f"Error fetching reviews: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@reviews_bp.route("/reviews/<int:review_id>", methods=["GET"])
def get_review(review_id):
    """Get a single review by ID"""
    try:
        db = SessionLocal()
        review = db.query(Review).filter(Review.id == review_id).first()
        
        if not review:
            return jsonify({"error": "Review not found"}), 404
        
        return jsonify({
            "id": review.id,
            "name": review.name,
            "email": review.email,
            "place": review.place,
            "visit_date": review.visit_date,
            "type": review.type,
            "rating": review.rating,
            "review": review.review,
            "recommend": review.recommend,
            "images": json.loads(review.images) if review.images else [],
            "status": review.status,
            "created_at": review.created_at.isoformat() if review.created_at else None,
            "approved_at": review.approved_at.isoformat() if review.approved_at else None,
            "admin_notes": review.admin_notes
        }), 200
        
    except Exception as e:
        print(f"Error fetching review: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@reviews_bp.route("/reviews/<int:review_id>/status", methods=["PATCH"])
def update_review_status(review_id):
    """Update review status (approve/reject) - Admin only"""
    try:
        db = SessionLocal()
        review = db.query(Review).filter(Review.id == review_id).first()
        
        if not review:
            return jsonify({"error": "Review not found"}), 404
        
        data = request.json
        new_status = data.get("status")
        admin_notes = data.get("admin_notes")
        
        if new_status not in ["pending", "approved", "rejected"]:
            return jsonify({"error": "Invalid status"}), 400
        
        review.status = new_status
        if admin_notes:
            review.admin_notes = admin_notes
        
        if new_status == "approved":
            review.approved_at = datetime.utcnow()
        
        db.commit()
        
        return jsonify({
            "message": f"Review {new_status} successfully",
            "review_id": review.id,
            "status": review.status
        }), 200
        
    except Exception as e:
        print(f"Error updating review status: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@reviews_bp.route("/reviews/<int:review_id>", methods=["DELETE"])
def delete_review(review_id):
    """Delete a review - Admin only"""
    try:
        db = SessionLocal()
        review = db.query(Review).filter(Review.id == review_id).first()
        
        if not review:
            return jsonify({"error": "Review not found"}), 404
        
        # Delete associated images
        if review.images:
            image_paths = json.loads(review.images)
            for image_path in image_paths:
                full_path = os.path.join(os.getcwd(), image_path.lstrip('/'))
                if os.path.exists(full_path):
                    os.remove(full_path)
        
        db.delete(review)
        db.commit()
        
        return jsonify({"message": "Review deleted successfully"}), 200
        
    except Exception as e:
        print(f"Error deleting review: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@reviews_bp.route("/reviews/stats", methods=["GET"])
def get_review_stats():
    """Get review statistics - Admin dashboard"""
    try:
        db = SessionLocal()
        
        total_reviews = db.query(Review).count()
        pending_reviews = db.query(Review).filter(Review.status == "pending").count()
        approved_reviews = db.query(Review).filter(Review.status == "approved").count()
        rejected_reviews = db.query(Review).filter(Review.status == "rejected").count()
        
        # Average rating
        from sqlalchemy import func
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.status == "approved").scalar()
        
        # Reviews by type
        reviews_by_type = {}
        types = ["Nature", "Cultural", "Adventure", "City", "Relaxation"]
        for review_type in types:
            count = db.query(Review).filter(Review.type == review_type, Review.status == "approved").count()
            reviews_by_type[review_type] = count
        
        return jsonify({
            "total_reviews": total_reviews,
            "pending_reviews": pending_reviews,
            "approved_reviews": approved_reviews,
            "rejected_reviews": rejected_reviews,
            "average_rating": round(avg_rating, 2) if avg_rating else 0,
            "reviews_by_type": reviews_by_type
        }), 200
        
    except Exception as e:
        print(f"Error fetching review stats: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
