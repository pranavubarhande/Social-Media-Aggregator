import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/providers/supabase/server';

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID || '',
  process.env.YOUTUBE_CLIENT_SECRET || '',
  process.env.YOUTUBE_REDIRECT_URI || ''
);

// Define scopes for YouTube analytics
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
];

export async function GET() {
  try {
    // Get the authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent', // Force to get refresh_token every time
    });

    // Redirect to Google's OAuth consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('YouTube auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate YouTube authentication' },
      { status: 500 }
    );
  }
}