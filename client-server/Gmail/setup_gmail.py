#!/usr/bin/env python3
"""
Quick Gmail Setup Script for Roamio Wanderly Newsletter

This script helps you configure Gmail SMTP settings interactively.
"""

import os
import re

def setup_gmail_config():
    """Interactive Gmail configuration setup"""
    
    print("🌄 Roamio Wanderly - Gmail SMTP Setup")
    print("=" * 50)
    print()
    print("This script will help you configure Gmail for sending newsletter emails.")
    print()
    
    # Get Gmail address
    while True:
        gmail_address = input("Enter your Gmail address: ").strip()
        if re.match(r'^[a-zA-Z0-9._%+-]+@gmail\.com$', gmail_address):
            break
        print("❌ Please enter a valid Gmail address (e.g., yourname@gmail.com)")
    
    print()
    print("📋 NEXT STEPS:")
    print("1. Enable 2-Factor Authentication on your Gmail account")
    print("2. Go to: https://myaccount.google.com/security")
    print("3. Click '2-Step Verification' and set it up")
    print("4. Then click 'App passwords'")
    print("5. Select 'Mail' and 'Other (custom name)'")
    print("6. Enter 'Roamio Wanderly' as the app name")
    print("7. Copy the 16-character password Google generates")
    print()
    
    # Get App Password
    while True:
        app_password = input("Enter your 16-character Gmail App Password: ").strip()
        # Remove spaces and validate format
        app_password = app_password.replace(' ', '')
        if len(app_password) == 16 and app_password.isalnum():
            # Format with spaces for readability
            formatted_password = ' '.join([app_password[i:i+4] for i in range(0, 16, 4)])
            break
        print("❌ App Password should be 16 characters (letters and numbers only)")
        print("   Example format: abcd efgh ijkl mnop")
    
    # Read current .env file
    env_path = '.env'
    env_content = ""
    
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            env_content = f.read()
    
    # Update email configuration
    lines = env_content.split('\n')
    updated_lines = []
    email_section_found = False
    
    for line in lines:
        if line.startswith('SENDER_EMAIL='):
            updated_lines.append(f'SENDER_EMAIL={gmail_address}')
            email_section_found = True
        elif line.startswith('SENDER_PASSWORD='):
            updated_lines.append(f'SENDER_PASSWORD={formatted_password}')
        else:
            updated_lines.append(line)
    
    # If email section not found, add it
    if not email_section_found:
        updated_lines.extend([
            '',
            '# Email Configuration for Newsletter',
            'SMTP_SERVER=smtp.gmail.com',
            'SMTP_PORT=587',
            f'SENDER_EMAIL={gmail_address}',
            f'SENDER_PASSWORD={formatted_password}'
        ])
    
    # Write updated .env file
    with open(env_path, 'w') as f:
        f.write('\n'.join(updated_lines))
    
    print()
    print("✅ Configuration saved to .env file!")
    print()
    print("🧪 TESTING YOUR SETUP:")
    print("Run this command to test your Gmail configuration:")
    print("   python test_gmail_setup.py")
    print()
    print("🚀 RESTART YOUR SERVER:")
    print("After testing, restart your server:")
    print("   python -m app.app")
    print()
    print("🎉 Your newsletter will now send real Gmail emails!")

if __name__ == "__main__":
    try:
        setup_gmail_config()
    except KeyboardInterrupt:
        print("\n\n❌ Setup cancelled.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nPlease check your inputs and try again.")