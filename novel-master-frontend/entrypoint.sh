#!/bin/sh
# entrypoint.sh — Novel Master Production Startup
set -e

echo "[Novel Master] Initializing database..."
python -c "
import os
os.environ['FLASK_ENV'] = 'production'
from app import app, init_db
with app.app_context():
    init_db()
    print('[Novel Master] Database initialized successfully')
"

echo "[Novel Master] Starting Gunicorn with WebSocket support..."
exec gunicorn -c gunicorn_config.py --bind 0.0.0.0:5000 app:app
