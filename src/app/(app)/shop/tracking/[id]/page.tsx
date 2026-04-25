'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiMapPin, HiClock, HiCheck, HiTruck, HiArchiveBox, HiInboxArrowDown } from 'react-icons/hi2';

const STATUSES = [
    { key: 'confirmed', label: 'Order Confirmed', icon: HiCheck, description: 'Your order has been confirmed and is being prepared' },
    { key: 'packed', label: 'Packed', icon: HiArchiveBox, description: 'Your items have been carefully packed' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: HiTruck, description: 'Your order is on its way to you' },
    { key: 'arriving', label: 'Arriving Soon', icon: HiMapPin, description: 'Almost there! Your rider is nearby' },
    { key: 'delivered', label: 'Delivered', icon: HiInboxArrowDown, description: 'Your order has been delivered' },
];

export default function OrderTrackingPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [currentStatus, setCurrentStatus] = useState(0);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 min in seconds

    // Simulate order progression
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStatus(prev => {
                if (prev < STATUSES.length - 1) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, 8000); // Progress every 8 seconds for demo
        return () => clearInterval(interval);
    }, []);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = ((currentStatus + 1) / STATUSES.length) * 100;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl font-bold text-text-primary">Order Tracking</h1>
                <p className="text-xs text-text-muted font-mono mt-1">{orderId}</p>
            </motion.div>

            {/* Timer Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                <div className="relative text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <HiClock className="w-5 h-5 text-accent" />
                        <span className="text-sm text-text-secondary">Estimated Delivery</span>
                    </div>
                    <div className="text-4xl font-bold text-text-primary font-mono">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <p className="text-xs text-text-muted mt-1">minutes remaining</p>

                    {/* Progress bar */}
                    <div className="mt-4 h-1.5 bg-border rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-accent to-accent-end rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Map Simulation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-0 overflow-hidden"
            >
                <div className="relative h-48 bg-surface">
                    {/* Simulated map grid */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
              linear-gradient(rgba(124,92,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,92,255,0.04) 1px, transparent 1px)
            `,
                        backgroundSize: '30px 30px',
                    }} />

                    {/* Route line */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                        <motion.path
                            d="M 50 150 Q 120 80, 200 100 Q 280 120, 350 50"
                            fill="none"
                            stroke="rgba(124,92,255,0.3)"
                            strokeWidth="2"
                            strokeDasharray="8 4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: 'easeInOut' }}
                        />
                        <motion.path
                            d="M 50 150 Q 120 80, 200 100 Q 280 120, 350 50"
                            fill="none"
                            stroke="url(#routeGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress / 100 }}
                            transition={{ duration: 0.5 }}
                        />
                        <defs>
                            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#7C5CFF" />
                                <stop offset="100%" stopColor="#5B8CFF" />
                            </linearGradient>
                        </defs>

                        {/* Start point */}
                        <circle cx="50" cy="150" r="6" fill="#7C5CFF" />
                        <circle cx="50" cy="150" r="10" fill="none" stroke="#7C5CFF" strokeWidth="2" opacity="0.3" />

                        {/* End point */}
                        <circle cx="350" cy="50" r="6" fill="#5B8CFF" />
                        <circle cx="350" cy="50" r="10" fill="none" stroke="#5B8CFF" strokeWidth="2" opacity="0.3" />

                        {/* Rider dot */}
                        <motion.circle
                            r="5"
                            fill="#22C55E"
                            animate={{
                                cx: [50, 120, 200, 280, 350],
                                cy: [150, 100, 100, 80, 50],
                            }}
                            transition={{
                                duration: 40,
                                ease: 'linear',
                                repeat: 0,
                            }}
                        />
                    </svg>

                    {/* Labels */}
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg glass text-[10px] text-text-secondary">
                        📦 Store
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg glass text-[10px] text-text-secondary">
                        🏠 Your Location
                    </div>
                </div>
            </motion.div>

            {/* Status Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
            >
                <h3 className="text-sm font-semibold text-text-primary mb-4">Delivery Status</h3>
                <div className="space-y-0">
                    {STATUSES.map((status, i) => {
                        const isActive = i === currentStatus;
                        const isDone = i < currentStatus;
                        const Icon = status.icon;

                        return (
                            <div key={status.key} className="flex gap-3">
                                {/* Timeline */}
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isDone
                                                ? 'bg-success'
                                                : isActive
                                                    ? 'bg-accent pulse-glow'
                                                    : 'bg-surface-hover'
                                            }`}
                                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <Icon className={`w-4 h-4 ${isDone || isActive ? 'text-white' : 'text-text-muted'}`} />
                                    </motion.div>
                                    {i < STATUSES.length - 1 && (
                                        <div className={`w-0.5 h-8 transition-all duration-500 ${isDone ? 'bg-success' : 'bg-border'
                                            }`} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="pb-6">
                                    <p className={`text-sm font-medium transition-colors ${isDone || isActive ? 'text-text-primary' : 'text-text-muted'
                                        }`}>
                                        {status.label}
                                    </p>
                                    {(isDone || isActive) && (
                                        <p className="text-xs text-text-muted mt-0.5">{status.description}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
