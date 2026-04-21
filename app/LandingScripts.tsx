'use client';

import { useEffect } from 'react';

export default function LandingScripts() {
  useEffect(() => {
    const nav = document.getElementById('nav');
    if (nav) {
      const handleScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
      window.addEventListener('scroll', handleScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((el) => { if (el.isIntersecting) el.target.classList.add('on'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade').forEach((el) => observer.observe(el));

    return () => { observer.disconnect(); };
  }, []);

  return null;
}
