import { NextResponse } from 'next/server';

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
      console.error('Token exchange error:', tokenData);
      throw new Error(tokenData.error_description || tokenData.error || 'Token exchange failed');
    }

    // Fetch user profile info
    let profile = {};
    try {
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      profile = await profileResponse.json();
    } catch (e) {
      console.warn('Could not fetch user profile:', e);
    }

    // Create redirect response and explicitly attach cookies to it
    const response = NextResponse.redirect(new URL('/?connected=true', request.url));

    const cookieOptions = {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: false, // allow localhost http
      maxAge: tokenData.expires_in || 3600,
    };

    response.cookies.set('yt_access_token', tokenData.access_token, cookieOptions);

    if (tokenData.refresh_token) {
      response.cookies.set('yt_refresh_token', tokenData.refresh_token, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    if (profile.name) {
      response.cookies.set('yt_user_name', encodeURIComponent(profile.name), {
        ...cookieOptions,
        httpOnly: false,
      });
    }

    if (profile.picture) {
      response.cookies.set('yt_user_picture', profile.picture, {
        ...cookieOptions,
        httpOnly: false,
      });
    }

    return response;
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(
      new URL(`/?oauth_error=${encodeURIComponent(err.message)}`, request.url)
    );
  }
}
