'use client';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi2';
import { friends } from '@/data/friends';

export default function FriendProfilePage() {
    const params = useParams();
    const router = useRouter();
    const friend = friends.find(f => f.id === params.id);

    if (!friend) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-text-secondary">Friend not found</p>
                <button onClick={() => router.back()} className="text-accent text-sm mt-2 inline-block">← Back</button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors">
                    <HiArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                        <img src={friend.avatar} alt={friend.name} className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-lg" />
                        <div className="absolute -bottom-2 -right-2 bg-surface px-2 py-1 rounded-full border border-border shadow-sm flex items-center gap-1">
                            <HiSparkles className="w-3 h-3 text-accent" />
                            <span className="text-xs font-bold text-text-primary">{friend.styleScore}</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-text-primary">{friend.name}</h1>
                        <p className="text-sm text-text-muted mt-1">Style Score: {friend.styleScore} / 100</p>
                        
                        <div className="mt-4 p-4 rounded-2xl bg-accent/5 border border-accent/10">
                            <div className="flex items-start gap-2">
                                <HiSparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    <span className="font-semibold text-text-primary">AI Style Analysis: </span>
                                    {friend.comment}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Outfits Grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-lg font-bold text-text-primary mb-4">Top Outfits</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {friend.outfits.map((outfit, i) => (
                        <motion.div 
                            key={outfit.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="aspect-[3/4]">
                                <img src={outfit.image} alt={outfit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="absolute inset-0 flex flex-col justify-end p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                                <h3 className="text-sm font-semibold text-white mb-2">{outfit.name}</h3>
                                <button className="w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-medium text-white transition-colors opacity-0 group-hover:opacity-100">
                                    View Outfit
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
