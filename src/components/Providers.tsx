"use client";

import { store } from "@/lib/redux/store";
import { Session } from "@prisma/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider refetchOnWindowFocus={false}>
        <Provider store={store}>{children}</Provider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
