export type PlatformType = 
  | 'youtube'
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'twitter'
  | 'medium'
  | 'google_analytics';

export interface ApiCredentials {
  id: string;
  user_id: string;
  platform: PlatformType;
  credentials: {
    // YouTube
    youtube_api_key?: string;
    // Instagram & Facebook
    access_token?: string;
    // LinkedIn
    client_id?: string;
    client_secret?: string;
    // Twitter
    twitter_api_key?: string;
    api_secret?: string;
    bearer_token?: string;
    // Medium
    integration_token?: string;
    // Google Analytics
    client_email?: string;
    private_key?: string;
    property_id?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CachedMetrics {
  id: string;
  user_id: string;
  platform: PlatformType;
  metrics: {
    // Platform-specific metrics will be stored here
    // The type matches our metrics.ts interfaces
    [key: string]: any;
  };
  cache_time: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  public: {
    Tables: {
      api_credentials: {
        Row: {
          id: string;
          user_id: string;
          platform: PlatformType;
          credentials: {
            youtube_api_key?: string;
            access_token?: string;
            client_id?: string;
            client_secret?: string;
            twitter_api_key?: string;
            api_secret?: string;
            bearer_token?: string;
            integration_token?: string;
            client_email?: string;
            private_key?: string;
            property_id?: string;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          platform: PlatformType;
          credentials: ApiCredentials['credentials'];
          user_id: string;
        };
        Update: Partial<{
          platform: PlatformType;
          credentials: ApiCredentials['credentials'];
          user_id: string;
        }>;
      };
      cached_metrics: {
        Row: {
          id: string;
          user_id: string;
          platform: PlatformType;
          metrics: Record<string, any>;
          cache_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          platform: PlatformType;
          metrics: Record<string, any>;
          user_id: string;
          cache_time?: string;
        };
        Update: Partial<{
          platform: PlatformType;
          metrics: Record<string, any>;
          user_id: string;
          cache_time?: string;
        }>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      platform_type: PlatformType;
    };
  };
  auth: {
    Tables: {
      users: {
        Row: {
          id: string;
          email?: string;
        };
      };
    };
  };
}

export type Database = DatabaseSchema;