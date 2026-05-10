"""
Analytics routes — admin-only.
Uses db.session.query() throughout to avoid the SearchLog.query column/accessor conflict.
"""

from flask import Blueprint, request, jsonify, Response
from sqlalchemy import func, desc
from datetime import datetime, timedelta
import json, csv, io

from ..database import db
from ..models import (
    User, SearchLog, RecommendationLog, ItineraryLog,
    Chat, Message,
)
from ..auth import admin_required

analytics_bp = Blueprint("analytics", __name__)

def _iso(dt):
    return dt.isoformat() if dt else None

def _sl():
    """Shorthand: db.session.query(SearchLog)"""
    return db.session.query(SearchLog)


# ── users ─────────────────────────────────────────────────────────────────────

@analytics_bp.route("/analytics/users", methods=["GET"])
@admin_required
def list_users():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    q        = request.args.get("q", "").strip()

    base = db.session.query(User)
    if q:
        like = f"%{q}%"
        base = base.filter(
            (User.name.ilike(like)) | (User.email.ilike(like)) | (User.clerk_id.ilike(like))
        )

    total = base.count()
    users = base.order_by(desc(User.created_at)).offset((page - 1) * per_page).limit(per_page).all()

    rows = []
    for u in users:
        searches = db.session.query(func.count(SearchLog.id)).filter(SearchLog.clerk_id == u.clerk_id).scalar() or 0
        recs     = db.session.query(func.count(RecommendationLog.id)).filter(RecommendationLog.clerk_id == u.clerk_id).scalar() or 0
        itin     = db.session.query(func.count(ItineraryLog.id)).filter(ItineraryLog.clerk_id == u.clerk_id).scalar() or 0
        chats    = db.session.query(func.count(Chat.id)).filter(Chat.user_id == u.clerk_id).scalar() or 0
        d = u.to_dict()
        d["activity"] = {"searches": searches, "recommendations": recs, "itineraries": itin, "chats": chats}
        rows.append(d)

    return jsonify({"users": rows, "total": total, "page": page, "per_page": per_page}), 200


@analytics_bp.route("/analytics/users/<clerk_id>", methods=["GET"])
@admin_required
def user_detail(clerk_id):
    user = db.session.query(User).filter_by(clerk_id=clerk_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    searches = [s.to_dict() for s in
                _sl().filter(SearchLog.clerk_id == clerk_id).order_by(desc(SearchLog.created_at)).limit(50).all()]
    recs     = [r.to_dict() for r in
                db.session.query(RecommendationLog).filter_by(clerk_id=clerk_id).order_by(desc(RecommendationLog.created_at)).limit(20).all()]
    itins    = [i.to_dict() for i in
                db.session.query(ItineraryLog).filter_by(clerk_id=clerk_id).order_by(desc(ItineraryLog.created_at)).limit(20).all()]
    chats_q  = db.session.query(Chat).filter(Chat.user_id == clerk_id).order_by(desc(Chat.created_at)).limit(10).all()
    chats    = [{"id": c.id, "title": c.title, "created_at": _iso(c.created_at),
                 "messages": db.session.query(func.count(Message.id)).filter(Message.chat_id == c.id).scalar() or 0}
                for c in chats_q]

    return jsonify({
        "user": user.to_admin_dict(),
        "searches": searches,
        "recommendations": recs,
        "itineraries": itins,
        "chats": chats,
    }), 200


# ── search analytics ──────────────────────────────────────────────────────────

@analytics_bp.route("/analytics/searches", methods=["GET"])
@admin_required
def search_analytics():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 30, type=int)
    q        = request.args.get("q", "").strip()

    base = _sl()
    if q:
        # Use the column explicitly via SearchLog.query column attribute
        base = base.filter(SearchLog.query.ilike(f"%{q}%"))

    total = base.count()
    logs  = base.order_by(desc(SearchLog.created_at)).offset((page - 1) * per_page).limit(per_page).all()

    # Top queries — use the column attribute directly
    top = (db.session.query(SearchLog.query, func.count(SearchLog.id).label("cnt"))
           .group_by(SearchLog.query).order_by(desc("cnt")).limit(10).all())

    return jsonify({
        "logs": [s.to_dict() for s in logs],
        "total": total, "page": page, "per_page": per_page,
        "top_queries": [{"query": r[0], "count": r[1]} for r in top],
    }), 200


# ── recommendation analytics ──────────────────────────────────────────────────

@analytics_bp.route("/analytics/recommendations", methods=["GET"])
@admin_required
def recommendation_analytics():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 30, type=int)

    base  = db.session.query(RecommendationLog)
    total = base.count()
    logs  = base.order_by(desc(RecommendationLog.created_at)).offset((page - 1) * per_page).limit(per_page).all()

    all_shown = db.session.query(RecommendationLog.places_shown).all()
    place_counts: dict = {}
    for (ps,) in all_shown:
        if ps:
            try:
                for name in json.loads(ps):
                    place_counts[name] = place_counts.get(name, 0) + 1
            except Exception:
                pass
    top_places = sorted(place_counts.items(), key=lambda x: x[1], reverse=True)[:10]

    return jsonify({
        "logs": [r.to_dict() for r in logs],
        "total": total, "page": page, "per_page": per_page,
        "top_places": [{"name": n, "count": c} for n, c in top_places],
    }), 200


# ── chat analytics ────────────────────────────────────────────────────────────

