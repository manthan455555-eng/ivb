'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiSparkles, HiShoppingBag, HiChatBubbleLeftRight, HiArrowTrendingUp, HiLightBulb, HiUsers } from 'react-icons/hi2';
import { IoShirt } from 'react-icons/io5';
import { products } from '@/data/products';
import { friends } from '@/data/friends';

const DAILY_OUTFITS = [
    { title: 'Power Meeting', items: ['Navy Blazer', 'White Shirt', 'Charcoal Trousers', 'Oxford Shoes'], vibe: 'Commanding yet approachable', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop' },
    { title: 'Weekend Brunch', items: ['Linen Shirt', 'Chinos', 'White Sneakers', 'Aviators'], vibe: 'Effortlessly cool', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=400&fit=crop' },
    { title: 'Date Night', items: ['Black Turtleneck', 'Dark Jeans', 'Chelsea Boots', 'Minimal Watch'], vibe: 'Sophisticated charm', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop' },
    { title: 'Creative Friday', items: ['Oversized Denim Jacket', 'Graphic Tee', 'Slim Jeans', 'High-Top Sneakers'], vibe: 'Urban artistic', image: 'https://images.unsplash.com/photo-1488161628813-04466f0016e4?w=300&h=400&fit=crop' },
];

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [outfitIdx, setOutfitIdx] = useState(0);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('styleai_token');
        if (!token) router.push('/login');
    }, [router]);

    useEffect(() => {
        const timer = setInterval(() => {
            setOutfitIdx((i) => (i + 1) % DAILY_OUTFITS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton h-32 rounded-2xl" />
                ))}
            </div>
        );
    }

    const profile = user?.styleProfile;
    const outfit = DAILY_OUTFITS[outfitIdx];

    const gapCategories = ['Outerwear', 'Footwear', 'Accessories'];

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* Welcome */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
                        {user?.name?.split(' ')[0] || 'there'} 👋
                    </h1>
                    <p className="text-text-muted text-sm mt-1">Here&apos;s your style overview</p>
                </div>
            </motion.div>

            {/* Style Score Card */}
            {profile && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full" />
                    <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(128,128,128,0.1)" strokeWidth="6" />
                                <circle
                                    cx="40" cy="40" r="34" fill="none"
                                    stroke="url(#scoreGrad)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(profile.styleScore / 100) * 213} 213`}
                                />
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="var(--theme-accent)" />
                                        <stop offset="100%" stopColor="var(--theme-accent-end)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-text-primary">{profile.styleScore}</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-semibold text-text-primary">Style Score</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                                    <HiArrowTrendingUp className="w-3 h-3 inline mr-0.5" />
                                    +5 this week
                                </span>
                            </div>
                            <p className="text-xs text-text-muted">{profile.dominantStyle} · {profile.bodyType}</p>
                            <div className="flex gap-1.5 mt-2">
                                {profile.recommendedColors.slice(0, 5).map((c: string, i: number) => (
                                    <div key={i} className="w-5 h-5 rounded-md border border-border" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Friends Style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                        <HiUsers className="w-4 h-4 text-accent" />
                        Friends Style
                    </h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
                    {friends.map((friend, i) => (
                        <Link key={friend.id} href={`/friends/${friend.id}`} className="flex-shrink-0 w-60">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.05 }}
                                className="card p-0 overflow-hidden group hover:-translate-y-1 transition-transform"
                            >
                                <div className="flex items-center gap-3 p-3 border-b border-border">
                                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-text-primary truncate">{friend.name}</p>
                                        <p className="text-xs text-text-muted flex items-center gap-1">
                                            Score: <span className="font-semibold text-accent">{friend.styleScore}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    {friend.outfits.slice(0, 2).map((outfit, j) => (
                                        <div key={outfit.id} className="relative w-1/2 h-24 overflow-hidden border-r last:border-r-0 border-border">
                                            <img src={outfit.image} alt={outfit.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <p className="absolute bottom-1.5 left-2 text-[9px] font-medium text-white truncate right-2">{outfit.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* AI Outfit Carousel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                        <HiSparkles className="w-4 h-4 text-accent" />
                        AI Daily Outfit
                    </h2>
                    <div className="flex gap-1">
                        {DAILY_OUTFITS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setOutfitIdx(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === outfitIdx ? 'bg-accent w-4' : 'bg-border'}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="card overflow-hidden p-0">
                    <div className="flex">
                        <div className="w-28 h-36 flex-shrink-0 relative overflow-hidden">
                            <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/60" />
                        </div>
                        <div className="flex-1 p-4">
                            <h3 className="text-sm font-bold text-text-primary mb-0.5">{outfit.title}</h3>
                            <p className="text-xs text-accent mb-2">{outfit.vibe}</p>
                            <div className="space-y-1">
                                {outfit.items.map((item, i) => (
                                    <p key={i} className="text-xs text-text-secondary">• {item}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h2>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { href: '/try-on', icon: HiSparkles, label: 'Try On' },
                        { href: '/chat', icon: HiChatBubbleLeftRight, label: 'AI Stylist' },
                        { href: '/shop', icon: HiShoppingBag, label: 'Shop' },
                    ].map((action, i) => (
                        <Link key={action.href} href={action.href}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.05 }}
                                className="p-4 rounded-2xl bg-surface border border-border text-center hover:border-accent/15 transition-all group"
                            >
                                <action.icon className="w-6 h-6 mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-medium text-text-secondary">{action.label}</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Wardrobe Gap Analysis */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
            >
                <div className="flex items-center gap-2 mb-3">
                    <HiLightBulb className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-semibold text-text-primary">What&apos;s Missing</h3>
                </div>
                <p className="text-xs text-text-muted mb-3">
                    Based on AI analysis, adding these categories would boost your outfit combinations by 40%
                </p>
                <div className="flex flex-wrap gap-2">
                    {gapCategories.map((cat) => (
                        <Link
                            key={cat}
                            href="/shop"
                            className="px-3 py-1.5 rounded-full text-xs font-medium border border-warning/20 bg-warning/5 text-warning hover:bg-warning/10 transition-colors"
                        >
                            + {cat}
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Trending Products */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-text-primary">AI Picks for You</h2>
                    <Link href="/shop" className="text-xs text-accent hover:text-accent-end transition-colors">
                        View all →
                    </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
                    {products.filter(p => p.aiRecommended).slice(0, 4).map((product, i) => (
                        <Link key={product.id} href={`/shop/${product.id}`} className="flex-shrink-0 w-36">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.05 }}
                                className="card p-0 overflow-hidden group hover:-translate-y-1"
                            >
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-white flex items-center gap-0.5">
                                            <HiSparkles className="w-2.5 h-2.5" /> AI Pick
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-xs font-medium text-text-primary truncate">{product.name}</p>
                                    <p className="text-[10px] text-text-muted">{product.brand}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-xs font-bold text-text-primary">₹{product.price.toLocaleString()}</span>
                                        <span className="text-[10px] text-text-muted line-through">₹{product.originalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Wardrobe Link */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Link href="/wardrobe" className="card flex items-center gap-4 group hover:border-accent/15 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-accent/8 flex items-center justify-center flex-shrink-0">
                        <IoShirt className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-text-primary">Smart Wardrobe</h3>
                        <p className="text-xs text-text-muted">Add items and build outfits</p>
                    </div>
                    <span className="text-text-muted group-hover:text-accent transition-colors">→</span>
                </Link>
            </motion.div>
        </div>
    );
}

