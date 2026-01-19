#!/usr/bin/env python3
"""
Gmail Setup Test Script for Roamio Wanderly Newsletter

This script tests your Gmail SMTP configuration before using it in production.
Run this after setting up your Gmail App Password in the .env file.

Usage: python test_gmail_setup.py
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gmail_connection():
    """Test Gmail SMTP connection and send a test email"""
    
    # Get configuration from environment
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '587'))
    sender_email = os.getenv('SENDER_EMAIL')
    sender_password = os.getenv('SENDER_PASSWORD')
    
    print("🔧 Gmail SMTP Configuration Test")
    print("=" * 40)
    print(f"SMTP Server: {smtp_server}")
    print(f"SMTP Port: {smtp_port}")
    print(f"Sender Email: {sender_email}")
    print(f"Password: {'*' * len(sender_password) if sender_password else 'NOT SET'}")
    print()
    
    # Validate configuration
    if not sender_email or sender_email == 'your-actual-gmail@gmail.com':
        print("❌ ERROR: Please set your actual Gmail address in SENDER_EMAIL")
        return False
        
    if not sender_password or sender_password == 'your-16-character-app-password':
        print("❌ ERROR: Please set your Gmail App Password in SENDER_PASSWORD")
        return False
    
    # Get test recipient email
    test_email = input("Enter your email address to receive test email: ").strip()
    if not test_email or '@' not in test_email:
        print("❌ ERROR: Invalid email address")
        return False
    
    try:
        print("🔄 Testing SMTP connection...")
        
        # Create test message
        message = MIMEMultipart("alternative")
        message["Subject"] = "🧪 Gmail SMTP Test - Roamio Wanderly"
        message["From"] = f"Roamio Wanderly <{sender_email}>"
        message["To"] = test_email
        
        # Create test content
        text_content = """
        Gmail SMTP Test Successful! ✅
        
        This is a test email from your Roamio Wanderly newsletter system.
        
        If you received this email, your Gmail SMTP configuration is working correctly!
        
        Configuration Details:
        - SMTP Server: smtp.gmail.com
        - Port: 587
        - Authentication: App Password
        
        Your newsletter system is ready to send real emails!
        
        Best regards,
        Roamio Wanderly System
        """
        
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Gmail SMTP Test</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981, #0891b2); padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px;">
                <h1 style="color: white; margin: 0;">🧪 Gmail SMTP Test</h1>
                <p style="color: #e0f2fe; margin: 10px 0 0 0;">Roamio Wanderly Newsletter System</p>
            </div>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <h2 style="color: #059669; margin-top: 0;">✅ Test Successful!</h2>
                <p>If you're reading this email, your Gmail SMTP configuration is working perfectly!</p>
                
                <h3 style="color: #0891b2;">Configuration Details:</h3>
                <ul>
                    <li><strong>SMTP Server:</strong> smtp.gmail.com</li>
                    <li><strong>Port:</strong> 587</li>
                    <li><strong>Authentication:</strong> Gmail App Password</li>
                    <li><strong>Encryption:</strong> STARTTLS</li>
                </ul>
                
                <p style="margin-top: 20px;"><strong>🎉 Your newsletter system is ready to send real emails!</strong></p>
            </div>
            
            <div style="text-align: center; margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                    This is an automated test email from your Roamio Wanderly newsletter system.
                </p>
            </div>
        </body>
        </html>
        """
        
        # Attach content
        text_part = MIMEText(text_content, "plain")
        html_part = MIMEText(html_content, "html")
        message.attach(text_part)
        message.attach(html_part)
        
        # Connect and send
        print("🔄 Connecting to Gmail SMTP server...")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            print("🔄 Starting TLS encryption...")
            server.starttls()
            
            print("🔄 Authenticating with Gmail...")
            server.login(sender_email, sender_password)
            
            print("🔄 Sending test email...")
            server.sendmail(sender_email, test_email, message.as_string())
        
        print()
        print("✅ SUCCESS! Test email sent successfully!")
        print(f"📧 Check your inbox at {test_email}")
        print()
        print("🎉 Your Gmail SMTP configuration is working correctly!")
        print("🚀 Your newsletter system is ready to send real emails!")
        
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ AUTHENTICATION ERROR: {e}")
        print()
        print("💡 Common solutions:")
        print("1. Make sure you're using an App Password, not your regular Gmail password")
        print("2. Verify 2-factor authentication is enabled on your Gmail account")
        print("3. Generate a new App Password from Google Account settings")
        print("4. Check that SENDER_EMAIL matches the Gmail account used for the App Password")
        return False
        
    except smtplib.SMTPException as e:
        print(f"❌ SMTP ERROR: {e}")
        return False
        
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {e}")
        return False

if __name__ == "__main__":
    print("🌄 Roamio Wanderly - Gmail SMTP Setup Test")
    print("=" * 50)
    print()
    
    success = test_gmail_connection()
    
    print()
    if success:
        print("🎯 Next Steps:")
        print("1. Your Gmail SMTP is configured correctly")
        print("2. Newsletter subscriptions will now send real emails")
        print("3. Test the newsletter signup on your website")
        print("4. Monitor the server logs for email sending status")
    else:
        print("🔧 Setup Required:")
        print("1. Follow the Gmail App Password setup instructions")
        print("2. Update your .env file with correct credentials")
        print("3. Run this test script again")
    
    print()
    print("📚 Need help? Check the .env file for detailed setup instructions.")