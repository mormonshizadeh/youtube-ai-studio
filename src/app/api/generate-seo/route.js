import { NextResponse } from 'next/server';
import { generateViralTitles, generateSeoPackage, generateViralHooks } from '../../../lib/gemini-ai';

export async function POST(request) {
  try {
    const { topic, niche, summary, type, geminiKey } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Please enter a video topic or keyword' }, { status: 400 });
    }

    if (type === 'titles') {
      const titles = await generateViralTitles(topic, niche, geminiKey);
      const hooks = await generateViralHooks(topic, geminiKey);
      return NextResponse.json({ success: true, titles, hooks });
    }

    if (type === 'full-package') {
      const titles = await generateViralTitles(topic, niche, geminiKey);
      const seoData = await generateSeoPackage(topic, summary, geminiKey);
      const hooks = await generateViralHooks(topic, geminiKey);
      return NextResponse.json({ success: true, titles, ...seoData, hooks });
    }

    // Default: full bundle
    const seoData = await generateSeoPackage(topic, summary, geminiKey);
    return NextResponse.json({ success: true, ...seoData });
  } catch (err) {
    console.error("API /api/generate-seo error:", err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate SEO assets.' },
      { status: 500 }
    );
  }
}
