
import os
import re
from pathlib import Path

dist_dir = Path('dist')
html_files = list(dist_dir.glob('**/*.html'))

service_pages = [f for f in html_files if 'services/' in str(f) and f.name == 'index.html']
blog_pages = [f for f in html_files if 'blog/' in str(f) and f.name == 'index.html' and f.parent.name != 'blog']
area_pages = [f for f in html_files if 'service-areas/' in str(f) and f.name == 'index.html']

print(f"Service pages: {len(service_pages)}")
print(f"Blog pages: {len(blog_pages)}")
print(f"Area pages: {len(area_pages)}")

def check_schema(file_path, schema_type):
    content = file_path.read_text(errors='ignore')
    return f'"@type":"{schema_type}"' in content

print("\n--- Service Page Audit (Service, LocalBusiness, FAQPage, BreadcrumbList) ---")
for f in service_pages[:5]: # Sample 5
    missing = []
    if not check_schema(f, 'Service'): missing.append('Service')
    if not check_schema(f, 'LocalBusiness'): missing.append('LocalBusiness')
    if not check_schema(f, 'FAQPage'): missing.append('FAQPage')
    if not check_schema(f, 'BreadcrumbList'): missing.append('BreadcrumbList')
    
    if missing:
        print(f"File {f} is missing: {', '.join(missing)}")
    else:
        print(f"File {f}: ALL PRESENT")

print("\n--- Blog Page Audit (Article, BreadcrumbList) ---")
for f in blog_pages[:5]:
    missing = []
    if not check_schema(f, 'Article'): missing.append('Article')
    if not check_schema(f, 'BreadcrumbList'): missing.append('BreadcrumbList')
    
    if missing:
        print(f"File {f} is missing: {', '.join(missing)}")
    else:
        print(f"File {f}: ALL PRESENT")
