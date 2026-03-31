"""
Places routes — CRUD + Cloudinary image upload + moderation.
"""

import json
from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Place, Hotel, Restaurant, Event
from ..cloudinary_helper import upload_multiple
from ..auth import admin_required

places_bp = Blueprint('places', __name__)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _collect_images(files_dict, content_type):
    """Upload all images from request.files to Cloudinary, return URL list."""
    files = [f for key, f in sorted(files_dict.items()) if f and f.filename]
    return upload_multiple(files, content_type)


def _cover(urls, index=0):
    """Pick cover image URL from list."""
    if not urls:
        return None
    return urls[index] if index < len(urls) else urls[0]


# ── Public endpoints ──────────────────────────────────────────────────────────

@places_bp.route('/places', methods=['GET'])
def list_places():
    page       = request.args.get('page', 1, type=int)
    limit_arg  = request.args.get('limit', '20')
    status     = request.args.get('status', 'approved')
    place_type = request.args.get('type')
    province   = request.args.get('province')
    difficulty = request.args.get('difficulty')
    search     = request.args.get('search')

    q = Place.query
    if status != 'all':
        q = q.filter(Place.status == status)
    if place_type:
        q = q.filter(Place.type.ilike(f'%{place_type}%'))
    if province:
        q = q.filter(Place.province == province)
    if difficulty:
        q = q.filter(Place.difficulty_level.ilike(f'%{difficulty}%'))
    if search:
        q = q.filter(
            Place.name.ilike(f'%{search}%') |
            Place.description.ilike(f'%{search}%') |
            Place.tags.ilike(f'%{search}%')
        )

    total = q.count()

    if limit_arg.lower() == 'all':
        places = q.order_by(Place.id.desc()).all()
        limit  = total
        pages  = 1
    else:
        limit  = int(limit_arg)
        places = q.order_by(Place.id.desc()).offset((page - 1) * limit).limit(limit).all()
        pages  = (total + limit - 1) // limit

    return jsonify({'places': [p.to_dict() for p in places],
                    'total': total, 'page': page, 'limit': limit, 'pages': pages})


@places_bp.route('/places/<int:place_id>', methods=['GET'])
def get_place(place_id):
    place = Place.query.get_or_404(place_id)
    data  = place.to_dict()
    data['hotels']      = [h.to_dict() for h in place.hotels]
    data['restaurants'] = [r.to_dict() for r in place.restaurants]
    data['events']      = [{'id': e.id, 'name': e.name, 'venue': e.venue,
                             'month_season': e.month_season, 'event_type': e.event_type,
                             'description': e.description} for e in place.events]

    # Track view — resolve user_name from local users table
    try:
        from ..models import PlaceView, User as UserModel
        clerk_id  = request.headers.get('X-Clerk-User-Id')
        user_name = None
        if clerk_id:
            u = UserModel.query.filter_by(clerk_id=clerk_id).first()
            user_name = u.name if u else request.headers.get('X-Clerk-User-Name', '')
        db.session.add(PlaceView(clerk_id=clerk_id, user_name=user_name, place_name=place.name))
        db.session.commit()
    except Exception:
        db.session.rollback()

    return jsonify(data)


@places_bp.route('/places/featured', methods=['GET'])
def featured_places():
    limit  = request.args.get('limit', 6, type=int)
    places = Place.query.filter(Place.status == 'approved')\
                        .order_by(Place.rating.desc().nullslast())\
                        .limit(limit).all()
    return jsonify([p.to_dict() for p in places])


@places_bp.route('/places/categories', methods=['GET'])
def place_categories():
    rows = db.session.query(Place.type).distinct().all()
    return jsonify([r[0] for r in rows if r[0]])


@places_bp.route('/places/provinces', methods=['GET'])
def place_provinces():
    rows = db.session.query(Place.province).distinct().all()
    return jsonify([r[0] for r in rows if r[0]])


@places_bp.route('/places/search', methods=['GET'])
def search_places():
    from sqlalchemy import case
    q_text   = request.args.get('q', '')
    category = request.args.get('category')
    if not q_text:
        return jsonify({'error': 'Search query required'}), 400

    relevance = case(
        (Place.name.ilike(q_text),           100),
        (Place.name.ilike(f'{q_text}%'),      90),
        (Place.name.ilike(f'%{q_text}%'),     80),
        (Place.location.ilike(f'%{q_text}%'), 70),
        (Place.tags.ilike(f'%{q_text}%'),     60),
        (Place.description.ilike(f'%{q_text}%'), 40),
        else_=0
    ).label('relevance')

    q = db.session.query(Place, relevance).filter(
        Place.name.ilike(f'%{q_text}%') |
        Place.description.ilike(f'%{q_text}%') |
        Place.tags.ilike(f'%{q_text}%') |
        Place.location.ilike(f'%{q_text}%')
    )
    if category:
        q = q.filter(Place.type.ilike(f'%{category}%'))

    rows    = q.order_by(relevance.desc()).all()
    results = [p.to_dict() for p, _ in rows]
    return jsonify({'query': q_text, 'results': results, 'count': len(results)})


