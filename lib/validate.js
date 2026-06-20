// lib/validate.js

// Reserved paths that can't be used as short codes (they'd collide with app routes/api).
const RESERVED = new Set(['api', 'favicon.ico', '_next', 'robots.txt', 'sitemap.xml']);

// Allow letters, numbers, hyphens, underscores. 3-30 chars.
const CODE_PATTERN = /^[a-zA-Z0-9_-]{3,30}$/;

function isValidCode(code) {
  if (!code) return false;
  if (RESERVED.has(code.toLowerCase())) return false;
  return CODE_PATTERN.test(code);
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = { isValidCode, isValidUrl, CODE_PATTERN };
