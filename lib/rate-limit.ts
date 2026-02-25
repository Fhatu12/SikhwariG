type RateEntry = {
  count: number;
  resetAt: number;
};

type GenericRateResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type AdminLoginRateResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  reason: "ip_window" | "username_window" | "ip_lockout" | null;
};

const globalScope = globalThis as unknown as {
  leadSubmissionRateLimitStore: Map<string, RateEntry> | undefined;
  adminIpWindowStore: Map<string, RateEntry> | undefined;
  adminUsernameWindowStore: Map<string, RateEntry> | undefined;
  adminIpHourStore:
    | Map<string, { count: number; resetAt: number; lockedUntil: number }>
    | undefined;
};

const leadSubmissionRateStore =
  globalScope.leadSubmissionRateLimitStore ?? new Map<string, RateEntry>();
const adminIpWindowStore = globalScope.adminIpWindowStore ?? new Map<string, RateEntry>();
const adminUsernameWindowStore =
  globalScope.adminUsernameWindowStore ?? new Map<string, RateEntry>();
const adminIpHourStore =
  globalScope.adminIpHourStore ??
  new Map<string, { count: number; resetAt: number; lockedUntil: number }>();

if (!globalScope.leadSubmissionRateLimitStore) {
  globalScope.leadSubmissionRateLimitStore = leadSubmissionRateStore;
}

if (!globalScope.adminIpWindowStore) {
  globalScope.adminIpWindowStore = adminIpWindowStore;
}

if (!globalScope.adminUsernameWindowStore) {
  globalScope.adminUsernameWindowStore = adminUsernameWindowStore;
}

if (!globalScope.adminIpHourStore) {
  globalScope.adminIpHourStore = adminIpHourStore;
}

const TEN_MINUTES_MS = 10 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

const ADMIN_MAX_ATTEMPTS_PER_10_MINUTES = 5;
const ADMIN_LOCKOUT_THRESHOLD_PER_HOUR = 15;
const ADMIN_LOCKOUT_DURATION_MS = ONE_HOUR_MS;

const LEAD_MAX_SUBMISSIONS_PER_HOUR = 5;

function incrementWindow(store: Map<string, RateEntry>, key: string, windowMs: number) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return entry;
  }

  const updated = {
    count: current.count + 1,
    resetAt: current.resetAt,
  };
  store.set(key, updated);
  return updated;
}

function toDeniedResult(resetAt: number): GenericRateResult {
  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
  };
}

export function checkLeadSubmissionRateLimit(ipAddress: string): GenericRateResult {
  const key = ipAddress || "unknown";
  const entry = incrementWindow(leadSubmissionRateStore, key, ONE_HOUR_MS);

  if (entry.count > LEAD_MAX_SUBMISSIONS_PER_HOUR) {
    return toDeniedResult(entry.resetAt);
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

type AdminLoginLimitInput = {
  ipAddress: string;
  username?: string;
};

export function checkAdminLoginRateLimit({
  ipAddress,
  username,
}: AdminLoginLimitInput): AdminLoginRateResult {
  const now = Date.now();
  const ipKey = ipAddress || "unknown";

  const hourState = adminIpHourStore.get(ipKey);
  const defaultHourState = {
    count: 0,
    resetAt: now + ONE_HOUR_MS,
    lockedUntil: 0,
  };

  const activeHourState = !hourState
    ? defaultHourState
    : hourState.lockedUntil > now
      ? { ...hourState }
      : hourState.resetAt <= now
        ? defaultHourState
        : { ...hourState };

  if (activeHourState.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((activeHourState.lockedUntil - now) / 1000)),
      reason: "ip_lockout",
    };
  }

  activeHourState.count += 1;
  if (activeHourState.count > ADMIN_LOCKOUT_THRESHOLD_PER_HOUR) {
    activeHourState.lockedUntil = now + ADMIN_LOCKOUT_DURATION_MS;
    adminIpHourStore.set(ipKey, activeHourState);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(ADMIN_LOCKOUT_DURATION_MS / 1000)),
      reason: "ip_lockout",
    };
  }
  adminIpHourStore.set(ipKey, activeHourState);

  const ipWindowEntry = incrementWindow(adminIpWindowStore, ipKey, TEN_MINUTES_MS);
  if (ipWindowEntry.count > ADMIN_MAX_ATTEMPTS_PER_10_MINUTES) {
    return {
      ...toDeniedResult(ipWindowEntry.resetAt),
      reason: "ip_window",
    };
  }

  const normalizedUsername = (username ?? "").trim().toLowerCase();
  if (normalizedUsername) {
    const usernameEntry = incrementWindow(
      adminUsernameWindowStore,
      normalizedUsername,
      TEN_MINUTES_MS
    );
    if (usernameEntry.count > ADMIN_MAX_ATTEMPTS_PER_10_MINUTES) {
      return {
        ...toDeniedResult(usernameEntry.resetAt),
        reason: "username_window",
      };
    }
  }

  return { allowed: true, retryAfterSeconds: 0, reason: null };
}
