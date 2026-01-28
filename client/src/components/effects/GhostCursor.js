import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const GhostCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 bg-white/10 backdrop-blur-sm pointer-events-none z-[9999] mix-blend-difference"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
            }}
        />
    );
};

export default GhostCursor;
