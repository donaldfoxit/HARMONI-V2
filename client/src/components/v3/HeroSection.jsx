import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HOME_BG = "/assets/home-bg.jpg";

const HeroSection = ({ onEnter }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section
            ref={ref}
            className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center bg-black"
        >
            {/* Parallax Layers */}
            <motion.div
                style={{ scale, opacity }}
                className="absolute inset-0 bg-cover bg-center z-10 opacity-60 pointer-events-none"
            >
                <div className="w-full h-full bg-gradient-to-b from-[#000105]/30 to-[#000105]/50" />
            </motion.div>

            <motion.div
                style={{
                    scale,
                    opacity,
                    backgroundImage: `url('${HOME_BG}')`
                }}
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40 pointer-events-none will-change-transform"
            />

            <div className="absolute inset-0 z-[1] bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-center opacity-30 pointer-events-none will-change-transform" />

            {/* Content */}
            <motion.div
                style={{ y: yText, opacity }}
                className="relative z-20 flex flex-col items-center pointer-events-auto"
            >
                <p className="font-playfair italic text-3xl md:text-4xl text-accent mb-4 tracking-wide">The Journey of</p>
                <h1 className="font-montserrat font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter text-white mb-12 drop-shadow-2xl">
                    HARMONI
                </h1>

                <div className="cursor-pointer group relative z-50 pointer-events-auto" onClick={onEnter}>
                    <div className="w-[30px] h-[50px] border-2 border-white rounded-full flex justify-center p-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-1 h-1 bg-white rounded-full"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Shadow Overlay for blend */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#000105] to-transparent z-20 pointer-events-none" />
        </section>
    );
};

export default HeroSection;
