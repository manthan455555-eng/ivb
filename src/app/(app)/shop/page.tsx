'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { products } from '@/data/products';
import { HiShoppingBag, HiSparkles, HiStar, HiFunnel } from 'react-icons/hi2';

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories'];

export default function ShopPage() {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = products.filter(p => {
        const matchCat = filter === 'All' || p.category === filter;
        const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-accent/8 flex items-center justify-center">
                        <HiShoppingBag className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">Fashion Store</h1>
                        <p className="text-xs text-text-muted">AI-curated collection · 30-min delivery</p>
                    </div>
                </div>

                {/* Search */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="input-field mb-4"
                />

                {/* Category filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <HiFunnel className="w-4 h-4 text-text-muted flex-shrink-0" />
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === cat
                                    ? 'bg-accent/12 text-accent border border-accent/25'
                                    : 'text-text-secondary border border-border hover:border-accent/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((product, i) => (
                    <Link key={product.id} href={`/shop/${product.id}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="card p-0 overflow-hidden group cursor-pointer"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {product.aiRecommended && (
                                    <div className="absolute top-2 left-2">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-white flex items-center gap-0.5">
                                            <HiSparkles className="w-2.5 h-2.5" /> AI Pick
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg/70 text-success backdrop-blur-sm">
                                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                    </span>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-[10px] text-text-muted uppercase tracking-wider">{product.brand}</p>
                                <p className="text-xs font-medium text-text-primary mt-0.5 truncate">{product.name}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <HiStar className="w-3 h-3 text-warning" />
                                    <span className="text-[10px] text-text-secondary">{product.rating} ({product.reviews})</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm font-bold text-text-primary">₹{product.price.toLocaleString()}</span>
                                    <span className="text-[10px] text-text-muted line-through">₹{product.originalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
