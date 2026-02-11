from flask import Blueprint, request, jsonify
from ..email_service import send_contact_form_email
import os

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['POST'])
def submit_contact_form():
    """Handle contact form submissions and send email"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Extract form data
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone', 'Not provided')
        subject = data.get('subject')
        travel_type = data.get('travelType', 'Not specified')
        budget = data.get('budget', 'Not specified')
        message = data.get('message')
        
        # Send email to wanderlyroamio@gmail.com
        success = send_contact_form_email(
            name=name,
            email=email,
            phone=phone,
            subject=subject,
            travel_type=travel_type,
            budget=budget,
            message=message
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Your message has been sent successfully! We will get back to you within 24 hours.'
            }), 200
        else:
            return jsonify({
                'error': 'Failed to send email. Please try again or contact us directly.'
            }), 500
            
    except Exception as e:
        print(f"Error in contact form submission: {str(e)}")
        return jsonify({
            'error': 'An error occurred while processing your request. Please try again.'
        }), 500
