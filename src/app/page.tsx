'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Hydrate from localStorage
    const token = localStorage.getItem('styleai_token');
    const userStr = localStorage.getItem('styleai_user');
    if (token && userStr) {
      try {
        const u = JSON.parse(userStr);
        useAuthStore.getState().setAuth(u, token);
        if (!u.onboarded) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } catch {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-accent-end flex items-center justify-center pulse-glow">
          <span className="text-2xl font-bold text-white">S</span>
        </div>
        <div className="w-8 h-8 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
