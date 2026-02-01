import { onCLS, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  if (import.meta.env.DEV) {
    const metricNames: Record<string, string> = {
      CLS: 'Cumulative Layout Shift',
      LCP: 'Largest Contentful Paint',
      TTFB: 'Time to First Byte',
      INP: 'Interaction to Next Paint',
    };
    
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
}

export function initWebVitals() {
  onCLS(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onINP(sendToAnalytics);
}
