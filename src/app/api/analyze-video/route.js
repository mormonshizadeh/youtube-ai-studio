import { NextResponse } from 'next/server';
import { extractVideoId, fetchVideoDetails } from '../../../lib/youtube-scraper';

export async function POST(request) {
  try {
    const { url, apiKey } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Please provide a YouTube video URL or ID' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL or Video ID' }, { status: 400 });
    }

    const data = await fetchVideoDetails(videoId, apiKey);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("API /api/analyze-video error:", err);
    return NextResponse.json(
      { error: err.message || 'Failed to analyze video. Please verify the URL and try again.' },
      { status: 500 }
    );
  }
}
