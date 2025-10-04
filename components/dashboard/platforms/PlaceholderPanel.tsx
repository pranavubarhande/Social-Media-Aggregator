"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PlaceholderPanel({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{name}</h2>
        <Badge variant="secondary">Coming soon</Badge>
      </div>
      <p className="mt-4 text-muted-foreground">
        {description || `Connect your ${name} account to view analytics data`}
      </p>
    </Card>
  );
}
