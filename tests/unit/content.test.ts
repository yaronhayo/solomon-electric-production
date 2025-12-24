/**
 * Unit Tests for Content Collections
 * Validates service JSON files have required fields
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Service Content Collection', () => {
  const servicesDir = join(process.cwd(), 'src/content/services');
  const serviceFiles = readdirSync(servicesDir).filter(f => f.endsWith('.json'));

  it('should have service files', () => {
    expect(serviceFiles.length).toBeGreaterThan(0);
  });

  describe('Service Schema Validation', () => {
    serviceFiles.forEach(filename => {
      describe(filename, () => {
        const content = JSON.parse(readFileSync(join(servicesDir, filename), 'utf-8'));

        it('should have required basic fields', () => {
          expect(content).toHaveProperty('name');
          expect(content).toHaveProperty('slug');
          expect(content).toHaveProperty('description');
          expect(content).toHaveProperty('shortDescription');
          expect(content).toHaveProperty('icon');
          expect(content).toHaveProperty('category');
        });

        it('should have a valid category', () => {
          const validCategories = [
            'Electrical Panels & Power Systems',
            'Emergency Electrical Services',
            'EV Charging & Solar',
            'Outlets, Switches & Wiring',
            'Lighting & Smart Home',
            'Commercial & Inspections'
          ];
          expect(validCategories).toContain(content.category);
        });

        it('should have features array', () => {
          expect(Array.isArray(content.features)).toBe(true);
          expect(content.features.length).toBeGreaterThan(0);
        });

        it('should have an order number', () => {
          expect(typeof content.order).toBe('number');
        });
      });
    });
  });
});

describe('FAQ Content Collection', () => {
  const faqsDir = join(process.cwd(), 'src/content/faqs');
  const faqFiles = readdirSync(faqsDir).filter(f => f.endsWith('.json'));

  it('should have FAQ files', () => {
    expect(faqFiles.length).toBeGreaterThan(0);
  });

  faqFiles.forEach(filename => {
    describe(filename, () => {
      const content = JSON.parse(readFileSync(join(faqsDir, filename), 'utf-8'));

      it('should have required fields', () => {
        expect(content).toHaveProperty('id');
        expect(content).toHaveProperty('question');
        expect(content).toHaveProperty('answer');
        expect(content).toHaveProperty('category');
      });

      it('should have non-empty question and answer', () => {
        expect(content.question.length).toBeGreaterThan(10);
        expect(content.answer.length).toBeGreaterThan(20);
      });
    });
  });
});

describe('Reviews Content Collection', () => {
  const reviewsDir = join(process.cwd(), 'src/content/reviews');
  const reviewFiles = readdirSync(reviewsDir).filter(f => f.endsWith('.json'));

  it('should have review files', () => {
    expect(reviewFiles.length).toBeGreaterThan(0);
  });

  reviewFiles.forEach(filename => {
    describe(filename, () => {
      const content = JSON.parse(readFileSync(join(reviewsDir, filename), 'utf-8'));

      it('should have required fields', () => {
        expect(content).toHaveProperty('id');
        expect(content).toHaveProperty('author');
        expect(content).toHaveProperty('rating');
        expect(content).toHaveProperty('text');
      });

      it('should have a valid rating (1-5)', () => {
        expect(content.rating).toBeGreaterThanOrEqual(1);
        expect(content.rating).toBeLessThanOrEqual(5);
      });
    });
  });
});
