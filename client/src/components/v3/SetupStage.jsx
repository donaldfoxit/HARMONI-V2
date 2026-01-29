import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Magical sparkle burst effect
const SparkleEffect = ({ active }) => {
    if (!active) return null;

    const sparkles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        angle: (i / 20) * 360,
        distance: 60 + Math.random() * 80,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 0.15,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            {sparkles.map((s) => (
                <motion.div
                    key={s.id}
                    className="absolute left-1/2 top-1/2 rounded-full bg-white"
                    initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        width: s.size,
                        height: s.size,
                    }}
                    animate={{
                        x: Math.cos(s.angle * Math.PI / 180) * s.distance,
                        y: Math.sin(s.angle * Math.PI / 180) * s.distance,
                        opacity: 0,
                        scale: 0,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: s.delay,
                        ease: 'easeOut'
                    }}
                    style={{
                        boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)',
                        marginLeft: -s.size / 2,
                        marginTop: -s.size / 2,
                    }}
                />
            ))}
        </div>
    );
};

// Ethereal floating orbs - Subtle
const DreamOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    width: Math.random() * 3 + 2,
                    height: Math.random() * 3 + 2,
                    background: `radial-gradient(circle, rgba(255,255,255,${Math.random() * 0.3 + 0.2}) 0%, transparent 70%)`
                }}
                initial={{ top: '110%', opacity: 0 }}
                animate={{
                    top: '-10%',
                    opacity: [0, 0.5, 0.4, 0]
                }}
                transition={{
                    duration: Math.random() * 14 + 12,
                    repeat: Infinity,
                    delay: Math.random() * 8,
                    ease: 'linear'
                }}
            />
        ))}
    </div>
);

