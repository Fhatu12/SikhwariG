type RateEntry = {
  count: number;
  resetAt: number;
};

type RateResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const globalScope = globalThis as unknown as {
  leadRateLimitStore: Map<string, RateEntry> | undefined;
};

const rateStore = globalScope.leadRateLimitStore ?? new Map<string, RateEntry>();

if (!globalScope.leadRateLimitStore) {
  globalScope.leadRateLimitStore = rateStore;
}

export function checkLeadRateLimit(key: string): RateResult {
  const now = Date.now();
  const current = rateStore.get(key);

  if (!current || current.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateStore.set(key, current);

  return { allowed: true, retryAfterSeconds: 0 };
}
