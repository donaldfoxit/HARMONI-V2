import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HOME_BG = "/harmoni-hero-bg.png";

// Floating light particles - Subtle
const DreamParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
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
                initial={{ top: '100%', opacity: 0 }}
                animate={{
                    top: '-5%',
                    opacity: [0, 0.5, 0.4, 0]
                }}
                transition={{
                    duration: Math.random() * 16 + 12,
                    repeat: Infinity,
                    delay: Math.random() * 10,
                    ease: 'linear'
                }}
            />
        ))}
    </div>
);

// Subtle ambient light rays
const LightRays = ({ opacity }) => (
    <motion.div
        style={{ opacity }}
        className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
    >
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-white/10 via-white/5 to-transparent transform -rotate-12 origin-top" />
        <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-white/8 via-white/3 to-transparent transform rotate-6 origin-top" />
        <div className="absolute top-0 left-1/2 w-[2px] h-full bg-gradient-to-b from-accent/10 via-accent/5 to-transparent transform -rotate-3 origin-top blur-sm" />
    </motion.div>
);

const HeroSection = ({ onEnter }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"]);

    // Dispersion Mask
    const maskImage = useTransform(scrollYProgress, [0, 1], [
        "linear-gradient(to bottom, black 80%, transparent 100%)",
        "linear-gradient(to bottom, black 0%, transparent 30%)"
    ]);

    return (
        <section
            ref={ref}
            className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center bg-[#000105]"
        >
            {/* Background Image Layer */}
            <motion.div
                style={{
                    scale,
                    opacity,
                    maskImage,
                    WebkitMaskImage: maskImage,
                    filter: blur,
                    backgroundImage: `url('${HOME_BG}')`
                }}
                className="absolute inset-0 z-0 bg-cover bg-center opacity-60 pointer-events-none will-change-transform"
            />

            {/* Gradient Overlay */}
            <motion.div style={{ opacity }} className="absolute inset-0 z-5 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-b from-black/50 via-transparent to-[#000105]" />
            </motion.div>

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_200px_80px_rgba(0,0,0,0.9)]" />

            {/* Ambient Light Rays */}
            <LightRays opacity={opacity} />

            {/* Floating Particles */}
            <DreamParticles />

            {/* Center Content */}
            <motion.div
                style={{ y: yText, opacity }}
                className="relative z-30 flex flex-col items-center pointer-events-auto"
            >
                {/* Decorative Top Line */}
                <motion.div
                    className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-12"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 64, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                />

                {/* Eyebrow Text */}
                <motion.p
                    className="font-montserrat text-[10px] md:text-xs text-accent/80 tracking-[0.6em] uppercase mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    The Journey of
                </motion.p>

                {/* Main Title */}
                <motion.h1
                    className="font-playfair italic font-light text-7xl md:text-9xl lg:text-[11rem] tracking-tight text-white mb-6"
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                    style={{
                        textShadow: '0 0 80px rgba(255,255,255,0.3), 0 0 120px rgba(255,255,255,0.1)'
                    }}
                >
                    Harmoni
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    className="font-playfair italic text-white/50 text-lg md:text-2xl tracking-wide font-light mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    a conversation with the soul
                </motion.p>

                {/* Scroll Indicator */}
                <motion.div
                    className="cursor-pointer group relative flex flex-col items-center"
                    onClick={onEnter}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <div className="w-8 h-14 border border-white/30 rounded-full flex justify-center p-2 group-hover:border-white/60 transition-colors duration-500">
                        <motion.div
                            animate={{ y: [0, 16, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 bg-white/80 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        />
                    </div>
                    <p className="mt-4 font-montserrat text-[10px] tracking-[0.4em] text-white/30 uppercase group-hover:text-white/50 transition-colors duration-500">
                        Scroll to begin
                    </p>
                </motion.div>
            </motion.div>

            {/* Bottom Fade to Black */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#000105] via-[#000105]/90 to-transparent z-25 pointer-events-none" />

            {/* Subtle Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accent/5 blur-[100px] rounded-full pointer-events-none z-20" />
        </section>
    );
};

export default HeroSection;
