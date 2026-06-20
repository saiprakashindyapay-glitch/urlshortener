// app/[code]/page.js
import { redirect, notFound } from 'next/navigation';
import { getLink, incrementClicks } from '../../lib/store';

export default async function ShortCodeRedirect({ params }) {
  const { code } = await params;

  const url = await getLink(code);

  if (!url) {
    notFound();
  }

  // Fire-and-forget click tracking; don't block the redirect on it.
  incrementClicks(code).catch(() => {});

  redirect(url);
}
