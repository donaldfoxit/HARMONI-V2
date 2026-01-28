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
        currentQuestionData, // New prop from restored controller
        showRiskyQuestion,
        currentRiskyQuestion,
        showBondingPrompt,
        currentBondingPrompt
    } = data;

    const questionText = currentQuestionData?.q || "Breathe...";

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
                            scale: [1, 1.02, 1],
                            opacity: [1, 0.85, 1]
                        }}
                        transition={{
                            duration: 5,
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                        className="font-playfair text-4xl md:text-6xl lg:text-7xl leading-tight text-white drop-shadow-2xl"
                    >
                        "{questionText}"
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-20 left-0 w-full flex justify-center items-center gap-8 md:gap-12 z-40">

                {/* RISK IT - Smoldering Glass */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => actions.handleDareToRisk()}
                    className="group relative px-6 py-3 overflow-hidden rounded-full bg-red-950/30 border border-red-500/30 backdrop-blur-md transition-all duration-500 hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                >
                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <span className="relative flex items-center gap-2 font-montserrat text-xs tracking-[0.2em] text-red-400 group-hover:text-red-100 transition-colors uppercase">
                        <Flame className="w-4 h-4" /> Risk It
                    </span>
                </motion.button>

                {/* CONTINUE JOURNEY - Ethereal Prism */}
                <motion.button
                    onClick={onNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group px-14 py-5 rounded-full"
                >
                    {/* Glass Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-full backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 group-hover:border-white/40 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]" />

                    {/* Text */}
                    <span className="relative font-playfair italic text-2xl text-white tracking-wide group-hover:tracking-widest transition-all duration-500 drop-shadow-lg">
                        Continue Journey
                    </span>
                </motion.button>

                {/* BOND - Mystic Star */}
                <motion.button
                    onClick={onBond}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="group relative p-4 rounded-full bg-blue-900/20 border border-blue-400/20 backdrop-blur-md hover:bg-blue-800/30 hover:border-blue-400/50 transition-all shadow-[0_0_15px_rgba(96,165,250,0.1)] hover:shadow-[0_0_30px_rgba(96,165,250,0.3)]"
                >
                    <Heart className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                </motion.button>

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
