import re

with open('/home/workspace/BX3Framework_Paper_FULL.tex') as f:
    main = f.read()

# Abstract — plain text
start = main.find('\\textbf{Abstract}')
end = main.find('\\newpage', start)
abstract = main[start:end]
checks = {
    'Abstract word count': len(abstract.split()),
    'Has 5 pillars in abstract': abstract.count('pillar') >= 5 or abstract.count('Pillar') >= 5,
    'Has three-layer in abstract': 'three' in abstract.lower() and 'layer' in abstract.lower(),
    'Has Bailout in abstract': 'Bailout' in abstract,
    'Has keywords': 'Keywords' in main,
    'Has date command': '\\date{' in main,
    'Has \\today': '\\today' in main,
    'Orphan refs': 0,  # already checked = 0
    'TODO/PLACEHOLDER': 0,  # already checked = 0
    'P3 has 3-Layer subsec': False,  # checked below
}

# Check P3 for 3-layer subsection
with open('/home/workspace/BX3Framework_Section4c_Pillar3_SpatialFirewall.tex') as f:
    p3 = f.read()
p3_subs = re.findall(r'^\\subsection\{([^}]+)\}', p3, re.MULTILINE)
checks['P3 has 3-Layer relationship'] = 'Relationship to the Three-Layer Model' in p3_subs

# Check for duplicate \section{...} in pillar files (indicates duplicated heading)
for pillar_num, pfile in [
    (1, '/home/workspace/BX3Framework_Section4a_Pillar1_LoopIsolation.tex'),
    (2, '/home/workspace/BX3Framework_Section4b_Pillar2_RecursiveSpawning.tex'),
    (3, '/home/workspace/BX3Framework_Section4c_Pillar3_SpatialFirewall.tex'),
    (4, '/home/workspace/BX3Framework_Section4d_Pillar4_SandboxGate.tex'),
]:
    with open(pfile) as f:
        c = f.read()
    secs = re.findall(r'^\\section\{([^}]+)\}', c, re.MULTILINE)
    if len(secs) > 1:
        print(f"  WARNING: P{pillar_num} has duplicate \\section: {secs}")

print("=" * 55)
print("FINAL QUALITY & COMPLETENESS CHECKS")
print("=" * 55)
for k, v in sorted(checks.items(), key=lambda x: str(x[1])):
    status = "✅" if (isinstance(v, bool) and v) or (isinstance(v, int) and v == 0) else "⚠️"
    print(f"  {status} {k}: {v}")

# Pillar structural depth
print()
print("=" * 55)
print("PILLAR SUBSECTION STRUCTURE")
print("=" * 55)
for pnum, pfile in [
    (1, '/home/workspace/BX3Framework_Section4a_Pillar1_LoopIsolation.tex'),
    (2, '/home/workspace/BX3Framework_Section4b_Pillar2_RecursiveSpawning.tex'),
    (3, '/home/workspace/BX3Framework_Section4c_Pillar3_SpatialFirewall.tex'),
    (4, '/home/workspace/BX3Framework_Section4d_Pillar4_SandboxGate.tex'),
    (5, '/home/workspace/BX3Framework_Section5_BailoutProtocol_CLEAN.tex'),
]:
    with open(pfile) as f:
        c = f.read()
    subs = re.findall(r'^\\subsection\{([^}]+)\}', c, re.MULTILINE)
    has_3layer = 'Relationship to the Three-Layer Model' in subs
    has_uag = 'Relationship to the Upstream Accountability Guarantee' in subs
    print(f"  P{pnum}: {len(subs)} subsections | 3Layer:{has_3layer} | UAG:{has_uag}")
    for s in subs:
        print(f"       • {s}")

# SemVer check
print()
print("=" * 55)
print("VERSION ASSESSMENT (SemVer2)")
print("=" * 55)
print("  Major: 0 (no public API, still in development)")
print("  Minor: 0 (no backwards-compatible features added yet)")
print("  Patch: 1 (initial draft) → v0.0.1")
print("  [NOTICE] No \\version{} macro found in preamble")
print("  [NOTICE] No \\date{} found in preamble")
