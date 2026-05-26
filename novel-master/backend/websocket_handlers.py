"""websocket_handlers.py — Novel Master WebSocket Handlers
Production-ready with Redis message queue for multi-worker scaling.
Supports real-time collaboration, AI text analysis, and circle chat.
"""
import os
import jwt
import logging
from datetime import datetime, timezone
from flask import request, current_app
from flask_socketio import SocketIO, emit, join_room, leave_room
from ai_engine import analyze_prose

logger = logging.getLogger(__name__)

# ============================================================================
# CRITICAL FIX: Redis message queue for multi-worker broadcast
# ============================================================================
redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

# CRITICAL FIX: Use threading async_mode for gunicorn single-worker
# eventlet requires monkey-patching and is fragile with gunicorn.
# Since SQLite limits us to 1 worker anyway, threading is safer.
async_mode = os.getenv('SOCKETIO_ASYNC_MODE', 'threading')

socketio = SocketIO(
    cors_allowed_origins='*' if os.getenv('FLASK_ENV') != 'production' else os.getenv('ALLOWED_ORIGINS', 'https://yourdomain.com').split(','),
    message_queue=redis_url if os.getenv('FLASK_ENV') == 'production' else None,
    async_mode=async_mode,
    ping_timeout=60,
    ping_interval=25,
    logger=True if os.getenv('FLASK_ENV') != 'production' else False,
    engineio_logger=True if os.getenv('FLASK_ENV') != 'production' else False
)

