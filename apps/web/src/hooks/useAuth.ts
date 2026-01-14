'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getSupabaseClient } from '@/lib/supabase';
import type { Profile } from '@popspot/types';

export function useAuth() {
    const router = useRouter();
    const { user, profile, isLoading, isAuthenticated, setUser, setProfile, setLoading, logout: storeLogout } = useAuthStore();
    const supabase = getSupabaseClient();

    // 프로필 가져오기
    const fetchProfile = useCallback(async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (!error && data) {
            setProfile(data as Profile);
        }
        return data;
    }, [supabase, setProfile]);

    // 초기 세션 확인
    useEffect(() => {
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        };

        initAuth();

        // Auth 상태 변화 구독
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, setUser, setProfile, setLoading, fetchProfile]);

    // 이메일/비밀번호 로그인
    const signInWithEmail = async (email: string, password: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoading(false);
            return { error: error.message };
        }

        if (data.user) {
            await fetchProfile(data.user.id);
        }
        setLoading(false);
        return { error: null };
    };

    // 회원가입
    const signUp = async (email: string, password: string, nickname: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nickname,
                },
            },
        });

        if (error) {
            setLoading(false);
            return { error: error.message };
        }

        setLoading(false);
        return { error: null, user: data.user };
    };

    // 카카오 로그인
    const signInWithKakao = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            return { error: error.message };
        }
        return { error: null };
    };

    // 로그아웃
    const logout = async () => {
        await supabase.auth.signOut();
        storeLogout();
        router.push('/');
    };

    // 비밀번호 재설정 이메일
    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
            return { error: error.message };
        }
        return { error: null };
    };

    // 프로필 업데이트
    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return { error: '로그인이 필요합니다.' };

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            return { error: error.message };
        }

        setProfile(data as Profile);
        return { error: null, data };
    };

    return {
        user,
        profile,
        isLoading,
        isAuthenticated,
        signInWithEmail,
        signUp,
        signInWithKakao,
        logout,
        resetPassword,
        updateProfile,
        fetchProfile,
    };
}
