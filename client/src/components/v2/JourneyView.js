import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Home, Clock, Music, Sun, Moon, Sparkles, Flame, Dice6 } from "lucide-react";
import MagneticButton from './MagneticButton';
import { MistEffect, getThemeEffect } from '../effects/ThemeEffects';
import { YouTubePlayer } from '../audio/YouTubePlayer';

const CircularTimer = ({ timeRemaining, duration, darkMode }) => {
    if (timeRemaining === null || duration === null) return null;

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const progress = timeRemaining / (duration * 60);
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="24" cy="24" r={radius}
                    stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                    strokeWidth="4"
                    fill="transparent"
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "linear" }}
                    cx="24" cy="24" r={radius}
                    stroke={timeRemaining < 60 ? "#ef4444" : "#ec4899"} // Red if < 1 min
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />
            </svg>
            <span className={`absolute text-[10px] font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {Math.ceil(timeRemaining / 60)}m
            </span>
        </div>
    );
};

const JourneyView = ({
    darkMode, setDarkMode,
    destination, resetJourney,
    scrollVelocity,
    audioPlaying, setAudioPlaying, toggleAudio,
    timerActive, timeRemaining, timerDuration, formatTime,
    showRiskyQuestion, currentRiskyQuestion, handleRiskyResponse,
    showDiceRoll, setShowDiceRoll, rollDice,
    showBondingPrompt, currentBondingPrompt, setShowBondingPrompt,
    roundInfo, currentRound, currentQuestion, deepLevel,
    currentRoundQuestions, totalQuestionsInRound,
    progress, answers,
    handleContinue, handleDareToRisk, riskyQuestions
}) => {

    const getGradient = (dest) => darkMode ? dest.darkGradient : dest.gradient;

    const breathAnimation = {
        animate: {
            scale: [1, 1.02, 1],
            opacity: [1, 0.9, 1],
            transition: {
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
            }
        }
    };

    return (
        <motion.div
            key="journey"
            layoutId={`card-${destination.name}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed inset-0 w-full h-full flex items-center justify-center p-4 bg-gradient-to-br ${getGradient(destination)}`}
        >
            {/* Background Effects */}
            {getThemeEffect(destination.theme, scrollVelocity)}
            <MistEffect />

            {/* Audio Setup Overlay */}
            {!audioPlaying && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-in cursor-pointer"
                    onClick={() => setAudioPlaying(true)}
                >
                    <div className="bg-gradient-to-br from-rose-500 to-indigo-500 p-8 rounded-3xl max-w-md mx-4 text-center">
                        <Music className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
                        <h3 className="text-white text-2xl font-bold mb-4">Enable Background Music</h3>
                        <p className="text-white/90 mb-6">Click anywhere to start gentle ambient music</p>
                        <div className="text-white/70 text-sm mb-2">🎵 {destination?.songName}</div>
                        <div className="text-white/50 text-xs">{destination?.songArtist}</div>
                    </div>
                </div>
            )}

            {/* YouTube Player */}
            <YouTubePlayer
                videoId={destination.youtubeId}
                isPlaying={audioPlaying}
                onToggle={toggleAudio}
            />

            {/* Floating Visual */}
            <div className="absolute top-10 right-10 text-6xl md:text-8xl opacity-10 animate-float-slow pointer-events-none">
                {destination.visual}
            </div>

            {/* Controls: Mode, Home, Timer */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="fixed top-6 right-6 z-40 p-3 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-300 border border-gray-200 shadow-lg hover:scale-110"
            >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
                onClick={resetJourney}
                className="fixed top-6 left-6 z-40 p-3 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-300 border border-gray-200 shadow-lg hover:scale-110"
            >
                <Home className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Circular Timer Horizon */}
            {timerActive && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40">
                    <CircularTimer timeRemaining={timeRemaining} duration={timerDuration} darkMode={darkMode} />
                </div>
            )}

            {/* --- Main Question Card --- */}
            <div className="w-full max-w-3xl px-4 relative z-10 flex flex-col items-center">

                {/* Metadata */}
                <div className="mb-8 text-center">
                    <h2 className={`text-2xl md:text-4xl font-bold font-playfair mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {roundInfo[currentRound].name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                            Round {currentRound + 1}/7
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                            {currentQuestion + 1}/{totalQuestionsInRound}
                        </span>
                    </div>
                </div>

                {/* Question Container */}
                <motion.div
                    className={`relative w-full p-10 md:p-16 rounded-[3rem] shadow-2xl transition-colors duration-500 border ${darkMode ? 'bg-black/40 border-white/5' : 'bg-white/60 border-white/40'
                        } backdrop-blur-3xl`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                >
                    {/* Dynamic Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(destination)} opacity-5 rounded-[3rem] pointer-events-none`} />

                    {currentRoundQuestions[currentQuestion] ? (
                        <div className="relative z-10 flex flex-col items-center">

                            {/* The "Breath" Question */}
                            <motion.p
                                variants={breathAnimation}
                                animate="animate"
                                className={`text-3xl md:text-5xl font-playfair font-medium text-center mb-16 leading-relaxed ${darkMode ? 'text-white/95 drop-shadow-lg' : 'text-gray-900 drop-shadow-sm'
                                    }`}
                            >
                                "{currentRoundQuestions[currentQuestion].q}"
                            </motion.p>

                            {/* Actions */}
                            <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg">
                                <MagneticButton
                                    onClick={handleContinue}
                                    className={`flex-1 py-5 rounded-full font-bold text-lg tracking-wide transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-black'
                                        }`}
                                >
                                    Continue <span className="text-xl">→</span>
                                </MagneticButton>

                                {riskyQuestions && riskyQuestions.length > 0 && (
                                    <MagneticButton
                                        onClick={handleDareToRisk}
                                        className={`flex-1 py-5 rounded-full font-bold text-lg tracking-wide border-2 flex items-center justify-center gap-3 transition-all ${darkMode
                                            ? 'border-rose-500/50 text-rose-300 hover:bg-rose-500/10'
                                            : 'border-rose-500 text-rose-600 hover:bg-rose-50'
                                            }`}
                                    >
                                        <Flame className="w-5 h-5" /> Dare to Risk
                                    </MagneticButton>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-xl text-gray-500 mb-6">Round Complete</p>
                            <button onClick={handleContinue} className="px-6 py-3 bg-blue-500 text-white rounded-xl">Continue</button>
                        </div>
                    )}
                </motion.div>

                {/* Footer Info */}
                <div className="mt-8 flex items-center justify-between w-full max-w-2xl px-8 opacity-60">
                    <div className="flex items-center gap-2 text-xs">
                        <Music className="w-3 h-3" />
                        <span>{destination.songName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Level: {deepLevel}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-200/20">
                    <motion.div
                        className="h-full bg-gradient-to-r from-rose-500 to-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(progress / 400) * 100}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>

            </div>

            {/* --- Modals (Liquid Glass) --- */}

            <AnimatePresence>
                {/* 1. Risky Question Modal */}
                {showRiskyQuestion && currentRiskyQuestion && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className={`relative w-full max-w-lg p-10 rounded-[2.5rem] overflow-hidden border-2 ${darkMode ? 'bg-black/80 border-rose-500/50' : 'bg-white/90 border-rose-500'
                                } shadow-[0_0_50px_rgba(244,63,94,0.3)]`}
                        >
                            {/* Liquid Border Effect handled by CSS shadow and border */}
                            <div className="text-center">
                                <Flame className="w-12 h-12 text-rose-500 mx-auto mb-6 animate-pulse" />
                                <h3 className={`text-3xl font-playfair font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>High Stakes</h3>
                                <p className={`text-2xl font-medium mb-10 leading-relaxed font-playfair ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    "{currentRiskyQuestion.q}"
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={() => handleRiskyResponse(true)} className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-500/30 transition-all">
                                        Accept Risk
                                    </button>
                                    <button onClick={() => handleRiskyResponse(false)} className="flex-1 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* 2. Bonding Dice Modal */}
                {showDiceRoll && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: -90, opacity: 0 }}
                            className="bg-gradient-to-br from-indigo-600 to-violet-600 p-10 rounded-3xl shadow-2xl max-w-md mx-4 text-center border border-white/20 transform perspective-1000"
                        >
                            <Dice6 className="w-24 h-24 text-white mx-auto mb-6 animate-spin-slow" />
                            <h3 className="text-white text-3xl font-bold mb-3 font-playfair">Fate's Call</h3>
                            <p className="text-indigo-100 mb-8 text-lg">Roll the dice for a shared moment.</p>
                            <div className="flex gap-4">
                                <button onClick={rollDice} className="flex-1 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Roll</button>
                                <button onClick={() => setShowDiceRoll(false)} className="flex-1 py-3 bg-indigo-800/50 text-white rounded-xl font-bold hover:bg-indigo-800 transition-colors">Skip</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* 3. Bonding Prompt Result */}
                {showBondingPrompt && currentBondingPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                            className={`p-10 rounded-3xl shadow-2xl max-w-md mx-4 border border-white/20 text-center backdrop-blur-xl ${currentBondingPrompt.intensity === 'high' ? 'bg-gradient-to-br from-rose-600/90 to-pink-600/90' :
                                currentBondingPrompt.intensity === 'medium' ? 'bg-gradient-to-br from-violet-600/90 to-purple-600/90' :
                                    'bg-gradient-to-br from-blue-600/90 to-cyan-600/90'
                                }`}
                        >
                            <div className="text-7xl mb-6">{
                                currentBondingPrompt.type === 'pulse' ? '🫀' : '✨'
                                // (Icons simplified for brevity, assume mapped or generic)
                            }</div>
                            <p className="text-white text-2xl font-playfair font-medium leading-relaxed mb-8">
                                {currentBondingPrompt.text}
                            </p>
                            <button onClick={() => setShowBondingPrompt(false)} className="w-full py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold transition-all">
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default JourneyView;
