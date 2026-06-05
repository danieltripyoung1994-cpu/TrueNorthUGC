declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    ttq?: {
      track: (event: string, data?: Record<string, any>) => void;
    };
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, any>,
  platforms: ("ga4" | "meta" | "tiktok")[] = ["ga4"]
) {
  try {
    // Google Analytics 4
    if (platforms.includes("ga4") && window.gtag) {
      window.gtag("event", eventName, params);
    }

    // Meta Pixel
    if (platforms.includes("meta") && window.fbq) {
      window.fbq("track", eventName, params);
    }

    // TikTok Pixel
    if (platforms.includes("tiktok") && window.ttq) {
      window.ttq.track(eventName, params);
    }

    // Also send to our own analytics endpoint
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics/event",
        JSON.stringify({ event: eventName, params, timestamp: Date.now() })
      );
    }
  } catch (e) {
    // Silently fail analytics
  }
}

export function trackConversion(
  name: string,
  value?: number,
  currency: string = "CAD"
) {
  trackEvent(name, { value, currency }, ["ga4", "meta"]);
}

export function trackSignup(role: "creator" | "brand") {
  trackEvent("signup", { role }, ["ga4", "meta", "tiktok"]);
  trackConversion("signup_complete", role === "brand" ? 199 : 0);
}

export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path, page_location: window.location.href });
}

export function trackCreatorDiscovery(creatorId: string, creatorName: string) {
  trackEvent("creator_discover", { creator_id: creatorId, creator_name: creatorName });
}

export function trackCampaignView(campaignId: number, campaignTitle: string) {
  trackEvent("campaign_view", { campaign_id: campaignId, campaign_title: campaignTitle });
}

export function trackCTAClick(ctaName: string, location: string) {
  trackEvent("cta_click", { cta_name: ctaName, location });
}

export function trackSearch(query: string, results: number) {
  trackEvent("search", { search_term: query, results_count: results });
}

export function trackProfileCompletion(step: number, total: number) {
  trackEvent("profile_progress", { step, total, percent: Math.round((step / total) * 100) });
}

export function trackPaymentInitiated(amount: number, currency: string = "CAD") {
  trackEvent("payment_initiated", { value: amount, currency });
}

export function trackPaymentCompleted(amount: number, currency: string = "CAD") {
  trackConversion("purchase", amount, currency);
}

export function trackContactFormSubmit(type: string) {
  trackEvent("contact_submit", { contact_type: type });
  trackConversion("lead_generated");
}
