'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome, HiSparkles, HiShoppingBag, HiChatBubbleLeftRight } from 'react-icons/hi2';
import { IoShirt } from 'react-icons/io5';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/dashboard', icon: HiHome, label: 'Home' },
    { href: '/try-on', icon: HiSparkles, label: 'Try-On' },
    { href: '/wardrobe', icon: IoShirt, label: 'Wardrobe' },
    { href: '/shop', icon: HiShoppingBag, label: 'Shop' },
    { href: '/chat', icon: HiChatBubbleLeftRight, label: 'Chat' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong">
            <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-0.5 py-1 px-3 group">
                            <div className="relative">
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute -inset-2 bg-accent/10 rounded-2xl"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <item.icon
                                    className={`w-6 h-6 relative z-10 transition-colors ${isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                                        }`}
                                />
                            </div>
                            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
