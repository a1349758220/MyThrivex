import { NextResponse } from 'next/server';

const YIYAN_APIS = [
  'https://api.yviii.com/yiyan/yi.php/?syz=js&charset=utf-8',
  'https://api.yviii.com/yiyan/ci.php/?syz=js&charset=utf-8',
];

const FALLBACK_TEXT = '秋阴不散霜飞晚，留得枯荷听雨声。';

export async function GET() {
  const url = YIYAN_APIS[Math.floor(Math.random() * YIYAN_APIS.length)];

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'ThriveX-Blog',
      },
    });
    const script = await response.text();
    const text = parseDocumentWrite(script) || FALLBACK_TEXT;

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ text: FALLBACK_TEXT });
  }
}

function parseDocumentWrite(script: string) {
  const match = script.match(/document\.write\((['"])([\s\S]*?)\1\)/);
  if (!match?.[2]) return '';

  return match[2]
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .trim();
}