@places_bp.route('/details/<string:item_type>/<path:item_name>', methods=['GET'])
def get_details_by_name(item_type, item_name):
    """
    Fetch full details for a place/hotel/restaurant by type + name.
    Used by the detail page when navigating from search results.
    """
    from urllib.parse import unquote
    item_name = unquote(item_name)
    t = item_type.lower()

    if t in ('place', 'places'):
        obj = Place.query.filter(
            Place.name.ilike(item_name), Place.status == 'approved'
        ).first()
        if not obj:
            obj = Place.query.filter(
                Place.name.ilike(f'%{item_name}%'), Place.status == 'approved'
            ).first()
        if not obj:
            return jsonify({'error': 'Place not found'}), 404
        data = obj.to_dict()
        data['_type'] = 'place'
        data['hotels'] = [h.to_dict() for h in obj.hotels[:6]]
        data['restaurants'] = [r.to_dict() for r in obj.restaurants[:6]]
        # track view
        try:
            clerk_id  = request.headers.get('X-Clerk-User-Id')
            user_name = None
            if clerk_id:
                from ..models import PlaceView, User as UserModel
                u = UserModel.query.filter_by(clerk_id=clerk_id).first()
                user_name = u.name if u else request.headers.get('X-Clerk-User-Name', '')
            else:
                from ..models import PlaceView
            db.session.add(PlaceView(clerk_id=clerk_id, user_name=user_name, place_name=obj.name))
            db.session.commit()
        except Exception:
            db.session.rollback()
        return jsonify(data)

    elif t in ('hotel', 'hotels'):
        obj = Hotel.query.filter(
            Hotel.name.ilike(item_name), Hotel.status == 'approved'
        ).first()
        if not obj:
            obj = Hotel.query.filter(
                Hotel.name.ilike(f'%{item_name}%'), Hotel.status == 'approved'
            ).first()
        if not obj:
            return jsonify({'error': 'Hotel not found'}), 404
        data = obj.to_dict()
        data['_type'] = 'hotel'
        if obj.place:
            data['place'] = obj.place.to_dict()
        return jsonify(data)

    elif t in ('restaurant', 'restaurants'):
        obj = Restaurant.query.filter(
            Restaurant.name.ilike(item_name), Restaurant.status == 'approved'
        ).first()
        if not obj:
            obj = Restaurant.query.filter(
                Restaurant.name.ilike(f'%{item_name}%'), Restaurant.status == 'approved'
            ).first()
        if not obj:
            return jsonify({'error': 'Restaurant not found'}), 404
        data = obj.to_dict()
        data['_type'] = 'restaurant'
        if obj.place:
            data['place'] = obj.place.to_dict()
        return jsonify(data)

    return jsonify({'error': 'Invalid type'}), 400




@places_bp.route('/places', methods=['POST'])
def submit_place():
    """
    Accepts multipart/form-data.
    submission_type: place | hotel | restaurant
    Images uploaded to Cloudinary automatically.
    Clerk user info read from custom headers set by frontend.
    """
    clerk_id   = request.headers.get('X-Clerk-User-Id')
    user_name  = request.headers.get('X-Clerk-User-Name')
    sub_type   = request.form.get('submission_type', 'place')
    name       = request.form.get('name')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    image_urls = _collect_images(request.files, sub_type)
    cover      = _cover(image_urls, int(request.form.get('cover_index', 0)))
    images_json= json.dumps(image_urls) if image_urls else None

    common = dict(
        name        = name,
        location    = request.form.get('location'),
        description = request.form.get('description'),
        tags        = request.form.get('tags'),
        image_url   = cover,
        all_images  = images_json,
        clerk_id    = clerk_id,
        user_name   = user_name,
        source      = 'user_submission',
        status      = 'pending',
    )

    try:
        if sub_type == 'hotel':
            obj = Hotel(**common,
                        rating      = float(request.form.get('rating') or 0) or None,
                        price_range = request.form.get('price_range', 'Mid-range'))
        elif sub_type == 'restaurant':
            obj = Restaurant(**common,
                             rating      = float(request.form.get('rating') or 0) or None,
                             price_range = request.form.get('price_level', 'Moderate'),
                             cuisine     = request.form.get('cuisine'))
        else:
            obj = Place(**common,
                        type     = request.form.get('type'),
                        province = request.form.get('province'))

        db.session.add(obj)
        db.session.commit()
        return jsonify({'success': True, 'id': obj.id,
                        'status': 'pending', 'type': sub_type}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ── Admin moderation ──────────────────────────────────────────────────────────

def _moderate(model, record_id, new_status, admin_action):
    """Generic approve/reject helper."""
    from ..models import AdminLog
    record = model.query.get_or_404(record_id)
    record.status = new_status

    admin_id   = request.current_user.get('user_id')
    admin_name = request.current_user.get('username', '')
    log = AdminLog(admin_id=admin_id, admin_name=admin_name,
                   action=admin_action, target_type=model.__tablename__,
                   target_id=record_id)
    db.session.add(log)
    db.session.commit()
    return jsonify({'success': True, 'status': new_status})


@places_bp.route('/places/<int:pid>/approve', methods=['POST'])
@admin_required
def approve_place(pid):
    return _moderate(Place, pid, 'approved', 'approve_place')


@places_bp.route('/places/<int:pid>/reject', methods=['POST'])
@admin_required
def reject_place(pid):
    return _moderate(Place, pid, 'rejected', 'reject_place')


@places_bp.route('/places/<int:pid>', methods=['DELETE'])
@admin_required
def delete_place(pid):
    place = Place.query.get_or_404(pid)
    db.session.delete(place)
    db.session.commit()
    return jsonify({'success': True})
