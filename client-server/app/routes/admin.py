"""
Admin routes — login, dashboard stats, review/place/hotel/restaurant moderation.
All moderation actions are logged to AdminLog.
"""

import os
import requests
from datetime import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy import func
from ..database import db
from ..models import (Admin, Place, Hotel, Restaurant, Event,
                      Review, User, Wishlist,
                      Itinerary, PlaceView)
from ..auth import (admin_required, token_required,
                    generate_token, verify_password, hash_password)

admin_bp = Blueprint('admin', __name__)

CLERK_API_KEY = os.environ.get("CLERK_API_KEY")
CLERK_API_URL = "https://api.clerk.dev/v1/users"


# ── Helpers ───────────────────────────────────────────────────────────────────

def _clerk_users():
    if not CLERK_API_KEY:
        return []
    try:
        r = requests.get(CLERK_API_URL,
                         headers={"Authorization": f"Bearer {CLERK_API_KEY}"})
        return r.json() if r.status_code == 200 else []
    except Exception:
        return []


def _log(action, target_type=None, target_id=None, notes=None):
    """Append an action entry to the current admin's action_log JSON."""
    admin = Admin.query.get(request.current_user['user_id'])
    if admin:
        admin.log_action(action, target_type=target_type,
                         target_id=target_id, notes=notes)


# ── Auth ──────────────────────────────────────────────────────────────────────

@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    admin = Admin.query.filter_by(username=username, is_active=True).first()
    if not admin or not verify_password(password, admin.password):
        return jsonify({'error': 'Invalid credentials'}), 401

    admin.record_login(ip=request.remote_addr,
                       ua=request.headers.get('User-Agent', ''))
    db.session.commit()

    access_token  = generate_token(admin.id, admin.username, role='admin', token_type='access')
    refresh_token = generate_token(admin.id, admin.username, role='admin', token_type='refresh')

    return jsonify({
        'message':        'Login successful',
        'admin':          admin.to_dict(),
        'access_token':   access_token,
        'refresh_token':  refresh_token,
        'token_type':     'Bearer',
        'expires_in':     86400,
    })


@admin_bp.route('/admin/register', methods=['POST'])
@admin_required
def admin_register():
    data     = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    email    = data.get('email')
    role     = data.get('role', 'moderator')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400
    if Admin.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    new_admin = Admin(username=username, password=hash_password(password),
                      email=email, role=role)
    db.session.add(new_admin)
    db.session.flush()
    _log('create_admin', 'admin', notes=f'Created admin: {username}')
    db.session.commit()
    return jsonify({'message': 'Admin created', 'admin': new_admin.to_dict()}), 201


@admin_bp.route('/admin/refresh', methods=['POST'])
def admin_refresh():
    from ..auth import decode_token
    data  = request.get_json() or {}
    token = data.get('refresh_token')
    if not token:
        return jsonify({'error': 'Refresh token required'}), 400
    payload = decode_token(token)
    if not payload or payload.get('type') != 'refresh':
        return jsonify({'error': 'Invalid refresh token'}), 401
    access_token = generate_token(payload['user_id'], payload['username'],
                                  role=payload['role'], token_type='access')
    return jsonify({'access_token': access_token, 'token_type': 'Bearer', 'expires_in': 86400})


@admin_bp.route('/admin/logout', methods=['POST'])
@token_required
def admin_logout():
    from ..auth import blacklist_token
    admin = Admin.query.get(request.current_user['user_id'])
    if admin:
        admin.record_logout()
        db.session.commit()
    auth = request.headers.get('Authorization', '')
    if ' ' in auth:
        blacklist_token(auth.split(' ')[1])
    return jsonify({'message': 'Logged out'})


# ── Dashboard ─────────────────────────────────────────────────────────────────

