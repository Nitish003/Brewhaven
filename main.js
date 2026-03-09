/* ═══════════════════════════════════════════════════
   THE BREW HAVEN — main.js
   All interactions, animations, and visual effects
═══════════════════════════════════════════════════ */

'use strict';

/* ───────────────────────────────────────────────────
   1. PAGE LOAD CINEMATIC WIPE (runs immediately)
─────────────────────────────────────────────────── */
const overlayLeft  = document.querySelector('.overlay-left');
const overlayRight = document.querySelector('.overlay-right');

window.addEventListener('load', () => {
  // Small delay for dramatic effect
  setTimeout(() => {
    overlayLeft.classList.add('open');
    overlayRight.classList.add('open');
    // After overlay clears, start hero animations
    setTimeout(startHeroAnimations, 600);
  }, 200);
});

/* ───────────────────────────────────────────────────
   2. LENIS SMOOTH SCROLL
─────────────────────────────────────────────────── */
let lenis;

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Pass lenis to GSAP ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

// ─── Retry Lenis init ───
(function retryLenis() {
  if (typeof Lenis !== 'undefined') {
    initLenis();
  } else {
    setTimeout(retryLenis, 100);
  }
})();

/* ───────────────────────────────────────────────────
   3. HERO TEXT ANIMATION (GSAP word stagger)
─────────────────────────────────────────────────── */
function startHeroAnimations() {
  const words  = document.querySelectorAll('.hero-headline .word');
  const label  = document.querySelector('.hero-label');
  const sub    = document.querySelector('.hero-sub');
  const cta    = document.querySelector('.hero-cta');

  // Label fades first
  if (label) {
    label.style.transition = 'opacity 0.7s ease';
    label.style.opacity = '1';
  }

  // Words stagger in after 300ms
  setTimeout(() => {
    words.forEach((w, i) => {
      setTimeout(() => {
        w.classList.add('visible');
      }, i * 90);
    });
  }, 300);

  // Sub and CTA fade in
  setTimeout(() => {
    if (sub) { sub.style.opacity = '1'; sub.style.transform = 'none'; }
    if (cta) { cta.style.opacity = '1'; cta.style.transform = 'none'; }
  }, 300 + words.length * 90 + 200);
}

/* ───────────────────────────────────────────────────
   4. CUSTOM CURSOR
─────────────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';

  // Particle trail on fast movement
  const speed = Math.sqrt(
    Math.pow(e.movementX, 2) +
    Math.pow(e.movementY, 2)
  );
  if (speed > 12) spawnParticle(mouseX, mouseY);
});

// Smooth ring lerp
function lerpRing() {
  const lag = 0.12;
  ringX += (mouseX - ringX) * lag;
  ringY += (mouseY - ringY) * lag;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(lerpRing);
}
lerpRing();

// Hover effects
const hoverTargets = document.querySelectorAll('a, button, .brew-card, .blog-card');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

// Product image hover — coffee cup cursor
const productImgs = document.querySelectorAll('.card-img-wrap, .card-front');
productImgs.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.classList.add('product-hover');
    cursorRing.classList.remove('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.classList.remove('product-hover');
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});

// Particle spawner
function spawnParticle(x, y) {
  const p = document.createElement('div');
  p.classList.add('particle');
  const size = Math.random() * 4 + 2;
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x + (Math.random() - 0.5) * 10}px;
    top: ${y + (Math.random() - 0.5) * 10}px;
    animation-duration: ${0.4 + Math.random() * 0.4}s;
  `;
  document.body.appendChild(p);
  p.addEventListener('animationend', () => p.remove());
}

/* ───────────────────────────────────────────────────
   5. NAVBAR SCROLL BEHAVIOR
─────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ───────────────────────────────────────────────────
   6. MOBILE HAMBURGER
─────────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', toggleMenu);

function toggleMenu() {
  const isOpen = hamburger.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

/* ───────────────────────────────────────────────────
   7. INTERSECTION OBSERVER — Reveal Animations
─────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-stagger').forEach(el => {
  revealObserver.observe(el);
});

/* ───────────────────────────────────────────────────
   8. STAT COUNTERS (Brand Story)
─────────────────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => countObserver.observe(el));

function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(Math.round(increment * step), target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, duration / steps);
}

/* ───────────────────────────────────────────────────
   9. PARALLAX — Brand Story Image
─────────────────────────────────────────────────── */
const parallaxImg = document.querySelector('.parallax-img');

