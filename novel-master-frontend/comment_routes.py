"""comment_routes.py — Novel Master Post Comments
Handles threaded comments on community posts.
"""
from flask import Blueprint, request, jsonify, g
import sqlite3
import logging

logger = logging.getLogger(__name__)
comment_bp = Blueprint('comments', __name__)

@comment_bp.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    """GET /api/community/posts/:id/comments"""
    db = g.db
    post = db.execute("SELECT 1 FROM community_posts WHERE post_id = ?", (post_id,)).fetchone()
    if not post:
        return jsonify({'message': 'Post not found'}), 404

    comments = db.execute(
        """SELECT c.*, u.username, u.display_name, u.avatar_url
           FROM post_comments c
           JOIN users u ON c.author_id = u.user_id
           WHERE c.post_id = ? AND c.parent_id IS NULL
           ORDER BY c.created_at DESC""",
        (post_id,)
    ).fetchall()

    result = []
    for c in comments:
        # Get replies
        replies = db.execute(
            """SELECT c.*, u.username, u.display_name, u.avatar_url
               FROM post_comments c
               JOIN users u ON c.author_id = u.user_id
               WHERE c.parent_id = ?
               ORDER BY c.created_at""",
            (c['comment_id'],)
        ).fetchall()

        result.append({
            'comment_id': c['comment_id'],
            'author': {
                'user_id': c['author_id'],
                'username': c['username'],
                'display_name': c['display_name'],
                'avatar_url': c['avatar_url']
            },
            'body_text': c['body_text'],
            'like_count': c['like_count'],
            'is_edited': bool(c['is_edited']),
            'created_at': c['created_at'],
            'replies': [dict(r) for r in replies]
        })

    return jsonify({'comments': result, 'count': len(result)})

@comment_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
def create_comment(post_id):
    """POST /api/community/posts/:id/comments"""
    from app import token_required
    @token_required
    def _create():
        data = request.get_json()
        body = data.get('body_text', '').strip()
        if not body:
            return jsonify({'message': 'Comment body required'}), 400

        db = g.db
        post = db.execute("SELECT 1 FROM community_posts WHERE post_id = ?", (post_id,)).fetchone()
        if not post:
            return jsonify({'message': 'Post not found'}), 404

        parent_id = data.get('parent_id')
        if parent_id:
            parent = db.execute(
                "SELECT 1 FROM post_comments WHERE comment_id = ? AND post_id = ?",
                (parent_id, post_id)
            ).fetchone()
            if not parent:
                return jsonify({'message': 'Parent comment not found'}), 404

        cursor = db.execute(
            """INSERT INTO post_comments (post_id, parent_id, author_id, body_text)
               VALUES (?, ?, ?, ?)""",
            (post_id, parent_id, g.current_user['user_id'], body)
        )
        db.execute(
            "UPDATE community_posts SET comment_count = comment_count + 1 WHERE post_id = ?",
            (post_id,)
        )
        db.commit()
        return jsonify({'message': 'Comment created', 'comment_id': cursor.lastrowid}), 201
    return _create()
