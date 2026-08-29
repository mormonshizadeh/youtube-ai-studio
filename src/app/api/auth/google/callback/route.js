import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?oauth_error=No+authorization+code', request.url));
  }

  try {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3005'}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      throw new Error(tokenData.error_description || 'Token exchange failed');
    }

    // Fetch user profile info
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();

    // Store tokens in cookies (httpOnly for security)
    const cookieStore = await cookies();
    cookieStore.set('yt_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in || 3600,
      path: '/',
    });

    if (tokenData.refresh_token) {
      cookieStore.set('yt_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    cookieStore.set('yt_user_name', profile.name || '', { path: '/', maxAge: 3600 });
    cookieStore.set('yt_user_picture', profile.picture || '', { path: '/', maxAge: 3600 });

    return NextResponse.redirect(new URL('/?connected=true', request.url));
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(err.message)}`, request.url)
    );
  }
}
