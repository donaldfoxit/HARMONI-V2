import React, { useState, useEffect, useRef } from 'react';
import NebulaBackground from './NebulaBackground';

// Gentle Mist effect
export const MistEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full mix-blend-soft-light filter blur-3xl animate-float-slow"
                    style={{
                        width: `${200 + Math.random() * 200}px`,
                        height: `${200 + Math.random() * 200}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: `radial-gradient(circle, rgba(200,200,255,0.1), transparent)`,
                        animation: `float-slow ${15 + Math.random() * 10}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                />
            ))}
        </div>
        <style>{`
      @keyframes float-slow {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        33% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.1); opacity: 0.3; }
        66% { transform: translate(${Math.random() * -50 + 25}px, ${Math.random() * -50 + 25}px) scale(0.95); opacity: 0.1; }
      }
    `}</style>
    </div>
);

export const StarsEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(50)].map((_, i) => (
            <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                    width: `${Math.random() * 3}px`,
                    height: `${Math.random() * 3}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.7 + 0.3,
                    animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                }}
            />
        ))}
        <style>{`
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `}</style>
    </div>
);

export const CityLightsEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
            <div
                key={i}
                className="absolute rounded-sm"
                style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 20 + 10}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: ['#FFD700', '#FFA500', '#87CEEB', '#FFF'][Math.floor(Math.random() * 4)],
                    opacity: Math.random() * 0.3 + 0.1,
                    animation: `flicker ${Math.random() * 2 + 1}s ease-in-out infinite`,
                }}
            />
        ))}
        <style>{`
      @keyframes flicker {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.5; }
      }
    `}</style>
    </div>
);

export const LeavesEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
            <div
                key={i}
                className="absolute text-2xl opacity-20"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    animation: `fall-leaf ${Math.random() * 5 + 5}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                }}
            >
                🍃
            </div>
        ))}
        <style>{`
      @keyframes fall-leaf {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `}</style>
    </div>
);

export const SandEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
            <div
                key={i}
                className="absolute w-1 h-1 bg-amber-200 rounded-full opacity-30"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `drift ${Math.random() * 10 + 10}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                }}
            />
        ))}
        <style>{`
      @keyframes drift {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
      }
    `}</style>
    </div>
);

export const AuroraEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-full h-32 mix-blend-screen filter blur-3xl"
                    style={{
                        top: `${20 + i * 25}%`,
                        background: `linear-gradient(90deg, transparent, ${['#00FF88', '#00D4FF', '#B388FF'][i]}, transparent)`,
                        opacity: 0.3,
                        animation: `aurora-wave ${8 + i * 2}s ease-in-out infinite alternate`,
                        animationDelay: `${i}s`,
                    }}
                />
            ))}
        </div>
        <style>{`
      @keyframes aurora-wave {
        0% { transform: translateX(-50%) scaleX(1); }
        100% { transform: translateX(50%) scaleX(1.5); }
      }
    `}</style>
    </div>
);

export const CherryBlossomEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
            <div
                key={i}
                className="absolute text-2xl opacity-30"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    animation: `cherry-fall ${Math.random() * 8 + 8}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                }}
            >
                🌸
            </div>
        ))}
        <style>{`
      @keyframes cherry-fall {
        to {
          transform: translateY(100vh) rotate(180deg);
          opacity: 0;
        }
      }
    `}</style>
    </div>
);


export const getThemeEffect = (theme, scrollVelocity = 0) => {
    switch (theme) {
        case 'moonlight': return <NebulaBackground scrollVelocity={scrollVelocity} />;
        case 'mist': return <MistEffect />;
        case 'night': return <CityLightsEffect />;
        case 'woods': return <LeavesEffect />;
        case 'dawn': return <SandEffect />;
        case 'hearth': return null;
        case 'aurora': return <AuroraEffect />;
        case 'zen': return <CherryBlossomEffect />;
        default: return null;
    }
};

export const GlitterEffect = () => {
    const [glitters, setGlitters] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newGlitters = [];
            for (let i = 0; i < 3; i++) {
                newGlitters.push({
                    id: Date.now() + i,
                    x: x + Math.random() * 20 - 10,
                    y: y + Math.random() * 20 - 10,
                    size: Math.random() * 8 + 4,
                    color: ['#FF6BCB', '#FFC107', '#4FC3F7', '#81C784', '#BA68C8', '#FF8A65'][Math.floor(Math.random() * 6)],
                    life: 100,
                    speedX: Math.random() * 4 - 2,
                    speedY: Math.random() * 4 - 2,
                });
            }

            setGlitters(prev => [...prev.slice(-50), ...newGlitters]);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitters(prev =>
                prev
                    .map(g => ({ ...g, life: g.life - 2, x: g.x + g.speedX, y: g.y + g.speedY }))
                    .filter(g => g.life > 0)
            );
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {glitters.map(glitter => (
                <div
                    key={glitter.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${glitter.x}px`,
                        top: `${glitter.y}px`,
                        width: `${glitter.size}px`,
                        height: `${glitter.size}px`,
                        backgroundColor: glitter.color,
                        opacity: glitter.life / 100,
                        boxShadow: `0 0 ${glitter.size}px ${glitter.size}px ${glitter.color}40`,
                        transform: `scale(${glitter.life / 100})`,
                        transition: 'transform 0.1s, opacity 0.1s',
                    }}
                />
            ))}
        </div>
    );
};
