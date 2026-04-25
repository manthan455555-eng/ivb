'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiCamera, HiArrowPath, HiInformationCircle } from 'react-icons/hi2';
import { products } from '@/data/products';
import { generateTryOnConfidence } from '@/lib/ai';

const TRYON_ITEMS = products.filter(p => ['Tops', 'Outerwear'].includes(p.category));

export default function TryOnPage() {
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<typeof TRYON_ITEMS[0] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tryOnResult, setTryOnResult] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setUserPhoto(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const generateTryOn = async () => {
        if (!userPhoto || !selectedItem) return;
        setIsProcessing(true);
        setTryOnResult(false);

        // Simulate AI processing
        await new Promise(r => setTimeout(r, 2500));

        // Generate composite on canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = 500;
                canvas.height = 650;

                // Draw user photo
                const userImg = new Image();
                userImg.crossOrigin = 'anonymous';
                userImg.onload = () => {
                    ctx.drawImage(userImg, 0, 0, 500, 650);

                    // Apply clothing overlay with blend
                    const clothImg = new Image();
                    clothImg.crossOrigin = 'anonymous';
                    clothImg.onload = () => {
                        ctx.globalAlpha = 0.7;
                        ctx.globalCompositeOperation = 'multiply';
                        ctx.drawImage(clothImg, 80, 120, 340, 350);
                        ctx.globalAlpha = 0.3;
                        ctx.globalCompositeOperation = 'screen';
                        ctx.drawImage(clothImg, 80, 120, 340, 350);
                        ctx.globalAlpha = 1;
                        ctx.globalCompositeOperation = 'source-over';

                        // Subtle color tint gradient
                        const grad = ctx.createLinearGradient(0, 120, 0, 470);
                        grad.addColorStop(0, 'rgba(124,92,255,0.04)');
                        grad.addColorStop(0.5, 'rgba(91,140,255,0.06)');
                        grad.addColorStop(1, 'rgba(124,92,255,0.02)');
                        ctx.fillStyle = grad;
                        ctx.fillRect(80, 120, 340, 350);

                        setConfidence(generateTryOnConfidence());
                        setIsProcessing(false);
                        setTryOnResult(true);
                    };
                    clothImg.src = selectedItem.image;
                };
                userImg.src = userPhoto;
            }
        } else {
            setConfidence(generateTryOnConfidence());
            setIsProcessing(false);
            setTryOnResult(true);
        }
    };

    const handleSliderMove = (clientX: number) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
    };

    const handleMouseDown = () => setIsDragging(true);

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) handleSliderMove(e.clientX);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) handleSliderMove(e.touches[0].clientX);
        };

        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchend', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isDragging]);

    const reset = () => {
        setTryOnResult(false);
        setSelectedItem(null);
        setConfidence(0);
        setSliderPos(50);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-accent/8 flex items-center justify-center">
                        <HiSparkles className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary">Virtual Try-On</h1>
                        <p className="text-xs text-text-muted">AI-powered clothing preview</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Photo + Result */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <div className="card p-0 overflow-hidden">
                        {!userPhoto ? (
                            <label className="flex flex-col items-center justify-center h-[450px] cursor-pointer hover:bg-white/[0.01] transition-colors">
                                <div className="w-16 h-16 rounded-2xl bg-accent/8 flex items-center justify-center mb-4">
                                    <HiCamera className="w-8 h-8 text-accent" />
                                </div>
                                <p className="text-sm font-medium text-text-primary mb-1">Upload Your Photo</p>
                                <p className="text-xs text-text-muted">Full body photo recommended</p>
                                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                            </label>
                        ) : tryOnResult ? (
                            /* Before / After Slider */
                            <div
                                ref={sliderRef}
                                className="relative h-[450px] select-none cursor-col-resize overflow-hidden"
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleMouseDown}
                            >
                                {/* Before (original) */}
                                <img src={userPhoto} alt="Before" className="absolute inset-0 w-full h-full object-cover" />

                                {/* After (try-on) */}
                                <div
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                                >
                                    <canvas ref={canvasRef} className="w-full h-full object-cover" />
                                    {/* If canvas isn't showing, use composite overlay */}
                                    <div className="absolute inset-0">
                                        <img src={userPhoto} alt="Base" className="absolute inset-0 w-full h-full object-cover" />
                                        {selectedItem && (
                                            <div className="absolute top-[18%] left-[16%] w-[68%] h-[54%]" style={{ mixBlendMode: 'multiply' }}>
                                                <img
                                                    src={selectedItem.image}
                                                    alt="Clothing"
                                                    className="w-full h-full object-cover opacity-70 rounded-lg"
                                                    style={{ filter: 'brightness(1.1) contrast(1.05)' }}
                                                />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-b from-accent/3 via-transparent to-accent-end/3" />
                                    </div>
                                </div>

                                {/* Slider handle */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
                                    style={{ left: `${sliderPos}%` }}
                                >
                                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-4 bg-text-muted rounded-full" />
                                            <div className="w-0.5 h-4 bg-text-muted rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                {/* Labels */}
                                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-bg/70 text-[10px] font-medium text-text-primary backdrop-blur-sm">
                                    BEFORE
                                </div>
                                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-accent/80 text-[10px] font-medium text-white backdrop-blur-sm">
                                    AFTER
                                </div>

                                {/* Confidence badge */}
                                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full glass text-xs font-medium text-text-primary flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    {confidence}% fit match
                                </div>
                            </div>
                        ) : (
                            <div className="relative h-[450px]">
                                <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-bg/70 flex flex-col items-center justify-center backdrop-blur-sm">
                                        <div className="relative w-20 h-20 mb-4">
                                            <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
                                            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                                                <HiSparkles className="w-8 h-8 text-accent animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-text-primary">Processing AI overlay...</p>
                                        <p className="text-xs text-text-secondary mt-1">Adapting to body shape & lighting</p>
                                        <div className="flex gap-1 mt-3">
                                            {[0, 1, 2].map(i => (
                                                <motion.div
                                                    key={i}
                                                    className="w-1.5 h-1.5 rounded-full bg-accent"
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.7 }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* AI Disclaimer */}
                    {tryOnResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-2 mt-3 p-3 rounded-2xl bg-warning/5 border border-warning/10"
                        >
                            <HiInformationCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-warning/80">
                                <span className="font-semibold">AI Preview</span> — This is a simulated try-on generated by AI. Actual appearance may vary. Drag the slider to compare.
                            </p>
                        </motion.div>
                    )}

                    {/* Action buttons */}
                    {userPhoto && (
                        <div className="flex gap-3 mt-4">
                            {tryOnResult ? (
                                <button onClick={reset} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
                                    <HiArrowPath className="w-4 h-4" /> Try Another
                                </button>
                            ) : (
                                <>
                                    <label className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm cursor-pointer">
                                        <HiCamera className="w-4 h-4" /> Change Photo
                                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                    </label>
                                    <button
                                        onClick={generateTryOn}
                                        disabled={!selectedItem || isProcessing}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-40"
                                    >
                                        <HiSparkles className="w-4 h-4" />
                                        {isProcessing ? 'Processing...' : 'Generate Try-On'}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Right: Clothing Selection */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-sm font-semibold text-text-primary mb-3">Select Clothing</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {TRYON_ITEMS.map((item, i) => (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                                onClick={() => { setSelectedItem(item); setTryOnResult(false); }}
                                className={`card p-0 overflow-hidden text-left transition-all ${selectedItem?.id === item.id
                                        ? 'ring-2 ring-accent border-accent/30'
                                        : 'hover:border-accent/10'
                                    }`}
                            >
                                <div className="relative h-36 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {selectedItem?.id === item.id && (
                                        <div className="absolute inset-0 bg-accent/15 flex items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                                <HiSparkles className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="text-xs font-medium text-text-primary truncate">{item.name}</p>
                                    <p className="text-[10px] text-text-muted">{item.brand}</p>
                                    <p className="text-xs font-bold text-text-primary mt-1">₹{item.price.toLocaleString()}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
