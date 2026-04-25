// Zustand auth store
import { create } from 'zustand';
import type { StyleProfile } from '@/lib/db';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    styleProfile?: StyleProfile;
    preferences?: string[];
    onboarded: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    updateUser: (updates: Partial<User>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('styleai_token', token);
            localStorage.setItem('styleai_user', JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
    },
    updateUser: (updates) =>
        set((state) => {
            const updatedUser = state.user ? { ...state.user, ...updates } : null;
            if (updatedUser && typeof window !== 'undefined') {
                localStorage.setItem('styleai_user', JSON.stringify(updatedUser));
            }
            return { user: updatedUser };
        }),
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('styleai_token');
            localStorage.removeItem('styleai_user');
        }
        set({ user: null, token: null, isAuthenticated: false });
    },
}));
