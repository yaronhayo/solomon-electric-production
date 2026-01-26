/**
 * Enhanced Form Tracking Script
 * Tracks field-level interactions, abandonment, and conversion funnel
 */

// Window interface for dataLayer is defined in src/global.d.ts

// Form field interaction tracking
export function initFormTracking() {
  const forms = document.querySelectorAll("form[data-track-form]");

  forms.forEach((form) => {
    const formName =
      form.getAttribute("data-form-name") || "unnamed_form";
    let formStartTime: number | null = null;
    const fieldInteractions: Record<string, boolean> = {};

    // Track form start (first field interaction)
    const formFields = form.querySelectorAll(
      "input, select, textarea",
    );

    formFields.forEach((field) => {
      const fieldName =
        (field as HTMLInputElement).name || "unnamed_field";

      // Track field focus (form start)
      field.addEventListener("focus", () => {
        if (!formStartTime) {
          formStartTime = Date.now();
          trackEvent("form_start", {
            form_name: formName,
            form_url: window.location.pathname,
          });
        }
      });

      // Track field completion
      field.addEventListener("blur", (e) => {
        const target = e.target as HTMLInputElement;
        const hasValue = target.value.trim().length > 0;

        if (hasValue && !fieldInteractions[fieldName]) {
          fieldInteractions[fieldName] = true;
          trackEvent("form_field_complete", {
            form_name: formName,
            field_name: fieldName,
            field_type: target.type,
          });
        }
      });

      // Track field errors
      field.addEventListener("invalid", (e) => {
        const target = e.target as HTMLInputElement;
        trackEvent("form_field_error", {
          form_name: formName,
          field_name: fieldName,
          error_type: target.validationMessage,
        });
      });
    });

    // Track form submission
    form.addEventListener("submit", () => {
      const timeToComplete = formStartTime
        ? Math.round((Date.now() - formStartTime) / 1000)
        : 0;
      const completedFields = Object.keys(fieldInteractions).length;
      const totalFields = formFields.length;

      trackEvent("form_submit", {
        form_name: formName,
        time_to_complete: timeToComplete,
        completed_fields: completedFields,
        total_fields: totalFields,
        completion_rate: Math.round(
          (completedFields / totalFields) * 100,
        ),
      });
    });

    // Track form abandonment (when user leaves page with incomplete form)
    window.addEventListener("beforeunload", () => {
      if (formStartTime && !form.classList.contains("submitted")) {
        const timeOnForm = Math.round(
          (Date.now() - formStartTime) / 1000,
        );
        const completedFields =
          Object.keys(fieldInteractions).length;
        const totalFields = formFields.length;

        trackEvent("form_abandon", {
          form_name: formName,
          time_on_form: timeOnForm,
          completed_fields: completedFields,
          total_fields: totalFields,
          last_field: Object.keys(fieldInteractions).pop() || "none",
        });
      }
    });
  });
}

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
  });
}

// Video interaction tracking (if videos exist)
export function initVideoTracking() {
  const videos = document.querySelectorAll("video[data-track-video]");

  videos.forEach((video) => {
    const videoElement = video as HTMLVideoElement;
    const videoName =
      video.getAttribute("data-video-name") || "unnamed_video";

    let hasStarted = false;
    let quartiles: Set<number> = new Set();

    videoElement.addEventListener("play", () => {
      if (!hasStarted) {
        hasStarted = true;
        trackEvent("video_start", {
          video_name: videoName,
          page_url: window.location.pathname,
        });
      }
    });

    videoElement.addEventListener("timeupdate", () => {
      const percent = Math.round(
        (videoElement.currentTime / videoElement.duration) * 100,
      );

      [25, 50, 75, 100].forEach((milestone) => {
        if (percent >= milestone && !quartiles.has(milestone)) {
          quartiles.add(milestone);
          trackEvent("video_progress", {
            video_name: videoName,
            progress_percentage: milestone,
          });
        }
      });
    });

    videoElement.addEventListener("ended", () => {
      trackEvent("video_complete", {
        video_name: videoName,
        duration: Math.round(videoElement.duration),
      });
    });
  });
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
  initFormTracking();
  initCTATracking();
  initPhoneTracking();
  initScrollTracking();
  initVideoTracking();
}

// Auto-initialize
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllTracking);
  } else {
    initAllTracking();
  }

  // Re-initialize on Astro page transitions
  document.addEventListener("astro:after-swap", initAllTracking);
}
