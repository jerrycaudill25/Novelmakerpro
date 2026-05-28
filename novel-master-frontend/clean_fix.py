import os

if not os.path.exists('ai_engine_v2_merged.py.bak'):
    print("Error: Backup file not found here!")
    exit()

with open('ai_engine_v2_merged.py.bak', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixed = False
for i, line in enumerate(lines):
    if "guard" in line and "thumb drift" in line:
        lines[i] = '    "She watched the guard\'s thumb drift to his sword belt. Watched it stop there."\n'
        fixed = True
        print(f"Surgically fixed line {i+1}!")

if fixed:
    with open('ai_engine_v2_merged.py', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Success! File fully restored and repaired.")
else:
    print("Could not locate the target line in the backup file.")