if (parallaxImg) {
  window.addEventListener('scroll', () => {
    const wrap   = parallaxImg.closest('.story-image-wrap');
    if (!wrap) return;
    const rect   = wrap.getBoundingClientRect();
    const winH   = window.innerHeight;
    // Only run when in viewport
    if (rect.bottom < 0 || rect.top > winH) return;
    const progress = (winH - rect.top) / (winH + rect.height);
    const offset   = (progress - 0.5) * 60;
    parallaxImg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

/* ───────────────────────────────────────────────────
   10. HERO IMAGE PARALLAX
─────────────────────────────────────────────────── */
const heroImg = document.querySelector('.hero-img');

if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled > window.innerHeight) return;
    heroImg.style.transform = `translateY(${scrolled * 0.35}px) scale(1.1)`;
  }, { passive: true });
  // Initial scale
  heroImg.style.transform = 'translateY(0) scale(1.1)';
}

/* ───────────────────────────────────────────────────
   11. HORIZONTAL DRAG SCROLL — Brewing Section
─────────────────────────────────────────────────── */
const brewWrapper = document.querySelector('.brewing-scroll-wrapper');

if (brewWrapper) {
  let isDown = false, startX = 0, scrollLeft = 0;

  brewWrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - brewWrapper.offsetLeft;
    scrollLeft = brewWrapper.scrollLeft;
  });
  brewWrapper.addEventListener('mouseleave', () => isDown = false);
  brewWrapper.addEventListener('mouseup',    () => isDown = false);
  brewWrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - brewWrapper.offsetLeft;
    const walk = (x - startX) * 1.5;
    brewWrapper.scrollLeft = scrollLeft - walk;
  });
}

/* ───────────────────────────────────────────────────
   12. NEWSLETTER FORM
─────────────────────────────────────────────────── */
const newsletterForm    = document.getElementById('newsletterForm');
const newsletterSuccess = document.getElementById('newsletterSuccess');
const emailInput        = document.getElementById('emailInput');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.style.borderBottomColor = '#e05555';
      setTimeout(() => {
        emailInput.style.borderBottomColor = '';
      }, 2000);
      return;
    }
    // Success state
    document.querySelector('.input-group').style.display = 'none';
    newsletterSuccess.classList.add('show');
  });

  emailInput.addEventListener('focus', () => {
    emailInput.style.borderBottomColor = '';
  });
}

/* ───────────────────────────────────────────────────
   13. FOOTER — Coffee Bean Background
─────────────────────────────────────────────────── */
const footerBeans = document.getElementById('footerBeans');

function createBean() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 30 24');
  svg.setAttribute('fill', 'none');
  svg.classList.add('footer-bean-svg');

  const bean = `
    <ellipse cx="15" cy="12" rx="12" ry="8" stroke="#C8860A" stroke-width="1"/>
    <path d="M15 4 C10 8 10 16 15 20" stroke="#C8860A" stroke-width="0.8"/>
  `;
  svg.innerHTML = bean;

  const size = 20 + Math.random() * 20;
  svg.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    animation: beanFloat ${4 + Math.random() * 4}s ease-in-out infinite;
    animation-delay: ${Math.random() * 4}s;
    opacity: 0.08;
  `;
  footerBeans.appendChild(svg);
}

if (footerBeans) {
  for (let i = 0; i < 24; i++) createBean();
}

/* ───────────────────────────────────────────────────
   14. GSAP — SCROLL-TRIGGERED ANIMATIONS (if loaded)
─────────────────────────────────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Animate nav logo on page load
  gsap.from('.nav-logo', {
    opacity: 0,
    y: -20,
    duration: 1,
    delay: 1.4,
    ease: 'power3.out',
  });

  // Products section section-title
  gsap.fromTo('.products .section-title', {
    opacity: 0,
    y: 50,
  }, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.products',
      start: 'top 75%',
    },
  });

  // Brewing glow pulse
  gsap.to('.brewing-glow', {
    scale: 1.3,
    opacity: 0.6,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Gold rule decorators in story
  gsap.from('.gold-rule', {
    scaleX: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.story',
      start: 'top 60%',
    },
    stagger: 0.3,
  });
}

// Wait for GSAP to load
(function retryGSAP() {
  if (typeof gsap !== 'undefined') {
    initGSAP();
  } else {
    setTimeout(retryGSAP, 200);
  }
})();

/* ───────────────────────────────────────────────────
   15. SMOOTH SCROLL for internal links
─────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ───────────────────────────────────────────────────
   16. REVEAL HERO ELEMENTS on first paint (fallback)
─────────────────────────────────────────────────── */
// Make sure hero elements are visible even without JS animations
document.querySelectorAll('.hero-label, .hero-sub, .hero-cta').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
});
