"use client"

import { useMemo } from 'react';
import { useSelectedPlatform } from '@/contexts/selected-platform-context';
import { PlatformPanels } from '@/components/dashboard/platforms';

export default function DashboardPage() {
  const { selectedPlatform } = useSelectedPlatform();
  const Panel = useMemo(() => PlatformPanels[selectedPlatform], [selectedPlatform]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <Panel />

      <p className="text-gray-500">Connect more platforms to see all your social media analytics in one place.</p>
    </div>
  );
}