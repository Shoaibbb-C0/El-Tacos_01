/* ============================================
   EL TACOS – Script with Image Error Handling
   ============================================ */

'use strict';

// ============================================
// IMAGE ERROR HANDLING – Global fallback system
// ============================================

/**
 * Generates a styled placeholder using placehold.co
 * as final fallback when all image sources fail
 */
function setupImageFallbacks() {
  const imageConfigs = [
    { selector: '.hero-main-image',     color: 'E85D04', text: '🌮+EL+TACOS',       size: '600x600' },
    { selector: '.card-image',          color: 'F2EBD9', text: 'Mexican+Food',       size: '500x300' },
    { selector: '.about-main-img',      color: 'E85D04', text: 'EL+TACOS+Kitchen',   size: '600x500' },
    { selector: '.about-secondary-img', color: '2D6A4F', text: 'Fresh',              size: '300x300' },
    { selector: '.gallery-item img',    color: 'F2EBD9', text: 'Gallery',            size: '400x400' },
  ];

  imageConfigs.forEach(({ selector, color, text, size }) => {
    document.querySelectorAll(selector).forEach((img) => {
      // If image is already broken on load
      if (img.complete && img.naturalHeight === 0) {
        applyFallback(img, color, text, size);
      }

      img.addEventListener('error', function () {
        applyFallback(this, color, text, size);
      });
    });
  });
}

function applyFallback(img, color, text, size) {
  // Prevent infinite error loop
  img.onerror = null;
  img.src = `https://placehold.co/${size}/${color}/FFFFFF?text=${text}`;
  img.style.objectFit = 'cover';
}

// ============================================
// NAVBAR – Scroll behavior
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  hamburger.classList.toggle('active');

  if (!isOpen) {
    mobileMenu.style.display = 'block';
    mobileMenu.offsetHeight; // force reflow
    mobileMenu.classList.add('open');
  } else {
    mobileMenu.classList.remove('open');
    setTimeout(() => { mobileMenu.style.display = 'none'; }, 350);
  }
});

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  setTimeout(() => { mobileMenu.style.display = 'none'; }, 350);
}
window.closeMobileMenu = closeMobileMenu;

// ============================================
// INTERSECTION OBSERVER – Scroll Animations
// ============================================
const animatedElements = document.querySelectorAll('[data-animate]');

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('animated');
      }, parseInt(delay));
      animationObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

animatedElements.forEach((el) => animationObserver.observe(el));

// ============================================
// HERO PARALLAX
// ============================================
const heroContent = document.querySelector('.hero-content');
const heroImageWrapper = document.querySelector('.hero-image-wrapper');
const floatingDecos = document.querySelectorAll('.floating-deco');

function handleParallax() {
  const scrollY = window.pageYOffset;
  if (scrollY < window.innerHeight) {
    const speedSlow = scrollY * 0.15;
    if (heroContent) {
      heroContent.style.transform = `translateY(${speedSlow}px)`;
      heroContent.style.opacity = String(Math.max(0, 1 - scrollY / (window.innerHeight * 0.8)));
    }
    if (heroImageWrapper) {
      heroImageWrapper.style.transform = `translateY(${speedSlow * 0.5}px)`;
    }
    floatingDecos.forEach((deco, i) => {
      const factor = (i % 3 + 1) * 0.08;
      deco.style.transform = `translateY(${scrollY * factor * (i % 2 === 0 ? 1 : -1)}px)`;
    });
  }
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

window.addEventListener('scroll', throttle(handleParallax, 16), { passive: true });

// ============================================
// HERO – Entry Animation
// ============================================
function animateHero() {
  const hc = document.querySelector('.hero-content');
  const hi = document.querySelector('.hero-image-wrapper');

  if (hc) {
    hc.style.cssText = 'opacity:0; transform:translateX(-30px);';
    setTimeout(() => {
      hc.style.cssText = 'transition: opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1); opacity:1; transform:translateX(0);';
    }, 200);
  }
  if (hi) {
    hi.style.cssText = 'opacity:0; transform:translateX(30px);';
    setTimeout(() => {
      hi.style.cssText = 'transition: opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1); opacity:1; transform:translateX(0);';
    }, 400);
  }
}

// ============================================
// REVIEWS CAROUSEL
// ============================================
const reviewsTrack = document.getElementById('reviewsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');
const reviewCards = document.querySelectorAll('.review-card');
let currentReview = 0;
let autoPlayInterval;

function getCardsPerView() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function updateCarousel(index) {
  const cardsPerView = getCardsPerView();
  const maxIndex = Math.max(0, reviewCards.length - cardsPerView);
  currentReview = Math.max(0, Math.min(index, maxIndex));

  const cardWidth = reviewCards[0]?.offsetWidth || 0;
  const translateX = currentReview * (cardWidth + 24);
  reviewsTrack.style.transform = `translateX(-${translateX}px)`;

  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentReview));
  if (prevBtn) prevBtn.style.opacity = currentReview === 0 ? '0.4' : '1';
  if (nextBtn) nextBtn.style.opacity = currentReview >= maxIndex ? '0.4' : '1';
}

