"""Itinerary routes — create, read, update, delete trip plans.

End users authenticate with Clerk on the frontend and identify themselves to
the backend via the `X-Clerk-User-Id` header (see `clerk_user_required` in
app/auth.py and the existing users.py / wishlist.py / search.py pattern). All
mutating/listing routes here require that header; a single public itinerary can
still be read anonymously.
"""

from datetime import datetime

from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Itinerary, ItineraryItem
from ..auth import clerk_user_required

itinerary_bp = Blueprint('itinerary', __name__)

DEFAULT_TITLE = 'My Trip'


# ── Helpers ────────────────────────────────────────────────────────────────

def _is_owner(clerk_id):
    """True when the current Clerk user owns the itinerary. Ownership is the
    rule for user-facing routes; admins do not go through this path."""
    user = getattr(request, 'current_user', None) or {}
    return user.get('user_id') == clerk_id


def _parse_date(value):
    """Parse an ISO date/datetime string into a datetime.

    `start_date`/`end_date` are DateTime columns, but clients send ISO strings.
    Returns a datetime on success, or None for empty/unparseable input so a bad
    date never raises. Passes through values that are already datetime.
    """
    if value is None or value == '':
        return None
    if isinstance(value, datetime):
        return value
    try:
        # Tolerate a trailing 'Z' (UTC) which fromisoformat rejects pre-3.11.
        return datetime.fromisoformat(str(value).replace('Z', '+00:00'))
    except (ValueError, TypeError):
        return None


def _coerce_int(value, default):
    """Coerce a value to int, falling back to `default` on bad input."""
    try:
        return int(value)
    except (ValueError, TypeError):
        return default


def _validate_payload(data):
    """Validate a create/update payload.

    Returns (error_message, status_code) on failure, or (None, None) on success.
    Guards types without ever raising so routes return 400, not 500.
    """
    if 'title' in data and data['title'] is not None:
        if not isinstance(data['title'], str) or not data['title'].strip():
            return 'title must be a non-empty string', 400

    if 'items' in data and not isinstance(data['items'], list):
        return 'items must be a list', 400

    if isinstance(data.get('items'), list):
        for idx, item in enumerate(data['items']):
            if not isinstance(item, dict):
                return f'items[{idx}] must be an object', 400

    return None, None


def _build_items(itinerary_id, items_data):
    """Build ItineraryItem objects for an itinerary from request data.

    Shared by create and update. `day_number`/`order_index` are coerced to int
    with sensible defaults so bad values don't blow up the request.
    """
    built = []
    for item_data in items_data or []:
        built.append(ItineraryItem(
            itinerary_id = itinerary_id,
            day_number   = _coerce_int(item_data.get('day_number'), 1),
            place_id     = item_data.get('place_id'),
            place_name   = item_data.get('place_name'),
            activity     = item_data.get('activity'),
            notes        = item_data.get('notes'),
            order_index  = _coerce_int(item_data.get('order_index'), 0),
        ))
    return built


# ── Routes ─────────────────────────────────────────────────────────────────

@itinerary_bp.route('/itineraries', methods=['GET'])
@clerk_user_required
def list_itineraries():
    """GET /api/itineraries — list the caller's itineraries (Clerk auth required)."""
    clerk_id = request.current_user['user_id']
    items    = Itinerary.query.filter_by(clerk_id=clerk_id)\
                              .order_by(Itinerary.created_at.desc()).all()
    return jsonify([i.to_dict() for i in items])


@itinerary_bp.route('/itineraries', methods=['POST'])
@clerk_user_required
def create_itinerary():
    """POST /api/itineraries — create an itinerary for the caller (Clerk auth required).

    Returns the created itinerary with its items and 201 on success.
    """
    data      = request.get_json(silent=True) or {}
    clerk_id  = request.current_user['user_id']
    user_name = request.headers.get('X-Clerk-User-Name')

    error, status = _validate_payload(data)
    if error:
        return jsonify({'error': 'Invalid input', 'message': error}), status

    title = data.get('title')
    if not isinstance(title, str) or not title.strip():
        title = DEFAULT_TITLE

    try:
        itin = Itinerary(
            clerk_id     = clerk_id,
            user_name    = user_name,
            title        = title,
            description  = data.get('description'),
            start_date   = _parse_date(data.get('start_date')),
            end_date     = _parse_date(data.get('end_date')),
            is_public    = bool(data.get('is_public', False)),
            total_budget = data.get('total_budget'),
        )
        db.session.add(itin)
        db.session.flush()  # get itin.id before adding items

        for item in _build_items(itin.id, data.get('items', [])):
            db.session.add(item)

        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Could not create itinerary'}), 500

    return jsonify(itin.to_dict()), 201


@itinerary_bp.route('/itineraries/<int:iid>', methods=['GET'])
def get_itinerary(iid):
    """GET /api/itineraries/<id> — read one itinerary.

    Public itineraries are readable by anyone; private ones require the owner's
    `X-Clerk-User-Id` header. Missing record → 404, non-owner → 403.
    """
    itin = Itinerary.query.get_or_404(iid)
    if not itin.is_public:
        clerk_id = request.headers.get('X-Clerk-User-Id')
        if not clerk_id or clerk_id != itin.clerk_id:
            return jsonify({'error': 'Access denied'}), 403
    return jsonify(itin.to_dict())


@itinerary_bp.route('/itineraries/<int:iid>', methods=['PUT'])
@clerk_user_required
def update_itinerary(iid):
    """PUT /api/itineraries/<id> — update an itinerary (owner only, Clerk auth required).

    Replaces items when `items` is provided. Missing record → 404, non-owner → 403.
    """
    itin = Itinerary.query.get_or_404(iid)
    if not _is_owner(itin.clerk_id):
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json(silent=True) or {}

    error, status = _validate_payload(data)
    if error:
        return jsonify({'error': 'Invalid input', 'message': error}), status

    try:
        if 'title' in data:
            itin.title = data['title']
        if 'description' in data:
            itin.description = data['description']
        if 'start_date' in data:
            itin.start_date = _parse_date(data['start_date'])
        if 'end_date' in data:
            itin.end_date = _parse_date(data['end_date'])
        if 'is_public' in data:
            itin.is_public = bool(data['is_public'])
        if 'total_budget' in data:
            itin.total_budget = data['total_budget']

        if 'items' in data:
            ItineraryItem.query.filter_by(itinerary_id=iid).delete()
            for item in _build_items(iid, data['items']):
                db.session.add(item)

        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Could not update itinerary'}), 500

    return jsonify(itin.to_dict())


@itinerary_bp.route('/itineraries/<int:iid>', methods=['DELETE'])
@clerk_user_required
def delete_itinerary(iid):
    """DELETE /api/itineraries/<id> — delete an itinerary (owner only, Clerk auth required).

    Missing record → 404, non-owner → 403, success → {'success': True}.
    """
    itin = Itinerary.query.get_or_404(iid)
    if not _is_owner(itin.clerk_id):
        return jsonify({'error': 'Access denied'}), 403

    try:
        db.session.delete(itin)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Could not delete itinerary'}), 500

    return jsonify({'success': True})
