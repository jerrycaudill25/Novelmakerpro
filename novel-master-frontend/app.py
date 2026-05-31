import os
import re
import uuid
import hashlib
import sqlite3
import logging
import shutil
import signal
import sys
from datetime import datetime, timezone, timedelta
from functools import wraps

from flask import Flask, request, jsonify, send_file, g, make_response, redirect
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt

# Phase 2+ imports
from ai_engine import analyze_prose, analyze_with_style_profile
from websocket_handlers import init_websockets, socketio
from export_service import compile_project_export
from access_control import check_permission
import storage_service

app = Flask(__name__)

# ============================================================================
# CRITICAL FIX: SECRET_KEY validation — fail hard in production
# ============================================================================
if os.getenv('FLASK_ENV') == 'production':
    secret_key = os.environ.get('SECRET_KEY')
    if not secret_key or len(secret_key) < 32:
        raise RuntimeError(
            'FATAL: SECRET_KEY must be set to 32+ random chars in production.\n'
            'Generate: openssl rand -hex 32'
        )
    app.config['SECRET_KEY'] = secret_key
    # Restrict CORS in production
    allowed_origins = os.getenv('ALLOWED_ORIGINS', 'https://yourdomain.com').split(',')
    CORS(app, origins=allowed_origins, supports_credentials=True)
else:
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-change-in-production')
    CORS(app)  # Dev mode: allow all

app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
app.config['JWT_EXPIRY_DAYS'] = int(os.getenv('JWT_EXPIRY_DAYS', '7'))

# Configuration
DB_PATH = os.getenv('DB_PATH', 'continuity/novel_master.db')
STORAGE_ROOT = os.getenv('STORAGE_ROOT', 'storage')
FREE_STORAGE_MB = 100
PRO_STORAGE_MB = 10 * 1024
ALLOWED_EXTENSIONS = {'txt', 'md', 'docx', 'pdf', 'epub', 'fdx', 'fountain', 'jpg', 'jpeg', 'png', 'gif', 'webp'}
FREE_FILE_TYPES = {'txt', 'md'}
PRO_FILE_TYPES = {'txt', 'md', 'docx', 'pdf', 'epub', 'fdx', 'fountain'}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================
# CRITICAL FIX: SQLite WAL mode for production concurrency
# ============================================================================

def get_db():
    if 'db' not in g:
        os.makedirs(os.path.dirname(DB_PATH) if os.path.dirname(DB_PATH) else '.', exist_ok=True)
        # INCREASE TIMEOUT for concurrent writes
        g.db = sqlite3.connect(DB_PATH, timeout=30.0, check_same_thread=False)
        g.db.row_factory = sqlite3.Row
        # PRODUCTION CRITICAL: Enable WAL mode for concurrent access
        g.db.execute('PRAGMA journal_mode=WAL')
        g.db.execute('PRAGMA synchronous=NORMAL')  # Balance safety/speed
        g.db.execute('PRAGMA busy_timeout=30000')  # 30 second wait
        g.db.execute('PRAGMA cache_size=-64000')  # 64MB cache
        g.db.execute('PRAGMA foreign_keys=ON')
        g.db.execute('PRAGMA temp_store=memory')
    return g.db

@app.teardown_appcontext
def close_db(exception):
    # HIGH FIX: Proper DB teardown with WAL checkpoint
    db = g.pop('db', None)
    if db is not None:
        try:
            # Checkpoint WAL before closing to prevent file growth
            db.execute('PRAGMA wal_checkpoint(TRUNCATE)')
            db.close()
        except Exception as e:
            logger.warning(f'DB cleanup warning: {e}')

@app.before_request
def load_db():
    g.db = get_db()

