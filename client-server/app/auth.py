"""
JWT Authentication Module
Provides token generation, validation, and authentication decorators
"""
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

# JWT Configuration
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-super-secret-key-change-this-in-production')
JWT_ALGORITHM = 'HS256'
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)  # Access token expires in 24 hours
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  # Refresh token expires in 30 days

# Token blacklist (in production, use Redis or database)
TOKEN_BLACKLIST = set()


def generate_token(user_id, username, role='user', token_type='access'):
    """
    Generate JWT token
    
    Args:
        user_id: User ID
        username: Username
        role: User role (user, admin)
        token_type: Token type (access, refresh)
    
    Returns:
        JWT token string
    """
    expiration = JWT_ACCESS_TOKEN_EXPIRES if token_type == 'access' else JWT_REFRESH_TOKEN_EXPIRES
    
    payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'type': token_type,
        'exp': datetime.utcnow() + expiration,
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def decode_token(token):
    """
    Decode and validate JWT token
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded payload or None if invalid
    """
    try:
        # Check if token is blacklisted
        if token in TOKEN_BLACKLIST:
            return None
        
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token


def blacklist_token(token):
    """Add token to blacklist (for logout)"""
    TOKEN_BLACKLIST.add(token)


def token_required(f):
    """
    Decorator to protect routes - requires valid JWT token
    Usage: @token_required
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                # Expected format: "Bearer <token>"
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({
                    'error': 'Invalid token format',
                    'message': 'Token format should be: Bearer <token>'
                }), 401
        
        if not token:
            return jsonify({
                'error': 'Authentication required',
                'message': 'No token provided'
            }), 401
        
        # Decode and validate token
        payload = decode_token(token)
        if not payload:
            return jsonify({
                'error': 'Invalid or expired token',
                'message': 'Please login again'
            }), 401
        
        # Add user info to request context
        request.current_user = {
            'user_id': payload['user_id'],
            'username': payload['username'],
            'role': payload['role']
        }
        
        return f(*args, **kwargs)
    
    return decorated


def admin_required(f):
    """
    Decorator to protect admin-only routes
    Usage: @admin_required
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({
                    'error': 'Invalid token format',
                    'message': 'Token format should be: Bearer <token>'
                }), 401
        
        if not token:
            return jsonify({
                'error': 'Authentication required',
                'message': 'No token provided'
            }), 401
        
        # Decode and validate token
        payload = decode_token(token)
        if not payload:
            return jsonify({
                'error': 'Invalid or expired token',
                'message': 'Please login again'
            }), 401
        
        # Check if user is admin
        if payload.get('role') not in ['admin', 'superadmin']:
            return jsonify({
                'error': 'Access denied',
                'message': 'Admin privileges required'
            }), 403
        
        # Add user info to request context
        request.current_user = {
            'user_id': payload['user_id'],
            'username': payload['username'],
            'role': payload['role']
        }
        
        return f(*args, **kwargs)
    
    return decorated


def clerk_user_required(f):
    """
    Decorator to protect routes used by Clerk-authenticated end users.

    Reads the `X-Clerk-User-Id` request header (the pattern used by
    users.py / wishlist.py / search.py) and, on success, populates
    `request.current_user = {'user_id': <clerk_id>, 'role': 'user'}` so that
    route code reading `request.current_user['user_id']` keeps working.
    Optionally captures `X-Clerk-User-Name` as `user_name` when present.

    Usage: @clerk_user_required

    SECURITY: this trusts the unverified `X-Clerk-User-Id` header exactly like
    the rest of the app does today (users.py / wishlist.py / search.py). It is
    NOT worse than the current posture, but it is NOT real server-side Clerk
    token verification. Real Clerk JWT verification is a separate hardening task
    tracked in IMPLEMENTATION_ROADMAP.md and is intentionally out of scope here.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        clerk_id = request.headers.get('X-Clerk-User-Id')

        if not clerk_id:
            return jsonify({
                'error': 'Authentication required',
                'message': 'Missing X-Clerk-User-Id header'
            }), 401

        request.current_user = {
            'user_id': clerk_id,
            'user_name': request.headers.get('X-Clerk-User-Name'),
            'role': 'user',
        }

        return f(*args, **kwargs)

    return decorated


def optional_token(f):
    """
    Decorator for routes that work with or without token
    If token is provided and valid, user info is added to request
    Usage: @optional_token
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                pass
        
        if token:
            payload = decode_token(token)
            if payload:
                request.current_user = {
                    'user_id': payload['user_id'],
                    'username': payload['username'],
                    'role': payload['role']
                }
            else:
                request.current_user = None
        else:
            request.current_user = None
        
        return f(*args, **kwargs)
    
    return decorated


# Password hashing utilities
def hash_password(password):
    """Hash password using werkzeug"""
    return generate_password_hash(password, method='pbkdf2:sha256')


def verify_password(password, hashed_password):
    """Verify password against hash"""
    return check_password_hash(hashed_password, password)
