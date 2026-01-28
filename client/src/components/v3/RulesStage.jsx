import React from 'react';
import { motion } from 'framer-motion';

const Stickers = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Sticker 1: Holding Hands - Top Left */}
        <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            whileInView={{ opacity: 0.15 }} // Faint
            viewport={{ once: true }}
            className="absolute top-[10%] left-[5%] md:left-[15%] w-40 md:w-56 aspect-[3/4] p-2 bg-white/5 border border-white/10 rotate-[-6deg] shadow-2xl"
        >
            <img
                src="https://images.unsplash.com/photo-1623940698188-4e311a22144b?auto=format&fit=crop&w=400&q=80"
                alt="Intimacy"
                className="w-full h-full object-cover grayscale opacity-80"
            />
        </motion.div>

        {/* Sticker 2: Couple Talking/Laughing - Bottom Right */}
        <motion.div
            initial={{ opacity: 0, rotate: 10 }}
            whileInView={{ opacity: 0.15 }}
            viewport={{ once: true }}
            className="absolute bottom-[15%] right-[5%] md:right-[15%] w-48 md:w-64 aspect-square p-2 bg-white/5 border border-white/10 rotate-[8deg] shadow-2xl"
        >
            <img
                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80"
                alt="Connection"
                className="w-full h-full object-cover grayscale opacity-80"
            />
        </motion.div>

        {/* Sticker 3: Embrace/Trust - Top Right (Floating) */}
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.12 }}
            viewport={{ once: true }}
            className="absolute top-[20%] right-[10%] w-32 md:w-48 aspect-video p-2 bg-white/5 border border-white/10 rotate-[12deg] shadow-2xl"
        >
            <img
                src="https://images.unsplash.com/photo-1529333441280-0a602d92a871?auto=format&fit=crop&w=400&q=80"
                alt="Trust"
                className="w-full h-full object-cover grayscale opacity-80"
            />
        </motion.div>
    </div>
);

const Sparkles = () => {
    const sparkles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 2,
        duration: Math.random() * 1 + 1
    }));

    return (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
            {sparkles.map((s) => (
                <motion.div
                    key={s.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }} // Slightly clearer animate
                    transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
                    style={{ top: s.top, left: s.left }}
                    className="absolute text-blue-200/60 drop-shadow-[0_0_2px_rgba(191,219,254,0.5)]"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ transform: `scale(${s.size})` }}>
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
};

const RulesStage = ({ onConfirm }) => (
    <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative w-full min-h-screen z-50 flex flex-col items-center justify-center text-center p-8 bg-black/95 backdrop-blur-xl overflow-hidden"
    >
        <Stickers />

        <div className="relative max-w-3xl border border-blue-900/30 p-12 rounded-2xl bg-black/50 shadow-[0_0_50px_rgba(0,102,255,0.1)] z-10 backdrop-blur-sm">
            <Sparkles />
            <h2 className="font-playfair text-4xl md:text-6xl mb-8 text-accent">The Covenant</h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed font-montserrat font-light">
                To proceed, you must agree to be truthful, open, and vulnerable.
                <br /><br />
                <span className="text-blue-200">What you discover here depends entirely on what you bring.</span>
            </p>
            <button
                onClick={onConfirm}
                className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-accent/50 hover:border-accent transition-colors cursor-pointer"
            >
                <span className="relative z-10 font-montserrat font-bold tracking-[0.3em] text-sm uppercase text-accent group-hover:text-white transition-colors duration-300">
                    I Am Ready
                </span>
                <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-20" />
            </button>
        </div>
    </motion.section>
);

export default RulesStage;
