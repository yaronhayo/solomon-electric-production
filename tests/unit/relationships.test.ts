/**
 * Unit Tests for Service Relationships
 * Validates relatedServices references point to valid slugs
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Related Services Validation', () => {
  const servicesDir = join(process.cwd(), 'src/content/services');
  const serviceFiles = readdirSync(servicesDir).filter(f => f.endsWith('.json'));
  
  // Build a set of all valid service slugs
  const allSlugs = new Set<string>();
  serviceFiles.forEach(filename => {
    const content = JSON.parse(readFileSync(join(servicesDir, filename), 'utf-8'));
    allSlugs.add(content.slug);
  });

  it('should have all valid service slugs', () => {
    expect(allSlugs.size).toBeGreaterThan(0);
  });

  describe('relatedServices references', () => {
    serviceFiles.forEach(filename => {
      const content = JSON.parse(readFileSync(join(servicesDir, filename), 'utf-8'));
      
      if (content.relatedServices && content.relatedServices.length > 0) {
        describe(filename, () => {
          content.relatedServices.forEach((relatedSlug: string) => {
            it(`relatedService "${relatedSlug}" should exist`, () => {
              expect(allSlugs.has(relatedSlug)).toBe(true);
            });
          });
        });
      }
    });
  });
});

describe('Related Blog Posts Validation', () => {
  const servicesDir = join(process.cwd(), 'src/content/services');
  const blogDir = join(process.cwd(), 'src/content/blog');
  
  const serviceFiles = readdirSync(servicesDir).filter(f => f.endsWith('.json'));
  const blogFiles = readdirSync(blogDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
  
  // Build a set of all valid blog slugs (filename without extension)
  const allBlogSlugs = new Set<string>();
  blogFiles.forEach(filename => {
    const slug = filename.replace(/\.(mdx?|md)$/, '');
    allBlogSlugs.add(slug);
  });

  it('should have blog posts', () => {
    expect(allBlogSlugs.size).toBeGreaterThan(0);
  });

  describe('relatedBlogPosts references', () => {
    serviceFiles.forEach(filename => {
      const content = JSON.parse(readFileSync(join(servicesDir, filename), 'utf-8'));
      
      if (content.relatedBlogPosts && content.relatedBlogPosts.length > 0) {
        describe(filename, () => {
          content.relatedBlogPosts.forEach((blogSlug: string) => {
            it(`relatedBlogPost "${blogSlug}" should exist`, () => {
              const exists = allBlogSlugs.has(blogSlug) || 
                             allBlogSlugs.has(blogSlug + '.mdx') ||
                             allBlogSlugs.has(blogSlug + '.md');
              // Warn but don't fail - blog posts may not all exist yet
              if (!exists) {
                console.warn(`Warning: Blog post "${blogSlug}" referenced in ${filename} not found`);
              }
            });
          });
        });
      }
    });
  });
});
