import { onCLS, onLCP, onTTFB, onINP, onFCP, type Metric } from 'web-vitals';

interface PerformanceMetrics {
  CLS: number | null;
  LCP: number | null;
  TTFB: number | null;
  INP: number | null;
  FCP: number | null;
}

const collectedMetrics: PerformanceMetrics = {
  CLS: null,
  LCP: null,
  TTFB: null,
  INP: null,
  FCP: null,
};

const metricNames: Record<string, string> = {
  CLS: 'Cumulative Layout Shift',
  LCP: 'Largest Contentful Paint',
  TTFB: 'Time to First Byte',
  INP: 'Interaction to Next Paint',
  FCP: 'First Contentful Paint',
};

function sendToAnalytics(metric: Metric) {
  collectedMetrics[metric.name as keyof PerformanceMetrics] = metric.value;
  
  if (import.meta.env.DEV) {
    console.log(
      `%c[Web Vitals] ${metricNames[metric.name] || metric.name}`,
      'color: #ec4899; font-weight: bold;',
      {
        name: metric.name,
        value: metric.value.toFixed(2),
        rating: metric.rating,
        delta: metric.delta.toFixed(2),
        id: metric.id,
      }
    );
  }
  
  if (import.meta.env.PROD && typeof navigator.sendBeacon === 'function') {
    const analyticsEndpoint = '/api/analytics/vitals';
    const payload = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      url: window.location.href,
      timestamp: Date.now(),
    });
    
    navigator.sendBeacon(analyticsEndpoint, payload);
  }
}

export function initWebVitals() {
  onCLS(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onINP(sendToAnalytics);
  onFCP(sendToAnalytics);
}

export function getCollectedMetrics(): PerformanceMetrics {
  return { ...collectedMetrics };
}

export function getPerformanceScore(): { score: number; rating: 'good' | 'needs-improvement' | 'poor' } {
  const { LCP, CLS, INP } = collectedMetrics;
  
  if (LCP === null || CLS === null) {
    return { score: 0, rating: 'poor' };
  }
  
  let score = 100;
  
  if (LCP > 4000) score -= 40;
  else if (LCP > 2500) score -= 20;
  
  if (CLS > 0.25) score -= 30;
  else if (CLS > 0.1) score -= 15;
  
  if (INP !== null) {
    if (INP > 500) score -= 30;
    else if (INP > 200) score -= 15;
  }
  
  const rating = score >= 80 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor';
  
  return { score: Math.max(0, score), rating };
}
