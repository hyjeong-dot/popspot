import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr';
import type { Database } from '@popspot/types';

// 환경 변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 기본 클라이언트 (서버 컴포넌트용)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 브라우저 클라이언트 생성 함수
export function createBrowserSupabaseClient() {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
        cookieOptions: {
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
        }
    });
}

// 서버 클라이언트 생성 함수 (App Router용)
export function createServerSupabaseClient(cookies: {
    get: (name: string) => { value: string } | undefined;
    set: (name: string, value: string, options: Record<string, unknown>) => void;
    remove: (name: string, options: Record<string, unknown>) => void;
}) {
    return createSSRServerClient<Database>(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get(name: string) {
                return cookies.get(name)?.value;
            },
            set(name: string, value: string, options: Record<string, unknown>) {
                try {
                    cookies.set(name, value, options);
                } catch {
                    // Server component에서는 무시
                }
            },
            remove(name: string, options: Record<string, unknown>) {
                try {
                    cookies.remove(name, options);
                } catch {
                    // Server component에서는 무시
                }
            },
        },
    });
}

export { createClient, createBrowserClient };
export type { Database };
