import React from 'react';
import { motion } from 'framer-motion';

const EntryScreen = ({ onEnter }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[9999] bg-[#000105] flex flex-col items-center justify-center"
        >
            {/* Subtle ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.05)_0%,_transparent_60%)] pointer-events-none" />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_80px_rgba(0,0,0,0.9)]" />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="relative z-10 flex flex-col items-center text-center px-8"
            >
                {/* Small decorative line */}
                <motion.div
                    className="w-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"
                    initial={{ width: 0 }}
                    animate={{ width: 32 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                />

                {/* Title */}
                <motion.h1
                    className="font-playfair italic text-4xl md:text-5xl text-white/90 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    style={{ textShadow: '0 0 60px rgba(255,255,255,0.2)' }}
                >
                    Harmoni
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    className="font-montserrat text-[10px] tracking-[0.5em] text-white/40 uppercase mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    A Conversation with the Soul
                </motion.p>

                {/* Enter Button - Larger */}
                <motion.button
                    onClick={onEnter}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-16 py-6 overflow-hidden"
                >
                    {/* Button Background */}
                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/40 transition-colors duration-500" />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-full transition-colors duration-500" />

                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full"
                        animate={{ x: ['-150%', '150%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Button Text */}
                    <span className="relative font-playfair italic text-xl md:text-2xl text-white/70 group-hover:text-white transition-colors duration-300">
                        Tap to begin the journey
                    </span>
                </motion.button>

                {/* Subtle hint */}
                <motion.p
                    className="mt-8 text-white/20 text-xs font-montserrat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    ♪ Music will accompany your experience
                </motion.p>
            </motion.div>
        </motion.div>
    );
};

export default EntryScreen;
