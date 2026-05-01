#!/usr/bin/env python3
"""
Script to remove all reconciliation fields from MSR_v2_0.md
"""

import re

def remove_reconciliation_fields(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match reconciliation field lines and the empty line after them
    # We need to be careful because reconciliation fields appear in different contexts
    # The pattern should match:
    #   reconciliation: "..." followed by a blank line
    # OR reconciliation: "..." at the end of a signal before the next signal separator
    
    # First, let's count how many reconciliation fields we have
    reconciliation_pattern = r'^\s*reconciliation:.*$'
    matches = re.findall(reconciliation_pattern, content, re.MULTILINE)
    print(f"Found {len(matches)} reconciliation fields")
    
    # Remove reconciliation lines and the following blank line if present
    # We'll process line by line to be safe
    lines = content.split('\n')
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith('reconciliation:'):
            # Skip this line (don't add it to new_lines)
            # Check if next line is empty, skip it too
            if i + 1 < len(lines) and lines[i + 1].strip() == '':
                i += 1
        else:
            new_lines.append(line)
        i += 1
    
    new_content = '\n'.join(new_lines)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Removed {len(matches)} reconciliation fields")
    
    # Verify removal
    with open(file_path, 'r', encoding='utf-8') as f:
        new_content = f.read()
    
    remaining = re.findall(reconciliation_pattern, new_content, re.MULTILINE)
    print(f"Remaining reconciliation fields: {len(remaining)}")
    
    return len(remaining) == 0

if __name__ == '__main__':
    file_path = '/Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/MSR_v2_0.md'
    success = remove_reconciliation_fields(file_path)
    if success:
        print("Successfully removed all reconciliation fields")
    else:
        print("Warning: Some reconciliation fields may remain")