@analytics_bp.route("/analytics/chats", methods=["GET"])
@admin_required
def chat_analytics():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 30, type=int)
    clerk_id = request.args.get("clerk_id", "").strip()

    base = db.session.query(Chat)
    if clerk_id:
        base = base.filter(Chat.user_id == clerk_id)

    total = base.count()
    chats = base.order_by(desc(Chat.created_at)).offset((page - 1) * per_page).limit(per_page).all()

    rows = []
    for c in chats:
        msgs = db.session.query(Message).filter_by(chat_id=c.id).order_by(Message.created_at).all()
        rows.append({
            "id": c.id, "clerk_id": c.user_id, "user_name": None,
            "title": c.title, "message_count": len(msgs),
            "created_at": _iso(c.created_at),
            "messages": [{"sender": m.sender, "content": m.content[:300],
                          "created_at": _iso(m.created_at)} for m in msgs],
        })

    return jsonify({"chats": rows, "total": total, "page": page, "per_page": per_page}), 200


# ── overview ──────────────────────────────────────────────────────────────────

@analytics_bp.route("/analytics/overview", methods=["GET"])
@admin_required
def analytics_overview():
    now   = datetime.utcnow()
    day   = now - timedelta(days=1)
    week  = now - timedelta(days=7)
    month = now - timedelta(days=30)

    total_users    = db.session.query(func.count(User.id)).scalar() or 0
    new_today      = db.session.query(func.count(User.id)).filter(User.created_at >= day).scalar() or 0
    new_this_week  = db.session.query(func.count(User.id)).filter(User.created_at >= week).scalar() or 0
    new_this_month = db.session.query(func.count(User.id)).filter(User.created_at >= month).scalar() or 0

    total_searches = db.session.query(func.count(SearchLog.id)).scalar() or 0
    searches_today = db.session.query(func.count(SearchLog.id)).filter(SearchLog.created_at >= day).scalar() or 0

    total_recs  = db.session.query(func.count(RecommendationLog.id)).scalar() or 0
    total_saved = db.session.query(func.count(SearchLog.id)).scalar() or 0  # reuse search count
    total_chats = db.session.query(func.count(Chat.id)).scalar() or 0
    total_msgs  = db.session.query(func.count(Message.id)).scalar() or 0

    # Import SavedItinerary for saved count
    try:
        from ..models import SavedItinerary
        total_saved_itin = db.session.query(func.count(SavedItinerary.id)).scalar() or 0
    except Exception:
        total_saved_itin = 0

    # Top search queries
    top_queries = (db.session.query(SearchLog.query, func.count(SearchLog.id).label("cnt"))
                   .group_by(SearchLog.query).order_by(desc("cnt")).limit(5).all())

    # 7-day search trend
    trend = []
    for i in range(6, -1, -1):
        d_start = now - timedelta(days=i + 1)
        d_end   = now - timedelta(days=i)
        cnt = db.session.query(func.count(SearchLog.id)).filter(
            SearchLog.created_at >= d_start, SearchLog.created_at < d_end
        ).scalar() or 0
        trend.append({"date": d_end.strftime("%b %d"), "searches": cnt})

    recent_users = db.session.query(User).order_by(desc(User.created_at)).limit(5).all()

    return jsonify({
        "users": {
            "total": total_users, "new_today": new_today,
            "new_this_week": new_this_week, "new_this_month": new_this_month,
        },
        "searches":        {"total": total_searches, "today": searches_today},
        "recommendations": {"total": total_recs},
        "itineraries":     {"total": total_saved_itin},
        "chats":           {"total": total_chats, "messages": total_msgs},
        "top_queries":     [{"query": r[0], "count": r[1]} for r in top_queries],
        "search_trend":    trend,
        "recent_users":    [u.to_dict() for u in recent_users],
    }), 200


# ── CSV export ────────────────────────────────────────────────────────────────

@analytics_bp.route("/analytics/export/<resource>", methods=["GET"])
@admin_required
def export_csv(resource):
    output = io.StringIO()
    writer = csv.writer(output)

    if resource == "users":
        writer.writerow(["id", "clerk_id", "name", "email", "role", "is_active",
                         "total_logins", "last_login", "created_at"])
        for u in db.session.query(User).all():
            writer.writerow([u.id, u.clerk_id, u.name, u.email, u.role, u.is_active,
                              u.total_logins, _iso(u.last_login), _iso(u.created_at)])

    elif resource == "searches":
        writer.writerow(["id", "clerk_id", "user_name", "query", "category",
                         "result_count", "device", "created_at"])
        for s in _sl().all():
            writer.writerow([s.id, s.clerk_id, s.user_name, s.query, s.category,
                              s.result_count, s.device, _iso(s.created_at)])

    elif resource == "recommendations":
        writer.writerow(["id", "clerk_id", "user_name", "trip_type", "travel_month",
                         "travellers", "duration", "places_shown", "created_at"])
        for r in db.session.query(RecommendationLog).all():
            writer.writerow([r.id, r.clerk_id, r.user_name, r.trip_type, r.travel_month,
                              r.travellers, r.duration, r.places_shown, _iso(r.created_at)])

    elif resource == "itineraries":
        from ..models import SavedItinerary
        writer.writerow(["id", "clerk_id", "user_name", "title", "destinations",
                         "duration", "budget_level", "total_cost", "created_at"])
        for i in db.session.query(SavedItinerary).all():
            writer.writerow([i.id, i.clerk_id, i.user_name, i.title, i.destinations,
                              i.duration, i.budget_level, i.total_cost, _iso(i.created_at)])
    else:
        return jsonify({"error": "Unknown resource"}), 400

    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename={resource}.csv"},
    )
