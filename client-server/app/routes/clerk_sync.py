"""
Clerk Webhook + User Sync Routes
- POST /api/clerk/sync      — called from frontend on every sign-in to upsert user
- POST /api/clerk/webhook   — receives user.created / user.updated / user.deleted events
- POST /api/clerk/bulk-sync — admin: fetch all Clerk users and sync to DB
"""

from flask import Blueprint, request, jsonify
import os, json, requests
from datetime import datetime
from ..database import db
from ..models import User

clerk_sync_bp = Blueprint('clerk_sync', __name__)

CLERK_API_KEY = os.environ.get("CLERK_API_KEY", "")
CLERK_WEBHOOK_SECRET = os.environ.get("CLERK_WEBHOOK_SECRET", "")


# ── helpers ───────────────────────────────────────────────────────────────────

def _parse_clerk_user(data: dict) -> dict:
    email_objs = data.get("email_addresses") or []
    primary_id = data.get("primary_email_address_id")
    email = ""
    for e in email_objs:
        if e.get("id") == primary_id:
            email = e.get("email_address", "")
            break
    if not email and email_objs:
        email = email_objs[0].get("email_address", "")

    first = data.get("first_name") or ""
    last  = data.get("last_name")  or ""
    name  = f"{first} {last}".strip() or data.get("username") or email.split("@")[0]
    avatar = data.get("image_url") or data.get("profile_image_url") or ""
    return {"clerk_id": data.get("id", ""), "email": email, "name": name, "avatar_url": avatar}


def _upsert_user(fields: dict) -> User:
    """Insert or update a User row using Flask-SQLAlchemy session."""
    clerk_id = fields["clerk_id"]
    user = User.query.filter_by(clerk_id=clerk_id).first()
    if user:
        user.name       = fields["name"]       or user.name
        user.avatar_url = fields["avatar_url"] or user.avatar_url
        if fields["email"] and fields["email"] != user.email:
            conflict = User.query.filter(User.email == fields["email"],
                                         User.clerk_id != clerk_id).first()
            if not conflict:
                user.email = fields["email"]
        user.updated_at = datetime.utcnow()
    else:
        email = fields["email"]
        if email:
            conflict = User.query.filter_by(email=email).first()
            if conflict:
                conflict.clerk_id   = clerk_id
                conflict.name       = fields["name"]       or conflict.name
                conflict.avatar_url = fields["avatar_url"] or conflict.avatar_url
                conflict.updated_at = datetime.utcnow()
                return conflict
        user = User(clerk_id=clerk_id, email=email or f"{clerk_id}@unknown.clerk",
                    name=fields["name"], avatar_url=fields["avatar_url"])
        db.session.add(user)
    return user


# ── routes ────────────────────────────────────────────────────────────────────

@clerk_sync_bp.route("/clerk/sync", methods=["POST"])
def sync_user():
    """Called from frontend after every Clerk sign-in."""
    data = request.get_json(silent=True) or {}
    clerk_id = data.get("clerk_id", "").strip()
    if not clerk_id:
        return jsonify({"error": "clerk_id required"}), 400

    try:
        fields = {
            "clerk_id":   clerk_id,
            "email":      data.get("email", ""),
            "name":       data.get("name", ""),
            "avatar_url": data.get("avatar_url", ""),
        }
        user = _upsert_user(fields)
        ip = request.headers.get("X-Forwarded-For", request.remote_addr)
        ua = request.headers.get("User-Agent", "")
        user.record_login(ip=ip, ua=ua)
        db.session.commit()
        return jsonify({"ok": True, "user": user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@clerk_sync_bp.route("/clerk/webhook", methods=["POST"])
def clerk_webhook():
    """Clerk webhook — register this URL in Clerk Dashboard → Webhooks."""
    if CLERK_WEBHOOK_SECRET:
        try:
            from svix.webhooks import Webhook
            wh = Webhook(CLERK_WEBHOOK_SECRET)
            headers = {
                "svix-id":        request.headers.get("svix-id", ""),
                "svix-timestamp": request.headers.get("svix-timestamp", ""),
                "svix-signature": request.headers.get("svix-signature", ""),
            }
            payload = wh.verify(request.data, headers)
        except Exception:
            return jsonify({"error": "Invalid signature"}), 400
    else:
        payload = request.get_json(silent=True) or {}

    event_type = payload.get("type", "")
    user_data  = payload.get("data", {})

    try:
        if event_type in ("user.created", "user.updated"):
            fields = _parse_clerk_user(user_data)
            if fields["clerk_id"]:
                _upsert_user(fields)
                db.session.commit()

        elif event_type == "user.deleted":
            clerk_id = user_data.get("id", "")
            if clerk_id:
                user = User.query.filter_by(clerk_id=clerk_id).first()
                if user:
                    user.is_active  = False
                    user.updated_at = datetime.utcnow()
                    db.session.commit()

        return jsonify({"ok": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@clerk_sync_bp.route("/clerk/bulk-sync", methods=["POST"])
def bulk_sync_from_clerk():
    """Admin-triggered: fetch all users from Clerk API and upsert into DB."""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    if not CLERK_API_KEY:
        return jsonify({"error": "CLERK_API_KEY not configured"}), 500

    synced, errors = 0, 0
    offset, limit  = 0, 100

    try:
        while True:
            resp = requests.get(
                "https://api.clerk.dev/v1/users",
                headers={"Authorization": f"Bearer {CLERK_API_KEY}"},
                params={"limit": limit, "offset": offset},
                timeout=15,
            )
            if resp.status_code != 200:
                break
            batch = resp.json()
            if not batch:
                break
            for u in batch:
                try:
                    fields = _parse_clerk_user(u)
                    if fields["clerk_id"]:
                        _upsert_user(fields)
                        synced += 1
                except Exception:
                    errors += 1
            db.session.commit()
            if len(batch) < limit:
                break
            offset += limit

        return jsonify({"ok": True, "synced": synced, "errors": errors}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
