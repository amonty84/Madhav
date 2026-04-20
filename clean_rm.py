#!/usr/bin/env python3
"""
Script to strip corrective text from RM_v2_0.md
"""

import re

def clean_rm(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    new_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Skip v2_0_correction fields in YAML blocks
        if line.strip().startswith('v2_0_correction:'):
            # Skip this line and any continuation lines (indented or quoted)
            i += 1
            while i < len(lines) and (lines[i].startswith('  ') or lines[i].startswith('    ') or lines[i].startswith('"')):
                i += 1
            continue
        
        # Skip lines with [CORRECTED v1.1] or [v2.0 CORRECTED] markers
        if '[CORRECTED v1.1]' in line or '[v2.0 CORRECTED]' in line:
            i += 1
            continue
        
        # Skip lines with (was X — corrected) or (was X in v1.1) patterns
        if re.search(r'\(was .*? — corrected\)', line) or re.search(r'\(was .*? in v1\.1\)', line):
            i += 1
            continue
        
        # Skip lines with (corrected v2.0) or similar
        if '(corrected v2.0)' in line.lower() or '(corrected per' in line.lower():
            i += 1
            continue
        
        # Skip the entire CHANGELOG section
        if line.strip() == '## CHANGELOG (v2.0 from v1.1)':
            # Skip until we find the next section or end of file
            i += 1
            while i < len(lines) and not lines[i].startswith('## '):
                i += 1
            continue
        
        # Keep the line
        new_lines.append(line)
        i += 1
    
    # Join back
    new_content = '\n'.join(new_lines)
    
    # Remove the rebuild_rationale field from frontmatter
    # Find frontmatter start and end
    if new_content.startswith('---'):
        frontmatter_end = new_content.find('---', 3)
        if frontmatter_end != -1:
            frontmatter = new_content[:frontmatter_end]
            rest = new_content[frontmatter_end:]
            # Remove rebuild_rationale field
            frontmatter = re.sub(r'rebuild_rationale:.*?\n', '', frontmatter, flags=re.DOTALL)
            new_content = frontmatter + rest
    
    # Remove corrections_applied field from frontmatter
    if new_content.startswith('---'):
        frontmatter_end = new_content.find('---', 3)
        if frontmatter_end != -1:
            frontmatter = new_content[:frontmatter_end]
            rest = new_content[frontmatter_end:]
            # Remove corrections_applied field
            frontmatter = re.sub(r'corrections_applied:.*?\n', '', frontmatter, flags=re.DOTALL)
            new_content = frontmatter + rest
    
    # Update version from 2.0 to 2.1
    new_content = re.sub(r'version: 2\.0', 'version: 2.1', new_content)
    
    # Update the title line
    new_content = re.sub(r'# AM-JIS — Resonance Map v2\.0', 
                         '# AM-JIS — Resonance Map v2.1', new_content)
    
    # Add changelog to frontmatter if not already there
    if 'v2_1_changelog:' not in new_content:
        # Find the frontmatter end
        frontmatter_end = new_content.find('---', 3)
        if frontmatter_end != -1:
            # Insert changelog line before the closing ---
            frontmatter = new_content[:frontmatter_end]
            rest = new_content[frontmatter_end:]
            # Add changelog line
            frontmatter += 'v2_1_changelog: "Corrective text stripped 2026-04-19 per corpus cleanup brief. See 00_ARCHITECTURE/AUDIT_REPORT_v1_0.md for history."\n'
            new_content = frontmatter + rest
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Cleaned RM_v2_0.md and updated to version 2.1")
    
    # Verify cleanup
    with open(file_path, 'r', encoding='utf-8') as f:
        cleaned = f.read()
    
    # Check for remaining correction markers
    remaining_correction = re.findall(r'v2_0_correction|\[CORRECTED|\(was.*?corrected\)|CHANGELOG \(v2\.0', cleaned, re.IGNORECASE)
    if remaining_correction:
        print(f"Warning: Found {len(remaining_correction)} remaining correction markers")
        for marker in remaining_correction[:5]:  # Show first 5
            print(f"  - {marker}")
    else:
        print("Successfully removed all correction markers")
    
    return len(remaining_correction) == 0

if __name__ == '__main__':
    file_path = '/Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/RM_v2_0.md'
    success = clean_rm(file_path)
    if success:
        print("RM cleanup completed successfully")
    else:
        print("RM cleanup completed with warnings")