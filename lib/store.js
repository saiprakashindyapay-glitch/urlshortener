// lib/store.js
//
// Storage layer for the URL shortener.
//
// In production (deployed on Vercel with a Redis integration connected, e.g.
// the free Upstash Redis Marketplace integration), this uses @upstash/redis,
// which persists reliably across serverless invocations.
//
// In local development (no Redis env vars set), it falls back to a simple
// in-memory Map so you can run `npm run dev` with zero setup. Note: the
// in-memory store resets whenever the dev server restarts.
//
// Vercel's Redis integration sets either of these env var pairs depending on
// integration version — both are checked.
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const hasKV = Boolean(REDIS_URL && REDIS_TOKEN);

let kv;
if (hasKV) {
  // Lazy import so local dev without Redis configured doesn't even try to load it.
  const { Redis } = require('@upstash/redis');
  kv = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
}

// In-memory fallback store (persists only for the life of the server process)
const memoryStore = new Map();

/**
 * Save a mapping from `code` -> `url`. Returns true if saved, false if the
 * code already exists (so callers can avoid overwriting a custom alias).
 */
async function saveLink(code, url) {
  if (hasKV) {
    const existing = await kv.get(`link:${code}`);
    if (existing) return false;
    await kv.set(`link:${code}`, url);
    await kv.set(`clicks:${code}`, 0);
    return true;
  }

  if (memoryStore.has(code)) return false;
  memoryStore.set(code, { url, clicks: 0 });
  return true;
}

/**
 * Look up the original URL for a short code. Returns null if not found.
 */
async function getLink(code) {
  if (hasKV) {
    const url = await kv.get(`link:${code}`);
    return url || null;
  }

  const entry = memoryStore.get(code);
  return entry ? entry.url : null;
}

/**
 * Increment and return the click counter for a code (best-effort, non-blocking
 * for the redirect itself).
 */
async function incrementClicks(code) {
  if (hasKV) {
    await kv.incr(`clicks:${code}`);
    return;
  }

  const entry = memoryStore.get(code);
  if (entry) entry.clicks += 1;
}

async function getClicks(code) {
  if (hasKV) {
    const count = await kv.get(`clicks:${code}`);
    return count || 0;
  }

  const entry = memoryStore.get(code);
  return entry ? entry.clicks : 0;
}

/**
 * Check whether a code already exists.
 */
async function codeExists(code) {
  if (hasKV) {
    const url = await kv.get(`link:${code}`);
    return Boolean(url);
  }
  return memoryStore.has(code);
}

module.exports = {
  saveLink,
  getLink,
  incrementClicks,
  getClicks,
  codeExists,
  usingKV: hasKV,
};
