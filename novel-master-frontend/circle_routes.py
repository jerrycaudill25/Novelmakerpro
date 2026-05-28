"""circle_routes.py — Novel Master Writing Circles (Stub)
Expand with full circle management as needed.
"""
from flask import Blueprint, jsonify

circle_bp = Blueprint('circles', __name__)

@circle_bp.route('/list', methods=['GET'])
def list_circles():
    return jsonify({'circles': [], 'message': 'Writing circles not yet implemented'})
