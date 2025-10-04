import axiosInstance from "./axiosInstance";

export type YouTubeAnalyticsRow = [string, string];

export interface YouTubeAnalyticsData {
  channel?: {
    snippet?: { title?: string };
    statistics?: {
      subscriberCount?: string;
      viewCount?: string;
      videoCount?: string;
    };
  };
  analytics?: {
    rows?: YouTubeAnalyticsRow[];
  };
}

async function getAnalytics(): Promise<YouTubeAnalyticsData> {
  const { data } = await axiosInstance.get<YouTubeAnalyticsData>("/youtube/analytics");
  return data;
}

async function disconnect(): Promise<void> {
  await axiosInstance.post("/youtube/disconnect");
}

export const youtubeService = {
  getAnalytics,
  disconnect,
};
