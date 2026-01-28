import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Sparkles, Plus, X, Clock, Music, Sun, Moon } from "lucide-react";
import MagneticButton from './MagneticButton';
import { MistEffect, GlitterEffect } from '../effects/ThemeEffects';

const LandingView = ({
    darkMode, setDarkMode,
    timerDuration, setTimerDuration,
    destinations, destination, setDestination,
    startJourney,
    customQuestions, showAddQuestion, setShowAddQuestion,
    newQuestion, setNewQuestion, addQuestion, removeQuestion
}) => {

    // Staggered Text Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.2 }
        }
    };

    const letterVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", damping: 12, stiffness: 100 }
        }
    };

    const titleText = "HARMONI".split("");

    return (
        <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed inset-0 w-full h-full flex flex-col p-6 overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50'}`}
        >
            <MistEffect />
            <GlitterEffect />

            {/* Background Blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-10 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-blob ${darkMode ? 'bg-indigo-900' : 'bg-indigo-200'}`}></div>
                <div className={`absolute top-20 right-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-blob animation-delay-2000 ${darkMode ? 'bg-pink-900' : 'bg-pink-200'}`}></div>
            </div>

            {/* Header controls */}
            <div className="flex justify-end relative z-50">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-3 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-300 border border-gray-200 shadow-lg hover:scale-110"
                >
                    {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-7xl mx-auto">

                {/* Cinematic Title */}
                <div className="text-center mb-6">
                    <motion.div
                        className="inline-block mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                    >
                        <Heart className="w-16 h-16 md:w-20 md:h-20 text-rose-500 fill-rose-400/30" />
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-9xl font-black mb-2 flex justify-center overflow-hidden"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {titleText.map((char, index) => (
                            <motion.span
                                key={index}
                                variants={letterVariants}
                                className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-indigo-500 to-blue-500"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className={`text-xl md:text-2xl font-light italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                        "Gentle conversations, authentic connections"
                    </motion.p>
                </div>

                {/* Floating Deck (Horizontal Scroll) */}
                <div className="w-full mb-8 relative">
                    <h2 className={`text-center text-xl font-bold mb-6 flex items-center justify-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        <MapPin className="w-5 h-5 text-rose-500" /> Choose Your Atmosphere
                    </h2>

                    <div className="flex w-full overflow-x-auto pb-8 pt-4 px-8 snap-x space-x-6 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {destinations.map((dest, idx) => (
                            <motion.button
                                key={idx}
                                layoutId={`card-${dest.name}`} // Shared Layout ID for portal effect
                                onClick={() => setDestination(dest)}
                                className={`flex-shrink-0 relative w-64 h-96 rounded-3xl overflow-hidden snap-center transition-all duration-500 border ${destination?.name === dest.name
                                        ? 'border-rose-400/80 shadow-2xl scale-105 ring-4 ring-rose-500/20'
                                        : 'border-white/10 hover:border-white/30 hover:scale-105'
                                    } ${darkMode ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-md`}
                            >
                                {/* Card Content */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? dest.darkGradient : dest.gradient} opacity-80`} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                                    <div className="text-6xl mb-4 drop-shadow-lg transform transition-transform group-hover:scale-110">{dest.icon}</div>
                                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dest.name}</h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{dest.description}</p>
                                    {destination?.name === dest.name && (
                                        <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white">
                                            <Music className="w-3 h-3" /> Selected
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Controls Row */}
                <div className="w-full max-w-2xl px-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
                    {/* Timer */}
                    <div className="flex-1 w-full">
                        <h2 className={`text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Clock className="w-4 h-4" /> Session Length
                        </h2>
                        <div className="flex justify-between bg-black/5 rounded-2xl p-1">
                            {[10, 15, 20, 30].map(mins => (
                                <button
                                    key={mins}
                                    onClick={() => setTimerDuration(mins)}
                                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${timerDuration === mins
                                            ? 'bg-white shadow-md text-indigo-600'
                                            : 'text-gray-500 hover:bg-white/50'
                                        }`}
                                >
                                    {mins}m
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Questions Toggle */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => setShowAddQuestion(!showAddQuestion)}
                            className={`p-4 rounded-2xl border transition-all flex items-center gap-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
                                }`}
                        >
                            {showAddQuestion ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            <span className="text-sm font-medium">Add Custom</span>
                        </button>
                    </div>
                </div>

                {/* Add Question Panel */}
                <AnimatePresence>
                    {showAddQuestion && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`w-full max-w-2xl mb-8 overflow-hidden`}
                        >
                            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'} backdrop-blur-md`}>
                                {/* Simplified Add Question UI */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type your question..."
                                        className="flex-1 bg-transparent border-b border-gray-400 focus:border-rose-500 outline-none py-2 px-1"
                                        value={newQuestion.q}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, q: e.target.value })}
                                    />
                                    <button onClick={addQuestion} className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Add</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Enter Button (Gravity Well) */}
                <MagneticButton
                    onClick={startJourney}
                    disabled={!destination || timerDuration === null}
                    className={`group relative px-12 py-6 rounded-full font-black text-xl tracking-widest uppercase transition-all duration-500 ${destination && timerDuration !== null
                            ? 'bg-gray-900 text-white hover:bg-black shadow-2xl hover:shadow-rose-500/20'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Enter The Void <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </span>
                </MagneticButton>

            </div>
        </motion.div>
    );
};

export default LandingView;
