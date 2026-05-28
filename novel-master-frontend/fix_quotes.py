import re
import shutil

filename = 'ai_engine_v2_merged.py'
backup = 'ai_engine_v2_merged.py.bak'

# 1. Save a backup copy just to be completely safe
shutil.copyfile(filename, backup)
print(f"Safe backup created at: {backup}")

# 2. Read the file content
with open(filename, 'r', encoding='utf-8') as f:
    code = f.read()

# 3. Target any single quote caught between letters (e.g., guard's, don't, I'm) 
# and swap it out with a safely escaped syntax (\')
fixed_code = re.sub(r"(?<=[a-zA-Z])'(?=[a-zA-Z])", r"\'", code)

# 4. Overwrite the file with the clean code
with open(filename, 'w', encoding='utf-8') as f:
    f.write(fixed_code)

print("Success! All mid-word apostrophes have been automatically escaped.")
