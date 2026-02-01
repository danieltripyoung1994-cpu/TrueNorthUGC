type Variant = 'control' | 'variant';

interface Experiment {
  name: string;
  variant: Variant;
  startedAt: number;
}

const STORAGE_KEY = 'truenorth_experiments';

function getStoredExperiments(): Record<string, Experiment> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function storeExperiment(experiment: Experiment): void {
  try {
    const experiments = getStoredExperiments();
    experiments[experiment.name] = experiment;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
  } catch {
  }
}

export function getVariant(experimentName: string, variantPercentage: number = 50): Variant {
  const experiments = getStoredExperiments();
  
  if (experiments[experimentName]) {
    return experiments[experimentName].variant;
  }
  
  const random = Math.random() * 100;
  const variant: Variant = random < variantPercentage ? 'variant' : 'control';
  
  const experiment: Experiment = {
    name: experimentName,
    variant,
    startedAt: Date.now(),
  };
  
  storeExperiment(experiment);
  
  return variant;
}

export function trackExperimentEvent(experimentName: string, eventName: string, metadata?: Record<string, unknown>): void {
  const experiments = getStoredExperiments();
  const experiment = experiments[experimentName];
  
  if (!experiment) return;
  
  const payload = {
    experimentName,
    variant: experiment.variant,
    eventName,
    metadata,
    timestamp: Date.now(),
    url: window.location.href,
  };
  
  if (import.meta.env.DEV) {
    console.log('%c[A/B Test Event]', 'color: #8b5cf6; font-weight: bold;', payload);
  }
  
  if (import.meta.env.PROD && typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon('/api/analytics/experiment', JSON.stringify(payload));
  }
}

export function useExperiment(experimentName: string, variantPercentage: number = 50): {
  variant: Variant;
  isVariant: boolean;
  isControl: boolean;
  trackEvent: (eventName: string, metadata?: Record<string, unknown>) => void;
} {
  const variant = getVariant(experimentName, variantPercentage);
  
  return {
    variant,
    isVariant: variant === 'variant',
    isControl: variant === 'control',
    trackEvent: (eventName: string, metadata?: Record<string, unknown>) => {
      trackExperimentEvent(experimentName, eventName, metadata);
    },
  };
}

export function getAllExperiments(): Record<string, Experiment> {
  return getStoredExperiments();
}

export function clearExperiments(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}
