import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test file patterns
    include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
    
    // Environment
    environment: 'node',
    
    // Globals (like describe, it, expect)
    globals: true,
    
    // Coverage settings
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'tests/']
    },
    
    // Timeout for tests
    testTimeout: 10000,
  },
});
