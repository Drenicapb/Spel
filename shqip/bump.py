#!/usr/bin/env python3
"""Ny version av Mëso Shqip:  python3 bump.py 1.0.1 "Vad som är nytt"  [apk-versionskod]
Uppdaterar VER i index.html, cachenamnet i sw.js och skriver version.json.
Pusha sedan Spel-repot – appen visar "Ny version – Uppdatera" nästa gång den öppnas."""
import re, sys, json, os
d = os.path.dirname(os.path.abspath(__file__))
v, notes = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "")
def sub(f, pat, rep):
    p = os.path.join(d, f); s = open(p, encoding='utf-8').read(); s2 = re.sub(pat, rep, s, count=1)
    assert s != s2 or v in s, f'hittade inte mönstret i {f}'; open(p, 'w', encoding='utf-8').write(s2)
sub('index.html', r'const VER="[^"]*"', f'const VER="{v}"')
sub('sw.js', r"const CACHE='[^']*'", f"const CACHE='shqip-{v}'")
j = json.load(open(os.path.join(d, 'version.json'))) if os.path.exists(os.path.join(d, 'version.json')) else {}
j['version'] = v; j['notes'] = notes
if len(sys.argv) > 3: j['apk'] = {'code': int(sys.argv[3]), 'url': 'https://drenicapb.github.io/Spel/app/Shqip.apk'}
json.dump(j, open(os.path.join(d, 'version.json'), 'w'), ensure_ascii=False, indent=1)
print('Klar:', v)
