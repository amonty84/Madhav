#!/usr/bin/env python3
"""
Script to strip corrective text from MSR_v2_0.md
"""

import re

def clean_msr(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove "MSR_v1_0 superseded" from scope field
    content = re.sub(r'MSR_v1_0 superseded', 'MSR_v1_0', content)
    
    # Remove the entire "CORRECTED signals" table in §0
    # Find the table and remove it
    corrected_signals_start = content.find('**CORRECTED signals** (underlying fact changed in v8.0 — already updated in FIX_SESSION_003):')
    if corrected_signals_start != -1:
        # Find the end of the table (look for the next section)
        table_end = content.find('**CONFIRMED signals**', corrected_signals_start)
        if table_end != -1:
            # Remove everything from the start to just before "CONFIRMED signals"
            content = content[:corrected_signals_start] + content[table_end:]
    
    # Remove "The following signals are corrected in-place..." line
    content = re.sub(r'The following signals are corrected in-place\. Their original text in MSR_v1_0 is superseded by these corrected versions\.', '', content)
    
    # Remove "reconciliation:" fields from YAML blocks
    lines = content.split('\n')
    new_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Skip reconciliation fields
        if line.strip().startswith('reconciliation:'):
            i += 1
            # Skip continuation lines (indented or quoted)
            while i < len(lines) and (lines[i].startswith('  ') or lines[i].startswith('    ') or lines[i].startswith('"')):
                i += 1
            continue
        
        # Remove "status: INVALIDATED" or "status: CORRECTED" lines
        if line.strip().startswith('status:') and ('INVALIDATED' in line or 'CORRECTED' in line):
            i += 1
            continue
        
        # Remove "invalidation_source:" lines
        if line.strip().startswith('invalidation_source:'):
            i += 1
            continue
        
        # Remove lines with "CORRECTED from MSR_v1_0:" patterns
        if 'CORRECTED from MSR_v1_0:' in line or 'v6.0 erroneous' in line.lower():
            i += 1
            continue
        
        # Remove lines with "v1.0 framing ... is INCORRECT" patterns
        if 'v1.0 framing' in line and 'INCORRECT' in line:
            i += 1
            continue
        
        # Remove lines with "(was X, now Y)" patterns
        if re.search(r'\(was .*? now .*?\)', line) or re.search(r'\(was .*? actually .*?\)', line):
            i += 1
            continue
        
        # Remove lines with "CORRECTED:" at the beginning
        if line.strip().startswith('CORRECTED:'):
            i += 1
            continue
        
        # Remove lines with "UPGRADED per JH v8.0:" 
        if 'UPGRADED per JH v8.0:' in line:
            i += 1
            continue
        
        # Remove lines with "JH AUTHORITATIVE" in correction context
        if 'JH AUTHORITATIVE' in line and ('CORRECTED' in line or 'NOT' in line or 'incorrect' in line.lower()):
            i += 1
            continue
        
        # Remove "Signals whose underlying facts were CORRECTED" line
        if 'Signals whose underlying facts were CORRECTED' in line:
            i += 1
            continue
        
        # Remove "The following signals in MSR_v1_0 cited v6.0 erroneous" section
        if 'The following signals in MSR_v1_0 cited v6.0 erroneous' in line:
            # Skip this entire section until we find the next section
            while i < len(lines) and not lines[i].startswith('## §'):
                i += 1
            continue
        
        # Remove "JH corrected value" references
        if 'JH corrected value' in line:
            i += 1
            continue
        
        # Remove "corrected above" references
        if re.search(r'\(corrected above\)', line, re.IGNORECASE):
            i += 1
            continue
        
        # Remove lines with "invalidated above" or "upgraded above"
        if re.search(r'(invalidated|upgraded|revised) above', line, re.IGNORECASE):
            i += 1
            continue
        
        # Remove lines with "JH-authoritative values for all four corrected elements"
        if 'JH-authoritative values for all four corrected elements' in line:
            i += 1
            continue
        
        # Remove lines with "MSR.402 (now invalidated)"
        if 'MSR.402 (now invalidated)' in line:
            i += 1
            continue
        
        # Remove lines with "all three errors corrected"
        if 'all three errors corrected' in line:
            i += 1
            continue
        
        # Remove lines with "corrected inputs" in falsifier
        if 'corrected inputs' in line:
            i += 1
            continue
        
        # Remove lines with "corrected birth data" in falsifier
        if 'corrected birth data' in line:
            i += 1
            continue
        
        # Remove lines with "corrected special lagnas"
        if 'corrected special lagnas' in line:
            i += 1
            continue
        
        # Remove lines with "corrected birth time"
        if 'corrected birth time' in line:
            i += 1
            continue
        
        # Skip the version history table entries that mention corrections
        if line.strip().startswith('| 2.0 |') and 'reconciliation corrections' in line:
            i += 1
            continue
        
        # Remove version history lines with "confirmed/corrected status documented"
        if 'confirmed/corrected status documented' in line:
            i += 1
            continue
        
        # Remove version history lines with "7 corrected signals"
        if '7 corrected signals' in line:
            i += 1
            continue
        
        # Remove bullet points with "CORRECTED:" at the beginning
        if line.strip().startswith('- "CORRECTED:') or line.strip().startswith('  - "CORRECTED:'):
            i += 1
            continue
        
        # Remove bullet points with "incorrect by" patterns
        if 'incorrect by' in line and ('°' in line or 'v6.0' in line):
            i += 1
            continue
        
        # Remove bullet points with "v6.0 computation error"
        if 'v6.0 computation error' in line:
            i += 1
            continue
        
        # Remove "CONFIRMED UNAFFECTED by v8.0 reconciliation" line
        if 'CONFIRMED UNAFFECTED by v8.0 reconciliation' in line:
            i += 1
            continue
        
        new_lines.append(line)
        i += 1
    
    content = '\n'.join(new_lines)
    
    # Remove "CORRECTED" from signal names in YAML blocks (case-insensitive)
    content = re.sub(r'signal_name: ".*?[Cc][Oo][Rr][Rr][Ee][Cc][Tt][Ee][Dd].*?"', 
                     lambda m: m.group(0).replace(' (CORRECTED PLACEMENT)', '')
                               .replace(' CORRECTED', '')
                               .replace(' — Corrected Four-Lagna Distribution', ' — Four-Lagna Distribution')
                               .replace(' Corrected', ''),
                     content)
    
    # Remove "INVALIDATED" from signal names in YAML blocks
    content = re.sub(r'signal_name: ".*?INVALIDATED.*?"', lambda m: m.group(0).replace(' — INVALIDATED', ''), content)
    
    # Remove "CORRECTED" from section headers
    content = re.sub(r'## §I — CORRECTED SIGNALS \(v8\.0 Reconciliation\)', '## §I — SIGNALS', content)
    content = re.sub(r'## §IV — ROGA SAHAM AND MAHATMYA SAHAM — CORRECTED SIGNALS', '## §IV — ROGA SAHAM AND MAHATMYA SAHAM', content)
    
    # Remove "CORRECTED" from table of contents entries
    content = re.sub(r'- \[§I — CORRECTED SIGNALS \(v8\.0 Reconciliation\)\]', '- [§I — SIGNALS]', content)
    content = re.sub(r'- \[§IV — ROGA SAHAM AND MAHATMYA SAHAM — CORRECTED SIGNALS\]', '- [§IV — ROGA SAHAM AND MAHATMYA SAHAM]', content)
    
    # Clean up corrections_applied field
    content = re.sub(r'corrections_applied: \[.*?\]', 'corrections_applied: []', content)
    
    # Remove the correction summary table at the end
    # Look for the table that starts with "| Hora Lagna = Gemini 3H"
    table_start = content.find('| Hora Lagna = Gemini 3H (not Libra 7H)')
    if table_start != -1:
        # Find the end of the table (look for the next section or empty line)
        table_end = content.find('\n\n', table_start)
        if table_end != -1:
            content = content[:table_start] + content[table_end:]
    
    # Remove "Corrected Claim" table header
    content = re.sub(r'\| Corrected Claim \|', '| Claim |', content)
    
    # Update version from 2.1 to 2.2 (already done, but keep for safety)
    content = re.sub(r'version: 2\.1', 'version: 2.2', content)
    
    # Update the title line
    content = re.sub(r'# MASTER SIGNAL REGISTER v2\.1', '# MASTER SIGNAL REGISTER v2.2', content)
    
    # Add changelog to frontmatter if not already there
    if 'v2_2_changelog:' not in content:
        # Find frontmatter end
        frontmatter_end = content.find('---', 3)
        if frontmatter_end != -1:
            frontmatter = content[:frontmatter_end]
            rest = content[frontmatter_end:]
            # Add changelog line
            frontmatter += 'v2_2_changelog: "§0-SCHEMA.2 version-diff notes stripped; inline correction commentary removed. See 00_ARCHITECTURE/AUDIT_REPORT_v1_0.md for history."\n'
            content = frontmatter + rest
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Cleaned MSR_v2_0.md and updated to version 2.2")
    
    # Verify cleanup
    with open(file_path, 'r', encoding='utf-8') as f:
        cleaned = f.read()
    
    # Check for remaining correction markers (case-insensitive)
    remaining_correction = re.findall(r'[Cc][Oo][Rr][Rr][Ee][Cc][Tt][Ee][Dd]|[Ss][Uu][Pp][Ee][Rr][Ss][Ee][Dd][Ee][Dd]|[Ii][Nn][Vv][Aa][Ll][Ii][Dd][Aa][Tt][Ee][Dd]|reconciliation:|\(was.*?now\)|v6\.0 erroneous|v1\.0 framing.*?INCORRECT', cleaned)
    if remaining_correction:
        print(f"Warning: Found {len(remaining_correction)} remaining correction markers")
        for marker in remaining_correction[:5]:
            print(f"  - {marker}")
    else:
        print("Successfully removed all correction markers")
    
    return len(remaining_correction) == 0

if __name__ == '__main__':
    file_path = '/Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/MSR_v2_0.md'
    success = clean_msr(file_path)
    if success:
        print("MSR cleanup completed successfully")
    else:
        print("MSR cleanup completed with warnings")
