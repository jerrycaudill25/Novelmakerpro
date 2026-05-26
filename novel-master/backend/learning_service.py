"""learning_service.py — Novel Master Style Learning
Manages user style preferences and learning from edits.
"""
import json

def get_style_profile(db, user_id, project_id=None, limit=20):
    """Fetch active style preferences for a user.
    If project_id is provided, include project-specific preferences.
    Returns list of dicts.
    """
    if project_id:
        rows = db.execute(
            "SELECT * FROM user_style_preferences "
            "WHERE user_id = ? AND is_active = 1 AND (project_id = ? OR project_id IS NULL) "
            "ORDER BY confidence_score DESC LIMIT ?",
            (user_id, project_id, limit)
        ).fetchall()
    else:
        rows = db.execute(
            "SELECT * FROM user_style_preferences "
            "WHERE user_id = ? AND is_active = 1 "
            "ORDER BY confidence_score DESC LIMIT ?",
            (user_id, limit)
        ).fetchall()
    return [dict(r) for r in rows]

def record_learning(db, user_id, original_ai_text, user_edited_text, project_id=None, context=''):
    """Record a learning event: user corrected AI text.
    Extracts the differing phrase and stores as a style preference.
    Returns the preference_id or None.
    """
    # Simple diff: find the first significant difference
    # In production, use a proper diff library
    original_words = original_ai_text.split()
    edited_words = user_edited_text.split()

    # Find differing substring (naive approach)
    original_pattern = original_ai_text[:100] if len(original_ai_text) > 100 else original_ai_text
    corrected_pattern = user_edited_text[:100] if len(user_edited_text) > 100 else user_edited_text

    # Check if this pattern already exists
    existing = db.execute(
        "SELECT preference_id, confidence_score FROM user_style_preferences "
        "WHERE user_id = ? AND original_pattern = ?",
        (user_id, original_pattern)
    ).fetchone()

    if existing:
        # Boost confidence
        new_conf = min(1.0, existing['confidence_score'] + 0.05)
        db.execute(
            "UPDATE user_style_preferences SET confidence_score = ?, corrected_pattern = ?, updated_at = CURRENT_TIMESTAMP "
            "WHERE preference_id = ?",
            (new_conf, corrected_pattern, existing['preference_id'])
        )
        db.commit()
        return existing['preference_id']
    else:
        cursor = db.execute(
            "INSERT INTO user_style_preferences "
            "(user_id, project_id, original_pattern, corrected_pattern, context, confidence_score) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, project_id, original_pattern, corrected_pattern, context, 0.1)
        )
        db.commit()
        return cursor.lastrowid
