# app/routes/users.py
from flask import Blueprint, request, jsonify
from ..database import SessionLocal
from .. import crud
import smtplib
import os
from datetime import datetime

# Import email modules with error handling
try:
    from email.mime.text import MimeText
    from email.mime.multipart import MimeMultipart
    EMAIL_AVAILABLE = True
except ImportError:
    print("⚠️ Email modules not available. Newsletter emails will be disabled.")
    EMAIL_AVAILABLE = False

users_blueprint = Blueprint('users', __name__)

@users_blueprint.route("/", methods=["POST"])
def create_user_route():
    db = SessionLocal()
    data = request.json
    existing = crud.get_user_by_email(db, data['email'])
    if existing:
        db.close()
        return jsonify({"error": "Email already registered"}), 400
    user = crud.create_user(db, data)
    db.close()
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "mobile": user.mobile
    })

@users_blueprint.route("/", methods=["GET"])
def get_users_route():
    db = SessionLocal()
    users = crud.get_users(db)
    db.close()
    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email, "mobile": u.mobile}
        for u in users
    ])

@users_blueprint.route("/subscribe", methods=["POST"])
def subscribe_newsletter():
    """Subscribe to newsletter and send welcome email"""
    try:
        data = request.json
        email = data.get('email')
        preferences = data.get('preferences', 'general')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return jsonify({"error": "Invalid email format"}), 400
        
        db = SessionLocal()
        
        # Subscribe to newsletter
        subscription = crud.subscribe_to_newsletter(db, email, preferences)
        
        # Send welcome email
        welcome_sent = False
        if EMAIL_AVAILABLE:
            welcome_sent = send_welcome_email(email)
        else:
            print("⚠️ Email functionality disabled - email modules not available")
        
        db.close()
        
        if welcome_sent:
            return jsonify({
                "message": "Successfully subscribed! Welcome email sent.",
                "email": email,
                "subscribed_at": subscription.subscribed_at.isoformat() if hasattr(subscription.subscribed_at, 'isoformat') else str(subscription.subscribed_at)
            }), 200
        else:
            return jsonify({
                "message": "Successfully subscribed! (Welcome email failed to send)",
                "email": email,
                "subscribed_at": subscription.subscribed_at.isoformat() if hasattr(subscription.subscribed_at, 'isoformat') else str(subscription.subscribed_at)
            }), 200
            
    except Exception as e:
        return jsonify({"error": f"Subscription failed: {str(e)}"}), 500

@users_blueprint.route("/unsubscribe", methods=["POST"])
def unsubscribe_newsletter():
    """Unsubscribe from newsletter"""
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        db = SessionLocal()
        success = crud.unsubscribe_from_newsletter(db, email)
        db.close()
        
        if success:
            return jsonify({"message": "Successfully unsubscribed"}), 200
        else:
            return jsonify({"error": "Email not found in subscribers"}), 404
            
    except Exception as e:
        return jsonify({"error": f"Unsubscribe failed: {str(e)}"}), 500

def send_welcome_email(email):
    """Send welcome email to new subscriber"""
    if not EMAIL_AVAILABLE:
        print(f"⚠️ Email modules not available. Cannot send email to {email}")
        return False
        
    try:
        # Email configuration - you'll need to set these environment variables
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        sender_email = os.getenv('SENDER_EMAIL', 'your-email@gmail.com')
        sender_password = os.getenv('SENDER_PASSWORD', 'your-app-password')
        
        # Create message
        message = MimeMultipart("alternative")
        message["Subject"] = "Welcome to Roamio Wanderly Newsletter! 🌄"
        message["From"] = f"Roamio Wanderly <{sender_email}>"
        message["To"] = email
        
        # Create HTML content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Roamio Wanderly</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #10b981 100%); padding: 40px 20px; text-align: center; border-radius: 10px; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🌄 Welcome to Roamio Wanderly!</h1>
                <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Your Nepal Adventure Begins Here</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #0891b2; margin-top: 0;">Thank you for subscribing! ✨</h2>
                <p>We're thrilled to have you join our community of adventure seekers and Nepal enthusiasts!</p>
                
                <h3 style="color: #059669; margin-top: 25px;">What to expect:</h3>
                <ul style="padding-left: 20px;">
                    <li><strong>🏔️ Exclusive Travel Tips:</strong> Insider secrets for exploring Nepal's hidden gems</li>
                    <li><strong>🎯 Personalized Recommendations:</strong> Curated destinations based on your interests</li>
                    <li><strong>💰 Special Deals:</strong> Early access to travel packages and discounts</li>
                    <li><strong>📸 Stunning Photography:</strong> Breathtaking images from across Nepal</li>
                    <li><strong>🗺️ Travel Guides:</strong> Detailed guides for trekking, culture, and cuisine</li>
                </ul>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0891b2;">
                    <h4 style="margin-top: 0; color: #0891b2;">🎉 Welcome Bonus!</h4>
                    <p style="margin-bottom: 0;">As a new subscriber, you'll receive our <strong>"Ultimate Nepal Travel Guide"</strong> in your next email - packed with must-visit destinations, local customs, and travel hacks!</p>
                </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://roamiowanderly.com" style="background: linear-gradient(135deg, #0891b2, #10b981); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Explore Nepal Now 🚀</a>
            </div>
            
            <div style="background: #1e293b; color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <p style="margin: 0; font-size: 14px;">Follow us for daily inspiration:</p>
                <div style="margin: 15px 0;">
                    <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">📘 Facebook</a>
                    <a href="#" style="color: #f472b6; text-decoration: none; margin: 0 10px;">📷 Instagram</a>
                    <a href="#" style="color: #34d399; text-decoration: none; margin: 0 10px;">🐦 Twitter</a>
                </div>
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #94a3b8;">
                    You're receiving this because you subscribed to Roamio Wanderly newsletter.<br>
                    <a href="mailto:{sender_email}?subject=Unsubscribe" style="color: #60a5fa;">Unsubscribe</a> | 
                    <a href="mailto:{sender_email}" style="color: #60a5fa;">Contact Us</a>
                </p>
            </div>
        </body>
        </html>
        """
        
        # Create plain text version
        text_content = f"""
        Welcome to Roamio Wanderly Newsletter!
        
        Thank you for subscribing, {email}!
        
        We're excited to have you join our community of Nepal adventure enthusiasts.
        
        What to expect:
        • Exclusive travel tips and insider secrets
        • Personalized destination recommendations  
        • Special deals and early access to packages
        • Stunning photography from across Nepal
        • Detailed travel guides and cultural insights
        
        Welcome Bonus: You'll receive our "Ultimate Nepal Travel Guide" in your next email!
        
        Start exploring: https://roamiowanderly.com
        
        Best regards,
        The Roamio Wanderly Team
        
        ---
        You're receiving this because you subscribed to our newsletter.
        To unsubscribe, reply with "UNSUBSCRIBE" in the subject line.
        """
        
        # Attach parts
        text_part = MimeText(text_content, "plain")
        html_part = MimeText(html_content, "html")
        
        message.attach(text_part)
        message.attach(html_part)
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())
        
        print(f"✅ Welcome email sent successfully to {email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send welcome email to {email}: {str(e)}")
        return False
