'use strict';

// These events contain no guest details. No external analytics collector is configured.
function trackEvent(name, properties = {}) {
  document.dispatchEvent(new CustomEvent('freshbite:analytics', { detail: { name, ...properties } }));
}

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('myTopnav');
  const hamburger = document.getElementById('navHamburger');
  const hero = document.getElementById('heroSection');
  function setHeroMargin() {
    if (nav && hero) hero.style.marginTop = `${nav.offsetHeight}px`;
    if (nav) document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
  }
  function closeNav() {
    nav?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.setAttribute('aria-label', 'Open navigation');
    setHeroMargin();
  }
  setHeroMargin();
  window.addEventListener('scroll', () => {
    if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 2px 14px rgba(0,0,0,0.14)' : '0 1px 4px rgba(0,0,0,0.08)';
  }, { passive: true });
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach(video => { video.pause(); video.removeAttribute('autoplay'); });
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeNav(); else setHeroMargin();
  });
  hamburger?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    setHeroMargin();
  });
  nav?.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('click', event => { if (!event.target.closest('.topnav')) closeNav(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) { closeNav(); hamburger.focus(); }
  });
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
  document.querySelectorAll('[data-photo-share]').forEach(link => link.addEventListener('click', () => trackEvent('photo_share')));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(entry => {
        trackEvent(entry.target.classList.contains('gallery-page') ? 'gallery_view' : `${entry.target.id}_view`);
        observer.unobserve(entry.target);
      });
    }, { threshold: .1 });
    document.querySelectorAll('#menu, #gallery, .gallery-page').forEach(section => {
      observer.observe(section);
    });
  }
});