nextBtn?.addEventListener('click', () => { updateCarousel(currentReview + 1); resetAutoPlay(); });
prevBtn?.addEventListener('click', () => { updateCarousel(currentReview - 1); resetAutoPlay(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { updateCarousel(i); resetAutoPlay(); }));

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    const max = Math.max(0, reviewCards.length - getCardsPerView());
    updateCarousel(currentReview >= max ? 0 : currentReview + 1);
  }, 4500);
}
function resetAutoPlay() { clearInterval(autoPlayInterval); startAutoPlay(); }

updateCarousel(0);
startAutoPlay();
window.addEventListener('resize', () => updateCarousel(currentReview), { passive: true });

// Touch swipe for reviews
let touchStartX = 0;
reviewsTrack?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
reviewsTrack?.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    updateCarousel(diff > 0 ? currentReview + 1 : currentReview - 1);
    resetAutoPlay();
  }
});

// ============================================
// GALLERY – Drag to Scroll + Auto Scroll
// ============================================
const galleryStrip = document.getElementById('galleryStrip');

if (galleryStrip) {
  let isGrabbing = false;
  let startX, scrollLeft;

  galleryStrip.addEventListener('mousedown', (e) => {
    isGrabbing = true;
    galleryStrip.classList.add('grabbing');
    startX = e.pageX - galleryStrip.offsetLeft;
    scrollLeft = galleryStrip.scrollLeft;
  });
  galleryStrip.addEventListener('mouseleave', () => { isGrabbing = false; galleryStrip.classList.remove('grabbing'); });
  galleryStrip.addEventListener('mouseup', () => { isGrabbing = false; galleryStrip.classList.remove('grabbing'); });
  galleryStrip.addEventListener('mousemove', (e) => {
    if (!isGrabbing) return;
    e.preventDefault();
    const x = e.pageX - galleryStrip.offsetLeft;
    galleryStrip.scrollLeft = scrollLeft - (x - startX) * 1.8;
  });

  // Touch drag
  let tStartX, tScrollLeft;
  galleryStrip.addEventListener('touchstart', (e) => { tStartX = e.touches[0].pageX; tScrollLeft = galleryStrip.scrollLeft; }, { passive: true });
  galleryStrip.addEventListener('touchmove', (e) => {
    galleryStrip.scrollLeft = tScrollLeft + (tStartX - e.touches[0].pageX) * 1.5;
  }, { passive: true });

  // Auto slow scroll
  let isUserHovering = false;
  const autoScroll = setInterval(() => {
    if (!isUserHovering) {
      galleryStrip.scrollLeft += 1;
      if (galleryStrip.scrollLeft >= galleryStrip.scrollWidth - galleryStrip.clientWidth) {
        galleryStrip.scrollLeft = 0;
      }
    }
  }, 20);

  galleryStrip.addEventListener('mouseenter', () => { isUserHovering = true; });
  galleryStrip.addEventListener('mouseleave', () => { isUserHovering = false; });
}

// ============================================
// CARD TILT EFFECTS (subtle)
// ============================================
function addTiltEffect(selector, maxTilt = 4) {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rX = ((y - cy) / cy) * -maxTilt;
      const rY = ((x - cx) / cx) * maxTilt;
      card.style.transform = `translateY(-6px) rotateX(${rX}deg) rotateY(${rY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.35s cubic-bezier(0.4,0,0.2,1)';
    });
  });
}

addTiltEffect('.menu-card', 3);
addTiltEffect('.experience-card', 4);

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight,
      behavior: 'smooth'
    });
  });
});

// ============================================
// CURSOR GLOW (desktop only)
// ============================================
if (window.innerWidth >= 1024) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:300px; height:300px; border-radius:50%;
    pointer-events:none; z-index:9999;
    background:radial-gradient(circle, rgba(232,93,4,0.06) 0%, transparent 70%);
    transform:translate(-50%,-50%); opacity:0;
    transition:opacity 0.3s ease; will-change:left,top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', throttle((e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  }, 16));

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

// ============================================
// DOM READY – Initialize everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize image fallbacks first
  setupImageFallbacks();

  // Animate hero
  setTimeout(animateHero, 100);

  // Set perspective for tilt cards
  document.querySelectorAll('.menu-grid, .experience-grid').forEach((g) => {
    g.style.perspective = '1000px';
  });

  // Stagger deco animations
  document.querySelectorAll('.floating-deco').forEach((d, i) => {
    d.style.animationDelay = `${i * 0.4}s`;
  });

  // Hide mobile menu initially
  mobileMenu.style.display = 'none';

  console.log('%c🌮 EL TACOS – Mexican Street Kitchen', 'color:#E85D04; font-size:16px; font-weight:bold;');
  console.log('%cKharghar, Navi Mumbai | Website Loaded ✅', 'color:#2D6A4F; font-size:12px;');
});