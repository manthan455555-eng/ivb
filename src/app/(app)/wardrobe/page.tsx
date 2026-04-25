'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { HiPlus, HiXMark, HiFunnel, HiSparkles, HiTrash } from 'react-icons/hi2';
import { IoShirt } from 'react-icons/io5';

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories', 'Dresses', 'Other'];
const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop',
];

export default function WardrobePage() {
    const { token } = useAuthStore();
    const { items, setItems, addItem, removeItem } = useWardrobeStore();
    const [showAdd, setShowAdd] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemImage, setNewItemImage] = useState('');
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(false);
    const [showOutfitBuilder, setShowOutfitBuilder] = useState(false);
    const [selectedForOutfit, setSelectedForOutfit] = useState<string[]>([]);
    const [outfitGenerated, setOutfitGenerated] = useState(false);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const res = await fetch('/api/wardrobe', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.items) setItems(data.items);
            } catch (e) {
                console.error(e);
            }
        };
        if (token) loadItems();
    }, [token, setItems]);

    const handleAddItem = async () => {
        if (!newItemName.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/wardrobe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newItemName,
                    image: newItemImage || SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
                }),
            });
            const data = await res.json();
            if (data.item) {
                addItem(data.item);
                setNewItemName('');
                setNewItemImage('');
                setShowAdd(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/wardrobe?id=${id}`, { method: 'DELETE' });
        removeItem(id);
    };

    const toggleOutfitItem = (id: string) => {
        setSelectedForOutfit(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
        setOutfitGenerated(false);
    };

    const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-accent/8 flex items-center justify-center">
                        <IoShirt className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">Smart Wardrobe</h1>
                        <p className="text-xs text-text-muted">{items.length} items</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowOutfitBuilder(!showOutfitBuilder)}
                        className={`btn-secondary text-xs py-2 px-3 ${showOutfitBuilder ? 'bg-accent/12 border-accent/25' : ''}`}
                    >
                        <HiSparkles className="w-3.5 h-3.5 inline mr-1" />
                        Build Outfit
                    </button>
                    <button onClick={() => setShowAdd(true)} className="btn-primary text-xs py-2 px-3">
                        <HiPlus className="w-4 h-4 inline mr-1" />
                        Add Item
                    </button>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
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

            {/* Outfit Builder Banner */}
            {showOutfitBuilder && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card bg-accent/3 border-accent/10"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-text-primary">
                            <HiSparkles className="w-4 h-4 inline mr-1 text-accent" />
                            Outfit Builder — Select items to combine
                        </p>
                        <span className="text-xs text-text-muted">{selectedForOutfit.length} selected</span>
                    </div>
                    {selectedForOutfit.length >= 2 && !outfitGenerated && (
                        <button
                            onClick={() => setOutfitGenerated(true)}
                            className="btn-primary text-xs py-2 px-4 mt-2"
                        >
                            <HiSparkles className="w-3.5 h-3.5 inline mr-1" />
                            Generate Outfit
                        </button>
                    )}
                    {outfitGenerated && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-3 rounded-2xl bg-success/5 border border-success/10"
                        >
                            <p className="text-sm text-success font-medium">✨ Great combination!</p>
                            <p className="text-xs text-text-secondary mt-1">
                                This outfit has an <span className="text-text-primary font-semibold">{Math.floor(Math.random() * 15 + 82)}%</span> harmony score.
                                The colors and styles complement each other well.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Grid */}
            {filteredItems.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface flex items-center justify-center">
                        <IoShirt className="w-8 h-8 text-text-muted" />
                    </div>
                    <p className="text-sm font-medium text-text-secondary mb-1">No items yet</p>
                    <p className="text-xs text-text-muted mb-4">Add clothing items to build your smart wardrobe</p>
                    <button onClick={() => setShowAdd(true)} className="btn-primary text-xs py-2 px-4">
                        <HiPlus className="w-4 h-4 inline mr-1" /> Add First Item
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => showOutfitBuilder && toggleOutfitItem(item.id)}
                            className={`card p-0 overflow-hidden group relative ${showOutfitBuilder ? 'cursor-pointer' : ''
                                } ${selectedForOutfit.includes(item.id) ? 'ring-2 ring-accent' : ''}`}
                        >
                            <div className="relative h-40 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {selectedForOutfit.includes(item.id) && (
                                    <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                                            ✓
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-bg/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error backdrop-blur-sm"
                                >
                                    <HiTrash className="w-3.5 h-3.5 text-white" />
                                </button>
                            </div>
                            <div className="p-3">
                                <p className="text-xs font-medium text-text-primary truncate">{item.name}</p>
                                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-hover text-text-secondary">{item.category}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-hover text-text-secondary">{item.color}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Item Modal */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-sm px-4"
                        onClick={() => setShowAdd(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="card w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-text-primary">Add to Wardrobe</h3>
                                <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-surface-hover rounded-lg transition-colors">
                                    <HiXMark className="w-5 h-5 text-text-secondary" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Item Name</label>
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="input-field"
                                        placeholder="e.g., Black Slim Fit Blazer"
                                    />
                                    <p className="text-[10px] text-text-muted mt-1">AI will auto-detect category, color & occasion</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Image URL (optional)</label>
                                    <input
                                        type="text"
                                        value={newItemImage}
                                        onChange={(e) => setNewItemImage(e.target.value)}
                                        className="input-field"
                                        placeholder="https://..."
                                    />
                                </div>

                                <button
                                    onClick={handleAddItem}
                                    disabled={!newItemName.trim() || loading}
                                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <HiSparkles className="w-4 h-4" />
                                            Add & Auto-Tag
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
