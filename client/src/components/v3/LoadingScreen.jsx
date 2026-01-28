import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2500; // 2.5 seconds total load time
        const intervalTime = duration / 100;

        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 600);
                    return 100;
                }
                return prev + 1;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] bg-[#000105] flex flex-col items-center justify-center text-white overflow-hidden"
        >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,102,255,0.08)_0%,_transparent_70%)] pointer-events-none" />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                            opacity: 0
                        }}
                        animate={{
                            y: [null, -100],
                            opacity: [0, 0.6, 0]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* The Counter - Large and Prominent */}
                <motion.h1
                    className="font-playfair text-[10rem] md:text-[14rem] leading-none font-thin tracking-tighter text-white/10"
                    animate={{ opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    {count.toString().padStart(2, '0')}
                </motion.h1>

                {/* Text BELOW the number - Legible and Clear */}
                <motion.p
                    className="font-montserrat text-sm md:text-base tracking-[0.4em] text-white/70 uppercase mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Get ready to journey
                </motion.p>
            </div>

            {/* Progress Bar Line at Bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                <motion.div
                    className="h-full bg-gradient-to-r from-accent/50 via-accent to-accent/50"
                    initial={{ width: "0%" }}
                    animate={{ width: `${count}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
