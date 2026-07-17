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

// reservation form submission (Formspree)
const reserveerForm = document.getElementById('reserveerForm');
const formStatus = document.getElementById('formStatus');
const datumInput = document.getElementById('datum');
const addToCalendar = document.getElementById('addToCalendar');
let icsObjectUrl = null;

if (datumInput) {
  datumInput.min = new Date().toISOString().split('T')[0];
}

function buildReservationIcs(dateStr) {
  const compact = dateStr.replace(/-/g, '');
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `reservering-${compact}-${Date.now()}@finediningbytimber.nl`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Timber Nijland Prive Dining//NL',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${compact}T180000`,
    `DTEND:${compact}T230000`,
    'SUMMARY:Diner met Timber Nijland (aanvraag)',
    'DESCRIPTION:Aanvraag voor een prive-dinneravond met Timber Nijland. Deze datum is nog niet bevestigd\\, Timber neemt binnen twee werkdagen contact op voor het voorgesprek.',
    'LOCATION:Bij u thuis',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

if (reserveerForm) {
  reserveerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = reserveerForm.querySelector('button');
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Versturen...';
    formStatus.textContent = '';
    if (addToCalendar) addToCalendar.hidden = true;

    const gekozenDatum = datumInput ? datumInput.value : '';

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

        if (gekozenDatum && addToCalendar) {
          if (icsObjectUrl) URL.revokeObjectURL(icsObjectUrl);
          const blob = new Blob([buildReservationIcs(gekozenDatum)], { type: 'text/calendar' });
          icsObjectUrl = URL.createObjectURL(blob);
          addToCalendar.href = icsObjectUrl;
          addToCalendar.hidden = false;
        }
      } else {
        throw new Error('submission failed');
      }
    } catch (err) {
      button.disabled = false;
      button.textContent = originalLabel;
      formStatus.textContent = 'Verzenden is niet gelukt. Probeer het opnieuw, of mail rechtstreeks naar mattijskunst@gmail.com.';
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