def init_db():
    db = get_db()
    # Ensure WAL mode is set even on first init
    db.execute('PRAGMA journal_mode=WAL')
    db.execute('PRAGMA synchronous=NORMAL')

    db.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_url TEXT DEFAULT NULL,
        bio TEXT DEFAULT '',
        tier TEXT DEFAULT 'free' CHECK(tier IN ('free', 'pro', 'enterprise')),
        role TEXT DEFAULT 'basic' CHECK(role IN ('basic', 'pro', 'super-pro', 'master')),
        storage_used_mb REAL DEFAULT 0.0,
        storage_limit_mb REAL DEFAULT 100.0,
        is_verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS user_follows (
        follower_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        following_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (follower_id, following_id)
    );
    CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INTEGER PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
        default_visibility TEXT DEFAULT 'private',
        allow_comments INTEGER DEFAULT 1,
        allow_downloads INTEGER DEFAULT 0,
        email_notifications INTEGER DEFAULT 1,
        ai_assist_level TEXT DEFAULT 'standard'
    );
    CREATE TABLE IF NOT EXISTS projects (
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        format_type TEXT NOT NULL CHECK(format_type IN ('novel', 'short_story', 'screenplay', 'poem', 'series', 'commercial', 'song', 'custom')),
        genre_tags TEXT DEFAULT '',
        word_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'editing', 'reviewing', 'published', 'archived')),
        visibility TEXT DEFAULT 'private' CHECK(visibility IN ('private', 'followers', 'public', 'unlisted')),
        cover_image_url TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ai_audit_score REAL DEFAULT NULL,
        is_deleted INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS manuscript_files (
        file_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        filename TEXT NOT NULL,
        display_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size_bytes INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        checksum_sha256 TEXT NOT NULL,
        word_count INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        is_ai_processed INTEGER DEFAULT 0,
        ai_audit_log TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        version_number INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS file_versions (
        version_id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL REFERENCES manuscript_files(file_id) ON DELETE CASCADE,
        version_number INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        checksum_sha256 TEXT NOT NULL,
        word_count INTEGER,
        change_summary TEXT DEFAULT '',
        created_by INTEGER NOT NULL REFERENCES users(user_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS storage_audit_log (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(user_id),
        action TEXT NOT NULL,
        file_id INTEGER REFERENCES manuscript_files(file_id),
        bytes_changed INTEGER NOT NULL,
        new_total_mb REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS community_posts (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        post_type TEXT NOT NULL,
        title TEXT NOT NULL,
        body_text TEXT DEFAULT '',
        excerpt_text TEXT DEFAULT '',
        project_id INTEGER REFERENCES projects(project_id),
        file_id INTEGER REFERENCES manuscript_files(file_id),
        like_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        share_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        ai_audit_score REAL DEFAULT NULL,
        ai_badge_type TEXT DEFAULT NULL,
        visibility TEXT DEFAULT 'public',
        is_pinned INTEGER DEFAULT 0,
        is_moderated INTEGER DEFAULT 0,
        moderation_note TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS post_reactions (
        reaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        reaction_type TEXT DEFAULT 'like',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS post_comments (
        comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
        parent_id INTEGER DEFAULT NULL REFERENCES post_comments(comment_id) ON DELETE CASCADE,
        author_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        body_text TEXT NOT NULL,
        file_id INTEGER DEFAULT NULL REFERENCES manuscript_files(file_id),
        line_number INTEGER DEFAULT NULL,
        selected_text TEXT DEFAULT NULL,
        is_ai_generated INTEGER DEFAULT 0,
        ai_confidence REAL DEFAULT NULL,
        like_count INTEGER DEFAULT 0,
        is_edited INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS post_shares (
        share_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
        sharer_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        add_commentary TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, sharer_id)
    );
    CREATE TABLE IF NOT EXISTS user_feed_cache (
        cache_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        post_id INTEGER NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
        feed_source TEXT NOT NULL,
        relevance_score REAL DEFAULT 0.0,
        is_seen INTEGER DEFAULT 0,
        is_engaged INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, post_id)
    );
    CREATE TABLE IF NOT EXISTS writing_circles (
        circle_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        owner_id INTEGER NOT NULL REFERENCES users(user_id),
        visibility TEXT DEFAULT 'private',
        max_members INTEGER DEFAULT 20,
        requires_approval INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS circle_memberships (
        circle_id INTEGER NOT NULL REFERENCES writing_circles(circle_id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        role TEXT DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (circle_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS circle_posts (
        circle_post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        circle_id INTEGER NOT NULL REFERENCES writing_circles(circle_id) ON DELETE CASCADE,
        post_id INTEGER NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
        shared_by INTEGER NOT NULL REFERENCES users(user_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS access_audit_log (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(user_id),
        resource_type TEXT NOT NULL,
        resource_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        ip_address TEXT DEFAULT NULL,
        user_agent TEXT DEFAULT NULL,
        success INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS content_reports (
        report_id INTEGER PRIMARY KEY AUTOINCREMENT,
        reporter_id INTEGER NOT NULL REFERENCES users(user_id),
        resource_type TEXT NOT NULL,
        resource_id INTEGER NOT NULL,
        reason TEXT NOT NULL,
        details TEXT DEFAULT '',
        status TEXT DEFAULT 'open',
        moderator_id INTEGER DEFAULT NULL REFERENCES users(user_id),
        resolution_note TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP DEFAULT NULL
    );
    CREATE TABLE IF NOT EXISTS characters (
        character_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        role_type TEXT DEFAULT 'supporting' CHECK(role_type IN ('protagonist', 'antagonist', 'supporting', 'minor')),
        raw_data TEXT DEFAULT '',
        extracted_facts TEXT DEFAULT '',
        physical_traits TEXT DEFAULT '',
        personality_traits TEXT DEFAULT '',
        backstory TEXT DEFAULT '',
        goals TEXT DEFAULT '',
        relationships TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS world_lore (
        lore_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
        category TEXT NOT NULL CHECK(category IN ('magic_system', 'geography', 'history', 'culture', 'technology', 'rules', 'timeline')),
        title TEXT NOT NULL,
        content TEXT DEFAULT '',
        importance INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS user_style_preferences (
        preference_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
        original_pattern TEXT NOT NULL,
        corrected_pattern TEXT NOT NULL,
        context TEXT DEFAULT '',
        confidence_score REAL DEFAULT 0.0,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS ai_settings (
        user_id INTEGER PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
        learning_enabled INTEGER DEFAULT 1,
        banned_word_overrides TEXT DEFAULT '[]',
        prose_style_profile TEXT DEFAULT '',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
        subscription_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        provider TEXT NOT NULL,
        provider_subscription_id TEXT NOT NULL,
        tier TEXT NOT NULL CHECK(tier IN ('pro', 'enterprise')),
        billing_cycle TEXT NOT NULL CHECK(billing_cycle IN ('monthly', 'yearly')),
        status TEXT NOT NULL CHECK(status IN ('active', 'cancelled', 'past_due', 'unpaid', 'trialing')),
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        cancel_at_period_end INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, provider, provider_subscription_id)
    );
    CREATE TABLE IF NOT EXISTS payments (
        payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        provider TEXT NOT NULL,
        provider_payment_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('subscription', 'purchase', 'refund')),
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT NOT NULL CHECK(status IN ('pending', 'succeeded', 'failed', 'refunded')),
        description TEXT,
        subscription_id INTEGER REFERENCES subscriptions(subscription_id),
        item_key TEXT,
        receipt_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS user_credits (
        credit_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        credit_type TEXT NOT NULL,
        amount INTEGER NOT NULL DEFAULT 0,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, credit_type)
    );
    -- MEDIUM FIX: Performance indexes for frequently queried columns
    CREATE INDEX IF NOT EXISTS idx_posts_author ON community_posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_posts_visibility ON community_posts(visibility);
    CREATE INDEX IF NOT EXISTS idx_files_project ON manuscript_files(project_id);
    CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id);
    CREATE INDEX IF NOT EXISTS idx_feed_cache_user ON user_feed_cache(user_id);
    CREATE INDEX IF NOT EXISTS idx_circles_owner ON writing_circles(owner_id);
    """)
    db.commit()
    logger.info('Database initialized with 17 tables + performance indexes')

# ============================================================================
# CRITICAL FIX: Security headers on all responses
# ============================================================================
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

# ---------------------------------------------------------------------------
# Auth Decorators
# ---------------------------------------------------------------------------

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                parts = request.headers['Authorization'].split()
                if len(parts) == 2 and parts[0].lower() == 'bearer':
                    token = parts[1]
                else:
                    return jsonify({'message': 'Invalid Authorization header format'}), 401
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
        if not token:
            return jsonify({'message': 'Authentication token required'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            user = get_db().execute('SELECT * FROM users WHERE user_id = ?', (data['user_id'],)).fetchone()
            if not user:
                return jsonify({'message': 'User not found'}), 401
            g.current_user = dict(user)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated

def require_tier(min_tier):
    levels = {'free': 0, 'pro': 1, 'enterprise': 2}
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not g.get('current_user'):
                return jsonify({'message': 'Authentication required'}), 401
            if levels.get(g.current_user.get('tier', 'free'), 0) < levels[min_tier]:
                return jsonify({'message': f'Requires {min_tier} tier', 'upgrade': True}), 402
            return f(*args, **kwargs)
        return decorated
    return decorator

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_user_storage_path(user_id):
    return storage_service.get_user_storage_path(user_id, app.config['SECRET_KEY'])

def allowed_file(filename, tier='free'):
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False
    if tier == 'free' and ext not in FREE_FILE_TYPES:
        return False
    return True

def compute_checksum(filepath):
    return storage_service.compute_checksum(filepath)

def count_words(text):
    return len(text.split())

def _make_token(user_id, username, tier, role):
    exp = datetime.now(timezone.utc) + timedelta(days=app.config['JWT_EXPIRY_DAYS'])
    return jwt.encode({
        'user_id': user_id, 'username': username, 'tier': tier, 'role': role, 'exp': exp
    }, app.config['SECRET_KEY'], algorithm='HS256')

# ============================================================================
# HIGH FIX: Database backup function
# ============================================================================
def backup_database():
    """Create online backup without locking the database."""
    backup_dir = os.path.join(STORAGE_ROOT, 'backups')
    os.makedirs(backup_dir, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = os.path.join(backup_dir, f'novel_master_{timestamp}.db')

    try:
        source = sqlite3.connect(DB_PATH, timeout=30.0)
        dest = sqlite3.connect(backup_path)
        with dest:
            source.backup(dest)
        dest.close()
        source.close()

        # Keep only last 7 backups
        backups = sorted([f for f in os.listdir(backup_dir) if f.startswith('novel_master_')])
        for old in backups[:-7]:
            os.remove(os.path.join(backup_dir, old))

        logger.info(f'Database backed up to {backup_path}')
        return backup_path
    except Exception as e:
        logger.error(f'Backup failed: {e}')
        return None

# ---------------------------------------------------------------------------
# Auth Routes
# ---------------------------------------------------------------------------

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['username', 'email', 'password', 'display_name']
    for field in required:
        if not data.get(field):
            return jsonify({'message': f'{field} required'}), 400
    username = data['username'].strip().lower()
    email = data['email'].strip().lower()
    password = data['password'].strip()
    display_name = data['display_name'].strip()

    if not re.match(r'^[a-z0-9_]{3,30}$', username):
        return jsonify({'message': 'Username: 3-30 chars, alphanumeric + underscores only'}), 400
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return jsonify({'message': 'Invalid email format'}), 400
    if len(password) < 8:
        return jsonify({'message': 'Password must be at least 8 characters'}), 400

    db = get_db()
    if db.execute('SELECT 1 FROM users WHERE username = ?', (username,)).fetchone():
        return jsonify({'message': 'Username already taken'}), 409
    if db.execute('SELECT 1 FROM users WHERE email = ?', (email,)).fetchone():
        return jsonify({'message': 'Email already registered'}), 409

    password_hash = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
    try:
        cursor = db.execute(
            'INSERT INTO users (username, display_name, email, password_hash, storage_limit_mb, role) VALUES (?, ?, ?, ?, ?, ?)',
            (username, display_name, email, password_hash, FREE_STORAGE_MB, 'basic')
        )
        user_id = cursor.lastrowid
        db.execute('INSERT INTO user_preferences (user_id) VALUES (?)', (user_id,))
        db.execute('INSERT INTO ai_settings (user_id) VALUES (?)', (user_id,))

        user_path = get_user_storage_path(user_id)
        os.makedirs(os.path.join(user_path, 'projects'), exist_ok=True)
        os.makedirs(os.path.join(user_path, 'profile'), exist_ok=True)
        db.commit()
    except sqlite3.Error as e:
        logger.error(f'Registration DB error: {e}')
        return jsonify({'message': 'Database error during registration'}), 500

    token = _make_token(user_id, username, 'free', 'basic')
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': {'user_id': user_id, 'username': username, 'display_name': display_name, 'tier': 'free', 'role': 'basic'}
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('username', '').strip().lower()
    password = data.get('password', '').strip()
    if not identifier or not password:
        return jsonify({'message': 'Username/email and password required'}), 400

    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username = ? OR email = ?', (identifier, identifier)).fetchone()
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    db.execute('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE user_id = ?', (user['user_id'],))
    db.commit()

    token = _make_token(user['user_id'], user['username'], user['tier'], user['role'])
    return jsonify({
        'token': token,
        'user': {
            'user_id': user['user_id'], 'username': user['username'],
            'display_name': user['display_name'], 'tier': user['tier'], 'role': user['role'],
            'storage_used_mb': round(user['storage_used_mb'], 2),
            'storage_limit_mb': user['storage_limit_mb']
        }
    })

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_me():
    u = g.current_user
    return jsonify({
        'user_id': u['user_id'], 'username': u['username'], 'display_name': u['display_name'],
        'email': u['email'], 'tier': u['tier'], 'role': u['role'], 'bio': u['bio'],
        'storage_used_mb': round(u['storage_used_mb'], 2),
        'storage_limit_mb': u['storage_limit_mb'],
        'is_verified': bool(u['is_verified'])
    })

# ---------------------------------------------------------------------------
# Project Routes
# ---------------------------------------------------------------------------

@app.route('/api/projects', methods=['GET'])
@token_required
def list_projects():
    db = get_db()
    projects = db.execute(
        'SELECT * FROM projects WHERE user_id = ? AND is_deleted = 0 ORDER BY updated_at DESC',
        (g.current_user['user_id'],)
    ).fetchall()
    result = []
    for p in projects:
        file_count = db.execute('SELECT COUNT(*) FROM manuscript_files WHERE project_id = ?', (p['project_id'],)).fetchone()[0]
        result.append({
            'project_id': p['project_id'], 'title': p['title'], 'description': p['description'],
            'format_type': p['format_type'], 'genre_tags': p['genre_tags'], 'word_count': p['word_count'],
            'status': p['status'], 'visibility': p['visibility'], 'file_count': file_count,
            'ai_audit_score': p['ai_audit_score'], 'created_at': p['created_at'], 'updated_at': p['updated_at']
        })
    return jsonify({'projects': result, 'count': len(result)})

@app.route('/api/projects', methods=['POST'])
@token_required
def create_project():
    data = request.get_json()
    title = data.get('title', '').strip()
    if not title or len(title) > 200:
        return jsonify({'message': 'Title required, max 200 chars'}), 400
    format_type = data.get('format_type', 'novel')
    if format_type not in ['novel', 'short_story', 'screenplay', 'poem', 'series', 'commercial', 'song', 'custom']:
        return jsonify({'message': 'Invalid format type'}), 400

    db = get_db()
    cursor = db.execute(
        'INSERT INTO projects (user_id, title, description, format_type, genre_tags, visibility) VALUES (?, ?, ?, ?, ?, ?)',
        (g.current_user['user_id'], title, data.get('description', '')[:1000], format_type,
         data.get('genre_tags', ''), data.get('visibility', 'private'))
    )
    project_id = cursor.lastrowid
    db.commit()

    user_path = get_user_storage_path(g.current_user['user_id'])
    os.makedirs(os.path.join(user_path, 'projects', str(project_id), 'files'), exist_ok=True)
    os.makedirs(os.path.join(user_path, 'projects', str(project_id), 'exports'), exist_ok=True)
    os.makedirs(os.path.join(user_path, 'projects', str(project_id), 'assets'), exist_ok=True)
    return jsonify({'message': 'Project created', 'project_id': project_id}), 201

@app.route('/api/projects/<int:project_id>', methods=['GET'])
@token_required
def get_project(project_id):
    db = get_db()
    project = db.execute(
        'SELECT * FROM projects WHERE project_id = ? AND user_id = ? AND is_deleted = 0',
        (project_id, g.current_user['user_id'])
    ).fetchone()
    if not project:
        return jsonify({'message': 'Project not found'}), 404
    files = db.execute(
        'SELECT * FROM manuscript_files WHERE project_id = ? ORDER BY sort_order, created_at',
        (project_id,)
    ).fetchall()
    return jsonify({
        'project': {
            'project_id': project['project_id'], 'title': project['title'],
            'description': project['description'], 'format_type': project['format_type'],
            'genre_tags': project['genre_tags'], 'word_count': project['word_count'],
            'status': project['status'], 'visibility': project['visibility'],
            'ai_audit_score': project['ai_audit_score']
        },
        'files': [dict(f) for f in files]
    })

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
@token_required
def update_project(project_id):
    data = request.get_json()
    db = get_db()
    project = db.execute(
        'SELECT * FROM projects WHERE project_id = ? AND user_id = ? AND is_deleted = 0',
        (project_id, g.current_user['user_id'])
    ).fetchone()
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    allowed_updates = ['title', 'description', 'status', 'visibility', 'genre_tags', 'cover_image_url']
    updates = []
    params = []
    for field in allowed_updates:
        if field in data:
            updates.append(f'{field} = ?')
            params.append(data[field])
    if not updates:
        return jsonify({'message': 'No valid fields to update'}), 400

    updates.append('updated_at = CURRENT_TIMESTAMP')
    params.append(project_id)
    set_clause = ', '.join(updates)
    db.execute(f'UPDATE projects SET {set_clause} WHERE project_id = ?', params)
    db.commit()
    return jsonify({'message': 'Project updated'})

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@token_required
def delete_project(project_id):
    db = get_db()
    result = db.execute(
        'UPDATE projects SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE project_id = ? AND user_id = ?',
        (project_id, g.current_user['user_id'])
    )
    db.commit()
    if result.rowcount == 0:
        return jsonify({'message': 'Project not found'}), 404
    return jsonify({'message': 'Project moved to trash'})

@app.route('/api/projects/<int:project_id>/duplicate', methods=['POST'])
@token_required
@require_tier('pro')
def duplicate_project(project_id):
    db = get_db()
    original = db.execute(
        'SELECT * FROM projects WHERE project_id = ? AND user_id = ? AND is_deleted = 0',
        (project_id, g.current_user['user_id'])
    ).fetchone()
    if not original:
        return jsonify({'message': 'Project not found'}), 404

    cursor = db.execute(
        'INSERT INTO projects (user_id, title, description, format_type, genre_tags, visibility, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (g.current_user['user_id'], f"Copy of {original['title']}", original['description'],
         original['format_type'], original['genre_tags'], 'private', 'draft')
    )
    new_id = cursor.lastrowid
    files = db.execute('SELECT * FROM manuscript_files WHERE project_id = ?', (project_id,)).fetchall()
    for f in files:
        db.execute(
            'INSERT INTO manuscript_files (project_id, user_id, filename, display_name, file_path, file_size_bytes, mime_type, checksum_sha256, word_count, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (new_id, g.current_user['user_id'], f['filename'], f['display_name'], f['file_path'],
             f['file_size_bytes'], f['mime_type'], f['checksum_sha256'], f['word_count'], f['sort_order'])
        )
    db.commit()
    return jsonify({'message': 'Project duplicated', 'new_project_id': new_id})

# ---------------------------------------------------------------------------
# File Routes (with storage_service abstraction)
# ---------------------------------------------------------------------------

@app.route('/api/projects/<int:project_id>/files', methods=['POST'])
@token_required
def create_empty_file(project_id):
    """Create an empty chapter/manuscript file from JSON (no multipart upload)."""
    data = request.get_json()
    display_name = data.get('display_name', '').strip()
    if not display_name:
        return jsonify({'message': 'display_name required'}), 400

    db = get_db()
    project = db.execute(
        'SELECT * FROM projects WHERE project_id = ? AND user_id = ? AND is_deleted = 0',
        (project_id, g.current_user['user_id'])
    ).fetchone()
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    content = data.get('content', '')
    word_count = count_words(content)
    ext = 'md'
    filename = f"{secure_filename(display_name)}.{ext}"
    file_uuid = str(uuid.uuid4())
    stored_filename = f'{file_uuid}.{ext}'

    user_path = get_user_storage_path(g.current_user['user_id'])
    file_dir = os.path.join(user_path, 'projects', str(project_id), 'files')
    file_path = os.path.join(file_dir, stored_filename)

    file_size, checksum = storage_service.write_file(file_path, content)

    mime_type = 'text/markdown'
    try:
        cursor = db.execute(
            """INSERT INTO manuscript_files
               (project_id, user_id, filename, display_name, file_path, file_size_bytes, mime_type, checksum_sha256, word_count, sort_order)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (project_id, g.current_user['user_id'], filename, display_name, file_path,
             file_size, mime_type, checksum, word_count, 0)
        )
        file_id = cursor.lastrowid
        db.execute(
            'UPDATE projects SET word_count = word_count + ?, updated_at = CURRENT_TIMESTAMP WHERE project_id = ?',
            (word_count, project_id)
        )
        db.commit()
    except sqlite3.Error as e:
        logger.error(f'Create file DB error: {e}')
        storage_service.delete_file(file_path)
        return jsonify({'message': 'Database error during file creation'}), 500

    return jsonify({
        'message': 'File created', 'file_id': file_id, 'display_name': display_name,
        'word_count': word_count, 'mime_type': mime_type
    }), 201

@app.route('/api/projects/<int:project_id>/files/upload', methods=['POST'])
@token_required
def upload_file(project_id):
    db = get_db()
    project = db.execute(
        'SELECT * FROM projects WHERE project_id = ? AND user_id = ? AND is_deleted = 0',
        (project_id, g.current_user['user_id'])
    ).fetchone()
    if not project:
        return jsonify({'message': 'Project not found'}), 404
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'Empty filename'}), 400
    if not allowed_file(file.filename, g.current_user['tier']):
        allowed = FREE_FILE_TYPES if g.current_user['tier'] == 'free' else PRO_FILE_TYPES
        allowed_list = ', '.join(allowed)
        return jsonify({
            'message': f'File type not allowed. Allowed: {allowed_list}',
            'upgrade_required': g.current_user['tier'] == 'free'
        }), 400

    # ============================================================================
    # HIGH FIX: File upload size limits enforced BEFORE reading
    # ============================================================================
    file.seek(0, 2)  # Seek to end
    file_size = file.tell()
    file.seek(0)  # Reset to beginning

    if file_size > app.config['MAX_CONTENT_LENGTH']:
        return jsonify({
            'message': 'File too large',
            'max_bytes': app.config['MAX_CONTENT_LENGTH'],
            'max_mb': app.config['MAX_CONTENT_LENGTH'] // (1024 * 1024)
        }), 413

    new_usage_mb = g.current_user['storage_used_mb'] + (file_size / (1024 * 1024))
    if new_usage_mb > g.current_user['storage_limit_mb']:
        return jsonify({
            'message': 'Storage quota exceeded',
            'used_mb': round(g.current_user['storage_used_mb'], 2),
            'limit_mb': g.current_user['storage_limit_mb'],
            'upgrade_required': True
        }), 402

    original_filename = secure_filename(file.filename)
    file_uuid = str(uuid.uuid4())
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'txt'
    stored_filename = f'{file_uuid}.{ext}'

    user_path = get_user_storage_path(g.current_user['user_id'])
    file_dir = os.path.join(user_path, 'projects', str(project_id), 'files')
    os.makedirs(file_dir, exist_ok=True)
    file_path = os.path.join(file_dir, stored_filename)

    size, checksum = storage_service.save_file(file, file_path)

    mime_types = {
        'txt': 'text/plain', 'md': 'text/markdown',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'pdf': 'application/pdf', 'epub': 'application/epub+zip',
        'fdx': 'application/xml', 'fountain': 'text/plain',
        'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
        'gif': 'image/gif', 'webp': 'image/webp'
    }
    mime_type = mime_types.get(ext, 'application/octet-stream')

    word_count = 0
    ai_audit_log = None
    is_ai_processed = 0
    ai_score = None

    if ext in ['txt', 'md', 'fountain']:
        try:
            content = storage_service.read_file(file_path)
            word_count = count_words(content)

            if word_count > 0:
                # Get user's banned word overrides
                overrides_row = db.execute(
                    'SELECT banned_word_overrides FROM ai_settings WHERE user_id = ?',
                    (g.current_user['user_id'],)
                ).fetchone()
                overrides = []
                if overrides_row and overrides_row['banned_word_overrides']:
                    import json
                    try:
                        overrides = json.loads(overrides_row['banned_word_overrides'])
                    except Exception:
                        pass

                audit_results = analyze_prose(content, user_overrides=overrides if overrides else None)
                ai_audit_log = str(audit_results)
                is_ai_processed = 1
                ai_score = audit_results.get('score')

                db.execute('UPDATE projects SET ai_audit_score = ? WHERE project_id = ?', (ai_score, project_id))
        except Exception as e:
            logger.warning(f'AI audit failed for upload: {e}')
            ai_audit_log = str({'status': 'error', 'message': str(e)})

    display_name = request.form.get('display_name', original_filename)
    try:
        sort_order = int(request.form.get('sort_order', 0))
    except ValueError:
        sort_order = 0

    try:
        cursor = db.execute(
            """INSERT INTO manuscript_files
               (project_id, user_id, filename, display_name, file_path, file_size_bytes, mime_type, checksum_sha256, word_count, sort_order, is_ai_processed, ai_audit_log)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (project_id, g.current_user['user_id'], original_filename, display_name, file_path,
             size, mime_type, checksum, word_count, sort_order, is_ai_processed, ai_audit_log)
        )
        file_id = cursor.lastrowid

        db.execute('UPDATE projects SET word_count = word_count + ?, updated_at = CURRENT_TIMESTAMP WHERE project_id = ?', (word_count, project_id))
        db.execute('UPDATE users SET storage_used_mb = ? WHERE user_id = ?', (new_usage_mb, g.current_user['user_id']))
        db.execute(
            'INSERT INTO storage_audit_log (user_id, action, file_id, bytes_changed, new_total_mb) VALUES (?, ?, ?, ?, ?)',
            (g.current_user['user_id'], 'upload', file_id, size, round(new_usage_mb, 2))
        )
        db.commit()
    except sqlite3.Error as e:
        logger.error(f'Upload DB error: {e}')
        storage_service.delete_file(file_path)
        return jsonify({'message': 'Database error during upload'}), 500

    return jsonify({
        'message': 'File uploaded and audited', 'file_id': file_id, 'filename': original_filename,
        'display_name': display_name, 'file_size_bytes': size, 'word_count': word_count,
        'mime_type': mime_type, 'checksum': checksum, 'ai_processed': bool(is_ai_processed),
        'ai_audit': ai_audit_log, 'storage_used_mb': round(new_usage_mb, 2)
    }), 201

@app.route('/api/projects/<int:project_id>/files/<int:file_id>', methods=['GET'])
@token_required
def download_file(project_id, file_id):
    db = get_db()
    file_record = db.execute("""
        SELECT f.*, p.visibility, p.user_id as project_owner
        FROM manuscript_files f
        JOIN projects p ON f.project_id = p.project_id
        WHERE f.file_id = ? AND f.project_id = ? AND p.is_deleted = 0
    """, (file_id, project_id)).fetchone()
    if not file_record:
        return jsonify({'message': 'File not found'}), 404

    is_owner = file_record['project_owner'] == g.current_user['user_id']
    is_public = file_record['visibility'] == 'public'
    can_access = is_owner or is_public
    if not can_access:
        return jsonify({'message': 'Access denied'}), 403
    if not storage_service.file_exists(file_record['file_path']):
        return jsonify({'message': 'File missing from storage'}), 500
    if storage_service.compute_checksum(file_record['file_path']) != file_record['checksum_sha256']:
        return jsonify({'message': 'File integrity check failed'}), 500

    db.execute(
        'INSERT INTO access_audit_log (user_id, resource_type, resource_id, action, ip_address) VALUES (?, ?, ?, ?, ?)',
        (g.current_user['user_id'], 'file', file_id, 'download', request.remote_addr)
    )
    db.commit()

    return storage_service.send_file_response(
        file_record['file_path'],
        file_record['mime_type'],
        file_record['filename']
    )

@app.route('/api/projects/<int:project_id>/files/<int:file_id>', methods=['DELETE'])
@token_required
def delete_file(project_id, file_id):
    db = get_db()
    file_record = db.execute(
        'SELECT * FROM manuscript_files WHERE file_id = ? AND project_id = ? AND user_id = ?',
        (file_id, project_id, g.current_user['user_id'])
    ).fetchone()
    if not file_record:
        return jsonify({'message': 'File not found'}), 404

    storage_service.delete_file(file_record['file_path'])

    file_size_mb = file_record['file_size_bytes'] / (1024 * 1024)
    new_usage = max(0.0, g.current_user['storage_used_mb'] - file_size_mb)

    db.execute('UPDATE users SET storage_used_mb = ? WHERE user_id = ?', (new_usage, g.current_user['user_id']))
    db.execute(
        'UPDATE projects SET word_count = MAX(0, word_count - ?), updated_at = CURRENT_TIMESTAMP WHERE project_id = ?',
        (file_record['word_count'], project_id)
    )
    db.execute(
        'INSERT INTO storage_audit_log (user_id, action, file_id, bytes_changed, new_total_mb) VALUES (?, ?, ?, ?, ?)',
        (g.current_user['user_id'], 'delete', file_id, -file_record['file_size_bytes'], round(new_usage, 2))
    )
    db.execute('DELETE FROM manuscript_files WHERE file_id = ?', (file_id,))
    db.commit()
    return jsonify({'message': 'File deleted', 'storage_used_mb': round(new_usage, 2)})

@app.route('/api/projects/<int:project_id>/files/<int:file_id>/content', methods=['GET'])
@token_required
def get_file_content(project_id, file_id):
    db = get_db()
    file_record = db.execute(
        'SELECT * FROM manuscript_files WHERE file_id = ? AND project_id = ? AND user_id = ?',
        (file_id, project_id, g.current_user['user_id'])
    ).fetchone()
    if not file_record:
        return jsonify({'message': 'File not found'}), 404
    if not storage_service.file_exists(file_record['file_path']):
        return jsonify({'message': 'File missing'}), 500
    if file_record['mime_type'] not in ['text/plain', 'text/markdown']:
        return jsonify({'message': 'Only text files editable inline'}), 400
    try:
        content = storage_service.read_file(file_record['file_path'])
    except Exception as e:
        return jsonify({'message': f'Error reading file: {str(e)}'}), 500

    return jsonify({
        'file_id': file_id, 'filename': file_record['filename'],
        'display_name': file_record['display_name'], 'content': content,
        'word_count': file_record['word_count'], 'version_number': file_record['version_number']
    })

@app.route('/api/projects/<int:project_id>/files/<int:file_id>/content', methods=['PUT'])
@token_required
def update_file_content(project_id, file_id):
    data = request.get_json()
    db = get_db()
    file_record = db.execute(
        'SELECT * FROM manuscript_files WHERE file_id = ? AND project_id = ? AND user_id = ?',
        (file_id, project_id, g.current_user['user_id'])
    ).fetchone()
    if not file_record:
        return jsonify({'message': 'File not found'}), 404

    content = data.get('content', '')
    new_word_count = count_words(content)

    # Version history (Pro/Enterprise)
    if g.current_user['tier'] in ['pro', 'enterprise']:
        version_dir = os.path.join(os.path.dirname(file_record['file_path']), '.versions')
        os.makedirs(version_dir, exist_ok=True)
        version_path = os.path.join(version_dir, f"v{file_record['version_number']}_{file_record['filename']}")
        if storage_service.file_exists(file_record['file_path']):
            storage_service.copy_file(file_record['file_path'], version_path)
            try:
                db.execute(
                    """INSERT INTO file_versions (file_id, version_number, file_path, checksum_sha256, word_count, change_summary, created_by)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (file_id, file_record['version_number'], version_path,
                     storage_service.compute_checksum(version_path), file_record['word_count'],
                     data.get('change_summary', ''), g.current_user['user_id'])
                )
            except sqlite3.Error as e:
                logger.error(f'Version history DB error: {e}')

    try:
        new_size, new_checksum = storage_service.write_file(file_record['file_path'], content)
    except Exception as e:
        return jsonify({'message': f'Error writing file: {str(e)}'}), 500

    old_size_mb = file_record['file_size_bytes'] / (1024 * 1024)
    new_size_mb = new_size / (1024 * 1024)
    storage_delta = new_size_mb - old_size_mb
    new_usage = g.current_user['storage_used_mb'] + storage_delta

    try:
        db.execute(
            """UPDATE manuscript_files
               SET word_count = ?, file_size_bytes = ?, checksum_sha256 = ?, version_number = version_number + 1, updated_at = CURRENT_TIMESTAMP
               WHERE file_id = ?""",
            (new_word_count, new_size, new_checksum, file_id)
        )
        db.execute('UPDATE users SET storage_used_mb = ? WHERE user_id = ?', (new_usage, g.current_user['user_id']))
        db.execute(
            'UPDATE projects SET word_count = word_count - ? + ?, updated_at = CURRENT_TIMESTAMP WHERE project_id = ?',
            (file_record['word_count'], new_word_count, project_id)
        )
        db.commit()
    except sqlite3.Error as e:
        logger.error(f'Update file DB error: {e}')
        return jsonify({'message': 'Database error during update'}), 500

    return jsonify({
        'message': 'File updated', 'word_count': new_word_count,
        'version_number': file_record['version_number'] + 1,
        'storage_used_mb': round(new_usage, 2)
    })

# ---------------------------------------------------------------------------
# Storage & Quota
# ---------------------------------------------------------------------------

@app.route('/api/storage/quota', methods=['GET'])
@token_required
def get_storage_quota():
    db = get_db()
    recent = db.execute(
        'SELECT * FROM storage_audit_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
        (g.current_user['user_id'],)
    ).fetchall()
    limit = g.current_user['storage_limit_mb']
    used = g.current_user['storage_used_mb']
    return jsonify({
        'storage_used_mb': round(used, 2),
        'storage_limit_mb': limit,
        'percentage_used': round((used / limit) * 100, 1) if limit > 0 else 0,
        'tier': g.current_user['tier'],
        'recent_activity': [dict(r) for r in recent]
    })

# ---------------------------------------------------------------------------
# Phase 2: AI Audit & Export
# ---------------------------------------------------------------------------

@app.route('/api/projects/<int:project_id>/ai-audit', methods=['POST'])
@token_required
def run_ai_audit(project_id):
    db = get_db()
    project = db.execute(
        'SELECT * FROM projects WHERE project_id = ? AND user_id = ? AND is_deleted = 0',
        (project_id, g.current_user['user_id'])
    ).fetchone()
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    files = db.execute(
        'SELECT file_path, word_count FROM manuscript_files WHERE project_id = ? AND mime_type IN (?, ?)',
        (project_id, 'text/plain', 'text/markdown')
    ).fetchall()

    if not files:
        return jsonify({'message': 'No text files to audit'}), 400

    # Get user's style preferences for enhanced audit
    from learning_service import get_style_profile
    style_prefs = get_style_profile(db, g.current_user['user_id'], project_id, limit=20)

    total_score = 0.0
    audited_count = 0
    all_violations = []

    for f in files:
        if not storage_service.file_exists(f['file_path']) or f['word_count'] == 0:
            continue
        try:
            content = storage_service.read_file(f['file_path'])

            # Get banned word overrides
            overrides_row = db.execute(
                'SELECT banned_word_overrides FROM ai_settings WHERE user_id = ?',
                (g.current_user['user_id'],)
            ).fetchone()
            overrides = []
            if overrides_row and overrides_row['banned_word_overrides']:
                import json
                try:
                    overrides = json.loads(overrides_row['banned_word_overrides'])
                except Exception:
                    pass

            # CRITICAL FIX: Actually use style profile when preferences exist
            if style_prefs:
                result = analyze_with_style_profile(content, style_prefs, user_overrides=overrides if overrides else None)
            else:
                result = analyze_prose(content, user_overrides=overrides if overrides else None)

            total_score += result['score']
            audited_count += 1
            if result['violations'] or result.get('style_violations'):
                all_violations.append({
                    'file': os.path.basename(f['file_path']),
                    'violations': result.get('violations', []),
                    'style_violations': result.get('style_violations', [])
                })
        except Exception as e:
            logger.warning(f"Audit failed for {f['file_path']}: {e}")

    if audited_count == 0:
        return jsonify({'message': 'No auditable content found'}), 400

    avg_score = round(total_score / audited_count, 1)
    badge = None
    if avg_score >= 9.0:
        badge = 'Gold'
    elif avg_score >= 7.5:
        badge = 'Silver'
    elif avg_score >= 6.0:
        badge = 'Bronze'

    db.execute('UPDATE projects SET ai_audit_score = ? WHERE project_id = ?', (avg_score, project_id))
    db.commit()

    return jsonify({
        'project_id': project_id,
        'average_score': avg_score,
        'badge': badge,
        'files_audited': audited_count,
        'violations_summary': all_violations,
        'status': 'complete'
    })

@app.route('/api/projects/<int:project_id>/export', methods=['GET'])
@token_required
def export_project(project_id):
    db = get_db()
    project = db.execute(
        'SELECT * FROM projects WHERE project_id = ? AND user_id = ? AND is_deleted = 0',
        (project_id, g.current_user['user_id'])
    ).fetchone()
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    user_path = get_user_storage_path(g.current_user['user_id'])
    format_type = request.args.get('format', 'txt')

    export_path, error = compile_project_export(db, project_id, project['title'], user_path, format_type)
    if error or not export_path:
        return jsonify({'message': f'Export failed: {error}'}), 500

    filename = os.path.basename(export_path)
    return storage_service.send_file_response(export_path, 'application/octet-stream', filename)

# ---------------------------------------------------------------------------
# Admin / Moderation (Role-based via access_control.py)
# ---------------------------------------------------------------------------

@app.route('/api/admin/users', methods=['GET'])
@token_required
@check_permission('master')
def list_all_users():
    db = get_db()
    users = db.execute(
        'SELECT user_id, username, display_name, email, tier, role, is_verified, created_at FROM users ORDER BY created_at DESC'
    ).fetchall()
    return jsonify({'users': [dict(u) for u in users], 'count': len(users)})

@app.route('/api/admin/users/<int:user_id>/role', methods=['PUT'])
@token_required
@check_permission('master')
def update_user_role(user_id):
    data = request.get_json()
    new_role = data.get('role')
    valid_roles = ['basic', 'pro', 'super-pro', 'master']
    if new_role not in valid_roles:
        roles_list = ', '.join(valid_roles)
        return jsonify({'message': f'Invalid role. Must be one of: {roles_list}'}), 400

    db = get_db()
    user = db.execute('SELECT 1 FROM users WHERE user_id = ?', (user_id,)).fetchone()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    db.execute('UPDATE users SET role = ? WHERE user_id = ?', (new_role, user_id))
    db.commit()
    return jsonify({'message': 'Role updated', 'user_id': user_id, 'new_role': new_role})

@app.route('/api/admin/reports', methods=['GET'])
@token_required
@check_permission('super-pro')
def list_reports():
    status = request.args.get('status', 'open')
    db = get_db()
    reports = db.execute(
        'SELECT * FROM content_reports WHERE status = ? ORDER BY created_at DESC',
        (status,)
    ).fetchall()
    return jsonify({'reports': [dict(r) for r in reports], 'count': len(reports)})

@app.route('/api/admin/reports/<int:report_id>/resolve', methods=['POST'])
@token_required
@check_permission('super-pro')
def resolve_report(report_id):
    data = request.get_json()
    db = get_db()
    report = db.execute('SELECT * FROM content_reports WHERE report_id = ?', (report_id,)).fetchone()
    if not report:
        return jsonify({'message': 'Report not found'}), 404

    db.execute(
        'UPDATE content_reports SET status = ?, moderator_id = ?, resolution_note = ?, resolved_at = CURRENT_TIMESTAMP WHERE report_id = ?',
        (data.get('status', 'resolved'), g.current_user['user_id'], data.get('resolution_note', ''), report_id)
    )
    db.commit()
    return jsonify({'message': 'Report resolved', 'report_id': report_id})

# ============================================================================
# HIGH FIX: Enhanced health check with DB/Redis/storage verification
# ============================================================================
@app.route('/api/health', methods=['GET'])
def health_check():
    status = {
        'status': 'healthy',
        'version': '2.1.0-production',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'features': [
            'auth', 'projects', 'files', 'storage',
            'ai-engine-active', 'websockets-live', 'exports', 'community-feed',
            'role-based-access-control', 'moderation-tools', 's3-storage-ready', 'wal-mode'
        ]
    }

    # Check database
    try:
        db = get_db()
        db.execute('SELECT 1')
        status['database'] = 'connected'
    except Exception as e:
        status['database'] = f'error: {str(e)}'
        status['status'] = 'degraded'

    # Check Redis (if configured)
    try:
        import redis
        r = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))
        r.ping()
        status['redis'] = 'connected'
    except ImportError:
        status['redis'] = 'not-installed'
    except Exception:
        status['redis'] = 'unavailable'

    # Check storage
    try:
        os.makedirs(STORAGE_ROOT, exist_ok=True)
        test_file = os.path.join(STORAGE_ROOT, '.health_check')
        with open(test_file, 'w') as f:
            f.write('ok')
        os.remove(test_file)
        status['storage'] = 'writable'
    except Exception:
        status['storage'] = 'unwritable'
        status['status'] = 'degraded'

    http_status = 200 if status['status'] == 'healthy' else 503
    return jsonify(status), http_status

# ============================================================================
# MEDIUM FIX: Graceful shutdown handling
# ============================================================================
def signal_handler(signum, frame):
    logger.info(f'Received signal {signum}, shutting down gracefully...')
    # Force WAL checkpoint before exit
    try:
        db = sqlite3.connect(DB_PATH, timeout=10.0)
        db.execute('PRAGMA wal_checkpoint(TRUNCATE)')
        db.close()
        logger.info('WAL checkpoint completed before shutdown')
    except Exception as e:
        logger.warning(f'Shutdown checkpoint failed: {e}')
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

# ---------------------------------------------------------------------------
# Register Blueprints (bottom import avoids circular dependencies)
# ---------------------------------------------------------------------------
from community_routes import community_bp
from user_routes import user_bp
from payment_routes import payment_bp
from circle_routes import circle_bp
from comment_routes import comment_bp

app.register_blueprint(community_bp, url_prefix='/api/community')
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(payment_bp, url_prefix='/api/payments')
app.register_blueprint(circle_bp, url_prefix='/api/community')
app.register_blueprint(comment_bp, url_prefix='/api/community')

# ============================================================================
# CRITICAL FIX: Initialize DB and WebSockets at module level for gunicorn
# ============================================================================
with app.app_context():
    init_db()
init_websockets(app)

# ---------------------------------------------------------------------------
# Main Entry (development only — gunicorn ignores this block)
# ---------------------------------------------------------------------------


# ========== PASSWORD RESET ENDPOINTS ==========

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    if not email:
        return jsonify({'message': 'Email required'}), 400
    
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    ''')
    
    cursor.execute('SELECT user_id FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    
    if user:
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=24)
        cursor.execute(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
            (user['user_id'], token, expires_at)
        )
        conn.commit()
        conn.close()
        return jsonify({
            'message': 'If an account exists, a reset link has been generated.',
            'reset_token': token
        }), 200
    
    conn.close()
    return jsonify({'message': 'If an account exists, a reset link has been generated.'}), 200


@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token', '').strip()
    password = data.get('password', '')
    
    if not token or not password:
        return jsonify({'message': 'Token and password required'}), 400
    if len(password) < 8:
        return jsonify({'message': 'Password must be at least 8 characters'}), 400
    
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT pr.*, u.email 
        FROM password_resets pr
        JOIN users u ON pr.user_id = u.user_id
        WHERE pr.token = ? AND pr.used = 0 AND pr.expires_at > ?
    ''', (token, datetime.utcnow()))
    
    reset = cursor.fetchone()
    
    if not reset:
        conn.close()
        return jsonify({'message': 'Invalid or expired token'}), 400
    
    password_hash = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
    cursor.execute('UPDATE users SET password_hash = ? WHERE user_id = ?', (password_hash, reset['user_id']))
    cursor.execute('UPDATE password_resets SET used = 1 WHERE id = ?', (reset['id'],))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Password reset successfully'}), 200




# ========== ADMIN ENDPOINTS ==========

@app.route('/api/admin/users', methods=['GET'])
@jwt_required
def admin_get_users():
    current_user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Check if current user is admin
    cursor.execute('SELECT role FROM users WHERE user_id = ?', (current_user_id,))
    current_user = cursor.fetchone()
    if not current_user or current_user['role'] != 'admin':
        conn.close()
        return jsonify({'message': 'Admin access required'}), 403
    
    cursor.execute('''SELECT user_id, username, display_name, email, role, tier, is_verified, created_at 
                     FROM users ORDER BY created_at DESC''')
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({'users': users}), 200


@app.route('/api/admin/users/<int:user_id>/role', methods=['PUT'])
@jwt_required
def admin_update_role(user_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_role = data.get('role', '').strip().lower()
    
    if new_role not in ['basic', 'moderator', 'admin']:
        return jsonify({'message': 'Invalid role'}), 400
    
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT role FROM users WHERE user_id = ?', (current_user_id,))
    current_user = cursor.fetchone()
    if not current_user or current_user['role'] != 'admin':
        conn.close()
        return jsonify({'message': 'Admin access required'}), 403
    
    cursor.execute('UPDATE users SET role = ? WHERE user_id = ?', (new_role, user_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Role updated successfully'}), 200


@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required
def admin_delete_user(user_id):
    current_user_id = get_jwt_identity()
    
    if current_user_id == user_id:
        return jsonify({'message': 'Cannot delete yourself'}), 400
    
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT role FROM users WHERE user_id = ?', (current_user_id,))
    current_user = cursor.fetchone()
    if not current_user or current_user['role'] != 'admin':
        conn.close()
        return jsonify({'message': 'Admin access required'}), 403
    
    cursor.execute('DELETE FROM users WHERE user_id = ?', (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'User deleted successfully'}), 200



# ========== AI CO-AUTHOR ==========
@app.route('/api/ai/continue', methods=['POST'])
@jwt_required
def ai_continue():
    data = request.get_json()
    context = data.get('context', '')
    style = data.get('style', 'neutral')
    project_id = data.get('project_id')
    if not context: return jsonify({'text': ''}), 200
    
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # Fetch user context
    c.execute('SELECT name, role, backstory FROM characters WHERE user_id = ?', (user_id,))
    characters = c.fetchall()
    c.execute('SELECT title, content FROM lore_entries WHERE user_id = ?', (user_id,))
    lore = c.fetchall()
    c.execute('SELECT title FROM timelines WHERE user_id = ?', (user_id,))
    timelines = c.fetchall()
    conn.close()
    
    # Build context string
    ctx_parts = []
    if characters:
        ctx_parts.append('Characters: ' + '; '.join([f"{ch['name']} ({ch['role']})" for ch in characters[:3]]))
    if lore:
        ctx_parts.append('Lore: ' + '; '.join([f"{l['title']}" for l in lore[:3]]))
    if timelines:
        ctx_parts.append('Timelines: ' + '; '.join([f"{t['title']}" for t in timelines[:2]]))
    
    ctx_str = ' | '.join(ctx_parts) if ctx_parts else ''
    
    prefixes = {'hemingway': 'The old man tightened his grip. ', 'tolkien': 'In those days, under the shadow of the mountain, ', 'noir': 'The rain fell hard. She lit a cigarette. ', 'romance': 'Her heart fluttered as their eyes met. ', 'gothic': 'The candle flickered, casting long shadows. ', 'pulp': 'Laser blasts tore through the hull. ', 'neutral': ''}
    prefix = prefixes.get(style, '')
    sentences = context.strip().split('. ')
    last = sentences[-1] if sentences else ''
    
    # Include context in response
    text = prefix + last + ' continued forward, each step echoing in the silence.'
    if ctx_str:
        text += ' [Context: ' + ctx_str + ']'
    
    return jsonify({'text': text, 'style': style, 'context_used': ctx_str != ''}), 200

@app.route('/api/ai/expand', methods=['POST'])
@jwt_required
def ai_expand():
    data = request.get_json()
    text = data.get('text', '')
    style = data.get('style', 'neutral')
    if not text: return jsonify({'text': ''}), 200
    
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT name, personality FROM characters WHERE user_id = ?', (user_id,))
    chars = c.fetchall()
    conn.close()
    
    char_ctx = ''
    if chars:
        char_ctx = ' Drawing from characters like ' + ', '.join([f"{ch['name']} ({ch['personality'][:30]}...)" for ch in chars[:2]]) + '.'
    
    return jsonify({'text': text + ' The details emerged slowly, each word painting a richer picture.' + char_ctx, 'style': style}), 200

@app.route('/api/ai/rewrite', methods=['POST'])
@jwt_required
def ai_rewrite():
    data = request.get_json()
    text = data.get('text', '')
    style = data.get('style', 'neutral')
    if not text: return jsonify({'text': ''}), 200
    
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT name, role FROM characters WHERE user_id = ?', (user_id,))
    chars = c.fetchall()
    conn.close()
    
    char_names = [ch['name'] for ch in chars[:2]] if chars else []
    
    r = {
        'hemingway': text + (' He said nothing. The sun was hot.' if not char_names else f" {char_names[0]} said nothing. The sun was hot."),
        'tolkien': 'Long had the words been spoken. ' + text + (' And ' + char_names[0] + ' listened.' if char_names else ''),
        'noir': 'The dame walked in. ' + text + (' ' + char_names[0] + ' watched from the shadows.' if char_names else ''),
        'romance': 'With trembling hands, she whispered. ' + text + (' ' + char_names[0] + ' drew closer.' if char_names else ''),
        'gothic': 'Through the mist, the words echoed. ' + text + (' ' + char_names[0] + ' stood at the edge of the abyss.' if char_names else ''),
        'pulp': 'ZAP! ' + text + (' ' + char_names[0] + ' dove for cover as the ray-gun hummed!' if char_names else ' The ray-gun hummed.'),
        'neutral': text
    }
    return jsonify({'text': r.get(style, text), 'style': style}), 200

@app.route('/api/ai/describe', methods=['POST'])
@jwt_required
def ai_describe():
    data = request.get_json()
    subject = data.get('subject', '')
    style = data.get('style', 'neutral')
    d = {'hemingway': 'The ' + subject + ' stood against the horizon, simple and true.', 'tolkien': 'Lo! The ' + subject + ' rose majestically, as if wrought by the Elder Days.', 'noir': 'The ' + subject + ' sat in the corner, half-hidden by shadows.', 'romance': 'The ' + subject + ' glowed softly in the candlelight.', 'gothic': 'The ' + subject + ' loomed from the darkness, twisted by time.', 'pulp': 'The ' + subject + ' pulsed with unearthly energy!', 'neutral': 'The ' + subject + ' was clearly visible.'}
    return jsonify({'text': d.get(style, d['neutral']), 'style': style}), 200

@app.route('/api/ai/brainstorm', methods=['POST'])
@jwt_required
def ai_brainstorm():
    data = request.get_json()
    topic = data.get('topic', '')
    if not topic: return jsonify({'ideas': []}), 200
    return jsonify({'ideas': ['What if ' + topic + ' happened in reverse?', 'Give ' + topic + ' an unexpected ally.', 'Explore ' + topic + ' through a minor character.', 'Transport ' + topic + ' to a different era.', 'Add a ticking clock to ' + topic + '.', 'Reveal ' + topic + ' was a dream.'], 'topic': topic}), 200

# ========== CHARACTERS ==========
@app.route('/api/characters', methods=['GET'])
@jwt_required
def get_characters():
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS characters (character_id INTEGER PRIMARY KEY, user_id INTEGER, name TEXT, role TEXT, appearance TEXT, personality TEXT, backstory TEXT, goals TEXT, relationships TEXT, tags TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    c.execute('SELECT * FROM characters WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
    chars = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify({'characters': chars}), 200

@app.route('/api/characters', methods=['POST'])
@jwt_required
def create_character():
    user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get('name', '').strip()
    if not name: return jsonify({'message': 'Name required'}), 400
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    c = conn.cursor()
    c.execute('INSERT INTO characters (user_id, name, role, appearance, personality, backstory, goals, relationships, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', (user_id, name, data.get('role', ''), data.get('appearance', ''), data.get('personality', ''), data.get('backstory', ''), data.get('goals', ''), data.get('relationships', ''), data.get('tags', '')))
    cid = c.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'character_id': cid, 'message': 'Created'}), 201

@app.route('/api/characters/<int:character_id>', methods=['PUT'])
@jwt_required
def update_character(character_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    c = conn.cursor()
    c.execute('SELECT user_id FROM characters WHERE character_id = ?', (character_id,))
    row = c.fetchone()
    if not row or row[0] != user_id:
        conn.close()
        return jsonify({'message': 'Not found'}), 404
    c.execute('UPDATE characters SET name=?, role=?, appearance=?, personality=?, backstory=?, goals=?, relationships=?, tags=? WHERE character_id=?', (data.get('name', ''), data.get('role', ''), data.get('appearance', ''), data.get('personality', ''), data.get('backstory', ''), data.get('goals', ''), data.get('relationships', ''), data.get('tags', ''), character_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Updated'}), 200

@app.route('/api/characters/<int:character_id>', methods=['DELETE'])
@jwt_required
def delete_character(character_id):
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    c = conn.cursor()
    c.execute('SELECT user_id FROM characters WHERE character_id = ?', (character_id,))
    row = c.fetchone()
    if not row or row[0] != user_id:
        conn.close()
        return jsonify({'message': 'Not found'}), 404
    c.execute('DELETE FROM characters WHERE character_id = ?', (character_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'}), 200

# ========== TIMELINES ==========
@app.route('/api/timelines', methods=['GET'])
@jwt_required
def get_timelines():
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS timelines (timeline_id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    c.execute("CREATE TABLE IF NOT EXISTS timeline_events (event_id INTEGER PRIMARY KEY, timeline_id INTEGER, title TEXT, description TEXT, date_text TEXT, chapter_ref TEXT, sort_order INTEGER DEFAULT 0)")
    c.execute('SELECT * FROM timelines WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
    timelines = []
    for row in c.fetchall():
        t = dict(row)
        c.execute('SELECT * FROM timeline_events WHERE timeline_id = ? ORDER BY sort_order', (t['timeline_id'],))
        t['events'] = [dict(e) for e in c.fetchall()]
        timelines.append(t)
    conn.close()
    return jsonify({'timelines': timelines}), 200

@app.route('/api/timelines', methods=['POST'])
@jwt_required
def create_timeline():
    user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get('title', '').strip()
    if not title: return jsonify({'message': 'Title required'}), 400
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    c = conn.cursor()
    c.execute('INSERT INTO timelines (user_id, title, description) VALUES (?, ?, ?)', (user_id, title, data.get('description', '')))
    tid = c.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'timeline_id': tid, 'message': 'Created'}), 201

@app.route('/api/timelines/<int:timeline_id>/events', methods=['POST'])
@jwt_required
def add_event(timeline_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    c = conn.cursor()
    c.execute('SELECT user_id FROM timelines WHERE timeline_id = ?', (timeline_id,))
    row = c.fetchone()
    if not row or row[0] != user_id:
        conn.close()
        return jsonify({'message': 'Not found'}), 404
    c.execute('INSERT INTO timeline_events (timeline_id, title, description, date_text, chapter_ref, sort_order) VALUES (?, ?, ?, ?, ?, ?)', (timeline_id, data.get('title', ''), data.get('description', ''), data.get('date_text', ''), data.get('chapter_ref', ''), data.get('sort_order', 0)))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Event added'}), 201

@app.route('/api/timelines/<int:timeline_id>', methods=['DELETE'])
@jwt_required
def delete_timeline(timeline_id):
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    c = conn.cursor()
    c.execute('SELECT user_id FROM timelines WHERE timeline_id = ?', (timeline_id,))
    row = c.fetchone()
    if not row or row[0] != user_id:
        conn.close()
        return jsonify({'message': 'Not found'}), 404
    c.execute('DELETE FROM timeline_events WHERE timeline_id = ?', (timeline_id,))
    c.execute('DELETE FROM timelines WHERE timeline_id = ?', (timeline_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'}), 200

# ========== LORE ==========
@app.route('/api/lore', methods=['GET'])
@jwt_required
def get_lore():
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS lore_entries (lore_id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, category TEXT, content TEXT, linked_characters TEXT, linked_timelines TEXT, tags TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    c.execute('SELECT * FROM lore_entries WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
    entries = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify({'entries': entries}), 200

@app.route('/api/lore', methods=['POST'])
@jwt_required
def create_lore():
    user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get('title', '').strip()
    if not title: return jsonify({'message': 'Title required'}), 400
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    c = conn.cursor()
    c.execute('INSERT INTO lore_entries (user_id, title, category, content, linked_characters, linked_timelines, tags) VALUES (?, ?, ?, ?, ?, ?, ?)', (user_id, title, data.get('category', ''), data.get('content', ''), data.get('linked_characters', ''), data.get('linked_timelines', ''), data.get('tags', '')))
    lid = c.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'lore_id': lid, 'message': 'Created'}), 201

@app.route('/api/lore/<int:lore_id>', methods=['DELETE'])
@jwt_required
def delete_lore(lore_id):
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    c = conn.cursor()
    c.execute('SELECT user_id FROM lore_entries WHERE lore_id = ?', (lore_id,))
    row = c.fetchone()
    if not row or row[0] != user_id:
        conn.close()
        return jsonify({'message': 'Not found'}), 404
    c.execute('DELETE FROM lore_entries WHERE lore_id = ?', (lore_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'}), 200

# ========== STORAGE ==========
@app.route('/api/user/storage', methods=['GET'])
@jwt_required
def get_storage():
    user_id = get_jwt_identity()
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT storage_limit_mb, storage_used_mb, tier FROM users WHERE user_id = ?', (user_id,))
    user = c.fetchone()
    conn.close()
    if not user: return jsonify({'message': 'Not found'}), 404
    limits = {'free': {'w': 100, 'm': 400}, 'pro': {'w': 300, 'm': 1200}, 'enterprise': {'w': 2000, 'm': 8000}}
    l = limits.get(user['tier'], limits['free'])
    return jsonify({'tier': user['tier'], 'storage_used_mb': user['storage_used_mb'], 'storage_limit_mb': user['storage_limit_mb'], 'writing_limit_mb': l['w'], 'media_limit_mb': l['m'], 'writing_used_mb': user['storage_used_mb'] * 0.2, 'media_used_mb': user['storage_used_mb'] * 0.8}), 200


@app.route('/api/projects/auto-save', methods=['POST'])
@jwt_required
def auto_save():
    user_id = get_jwt_identity()
    data = request.get_json()
    content_text = data.get('content', '')
    project_id = data.get('project_id')
    timestamp = data.get('timestamp', '')
    conn = sqlite3.connect('/app/continuity/novel_master.db')
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS auto_saves (save_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, project_id INTEGER, content TEXT, timestamp TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    c.execute('INSERT INTO auto_saves (user_id, project_id, content, timestamp) VALUES (?, ?, ?, ?)', (user_id, project_id, content_text, timestamp))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Auto-saved'}), 200

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)

# ============================================================================
# GOOGLE OAUTH — Append to end of app.py before blueprint registrations
# ============================================================================
import urllib.request
import urllib.parse
import secrets
from datetime import datetime, timedelta

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://54.162.148.159')

def _ensure_google_oauth_schema():
    """Add google_id column to users table if missing."""
    db = get_db()
    try:
        db.execute('ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE')
        db.commit()
    except sqlite3.OperationalError:
        pass  # Column already exists

@app.route('/api/auth/google', methods=['GET'])
def google_auth():
    """Initiate Google OAuth flow."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return jsonify({'message': 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars.'}), 503
    
    state = secrets.token_urlsafe(32)
    redirect_uri = f"http://{request.host}/api/auth/google/callback"
    
    params = {
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'openid email profile',
        'state': state,
        'access_type': 'offline',
        'prompt': 'consent'
    }
    
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)
    resp = make_response(redirect(auth_url))
    resp.set_cookie('oauth_state', state, httponly=True, samesite='Lax', max_age=600)
    return resp

@app.route('/api/auth/google/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback and create/login user."""
    code = request.args.get('code')
    state = request.args.get('state')
    cookie_state = request.cookies.get('oauth_state')
    
    if not code:
        return redirect(f"{FRONTEND_URL}/auth?error=no_code")
    
    if state != cookie_state:
        return redirect(f"{FRONTEND_URL}/auth?error=invalid_state")
    
    # Exchange code for access token
    token_url = "https://oauth2.googleapis.com/token"
    redirect_uri = f"http://{request.host}/api/auth/google/callback"
    
    data = urllib.parse.urlencode({
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }).encode()
    
    req = urllib.request.Request(token_url, data=data, method='POST')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            token_data = json.loads(response.read().decode())
    except Exception as e:
        logger.error(f'Google token exchange failed: {e}')
        return redirect(f"{FRONTEND_URL}/auth?error=token_exchange_failed")
    
    access_token = token_data.get('access_token')
    if not access_token:
        return redirect(f"{FRONTEND_URL}/auth?error=no_access_token")
    
    # Fetch user info from Google
    req = urllib.request.Request("https://openidconnect.googleapis.com/v1/userinfo")
    req.add_header('Authorization', f'Bearer {access_token}')
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            userinfo = json.loads(response.read().decode())
    except Exception as e:
        logger.error(f'Google userinfo failed: {e}')
        return redirect(f"{FRONTEND_URL}/auth?error=userinfo_failed")
    
    google_id = userinfo.get('sub')
    email = userinfo.get('email', '').lower()
    name = userinfo.get('name', '')
    
    if not email or not google_id:
        return redirect(f"{FRONTEND_URL}/auth?error=no_email")
    
    _ensure_google_oauth_schema()
    db = get_db()
    
    # Find user by google_id first, then by email
    user = db.execute('SELECT * FROM users WHERE google_id = ?', (google_id,)).fetchone()
    if not user:
        user = db.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    
    if user:
        # Link google_id if not already set
        if not user.get('google_id'):
            db.execute('UPDATE users SET google_id = ? WHERE user_id = ?', (google_id, user['user_id']))
        db.execute('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE user_id = ?', (user['user_id'],))
        db.commit()
        user_id = user['user_id']
        username = user['username']
        tier = user['tier']
        role = user['role']
    else:
        # Create new user from Google data
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        while db.execute('SELECT 1 FROM users WHERE username = ?', (username,)).fetchone():
            username = f"{base_username}{counter}"
            counter += 1
        
        display_name = name or username
        random_password = secrets.token_urlsafe(32)
        password_hash = generate_password_hash(random_password)
        
        cursor = db.execute(
            '''INSERT INTO users (username, display_name, email, password_hash, tier, role, is_verified, google_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
            (username, display_name, email, password_hash, 'free', 'basic', 1, google_id)
        )
        db.commit()
        user_id = cursor.lastrowid
        tier = 'free'
        role = 'basic'
        
        # Create user storage directories
        try:
            user_path = get_user_storage_path(user_id)
            os.makedirs(os.path.join(user_path, 'projects'), exist_ok=True)
            os.makedirs(os.path.join(user_path, 'exports'), exist_ok=True)
            os.makedirs(os.path.join(user_path, 'assets'), exist_ok=True)
        except Exception as e:
            logger.warning(f'Failed to create storage for Google user: {e}')
    
    # Generate JWT and redirect to frontend with token in URL hash
    token = _make_token(user_id, username, tier, role)
    return redirect(f"{FRONTEND_URL}/auth#token={token}")