@admin_bp.route('/admin/dashboard', methods=['GET'])
@admin_required
def dashboard():
    users      = _clerk_users()
    this_month = datetime.utcnow().month

    new_users = 0
    for u in users:
        ts = u.get('created_at')
        if not ts:
            continue
        try:
            dt = datetime.utcfromtimestamp(ts / 1000 if ts > 1e12 else ts) \
                 if isinstance(ts, int) \
                 else datetime.fromisoformat(str(ts).replace('Z', '+00:00'))
            if dt.month == this_month:
                new_users += 1
        except Exception:
            pass

    # Pending submissions
    pending_places      = Place.query.filter_by(status='pending').count()
    pending_hotels      = Hotel.query.filter_by(status='pending').count()
    pending_restaurants = Restaurant.query.filter_by(status='pending').count()
    pending_reviews     = Review.query.filter_by(status='pending').count()

    return jsonify({
        'total_places':       Place.query.count(),
        'total_hotels':       Hotel.query.count(),
        'total_restaurants':  Restaurant.query.count(),
        'total_events':       Event.query.count(),
        'total_bookings':     0,
        'total_users':        len(users),
        'total_users_local':  User.query.count(),          # users synced to local DB
        'active_users':       User.query.filter_by(is_active=True).count(),
        'new_users_this_month': new_users,
        'total_sessions':     sum(u.total_logins or 0 for u in User.query.all()),
        'pending': {
            'places':      pending_places,
            'hotels':      pending_hotels,
            'restaurants': pending_restaurants,
            'reviews':     pending_reviews,
        },
        'review_stats': {
            'total':    Review.query.count(),
            'pending':  pending_reviews,
            'approved': Review.query.filter_by(status='approved').count(),
            'rejected': Review.query.filter_by(status='rejected').count(),
            'avg_rating': round(
                db.session.query(func.avg(Review.rating))
                          .filter(Review.status == 'approved').scalar() or 0, 2
            ),
        },
    })


# ── Admin logs ────────────────────────────────────────────────────────────────

@admin_bp.route('/admin/logs', methods=['GET'])
@admin_required
def admin_logs():
    """Return the action log for the current admin (or all admins for superadmin)."""
    admin = Admin.query.get(request.current_user['user_id'])
    return jsonify(admin.get_action_log() if admin else [])


@admin_bp.route('/admin/sessions', methods=['GET'])
@admin_required
def admin_sessions():
    """Return session history for the current admin."""
    admin = Admin.query.get(request.current_user['user_id'])
    return jsonify(admin.get_session_history() if admin else [])


# ── Pending submissions management ───────────────────────────────────────────

@admin_bp.route('/admin/pending', methods=['GET'])
@admin_required
def pending_submissions():
    """Return all pending places, hotels, and restaurants in one call."""
    return jsonify({
        'places':      [p.to_dict() for p in Place.query.filter_by(status='pending').all()],
        'hotels':      [h.to_dict() for h in Hotel.query.filter_by(status='pending').all()],
        'restaurants': [r.to_dict() for r in Restaurant.query.filter_by(status='pending').all()],
        'reviews':     [r.to_dict() for r in Review.query.filter_by(status='pending').all()],
    })


# ── User management (admin view) ──────────────────────────────────────────────

def _enrich_user(user):
    """
    Build the full user detail dict for the admin panel.
    Includes every Clerk field + activity counts + recent sessions.
    """
    from sqlalchemy import func

    cid = user.clerk_id

    activity = {
        'wishlist_count':  db.session.query(func.count(Wishlist.id))
                             .filter(Wishlist.clerk_id == cid).scalar() or 0,
        'review_count':    db.session.query(func.count(Review.id))
                             .filter(Review.clerk_id == cid).scalar() or 0,
        'booking_count':   0,
        'search_count':    0,
        'itinerary_count': db.session.query(func.count(Itinerary.id))
                             .filter(Itinerary.clerk_id == cid).scalar() or 0,
        'total_sessions':  user.total_logins or 0,
        'place_views':     db.session.query(func.count(PlaceView.id))
                             .filter(PlaceView.clerk_id == cid).scalar() or 0,
    }

    recent_sessions = user.get_session_history()[-5:][::-1]

    return {
        **user.to_dict(),
        'activity':        activity,
        'recent_sessions': recent_sessions,
    }

@admin_bp.route('/admin/users', methods=['GET'])
@admin_required
def list_users():
    """
    Full user list for admin panel.
    Every user synced from Clerk — with login/logout times, activity counts,
    and recent session history.
    """
    page      = request.args.get('page', 1, type=int)
    limit     = request.args.get('limit', 20, type=int)
    search    = request.args.get('search', '').strip()
    is_active = request.args.get('is_active')

    q = User.query
    if search:
        q = q.filter(User.name.ilike(f'%{search}%') | User.email.ilike(f'%{search}%'))
    if is_active is not None:
        q = q.filter(User.is_active == (is_active.lower() == 'true'))

    total = q.count()
    users = q.order_by(User.created_at.desc())\
              .offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        'users':  [_enrich_user(u) for u in users],
        'total':  total,
        'page':   page,
        'limit':  limit,
        'pages':  (total + limit - 1) // limit,
    })


