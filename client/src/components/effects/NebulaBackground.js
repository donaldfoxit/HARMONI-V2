import React, { useEffect, useRef } from 'react';

const NebulaBackground = ({ darkMode, intensity = 'normal', scrollVelocity = 0 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const particleCount = intensity === 'high' ? 100 : 70;

        // Base speed factor
        const baseSpeed = 0.5;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.baseVelocityY = (Math.random() * 0.5) + 0.1; // downward drift
                this.opacity = Math.random() * 0.5 + 0.1;
                this.baseColor = darkMode ? '255, 255, 255' : '0, 0, 0';
            }

            update(velocity) {
                // "Warp Speed" logic:
                // If scrolling fast (velocity is high), stars streak vertical.
                // Velocity is usually pixels per frame or similar.

                const warpFactor = Math.abs(velocity) * 0.5;
                this.y += this.baseVelocityY + (velocity * 2);

                // If massive warp, stretch the star
                this.currentHeight = this.size + (warpFactor * 5);

                // Reset positions if out of bounds
                if (this.y > canvas.height) {
                    this.y = 0 - this.currentHeight;
                    this.x = Math.random() * canvas.width;
                } else if (this.y < 0 - this.currentHeight) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                ctx.beginPath();
                // Draw streaks if moving fast
                if (this.currentHeight > this.size * 1.5) {
                    ctx.rect(this.x, this.y, this.size, this.currentHeight);
                } else {
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                }
                ctx.fillStyle = `rgba(${this.baseColor}, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update(scrollRef.current); // Use ref value
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [darkMode, intensity]); // Don't include scrollVelocity here to avoid reset

    // Velocity Ref to bridge React state and Canvas loop without re-renders
    const scrollRef = useRef(0);
    useEffect(() => {
        scrollRef.current = scrollVelocity;
    }, [scrollVelocity]);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default NebulaBackground;
