import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Flame, Heart } from 'lucide-react';

// ============================================
// CINEMATIC QUESTION PAGE
// Inspired by Iron Hill & The Goonies aesthetics
// ============================================

const JourneyInterface = ({
    data,
    onNext,
    onHome,
    onBond,
    actions
}) => {
    const {
        currentQuestionData,
        showRiskyQuestion,
        currentRiskyQuestion,
        questionsAnswered = 0,
    } = data;

    const questionText = currentQuestionData?.q || "Breathe...";

    // Risk glow activation
    const isRiskGlowing = questionsAnswered >= 5;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 bg-[#030208] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* === BACKGROUND LAYERS === */}

            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612] via-[#030208] to-[#000105]" />

            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,_rgba(88,28,135,0.08)_0%,_transparent_60%)]" />

            {/* Film grain overlay */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Heavy vignette for cinema feel */}
            <div className="absolute inset-0 shadow-[inset_0_0_300px_100px_rgba(0,0,0,0.9)] pointer-events-none" />


            {/* === HOME BUTTON === */}
            <motion.button
                onClick={onHome}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.1, rotate: -90 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-8 left-8 md:top-12 md:left-12 p-3 rounded-full text-white/20 hover:text-white/60 transition-colors duration-500 z-50"
            >
                <Home className="w-5 h-5" />
            </motion.button>


            {/* === MAIN QUESTION - THE HERO === */}
            <div className="relative z-30 w-full max-w-5xl px-6 md:px-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={questionText}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className="text-center"
                    >
                        {/* Question text - Large, bold, cinematic */}
                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.15] tracking-tight"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: 'italic',
                                color: 'rgba(255, 255, 255, 0.92)',
                                textShadow: '0 4px 60px rgba(0,0,0,0.5)',
                            }}
                        >
                            {questionText}
                        </h1>
                    </motion.div>
                </AnimatePresence>
            </div>


            {/* === BOTTOM CONTROLS === */}
            <motion.div
                className="absolute bottom-10 md:bottom-16 left-0 right-0 z-40"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                <div className="flex justify-center items-end gap-8 md:gap-16">

                    {/* RISK */}
                    <motion.button
                        onClick={() => actions.handleDareToRisk()}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex flex-col items-center gap-3"
                    >
                        <div className={`relative p-4 rounded-full transition-all duration-500 ${isRiskGlowing
                                ? 'bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
                                : 'bg-white/[0.02] hover:bg-white/[0.05]'
                            }`}>
                            {isRiskGlowing && (
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-red-500/20"
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}
                            <Flame className={`w-5 h-5 transition-colors duration-300 ${isRiskGlowing ? 'text-red-400' : 'text-white/30 group-hover:text-white/60'
                                }`} />
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${isRiskGlowing ? 'text-red-400/80' : 'text-white/20 group-hover:text-white/50'
                            }`}>
                            Risk
                        </span>
                    </motion.button>

                    {/* CONTINUE - Primary action */}
                    <motion.button
                        onClick={onNext}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative"
                    >
                        <div className="relative px-12 md:px-16 py-4 md:py-5">
                            {/* Border */}
                            <div className="absolute inset-0 border border-white/15 rounded-full group-hover:border-white/30 transition-colors duration-500" />

                            {/* Text */}
                            <span
                                className="relative text-lg md:text-xl text-white/70 group-hover:text-white transition-colors duration-300"
                                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                            >
                                Continue
                            </span>
                        </div>
                    </motion.button>

                    {/* BOND */}
                    <motion.button
                        onClick={onBond}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex flex-col items-center gap-3"
                    >
                        <div className="p-4 rounded-full bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500">
                            <Heart className="w-5 h-5 text-white/30 group-hover:text-purple-400/80 transition-colors duration-300" />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 group-hover:text-white/50 transition-colors duration-300">
                            Bond
                        </span>
                    </motion.button>
                </div>
            </motion.div>


            {/* === RISK MODAL === */}
            <AnimatePresence>
                {showRiskyQuestion && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/95"
                            onClick={() => actions?.setShowRiskyQuestion(false)}
                        />

                        {/* Red ambient glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.1)_0%,_transparent_50%)] pointer-events-none" />

                        {/* Modal content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="relative w-[90vw] max-w-2xl px-8 py-16 text-center"
                        >
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                            >
                                <Flame className="w-10 h-10 text-red-500/60 mx-auto mb-8" />
                            </motion.div>

                            {/* Label */}
                            <p className="font-montserrat text-[9px] tracking-[0.5em] text-red-400/40 uppercase mb-8">
                                High Stakes
                            </p>

                            {/* Question */}
                            <h2
                                className="text-3xl md:text-4xl lg:text-5xl leading-tight mb-12"
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontStyle: 'italic',
                                    color: 'rgba(255, 245, 238, 0.9)'
                                }}
                            >
                                {currentRiskyQuestion?.q || "What is your deepest fear?"}
                            </h2>

                            {/* Accept button */}
                            <motion.button
                                onClick={() => actions?.setShowRiskyQuestion(false)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-4 border border-red-500/30 rounded-full text-red-300/80 hover:text-white hover:border-red-400/50 hover:bg-red-500/10 transition-all duration-300 font-montserrat text-xs tracking-[0.25em] uppercase"
                            >
                                Accept
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default JourneyInterface;
