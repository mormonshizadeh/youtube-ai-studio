import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/analytics
 * Quick summary endpoint — returns the last 28 days overview
 */
export async function GET(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('yt_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Redirect to channel/analytics for full data
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3005';
  const analyticsRes = await fetch(`${baseUrl}/api/channel/analytics`, {
    headers: { Cookie: `yt_access_token=${accessToken}` },
  });

  const data = await analyticsRes.json();
  return NextResponse.json(data, { status: analyticsRes.status });
}
