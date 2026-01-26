/**
 * Global TypeScript declarations for Solomon Electric
 */

// GTM dataLayer type definition
interface DataLayerEvent {
  event?: string;
  [key: string]: unknown;
}

// Extend Window interface for GTM dataLayer
declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
    gtag?: (...args: unknown[]) => void;
    google_tag_manager?: Record<string, unknown>;
  }
}

// Export to make this a module
export {};
