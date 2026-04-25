'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { HiStar, HiSparkles, HiShoppingCart, HiArrowLeft, HiCheck } from 'react-icons/hi2';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const product = products.find(p => p.id === params.id);
    const { addItem } = useCartStore();
    const [selectedSize, setSelectedSize] = useState('');
    const [added, setAdded] = useState(false);

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-text-secondary">Product not found</p>
                <Link href="/shop" className="text-accent text-sm mt-2 inline-block">← Back to shop</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!selectedSize) return;
        addItem(product, selectedSize);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors">
                <HiArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card p-0 overflow-hidden"
                >
                    <div className="relative h-[400px] lg:h-[500px]">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        {product.aiRecommended && (
                            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-xs font-bold text-white flex items-center gap-1">
                                <HiSparkles className="w-3.5 h-3.5" /> AI Recommended
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-5"
                >
                    <div>
                        <p className="text-xs text-text-muted uppercase tracking-widest mb-1">{product.brand}</p>
                        <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <HiStar className="w-4 h-4 text-warning" />
                            <span className="text-sm font-medium text-text-primary">{product.rating}</span>
                            <span className="text-xs text-text-muted">({product.reviews} reviews)</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-text-primary">₹{product.price.toLocaleString()}</span>
                        <span className="text-lg text-text-muted line-through">₹{product.originalPrice.toLocaleString()}</span>
                        <span className="text-sm font-bold text-success">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                        </span>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>

                    {/* Size selector */}
                    <div>
                        <p className="text-sm font-medium text-text-primary mb-2">Select Size</p>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${selectedSize === size
                                            ? 'bg-accent text-white'
                                            : 'border border-border text-text-secondary hover:border-accent/20'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {product.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-surface-hover text-text-secondary">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Add to Cart */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedSize || added}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition-all ${added
                                    ? 'bg-success text-white'
                                    : 'btn-primary disabled:opacity-40'
                                }`}
                        >
                            {added ? (
                                <>
                                    <HiCheck className="w-5 h-5" /> Added to Cart
                                </>
                            ) : (
                                <>
                                    <HiShoppingCart className="w-5 h-5" />
                                    {selectedSize ? 'Add to Cart' : 'Select a Size'}
                                </>
                            )}
                        </button>
                        <Link
                            href="/try-on"
                            className="btn-secondary flex items-center gap-2 text-sm"
                        >
                            <HiSparkles className="w-4 h-4" /> Try On
                        </Link>
                    </div>

                    {/* Delivery info */}
                    <div className="card bg-success/3 border-success/10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <p className="text-sm text-success font-medium">Express Delivery Available</p>
                        </div>
                        <p className="text-xs text-text-muted mt-1">Get it delivered in 30 minutes</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
