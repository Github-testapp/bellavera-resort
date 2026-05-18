// Hero Slideshow
const slides = document.querySelectorAll('.hero__slide');
const dots = document.querySelectorAll('.hero__dot');
let current = 0;
let timer;

function goTo(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function next() {
  goTo((current + 1) % slides.length);
}

function startTimer() {
  timer = setInterval(next, 5500);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(timer);
    goTo(parseInt(dot.dataset.index));
    startTimer();
  });
});

startTimer();

// Sticky header shadow on scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = mainNav.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});

document.addEventListener('click', (e) => {
  if (!header.contains(e.target) && mainNav.classList.contains('open')) {
    mainNav.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Scroll-in animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-section__content, .highlight-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.75s ease, transform 0.75s ease';
  observer.observe(el);
});
