/**
 * Shared Form Tracking Utility
 * Collects session analytics data for lead notification emails.
 * Used by both BookingForm.astro and contact.astro.
 */

export interface TrackingData {
  sessionStart: string;
  timeOnSite: number;
  currentUrl: string;
  referrer: string;
  clickPath: string;
  userAgent: string;
  deviceType: string;
  screenResolution: string;
  language: string;
  consentTimestamp: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  gclid: string | null;
  trafficSource: string;
  newReturning: string;
}

/**
 * Safe storage access — returns null on error (e.g., Safari private browsing
 * throws QuotaExceededError, or storage is disabled by browser policy).
 */
function safeGet(
  storage: Storage,
  key: string,
): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safe storage write — silently fails in restricted browsing contexts.
 */
function safeSet(
  storage: Storage,
  key: string,
  value: string,
): void {
  try {
    storage.setItem(key, value);
  } catch {
    // Silently fail — private browsing or storage quota exceeded
  }
}

/**
 * Collect all tracking/analytics data from the current session.
 * This data is sent to the PHP backend with a `tracking_` prefix
 * and included in lead notification emails.
 */
export function collectTrackingData(): TrackingData {
  const params = new URLSearchParams(window.location.search);
  const ref = document.referrer.toLowerCase();

  return {
    // Session & timing
    sessionStart:
      safeGet(sessionStorage, "sessionStart") || new Date().toISOString(),
    timeOnSite: Math.round(
      (Date.now() -
        parseInt(
          safeGet(sessionStorage, "sessionStart") || Date.now().toString(),
        )) /
        1000,
    ),

    // Navigation
    currentUrl: window.location.href,
    referrer: document.referrer || "Direct",
    clickPath: safeGet(sessionStorage, "clickPath") || window.location.pathname,

    // Device & browser
    userAgent: navigator.userAgent,
    deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent)
      ? "Mobile"
      : "Desktop",
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,

    // Consent
    consentTimestamp:
      safeGet(localStorage, "cookie-consent-timestamp") || "N/A",

    // Traffic source — UTM params
    utmSource:
      params.get("utm_source") ||
      safeGet(sessionStorage, "utm_source") ||
      "N/A",
    utmMedium:
      params.get("utm_medium") ||
      safeGet(sessionStorage, "utm_medium") ||
      "N/A",
    utmCampaign:
      params.get("utm_campaign") ||
      safeGet(sessionStorage, "utm_campaign") ||
      "N/A",
    gclid:
      params.get("gclid") || safeGet(sessionStorage, "gclid") || null,

    // Traffic source detection
    trafficSource: (() => {
      if (params.get("gclid") || safeGet(sessionStorage, "gclid")) {
        return "Google Ads";
      }
      if (
        ref.includes("business.google.com") ||
        ref.includes("business.google")
      ) {
        return "Google Business Profile";
      }
      if (
        ref.includes("google.com/maps") ||
        ref.includes("maps.google.com")
      ) {
        return "Google Maps";
      }
      if (ref.includes("google.com")) return "Google Organic";
      if (ref.includes("bing.com")) return "Bing Organic";
      if (ref.includes("facebook.com")) return "Facebook";
      if (ref.includes("instagram.com")) return "Instagram";
      if (ref.includes("yelp.com")) return "Yelp";
      if (ref.includes("nextdoor.com")) return "Nextdoor";
      if (ref && !ref.includes(window.location.hostname)) return "Referral";
      return "Direct";
    })(),

    // New vs Returning visitor
    newReturning: (() => {
      const lastVisit = safeGet(localStorage, "lastVisitTimestamp");
      const isReturning = lastVisit !== null;
      safeSet(localStorage, "lastVisitTimestamp", new Date().toISOString());
      return isReturning ? "Returning" : "New";
    })(),
  };
}

/**
 * Convert tracking data object into a flat payload with `tracking_` prefix,
 * suitable for merging into form data before submission.
 */
export function buildTrackingPayload(
  trackingData: TrackingData,
): Record<string, string> {
  const payload: Record<string, string> = {};
  for (const [key, value] of Object.entries(trackingData)) {
    payload[`tracking_${key}`] = value?.toString() || "N/A";
  }
  return payload;
}
