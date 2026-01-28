import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Floating particles - Subtle
const DreamParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    width: Math.random() * 3 + 2,
                    height: Math.random() * 3 + 2,
                    background: `radial-gradient(circle, rgba(255,255,255,${Math.random() * 0.3 + 0.2}) 0%, transparent 70%)`
                }}
                initial={{ top: '105%', opacity: 0 }}
                animate={{ top: '-5%', opacity: [0, 0.5, 0.4, 0] }}
                transition={{
                    duration: Math.random() * 16 + 12,
                    repeat: Infinity,
                    delay: Math.random() * 8,
                    ease: 'linear'
                }}
            />
        ))}
    </div>
);

const AffirmationStage = ({ onComplete }) => {
    const [showContent, setShowContent] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const contentTimer = setTimeout(() => setShowContent(true), 500);
        const buttonTimer = setTimeout(() => setShowButton(true), 3000);
        return () => {
            clearTimeout(contentTimer);
            clearTimeout(buttonTimer);
        };
    }, []);

    const affirmations = [
        "Transparency",
        "Honesty",
        "Vulnerability",
        "Presence"
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[1000] bg-[#000105] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08)_0%,_transparent_60%)] pointer-events-none" />

            {/* Particles */}
            <DreamParticles />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_80px_rgba(0,0,0,0.9)]" />

            {/* Content */}
            <div className="relative z-10 text-center px-8 max-w-2xl">
                <AnimatePresence>
                    {showContent && (
                        <>
                            {/* "Remember" Title */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                className="font-montserrat text-[10px] tracking-[0.6em] text-accent/60 uppercase mb-4"
                            >
                                Before we begin
                            </motion.p>

                            <motion.h1
                                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 1.2, delay: 0.3 }}
                                className="font-playfair italic text-5xl md:text-7xl text-white/90 mb-8"
                                style={{ textShadow: '0 0 60px rgba(255,255,255,0.2)' }}
                            >
                                Remember
                            </motion.h1>

                            {/* Affirmation Words */}
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
                                {affirmations.map((word, i) => (
                                    <motion.span
                                        key={word}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.8 + i * 0.2 }}
                                        className="font-playfair italic text-lg md:text-xl text-white/50"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Decorative Line */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 60 }}
                                transition={{ duration: 1, delay: 1.8 }}
                                className="h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-6"
                            />

                            {/* Message */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 2 }}
                                className="font-montserrat text-sm text-white/40 leading-relaxed max-w-md mx-auto"
                            >
                                This space is sacred. Share with an open heart, listen without judgment, and be fully present.
                            </motion.p>
                        </>
                    )}
                </AnimatePresence>

                {/* Begin Button */}
                <AnimatePresence>
                    {showButton && (
                        <motion.button
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            onClick={onComplete}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-12 group relative px-14 py-5 rounded-full overflow-hidden"
                        >
                            {/* Button Background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 rounded-full border border-white/20 group-hover:border-white/40 transition-all duration-500 backdrop-blur-sm" />

                            {/* Shimmer */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full"
                                animate={{ x: ['-150%', '150%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            <span className="relative font-playfair italic text-xl text-white/80 group-hover:text-white transition-colors duration-300">
                                I'm Ready
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AffirmationStage;
