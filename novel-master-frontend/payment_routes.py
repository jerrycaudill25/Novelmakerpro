"""payment_routes.py — Novel Master Payments (Stub)
Expand with Stripe/PayPal integration as needed.
"""
from flask import Blueprint, jsonify

payment_bp = Blueprint('payments', __name__)

@payment_bp.route('/status', methods=['GET'])
def payment_status():
    return jsonify({'status': 'payments_not_configured', 'message': 'Payment processing not yet implemented'})
