import re
from typing import List, Dict, Any, Optional

BANNED_PHRASES = [
    r'Not this\. That\.', r'Not fear\. Recognition\.', r'Not long\. But enough\.',
    r'pressure increased', r'instinct screamed', r'aura', r'power surged',
    r'he knew|she knew|they knew', r'he felt|she felt|they felt',
    r'for a moment', r'as if', r'somehow', r'it seemed',
    r'\b(quite|rather|very|really|actually|literally|basically|suddenly)\b',
    r'\b(nodded|shrugged|sighed|rolled (his|her|their) eyes)\b',
    r'\b(heartbeat raced|heart pounded|breath caught)\b',
]

def calculate_cadence(text: str) -> float:
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    if not sentences:
        return 0.0

    lengths = [len(s.split()) for s in sentences]
    avg_len = sum(lengths) / len(lengths)
    variance = sum((l - avg_len) ** 2 for l in lengths) / len(lengths)
    score = min(10.0, 5.0 + (variance / 10))
    return round(score, 2)

def analyze_prose(text: str, user_overrides: Optional[List[str]] = None) -> Dict[str, Any]:
    """Analyze prose for banned phrases and cadence.
    Accepts optional list of regex patterns to ALLOW (skip flagging).
    """
    violations: List[Dict[str, Any]] = []

    # Filter banned phrases against user overrides
    effective_banned = BANNED_PHRASES[:]
    overrides_applied = 0
    if user_overrides:
        for override in user_overrides:
            if override in effective_banned:
                effective_banned.remove(override)
                overrides_applied += 1

    for pattern in effective_banned:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            violations.append({
                'pattern': pattern,
                'count': len(matches),
                'examples': matches[:3]
            })

    cadence_score = calculate_cadence(text)
    penalty = len(violations) * 0.5
    final_score = max(0.0, cadence_score - penalty)
    final_score = round(final_score, 1)

    badge: Optional[str] = None
    if final_score >= 9.0:
        badge = 'Gold'
    elif final_score >= 7.5:
        badge = 'Silver'
    elif final_score >= 6.0:
        badge = 'Bronze'

    return {
        'score': final_score,
        'badge': badge,
        'violations': violations,
        'status': 'flagged' if violations else 'clean',
        'cadence': cadence_score,
        'penalty': penalty,
        'overrides_applied': overrides_applied
    }

def analyze_with_style_profile(text: str, style_preferences: List[Dict[str, Any]], user_overrides: Optional[List[str]] = None) -> Dict[str, Any]:
    """Calls analyze_prose() first, then checks text against each active style preference's original_pattern.
    If "bad" pattern found, add style_violations array to result with suggestion + confidence + preference_id.
    Apply additional penalty (-0.3 per violation). Update badge/score accordingly.
    """
    result = analyze_prose(text, user_overrides)
    style_violations = []

    for pref in style_preferences:
        original = pref.get('original_pattern', '')
        if not original:
            continue
        # Simple substring match (case-insensitive)
        if original.lower() in text.lower():
            style_violations.append({
                'preference_id': pref.get('preference_id'),
                'original_pattern': original,
                'suggestion': pref.get('corrected_pattern', ''),
                'confidence': pref.get('confidence_score', 0.0),
                'context': pref.get('context', '')
            })

    if style_violations:
        style_penalty = len(style_violations) * 0.3
        result['penalty'] = result.get('penalty', 0) + style_penalty
        result['score'] = max(0.0, round(result['score'] - style_penalty, 1))
        result['style_violations'] = style_violations
        result['status'] = 'flagged'

        # Re-evaluate badge
        if result['score'] >= 9.0:
            result['badge'] = 'Gold'
        elif result['score'] >= 7.5:
            result['badge'] = 'Silver'
        elif result['score'] >= 6.0:
            result['badge'] = 'Bronze'
        else:
            result['badge'] = None
    else:
        result['style_violations'] = []

    return result
