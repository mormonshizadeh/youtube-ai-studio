import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'YouTube OAuth is not configured. Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET.' },
      { status: 500 }
    );
  }

  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3005'}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
