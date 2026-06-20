'use client';

import { useState } from 'react';

export default function Shortener() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setCopied(false);
    setLoading(true);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customCode: customCode || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const longLen = url.length;
  const shortLen = result ? result.shortUrl.length : null;

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="url" className="block font-mono text-xs uppercase tracking-wider text-inksoft mb-2">
            Paste a long link
          </label>
          <input
            id="url"
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/a/very/long/path?with=query&params=everywhere"
            className="w-full bg-transparent border-b-2 border-ink/80 pb-3 text-lg font-mono text-ink placeholder:text-ink/30 focus:outline-none focus:border-clip transition-colors"
          />
        </div>

        <div>
          <label htmlFor="code" className="block font-mono text-xs uppercase tracking-wider text-inksoft mb-2">
            Custom ending <span className="text-ink/40">(optional)</span>
          </label>
          <div className="flex items-stretch border-b-2 border-rule focus-within:border-clip transition-colors">
            <span className="font-mono text-lg text-ink/40 py-3 select-none">/</span>
            <input
              id="code"
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="my-link"
              pattern="[a-zA-Z0-9_-]{3,30}"
              className="flex-1 bg-transparent pb-3 pt-3 text-lg font-mono text-ink placeholder:text-ink/30 focus:outline-none"
            />
          </div>
          <p className="mt-1.5 text-xs text-ink/40">3–30 characters: letters, numbers, hyphens, underscores.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-ink text-paper font-medium px-7 py-3.5 rounded-sm hover:bg-clip transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Cutting it down…' : 'Shorten it'}
        </button>
      </form>

      {error && (
        <div className="mt-5 border-l-2 border-clip pl-4 py-1">
          <p className="font-mono text-sm text-clip">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8 border-t border-rule pt-6">
          {/* The "tape measure" — visualizes the length reduction */}
          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink/40">before</span>
              <span className="font-mono text-[11px] text-ink/40">{longLen} chars</span>
            </div>
            <div className="h-1.5 bg-rule rounded-full overflow-hidden">
              <div className="h-full bg-ink/70 rounded-full" style={{ width: '100%' }} />
            </div>

            <div className="flex justify-between items-baseline mt-4 mb-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-measure">after</span>
              <span className="font-mono text-[11px] text-measure">{shortLen} chars</span>
            </div>
            <div className="h-1.5 bg-rule rounded-full overflow-hidden">
              <div
                className="h-full bg-measure rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(4, Math.min(100, (shortLen / longLen) * 100))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 bg-clipsoft border border-rule rounded-sm px-4 py-3.5">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-lg text-clip font-medium truncate hover:underline"
            >
              {result.shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="shrink-0 font-mono text-xs uppercase tracking-wider bg-ink text-paper px-3.5 py-2 rounded-sm hover:bg-clip transition-colors"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
