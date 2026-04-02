"""Reviews routes — Cloudinary image upload + admin moderation."""

import json
from datetime import datetime
from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Review, Admin
from ..cloudinary_helper import upload_multiple
from ..auth import admin_required

reviews_bp = Blueprint('reviews', __name__)


@reviews_bp.route('/reviews', methods=['POST'])
def create_review():
    name        = request.form.get('name')
    email       = request.form.get('email')
    place       = request.form.get('place')
    rating      = request.form.get('rating')
    review_text = request.form.get('review')

    if not all([name, email, place, rating, review_text]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Upload images to Cloudinary
    files      = [f for key, f in sorted(request.files.items()) if f and f.filename]
    image_urls = upload_multiple(files, 'review')

    # Clerk user info from headers
    clerk_id  = request.headers.get('X-Clerk-User-Id')
    user_name = request.headers.get('X-Clerk-User-Name')

    review = Review(
        name       = name,
        email      = email,
        place      = place,
        place_id   = request.form.get('place_id', type=int),
        visit_date = request.form.get('visitDate'),
        type       = request.form.get('type'),
        rating     = int(rating),
        review     = review_text,
        recommend  = request.form.get('recommend', 'yes'),
        images     = json.dumps(image_urls) if image_urls else None,
        clerk_id   = clerk_id,
        user_name  = user_name,
        status     = 'pending',
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review submitted', 'review_id': review.id,
                    'status': 'pending'}), 201


@reviews_bp.route('/reviews', methods=['GET'])
def list_reviews():
    status   = request.args.get('status')
    place    = request.args.get('place')
    limit    = request.args.get('limit', type=int)
    clerk_id = request.args.get('clerk_id')

    q = Review.query
    if status:
        q = q.filter(Review.status == status)
    if place:
        q = q.filter(Review.place.ilike(f'%{place}%'))
    if clerk_id:
        q = q.filter(Review.clerk_id == clerk_id)
    q = q.order_by(Review.created_at.desc())
    if limit:
        q = q.limit(limit)

    reviews = q.all()
    return jsonify({'reviews': [r.to_dict() for r in reviews], 'total': len(reviews)})


@reviews_bp.route('/reviews/<int:rid>', methods=['GET'])
def get_review(rid):
    return jsonify(Review.query.get_or_404(rid).to_dict())


@reviews_bp.route('/reviews/<int:rid>/status', methods=['PATCH'])
@admin_required
def update_review_status(rid):
    review     = Review.query.get_or_404(rid)
    data       = request.get_json() or {}
    new_status = data.get('status')

    if new_status not in ('pending', 'approved', 'rejected'):
        return jsonify({'error': 'Invalid status'}), 400

    review.status      = new_status
    review.admin_notes = data.get('admin_notes', review.admin_notes)
    if new_status == 'approved':
        review.approved_at = datetime.utcnow()

    # Audit via admin's action_log
    admin = Admin.query.get(request.current_user['user_id'])
    if admin:
        admin.log_action(f'{new_status}_review', 'review', rid)
        db.session.add(admin)
    db.session.commit()
    return jsonify({'success': True, 'status': new_status})


@reviews_bp.route('/reviews/<int:rid>', methods=['DELETE'])
@admin_required
def delete_review(rid):
    review = Review.query.get_or_404(rid)
    db.session.delete(review)
    db.session.commit()
    return jsonify({'success': True})


@reviews_bp.route('/reviews/stats', methods=['GET'])
def review_stats():
    from sqlalchemy import func
    total    = Review.query.count()
    pending  = Review.query.filter_by(status='pending').count()
    approved = Review.query.filter_by(status='approved').count()
    rejected = Review.query.filter_by(status='rejected').count()
    avg      = db.session.query(func.avg(Review.rating))\
                         .filter(Review.status == 'approved').scalar()
    return jsonify({'total': total, 'pending': pending,
                    'approved': approved, 'rejected': rejected,
                    'average_rating': round(avg, 2) if avg else 0})
