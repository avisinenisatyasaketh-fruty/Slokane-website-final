import { useState, useEffect, useRef } from 'react';

export function useIntersection(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px', ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function useCounter(target, duration = 1800) {
  const [ref, visible] = useIntersection({ threshold: 0.5 });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const pct  = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setCount(Math.round(ease * target));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);
  return [ref, count];
}

export function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [threshold]);
  return scrolled;
}

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] || '');
  useEffect(() => {
    const fn = () => {
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return active;
}

export function useCursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, raf;
    const onMove   = (e) => { mx = e.clientX; my = e.clientY; };
    const onEnter  = () => { dot.current?.classList.add('hovered');    ring.current?.classList.add('hovered'); };
    const onLeave  = () => { dot.current?.classList.remove('hovered'); ring.current?.classList.remove('hovered'); };
    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    const loop = () => {
      if (dot.current)  { dot.current.style.left  = mx + 'px'; dot.current.style.top  = my + 'px'; }
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      if (ring.current) { ring.current.style.left = rx + 'px'; ring.current.style.top = ry + 'px'; }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);
  return { dot, ring };
}
