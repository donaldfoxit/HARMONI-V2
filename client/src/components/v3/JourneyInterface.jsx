import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Flame, Heart } from 'lucide-react';

const JourneyInterface = ({
    data,
    onNext,
    onHome,
    onRisk,
    onBond,
    actions
}) => {
    const {
        currentQuestion,
        currentRoundQuestions,
        showRiskyQuestion,
        currentRiskyQuestion,
        showBondingPrompt,
        currentBondingPrompt
    } = data;

    const questionObj = currentRoundQuestions && currentRoundQuestions[currentQuestion];
    const questionText = questionObj?.q || "Breathe...";

    // Animation variants
    const textVariants = {
        initial: { opacity: 0, y: 10, filter: "blur(5px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -10, filter: "blur(5px)" }
    };

    const cardVariants = {
        initial: { rotateY: 90, x: -100, opacity: 0 },
        animate: { rotateY: 0, x: 0, opacity: 1 },
        exit: { rotateY: -90, x: 100, opacity: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full flex flex-col items-center justify-center relative bg-main overflow-hidden perspective-1000"
        >
            {/* Background Ambient Pulse */}
            <div className="absolute inset-0 bg-gradient-radial from-accent/5 to-transparent animate-pulse-slow pointer-events-none" />

            {/* Home Button */}
            <button
                onClick={onHome}
                className="absolute top-8 left-8 p-3 rounded-full border border-white/10 hover:border-white/50 text-white/50 hover:text-white transition-all z-50 group"
            >
                <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            {/* Main Question Display */}
            <div className="relative z-10 px-8 max-w-5xl text-center min-h-[40vh] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={questionText}
                        animate={{
                            y: [0, -15, 0],   // Moves up 15px then down
                            rotate: [0, 1, 0, -1, 0] // Very subtle rotation for "floating" feel
                        }}
                        transition={{
                            duration: 6,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "mirror"
                        }}
                        className="font-playfair text-4xl md:text-6xl lg:text-7xl leading-tight text-white drop-shadow-2xl"
                    >
                        "{questionText}"
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-20 left-0 w-full flex justify-center items-center gap-8 md:gap-16 z-40">
                {/* Risk It - Fire Style */}
                <button
                    onClick={() => actions.setShowRiskyQuestion(true)}
                    className="px-8 py-3 bg-red-900/20 border border-red-500 text-red-500 font-bold tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:shadow-[0_0_50px_rgba(239,68,68,1)]"
                >
                    🔥 RISK IT
                </button>

                {/* Continue - Main Action */}
                <button
                    onClick={onNext}
                    className="bg-transparent border border-white/20 text-white font-playfair italic text-xl px-12 py-4 rounded-full hover:bg-white hover:text-black hover:border-white hover:scale-105 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                >
                    CONTINUE JOURNEY
                </button>

                {/* Bonding - Subtle Style */}
                <button
                    onClick={onBond}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-200 transition-colors font-montserrat tracking-[0.2em] text-sm uppercase hover:scale-110 transition-transform"
                >
                    <Heart className="w-5 h-5" /> Bond
                </button>
            </div>

            {/* MODALS - CASINO FLIP STYLE */}
            <AnimatePresence>

                {/* Risk Modal */}
                {showRiskyQuestion && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm perspective-1000">
                        <motion.div
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
                            className="relative w-[500px] h-[700px] bg-[#1a0505] border-2 border-red-900 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.3)] flex flex-col items-center justify-center p-12 text-center"
                        >
                            <div className="absolute top-4 right-4 text-red-500/30 text-6xl font-playfair">K</div>
                            <div className="absolute bottom-4 left-4 text-red-500/30 text-6xl font-playfair rotate-180">K</div>

                            <Flame className="w-16 h-16 text-red-500 mb-8 animate-pulse" />
                            <h3 className="text-red-500 font-montserrat tracking-widest uppercase mb-6 text-sm">High Stakes</h3>
                            <p className="font-playfair text-3xl md:text-4xl text-white leading-relaxed">
                                {currentRiskyQuestion?.q || "What is your deepest fear?"}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    actions?.setShowRiskyQuestion(false);
                                }}
                                className="mt-12 px-8 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all uppercase tracking-widest text-sm"
                            >
                                Accept Fate & Return
                            </button>
                        </motion.div>
                    </div>
                )}

                {/* OLD BONDING MODAL REMOVED - REPLACED BY BONDING DICEMODAL IN APP.JS */}

            </AnimatePresence>

        </motion.div>
    );
};

const Sparkles = () => {
    // Generate random positions for sparkles
    const sparkles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 1.5 + 0.5, // 0.5 to 2rem scale roughly
        delay: Math.random() * 2,
        duration: Math.random() * 1 + 1
    }));

    return (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
            {sparkles.map((s) => (
                <motion.div
                    key={s.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        rotate: [0, 180]
                    }}
                    transition={{
                        duration: s.duration,
                        repeat: Infinity,
                        delay: s.delay,
                        ease: "easeInOut"
                    }}
                    style={{
                        top: s.top,
                        left: s.left,
                    }}
                    className="absolute text-blue-200 drop-shadow-[0_0_5px_rgba(191,219,254,0.8)]"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ transform: `scale(${s.size})` }}>
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
};

export default JourneyInterface;
