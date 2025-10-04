import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Remove YouTube tokens from cookies
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'youtube_access_token',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    cookieStore.set({
      name: 'youtube_refresh_token',
      value: '',
      expires: new Date(0),
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('YouTube disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect YouTube account' },
      { status: 500 }
    );
  }
}