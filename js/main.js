/* ─────────────────────────────────────────────────────────────
   THE BELLAVERA  ·  main.js
───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── HERO SLIDESHOW ──────────────────────────────────────── */
  const slides = Array.from(document.querySelectorAll('.hero__slide'));
  const dots   = Array.from(document.querySelectorAll('.hero__dot'));
  let current  = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-pressed', 'false');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-pressed', 'true');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5800);
  }

  dots.forEach((dot, i) => {
    dot.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  if (slides.length > 1) startTimer();

  /* ── STICKY HEADER ───────────────────────────────────────── */
  const header = document.getElementById('site-header');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── MOBILE NAVIGATION ───────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');
  const spans     = hamburger ? Array.from(hamburger.querySelectorAll('span')) : [];

  function openMenu() {
    mainNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    spans[0].style.transform = 'translateY(7.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7.5px) rotate(-45deg)';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mainNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    mainNav.classList.contains('open') ? closeMenu() : openMenu();
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);

  document.addEventListener('click', (e) => {
    if (
      mainNav.classList.contains('open') &&
      !mainNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) closeMenu();
  });

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || (i * 100);
            setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el, i) => {
      el.dataset.delay = i * 120;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── SPLIT SECTION REVEAL ────────────────────────────────── */
  const splitBodies = document.querySelectorAll('.split__body');

  if ('IntersectionObserver' in window) {
    const splitObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            splitObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    splitBodies.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      splitObserver.observe(el);
    });
  }

  /* ── NEWSLETTER FORM ─────────────────────────────────────── */
  const nlForm    = document.getElementById('newsletter-form');
  const nlInput   = document.getElementById('nl-email');
  const nlSuccess = document.getElementById('nl-success');

  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = nlInput ? nlInput.value.trim() : '';
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

      if (!valid) {
        nlInput.style.borderColor = '#c0392b';
        nlInput.focus();
        return;
      }

      nlInput.style.borderColor = '';
      nlForm.querySelector('.newsletter__field').style.display = 'none';
      nlForm.querySelector('.newsletter__note').style.display  = 'none';
      if (nlSuccess) nlSuccess.hidden = false;
    });

    if (nlInput) {
      nlInput.addEventListener('input', () => {
        nlInput.style.borderColor = '';
      });
    }
  }

  /* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--hdr-top') || '120', 10) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      if (mainNav.classList.contains('open')) closeMenu();
    });
  });

})();
