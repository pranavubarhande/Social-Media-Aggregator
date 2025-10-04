import type { PlatformType } from "@/types/supabase";
import type { ComponentType } from "react";
import YoutubePanel from "./YoutubePanel";
import InstagramPanel from "./InstagramPanel";
import LinkedInPanel from "./LinkedInPanel";
import FacebookPanel from "./FacebookPanel";
import TwitterPanel from "./TwitterPanel";
import MediumPanel from "./MediumPanel";
import GoogleAnalyticsPanel from "./GoogleAnalyticsPanel";

export const PlatformPanels: Record<PlatformType, ComponentType> = {
  youtube: YoutubePanel,
  instagram: InstagramPanel,
  linkedin: LinkedInPanel,
  facebook: FacebookPanel,
  twitter: TwitterPanel,
  medium: MediumPanel,
  google_analytics: GoogleAnalyticsPanel,
};
