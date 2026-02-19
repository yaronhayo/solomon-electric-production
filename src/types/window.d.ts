/**
 * Global Type Definitions for Solomon Electric
 * Provides type safety for GTM, Google Maps, and reCAPTCHA
 */

interface GTMEvent {
  event: string;
  [key: string]: any;
}

interface Window {
  /** Google Tag Manager Data Layer */
  dataLayer: GTMEvent[];
  
  /** Google reCAPTCHA v3 */
  grecaptcha: {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };

  /** Google Maps JavaScript API */
  google: any; // Using any for google for now as it's very large, but defining the presence
}

declare var dataLayer: GTMEvent[];
declare var grecaptcha: {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};
