import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/providers/supabase/server';

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID || '',
  process.env.YOUTUBE_CLIENT_SECRET || '',
  process.env.YOUTUBE_REDIRECT_URI || ''
);

export async function GET(request: NextRequest) {
  try {
    // Get the code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect('/dashboard?error=no_code');
    }

    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Store tokens in secure HTTP-only cookies
    const cookieStore = await cookies();

    // Set access token (short-lived)
    cookieStore.set({
      name: 'youtube_access_token',
      value: tokens.access_token || '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expiry_date ? Math.floor((tokens.expiry_date as number - Date.now()) / 1000) : 3600,
      path: '/',
    });

    // Set refresh token (long-lived)
    if (tokens.refresh_token) {
      cookieStore.set({
        name: 'youtube_refresh_token',
        value: tokens.refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    // Redirect back to dashboard
    return NextResponse.redirect('http://localhost:3000/dashboard?connected=youtube');
  } catch (error) {
    console.error('YouTube callback error:', error);
    return NextResponse.redirect('http://localhost:3000/dashboard?error=auth_failed');
  }
}