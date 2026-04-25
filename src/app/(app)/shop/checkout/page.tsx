'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { HiLockClosed, HiCreditCard, HiMapPin, HiCheck } from 'react-icons/hi2';

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCartStore();
    const { token } = useAuthStore();
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    const handleCheckout = async () => {
        if (!address.trim()) return;
        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: items.map(i => ({
                        productId: i.product.id,
                        quantity: i.quantity,
                        size: i.size,
                        product: i.product,
                    })),
                    total: getTotal(),
                    address,
                }),
            });
            const data = await res.json();
            if (data.order) {
                setOrderId(data.order.id);
                setSuccess(true);
                clearCart();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                        <HiCheck className="w-10 h-10 text-success" />
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">Order Confirmed!</h1>
                    <p className="text-text-secondary text-sm mb-1">Your order <span className="text-accent font-mono">{orderId}</span> is being processed</p>
                    <p className="text-xs text-text-muted mb-6">Estimated delivery in 30 minutes</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => router.push(`/shop/tracking/${orderId}`)} className="btn-primary text-sm">
                            Track Order
                        </button>
                        <button onClick={() => router.push('/shop')} className="btn-secondary text-sm">
                            Continue Shopping
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        router.push('/shop/cart');
        return null;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-bold text-text-primary mb-1">Checkout</h1>
                <p className="text-xs text-text-muted">Complete your order</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Form */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <HiMapPin className="w-4 h-4 text-accent" />
                            <h3 className="text-sm font-semibold text-text-primary">Delivery Address</h3>
                        </div>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="input-field min-h-[100px] resize-none"
                            placeholder="Enter your full delivery address..."
                            required
                        />
                    </div>

                    <div className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <HiCreditCard className="w-4 h-4 text-accent" />
                            <h3 className="text-sm font-semibold text-text-primary">Payment</h3>
                        </div>
                        <div className="space-y-3">
                            <input type="text" className="input-field" placeholder="Card number" defaultValue="4242 4242 4242 4242" />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" className="input-field" placeholder="MM/YY" defaultValue="12/28" />
                                <input type="text" className="input-field" placeholder="CVV" defaultValue="***" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-3">
                            <HiLockClosed className="w-3 h-3 text-text-muted" />
                            <p className="text-[10px] text-text-muted">Secure mock payment — no real charges</p>
                        </div>
                    </div>
                </motion.div>

                {/* Summary */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <div className="card space-y-4">
                        <h3 className="text-sm font-semibold text-text-primary">Order Summary</h3>
                        {items.map(item => (
                            <div key={item.product.id} className="flex items-center gap-3">
                                <div className="w-12 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-text-primary truncate">{item.product.name}</p>
                                    <p className="text-[10px] text-text-muted">Size: {item.size} × {item.quantity}</p>
                                </div>
                                <span className="text-xs font-bold text-text-primary">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}

                        <div className="border-t border-border pt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Subtotal</span>
                                <span className="text-text-primary">₹{getTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Delivery</span>
                                <span className="text-success">FREE</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                                <span className="text-text-primary">Total</span>
                                <span className="text-text-primary">₹{getTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={!address.trim() || loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <HiLockClosed className="w-4 h-4" />
                                    Place Order · ₹{getTotal().toLocaleString()}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
