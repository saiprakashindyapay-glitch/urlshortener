// app/page.js
import Shortener from '../components/Shortener';

export default function Home() {
  return (
    <main className="min-h-screen bg-paper relative overflow-hidden">
      {/* Faint ruler ticks down the left edge — a quiet nod to measuring length */}
      <div className="hidden md:flex absolute left-6 top-0 bottom-0 flex-col justify-between py-24 pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="w-3 h-px bg-ink/15" />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
        <header className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-clip mb-4">
            01 — a url shortener
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-ink mb-5">
            Cut it down
            <br />
            to size.
          </h1>
          <p className="text-inksoft text-lg max-w-md leading-relaxed">
            Paste a long, unwieldy link. Get back something short enough to say out loud —
            with your own ending if you want one.
          </p>
        </header>

        <Shortener />

        <footer className="mt-24 pt-6 border-t border-rule flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <p className="font-mono text-xs text-ink/40">Built with Next.js. Links don&apos;t expire.</p>
          <p className="font-mono text-xs text-ink/40">Yours to host, yours to keep.</p>
        </footer>
      </div>
    </main>
  );
}
