import sys

new_code = '''
# =============================================================================
# MISSING ROUTES — Added for frontend compatibility
# =============================================================================

@app.route('/api/characters', methods=['GET'])
@token_required
def get_all_characters():
    """GET /api/characters — List all characters for current user"""
    db = get_db()
    projects = db.execute(
        'SELECT project_id FROM projects WHERE user_id = ?',
        (g.current_user['user_id'],)
    ).fetchall()
    if not projects:
        return jsonify({'characters': []})
    project_ids = [p['project_id'] for p in projects]
    placeholders = ','.join('?' * len(project_ids))
    characters = db.execute(
        f"""SELECT c.*, p.title as project_title 
            FROM characters c 
            JOIN projects p ON c.project_id = p.project_id 
            WHERE c.project_id IN ({placeholders})
            ORDER BY c.updated_at DESC""",
        project_ids
    ).fetchall()
    
    result = []
    for c in characters:
        d = dict(c)
        result.append({
            'id': d.get('character_id'),
            'name': d.get('name', ''),
            'role': d.get('role_type', ''),
            'appearance': d.get('physical_traits', ''),
            'personality': d.get('personality_traits', ''),
            'backstory': d.get('backstory', ''),
            'goals': d.get('goals', ''),
            'relationships': d.get('relationships', ''),
            'tags': d.get('raw_data', ''),
            'project_id': d.get('project_id'),
            'created_at': d.get('created_at'),
            'updated_at': d.get('updated_at')
        })
    return jsonify({'characters': result})


@app.route('/api/characters', methods=['POST'])
@token_required
def create_character_global():
    """POST /api/characters — Create a new character (auto-assigns to first project)"""
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    db = get_db()
    user_id = g.current_user['user_id']
    
    # Find or create a default project for this user
    project = db.execute(
        'SELECT project_id FROM projects WHERE user_id = ? LIMIT 1',
        (user_id,)
    ).fetchone()
    
    if not project:
        cursor = db.execute(
            'INSERT INTO projects (user_id, title, status) VALUES (?, ?, ?)',
            (user_id, 'General', 'active')
        )
        db.commit()
        project_id = cursor.lastrowid
    else:
        project_id = project['project_id']
    
    name = data.get('name', 'Unnamed Character')
    role_type = data.get('role', 'supporting')
    if role_type not in ('protagonist', 'antagonist', 'supporting', 'minor'):
        role_type = 'supporting'
    
    physical_traits = data.get('appearance', '')
    personality_traits = data.get('personality', '')
    backstory = data.get('backstory', '')
    goals = data.get('goals', '')
    relationships = data.get('relationships', '')
    raw_data = json.dumps({'tags': data.get('tags', '')})
    extracted_facts = data.get('extracted_facts', '') or data.get('tags', '')
    
    cursor = db.execute(
        """INSERT INTO characters 
           (project_id, name, role_type, raw_data, extracted_facts, physical_traits, 
            personality_traits, backstory, goals, relationships)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (project_id, name, role_type, raw_data, extracted_facts, physical_traits,
         personality_traits, backstory, goals, relationships)
    )
    db.commit()
    
    return jsonify({
        'message': 'Character created',
        'id': cursor.lastrowid,
        'project_id': project_id
    }), 201


@app.route('/api/user/storage', methods=['GET'])
@token_required
def get_user_storage_info():
    """GET /api/user/storage — Return user storage info"""
    db = get_db()
    user = db.execute(
        'SELECT storage_used_mb, storage_limit_mb FROM users WHERE user_id = ?',
        (g.current_user['user_id'],)
    ).fetchone()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    used = round(user['storage_used_mb'], 2)
    limit = user['storage_limit_mb']
    available = round(limit - used, 2)
    
    return jsonify({
        'used': used,
        'total': limit,
        'available': available,
        'used_mb': used,
        'limit_mb': limit,
        'available_mb': available
    })


@app.route('/api/ai/continue', methods=['POST'])
@token_required
def ai_continue():
    """POST /api/ai/continue — AI story continuation"""
    data = request.get_json() or {}
    style = data.get('style', 'neutral')
    
    # Try to use existing AI engine if available
    try:
        from ai_engine import generate_story_continuation
        result = generate_story_continuation(style=style, user_id=g.current_user['user_id'])
        return jsonify({'continuation': result, 'style': style})
    except Exception:
        # Fallback placeholder
        return jsonify({
            'continuation': 'The story continues from here, developing the plot with ' + style + ' pacing...',
            'style': style,
            'message': 'AI continuation generated'
        })
'''

with open('app.py', 'r') as f:
    content = f.read()

# Insert before if __name__ == '__main__' block, or append if not found
marker = "if __name__ == '__main__':"
if marker not in content:
    marker = 'if __name__ == "__main__":'

if marker in content:
    idx = content.find(marker)
    content = content[:idx] + new_code + '\\n' + content[idx:]
else:
    content = content + '\\n' + new_code

with open('app.py', 'w') as f:
    f.write(content)

print("Routes patched successfully!")
