import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// FIXED: Using your local asset path
const HOME_BG = "/assets/jeffrey-lai-Cz57JO4T0gQ-unsplash.jpg";

const HeroSection = ({ onEnter }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // PARALLAX & DISPERSION EFFECTS
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    // THE DISPERSION: A gradient mask that eats the bottom of the image
    // This creates the "fade into void" effect at the connection point
    const maskImage = useTransform(scrollYProgress, [0, 1], [
        "linear-gradient(to bottom, black 85%, transparent 100%)",
        "linear-gradient(to bottom, black 0%, transparent 20%)"
    ]);

    return (
        <section
            ref={ref}
            className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center bg-[#000105]"
        >
            {/* 1. DISPERSING BACKGROUND LAYER */}
            <motion.div
                style={{
                    scale,
                    opacity,
                    // Apply the dispersion mask
                    maskImage,
                    WebkitMaskImage: maskImage,
                    backgroundImage: `url('${HOME_BG}')`
                }}
                className="absolute inset-0 z-0 bg-cover bg-center opacity-80 pointer-events-none will-change-transform"
            />

            {/* 2. GRADIENT OVERLAY (Subtle) */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 z-10 pointer-events-none"
            >
                <div className="w-full h-full bg-gradient-to-b from-black/20 via-transparent to-[#000105]" />
            </motion.div>

            {/* 3. CINEMATIC CONTENT */}
            <motion.div
                style={{ y: yText, opacity }}
                className="relative z-30 flex flex-col items-center pointer-events-auto"
            >
                {/* TIGHTER SPACING: No bottom margin on the small text */}
                <p className="font-montserrat text-xs md:text-sm text-accent/90 mb-0 tracking-[0.5em] uppercase drop-shadow-lg translate-y-2">
                    The Journey of
                </p>
                {/* BIG TEXT: Tighter tracking, no top margin */}
                <h1 className="font-playfair italic font-medium text-7xl md:text-9xl tracking-tight text-white mb-8 drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                    Harmoni
                </h1>

                <p className="font-playfair italic text-white/80 text-xl md:text-2xl mb-12 tracking-wide font-light drop-shadow-md">
                    a conversation with the soul
                </p>

                {/* Scroll Indicator */}
                <div className="cursor-pointer group relative z-50 pointer-events-auto" onClick={onEnter}>
                    <div className="w-[30px] h-[50px] border-2 border-white rounded-full flex justify-center p-2 opacity-80 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-1 h-1 bg-white rounded-full"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Bottom Blend to ensure smooth connection to next page */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#000105] via-[#000105]/80 to-transparent z-20 pointer-events-none" />
        </section>
    );
};
export default HeroSection;
