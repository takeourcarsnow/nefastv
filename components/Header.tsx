"use client";
import React, { useEffect, useRef } from 'react';
import { useSection } from './SectionContext.tsx';
import { HeaderEffects } from './HeaderEffects.tsx';

// Enhanced scrolling text effects
function useScrollingTextEffects(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    let flickerInterval: ReturnType<typeof setInterval> | null = null;
    let brightnessInterval: ReturnType<typeof setInterval> | null = null;
    
    const flickerFn = () => {
      if (document.hidden) return;
      if (Math.random() < 0.05) {
        el.style.opacity = '0.7';
        setTimeout(() => {
          if (el) el.style.opacity = '1';
        }, 50 + Math.random() * 100);
      }
    };
    
    const brightnessFn = () => {
      if (document.hidden) return;
      if (Math.random() < 0.1) {
        el.style.textShadow = '0 0 8px var(--main-color), 0 0 15px var(--glow-color), 0 0 20px var(--glow-color)';
        setTimeout(() => {
          if (el) el.style.textShadow = '0 0 3px var(--main-color), 0 0 6px var(--glow-color), 0 0 9px var(--glow-color)';
        }, 200 + Math.random() * 300);
      }
    };
    
  flickerInterval = setInterval(flickerFn, 500);
  brightnessInterval = setInterval(brightnessFn, 1000);
    
    const visibilityHandler = () => {
      if (document.hidden) {
        if (flickerInterval) clearInterval(flickerInterval);
          if (brightnessInterval) clearInterval(brightnessInterval);
      } else {
  flickerInterval = setInterval(flickerFn, 500);
  brightnessInterval = setInterval(brightnessFn, 1000);
      }
    };
    
    document.addEventListener('visibilitychange', visibilityHandler);
    
    return () => {
      if (flickerInterval) clearInterval(flickerInterval);
      if (brightnessInterval) clearInterval(brightnessInterval);
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, [ref]);
}

// Simple glitch effect placeholder (original had complex logic)
function useGlitch(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let raf: number;
    const run = () => {
      frame++;
      if (frame % 120 === 0) {
        el.style.textShadow = '0 0 4px #00ffff, 0 0 8px #ff00ff';
        setTimeout(() => {
          if (el) el.style.textShadow = 'none';
        }, 120);
      }
      raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [ref]);
}

export const Header: React.FC = () => {
  const { setActive } = useSection();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollTextRef = useRef<HTMLSpanElement>(null);
  
  useGlitch(titleRef);
  useScrollingTextEffects(scrollTextRef);
  
  return (
    <header>
      <h1 ref={titleRef} style={{ cursor: 'pointer' }} onClick={() => setActive('home-content')}>
        <HeaderEffects />
      </h1>
      <div className="scrolling-text-container">
        <div className="scrolling-text">
          <span ref={scrollTextRef} className="scroll-content">● MY CORNER OF THE DIGITAL VOID ● VISUALS, VIBES & VARIOUS EXPERIMENTS ● WATCH ● READ ● CLICK ●</span>
        </div>
      </div>
    </header>
  );
};
