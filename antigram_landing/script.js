(() => {
  'use strict';

  const navbar = document.getElementById('navbar');
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  /* ---------- Navbar scroll effect ---------- */
  function toggleNavbarState() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', toggleNavbarState, { passive: true });
  toggleNavbarState();

  /* ---------- Mobile menu (burger) ---------- */
  function closeMenu() {
    burgerBtn.classList.remove('open');
    mobileMenu.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Menyuni ochish');
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open', isOpen);
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
    burgerBtn.setAttribute('aria-label', isOpen ? 'Menyuni yopish' : 'Menyuni ochish');
  }

  burgerBtn.addEventListener('click', toggleMenu);

  /* ---------- Smooth scroll + active links ---------- */
  const smoothAnchors = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu > a[href^="#"], .hero-actions a[href^="#"]');

  smoothAnchors.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      const hash = targetId;
      if (history.pushState) {
        history.pushState(null, '', hash);
      } else {
        window.location.hash = hash;
      }

      const y = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });

      closeMenu();
      e.preventDefault();
    });
  });

  /* ---------- Active nav link highlighting ---------- */
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'))
    .filter((s) => document.querySelector(`.nav-links a[href="#${s.id}"]`));

  function highlightActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 80;
    let currentId = sections[0] ? sections[0].id : '';

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Right-side floating "back to top" ---------- */
  const backTopBtn = document.createElement('button');
  backTopBtn.className = 'back-top';
  backTopBtn.setAttribute('aria-label', 'Tepaga qaytish');
  backTopBtn.innerHTML = '↑';
  document.body.appendChild(backTopBtn);

  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function toggleBackTop() {
    backTopBtn.classList.toggle('visible', window.scrollY > 500);
  }

  function onScrollHandlers() {
    toggleNavbarState();
    highlightActiveLink();
    toggleBackTop();
  }

  window.addEventListener('scroll', onScrollHandlers, { passive: true });
})();