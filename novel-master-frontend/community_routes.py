"""community_routes.py — Novel Master Community Feed & Posts
Handles public feed, post creation, and reactions.
"""
from flask import Blueprint, request, jsonify, g
from functools import wraps
import sqlite3
import logging

logger = logging.getLogger(__name__)
community_bp = Blueprint('community', __name__)

def token_required_community(f):
    """Lightweight token check for community routes."""
    @wraps(f)
    def decorated(*args, **kwargs):
        from app import token_required
        return token_required(f)(*args, **kwargs)
    return decorated

@community_bp.route('/feed', methods=['GET'])
def get_feed():
    """GET /api/community/feed?limit=20&offset=0"""
    limit = min(int(request.args.get('limit', 20)), 100)
    offset = int(request.args.get('offset', 0))
    db = g.db

    posts = db.execute(
        """SELECT p.*, u.username, u.display_name, u.avatar_url 
           FROM community_posts p
           JOIN users u ON p.author_id = u.user_id
           WHERE p.visibility = 'public' AND p.is_moderated = 0
           ORDER BY p.created_at DESC
           LIMIT ? OFFSET ?""",
        (limit, offset)
    ).fetchall()

    result = []
    for p in posts:
        # Check if current user liked this (if authenticated)
        user_liked = False
        if g.get('current_user'):
            liked = db.execute(
                "SELECT 1 FROM post_reactions WHERE post_id = ? AND user_id = ?",
                (p['post_id'], g.current_user['user_id'])
            ).fetchone()
            user_liked = bool(liked)

        result.append({
            'post_id': p['post_id'],
            'author': {
                'user_id': p['author_id'],
                'username': p['username'],
                'display_name': p['display_name'],
                'avatar_url': p['avatar_url']
            },
            'title': p['title'],
            'body_text': p['body_text'],
            'excerpt_text': p['excerpt_text'],
            'post_type': p['post_type'],
            'like_count': p['like_count'],
            'comment_count': p['comment_count'],
            'share_count': p['share_count'],
            'view_count': p['view_count'],
            'ai_audit_score': p['ai_audit_score'],
            'ai_badge_type': p['ai_badge_type'],
            'visibility': p['visibility'],
            'is_pinned': bool(p['is_pinned']),
            'created_at': p['created_at'],
            'updated_at': p['updated_at'],
            'user_liked': user_liked
        })

    total = db.execute(
        "SELECT COUNT(*) FROM community_posts WHERE visibility = 'public' AND is_moderated = 0"
    ).fetchone()[0]

    return jsonify({'posts': result, 'total': total, 'limit': limit, 'offset': offset})

@community_bp.route('/posts', methods=['POST'])
def create_post():
    """POST /api/community/posts"""
    # Allow anonymous? No, require auth
    from app import token_required
    @token_required
    def _create():
        data = request.get_json()
        title = data.get('title', '').strip()
        body = data.get('body_text', '').strip()
        post_type = data.get('post_type', 'discussion')
        visibility = data.get('visibility', 'public')

        if not title or len(title) > 300:
            return jsonify({'message': 'Title required, max 300 chars'}), 400
        if not body:
            return jsonify({'message': 'Body text required'}), 400

        db = g.db
        excerpt = body[:500] + '...' if len(body) > 500 else body

        cursor = db.execute(
            """INSERT INTO community_posts 
               (author_id, post_type, title, body_text, excerpt_text, visibility)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (g.current_user['user_id'], post_type, title, body, excerpt, visibility)
        )
        db.commit()
        return jsonify({'message': 'Post created', 'post_id': cursor.lastrowid}), 201
    return _create()

@community_bp.route('/posts/<int:post_id>/react', methods=['POST'])
def react_to_post(post_id):
    """POST /api/community/posts/:id/react"""
    from app import token_required
    @token_required
    def _react():
        data = request.get_json()
        reaction_type = data.get('reaction_type', 'like')
        db = g.db

        # Check if post exists
        post = db.execute("SELECT 1 FROM community_posts WHERE post_id = ?", (post_id,)).fetchone()
        if not post:
            return jsonify({'message': 'Post not found'}), 404

        try:
            db.execute(
                "INSERT INTO post_reactions (post_id, user_id, reaction_type) VALUES (?, ?, ?)",
                (post_id, g.current_user['user_id'], reaction_type)
            )
            db.execute(
                "UPDATE community_posts SET like_count = like_count + 1 WHERE post_id = ?",
                (post_id,)
            )
            db.commit()
            return jsonify({'message': 'Reaction added'}), 201
        except sqlite3.IntegrityError:
            # Already reacted, remove it (toggle)
            db.execute(
                "DELETE FROM post_reactions WHERE post_id = ? AND user_id = ?",
                (post_id, g.current_user['user_id'])
            )
            db.execute(
                "UPDATE community_posts SET like_count = MAX(0, like_count - 1) WHERE post_id = ?",
                (post_id,)
            )
            db.commit()
            return jsonify({'message': 'Reaction removed'})
    return _react()

@community_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """GET /api/community/posts/:id"""
    db = g.db
    p = db.execute(
        """SELECT p.*, u.username, u.display_name, u.avatar_url 
           FROM community_posts p
           JOIN users u ON p.author_id = u.user_id
           WHERE p.post_id = ? AND p.is_moderated = 0""",
        (post_id,)
    ).fetchone()

    if not p:
        return jsonify({'message': 'Post not found'}), 404

    # Increment view count
    db.execute("UPDATE community_posts SET view_count = view_count + 1 WHERE post_id = ?", (post_id,))
    db.commit()

    return jsonify({
        'post_id': p['post_id'],
        'author': {
            'user_id': p['author_id'],
            'username': p['username'],
            'display_name': p['display_name'],
            'avatar_url': p['avatar_url']
        },
        'title': p['title'],
        'body_text': p['body_text'],
        'excerpt_text': p['excerpt_text'],
        'post_type': p['post_type'],
        'like_count': p['like_count'],
        'comment_count': p['comment_count'],
        'share_count': p['share_count'],
        'view_count': p['view_count'],
        'ai_audit_score': p['ai_audit_score'],
        'ai_badge_type': p['ai_badge_type'],
        'visibility': p['visibility'],
        'created_at': p['created_at'],
        'updated_at': p['updated_at']
    })
