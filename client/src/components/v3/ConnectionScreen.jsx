import React from 'react';
import { motion } from 'framer-motion';

const ConnectionScreen = ({ onContinue }) => {
    return (
        <section className="relative min-h-screen w-full flex items-center justify-center bg-[#000105] overflow-hidden">
            {/* Subtle background texture */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.06)_0%,_transparent_60%)] pointer-events-none" />

            {/* Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_200px_80px_rgba(0,0,0,0.85)] pointer-events-none" />

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-4xl px-8 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2 }}
            >
                {/* Decorative line */}
                <motion.div
                    className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-12"
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                />

                {/* Main quote */}
                <motion.h2
                    className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-white/90 leading-tight mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    style={{ textShadow: '0 0 80px rgba(255,255,255,0.1)' }}
                >
                    The deepest connections<br />
                    begin with a single question
                </motion.h2>

                {/* Subtext */}
                <motion.p
                    className="font-montserrat text-white/40 text-sm md:text-base tracking-wide max-w-2xl mx-auto mb-16 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    To truly know someone is to see beyond the surface—<br className="hidden md:block" />
                    to understand their fears, their dreams, their quiet truths.
                </motion.p>

                {/* Second quote block */}
                <motion.div
                    className="border-l border-white/10 pl-6 md:pl-8 text-left max-w-xl mx-auto mb-16"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                >
                    <p
                        className="font-playfair italic text-xl md:text-2xl text-white/60 leading-relaxed"
                    >
                        "We don't connect through answers. We connect through the courage to ask."
                    </p>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={onContinue}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 0.6 }}
                    whileHover={{ y: 5 }}
                >
                    <p className="font-montserrat text-[9px] tracking-[0.4em] text-white/25 uppercase mb-3 group-hover:text-white/40 transition-colors">
                        Begin your journey
                    </p>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <svg className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#000105] to-transparent pointer-events-none" />
        </section>
    );
};

export default ConnectionScreen;
