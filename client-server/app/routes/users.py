"""Users routes — sync from Clerk, login/logout tracking, newsletter."""

import os, smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Blueprint, request, jsonify
from ..database import db
from ..models import User, Newsletter

users_bp = Blueprint('users', __name__)


@users_bp.route('/users/sync', methods=['POST'])
def sync_user():
    """
    Called by frontend on every Clerk login.
    Creates or updates the User row, records login in session_history.
    Returns: { user, message }
    """
    data     = request.get_json() or {}
    clerk_id = data.get('clerk_id')
    email    = data.get('email')
    if not clerk_id or not email:
        return jsonify({'error': 'clerk_id and email required'}), 400

    ip = request.remote_addr
    ua = request.headers.get('User-Agent', '')

    user = User.query.filter_by(clerk_id=clerk_id).first()
    if user:
        user.email      = email
        user.name       = data.get('name', user.name)
        user.avatar_url = data.get('avatar_url', user.avatar_url)
    else:
        user = User(clerk_id=clerk_id, email=email,
                    name=data.get('name'), avatar_url=data.get('avatar_url'),
                    total_logins=0)
        db.session.add(user)

    user.record_login(ip=ip, ua=ua)
    db.session.commit()
    return jsonify({'user': user.to_dict(), 'message': 'Login recorded'})


@users_bp.route('/users/logout', methods=['POST'])
def logout_user():
    """
    Called by frontend on Clerk sign-out.
    Closes the last open session and calculates duration.
    Body: { clerk_id }
    """
    data     = request.get_json() or {}
    clerk_id = data.get('clerk_id') or request.headers.get('X-Clerk-User-Id')
    if not clerk_id:
        return jsonify({'error': 'clerk_id required'}), 400

    user = User.query.filter_by(clerk_id=clerk_id).first()
    if user:
        user.record_logout()
        db.session.commit()
    return jsonify({'message': 'Logout recorded'})


@users_bp.route('/users/me', methods=['GET'])
def get_me():
    clerk_id = request.headers.get('X-Clerk-User-Id')
    if not clerk_id:
        return jsonify({'error': 'Not authenticated'}), 401
    user = User.query.filter_by(clerk_id=clerk_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())


@users_bp.route('/users/subscribe', methods=['POST'])
def subscribe():
    data  = request.get_json() or {}
    email = data.get('email')
    if not email or '@' not in email:
        return jsonify({'error': 'Valid email required'}), 400

    clerk_id = request.headers.get('X-Clerk-User-Id')
    sub = Newsletter.query.filter_by(email=email).first()
    if sub:
        sub.is_active = True
        sub.clerk_id  = clerk_id or sub.clerk_id
    else:
        sub = Newsletter(email=email, clerk_id=clerk_id,
                         preferences=data.get('preferences', 'general'))
        db.session.add(sub)

    db.session.commit()
    _send_welcome_email(email)
    return jsonify({'message': 'Subscribed', 'email': email,
                    'subscribed_at': sub.created_at.isoformat()})


@users_bp.route('/users/unsubscribe', methods=['POST'])
def unsubscribe():
    data  = request.get_json() or {}
    email = data.get('email')
    sub   = Newsletter.query.filter_by(email=email).first()
    if not sub:
        return jsonify({'error': 'Email not found'}), 404
    sub.is_active = False
    db.session.commit()
    return jsonify({'message': 'Unsubscribed'})


def _send_welcome_email(to_email):
    sender   = os.getenv('EMAIL_USER')
    password = os.getenv('EMAIL_PASSWORD')
    if not sender or not password:
        return
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Welcome to Roamio Wanderly!'
        msg['From']    = f'Roamio Wanderly <{sender}>'
        msg['To']      = to_email
        msg.attach(MIMEText('Thank you for subscribing to Roamio Wanderly!', 'plain'))
        with smtplib.SMTP(os.getenv('SMTP_SERVER', 'smtp.gmail.com'),
                          int(os.getenv('SMTP_PORT', '587'))) as s:
            s.starttls()
            s.login(sender, password)
            s.sendmail(sender, to_email, msg.as_string())
    except Exception as e:
        print(f'⚠️ Welcome email failed: {e}')
