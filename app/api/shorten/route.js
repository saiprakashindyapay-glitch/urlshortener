// app/api/shorten/route.js
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { saveLink, codeExists } from '../../../lib/store';
import { isValidCode, isValidUrl } from '../../../lib/validate';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { url, customCode } = body || {};

  if (!url || !isValidUrl(url)) {
    return NextResponse.json(
      { error: 'Please provide a valid URL, including http:// or https://.' },
      { status: 400 }
    );
  }

  let code = customCode?.trim();

  if (code) {
    if (!isValidCode(code)) {
      return NextResponse.json(
        {
          error:
            'Custom code must be 3-30 characters and contain only letters, numbers, hyphens, or underscores.',
        },
        { status: 400 }
      );
    }
    const taken = await codeExists(code);
    if (taken) {
      return NextResponse.json(
        { error: 'That custom code is already taken. Try another.' },
        { status: 409 }
      );
    }
  } else {
    // Generate a random code, retrying on the rare collision.
    let attempts = 0;
    do {
      code = nanoid(7);
      attempts += 1;
    } while ((await codeExists(code)) && attempts < 5);
  }

  const saved = await saveLink(code, url);
  if (!saved) {
    return NextResponse.json(
      { error: 'That custom code is already taken. Try another.' },
      { status: 409 }
    );
  }

  const origin = request.headers.get('origin') || new URL(request.url).origin;

  return NextResponse.json({
    code,
    shortUrl: `${origin}/${code}`,
    originalUrl: url,
  });
}
