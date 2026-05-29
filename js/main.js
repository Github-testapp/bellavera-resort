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

    window.bvOpenModal = openModal;

    document.addEventListener('click', function (e) {
      if (e.target.closest('.header-cta')) {
        e.preventDefault();
        openModal('');
        return;
      }
      var heroBtn = e.target.closest('.btn--outline-white');
      if (heroBtn && heroBtn.closest('.hero__cta-group')) {
        e.preventDefault();
        openModal('');
        return;
      }
      var roomCard = e.target.closest('.room-card[data-room]');
      if (roomCard) {
        e.preventDefault();
        openModal(roomCard.dataset.room);
        return;
      }
      var offerCard = e.target.closest('.offer-card');
      if (offerCard) {
        e.preventDefault();
        openModal('');
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

  /* ── COOKIE CONSENT ─────────────────────────────────────── */
  (function () {
    if (localStorage.getItem('bv-ck')) return;
    var b = document.createElement('div');
    b.className = 'cookie-banner';
    b.innerHTML =
      '<div class="cookie-banner__inner">' +
      '<p class="cookie-banner__text">We use cookies to personalise your experience and analyse site traffic.' +
      ' By continuing you agree to our <a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="cookie-banner__btns">' +
      '<button class="btn btn--gold ck-accept">Accept All</button>' +
      '<button class="ck-manage">Manage Preferences</button>' +
      '</div></div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { b.classList.add('ck-on'); }); });
    function dismiss() {
      localStorage.setItem('bv-ck', '1');
      b.classList.remove('ck-on');
      setTimeout(function () { b.remove(); }, 450);
    }
    b.querySelector('.ck-accept').addEventListener('click', dismiss);
    b.querySelector('.ck-manage').addEventListener('click', dismiss);
  })();

  /* ── BACK TO TOP ─────────────────────────────────────────── */
  (function () {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);
    window.addEventListener('scroll', function () {
      btn.classList.toggle('btt-on', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  })();

  /* ── SCROLL PROGRESS BAR ─────────────────────────────────── */
  (function () {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }, { passive: true });
  })();

  /* ── PAGE TRANSITION ─────────────────────────────────────── */
  (function () {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' ||
          href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 ||
          href.indexOf('javascript:') === 0 || link.target === '_blank') return;
      if (link.classList.contains('header-cta') ||
          (link.classList.contains('btn--outline-white') && link.closest('.hero__cta-group'))) return;
      e.preventDefault();
      var dest = href;
      document.body.style.cssText += ';opacity:0!important;transition:opacity .25s!important';
      setTimeout(function () { window.location.href = dest; }, 260);
    });
  })();

  /* ── WEATHER WIDGET ──────────────────────────────────────── */
  (function () {
    var phone = document.querySelector('.utility-phone');
    if (!phone) return;
    var codes = { 0:'☀', 1:'☀', 2:'⛅', 3:'☁', 45:'🌫', 48:'🌫' };
    function icon(c) { return codes[c] || (c < 70 ? '🌦' : c < 78 ? '❄' : c < 90 ? '🌦' : '⛈'); }
    fetch('https://api.open-meteo.com/v1/forecast?latitude=25.79&longitude=-80.13&current_weather=true&temperature_unit=fahrenheit')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var cw = d.current_weather;
        var w = document.createElement('span');
        w.className = 'weather-widget';
        w.textContent = 'Coral Bay · ' + Math.round(cw.temperature) + '°F ' + icon(cw.weathercode);
        phone.insertAdjacentElement('beforebegin', w);
      })
      .catch(function () {});
  })();

  /* ── LOCALE / CURRENCY SELECTOR ─────────────────────────── */
  (function () {
    var phone = document.querySelector('.utility-phone');
    if (!phone) return;
    function buildSel(label, opts) {
      var sel = document.createElement('div');
      sel.className = 'locale-selector';
      sel.innerHTML =
        '<button class="locale-btn" aria-haspopup="true">' + label +
        ' <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><polyline points="1 1 5 5 9 1"/></svg></button>' +
        '<div class="locale-dropdown">' +
        opts.map(function (o, i) { return '<button class="' + (i===0?'lc-on':'') + '" data-v="' + o + '">' + o + '</button>'; }).join('') +
        '</div>';
      var btn = sel.querySelector('.locale-btn');
      sel.querySelectorAll('.locale-dropdown button').forEach(function (ob) {
        ob.addEventListener('click', function () {
          sel.querySelectorAll('button').forEach(function (x) { x.classList.remove('lc-on'); });
          ob.classList.add('lc-on');
          btn.firstChild.textContent = ob.dataset.v + ' ';
        });
      });
      return sel;
    }
    var wrap = document.createElement('div');
    wrap.className = 'locale-wrap';
    wrap.appendChild(buildSel('EN', ['EN','日本語','中文','Español']));
    wrap.appendChild(buildSel('USD', ['USD','EUR','GBP','JPY']));
    phone.insertAdjacentElement('beforebegin', wrap);
  })();

  /* ── FOOTER LEGAL LINK FIX ───────────────────────────────── */
  (function () {
    var map = { 'Privacy Policy':'privacy.html', 'Terms of Use':'terms.html', 'Accessibility':'accessibility.html', 'Sitemap':'sitemap.html' };
    document.querySelectorAll('.footer-legal a').forEach(function (a) {
      var d = map[a.textContent.trim()];
      if (d) a.href = d;
    });
  })();

  /* ── DINING RESERVATION MODAL ────────────────────────────── */
  (function () {
    if (!document.querySelector('[data-dine]')) return;
    var TIMES = ['12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM'];
    var tOpts = TIMES.map(function (t) { return '<option>' + t + '</option>'; }).join('');
    document.body.insertAdjacentHTML('beforeend',
      '<div class="dm-overlay" id="dm-overlay" role="dialog" aria-modal="true" aria-labelledby="dm-heading" hidden>' +
      '<div class="dm-card"><button class="dm-close" id="dm-close" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '<div id="dm-fp"><p class="eyebrow eyebrow--gold" id="dm-rlabel"></p>' +
      '<h2 class="dm-title" id="dm-heading">Reserve a Table</h2>' +
      '<form class="dm-form" id="dm-form" novalidate>' +
      '<div class="dm-row">' +
      '<div class="dm-field" id="dmf-date"><label for="dm-date">Date</label><input type="date" id="dm-date" required></div>' +
      '<div class="dm-field"><label for="dm-time">Time</label><select id="dm-time">' + tOpts + '</select></div>' +
      '</div>' +
      '<div class="dm-field"><label for="dm-party">Party Size</label>' +
      '<select id="dm-party"><option>1 Guest</option><option selected>2 Guests</option><option>3 Guests</option><option>4 Guests</option><option>5 Guests</option><option>6 Guests</option><option>7 Guests</option><option>8+ Guests</option></select></div>' +
      '<div class="dm-row">' +
      '<div class="dm-field" id="dmf-fn"><label for="dm-fn">First Name</label><input type="text" id="dm-fn" placeholder="First name" required autocomplete="given-name"></div>' +
      '<div class="dm-field" id="dmf-ln"><label for="dm-ln">Last Name</label><input type="text" id="dm-ln" placeholder="Last name" required autocomplete="family-name"></div>' +
      '</div>' +
      '<div class="dm-field" id="dmf-em"><label for="dm-em">Email</label><input type="email" id="dm-em" placeholder="your@email.com" required autocomplete="email"></div>' +
      '<div class="dm-field"><label for="dm-dn">Notes <span class="form-optional">(optional)</span></label><textarea id="dm-dn" rows="2" placeholder="Allergies, occasions, seating preferences…"></textarea></div>' +
      '<p class="dm-note">Confirmed by email within 1 hour. Cancel up to 4 hours prior.</p>' +
      '<button type="submit" class="btn btn--navy dm-submit">Confirm Reservation</button>' +
      '</form></div>' +
      '<div id="dm-cp" hidden><div class="dm-confirm">' +
      '<span class="dm-confirm__icon">✦</span><h3>Table Reserved</h3>' +
      '<p id="dm-cm"></p><span class="dm-confirm__ref" id="dm-cr"></span>' +
      '</div></div></div></div>'
    );
    var ov = document.getElementById('dm-overlay');
    var fp = document.getElementById('dm-fp');
    var cp = document.getElementById('dm-cp');
    var fm = document.getElementById('dm-form');
    function openD(rest) {
      fp.hidden = false; cp.hidden = true;
      ov.querySelectorAll('.dm-error').forEach(function (el) { el.classList.remove('dm-error'); });
      document.getElementById('dm-rlabel').textContent = rest;
      document.getElementById('dm-date').min = new Date().toISOString().split('T')[0];
      ov.hidden = false; document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add('dm-open'); }); });
    }
    function closeD() {
      ov.classList.remove('dm-open');
      setTimeout(function () { ov.hidden = true; document.body.style.overflow = ''; }, 320);
    }
    document.getElementById('dm-close').addEventListener('click', closeD);
    ov.addEventListener('click', function (e) { if (e.target === ov) closeD(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) closeD(); });
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-dine]');
      if (btn) { e.preventDefault(); openD(btn.dataset.dine); }
    });
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    fm.addEventListener('submit', function (e) {
      e.preventDefault();
      var checks = [
        {id:'dmf-date', v:document.getElementById('dm-date').value},
        {id:'dmf-fn',   v:document.getElementById('dm-fn').value.trim()},
        {id:'dmf-ln',   v:document.getElementById('dm-ln').value.trim()},
        {id:'dmf-em',   v:document.getElementById('dm-em').value.trim(), email:true},
      ];
      var ok = true;
      checks.forEach(function (f) {
        var bad = !f.v || (f.email && !re.test(f.v));
        var w = document.getElementById(f.id);
        if (w) w.classList.toggle('dm-error', bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      var rest = document.getElementById('dm-rlabel').textContent;
      var d = new Date(document.getElementById('dm-date').value + 'T12:00:00').toLocaleDateString('en-US', {weekday:'short',month:'long',day:'numeric'});
      var t = document.getElementById('dm-time').value;
      var p = document.getElementById('dm-party').value;
      var nm = document.getElementById('dm-fn').value.trim() + ' ' + document.getElementById('dm-ln').value.trim();
      var ref = 'DIN-' + Math.random().toString(36).slice(2,8).toUpperCase();
      document.getElementById('dm-cm').textContent = 'Thank you, ' + nm + '. A table for ' + p + ' at ' + rest + ' on ' + d + ' at ' + t + ' has been reserved.';
      document.getElementById('dm-cr').textContent = 'Reference: ' + ref;
      fp.hidden = true; cp.hidden = false;
    });
    ['dm-date','dm-fn','dm-ln','dm-em'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { var w = el.closest('.dm-field'); if (w) w.classList.remove('dm-error'); });
    });
  })();

  /* ── STICKY BOOKING BAR (stays.html only) ────────────────── */
  (function () {
    if (!document.querySelector('.rooms-section')) return;
    document.body.insertAdjacentHTML('beforeend',
      '<div class="sticky-book" id="sticky-book" aria-label="Quick reservation">' +
      '<div class="sticky-book__inner">' +
      '<p class="sticky-book__title">Reserve a Room</p>' +
      '<div class="sticky-book__fields">' +
      '<label class="sticky-book__field"><span>Check-in</span><input type="date" id="sb-ci"></label>' +
      '<label class="sticky-book__field"><span>Check-out</span><input type="date" id="sb-co"></label>' +
      '<label class="sticky-book__field" style="max-width:200px"><span>Room Type</span>' +
      '<select id="sb-room"><option value="">All Types</option>' +
      '<option value="Oceanview Room">Oceanview Room</option>' +
      '<option value="Garden Suite">Garden Suite</option>' +
      '<option value="Accessible Room">Accessible Room</option>' +
      '<option value="The Crest Collection">The Crest Collection</option>' +
      '</select></label>' +
      '</div>' +
      '<button class="btn btn--gold" id="sb-btn" style="flex-shrink:0;padding:11px 26px;font-size:10px;letter-spacing:2.5px">Check Availability</button>' +
      '</div></div>'
    );
    var bar = document.getElementById('sticky-book');
    var today = new Date().toISOString().split('T')[0];
    var tmr   = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    document.getElementById('sb-ci').min = today;
    document.getElementById('sb-co').min = tmr;
    var intro = document.querySelector('.page-intro');
    if (intro && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        bar.classList.toggle('sb-on', !entries[0].isIntersecting);
      }, { threshold: 0 }).observe(intro);
    }
    document.getElementById('sb-btn').addEventListener('click', function () {
      var room = document.getElementById('sb-room').value;
      if (window.bvOpenModal) {
        window.bvOpenModal(room);
        setTimeout(function () {
          var ci = document.getElementById('sb-ci').value;
          var co = document.getElementById('sb-co').value;
          if (ci && document.getElementById('rm-checkin')) document.getElementById('rm-checkin').value = ci;
          if (co && document.getElementById('rm-checkout')) document.getElementById('rm-checkout').value = co;
        }, 80);
      }
    });
  })();

})();
