/**
 * Enhanced Tracking Script
 * Tracks CTA clicks, phone clicks, and scroll depth via GTM dataLayer
 */

// Window interface for dataLayer is defined in src/global.d.ts

// CTA click tracking
export function initCTATracking() {
  const ctaElements = document.querySelectorAll("[data-cta-type]");

  ctaElements.forEach((cta) => {
    const ctaType = cta.getAttribute("data-cta-type");
    const ctaTarget = cta.getAttribute("data-cta-target") || "";
    const ctaLocation = cta.getAttribute("data-cta-location") || "unknown";

    cta.addEventListener("click", () => {
      trackEvent("cta_click", {
        cta_type: ctaType,
        cta_target: ctaTarget,
        cta_location: ctaLocation,
        page_url: window.location.pathname,
      });
    });
  });
}

// Phone number click tracking
export function initPhoneTracking() {
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

  phoneLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const phoneNumber = link.getAttribute("href")?.replace("tel:", "");
      const location = link.getAttribute("data-cta-location") || "unknown";

      trackEvent("phone_click", {
        phone_number: phoneNumber,
        click_location: location,
        page_url: window.location.pathname,
        referrer: document.referrer || "direct",
        ...getUTMParams(),
      });
    });
  });
}

// Scroll depth tracking
export function initScrollTracking() {
  const milestones = [25, 50, 75, 90, 100];
  const reached: Set<number> = new Set();
  let maxScroll = 0;

  function checkScrollDepth() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollPercent = Math.round(
      ((scrollTop + windowHeight) / documentHeight) * 100,
    );

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;

      // Check milestones
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          trackEvent("scroll_depth", {
            depth_percentage: milestone,
            page_url: window.location.pathname,
          });
        }
      });
    }
  }

  // Throttled scroll listener
  let scrollTimeout: ReturnType<typeof setTimeout>;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(checkScrollDepth, 100);
  }, { passive: true });
}



// Helper functions
function trackEvent(
  eventName: string,
  eventData: Record<string, any> = {},
) {
  // Send to Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString(),
    });
  }

  // Also log in development
  if (import.meta.env.DEV) {
    console.log("[Analytics]", eventName, eventData);
  }
}

function getUTMParams() {
  return {
    utm_source: sessionStorage.getItem("utm_source") || undefined,
    utm_medium: sessionStorage.getItem("utm_medium") || undefined,
    utm_campaign: sessionStorage.getItem("utm_campaign") || undefined,
    gclid: sessionStorage.getItem("gclid") || undefined,
  };
}

// Initialize all tracking on page load
export function initAllTracking() {
  initCTATracking();
  initPhoneTracking();
  initScrollTracking();
}
