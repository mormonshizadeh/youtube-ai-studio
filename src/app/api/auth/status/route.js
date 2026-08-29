import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/auth/status — returns current session + channel info
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('yt_access_token')?.value;
  const rawName = cookieStore.get('yt_user_name')?.value;
  const userName = rawName ? decodeURIComponent(rawName) : null;
  const userPicture = cookieStore.get('yt_user_picture')?.value || '';

  if (!accessToken) {
    return NextResponse.json({ connected: false, user: null });
  }

  // Fetch YouTube channel info
  try {
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const channelData = await channelRes.json();

    const channel = channelData.items?.[0];
    return NextResponse.json({
      connected: true,
      user: {
        name: channel?.snippet?.title || userName || 'YouTube Creator',
        picture: channel?.snippet?.thumbnails?.default?.url || userPicture || '',
        channelId: channel?.id || null,
        channelTitle: channel?.snippet?.title || null,
        subscriberCount: channel?.statistics?.subscriberCount || null,
        viewCount: channel?.statistics?.viewCount || null,
        videoCount: channel?.statistics?.videoCount || null,
      },
    });
  } catch (err) {
    return NextResponse.json({
      connected: true,
      user: {
        name: userName || 'YouTube Creator',
        picture: userPicture || '',
      },
    });
  }
}
