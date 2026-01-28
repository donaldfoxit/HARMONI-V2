import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({ darkMode, intensity = 'normal' }) => {
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

        // Configuration based on intensity and mode
        const particleCount = intensity === 'high' ? 80 : 50;
        const mouseDistance = 200;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slow, drift-like movement
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1; // Small, elegant dots
                this.baseColor = darkMode ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,';
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update(mouse) {
                // Move
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interaction (gentle repulsion)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseDistance - distance) / mouseDistance;
                        const directionX = forceDirectionX * force * 0.6; // Gentle push
                        const directionY = forceDirectionY * force * 0.6;

                        this.vx -= directionX;
                        this.vy -= directionY;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${this.baseColor}${this.opacity})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let mouse = { x: null, y: null };

        const handleMouseMove = (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        };

        // Auto calm down mouse effect
        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach(particle => {
                particle.update(mouse);
                particle.draw();
            });

            // Draw connections (optional, for "constellation" look, keeping it subtle)
            /* 
            // Connect particles
            for (let a = 0; a < particles.length; a++) {
              for (let b = a; b < particles.length; b++) {
                  let dx = particles[a].x - particles[b].x;
                  let dy = particles[a].y - particles[b].y;
                  let distance = Math.sqrt(dx * dx + dy * dy);
      
                  if (distance < connectionDistance) {
                      ctx.strokeStyle = `${particles[a].baseColor}${0.05})`; // Very faint lines
                      ctx.lineWidth = 1;
                      ctx.beginPath();
                      ctx.moveTo(particles[a].x, particles[a].y);
                      ctx.lineTo(particles[b].x, particles[b].y);
                      ctx.stroke();
                  }
              }
            }
            */

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [darkMode, intensity]);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default ParticleBackground;
