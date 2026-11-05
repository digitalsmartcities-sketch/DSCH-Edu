// ===========================================
// Lightweight in-memory rate limiter
// ===========================================
// The platform runs a single Node instance, so an in-memory window is enough
// to throttle login attempts, OTP requests and form spam. If the backend is
// scaled horizontally this should be replaced with a shared store (Redis).

const buckets = new Map();

/**
 * Removes expired buckets so the map cannot grow indefinitely.
 */
const sweep = () => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) {
            buckets.delete(key);
        }
    }
};

// Sweep roughly once a minute.
const sweepTimer = setInterval(sweep, 60 * 1000);
sweepTimer.unref?.();

/**
 * @param {string} key      Bucket identifier (usually ip + route).
 * @param {number} limit    Maximum number of requests inside the window.
 * @param {number} windowMs Window size in milliseconds.
 * @returns {{allowed: boolean, remaining: number, retryAfterSeconds: number}}
 */
export const consumeRateLimit = (key, limit = 10, windowMs = 60 * 1000) => {
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1, retryAfterSeconds: Math.ceil(windowMs / 1000) };
    }

    bucket.count += 1;

    if (bucket.count > limit) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        };
    }

    return {
        allowed: true,
        remaining: Math.max(0, limit - bucket.count),
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
};

/**
 * Checks a bucket without incrementing it.
 *
 * @param {string} key      Bucket identifier (usually ip + route).
 * @param {number} limit    Maximum number of requests inside the window.
 * @param {number} windowMs Window size in milliseconds.
 * @returns {{allowed: boolean, remaining: number, retryAfterSeconds: number}}
 */
export const peekRateLimit = (key, limit = 10, windowMs = 60 * 1000) => {
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        return { allowed: true, remaining: limit, retryAfterSeconds: Math.ceil(windowMs / 1000) };
    }

    if (bucket.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        };
    }

    return {
        allowed: true,
        remaining: Math.max(0, limit - bucket.count),
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
};

/**
 * Express middleware that answers with `429` when the limit is exceeded.
 *
 * Every request is counted against the caller's IP. When `identifier` is
 * provided (for example the submitted email address) the request is counted
 * against a second bucket as well. That way a single account can not be
 * brute forced from many machines, and one machine can not spam many accounts.
 */
export const rateLimit = (options = {}) => {
    const {
        limit = 30,
        windowMs = 60 * 1000,
        keyPrefix = "general",
        message,
        identifier,
    } = options;

    return (req, res, next) => {
        const ip = req.ip || req.socket?.remoteAddress || "unknown";
        const extra = typeof identifier === "function" ? identifier(req) : undefined;

        const keys = [`${keyPrefix}:ip:${ip}`];
        if (extra) {
            keys.push(`${keyPrefix}:id:${String(extra).trim().toLowerCase()}`);
        }

        let blocked = null;
        let remaining = limit;

        for (const key of keys) {
            const result = consumeRateLimit(key, limit, windowMs);
            remaining = Math.min(remaining, result.remaining);

            if (!result.allowed) {
                blocked = result;
                break;
            }
        }

        res.setHeader("X-RateLimit-Limit", String(limit));
        res.setHeader("X-RateLimit-Remaining", String(remaining));

        if (blocked) {
            res.setHeader("Retry-After", String(blocked.retryAfterSeconds));
            return res.status(429).json({
                success: false,
                message: message || "Too many requests. Please try again later.",
            });
        }

        return next();
    };
};

/**
 * Rate limiter for authentication endpoints.
 *
 * Unlike `rateLimit`, requests are only counted after they fail with a 4xx
 * response. Successful logins do not consume the quota, so legitimate users
 * are not locked out by their own successful sign-ins.
 */
export const loginRateLimit = (options = {}) => {
    const {
        limit = 10,
        windowMs = 15 * 60 * 1000,
        keyPrefix = "login",
        message,
        identifier,
    } = options;

    return (req, res, next) => {
        const ip = req.ip || req.socket?.remoteAddress || "unknown";
        const extra = typeof identifier === "function" ? identifier(req) : undefined;

        const keys = [`${keyPrefix}:ip:${ip}`];
        if (extra) {
            keys.push(`${keyPrefix}:id:${String(extra).trim().toLowerCase()}`);
        }

        let blocked = null;
        let remaining = limit;

        for (const key of keys) {
            const result = peekRateLimit(key, limit, windowMs);
            remaining = Math.min(remaining, result.remaining);

            if (!result.allowed) {
                blocked = result;
                break;
            }
        }

        res.setHeader("X-RateLimit-Limit", String(limit));
        res.setHeader("X-RateLimit-Remaining", String(remaining));

        if (blocked) {
            res.setHeader("Retry-After", String(blocked.retryAfterSeconds));
            return res.status(429).json({
                success: false,
                message: message || "Too many requests. Please try again later.",
            });
        }

        // Count the attempt only when authentication actually fails. Server
        // errors (5xx) are not the caller's fault and are left uncounted.
        res.on("finish", () => {
            if (res.statusCode < 400 || res.statusCode >= 500) {
                return;
            }

            for (const key of keys) {
                consumeRateLimit(key, limit, windowMs);
            }
        });

        return next();
    };
};

/**
 * Returns the email address of the request body in a normalised form.
 * Used as the second bucket of the rate limiter.
 */
export const emailIdentifier = (req) => {
    const email = req?.body?.email;
    return typeof email === "string" ? email.trim().toLowerCase() : undefined;
};
