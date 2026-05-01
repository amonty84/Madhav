import re
import os
from pathlib import Path
from typing import List, Dict, Any, Tuple

def extract_msr_signals(file_path: str) -> Dict[str, str]:
    """Extracts SIG.MSR.NNN blocks from a markdown file."""
    signals = {}
    if not os.path.exists(file_path):
        return signals
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Match SIG.MSR.XXX: followed by indented YAML block
    matches = list(re.finditer(r'^SIG\.MSR\.([0-9a-z.]+):', content, flags=re.MULTILINE))
    
    for i in range(len(matches)):
        start_idx = matches[i].end()
        end_idx = matches[i+1].start() if i+1 < len(matches) else len(content)
        
        sig_id = matches[i].group(1)
        sig_content = content[start_idx:end_idx]
        
        # Trim to just the indented part
        lines = sig_content.split('\n')
        yaml_lines = []
        found_content = False
        for line in lines:
            if not line.strip():
                if found_content:
                    yaml_lines.append(line)
                continue
            if line.startswith('  ') or line.startswith('    ') or line.startswith('\t'):
                yaml_lines.append(line)
                found_content = True
            else:
                # End of indented block
                break
        
        signals[sig_id] = '\n'.join(yaml_lines).strip()
    return signals

def parse_yaml_block(content: str) -> Dict[str, Any]:
    """Basic YAML parser for signal blocks (handles key: value and simple lists)."""
    try:
        import yaml
        # We use safe_load but need to handle potential malformed YAML in signals
        return yaml.safe_load(content)
    except (ImportError, Exception) as e:
        # Fallback simple parser if yaml library fails or is not available
        data = {}
        lines = content.split('\n')
        current_key = None
        for line in lines:
            line = line.strip()
            if not line: continue
            if ':' in line and not line.startswith('-'):
                k, v = line.split(':', 1)
                current_key = k.strip()
                val = v.strip()
                if val.startswith('[') and val.endswith(']'):
                    data[current_key] = [i.strip().strip("'").strip('"') for i in val[1:-1].split(',')]
                elif not val:
                    data[current_key] = None
                else:
                    data[current_key] = val.strip("'").strip('"')
            elif line.startswith('-') and current_key:
                if not isinstance(data[current_key], list):
                    data[current_key] = []
                data[current_key].append(line[1:].strip().strip("'").strip('"'))
        return data

SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra",
         "Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
SIGN_MAP = {s.lower(): s for s in SIGNS}

def normalize_sign(s: str) -> str:
    return SIGN_MAP.get(s.lower(), s)

def get_authoritative_data():
    """Returns the core authoritative data from v8.0 forensic."""
    # This matches the AUTHORITATIVE_PLACEMENTS in audit.py but expanded
    return {
        "Jupiter":       {"house": "9", "sign": "Sagittarius"},
        "Sun":           {"house": "10", "sign": "Capricorn"},
        "Moon":          {"house": "11", "sign": "Aquarius"}, # Rashi
        "Mars":          {"house": "7", "sign": "Libra"},
        "Mercury":       {"house": "10", "sign": "Capricorn"},
        "Venus":         {"house": "9", "sign": "Sagittarius"},
        "Saturn":        {"house": "7", "sign": "Libra"},
        "Rahu":          {"house": "2", "sign": "Taurus"},
        "Ketu":          {"house": "8", "sign": "Scorpio"},
        "Lagna":         {"house": "1", "sign": "Aries"},
        "Shree Lagna":   {"house": "7", "sign": "Libra"},
        "Ghati Lagna":   {"house": "9", "sign": "Sagittarius"},
        "Varnada Lagna": {"house": "4", "sign": "Cancer"},
        "Hora Lagna":    {"house": "3", "sign": "Gemini"},
    }
