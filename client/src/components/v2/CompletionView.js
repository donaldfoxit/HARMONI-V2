import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles } from "lucide-react";
import MagneticButton from './MagneticButton';
import { MistEffect, getThemeEffect } from '../effects/ThemeEffects';
import ParticleBackground from '../../ParticleBackground';

const CompletionView = ({
    darkMode, setDarkMode,
    destination, resetJourney,
    scrollVelocity,
    deepLevel, answers, answeredCount
}) => {

    // Stardust Visual: generate stars based on answeredCount
    const stars = Array.from({ length: Math.min(answeredCount * 2, 50) }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2
    }));

    return (
        <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }} // Slow cinematic fade
            className={`fixed inset-0 w-full h-full flex flex-col items-center justify-center p-4 transition-colors duration-1000 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-[#f8f9fa]'
                }`}
        >
            <ParticleBackground darkMode={darkMode} intensity="normal" />
            {getThemeEffect(destination.theme, scrollVelocity)}
            <MistEffect />

            {/* Stardust Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0], y: [0, -20] }}
                        transition={{
                            duration: star.duration,
                            delay: star.delay,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 2
                        }}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                        }}
                        className={`absolute rounded-full ${darkMode ? 'bg-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'}`}
                    />
                ))}
            </div>

            <button
                onClick={() => setDarkMode(!darkMode)}
                className="fixed top-6 right-6 z-50 p-3 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-300 border border-gray-200 shadow-lg hover:scale-110"
            >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-3xl w-full relative z-10 text-center"
            >
                <div className={`${darkMode ? 'bg-gray-800/90 text-gray-100 border-gray-700' : 'bg-white/90 text-gray-800 border-gray-200'} backdrop-blur-xl rounded-[3rem] p-8 md:p-14 shadow-2xl border`}>
                    <div className="mb-10">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="text-8xl md:text-9xl mb-8 text-gray-700 inline-block"
                        >
                            {destination.icon}
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
                            Journey Complete
                        </h1>
                        <p className={`text-2xl md:text-3xl font-light italic mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {destination.name}
                        </p>

                        <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-bold text-amber-500">{deepLevel}</span>
                                <span className={`text-sm uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connection Level</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-bold text-indigo-500">{answeredCount}</span>
                                <span className={`text-sm uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Moments Shared</span>
                            </div>
                        </div>
                    </div>

                    <div className={`mb-12 p-8 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/80 border-gray-200'} rounded-3xl border`}>
                        <p className={`font-playfair text-xl md:text-2xl leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            "This space you've created together is precious. Keep nurturing these conversations,
                            staying curious, and building something beautiful—one gentle moment at a time."
                        </p>
                    </div>

                    <MagneticButton
                        onClick={resetJourney}
                        className="w-full py-6 bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600 text-white rounded-full font-bold text-xl md:text-2xl transition-all duration-300 shadow-xl"
                    >
                        Begin Another Journey
                    </MagneticButton>
                </div>
            </motion.div>

        </motion.div>
    );
};

export default CompletionView;
