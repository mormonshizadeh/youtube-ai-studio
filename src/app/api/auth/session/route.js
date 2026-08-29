import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/auth/session — returns current logged-in user info
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('yt_access_token')?.value;
  const userName = cookieStore.get('yt_user_name')?.value;
  const userPicture = cookieStore.get('yt_user_picture')?.value;

  if (!accessToken) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: true,
    user: { name: userName || 'YouTube User', picture: userPicture || '' },
  });
}

// DELETE /api/auth/session — logout / disconnect
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('yt_access_token');
  cookieStore.delete('yt_refresh_token');
  cookieStore.delete('yt_user_name');
  cookieStore.delete('yt_user_picture');
  return NextResponse.json({ success: true });
}
