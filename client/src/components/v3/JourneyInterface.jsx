import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Flame, Heart } from 'lucide-react';

// Ethereal floating particles - Subtle
const DreamParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    width: Math.random() * 3 + 2,
                    height: Math.random() * 3 + 2,
                    background: `radial-gradient(circle, rgba(255,255,255,${Math.random() * 0.3 + 0.2}) 0%, transparent 70%)`
                }}
                initial={{ top: '105%', opacity: 0 }}
                animate={{
                    top: '-5%',
                    opacity: [0, 0.5, 0.4, 0]
                }}
                transition={{
                    duration: Math.random() * 18 + 14,
                    repeat: Infinity,
                    delay: Math.random() * 10,
                    ease: 'linear'
                }}
            />
        ))}
    </div>
);

// Ambient orb glow
const AmbientOrb = ({ color, position, size, blur }) => (
    <div
        className="absolute rounded-full pointer-events-none"
        style={{
            background: color,
            width: size,
            height: size,
            filter: `blur(${blur})`,
            ...position
        }}
    />
);

const JourneyInterface = ({
    data,
    onNext,
    onHome,
    onRisk,
    onBond,
    actions
}) => {
    const {
        currentQuestionData,
        showRiskyQuestion,
        currentRiskyQuestion,
    } = data;

    const questionText = currentQuestionData?.q || "Breathe...";

    // Typewriter Animation
    const sentenceVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.3,
                staggerChildren: 0.04
            }
        },
        exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.6 } }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.3 }
        }
    };

    // Subtle wave animation for each word after typewriter completes
    const wordWaveVariants = {
        animate: (i) => ({
            y: [0, -3, 0, 2, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
            }
        })
    };

    const cardVariants = {
        initial: { rotateY: 90, scale: 0.8, opacity: 0 },
        animate: { rotateY: 0, scale: 1, opacity: 1 },
        exit: { rotateY: -90, scale: 0.8, opacity: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-screen w-full flex flex-col items-center justify-center relative bg-[#000105] overflow-hidden"
        >
            {/* Ambient Background Glows */}
            <AmbientOrb
                color="radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)"
                position={{ top: '-10%', left: '20%' }}
                size="600px"
                blur="80px"
            />
            <AmbientOrb
                color="radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)"
                position={{ bottom: '10%', right: '10%' }}
                size="500px"
                blur="100px"
            />
            <AmbientOrb
                color="radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)"
                position={{ top: '40%', left: '-10%' }}
                size="400px"
                blur="60px"
            />

            {/* Floating Particles */}
            <DreamParticles />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_250px_100px_rgba(0,0,0,0.8)] z-30" />

            {/* Home Button - Refined */}
            <motion.button
                onClick={onHome}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-10 left-10 p-4 rounded-full border border-white/10 hover:border-white/30 text-white/40 hover:text-white/80 transition-all duration-500 z-50 backdrop-blur-sm bg-white/5 group"
            >
                <Home className="w-5 h-5 transition-transform duration-300" />
            </motion.button>

            {/* Main Question Display with Typewriter + Wavy Animation */}
            <div className="relative z-20 px-8 max-w-5xl text-center min-h-[35vh] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={questionText}
                        variants={sentenceVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="font-playfair italic text-4xl md:text-6xl lg:text-7xl leading-relaxed text-white/90 flex flex-wrap justify-center gap-x-3 md:gap-x-5"
                        style={{ textShadow: '0 0 60px rgba(255,255,255,0.15)' }}
                    >
                        {questionText.split(" ").map((word, wIndex) => (
                            <motion.span
                                key={wIndex}
                                className="inline-block whitespace-nowrap"
                                animate={{
                                    y: [0, -3, 0, 2, 0]
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1.5 + (wIndex * 0.2) // Wait for typewriter, then stagger each word
                                }}
                            >
                                {word.split("").map((char, cIndex) => (
                                    <motion.span
                                        key={`${wIndex}-${cIndex}`}
                                        variants={letterVariants}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.span>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* PREMIUM BUTTONS - Centered */}
            <motion.div
                className="absolute bottom-20 left-0 right-0 flex justify-center items-center z-40"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                <div className="flex items-center gap-8 md:gap-16">

                    {/* RISK IT - Molten Core */}
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => actions.handleDareToRisk()}
                        className="group relative"
                    >
                        {/* Outer glow ring */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 via-orange-500/30 to-red-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700" />

                        {/* Main button */}
                        <div className="relative px-8 py-4 bg-gradient-to-b from-red-950/60 to-red-950/40 rounded-2xl border border-red-800/40 group-hover:border-red-600/60 transition-all duration-500 backdrop-blur-sm overflow-hidden">
                            {/* Inner shimmer */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Content */}
                            <div className="relative flex items-center gap-3">
                                <Flame className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                                <span className="font-montserrat text-xs tracking-[0.2em] text-red-400/90 group-hover:text-red-300 transition-colors uppercase font-medium">
                                    Risk It
                                </span>
                            </div>
                        </div>
                    </motion.button>

                    {/* CONTINUE - Central Prism */}
                    <motion.button
                        onClick={onNext}
                        whileHover={{ scale: 1.02, y: -3 }}
                        whileTap={{ scale: 0.99 }}
                        className="group relative"
                    >
                        {/* Multi-layer glow */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-blue-500/20 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-all duration-700" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />

                        {/* Main button */}
                        <div className="relative px-16 py-6 rounded-full overflow-hidden">
                            {/* Glass background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/8 to-white/5 rounded-full border border-white/30 group-hover:border-white/50 transition-all duration-500 backdrop-blur-xl" />

                            {/* Animated inner glow */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full"
                                animate={{ x: ['-150%', '150%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Radial highlight */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.15)_0%,_transparent_60%)] rounded-full" />

                            {/* Text */}
                            <span className="relative font-playfair italic text-2xl md:text-3xl text-white/90 group-hover:text-white transition-all duration-500 tracking-wide drop-shadow-lg">
                                Continue
                            </span>
                        </div>
                    </motion.button>

                    {/* BOND - Celestial Heart */}
                    <motion.button
                        onClick={onBond}
                        whileHover={{ scale: 1.1, rotate: 5, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative"
                    >
                        {/* Outer pulse ring */}
                        <motion.div
                            className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 via-violet-400/30 to-blue-400/30 rounded-2xl blur-lg"
                            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Main button */}
                        <div className="relative p-5 bg-gradient-to-b from-blue-950/60 to-violet-950/40 rounded-2xl border border-blue-500/30 group-hover:border-blue-400/60 transition-all duration-500 backdrop-blur-sm overflow-hidden">
                            {/* Inner shimmer */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />

                            <Heart className="relative w-6 h-6 text-blue-400/80 group-hover:text-blue-300 transition-colors" />
                        </div>
                    </motion.button>
                </div>
            </motion.div>

            {/* RISK MODAL */}
            <AnimatePresence>
                {showRiskyQuestion && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ type: "spring", bounce: 0.3, duration: 1 }}
                            className="relative w-[90vw] max-w-[500px] aspect-[3/4] rounded-3xl overflow-hidden"
                            style={{ perspective: '1000px' }}
                        >
                            {/* Card Background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-red-950/90 via-[#0a0505] to-[#050202] border border-red-900/50 rounded-3xl" />

                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.1)_0%,_transparent_60%)]" />

                            {/* Corner Decorations */}
                            <div className="absolute top-6 right-6 text-red-500/20 text-5xl font-playfair italic">♦</div>
                            <div className="absolute bottom-6 left-6 text-red-500/20 text-5xl font-playfair italic rotate-180">♦</div>

                            {/* Content */}
                            <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                >
                                    <Flame className="w-12 h-12 text-red-500/80 mb-6" />
                                </motion.div>

                                <motion.p
                                    className="font-montserrat text-[10px] tracking-[0.5em] text-red-400/60 uppercase mb-8"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    High Stakes
                                </motion.p>

                                <motion.p
                                    className="font-playfair italic text-2xl md:text-3xl text-white/90 leading-relaxed mb-12"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {currentRiskyQuestion?.q || "What is your deepest fear?"}
                                </motion.p>

                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        actions?.setShowRiskyQuestion(false);
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-10 py-4 rounded-full border border-red-500/50 text-red-400/80 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/80 transition-all duration-500 font-montserrat text-xs tracking-[0.3em] uppercase"
                                >
                                    Accept Fate
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default JourneyInterface;