def init_websockets(app):
    """Initialize SocketIO with Flask app and register all handlers."""
    socketio.init_app(app)

    @socketio.on('connect')
    def handle_connect():
        logger.info(f'Client connected: {request.sid}')
        emit('connected', {'status': 'ok', 'timestamp': datetime.now(timezone.utc).isoformat()})

    @socketio.on('disconnect')
    def handle_disconnect():
        logger.info(f'Client disconnected: {request.sid}')

    # ============================================================================
    # HIGH FIX: Ping/pong keepalive to prevent AWS ALB timeout
    # ============================================================================
    @socketio.on('ping')
    def handle_ping():
        emit('pong', {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'server_time': datetime.now(timezone.utc).timestamp()
        })

    # ============================================================================
    # Project Collaboration Rooms
    # ============================================================================
    @socketio.on('join_project')
    def handle_join_project(data):
        project_id = data.get('project_id')
        if not project_id:
            emit('error', {'message': 'project_id required'})
            return
        room = f'project_{project_id}'
        join_room(room)
        emit('joined', {'room': room, 'project_id': project_id})
        logger.info(f'Client {request.sid} joined room {room}')

    @socketio.on('leave_project')
    def handle_leave_project(data):
        project_id = data.get('project_id')
        if project_id:
            room = f'project_{project_id}'
            leave_room(room)
            emit('left', {'room': room})

    @socketio.on('editor_change')
    def handle_editor_change(data):
        """Broadcast editor changes to all clients in the project room."""
        project_id = data.get('project_id')
        file_id = data.get('file_id')
        content = data.get('content', '')
        cursor_position = data.get('cursor_position', 0)

        if not project_id or not file_id:
            emit('error', {'message': 'project_id and file_id required'})
            return

        room = f'project_{project_id}'
        # Broadcast to all OTHER clients in the room (exclude sender)
        emit('editor_update', {
            'file_id': file_id,
            'content': content,
            'cursor_position': cursor_position,
            'user_id': data.get('user_id'),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }, room=room, skip_sid=request.sid)

        logger.debug(f'Editor change broadcast in room {room}')

    @socketio.on('cursor_move')
    def handle_cursor_move(data):
        """Broadcast cursor position for live cursors."""
        project_id = data.get('project_id')
        file_id = data.get('file_id')
        position = data.get('position', {})
        user_id = data.get('user_id')

        if project_id and file_id:
            room = f'project_{project_id}'
            emit('cursor_update', {
                'file_id': file_id,
                'position': position,
                'user_id': user_id,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }, room=room, skip_sid=request.sid)

    @socketio.on('typing_indicator')
    def handle_typing_indicator(data):
        """Show who's currently typing."""
        project_id = data.get('project_id')
        user_id = data.get('user_id')
        is_typing = data.get('is_typing', False)

        if project_id:
            room = f'project_{project_id}'
            emit('user_typing', {
                'user_id': user_id,
                'is_typing': is_typing,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }, room=room, skip_sid=request.sid)

    # ============================================================================
    # AI Real-Time Text Analysis
    # ============================================================================
    @socketio.on('analyze_text_chunk')
    def handle_text_analysis(data):
        """Analyze text chunk via AI engine in real-time."""
        text_chunk = data.get('text', '')
        project_id = data.get('project_id')
        file_id = data.get('file_id')
        user_id = data.get('user_id')

        if not text_chunk or not project_id or not file_id:
            emit('system_error', {'message': 'text, project_id, and file_id required'})
            return

        room = f'project_{project_id}'

        try:
            analysis_results = analyze_prose(text_chunk)
            emit('ai_feedback', {
                **analysis_results,
                'file_id': file_id,
                'user_id': user_id,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }, room=room, skip_sid=request.sid)
        except Exception as e:
            logger.error(f'Text analysis error: {e}')
            emit('system_error', {'message': 'Analysis failed'}, room=room)

    # ============================================================================
    # CRITICAL FIX: save_and_learn WebSocket handler
    # ============================================================================
    @socketio.on('save_and_learn')
    def handle_save_and_learn(data):
        """Record a learning event from user editing AI-generated text."""
        original_ai_text = data.get('original_ai_text', '')
        user_edited_text = data.get('user_edited_text', '')
        project_id = data.get('project_id')
        user_id = data.get('user_id')

        if not original_ai_text or not user_edited_text:
            emit('system_error', {'message': 'original_ai_text and user_edited_text required'})
            return

        try:
            from learning_service import record_learning
            from app import get_db
            db = get_db()
            pref_id = record_learning(db, user_id, original_ai_text, user_edited_text, project_id)
            emit('learning_feedback', {
                'preference_id': pref_id,
                'message': 'Learning recorded',
                'timestamp': datetime.now(timezone.utc).isoformat()
            })
        except Exception as e:
            logger.error(f'Learning error: {e}')
            emit('system_error', {'message': 'Learning failed'})

    # ============================================================================
    # CRITICAL FIX: get_style_context WebSocket handler
    # ============================================================================
    @socketio.on('get_style_context')
    def handle_get_style_context(data):
        """Return user's style profile for editor context."""
        project_id = data.get('project_id')
        user_id = data.get('user_id')

        try:
            from learning_service import get_style_profile
            from app import get_db
            db = get_db()
            prefs = get_style_profile(db, user_id, project_id, limit=20)
            emit('style_context', {
                'preferences': prefs,
                'count': len(prefs),
                'timestamp': datetime.now(timezone.utc).isoformat()
            })
        except Exception as e:
            logger.error(f'Style context error: {e}')
            emit('system_error', {'message': 'Style context failed'})

    # ============================================================================
    # Circle/Chat Rooms
    # ============================================================================
    @socketio.on('join_circle')
    def handle_join_circle(data):
        circle_id = data.get('circle_id')
        if not circle_id:
            emit('error', {'message': 'circle_id required'})
            return
        room = f'circle_{circle_id}'
        join_room(room)
        emit('joined_circle', {'circle_id': circle_id, 'room': room})

    @socketio.on('circle_message')
    def handle_circle_message(data):
        """Broadcast messages within a writing circle."""
        circle_id = data.get('circle_id')
        message = data.get('message', '')
        user_id = data.get('user_id')

        if not circle_id or not message:
            emit('error', {'message': 'circle_id and message required'})
            return

        room = f'circle_{circle_id}'
        emit('new_message', {
            'circle_id': circle_id,
            'message': message,
            'user_id': user_id,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }, room=room)

    # ============================================================================
    # Legacy: File-specific editing session (backward compatible)
    # ============================================================================
    @socketio.on('join_editing_session')
    def handle_join_editing_session(data):
        """Join a project file editing room (backward compatible)."""
        token = data.get('token')
        if not token:
            emit('system_error', {'message': 'Token required'})
            return

        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload.get('user_id')
            project_id = data.get('project_id')
            file_id = data.get('file_id')

            if project_id and file_id:
                room = f'project_{project_id}_file_{file_id}'
                join_room(room)
                emit('system_status', {
                    'message': 'Connected to Novel Master Engine',
                    'user_id': user_id,
                    'room': room
                })
            else:
                emit('system_error', {'message': 'project_id and file_id required'})
        except jwt.ExpiredSignatureError:
            emit('system_error', {'message': 'Token expired'})
        except jwt.InvalidTokenError:
            emit('system_error', {'message': 'Authentication failed for WebSocket'})
        except Exception as e:
            logger.error(f'WebSocket join error: {e}')
            emit('system_error', {'message': 'Internal server error'})

    @socketio.on('leave_editing_session')
    def handle_leave_editing_session(data):
        """Leave a project file editing room."""
        project_id = data.get('project_id')
        file_id = data.get('file_id')
        if project_id and file_id:
            room = f'project_{project_id}_file_{file_id}'
            leave_room(room)
            emit('system_status', {'message': 'Left editing session'})

    logger.info('WebSocket handlers initialized with Redis message queue + AI analysis')
    return socketio
