# app/routes/users.py
from flask import Blueprint, request, jsonify
from ..database import SessionLocal
from .. import crud
import os
from datetime import datetime

# Import email modules with error handling
try:
    import smtplib
    import email.mime.text
    import email.mime.multipart
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    EMAIL_AVAILABLE = True
    print("✅ Email modules loaded successfully. Newsletter emails are enabled.")
except ImportError as e:
    print(f"⚠️ Email modules not available: {e}. Newsletter emails will be disabled.")
    EMAIL_AVAILABLE = False
    # Define dummy classes to prevent errors
    class MIMEText:
        def __init__(self, *args, **kwargs):
            pass
    class MIMEMultipart:
        def __init__(self, *args, **kwargs):
            pass

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
        message = MIMEMultipart("alternative")
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
            <style>
                @media only screen and (max-width: 600px) {{
                    .container {{ width: 100% !important; padding: 10px !important; }}
                    .header {{ padding: 20px !important; }}
                    .content {{ padding: 15px !important; }}
                }}
            </style>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
            <div class="container" style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div class="header" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 30%, #10b981 70%, #059669 100%); padding: 40px 20px; text-align: center; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"mountains\" x=\"0\" y=\"0\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><polygon points=\"10,5 15,15 5,15\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23mountains)\"/></svg>') repeat;"></div>
                    <div style="position: relative; z-index: 1;">
                        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏔️ Welcome to Roamio Wanderly!</h1>
                        <p style="color: #e0f2fe; margin: 15px 0 0 0; font-size: 18px; font-weight: 300;">Your Gateway to Nepal's Hidden Treasures</p>
                        <div style="margin-top: 20px; padding: 10px 20px; background: rgba(255,255,255,0.2); border-radius: 25px; display: inline-block; backdrop-filter: blur(10px);">
                            <span style="color: white; font-size: 14px; font-weight: 500;">✨ Adventure Awaits ✨</span>
                        </div>
                    </div>
                </div>
                
                <!-- Welcome Message -->
                <div class="content" style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #0891b2; margin: 0 0 10px 0; font-size: 24px;">Namaste, Fellow Explorer! 🙏</h2>
                        <p style="color: #64748b; font-size: 16px; margin: 0;">Thank you for joining our community of Nepal adventure enthusiasts!</p>
                    </div>
                    
                    <!-- Features Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
                        <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #bfdbfe;">
                            <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
                            <h4 style="color: #1e40af; margin: 0 0 5px 0; font-size: 14px;">Exclusive Guides</h4>
                            <p style="color: #64748b; font-size: 12px; margin: 0;">Hidden gems & secret spots</p>
                        </div>
                        <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #bbf7d0;">
                            <div style="font-size: 24px; margin-bottom: 8px;">💰</div>
                            <h4 style="color: #166534; margin: 0 0 5px 0; font-size: 14px;">Special Deals</h4>
                            <p style="color: #64748b; font-size: 12px; margin: 0;">Exclusive discounts & offers</p>
                        </div>
                        <div style="background: linear-gradient(135deg, #fefce8, #fef3c7); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #fde68a;">
                            <div style="font-size: 24px; margin-bottom: 8px;">📸</div>
                            <h4 style="color: #92400e; margin: 0 0 5px 0; font-size: 14px;">Photo Stories</h4>
                            <p style="color: #64748b; font-size: 12px; margin: 0;">Breathtaking imagery</p>
                        </div>
                        <div style="background: linear-gradient(135deg, #fdf2f8, #fce7f3); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #f9a8d4;">
                            <div style="font-size: 24px; margin-bottom: 8px;">🎯</div>
                            <h4 style="color: #be185d; margin: 0 0 5px 0; font-size: 14px;">Personal Tips</h4>
                            <p style="color: #64748b; font-size: 12px; margin: 0;">Curated recommendations</p>
                        </div>
                    </div>
                    
                    <!-- Welcome Bonus -->
                    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 25px; border-radius: 15px; margin: 30px 0; text-align: center; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%); animation: pulse 4s ease-in-out infinite;"></div>
                        <div style="position: relative; z-index: 1;">
                            <h3 style="margin: 0 0 10px 0; color: #06b6d4; font-size: 20px;">🎁 Welcome Gift Inside!</h3>
                            <p style="margin: 0 0 15px 0; color: #e2e8f0; font-size: 16px;">Your <strong>"Ultimate Nepal Adventure Guide"</strong> is coming your way!</p>
                            <div style="background: rgba(6,182,212,0.2); padding: 10px 20px; border-radius: 20px; display: inline-block; border: 1px solid rgba(6,182,212,0.3);">
                                <span style="color: #67e8f9; font-size: 14px;">📚 Detailed itineraries • 🏔️ Trekking routes • 🍜 Local cuisine • 💡 Pro tips</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://roamiowanderly.com" style="background: linear-gradient(135deg, #0891b2, #10b981); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(8,145,178,0.3); transition: all 0.3s ease;">
                            🚀 Start Your Nepal Journey
                        </a>
                        <p style="margin: 15px 0 0 0; color: #64748b; font-size: 14px;">Discover 450+ destinations, 500+ hotels, and endless adventures</p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #1e293b; color: white; padding: 30px 20px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #06b6d4; margin: 0 0 15px 0; font-size: 16px;">Follow Our Adventures</h4>
                        <div style="display: inline-flex; gap: 15px;">
                            <a href="#" style="color: #60a5fa; text-decoration: none; padding: 8px 12px; background: rgba(96,165,250,0.1); border-radius: 8px; font-size: 14px;">📘 Facebook</a>
                            <a href="#" style="color: #f472b6; text-decoration: none; padding: 8px 12px; background: rgba(244,114,182,0.1); border-radius: 8px; font-size: 14px;">📷 Instagram</a>
                            <a href="#" style="color: #34d399; text-decoration: none; padding: 8px 12px; background: rgba(52,211,153,0.1); border-radius: 8px; font-size: 14px;">🐦 Twitter</a>
                        </div>
                    </div>
                    
                    <div style="border-top: 1px solid #374151; padding-top: 20px; margin-top: 20px;">
                        <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 13px;">
                            You're receiving this because you subscribed to Roamio Wanderly newsletter.
                        </p>
                        <div style="display: inline-flex; gap: 15px; font-size: 12px;">
                            <a href="mailto:{sender_email}?subject=Unsubscribe%20Request" style="color: #60a5fa; text-decoration: none;">Unsubscribe</a>
                            <span style="color: #6b7280;">•</span>
                            <a href="mailto:{sender_email}?subject=Newsletter%20Support" style="color: #60a5fa; text-decoration: none;">Contact Support</a>
                            <span style="color: #6b7280;">•</span>
                            <a href="https://roamiowanderly.com/privacy" style="color: #60a5fa; text-decoration: none;">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create plain text version
        text_content = f"""
        🏔️ WELCOME TO ROAMIO WANDERLY NEWSLETTER! 🏔️
        
        Namaste, Fellow Explorer! 🙏
        
        Thank you for subscribing to our Nepal adventure newsletter!
        We're thrilled to have you join our community of travel enthusiasts.
        
        ✨ WHAT TO EXPECT ✨
        
        🗺️  EXCLUSIVE GUIDES: Hidden gems and secret spots across Nepal
        💰  SPECIAL DEALS: Exclusive discounts and early access to packages  
        📸  PHOTO STORIES: Breathtaking imagery from our adventures
        🎯  PERSONAL TIPS: Curated recommendations just for you
        
        🎁 WELCOME GIFT 🎁
        
        Your "Ultimate Nepal Adventure Guide" is coming your way!
        This comprehensive guide includes:
        • Detailed itineraries for every type of traveler
        • Hidden trekking routes and local secrets
        • Authentic cuisine recommendations
        • Pro tips from experienced guides
        
        🚀 START YOUR JOURNEY 🚀
        
        Visit us: https://roamiowanderly.com
        Discover 450+ destinations, 500+ hotels, and endless adventures
        
        📱 FOLLOW OUR ADVENTURES 📱
        
        Facebook: [Link]
        Instagram: [Link] 
        Twitter: [Link]
        
        ---
        
        You're receiving this because you subscribed to Roamio Wanderly newsletter.
        
        To unsubscribe: Reply with "UNSUBSCRIBE" in the subject line
        Need help? Email us at {sender_email}
        
        Happy exploring!
        The Roamio Wanderly Team 🌄
        """
        
        # Attach parts
        text_part = MIMEText(text_content, "plain")
        html_part = MIMEText(html_content, "html")
        
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
