"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Suspense } from "react";
import Loading from "./loading";
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'

const queryClient = new QueryClient();

broadcastQueryClient({ queryClient })

export default function Providers({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
    </QueryClientProvider>
}