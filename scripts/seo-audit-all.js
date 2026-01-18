import { readFileSync, readdirSync, lstatSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '../dist');

/**
 * Deep Audit for SEO Compliance
 * Checks all HTML files in dist/ for meta tags, canonicals, and schema
 */
async function runAudit() {
  console.log('🔍 Starting Deep SEO Audit of all generated pages...\n');
  
  if (!existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Please run npm run build first.');
    process.exit(1);
  }

  const results = {
    total: 0,
    missingTitle: [],
    missingDescription: [],
    missingCanonical: [],
    missingSchema: [],
    errors: 0
  };

  function walkDir(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
      const path = join(dir, file);
      if (lstatSync(path).isDirectory()) {
        walkDir(path);
      } else if (file.endsWith('.html')) {
        auditFile(path);
      }
    }
  }

  function auditFile(filePath) {
    results.total++;
    const content = readFileSync(filePath, 'utf8');
    const relativePath = filePath.replace(DIST_DIR, '');
    
    let hasTitle = /<title>/.test(content);
    let hasDescription = /<meta name="description"/.test(content);
    let hasCanonical = /<link rel="canonical"/.test(content);
    let hasSchema = /<script type="application\/ld\+json"/.test(content);

    if (!hasTitle) {
      results.missingTitle.push(relativePath);
      results.errors++;
    }
    if (!hasDescription) {
      results.missingDescription.push(relativePath);
      results.errors++;
    }
    if (!hasCanonical) {
      results.missingCanonical.push(relativePath);
      results.errors++;
    }
    if (!hasSchema) {
      results.missingSchema.push(relativePath);
      results.errors++;
    }

    if (results.total % 100 === 0) {
      process.stdout.write(`Checked ${results.total} pages...\r`);
    }
  }

  walkDir(DIST_DIR);
  console.log(`\n\n✅ Audit Complete! Checked ${results.total} pages.`);
  console.log(`❌ Errors found: ${results.errors}`);

  if (results.errors > 0) {
    console.log('\nDetailed Breakdown:');
    if (results.missingTitle.length > 0) console.log(`- Missing Title: ${results.missingTitle.length} pages`);
    if (results.missingDescription.length > 0) console.log(`- Missing Description: ${results.missingDescription.length} pages`);
    if (results.missingCanonical.length > 0) console.log(`- Missing Canonical: ${results.missingCanonical.length} pages`);
    if (results.missingSchema.length > 0) console.log(`- Missing Schema: ${results.missingSchema.length} pages`);
    
    // Print first 5 errors of each type for debugging
    console.log('\nSample Errors:');
    if (results.missingTitle.length > 0) console.log('Title:', results.missingTitle.slice(0, 5));
    if (results.missingDescription.length > 0) console.log('Desc:', results.missingDescription.slice(0, 5));
  } else {
    console.log('\n⭐ 100% SEO Compliance Verified for all pages!');
  }
}

runAudit().catch(console.error);
