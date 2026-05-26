"""user_routes.py — Novel Master User & Lorebook Routes
Handles characters, world lore, AI settings, and style profiles.
"""
from flask import Blueprint, request, jsonify, g
from functools import wraps
import json
import sqlite3
import logging

logger = logging.getLogger(__name__)
user_bp = Blueprint('user', __name__)

def token_required_user(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        from app import token_required
        return token_required(f)(*args, **kwargs)
    return decorated

# ---------------------------------------------------------------------------
# Lorebook: Characters
# ---------------------------------------------------------------------------
@user_bp.route('/projects/<int:project_id>/characters', methods=['GET'])
def get_characters(project_id):
    """GET /api/user/projects/:id/characters"""
    from app import token_required
    @token_required
    def _get():
        db = g.db
        # Verify project ownership
        project = db.execute(
            "SELECT 1 FROM projects WHERE project_id = ? AND user_id = ?",
            (project_id, g.current_user['user_id'])
        ).fetchone()
        if not project:
            return jsonify({'message': 'Project not found'}), 404

        chars = db.execute(
            "SELECT * FROM characters WHERE project_id = ? ORDER BY created_at",
            (project_id,)
        ).fetchall()
        return jsonify({'characters': [dict(c) for c in chars]})
    return _get()

@user_bp.route('/projects/<int:project_id>/characters', methods=['POST'])
def create_character(project_id):
    """POST /api/user/projects/:id/characters"""
    from app import token_required
    @token_required
    def _create():
        data = request.get_json()
        name = data.get('name', '').strip()
        if not name:
            return jsonify({'message': 'Character name required'}), 400

        db = g.db
        project = db.execute(
            "SELECT 1 FROM projects WHERE project_id = ? AND user_id = ?",
            (project_id, g.current_user['user_id'])
        ).fetchone()
        if not project:
            return jsonify({'message': 'Project not found'}), 404

        cursor = db.execute(
            """INSERT INTO characters 
               (project_id, name, role_type, raw_data, physical_traits, personality_traits, backstory, goals, relationships)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (project_id, name, data.get('role_type', 'supporting'),
             data.get('raw_data', ''), data.get('physical_traits', ''),
             data.get('personality_traits', ''), data.get('backstory', ''),
             data.get('goals', ''), json.dumps(data.get('relationships', [])))
        )
        db.commit()
        return jsonify({'message': 'Character created', 'character_id': cursor.lastrowid}), 201
    return _create()

# ---------------------------------------------------------------------------
# Lorebook: World Lore
# ---------------------------------------------------------------------------
@user_bp.route('/projects/<int:project_id>/lore', methods=['GET'])
def get_lore(project_id):
    """GET /api/user/projects/:id/lore"""
    from app import token_required
    @token_required
    def _get():
        db = g.db
        project = db.execute(
            "SELECT 1 FROM projects WHERE project_id = ? AND user_id = ?",
            (project_id, g.current_user['user_id'])
        ).fetchone()
        if not project:
            return jsonify({'message': 'Project not found'}), 404

        lore = db.execute(
            "SELECT * FROM world_lore WHERE project_id = ? ORDER BY importance DESC, created_at",
            (project_id,)
        ).fetchall()
        return jsonify({'lore': [dict(l) for l in lore]})
    return _get()

@user_bp.route('/projects/<int:project_id>/lore', methods=['POST'])
def create_lore(project_id):
    """POST /api/user/projects/:id/lore"""
    from app import token_required
    @token_required
    def _create():
        data = request.get_json()
        title = data.get('title', '').strip()
        category = data.get('category', 'history')
        if not title:
            return jsonify({'message': 'Lore title required'}), 400
        if category not in ['magic_system', 'geography', 'history', 'culture', 'technology', 'rules', 'timeline']:
            return jsonify({'message': 'Invalid category'}), 400

        db = g.db
        project = db.execute(
            "SELECT 1 FROM projects WHERE project_id = ? AND user_id = ?",
            (project_id, g.current_user['user_id'])
        ).fetchone()
        if not project:
            return jsonify({'message': 'Project not found'}), 404

        cursor = db.execute(
            """INSERT INTO world_lore 
               (project_id, category, title, content, importance)
               VALUES (?, ?, ?, ?, ?)""",
            (project_id, category, title, data.get('content', ''), data.get('importance', 1))
        )
        db.commit()
        return jsonify({'message': 'Lore entry created', 'lore_id': cursor.lastrowid}), 201
    return _create()

# ---------------------------------------------------------------------------
# AI Settings
# ---------------------------------------------------------------------------
@user_bp.route('/me/ai-settings', methods=['GET'])
def get_ai_settings():
    """GET /api/user/me/ai-settings"""
    from app import token_required
    @token_required
    def _get():
        db = g.db
        settings = db.execute(
            "SELECT * FROM ai_settings WHERE user_id = ?",
            (g.current_user['user_id'],)
        ).fetchone()
        if not settings:
            return jsonify({'message': 'Settings not found'}), 404

        overrides = []
        if settings['banned_word_overrides']:
            try:
                overrides = json.loads(settings['banned_word_overrides'])
            except:
                pass

        return jsonify({
            'learning_enabled': bool(settings['learning_enabled']),
            'banned_word_overrides': overrides,
            'prose_style_profile': settings['prose_style_profile'],
            'updated_at': settings['updated_at']
        })
    return _get()

@user_bp.route('/me/ai-settings', methods=['PUT'])
def update_ai_settings():
    """PUT /api/user/me/ai-settings"""
    from app import token_required
    @token_required
    def _update():
        data = request.get_json()
        db = g.db

        updates = []
        params = []
        if 'learning_enabled' in data:
            updates.append('learning_enabled = ?')
            params.append(1 if data['learning_enabled'] else 0)
        if 'banned_word_overrides' in data:
            updates.append('banned_word_overrides = ?')
            params.append(json.dumps(data['banned_word_overrides']))
        if 'prose_style_profile' in data:
            updates.append('prose_style_profile = ?')
            params.append(data['prose_style_profile'])

        if not updates:
            return jsonify({'message': 'No fields to update'}), 400

        updates.append('updated_at = CURRENT_TIMESTAMP')
        params.append(g.current_user['user_id'])

        db.execute(
            f"UPDATE ai_settings SET {', '.join(updates)} WHERE user_id = ?",
            params
        )
        db.commit()
        return jsonify({'message': 'AI settings updated'})
    return _update()

@user_bp.route('/me/ai-settings/learning', methods=['POST'])
def post_learning():
    """POST /api/user/me/ai-settings/learning — Trigger a learning event"""
    from app import token_required
    @token_required
    def _post():
        data = request.get_json()
        original = data.get('original_ai_text', '')
        edited = data.get('user_edited_text', '')
        project_id = data.get('project_id')

        if not original or not edited:
            return jsonify({'message': 'Both original_ai_text and user_edited_text required'}), 400

        from learning_service import record_learning
        pref_id = record_learning(g.db, g.current_user['user_id'], original, edited, project_id)
        return jsonify({'message': 'Learning recorded', 'preference_id': pref_id})
    return _post()

# ---------------------------------------------------------------------------
# Style Profile
# ---------------------------------------------------------------------------
@user_bp.route('/me/style-profile', methods=['GET'])
def get_style_profile():
    """GET /api/user/me/style-profile"""
    from app import token_required
    @token_required
    def _get():
        from learning_service import get_style_profile
        prefs = get_style_profile(g.db, g.current_user['user_id'], limit=50)
        return jsonify({
            'user_id': g.current_user['user_id'],
            'preferences_count': len(prefs),
            'preferences': prefs
        })
    return _get()
