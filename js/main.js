/* ─────────────────────────────────────────────────────────────
   THE BELLAVERA  ·  main.js
───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── SOURCE PROTECTION ───────────────────────────────────── */
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.key === 'F12') { e.preventDefault(); return; }
    if (e.ctrlKey) {
      if (e.key === 'u' || e.key === 'U') { e.preventDefault(); return; }
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); return; }
      if (e.shiftKey && ['i','I','j','J','c','C'].includes(e.key)) {
        e.preventDefault(); return;
      }
    }
  });

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

  /* ── RESERVATION MODAL ───────────────────────────────────── */
  (function () {
    const ROOMS = [
      ['', 'Select a room type…'],
      ['Oceanview Room', 'Oceanview Room — From $495 / night'],
      ['Garden Suite', 'Garden Suite — From $695 / night'],
      ['Accessible Room', 'Accessible Room — From $495 / night'],
      ['The Crest Collection', 'The Crest Collection — From $1,295 / night'],
    ];

    const opts = ROOMS.map(([v, l]) =>
      '<option value="' + v + '">' + l + '</option>'
    ).join('');

    document.body.insertAdjacentHTML('beforeend', [
      '<div class="rm-overlay" id="rm-overlay" role="dialog" aria-modal="true" aria-labelledby="rm-heading" hidden>',
      '<div class="rm-card">',
      '<button class="rm-close" id="rm-close" aria-label="Close">',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">',
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      '</svg></button>',
      '<div id="rm-form-panel">',
      '<p class="eyebrow eyebrow--gold">The Bellavera Resort &amp; Spa</p>',
      '<h2 class="rm-title" id="rm-heading">Reserve Your <em>Stay</em></h2>',
      '<form class="rm-form" id="rm-form" novalidate>',
      '<div class="rm-row">',
      '<div class="rm-field" id="rmf-checkin"><label for="rm-checkin">Check-in</label><input type="date" id="rm-checkin" name="checkin" required></div>',
      '<div class="rm-field" id="rmf-checkout"><label for="rm-checkout">Check-out</label><input type="date" id="rm-checkout" name="checkout" required></div>',
      '</div>',
      '<div class="rm-field" id="rmf-room"><label for="rm-room">Room Type</label><select id="rm-room" name="room" required>' + opts + '</select></div>',
      '<div class="rm-row">',
      '<div class="rm-field"><label for="rm-adults">Adults</label><select id="rm-adults" name="adults"><option value="1">1 Adult</option><option value="2" selected>2 Adults</option><option value="3">3 Adults</option><option value="4">4 Adults</option></select></div>',
      '<div class="rm-field"><label for="rm-children">Children</label><select id="rm-children" name="children"><option value="0" selected>0 Children</option><option value="1">1 Child</option><option value="2">2 Children</option><option value="3">3 Children</option></select></div>',
      '</div>',
      '<div class="rm-divider"></div>',
      '<div class="rm-row">',
      '<div class="rm-field" id="rmf-first"><label for="rm-first">First Name</label><input type="text" id="rm-first" name="first" placeholder="First name" required autocomplete="given-name"></div>',
      '<div class="rm-field" id="rmf-last"><label for="rm-last">Last Name</label><input type="text" id="rm-last" name="last" placeholder="Last name" required autocomplete="family-name"></div>',
      '</div>',
      '<div class="rm-field" id="rmf-email"><label for="rm-email">Email Address</label><input type="email" id="rm-email" name="email" placeholder="your@email.com" required autocomplete="email"></div>',
      '<div class="rm-field"><label for="rm-phone">Phone <span class="rm-optional">(optional)</span></label><input type="tel" id="rm-phone" name="phone" placeholder="+1 (000) 000-0000" autocomplete="tel"></div>',
      '<div class="rm-field"><label for="rm-requests">Special Requests <span class="rm-optional">(optional)</span></label><textarea id="rm-requests" name="requests" rows="3" placeholder="Dietary requirements, accessibility needs, anniversary arrangements…"></textarea></div>',
      '<p class="rm-note">Rates are per night before tax &amp; resort fee. Payment collected at check-in. Free cancellation up to 48 hours prior to arrival.</p>',
      '<button type="submit" class="btn btn--navy rm-submit">Check Availability</button>',
      '</form></div>',
      '<div id="rm-confirm-panel" hidden>',
      '<span class="rm-confirm__icon">❆</span>',
      '<h2>Reservation Received</h2>',
      '<p class="rm-confirm__msg" id="rm-confirm-msg"></p>',
      '<p class="rm-confirm__ref" id="rm-confirm-ref"></p>',
      '<p class="rm-confirm__note">Our reservations team will contact you within 24 hours to confirm your booking and process payment details.</p>',
      '<button class="btn btn--navy" id="rm-done-btn">Close</button>',
      '</div>',
      '</div></div>',
    ].join(''));

    const overlay      = document.getElementById('rm-overlay');
    const formPanel    = document.getElementById('rm-form-panel');
    const confirmPanel = document.getElementById('rm-confirm-panel');
    const form         = document.getElementById('rm-form');

    function openModal(roomPreset) {
      formPanel.hidden    = false;
      confirmPanel.hidden = true;
      overlay.querySelectorAll('.rm-error').forEach(function (el) {
        el.classList.remove('rm-error');
      });

      const roomSel = document.getElementById('rm-room');
      roomSel.value = '';
      if (roomPreset) {
        for (let i = 0; i < roomSel.options.length; i++) {
          if (roomSel.options[i].value === roomPreset) {
            roomSel.value = roomPreset;
            break;
          }
        }
      }

      const today    = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      document.getElementById('rm-checkin').min  = today;
      document.getElementById('rm-checkout').min = tomorrow;

      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          overlay.classList.add('rm-open');
        });
      });
      document.getElementById('rm-checkin').focus();
    }

    function closeModal() {
      overlay.classList.remove('rm-open');
      setTimeout(function () {
        overlay.hidden = true;
        document.body.style.overflow = '';
      }, 320);
    }

    document.getElementById('rm-close').addEventListener('click', closeModal);
    document.getElementById('rm-done-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) closeModal();
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('.header-cta')) {
        e.preventDefault();
        openModal('');
        return;
      }
      const heroBtn = e.target.closest('.btn--outline-white');
      if (heroBtn && heroBtn.closest('.hero__cta-group')) {
        e.preventDefault();
        openModal('');
        return;
      }
      const roomCard = e.target.closest('.room-card[data-room]');
      if (roomCard) {
        e.preventDefault();
        openModal(roomCard.dataset.room);
        return;
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var required = {
        'rmf-checkin':  document.getElementById('rm-checkin').value,
        'rmf-checkout': document.getElementById('rm-checkout').value,
        'rmf-room':     document.getElementById('rm-room').value,
        'rmf-first':    document.getElementById('rm-first').value.trim(),
        'rmf-last':     document.getElementById('rm-last').value.trim(),
        'rmf-email':    document.getElementById('rm-email').value.trim(),
      };

      var ok = true;
      Object.keys(required).forEach(function (id) {
        var val  = required[id];
        var wrap = document.getElementById(id);
        var bad  = !val || (id === 'rmf-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
        if (wrap) wrap.classList.toggle('rm-error', bad);
        if (bad) ok = false;
      });

      if (!ok) return;

      var first    = document.getElementById('rm-first').value.trim();
      var last     = document.getElementById('rm-last').value.trim();
      var room     = document.getElementById('rm-room').value;
      var checkin  = document.getElementById('rm-checkin').value;
      var checkout = document.getElementById('rm-checkout').value;
      var email    = document.getElementById('rm-email').value.trim();
      var ref      = 'BLV-' + Math.random().toString(36).slice(2, 8).toUpperCase();

      function fmtDate(s) {
        return new Date(s + 'T12:00:00').toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
      }

      document.getElementById('rm-confirm-msg').textContent =
        'Thank you, ' + first + ' ' + last + '. Your request for a ' + room +
        ' (' + fmtDate(checkin) + ' – ' + fmtDate(checkout) + ') has been received.' +
        ' A confirmation will be sent to ' + email + '.';
      document.getElementById('rm-confirm-ref').textContent =
        'Confirmation Reference: ' + ref;

      formPanel.hidden    = true;
      confirmPanel.hidden = false;
      overlay.querySelector('.rm-card').scrollTop = 0;
    });

    ['rm-checkin', 'rm-checkout', 'rm-room', 'rm-first', 'rm-last', 'rm-email'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () {
        var wrap = el.closest('.rm-field');
        if (wrap) wrap.classList.remove('rm-error');
      });
    });
  })();

})();
