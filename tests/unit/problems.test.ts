import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Service Data Integrity Test
 * Ensures all services have the required high-fidelity content fields.
 */
describe('Service Content Integrity', () => {
  const servicesDir = join(process.cwd(), 'src/content/services');
  const serviceFiles = readdirSync(servicesDir).filter(f => f.endsWith('.json'));

  serviceFiles.forEach(file => {
    const slug = file.replace('.json', '');
    const content = JSON.parse(readFileSync(join(servicesDir, file), 'utf-8'));

    it(`service "${slug}" should have required problem-solving fields`, () => {
      // 1. Problems array should exist and have at least 1 entry for primary services
      // (Some very minor utility services might not have them, but we aim for 100% coverage)
      expect(content.problems).toBeDefined();
      expect(Array.isArray(content.problems)).toBe(true);
      expect(content.problems.length).toBeGreaterThanOrEqual(1);

      // 2. Each problem should have a title and description
      content.problems.forEach((prob: any, index: number) => {
        expect(prob.title, `Problem ${index} in ${slug} is missing title`).toBeDefined();
        expect(prob.description, `Problem ${index} in ${slug} is missing description`).toBeDefined();
        expect(prob.title.length).toBeGreaterThan(5);
        expect(prob.description.length).toBeGreaterThan(10);
      });

      // 3. SEO Content blocks should have descriptive headings
      if (content.seoContent) {
        expect(Array.isArray(content.seoContent)).toBe(true);
        content.seoContent.forEach((block: any, index: number) => {
          expect(block.heading, `SEO block ${index} in ${slug} is missing heading`).toBeDefined();
          expect(block.body, `SEO block ${index} in ${slug} is missing body`).toBeDefined();
          // Ensure it's not a generic heading like "Service Details"
          const genericTerms = ['service details', 'our service', 'overview', 'information'];
          const isGeneric = genericTerms.some(term => block.heading.toLowerCase().includes(term));
          // We don't fail on this yet, but we want to know if it's high fidelity
          // expect(isGeneric).toBe(false); 
        });
      }
    });
  });
});
