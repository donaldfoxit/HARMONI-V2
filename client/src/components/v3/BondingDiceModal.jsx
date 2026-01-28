import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BondingDiceModal = ({ prompt, onClose }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000105]/90 backdrop-blur-2xl cursor-auto pointer-events-auto">
            <div className="relative flex flex-col items-center justify-center w-full max-w-2xl px-6">

                <AnimatePresence mode="wait">
                    {!revealed ? (
                        <motion.div
                            key="orb"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center cursor-pointer group"
                            onClick={() => setRevealed(true)}
                        >
                            {/* THE MAGICAL ORB */}
                            <div className="relative w-32 h-32 md:w-48 md:h-48">
                                {/* Core */}
                                <div className="absolute inset-0 rounded-full bg-white blur-xl opacity-20 animate-pulse" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-80 blur-lg group-hover:blur-2xl transition-all duration-700" />
                                <div className="absolute inset-4 rounded-full bg-white/90 shadow-[0_0_100px_rgba(255,255,255,0.8)] animate-float-slow" />

                                {/* Sparkles */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-20px] rounded-full border border-white/20 border-dashed"
                                />
                            </div>

                            <p className="mt-12 text-blue-200/60 font-playfair tracking-[0.3em] text-sm uppercase animate-pulse">
                                Touch the light to connect
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="mb-10"
                            >
                                <span className="inline-block px-4 py-1 mb-6 border rounded-full border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] tracking-[0.4em] uppercase">
                                    Fate Has Spoken
                                </span>
                                <h3 className="font-playfair text-3xl md:text-5xl text-white leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                    "{prompt?.text || "Hold hands and breathe together."}"
                                </h3>
                            </motion.div>

                            <button
                                onClick={onClose}
                                className="px-8 py-3 border border-white/20 hover:border-white/60 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-all duration-500 tracking-[0.2em] text-xs uppercase"
                            >
                                Continue Journey
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Global Sparkles Effect (Optional decoration) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full blur-[1px] animate-ping opacity-20" />
                <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full blur-[1px] animate-pulse opacity-40" />
            </div>
        </div>
    );
};

export default BondingDiceModal;
