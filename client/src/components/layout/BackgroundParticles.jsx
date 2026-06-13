import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function BackgroundParticles() {
  const canvasRef = useRef(null);
  const location = useLocation();

  // Color options matching the light rose theme
  // Color options matching the light rose theme and baby's breath flowers
  const colors = ['#F0C4CB', '#C87D87', '#FBEAD6', '#E5BCA9', '#FFFFFF', '#FDF2F4', '#E6EADF'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    
    // Mouse coordinates tracker
    let mouse = { x: -1000, y: -1000, radius: 140 };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.isFlower = Math.random() < 0.45; // 45% baby breath flowers
        this.petalCount = Math.floor(Math.random() * 2) + 4; // 4 to 5 petals
        this.radius = this.isFlower ? Math.random() * 3.5 + 2.5 : Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.baseOpacity = Math.random() * 0.45 + 0.2;
        this.opacity = this.baseOpacity;
        this.angle = Math.random() * Math.PI * 2;
        this.spinSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        // Natural drift
        this.x += this.vx;
        this.y += this.vy;

        // Wave motion overlay
        this.angle += this.spinSpeed;
        this.x += Math.sin(this.angle) * 0.08;

        // Check window boundaries
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Mouse hover interaction (repulsion field)
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Smoothly push away from mouse
          this.x += Math.cos(angle) * force * 2.5;
          this.y += Math.sin(angle) * force * 2.5;
          
          // Pulse opacity on hover
          this.opacity = Math.min(0.85, this.baseOpacity + force * 0.5);
        } else {
          // Revert to natural base opacity
          if (this.opacity > this.baseOpacity) {
            this.opacity -= 0.01;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;

        if (this.isFlower) {
          // Rotate flower slowly
          ctx.rotate(this.angle);
          
          // Draw petals
          ctx.fillStyle = this.color;
          const petalSize = this.radius * 0.9;
          
          for (let i = 0; i < this.petalCount; i++) {
            ctx.beginPath();
            const angleOffset = (i * Math.PI * 2) / this.petalCount;
            const px = Math.cos(angleOffset) * petalSize;
            const py = Math.sin(angleOffset) * petalSize;
            ctx.arc(px, py, petalSize * 0.55, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Draw contrasting flower center
          ctx.beginPath();
          ctx.arc(0, 0, petalSize * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = '#6B7556'; // Sage center pistil
          ctx.fill();
        } else {
          // Standard circle particle
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = this.color;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0; // Reset shadow for efficiency
      
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize listeners and scene
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Set sizes initially
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Trigger brief burst particles on page/route transition!
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Soft flash transition effect
    ctx.fillStyle = 'rgba(240, 196, 203, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [location.pathname]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] select-none"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
