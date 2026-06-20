# Snip — a URL shortener with custom short codes

A small, fast URL shortener built with Next.js. Paste a long link, get a short
one back — optionally with your own custom ending (`yourdomain.com/my-link`
instead of a random code).

## What's inside

- `app/page.js` — homepage with the shortening form
- `components/Shortener.js` — the interactive form (client-side)
- `app/api/shorten/route.js` — API endpoint that creates short links
- `app/[code]/page.js` — handles redirects when someone visits a short link
- `lib/store.js` — storage layer (Redis in production, in-memory for local dev)
- `lib/validate.js` — URL and custom-code validation

## Run it locally

You need [Node.js](https://nodejs.org) 18 or later installed.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without any extra setup, links are stored in
memory — they'll work fine while the dev server is running, and reset if you
restart it. That's expected for local development.

## Put it on GitHub

If you already created an empty repo on GitHub (e.g.
`https://github.com/YOUR_USERNAME/urlshortener`), push this project into it:

```bash
cd urlshortener
git init
git add .
git commit -m "Initial commit: URL shortener"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/urlshortener.git
git push -u origin main
```

If `git push` asks for a password, GitHub no longer accepts your account
password there — use a [personal access token](https://github.com/settings/tokens)
instead, or push via the GitHub Desktop app, or just drag-and-drop all the
files into the repo through GitHub's web "Add file → Upload files" button.

## Deploy it for free (Vercel)

1. Go to https://vercel.com and sign in with your GitHub account.
2. Click **Add New → Project**, then pick your `urlshortener` repo.
3. Leave all settings as default and click **Deploy**. Vercel auto-detects
   Next.js. After a minute or two you'll get a live URL like
   `urlshortener-yourname.vercel.app`.

That's it for a basic deploy — but by default it'll use the in-memory store,
which **resets every time the app cold-starts** (Vercel's serverless
functions don't keep memory between requests reliably). For links that
actually stick around, add free Redis storage:

4. In your Vercel project, go to the **Storage** tab.
5. Click **Marketplace Database Providers**, find **Redis** (the free
   Upstash integration), and create one.
6. Connect it to your project — Vercel automatically sets the right
   environment variables (`KV_REST_API_URL` / `KV_REST_API_TOKEN` or the
   `UPSTASH_REDIS_REST_*` equivalents; this app reads either).
7. Redeploy (Vercel usually does this automatically after connecting
   storage; if not, go to **Deployments** and redeploy the latest one).

After that, your short links persist properly.

## Using a custom domain

Once deployed, go to your Vercel project's **Settings → Domains** and add
your own domain if you have one (e.g. `sn.ip`). Short links will then look
like `sn.ip/my-link` instead of the default `*.vercel.app` address.

## How custom codes work

- Leave the "custom ending" field blank and you get a random 7-character code.
- Type your own (3–30 characters, letters/numbers/hyphens/underscores) and
  the app uses that instead — as long as it's not already taken.
- Codes are case-sensitive and checked for collisions before saving.

## Notes on scale

This is intentionally simple: one Redis key per link, plus a click counter.
It comfortably handles personal or small-team use. If you ever need rate
limiting, link expiration, or analytics beyond a click count, those are
natural next additions to `lib/store.js` and `app/api/shorten/route.js`.
