// app/not-found.js
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-6">
      <div className="text-center max-w-md">
        <p className="text-sm font-mono text-emerald-400 mb-2">404</p>
        <h1 className="text-2xl font-semibold mb-3">This link doesn&apos;t exist</h1>
        <p className="text-slate-400 mb-6">
          The short link you followed doesn&apos;t point to anything — it may have been mistyped
          or never created.
        </p>
        <a
          href="/"
          className="inline-block bg-emerald-500 text-slate-950 font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-400 transition-colors"
        >
          Create a short link
        </a>
      </div>
    </div>
  );
}
