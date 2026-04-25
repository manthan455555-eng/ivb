'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { HiCamera, HiSparkles, HiCheck, HiArrowRight } from 'react-icons/hi2';

const STYLES = [
    { id: 'classic', label: 'Classic', emoji: '👔', desc: 'Timeless & refined' },
    { id: 'streetwear', label: 'Streetwear', emoji: '🔥', desc: 'Bold & urban' },
    { id: 'minimal', label: 'Minimal', emoji: '✨', desc: 'Clean & simple' },
    { id: 'formal', label: 'Formal', emoji: '🎩', desc: 'Professional' },
    { id: 'casual', label: 'Casual', emoji: '😎', desc: 'Relaxed & easy' },
    { id: 'bohemian', label: 'Bohemian', emoji: '🌿', desc: 'Free-spirited' },
];

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [profileResult, setProfileResult] = useState<{
        faceShape: string;
        skinTone: string;
        bodyType: string;
        styleScore: number;
        recommendedColors: string[];
        styleSummary: string;
        dominantStyle: string;
    } | null>(null);

    const router = useRouter();
    const { token, updateUser } = useAuthStore();

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPhotoPreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleStyle = (id: string) => {
        setSelectedStyles((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const generateProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    preferences: selectedStyles,
                    avatar: photoPreview,
                }),
            });
            const data = await res.json();
            if (data.user) {
                setProfileResult(data.user.styleProfile);
                updateUser(data.user);
                setStep(3);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const finish = () => {
        router.push('/dashboard');
    };

    const steps = [
        { title: 'Your Photo', subtitle: 'Upload a photo for AI analysis' },
        { title: 'Your Style', subtitle: 'Select styles that resonate with you' },
        { title: 'Analyzing...', subtitle: 'Our AI is creating your profile' },
        { title: 'Your Profile', subtitle: 'AI-generated style profile' },
    ];

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            {/* Background glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/6 rounded-full blur-[180px]" />
            </div>

            {/* Progress */}
            <div className="relative z-10 pt-8 px-6">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-2">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-accent to-accent-end' : 'bg-border'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-text-muted">Step {step + 1} of 4</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-md">
                    <AnimatePresence mode="wait">
                        {/* Step 0: Photo Upload */}
                        {step === 0 && (
                            <motion.div
                                key="photo"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-text-primary mb-2">{steps[0].title}</h2>
                                    <p className="text-text-muted">{steps[0].subtitle}</p>
                                </div>

                                <label className="block cursor-pointer">
                                    <div className={`relative mx-auto w-56 h-56 rounded-3xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden ${photoPreview ? 'border-accent/30' : 'border-border hover:border-accent/20'
                                        }`}>
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Upload" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-accent/8 flex items-center justify-center">
                                                    <HiCamera className="w-7 h-7 text-accent" />
                                                </div>
                                                <p className="text-sm text-text-secondary">Tap to upload</p>
                                                <p className="text-xs text-text-muted mt-1">JPG, PNG up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                </label>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        {photoPreview ? 'Continue' : 'Skip for now'}
                                        <HiArrowRight className="w-4 h-4" />
                                    </button>
                                    {!photoPreview && (
                                        <p className="text-center text-xs text-text-muted">You can add a photo later</p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 1: Style Preferences */}
                        {step === 1 && (
                            <motion.div
                                key="styles"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-text-primary mb-2">{steps[1].title}</h2>
                                    <p className="text-text-muted">{steps[1].subtitle}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {STYLES.map((style, i) => (
                                        <motion.button
                                            key={style.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => toggleStyle(style.id)}
                                            className={`relative p-4 rounded-2xl border transition-all duration-300 text-left ${selectedStyles.includes(style.id)
                                                    ? 'border-accent/30 bg-accent/5'
                                                    : 'border-border bg-surface hover:border-accent/10'
                                                }`}
                                        >
                                            {selectedStyles.includes(style.id) && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                                    <HiCheck className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                            <span className="text-2xl">{style.emoji}</span>
                                            <p className="text-sm font-semibold text-text-primary mt-2">{style.label}</p>
                                            <p className="text-xs text-text-muted">{style.desc}</p>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep(0)} className="btn-secondary flex-1">
                                        Back
                                    </button>
                                    <button
                                        onClick={() => { setStep(2); generateProfile(); }}
                                        disabled={selectedStyles.length === 0}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40"
                                    >
                                        <HiSparkles className="w-4 h-4" />
                                        Analyze
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Loading */}
                        {step === 2 && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center py-12 space-y-6"
                            >
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-2 border-accent/15 animate-ping" />
                                    <div className="absolute inset-2 rounded-full border-2 border-accent/20 animate-pulse" />
                                    <div className="w-24 h-24 rounded-full bg-accent/8 flex items-center justify-center">
                                        <HiSparkles className="w-10 h-10 text-accent animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-text-primary">Analyzing your style...</h2>
                                    <p className="text-text-muted text-sm mt-2">Our AI is processing your preferences</p>
                                </div>
                                <div className="flex justify-center gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-accent"
                                            animate={{ y: [0, -8, 0] }}
                                            transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.8 }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Profile Result */}
                        {step === 3 && profileResult && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-text-primary mb-2">Your Style DNA</h2>
                                    <p className="text-text-muted">AI-generated based on your preferences</p>
                                </div>

                                {/* Score Ring */}
                                <div className="flex justify-center">
                                    <div className="relative w-32 h-32">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                                            <motion.circle
                                                cx="60" cy="60" r="50" fill="none"
                                                stroke="url(#gradient)"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${(profileResult.styleScore / 100) * 314} 314`}
                                                initial={{ strokeDasharray: '0 314' }}
                                                animate={{ strokeDasharray: `${(profileResult.styleScore / 100) * 314} 314` }}
                                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#7C5CFF" />
                                                    <stop offset="100%" stopColor="#5B8CFF" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <motion.span
                                                className="text-3xl font-bold text-text-primary"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                {profileResult.styleScore}
                                            </motion.span>
                                            <span className="text-xs text-text-muted">Style Score</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Details */}
                                <div className="card space-y-4">
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="p-3 rounded-2xl bg-surface-hover">
                                            <p className="text-lg font-bold text-text-primary">{profileResult.faceShape}</p>
                                            <p className="text-xs text-text-muted">Face Shape</p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-surface-hover">
                                            <p className="text-lg font-bold text-text-primary">{profileResult.skinTone}</p>
                                            <p className="text-xs text-text-muted">Skin Tone</p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-surface-hover">
                                            <p className="text-lg font-bold text-text-primary">{profileResult.bodyType}</p>
                                            <p className="text-xs text-text-muted">Body Type</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-text-muted mb-2">Recommended Colors</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {profileResult.recommendedColors.map((c, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.8 + i * 0.1 }}
                                                    className="w-8 h-8 rounded-lg border border-border"
                                                    style={{ backgroundColor: c }}
                                                    title={c}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-text-muted mb-1">Style Summary</p>
                                        <p className="text-sm text-text-secondary leading-relaxed">{profileResult.styleSummary}</p>
                                    </div>
                                </div>

                                <button onClick={finish} className="btn-primary w-full flex items-center justify-center gap-2">
                                    <HiSparkles className="w-4 h-4" />
                                    Enter StyleAI
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
