#!/usr/bin/env python3
"""
Script to strip corrective text from CDLM_v1_1.md
"""

import re

def clean_cdlm(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    new_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Skip the "Corrections Summary (9 cells revised)" table (lines 20-33)
        if line.strip() == "### Corrections Summary (9 cells revised)":
            # Skip this line and the next 13 lines (table lines)
            i += 14  # Skip the header line and the 13 lines of table
            continue
        
        # Skip lines that are part of the corrections table
        if i >= 20 and i <= 33 and "| Cell | Was | Now | Reason |" in content:
            # We're in the table range, skip
            i += 1
            continue
        
        # Remove "CORRECTED CELL (v1.1):" comment lines
        if line.strip().startswith("# CORRECTED CELL (v1.1):"):
            i += 1
            continue
        
        # Remove "v1_1_correction:" fields and their values
        if line.strip().startswith("v1_1_correction:"):
            # Skip this line and check if next line is also part of the field
            i += 1
            # Skip any continuation lines (indented or quoted)
            while i < len(lines) and (lines[i].startswith('  ') or lines[i].startswith('    ') or lines[i].startswith('"')):
                i += 1
            continue
        
        # Remove any lines with "(v6.0 error)" or similar
        if "(v6.0" in line or "v6.0" in line.lower():
            # Check if this is a standalone comment line or part of a larger text
            # We'll be conservative and only remove if it's clearly a correction note
            if "error" in line.lower() or "corrected" in line.lower() or "was" in line.lower() and "now" in line.lower():
                i += 1
                continue
        
        # Keep the line
        new_lines.append(line)
        i += 1
    
    # Join back
    new_content = '\n'.join(new_lines)
    
    # Remove any empty comment lines that might be left
    new_content = re.sub(r'^\s*#\s*$', '', new_content, flags=re.MULTILINE)
    
    # Remove multiple consecutive blank lines
    new_content = re.sub(r'\n\s*\n\s*\n', '\n\n', new_content)
    
    # Update version from 1.1 to 1.2
    new_content = re.sub(r'version: 1\.1', 'version: 1.2', new_content)
    
    # Update the title line
    new_content = re.sub(r'### v1\.1 — Corrected per FORENSIC_ASTROLOGICAL_DATA_v8_0\.md', 
                         '### v1.2 — Cross-Domain Linkage Matrix', new_content)
    
    # Add changelog to frontmatter if not already there
    if 'v1_2_changelog:' not in new_content:
        # Find the frontmatter end
        frontmatter_end = new_content.find('---', 3)
        if frontmatter_end != -1:
            # Insert changelog line before the closing ---
            frontmatter = new_content[:frontmatter_end]
            rest = new_content[frontmatter_end:]
            # Add changelog line
            frontmatter += 'v1_2_changelog: "Corrective text stripped 2026-04-19 per corpus cleanup brief. See 00_ARCHITECTURE/AUDIT_REPORT_v1_0.md for history."\n'
            new_content = frontmatter + rest
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Cleaned CDLM_v1_1.md and updated to version 1.2")
    
    # Verify cleanup
    with open(file_path, 'r', encoding='utf-8') as f:
        cleaned = f.read()
    
    # Check for remaining correction markers
    remaining_correction = re.findall(r'CORRECTED CELL|v1_1_correction|\(v6\.0', cleaned, re.IGNORECASE)
    if remaining_correction:
        print(f"Warning: Found {len(remaining_correction)} remaining correction markers")
    else:
        print("Successfully removed all correction markers")
    
    return len(remaining_correction) == 0

if __name__ == '__main__':
    file_path = '/Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md'
    success = clean_cdlm(file_path)
    if success:
        print("CDLM cleanup completed successfully")
    else:
        print("CDLM cleanup completed with warnings")