const SetupStage = ({ destinations, onSelectDest, onSelectTime, onInitiate }) => {
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDestId, setSelectedDestId] = useState(null);
    const [hoveredDest, setHoveredDest] = useState(null);
    const [showSparkle, setShowSparkle] = useState(false);

    const handleBeginJourney = () => {
        setShowSparkle(true);
        setTimeout(() => {
            onInitiate();
        }, 600);
    };

    const handleDestSelect = (dest) => {
        setSelectedDestId(dest.name);
        onSelectDest(dest);
        // Smooth scroll to timer section after brief delay for dreamy feel
        setTimeout(() => {
            const timerSection = document.getElementById('timer-section');
            if (timerSection) {
                timerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 400);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        onSelectTime(time);
    };

    const canStart = selectedTime && selectedDestId;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen bg-[#000105] overflow-hidden"
        >
            {/* Ambient Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.06)_0%,_transparent_40%)] pointer-events-none" />

            {/* Floating Orbs */}
            <DreamOrbs />

            <div className="relative z-10 flex flex-col items-center py-20 px-8">

                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-8"
                        initial={{ width: 0 }}
                        animate={{ width: 48 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    />
                    <p className="font-montserrat text-[10px] tracking-[0.6em] text-white/40 uppercase mb-4">
                        Choose Your
                    </p>
                    <h2 className="font-playfair italic text-5xl md:text-7xl text-white/90 mb-4">
                        Destination
                    </h2>
                    <p className="font-montserrat text-xs tracking-[0.3em] text-white/30 uppercase">
                        Where shall we wander?
                    </p>
                </motion.div>

                {/* Destination Cards - Cinematic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mb-20">
                    {destinations.map((dest, index) => {
                        const isSelected = selectedDestId === dest.name;
                        const isHovered = hoveredDest === dest.name;

                        return (
                            <motion.div
                                key={dest.name}
                                onClick={() => handleDestSelect(dest)}
                                onMouseEnter={() => setHoveredDest(dest.name)}
                                onMouseLeave={() => setHoveredDest(null)}
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.15, duration: 0.8, ease: "easeOut" }}
                                className={`
                                    relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group
                                    transition-all duration-700 ease-out
                                    ${isSelected
                                        ? 'ring-2 ring-white/50 shadow-[0_0_60px_rgba(255,255,255,0.15)] scale-[1.02]'
                                        : 'hover:scale-[1.02]'
                                    }
                                `}
                            >
                                {/* Image Layer */}
                                <motion.img
                                    src={dest.image}
                                    alt={dest.name}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 
                                        ${isSelected || isHovered ? 'grayscale-0 scale-110' : 'grayscale brightness-50 scale-100'}
                                    `}
                                />

                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 transition-opacity duration-700
                                    ${isSelected || isHovered
                                        ? 'bg-gradient-to-t from-black/90 via-black/30 to-transparent'
                                        : 'bg-gradient-to-t from-black/80 via-black/50 to-black/30'}
                                `} />

                                {/* Selection Glow */}
                                {isSelected && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    />
                                )}

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-8">
                                    {/* Icon */}
                                    <motion.span
                                        className={`text-4xl mb-4 transition-all duration-500 
                                            ${isSelected || isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                                        `}
                                    >
                                        {dest.icon}
                                    </motion.span>

                                    {/* Title */}
                                    <h3 className={`font-playfair italic text-3xl md:text-4xl text-white mb-2 transition-all duration-500
                                        ${isSelected ? 'text-white' : 'text-white/80'}
                                    `}>
                                        {dest.name}
                                    </h3>

                                    {/* Description - Reveals on hover/select */}
                                    <p className={`font-montserrat text-xs text-white/60 leading-relaxed transition-all duration-500 max-w-xs
                                        ${isSelected || isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                                    `}>
                                        {dest.description}
                                    </p>

                                    {/* Selected Indicator */}
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-white/50 flex items-center justify-center bg-white/10 backdrop-blur-sm"
                                            >
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Duration Selection */}
                <motion.div
                    id="timer-section"
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <p className="font-montserrat text-[10px] tracking-[0.5em] text-white/30 uppercase mb-6">
                        How long shall we stay?
                    </p>
                    <div className="flex gap-4 justify-center">
                        {[10, 20, 30].map((time, i) => (
                            <motion.button
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                className={`
                                    relative px-8 py-4 rounded-full font-montserrat text-sm tracking-widest transition-all duration-500
                                    ${selectedTime === time
                                        ? 'text-white bg-white/10 border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                        : 'text-white/40 border border-white/10 hover:text-white/70 hover:border-white/20'}
                                `}
                            >
                                {time} min
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Initiate Button */}
                <motion.button
                    onClick={handleBeginJourney}
                    disabled={!canStart}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    whileHover={canStart ? { scale: 1.02 } : {}}
                    whileTap={canStart ? { scale: 0.98 } : {}}
                    className={`
                        relative px-16 py-6 rounded-full overflow-hidden transition-all duration-700
                        ${canStart
                            ? 'cursor-pointer group'
                            : 'cursor-not-allowed opacity-30'}
                    `}
                >
                    {/* Button Background */}
                    <div className={`absolute inset-0 border rounded-full transition-all duration-500
                        ${canStart
                            ? 'border-white/30 group-hover:border-white/60 group-hover:bg-white/5'
                            : 'border-white/10'}
                    `} />

                    {/* Glow Effect */}
                    {canStart && (
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_40px_rgba(255,255,255,0.2)]" />
                    )}

                    {/* Sparkle Effect */}
                    <SparkleEffect active={showSparkle} />

                    {/* Text */}
                    <span className={`relative font-playfair italic text-xl transition-colors duration-300
                        ${canStart ? 'text-white/80 group-hover:text-white' : 'text-white/30'}
                    `}>
                        Begin Journey
                    </span>
                </motion.button>

                {/* Decorative Bottom Line */}
                <motion.div
                    className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-16"
                    initial={{ width: 0 }}
                    animate={{ width: 48 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                />
            </div>
        </motion.div>
    );
};

export default SetupStage;
