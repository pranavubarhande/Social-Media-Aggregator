"use client";
import { useState } from 'react';
import { PlatformSelector } from '@/components/dashboard/PlatformSelector';
import { PlatformType } from '@/types/supabase';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabaseBrowserClient } from '@/providers/supabase/client';
import { SelectedPlatformProvider } from '@/contexts/selected-platform-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('youtube');
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabaseBrowserClient.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Social Analytics Dashboard</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </header>
      <div className="px-4 py-6">
        <div className="mb-8">
          <PlatformSelector value={selectedPlatform} onChange={setSelectedPlatform} />
        </div>
        <SelectedPlatformProvider value={{ selectedPlatform, setSelectedPlatform }}>
          <main>{children}</main>
        </SelectedPlatformProvider>
      </div>
    </div>
  );
}