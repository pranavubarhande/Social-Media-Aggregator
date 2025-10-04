"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { youtubeService, type YouTubeAnalyticsData } from "@/services/youtube.service";

const YOUTUBE_QUERY_KEY = ["youtube", "analytics"] as const;

export function useYouTubeAnalytics() {
  const query = useQuery<YouTubeAnalyticsData, Error>({
    queryKey: YOUTUBE_QUERY_KEY,
    queryFn: youtubeService.getAnalytics,
    retry: false,
  });

  return {
    ...query,
    isConnected: query.isSuccess,
  };
}

export function useDisconnectYouTube() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: youtubeService.disconnect,
    onSuccess: async () => {
      // Invalidate analytics so UI updates immediately
      await queryClient.invalidateQueries({ queryKey: YOUTUBE_QUERY_KEY });
    },
  });
}
