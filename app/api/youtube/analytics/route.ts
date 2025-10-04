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
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('youtube_access_token')?.value;
    const refreshToken = cookieStore.get('youtube_refresh_token')?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { error: 'Not authenticated with YouTube' },
        { status: 401 }
      );
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Handle token refresh if needed
    if (!accessToken && refreshToken) {
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();

        // Update access token cookie
        cookieStore.set({
          name: 'youtube_access_token',
          value: credentials.access_token || '',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: credentials.expiry_date ? Math.floor((credentials.expiry_date as number - Date.now()) / 1000) : 3600,
          path: '/',
        });
      } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
          { error: 'Failed to refresh token' },
          { status: 401 }
        );
      }
    }

    // Initialize YouTube Analytics API
    const youtubeAnalytics = google.youtubeAnalytics({
      version: 'v2',
      auth: oauth2Client,
    });

    // Get channel data
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    const channelResponse = await youtube.channels.list({
      part: ['snippet,statistics'],
      mine: true,
    });

    // Get analytics data (last 30 days)
    const endDate = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days ago

    const analyticsResponse = await youtubeAnalytics.reports.query({
      ids: 'channel==MINE',
      startDate,
      endDate,
      metrics: 'views,likes,subscribersGained,estimatedMinutesWatched',
      dimensions: 'day',
      sort: 'day',
    });

    // Get user information and cache the metrics
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Store metrics in database cache
      await supabase.from('cached_metrics').upsert({
        user_id: user.id,
        platform: 'youtube',
        metrics: {
          channel: channelResponse.data.items?.[0],
          analytics: analyticsResponse.data,
          last_updated: new Date().toISOString(),
        },
        cache_time: new Date().toISOString(),
      });
    }

    // Return the analytics data
    return NextResponse.json({
      channel: channelResponse.data.items?.[0],
      analytics: analyticsResponse.data,
    });
  } catch (error) {
    console.error('YouTube analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube analytics' },
      { status: 500 }
    );
  }
}