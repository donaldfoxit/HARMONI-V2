import React from 'react';
import { motion } from 'framer-motion';

const DestinationGrid = ({ destinations, onSelect }) => {
    return (
        <section id="goonies" className="py-24 px-4 md:px-12 bg-main relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {destinations.map((dest) => (
                    <div
                        key={dest.id}
                        className="group relative h-[400px] rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-2"
                    >
                        {/* Background Image/Gradient Replacement */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />

                        {/* Overlay Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                            <h3 className="text-3xl font-montserrat font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {dest.name}
                            </h3>

                            <div className="overflow-hidden max-h-0 group-hover:max-h-[200px] transition-all duration-500 ease-in-out">
                                <p className="text-sm text-gray-300 mb-6 font-light leading-relaxed">
                                    {dest.desc || "A journey awaits within."}
                                </p>
                                <button
                                    onClick={() => onSelect(dest)}
                                    className="text-sm uppercase tracking-widest font-bold text-accent hover:text-white transition-colors flex items-center gap-2"
                                >
                                    Select Path <span className="text-lg">→</span>
                                </button>
                            </div>
                        </div>

                        {/* Icon */}
                        <div className="absolute top-4 right-4 text-4xl opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                            {dest.icon}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DestinationGrid;
