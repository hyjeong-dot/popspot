'use client';

import { createBrowserSupabaseClient } from '@popspot/database';

let browserClient: ReturnType<typeof createBrowserSupabaseClient> | null = null;

export function getSupabaseClient() {
    if (!browserClient) {
        browserClient = createBrowserSupabaseClient();
    }
    return browserClient;
}
