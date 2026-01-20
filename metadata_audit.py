
import os
import re
from pathlib import Path
from collections import Counter

dist_dir = Path('dist')
html_files = list(dist_dir.glob('**/*.html'))

metadata = []

for html_file in html_files:
    content = html_file.read_text(errors='ignore')
    
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    title = title_match.group(1) if title_match else "MISSING"
    
    desc_match = re.search(r'<meta name=[\"\']description[\"\'] content=[\"\'](.*?)[\"\']', content, re.IGNORECASE)
    desc = desc_match.group(1) if desc_match else "MISSING"
    
    h1_matches = re.findall(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
    h1_count = len(h1_matches)
    h1_text = h1_matches[0].strip() if h1_count > 0 else "MISSING"
    
    metadata.append({
        'file': str(html_file),
        'title': title,
        'desc': desc,
        'h1': h1_text,
        'h1_count': h1_count
    })

title_counts = Counter(m['title'] for m in metadata if m['title'] != "MISSING")
desc_counts = Counter(m['desc'] for m in metadata if m['desc'] != "MISSING")
h1_counts = Counter(m['h1'] for m in metadata if m['h1'] != "MISSING")

duplicate_titles = [t for t, c in title_counts.items() if c > 1]
duplicate_descs = [d for d, c in desc_counts.items() if c > 1]
duplicate_h1s = [h for h, c in h1_counts.items() if c > 1]

print(f"Total HTML files: {len(html_files)}")
print(f"Duplicate titles found: {len(duplicate_titles)}")
print(f"Duplicate descriptions found: {len(duplicate_descs)}")
print(f"Duplicate H1 tags found: {len(duplicate_h1s)}")

multiple_h1_files = [m['file'] for m in metadata if m['h1_count'] > 1]
missing_h1_files = [m['file'] for m in metadata if m['h1_count'] == 0]

print(f"Files with multiple H1s: {len(multiple_h1_files)}")
print(f"Files with missing H1s: {len(missing_h1_files)}")

if duplicate_titles:
    print("\nTop 5 Duplicate Titles:")
    for t in sorted(duplicate_titles, key=lambda x: title_counts[x], reverse=True)[:5]:
        print(f"- \"{t}\" ({title_counts[t]} occurrences)")

if duplicate_descs:
    print("\nTop 5 Duplicate Descriptions:")
    for d in sorted(duplicate_descs, key=lambda x: desc_counts[x], reverse=True)[:5]:
        print(f"- \"{d}\" ({desc_counts[d]} occurrences)")

if multiple_h1_files:
    print("\nFiles with multiple H1s (first 5):")
    for f in multiple_h1_files[:5]:
        print(f"- {f}")
