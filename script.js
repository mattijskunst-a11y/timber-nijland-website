// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  const closeNav = () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      closeNav();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) closeNav();
  });
}

// reservation form submission (Formspree, with graceful fallback)
const reserveerForm = document.getElementById('reserveerForm');
const formStatus = document.getElementById('formStatus');
if (reserveerForm) {
  reserveerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = reserveerForm.querySelector('button');
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Versturen...';
    formStatus.textContent = '';

    try {
      const response = await fetch(reserveerForm.action, {
        method: 'POST',
        body: new FormData(reserveerForm),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        reserveerForm.reset();
        button.textContent = 'Verzonden — dank u wel';
        formStatus.textContent = 'Uw aanvraag is verstuurd. Timber neemt binnen twee werkdagen contact op.';
      } else {
        throw new Error('submission failed');
      }
    } catch (err) {
      button.disabled = false;
      button.textContent = originalLabel;
      formStatus.textContent = 'Verzenden via de site is niet gelukt. Probeer het opnieuw, of mail rechtstreeks naar mattijskunst@gmail.com.';
    }
  });
}

// header scroll state
const header = document.getElementById('siteHeader');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 700);
});

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// generate 8 seats around the table
const wrap = document.getElementById('tableWrap');
const seatCount = 8;
const radius = 46; // % of wrap
for(let i=0; i<seatCount; i++){
  const angle = (i / seatCount) * Math.PI * 2 - Math.PI/2;
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);
  const seat = document.createElement('div');
  seat.className = 'seat';
  seat.style.left = x + '%';
  seat.style.top = y + '%';
  seat.style.transform = 'translate(-50%,-50%)';
  seat.style.transitionDelay = (i*0.06) + 's';
  wrap.appendChild(seat);
}
