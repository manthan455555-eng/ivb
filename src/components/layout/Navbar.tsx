'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { HiShoppingCart, HiArrowRightOnRectangle, HiSun, HiMoon } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const cartCount = useCartStore((s) => s.getCount());
    const router = useRouter();
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        if (nextDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('styleai_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('styleai_theme', 'light');
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-50 glass-strong">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-end flex items-center justify-center">
                        <span className="text-sm font-bold text-white">S</span>
                    </div>
                    <span className="text-lg font-bold gradient-text">StyleAI</span>
                </Link>

                <div className="flex items-center gap-3">
                    <button onClick={toggleTheme} className="p-2 hover:bg-surface-hover rounded-2xl transition-colors" title="Toggle Theme">
                        {isDark ? <HiSun className="w-5 h-5 text-text-secondary" /> : <HiMoon className="w-5 h-5 text-text-secondary" />}
                    </button>

                    <Link href="/shop/cart" className="relative p-2 hover:bg-surface-hover rounded-2xl transition-colors">
                        <HiShoppingCart className="w-5 h-5 text-text-secondary" />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-end flex items-center justify-center text-xs font-bold text-white">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <button onClick={handleLogout} className="p-2 hover:bg-surface-hover rounded-2xl transition-colors" title="Logout">
                                <HiArrowRightOnRectangle className="w-5 h-5 text-text-secondary" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

