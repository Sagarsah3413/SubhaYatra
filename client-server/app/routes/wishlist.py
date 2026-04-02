"""Wishlist routes."""

from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Wishlist, Place
from ..auth import token_required

wishlist_bp = Blueprint('wishlist', __name__)


def _own_or_admin(clerk_id):
    """Return True if the request user owns the resource or is admin."""
    u = request.current_user
    return u['user_id'] == clerk_id or u['role'] == 'admin'


@wishlist_bp.route('/wishlist/<clerk_id>', methods=['GET'])
@token_required
def get_wishlist(clerk_id):
    if not _own_or_admin(clerk_id):
        return jsonify({'error': 'Access denied'}), 403

    items = Wishlist.query.filter_by(clerk_id=clerk_id).all()
    result = []
    for item in items:
        if item.place_id and item.place:
            p = item.place
            result.append({
                'wishlist_id':  item.id,
                'id':           p.id,
                'name':         p.name,
                'location':     p.location,
                'type':         p.type,
                'description':  p.description,
                'image_url':    p.image_url,
                'tags':         p.tags,
                'added_at':     item.created_at.isoformat(),
            })
        else:
            result.append({
                'wishlist_id':  item.id,
                'id':           item.place_identifier,
                'name':         item.place_name,
                'location':     item.place_location,
                'type':         item.place_type,
                'description':  item.place_description,
                'image_url':    item.place_image_url,
                'added_at':     item.created_at.isoformat(),
            })
    return jsonify(result)


@wishlist_bp.route('/wishlist/<clerk_id>/<place_id>', methods=['POST'])
@token_required
def add_to_wishlist(clerk_id, place_id):
    if not _own_or_admin(clerk_id):
        return jsonify({'error': 'Access denied'}), 403

    user_name = request.headers.get('X-Clerk-User-Name')
    data      = request.get_json() or {}

    try:
        pid   = int(place_id)
        place = Place.query.get(pid)
        if not place:
            return jsonify({'error': 'Place not found'}), 404
        # Check duplicate
        existing = Wishlist.query.filter_by(clerk_id=clerk_id, place_id=pid).first()
        if existing:
            return jsonify({'success': True, 'wishlist_id': existing.id, 'duplicate': True})
        item = Wishlist(clerk_id=clerk_id, user_name=user_name, place_id=pid)
    except ValueError:
        # String identifier (external place)
        if not data.get('name'):
            return jsonify({'error': 'Place name required'}), 400
        existing = Wishlist.query.filter_by(clerk_id=clerk_id,
                                            place_identifier=place_id).first()
        if existing:
            return jsonify({'success': True, 'wishlist_id': existing.id, 'duplicate': True})
        item = Wishlist(
            clerk_id          = clerk_id,
            user_name         = user_name,
            place_identifier  = place_id,
            place_name        = data.get('name'),
            place_type        = data.get('type'),
            place_location    = data.get('location'),
            place_image_url   = data.get('image_url'),
            place_description = data.get('description'),
        )

    db.session.add(item)
    db.session.commit()
    return jsonify({'success': True, 'wishlist_id': item.id})


@wishlist_bp.route('/wishlist/<clerk_id>/<place_id>', methods=['DELETE'])
@token_required
def remove_from_wishlist(clerk_id, place_id):
    if not _own_or_admin(clerk_id):
        return jsonify({'error': 'Access denied'}), 403

    try:
        pid  = int(place_id)
        item = Wishlist.query.filter_by(clerk_id=clerk_id, place_id=pid).first()
    except ValueError:
        item = Wishlist.query.filter_by(clerk_id=clerk_id,
                                        place_identifier=place_id).first()

    if not item:
        return jsonify({'error': 'Not in wishlist'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'success': True})


@wishlist_bp.route('/wishlist/<clerk_id>/<place_id>/check', methods=['GET'])
@token_required
def check_wishlist(clerk_id, place_id):
    if not _own_or_admin(clerk_id):
        return jsonify({'error': 'Access denied'}), 403

    try:
        pid = int(place_id)
        exists = Wishlist.query.filter_by(clerk_id=clerk_id, place_id=pid).first()
    except ValueError:
        exists = Wishlist.query.filter_by(clerk_id=clerk_id,
                                          place_identifier=place_id).first()
    return jsonify({'in_wishlist': exists is not None})
