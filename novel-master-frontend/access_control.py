# access_control.py
from flask import g, jsonify, request
from functools import wraps
import logging

logger = logging.getLogger(__name__)

# Hierarchy Levels
# Master(4) > Super-Pro(3) > Pro(2) > Basic(1)
ROLE_LEVELS = {'basic': 1, 'pro': 2, 'super-pro': 3, 'master': 4}


def get_user_role():
    """Safely extract role from g.current_user, defaulting to 'basic'."""
    if not g.get('current_user'):
        return 'basic'
    return g.current_user.get('role', 'basic')


def is_role(role_name):
    """Check if current user has exactly the given role."""
    return get_user_role() == role_name


def has_any_role(*roles):
    """Check if current user has any of the specified roles."""
    return get_user_role() in roles


def check_permission(min_role):
    """Decorator to restrict access based on user role hierarchy.

    Usage:
        @token_required
        @check_permission('super-pro')
        def admin_endpoint():
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            # Assumes 'token_required' has already populated g.current_user
            if not g.get('current_user'):
                return jsonify({'message': 'Authentication required'}), 401

            user_role = get_user_role()
            required_level = ROLE_LEVELS.get(min_role, 0)
            user_level = ROLE_LEVELS.get(user_role, 0)

            if user_level < required_level:
                logger.warning(
                    f'Access denied: user {g.current_user.get("user_id")} '
                    f'(role: {user_role}) attempted {request.path} '
                    f'(requires: {min_role})'
                )
                return jsonify({
                    'message': f'Access Denied. Requires {min_role} status.',
                    'required': min_role,
                    'current': user_role
                }), 403
            return f(*args, **kwargs)
        return decorated
    return decorator


def require_permission(min_role):
    """Convenience decorator that chains token_required + check_permission.

    Usage:
        @require_permission('master')
        def admin_endpoint():
            ...
    """
    def decorator(f):
        # Import here to avoid circular dependency with app.py
        from app import token_required
        return token_required(check_permission(min_role)(f))
    return decorator
