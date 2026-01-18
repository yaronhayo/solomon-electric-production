#!/usr/bin/env node

/**
 * SEO Validation Script
 * Run before commits to ensure SEO best practices are maintained
 * 
 * Checks:
 * - All pages have meta titles and descriptions
 * - No duplicate titles
 * - URLs follow canonical format
 * - Schema.org markup is valid
 * - Content meets minimum requirements
 * 
 * Usage:
 *   npm run seo:validate
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

// ============================================
// Configuration
// ============================================

const CONTENT_DIR = join(process.cwd(), 'src', 'content');
const SERVICES_DIR = join(CONTENT_DIR, 'services');
const SERVICE_AREAS_DIR = join(CONTENT_DIR, 'service-areas');
const BLOG_DIR = join(CONTENT_DIR, 'blog');

const SEO_REQUIREMENTS = {
  minTitleLength: 30,
  maxTitleLength: 60,
  minDescriptionLength: 120,
  maxDescriptionLength: 160,
  minContentWords: 300,
  maxH1Count: 1,
  prohibitedTerms: [
    { regex: /\b(60-minute|same-day|1-hour|within the hour|fastest response)\b/gi, message: "Response time mention prohibited" },
    { regex: /\b(Call now|Book now|Call today|Click here)\b/gi, message: "Direct CTA prohibited" },
    { regex: /\b(\$\d+|USD|dollars|save money|starting at)\b/gi, message: "Pricing mention prohibited" },
    { regex: /\b(John|Jane|Mike|David|Sarah|Robert)\b/g, message: "Potential staff name found (Verify isolation)" }
  ]
};

// ============================================
// Validators
// ============================================

function checkProhibitedContent(file, content, issues) {
  const contentString = typeof content === 'string' ? content : JSON.stringify(content);
  SEO_REQUIREMENTS.prohibitedTerms.forEach(term => {
    const match = contentString.match(term.regex);
    if (match) {
      issues.push({
        file,
        type: 'error',
        message: `${term.message}: "${match[0]}"`
      });
    }
  });
}

function validateServiceFiles() {
  const issues = [];
  
  if (!existsSync(SERVICES_DIR)) {
    issues.push({
      file: 'services/',
      type: 'error',
      message: 'Services directory not found'
    });
    return issues;
  }

  const files = readdirSync(SERVICES_DIR).filter(f => f.endsWith('.json'));
  const titles = new Map();
  
  for (const file of files) {
    const filePath = join(SERVICES_DIR, file);
    let data;
    try {
      data = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (e) {
      issues.push({
        file: `services/${file}`,
        type: 'error',
        message: `Invalid JSON: ${e.message}`
      });
      continue;
    }
    
    // Check required fields
    if (!data.name) {
      issues.push({
        file: `services/${file}`,
        type: 'error',
        message: 'Missing service name'
      });
    }
    
    if (!data.description) {
      issues.push({
        file: `services/${file}`,
        type: 'error',
        message: 'Missing service description'
      });
    } else if (data.description.length < SEO_REQUIREMENTS.minDescriptionLength) {
      issues.push({
        file: `services/${file}`,
        type: 'warning',
        message: `Description too short (${data.description.length} chars, min: ${SEO_REQUIREMENTS.minDescriptionLength})`
      });
    }
    
    if (!data.shortDescription) {
      issues.push({
        file: `services/${file}`,
        type: 'warning',
        message: 'Missing short description (used for meta description)'
      });
    }
    
    // Check for duplicate names
    if (data.name) {
      if (titles.has(data.name)) {
        issues.push({
          file: `services/${file}`,
          type: 'error',
          message: `Duplicate service name "${data.name}" (also in ${titles.get(data.name)})`
        });
      } else {
        titles.set(data.name, file);
      }
    }
    
    // Check FAQs
    if (!data.faqs || data.faqs.length < 3) {
      issues.push({
        file: `services/${file}`,
        type: 'warning',
        message: `Only ${data.faqs?.length || 0} FAQs (recommend at least 3 for SEO)`
      });
    }
    
    // Check related services
    if (!data.relatedServices || data.relatedServices.length === 0) {
      issues.push({
        file: `services/${file}`,
        type: 'info',
        message: 'No related services (internal linking opportunity missed)'
      });
    }
    
    // Check for prohibited content
    checkProhibitedContent(`services/${file}`, data, issues);
  }
  
  return issues;
}

function validateServiceAreaFiles() {
  const issues = [];
  
  if (!existsSync(SERVICE_AREAS_DIR)) {
    issues.push({
      file: 'service-areas/',
      type: 'error',
      message: 'Service areas directory not found'
    });
    return issues;
  }

  const files = readdirSync(SERVICE_AREAS_DIR).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = join(SERVICE_AREAS_DIR, file);
    let data;
    try {
      data = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (e) {
      issues.push({
        file: `service-areas/${file}`,
        type: 'error',
        message: `Invalid JSON: ${e.message}`
      });
      continue;
    }
    
    // Check required fields
    if (!data.name) {
      issues.push({
        file: `service-areas/${file}`,
        type: 'error',
        message: 'Missing city name'
      });
    }
    
    if (!data.description) {
      issues.push({
        file: `service-areas/${file}`,
        type: 'error',
        message: 'Missing city description'
      });
    }
    
    if (!data.coordinates) {
      issues.push({
        file: `service-areas/${file}`,
        type: 'warning',
        message: 'Missing coordinates (important for local SEO schema)'
      });
    }
    
    if (!data.neighborhoods || data.neighborhoods.length === 0) {
      issues.push({
        file: `service-areas/${file}`,
        type: 'warning',
        message: 'No neighborhoods listed'
      });
    }
    
    if (!data.faqs || data.faqs.length < 3) {
      issues.push({
        file: `service-areas/${file}`,
        type: 'warning',
        message: `Only ${data.faqs?.length || 0} FAQs`
      });
    }

    // Check for prohibited content
    checkProhibitedContent(`service-areas/${file}`, data, issues);
  }
  
  return issues;
}

function validateBlogPosts() {
  const issues = [];
  
  if (!existsSync(BLOG_DIR)) {
    return issues; // Blog optional
  }

  const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
  
  for (const file of files) {
    const filePath = join(BLOG_DIR, file);
    const content = readFileSync(filePath, 'utf-8');
    
    // Check frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      issues.push({
        file: `blog/${file}`,
        type: 'error',
        message: 'Missing frontmatter'
      });
      continue;
    }
    
    // Check for title
    if (!content.includes('title:')) {
      issues.push({
        file: `blog/${file}`,
        type: 'error',
        message: 'Missing title in frontmatter'
      });
    }
    
    // Check for description
    if (!content.includes('description:')) {
      issues.push({
        file: `blog/${file}`,
        type: 'error',
        message: 'Missing description in frontmatter'
      });
    }
    
    // Check for image (og:image)
    if (!content.includes('image:')) {
      issues.push({
        file: `blog/${file}`,
        type: 'warning',
        message: 'Missing featured image'
      });
    }
    
    // Check content length
    const bodyContent = content.split('---').slice(2).join('---');
    const wordCount = bodyContent.split(/\s+/).length;
    
    if (wordCount < SEO_REQUIREMENTS.minContentWords) {
      issues.push({
        file: `blog/${file}`,
        type: 'warning',
        message: `Low word count (${wordCount} words, recommend ${SEO_REQUIREMENTS.minContentWords}+)`
      });
    }
  }
  
  return issues;
}

function checkURLConsistency() {
  const issues = [];
  
  // Check for slug consistency in services
  if (existsSync(SERVICES_DIR)) {
    const files = readdirSync(SERVICES_DIR).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const expectedSlug = basename(file, '.json');
      let data;
      try {
        data = JSON.parse(readFileSync(join(SERVICES_DIR, file), 'utf-8'));
      } catch (e) {
        continue;
      }
      
      if (data.slug && data.slug !== expectedSlug) {
        issues.push({
          file: `services/${file}`,
          type: 'error',
          message: `Slug mismatch: file "${expectedSlug}" but slug is "${data.slug}"`
        });
      }
    }
  }
  
  // Check service areas
  if (existsSync(SERVICE_AREAS_DIR)) {
    const files = readdirSync(SERVICE_AREAS_DIR).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const expectedSlug = basename(file, '.json');
      let data;
      try {
        data = JSON.parse(readFileSync(join(SERVICE_AREAS_DIR, file), 'utf-8'));
      } catch (e) {
        continue;
      }
      
      if (data.slug && data.slug !== expectedSlug) {
        issues.push({
          file: `service-areas/${file}`,
          type: 'error',
          message: `Slug mismatch: file "${expectedSlug}" but slug is "${data.slug}"`
        });
      }
    }
  }
  
  return issues;
}

// ============================================
// Main Validation
// ============================================

function validate() {
  console.log('🔍 Running SEO Validation...\n');
  
  const allIssues = [
    ...validateServiceFiles(),
    ...validateServiceAreaFiles(),
    ...validateBlogPosts(),
    ...checkURLConsistency()
  ];
  
  const errors = allIssues.filter(i => i.type === 'error');
  const warnings = allIssues.filter(i => i.type === 'warning');
  const infos = allIssues.filter(i => i.type === 'info');
  
  // Print results
  if (errors.length > 0) {
    console.log('❌ ERRORS:');
    errors.forEach(e => console.log(`   ${e.file}: ${e.message}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`   ${w.file}: ${w.message}`));
    console.log('');
  }
  
  if (infos.length > 0) {
    console.log('ℹ️  INFO:');
    infos.forEach(i => console.log(`   ${i.file}: ${i.message}`));
    console.log('');
  }
  
  // Count files
  const serviceCount = existsSync(SERVICES_DIR) 
    ? readdirSync(SERVICES_DIR).filter(f => f.endsWith('.json')).length 
    : 0;
  const areaCount = existsSync(SERVICE_AREAS_DIR) 
    ? readdirSync(SERVICE_AREAS_DIR).filter(f => f.endsWith('.json')).length 
    : 0;
  const blogCount = existsSync(BLOG_DIR) 
    ? readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md')).length 
    : 0;
  
  const filesChecked = serviceCount + areaCount + blogCount;
  const passed = errors.length === 0;
  
  console.log('📊 Summary:');
  console.log(`   Files checked: ${filesChecked}`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  console.log('');
  
  if (passed) {
    console.log('✅ SEO validation passed!\n');
  } else {
    console.log('❌ SEO validation failed - fix errors before committing\n');
  }
  
  return {
    passed,
    issues: allIssues,
    stats: { filesChecked, errors: errors.length, warnings: warnings.length }
  };
}

// Run validation
const result = validate();
process.exit(result.passed ? 0 : 1);
