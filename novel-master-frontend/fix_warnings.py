filename = 'ai_engine_v2_merged.py'

with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Swap the normal string patterns with clean raw string patterns
content = content.replace("'Not this\\.'", "r'Not this\\.'")
content = content.replace("'Not fear\\.'", "r'Not fear\\.'")
content = content.replace("'Not long\\.'", "r'Not long\\.'")
content = content.replace("'Not injured\\.'", "r'Not injured\\.'")

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)

print("Warnings scrubbed! All patterns upgraded to raw strings.")
