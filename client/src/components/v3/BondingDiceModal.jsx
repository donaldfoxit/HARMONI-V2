import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BondingDiceModal = ({ prompt, onClose }) => {
    const [rolled, setRolled] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl">
            <div className="text-center">
                {!rolled ? (
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRolled(true)}
                        className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(168,85,247,0.5)] cursor-pointer"
                    >
                        🎲
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ scale: 0, rotateY: 90 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        className="max-w-md p-8 bg-black border border-purple-500/50 rounded-xl shadow-2xl relative"
                    >
                        <h3 className="text-purple-400 font-serif text-2xl mb-4 italic">Fate Says...</h3>
                        <p className="text-xl text-white mb-8 font-light">{prompt?.text || "Hold hands for 60 seconds."}</p>
                        <button onClick={onClose} className="px-6 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors uppercase tracking-widest text-xs">
                            Close
                        </button>
                    </motion.div>
                )}
                {!rolled && <p className="mt-6 text-purple-300 animate-pulse tracking-widest text-sm uppercase">Touch the Dice</p>}
            </div>
        </div>
    );
};
export default BondingDiceModal;
