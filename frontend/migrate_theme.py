import os

directory = 'src'
replacements = {
    'amber-': 'violet-',
    'zinc-': 'slate-',
    'rose-': 'cyan-',
    'orange-': 'fuchsia-',
    'teal-': 'emerald-',
    'lime-': 'emerald-'
}

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
            replace_in_file(os.path.join(root, file))

print("Theme migration complete.")
