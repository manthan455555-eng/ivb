'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { HiMinus, HiPlus, HiTrash, HiShoppingCart } from 'react-icons/hi2';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface flex items-center justify-center">
                    <HiShoppingCart className="w-8 h-8 text-text-muted" />
                </div>
                <p className="text-sm font-medium text-text-secondary mb-1">Your cart is empty</p>
                <p className="text-xs text-text-muted mb-4">Add some fashionable items to get started</p>
                <Link href="/shop" className="btn-primary text-xs py-2 px-4 inline-block">
                    Browse Store
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-bold text-text-primary mb-1">Shopping Cart</h1>
                <p className="text-xs text-text-muted">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </motion.div>

            {/* Items */}
            <div className="space-y-3">
                {items.map((item, i) => (
                    <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card flex gap-4"
                    >
                        <div className="w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-text-muted uppercase">{item.product.brand}</p>
                            <p className="text-sm font-medium text-text-primary truncate">{item.product.name}</p>
                            <p className="text-xs text-text-muted mt-0.5">Size: {item.size}</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-bold text-text-primary">
                                    ₹{(item.product.price * item.quantity).toLocaleString()}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        className="w-7 h-7 rounded-lg bg-surface-hover flex items-center justify-center hover:bg-accent/10 transition-colors"
                                    >
                                        <HiMinus className="w-3 h-3 text-text-secondary" />
                                    </button>
                                    <span className="text-sm font-medium text-text-primary w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        className="w-7 h-7 rounded-lg bg-surface-hover flex items-center justify-center hover:bg-accent/10 transition-colors"
                                    >
                                        <HiPlus className="w-3 h-3 text-text-secondary" />
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.product.id)}
                                        className="w-7 h-7 rounded-lg bg-error/8 flex items-center justify-center hover:bg-error/15 transition-colors ml-1"
                                    >
                                        <HiTrash className="w-3 h-3 text-error" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Summary */}
            <div className="card space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary font-medium">₹{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Delivery</span>
                    <span className="text-success font-medium">FREE</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-text-primary font-bold">Total</span>
                    <span className="text-text-primary font-bold text-lg">₹{getTotal().toLocaleString()}</span>
                </div>
                <Link href="/shop/checkout" className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
}
