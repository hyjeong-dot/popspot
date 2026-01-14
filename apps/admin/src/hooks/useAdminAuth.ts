'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getSupabaseClient } from '@/lib/supabase';
import type { Profile } from '@popspot/types';

export function useAdminAuth() {
    const router = useRouter();
    const {
        user, profile, isLoading, isAuthenticated, isAdmin,
        setUser, setProfile, setLoading, logout: storeLogout
    } = useAuthStore();
    const supabase = getSupabaseClient();
    const isFetchingProfile = useRef(false);

    const fetchProfile = useCallback(async (userId: string) => {
        if (isFetchingProfile.current) return null;
        isFetchingProfile.current = true;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setProfile(data as Profile);
                return data as Profile;
            }
            return null;
        } finally {
            isFetchingProfile.current = false;
        }
    }, [supabase, setProfile]);

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event);

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                if (session?.user) {
                    setUser(session.user);
                    await fetchProfile(session.user.id);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, setUser, setProfile, setLoading, fetchProfile]);

    const signInWithEmail = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setLoading(false);
                return { error: error.message };
            }

            if (data.user) {
                const profileData = await fetchProfile(data.user.id);

                if (profileData?.role !== 'admin') {
                    await supabase.auth.signOut();
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                    return { error: '관리자 계정이 아닙니다. 권한을 확인해주세요.' };
                }
            }

            setLoading(false);
            return { error: null };
        } catch (err: any) {
            console.error('Login error:', err);
            setLoading(false);
            return { error: err.message || '로그인 중 오류가 발생했습니다.' };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        storeLogout();
        router.push('/login');
    };

    return {
        user,
        profile,
        isLoading,
        isAuthenticated,
        isAdmin,
        signInWithEmail,
        logout,
    };
}
