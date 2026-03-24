import { useRef, useState, useEffect } from 'react';
import { useIntersection, useCounter } from '../hooks/index.js';

/** Fade-in on scroll wrapper */
export function Reveal({ children, className = '', delay = 0, dir = 'up' }) {
  const [ref, visible] = useIntersection();
  const init = dir === 'left' ? 'translate-x-[-40px]' : dir === 'right' ? 'translate-x-[40px]' : 'translate-y-[40px]';
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${visible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${init}`} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Section eye-brow label */
export function SectionTag({ children }) {
  return (
    <div className="inline-flex items-center gap-2 text-ember text-xs font-semibold tracking-[0.25em] uppercase font-outfit mb-3">
      <span className="block w-6 h-px bg-ember" />
      {children}
    </div>
  );
}

/** Animated number counter */
export function Counter({ target, suffix = '', prefix = '' }) {
  const [ref, count] = useCounter(target);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/** Stat block used in hero */
export function StatCard({ num, suffix = '', label }) {
  return (
    <div className="flex flex-col">
      <span className="font-fraunces text-4xl font-bold text-cream leading-none">
        <Counter target={num} suffix={suffix} />
      </span>
      <span className="text-smoke-light text-xs tracking-[0.12em] uppercase font-outfit mt-1.5">{label}</span>
    </div>
  );
}

/** Horizontal gradient divider */
export function GradientDivider({ className = '' }) {
  return <div className={`h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent ${className}`} />;
}
