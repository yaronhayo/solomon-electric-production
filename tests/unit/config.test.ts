/**
 * Unit Tests for Site Configuration
 * Validates the site.ts config has all required fields
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Site Configuration', () => {
  // Read and parse the config file
  const configPath = join(process.cwd(), 'src/config/site.ts');
  const configContent = readFileSync(configPath, 'utf-8');

  describe('Contact Information', () => {
    it('should have a valid phone number format', () => {
      expect(configContent).toMatch(/formatted:\s*"?\(\d{3}\)\s*\d{3}-\d{4}"?/);
    });

    it('should have an email address', () => {
      expect(configContent).toMatch(/primary:\s*"[^"]+@[^"]+\.[^"]+"/);
    });

    it('should have a complete address', () => {
      expect(configContent).toMatch(/street:/);
      expect(configContent).toMatch(/city:/);
      expect(configContent).toMatch(/state:\s*"FL"/);
      expect(configContent).toMatch(/zip:\s*"\d{5}"/);
    });
  });

  describe('Social Links', () => {
    it('should have valid social media URLs', () => {
      expect(configContent).toMatch(/facebook:\s*"https:\/\/www\.facebook\.com\//);
      expect(configContent).toMatch(/instagram:\s*"https:\/\/www\.instagram\.com\//);
      expect(configContent).toMatch(/yelp:\s*"https:\/\/www\.yelp\.com\//);
      expect(configContent).toMatch(/googleMaps:\s*"https:\/\/maps\.app\.goo\.gl\//);
    });
  });

  describe('License Information', () => {
    it('should have a valid Florida license number', () => {
      expect(configContent).toMatch(/number:\s*"EC\d+"/);
    });
  });

  describe('Business Hours', () => {
    it('should have hours defined for all days', () => {
      expect(configContent).toMatch(/monday:/);
      expect(configContent).toMatch(/tuesday:/);
      expect(configContent).toMatch(/wednesday:/);
      expect(configContent).toMatch(/thursday:/);
      expect(configContent).toMatch(/friday:/);
      expect(configContent).toMatch(/saturday:/);
      expect(configContent).toMatch(/sunday:/);
    });
  });

  describe('SEO Configuration', () => {
    it('should have a valid site URL', () => {
      expect(configContent).toMatch(/siteUrl:\s*"https:\/\//);
    });

    it('should have a default title', () => {
      expect(configContent).toMatch(/defaultTitle:/);
    });

    it('should have a default description', () => {
      expect(configContent).toMatch(/defaultDescription:/);
    });
  });
});
