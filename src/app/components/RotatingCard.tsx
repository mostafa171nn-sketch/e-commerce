'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const RotatingCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;

    if (!card || !container) return;

    gsap.set(container, {
      perspective: 1000,
      transformStyle: 'preserve-3d'
    });

    gsap.set(card, {
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden'
    });

    // Create timeline for animations
    const tl = gsap.timeline({ repeat: -1 });

    // Continuous Y rotation
    tl.to(card, {
      rotationY: 360,
      duration: 20, // Slow elegant speed
      ease: 'none'
    }, 0);

    // Subtle floating Y-axis movement
    tl.to(card, {
      y: -10,
      duration: 3,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    }, 0);

    // Dynamic lighting effect - moving gradient
    const gradientOverlay = card.querySelector('.gradient-overlay') as HTMLElement;
    if (gradientOverlay) {
      gsap.to(gradientOverlay, {
        backgroundPosition: '200% 0%',
        duration: 4,
        ease: 'none',
        repeat: -1
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      <div
        ref={cardRef}
        className="relative w-80 h-96 md:w-96 md:h-[500px] lg:w-[500px] lg:h-[600px] rounded-2xl shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Gradient overlay for lighting effect */}
        <div
          className="gradient-overlay absolute inset-0 rounded-2xl opacity-30"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            backgroundSize: '200% 200%'
          }}
        />

        {/* Card content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Luxury Experience
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 mb-6">
              Discover Premium Quality
            </p>
            <div className="w-16 h-1 bg-white mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Additional 3D elements for depth */}
        <div
          className="absolute inset-0 rounded-2xl border border-white/10"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.05)'
          }}
        />
      </div>

      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default RotatingCard;
