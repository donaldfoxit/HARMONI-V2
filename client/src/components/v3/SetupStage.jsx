import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SetupStage = ({ destinations, onSelectDest, onSelectTime, onInitiate }) => {
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDestId, setSelectedDestId] = useState(null);

    const handleDestSelect = (dest) => {
        setSelectedDestId(dest.name);
        onSelectDest(dest);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        onSelectTime(time);
    };

    return (
        <motion.div>
            <div className="relative min-h-screen py-20 bg-main flex flex-col items-center">
                <div className="text-center mb-12">
                    <p className="text-accent font-montserrat text-xs tracking-[0.5em] uppercase mb-4">Step Into The</p>
                    <h2 className="text-5xl md:text-7xl font-playfair text-white mb-4">Choice</h2>
                    <p className="text-muted font-montserrat text-sm tracking-widest uppercase opacity-70">Select 1 Path & Duration</p>
                </div>

                {/* IRONHILL GRID: 3 Columns, Grayscale -> Color Hover */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl px-8 w-full h-auto md:h-[70vh] mb-20">
                    {destinations.map((dest, index) => {
                        const isSelected = selectedDestId === dest.name;
                        return (
                            <motion.div
                                key={dest.name}
                                onClick={() => handleDestSelect(dest)}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                                    relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-700 ease-out border border-white/10
                                    ${isSelected
                                        ? 'grayscale-0 brightness-110 ring-2 ring-blue-500 scale-105 z-20 shadow-[0_0_50px_rgba(59,130,246,0.3)]'
                                        : 'grayscale brightness-50 hover:grayscale-0 hover:brightness-100 hover:scale-105 z-10 hover:z-20'
                                    }
                                `}
                            >
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <h3 className="font-playfair text-3xl text-white mb-2">{dest.name}</h3>
                                    <p className="font-montserrat text-xs text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {dest.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* TIME CONTROLS - Now part of the flow, not fixed */}
                <div className="w-full flex flex-col justify-center items-center gap-8 pb-20">
                    <div className="flex gap-4">
                        {[10, 20, 30].map(time => (
                            <button
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className={`
                                px-8 py-4 border transition-all font-montserrat tracking-widest text-sm uppercase rounded-sm
                                ${selectedTime === time
                                        ? 'bg-accent border-accent text-white shadow-[0_0_20px_rgba(0,102,255,0.5)] scale-110'
                                        : 'border-white/20 text-muted hover:border-white hover:text-white bg-black/50'}
                            `}
                            >
                                {time} MIN
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onInitiate}
                        className={`
                        more-btn text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white px-16 py-6 font-bold tracking-[0.3em] text-xl uppercase transition-all duration-500 rounded-full
                        ${!selectedTime || !selectedDestId ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]'}
                    `}
                        disabled={!selectedTime || !selectedDestId}
                    >
                        INITIATE JOURNEY
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SetupStage;
