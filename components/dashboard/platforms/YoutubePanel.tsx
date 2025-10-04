"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useDisconnectYouTube, useYouTubeAnalytics } from "@/hooks/youtube.hooks";
import { YouTubeAnalyticsRow } from "@/services/youtube.service";

export default function YoutubePanel() {
  const { data: youtubeData, isPending, isSuccess, refetch } = useYouTubeAnalytics();
  const disconnectMutation = useDisconnectYouTube();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // react to URL params after OAuth callback
  useEffect(() => {
    const connected = searchParams.get("connected");
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(
        errorParam === "auth_failed"
          ? "YouTube authentication failed. Please try again."
          : "An error occurred during connection."
      );
    } else if (connected === "youtube") {
      // refresh data after successful connection
      refetch();
    }
  }, [searchParams, refetch]);

  const handleConnectYouTube = () => {
    setLoading(true);
    // redirect to API route to start OAuth
    window.location.href = "/api/youtube/auth";
  };

  const handleDisconnectYouTube = async () => {
    try {
      setLoading(true);
      await disconnectMutation.mutateAsync();
    } catch {
      setError("Failed to disconnect YouTube account");
    } finally {
      setLoading(false);
    }
  };

  const isYouTubeConnected = isSuccess;

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Youtube className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-semibold">YouTube Analytics</h2>
        </div>

        <Button
          onClick={isYouTubeConnected ? handleDisconnectYouTube : handleConnectYouTube}
          disabled={loading || isPending || disconnectMutation.isPending}
          variant={isYouTubeConnected ? "outline" : "default"}
        >
          {loading || isPending || disconnectMutation.isPending
            ? "Processing..."
            : isYouTubeConnected
            ? "Disconnect YouTube"
            : "Connect YouTube"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mt-4">
          {error}
          <button className="ml-2 text-red-700" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {isYouTubeConnected && youtubeData && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Channel: {youtubeData.channel?.snippet?.title}</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Subscribers</p>
              <p className="text-2xl font-bold">{youtubeData.channel?.statistics?.subscriberCount || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">{youtubeData.channel?.statistics?.viewCount || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Videos</p>
              <p className="text-2xl font-bold">{youtubeData.channel?.statistics?.videoCount || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Last 30 Days Views</p>
              <p className="text-2xl font-bold">
                {youtubeData.analytics?.rows?.reduce((sum: number, row: YouTubeAnalyticsRow) => sum + (parseInt(row[1] ?? '0', 10) || 0), 0) || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isYouTubeConnected && (
        <div className="mt-4 text-gray-500">
          <p>Connect your YouTube account to view analytics data</p>
        </div>
      )}
    </Card>
  );
}

