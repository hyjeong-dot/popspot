'use client';

import { createBrowserSupabaseClient } from '@popspot/database';

// 브라우저용 Supabase 클라이언트 싱글톤
let browserClient: ReturnType<typeof createBrowserSupabaseClient> | null = null;

export function getSupabaseClient() {
    if (!browserClient) {
        browserClient = createBrowserSupabaseClient();
    }
    return browserClient;
}
