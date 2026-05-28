"""storage_service.py — Novel Master Storage Abstraction
Handles local file I/O, checksums, and quota-aware operations.
"""
import os
import hashlib
import shutil
from flask import send_file

def get_user_storage_path(user_id, secret_key=None):
    """Deterministic user storage path. Optional secret_key for obfuscation."""
    if secret_key:
        # Simple obfuscation: hash user_id with secret_key prefix
        h = hashlib.sha256(f"{secret_key}:{user_id}".encode()).hexdigest()[:16]
        return os.path.join('storage', 'users', f"{user_id}_{h}")
    return os.path.join('storage', 'users', str(user_id))

def compute_checksum(filepath):
    """Compute SHA-256 checksum of a file."""
    sha256 = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256.update(chunk)
    return sha256.hexdigest()

def write_file(filepath, content):
    """Write text content to filepath. Returns (size_bytes, checksum)."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    size = os.path.getsize(filepath)
    return size, compute_checksum(filepath)

def save_file(file_obj, filepath):
    """Save a Werkzeug FileStorage object. Returns (size_bytes, checksum)."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    file_obj.save(filepath)
    size = os.path.getsize(filepath)
    return size, compute_checksum(filepath)

def read_file(filepath):
    """Read text content from filepath."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def delete_file(filepath):
    """Delete a file if it exists."""
    if os.path.exists(filepath):
        os.remove(filepath)

def file_exists(filepath):
    """Check if file exists."""
    return os.path.exists(filepath)

def copy_file(src, dst):
    """Copy file from src to dst."""
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)

def send_file_response(filepath, mime_type, filename):
    """Return a Flask send_file response."""
    return send_file(filepath, mimetype=mime_type, as_attachment=True, download_name=filename)
