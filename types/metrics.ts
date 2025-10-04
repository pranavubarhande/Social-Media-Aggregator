export interface SocialMetrics {
  youtube?: YouTubeMetrics;
  instagram?: InstagramMetrics;
  linkedin?: LinkedInMetrics;
  facebook?: FacebookMetrics;
  twitter?: TwitterMetrics;
  medium?: MediumMetrics;
  googleAnalytics?: GoogleAnalyticsMetrics;
}

export interface YouTubeMetrics {
  subscriberCount: number;
  currentMonthWatchTime: number;
  previousMonthWatchTime: number;
  demographics: {
    country: string;
    percentage: number;
  }[];
}

export interface InstagramMetrics {
  followers: number;
  accountReach: number;
  contentPerformance: {
    id: string;
    type: string;
    impressions: number;
    engagement: number;
  }[];
}

export interface LinkedInMetrics {
  connections: number;
  followers: number;
  impressions: number;
  engagementRate: number;
}

export interface FacebookMetrics {
  followers: number;
  pageViews: number;
  postReach: number;
}

export interface TwitterMetrics {
  followers: number;
  impressions: number;
  engagementRate: number;
}

export interface MediumMetrics {
  posts: {
    title: string;
    views: number;
    reads: number;
    readRatio: number;
    referrals: number;
  }[];
}

export interface GoogleAnalyticsMetrics {
  organicSearches: {
    keyword: string;
    impressions: number;
    clicks: number;
    position: number;
  }[];
  totalUsers: number;
  pageViews: number;
}