@admin_bp.route('/admin/users/<clerk_id>', methods=['GET'])
@admin_required
def get_user_detail(clerk_id):
    """
    Full profile of a single user for admin panel.
    Includes: Clerk data, login/logout history, all activity counts,
    recent wishlists, reviews, bookings, searches.
    """
    user = User.query.filter_by(clerk_id=clerk_id).first_or_404()

    # Full session history from JSON column
    sessions = user.get_session_history()[::-1][:20]

    # Recent activity details
    recent_reviews    = Review.query.filter_by(clerk_id=clerk_id)\
                               .order_by(Review.created_at.desc()).limit(5).all()
    recent_searches   = []
    recent_wishlists  = Wishlist.query.filter_by(clerk_id=clerk_id)\
                                 .order_by(Wishlist.created_at.desc()).limit(5).all()

    data = _enrich_user(user)
    data['sessions']         = sessions
    data['recent_reviews']   = [r.to_dict() for r in recent_reviews]
    data['recent_bookings']  = []
    data['recent_searches']  = []
    data['recent_wishlists'] = [{'place_name': w.place_name or (w.place.name if w.place else ''),
                                  'added_at': w.created_at.isoformat()} for w in recent_wishlists]
    return jsonify(data)


@admin_bp.route('/admin/users/<clerk_id>/sessions', methods=['GET'])
@admin_required
def user_sessions(clerk_id):
    """Full login/logout session history for a user (from JSON column)."""
    user = User.query.filter_by(clerk_id=clerk_id).first_or_404()
    history = user.get_session_history()[::-1]  # newest first
    return jsonify({'sessions': history, 'total_logins': user.total_logins})


@admin_bp.route('/admin/users/<clerk_id>/deactivate', methods=['POST'])
@admin_required
def deactivate_user(clerk_id):
    """Deactivate a user account."""
    user = User.query.filter_by(clerk_id=clerk_id).first_or_404()
    user.is_active = False
    _log('deactivate_user', 'user', notes=f'Deactivated: {user.email}')
    db.session.commit()
    return jsonify({'success': True, 'message': f'User {user.email} deactivated.'})


@admin_bp.route('/admin/users/<clerk_id>/activate', methods=['POST'])
@admin_required
def activate_user(clerk_id):
    """Reactivate a user account."""
    user = User.query.filter_by(clerk_id=clerk_id).first_or_404()
    user.is_active = True
    _log('activate_user', 'user', notes=f'Activated: {user.email}')
    db.session.commit()
    return jsonify({'success': True, 'message': f'User {user.email} activated.'})


@admin_bp.route('/admin/users/sync-from-clerk', methods=['POST'])
@admin_required
def sync_all_from_clerk():
    """Pull all users from Clerk API and upsert into local DB."""
    if not CLERK_API_KEY:
        return jsonify({'error': 'CLERK_API_KEY not configured'}), 500

    try:
        r = requests.get(
            f"{CLERK_API_URL}?limit=500",
            headers={"Authorization": f"Bearer {CLERK_API_KEY}"}
        )
        if r.status_code != 200:
            return jsonify({'error': 'Clerk API error', 'status': r.status_code}), 502
        clerk_users = r.json()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    synced = 0
    for cu in clerk_users:
        uid = cu.get('id')
        emails = cu.get('email_addresses', [])
        email = emails[0].get('email_address') if emails else None
        if not uid or not email:
            continue
        fname = (cu.get('first_name') or '').strip()
        lname = (cu.get('last_name') or '').strip()
        name = f"{fname} {lname}".strip()
        avatar = cu.get('image_url') or cu.get('profile_image_url') or ''

        user = User.query.filter_by(clerk_id=uid).first()
        if user:
            user.email = email
            user.name = name
            user.avatar_url = avatar
        else:
            user = User(clerk_id=uid, email=email, name=name,
                        avatar_url=avatar, total_logins=0)
            db.session.add(user)
        synced += 1

    db.session.commit()
    _log('sync_clerk_users', notes=f'Synced {synced} users from Clerk')
    return jsonify({'message': f'Synced {synced} users from Clerk', 'total': synced})





@admin_bp.route('/admin/search-history', methods=['GET'])
@admin_required
def admin_search_history():
    """Return all search history entries for admin view."""
    from sqlalchemy import text
    limit  = request.args.get('limit', 100, type=int)
    search = request.args.get('search', '').strip()

    sql = """
        SELECT id, clerk_id, user_name, query, query_type, response_summary, created_at
        FROM search_history
        WHERE (:search = '' OR query LIKE :like OR user_name LIKE :like)
        ORDER BY created_at DESC
        LIMIT :limit
    """
    rows = db.session.execute(text(sql), {
        'search': search, 'like': f'%{search}%', 'limit': limit
    }).fetchall()

    return jsonify([{
        'id':       r[0],
        'clerk_id': r[1],
        'user':     r[2] or 'Anonymous',
        'query':    r[3],
        'type':     r[4],
        'results':  r[5],
        'at':       r[6],
    } for r in rows])
