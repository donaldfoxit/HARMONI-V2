import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Check, Clock, Sparkles } from 'lucide-react';
import MagneticButton from '../v2/MagneticButton'; // Reusing the magnetic button

const JourneyStage = ({
    question,
    onContinue,
    onRisk,
    progress,
    timeRemaining,
    formatTime,
    showRisky
}) => {
    return (
        <section id="plot" className="min-h-screen w-full bg-main flex flex-col justify-center relative overflow-hidden py-20">
            <div className="max-w-5xl mx-auto px-6 w-full relative z-10 text-center">

                {/* Header / Stats */}
                <div className="flex justify-between items-center mb-16 text-xs md:text-sm tracking-widest uppercase text-muted font-bold border-b border-gray-800 pb-6">
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-accent">{formatTime ? formatTime(timeRemaining) : "00:00"}</span>
                        <span className="opacity-50">Time Remaining</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-accent">{Math.round(progress)}%</span>
                        <span className="opacity-50">Journey Progress</span>
                    </div>
                </div>

                {/* Main Question Display */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={question ? question.id : 'loading'}
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="min-h-[300px] flex items-center justify-center"
                    >
                        <h2 className="font-playfair text-3xl md:text-5xl lg:text-6xl leading-tight text-white">
                            "{question ? question.q : "Preparing your path..."}"
                        </h2>
                    </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Risk It Button (Left) */}
                    {showRisky && (
                        <MagneticButton
                            onClick={onRisk}
                            className="group flex items-center gap-3 px-8 py-4 rounded-full border border-red-900/50 hover:border-red-500/50 bg-red-950/10 hover:bg-red-900/20 transition-all duration-500"
                        >
                            <Flame className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                            <span className="text-red-400 font-montserrat font-bold tracking-widest text-sm uppercase group-hover:text-red-300">Risk It</span>
                        </MagneticButton>
                    )}

                    {/* Continue Button (Right - Main Action) */}
                    <MagneticButton
                        onClick={onContinue}
                        className="group"
                    >
                        <div className="w-20 h-20 rounded-full border border-accent/30 flex items-center justify-center group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(0,102,255,0.3)] transition-all duration-500 bg-black">
                            <Check className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="block mt-4 text-xs font-montserrat uppercase tracking-widest text-muted group-hover:text-white transition-colors">Continue</span>
                    </MagneticButton>
                </div>

            </div>

            {/* Background Ambient Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-radial from-accent/5 to-transparent pointer-events-none" />
        </section>
    );
};

export default JourneyStage;
