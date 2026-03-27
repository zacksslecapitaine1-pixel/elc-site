/* ============================================================
   ELC — English Language Center | main.js
   ============================================================ */

/* ── LANGUAGE TOGGLE ──────────────────────────────────────── */
function setLang(lang) {
  document.querySelectorAll('.fr-text').forEach(el => {
    el.style.display = lang === 'fr' ? '' : 'none';
  });
  document.querySelectorAll('.en-text').forEach(el => {
    el.style.display = lang === 'en' ? '' : 'none';
  });
  document.getElementById('btn-fr').classList.toggle('active', lang === 'fr');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  localStorage.setItem('elc-lang', lang);
}

// Restore saved language
(function() {
  const saved = localStorage.getItem('elc-lang') || 'fr';
  setLang(saved);
})();

/* ── MOBILE MENU ──────────────────────────────────────────── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

/* ── SCROLL REVEAL ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── ANIMATED COUNTERS ────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  const suffix = target >= 1000 ? '+' : '+';
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value >= 1000
      ? value.toLocaleString('fr-FR') + '+'
      : value + '+';
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (target) animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ── STICKY NAVBAR SHADOW ─────────────────────────────────── */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.style.boxShadow = '0 4px 30px rgba(15,46,154,0.18)';
  } else {
    navbar.style.boxShadow = '';
  }
}, { passive: true });

/* ── SMOOTH ANCHOR SCROLL ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── ACTIVE NAV LINK HIGHLIGHT ────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));
