"""
Email Service for sending various types of emails
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_contact_form_email(name, email, phone, subject, travel_type, budget, message):
    """
    Send contact form submission to wanderlyroamio@gmail.com
    
    Args:
        name: Sender's name
        email: Sender's email
        phone: Sender's phone number
        subject: Email subject
        travel_type: Type of travel inquiry
        budget: Budget range
        message: Message content
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Email configuration
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        sender_email = os.getenv('SENDER_EMAIL', 'wanderlyroamio@gmail.com')
        sender_password = os.getenv('SENDER_PASSWORD', '')
        
        # Recipient email (where contact form submissions go)
        recipient_email = 'wanderlyroamio@gmail.com'
        
        if not sender_password:
            print("⚠️ SENDER_PASSWORD not configured in .env file")
            return False
        
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Contact Form: {subject}"
        msg["From"] = f"Roamio Wanderly Contact Form <{sender_email}>"
        msg["To"] = recipient_email
        msg["Reply-To"] = email
        
        # Create HTML email body
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                        📧 New Contact Form Submission
                    </h1>
                    <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 14px;">
                        From Roamio Wanderly Website
                    </p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <!-- Contact Information -->
                    <div style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                        <h2 style="color: #0f766e; margin: 0 0 15px 0; font-size: 18px;">
                            👤 Contact Information
                        </h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 120px;">Name:</td>
                                <td style="padding: 8px 0; color: #111827;">{name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                                <td style="padding: 8px 0;">
                                    <a href="mailto:{email}" style="color: #0891b2; text-decoration: none;">{email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phone:</td>
                                <td style="padding: 8px 0; color: #111827;">{phone}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Travel Details -->
                    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">
                            ✈️ Travel Details
                        </h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 120px;">Subject:</td>
                                <td style="padding: 8px 0; color: #111827; font-weight: 600;">{subject}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Travel Type:</td>
                                <td style="padding: 8px 0; color: #111827;">{travel_type}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Budget:</td>
                                <td style="padding: 8px 0; color: #111827;">{budget}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Message -->
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                        <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">
                            💬 Message
                        </h2>
                        <p style="color: #111827; line-height: 1.6; margin: 0; white-space: pre-wrap;">{message}</p>
                    </div>
                    
                    <!-- Action Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="mailto:{email}?subject=Re: {subject}" 
                           style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            📧 Reply to {name}
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                        This email was sent from the Roamio Wanderly contact form
                    </p>
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                        Roamio Wanderly • Chaksibari Marg, Thamel-26 • Kathmandu, Nepal
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create plain text version
        text_content = f"""
        NEW CONTACT FORM SUBMISSION
        ===========================
        
        CONTACT INFORMATION:
        Name: {name}
        Email: {email}
        Phone: {phone}
        
        TRAVEL DETAILS:
        Subject: {subject}
        Travel Type: {travel_type}
        Budget: {budget}
        
        MESSAGE:
        {message}
        
        ---
        Reply to: {email}
        """
        
        # Attach both versions
        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        
        print(f"✅ Contact form email sent successfully from {name} ({email})")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send contact form email: {str(e)}")
        return False
