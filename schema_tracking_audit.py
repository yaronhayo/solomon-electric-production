
import os
import re
from pathlib import Path
from collections import Counter

dist_dir = Path('dist')
html_files = list(dist_dir.glob('**/*.html'))

report = {
    'total_files': len(html_files),
    'schema': {
        'LocalBusiness': 0,
        'Service': 0,
        'FAQPage': 0,
        'BreadcrumbList': 0,
        'Article': 0 # For blog posts
    },
    'tracking': {
        'gtm_head': 0,
        'gtm_body': 0,
        'cta_tracking': 0,
        'phone_tracking': 0
    },
    'missing_schema': [],
    'missing_tracking': []
}

gtm_id = 'GTM-KQQZXTZ6'

for html_file in html_files:
    content = html_file.read_text(errors='ignore')
    
    # Check Schema
    if '"@type":"LocalBusiness"' in content: report['schema']['LocalBusiness'] += 1
    if '"@type":"Service"' in content: report['schema']['Service'] += 1
    if '"@type":"FAQPage"' in content: report['schema']['FAQPage'] += 1
    if '"@type":"BreadcrumbList"' in content: report['schema']['BreadcrumbList'] += 1
    if '"@type":"Article"' in content: report['schema']['Article'] += 1
    
    # Check Tracking
    if gtm_id in content and '<script' in content: report['tracking']['gtm_head'] += 1
    if gtm_id in content and '<iframe' in content: report['tracking']['gtm_body'] += 1
    if 'data-cta-type' in content: report['tracking']['cta_tracking'] += 1
    if 'tel:' in content and 'data-cta-type="phone_click"' in content: report['tracking']['phone_tracking'] += 1

print(f"Total HTML files: {report['total_files']}")
print("\nSchema Audit:")
for k, v in report['schema'].items():
    print(f"- {k}: {v}")

print("\nTracking Audit:")
for k, v in report['tracking'].items():
    print(f"- {k}: {v}")

# Identify gaps (e.g. any page without GTM)
for html_file in html_files:
    content = html_file.read_text(errors='ignore')
    if gtm_id not in content:
        print(f"Missing GTM: {html_file}")
