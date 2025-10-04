'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth-context";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each session to avoid hydration issues
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}