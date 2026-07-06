import os
import re

# Dictionary mapping hardcoded dark classes to light dark:dark equivalents
replacements = {
    # Backgrounds
    r'\bbg-zinc-900\b': 'bg-white dark:bg-zinc-900',
    r'\bbg-zinc-800\b': 'bg-zinc-100 dark:bg-zinc-800',
    r'\bbg-zinc-950\b': 'bg-zinc-50 dark:bg-zinc-950',
    # Text colors
    r'\btext-zinc-100\b': 'text-zinc-900 dark:text-zinc-100',
    r'\btext-zinc-200\b': 'text-zinc-800 dark:text-zinc-200',
    r'\btext-zinc-300\b': 'text-zinc-700 dark:text-zinc-300',
    r'\btext-zinc-400\b': 'text-zinc-600 dark:text-zinc-400',
    # Borders
    r'\bborder-zinc-800\b': 'border-zinc-200 dark:border-zinc-800',
    r'\bborder-zinc-700\b': 'border-zinc-300 dark:border-zinc-700',
}

def refactor_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content
    for old, new in replacements.items():
        # Prevent double-replacements by checking if the new string exists. 
        # Actually a better regex approach is safer. We will use a lookbehind/lookahead if needed, 
        # but regex \b ensures we only match whole words.
        # We can just do the replacement blindly because the original files do not have dark: prefix yet.
        new_content = re.sub(old, new, new_content)
            
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {filepath}")

def main():
    directory = 'src'
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                refactor_file(os.path.join(root, file))
                
if __name__ == "__main__":
    main()
