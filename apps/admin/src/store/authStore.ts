'use client';

import { create } from 'zustand';
import type { Profile } from '@popspot/types';
import type { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    setUser: (user: User | null) => void;
    setProfile: (profile: Profile | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setProfile: (profile) => set({
        profile,
        isAdmin: profile?.role === 'admin'
    }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () => set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isAdmin: false
    }),
}));
