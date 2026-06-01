/* ═══════════════════════════════════════════════
   PON VAAGAI — main.js
   ═══════════════════════════════════════════════ */

/* ── FORMSPREE ENDPOINT IDs ──────────────────────
   STEP: Go to https://formspree.io/
   1. Sign up free with ponvaagai1111@gmail.com
   2. Create a form → copy the ID (e.g. xpwzabcd)
   3. Paste both IDs below
   ─────────────────────────────────────────────── */
const BOOKING_FORM_ID = 'YOUR_BOOKING_FORM_ID';  // ← replace this
const ORDER_FORM_ID   = 'YOUR_ORDER_FORM_ID';    // ← replace this

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .gallery-item, .pricing-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px'; cursor.style.height = '20px'; cursor.style.opacity = '0.6';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px'; cursor.style.height = '10px'; cursor.style.opacity = '1';
    });
  });

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── MOBILE NAV ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      spans[0].style.transform = spans[2].style.transform = '';
      spans[1].style.opacity = '';
    }
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = spans[2].style.transform = '';
      spans[1].style.opacity = '';
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 80; });
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── PARTICLES ── */
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const count = window.innerWidth < 600 ? 12 : 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${4+Math.random()*6}s;--delay:${Math.random()*5}s;`;
      particleContainer.appendChild(p);
    }
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  /* ── ACTIVE NAV ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  function highlightNav() {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) current = s.id; });
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + current) a.style.color = 'var(--gold)';
    });
  }
  window.addEventListener('scroll', highlightNav);

  /* ── PRICING TILT ── */
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ═══════════════════════════════════
     GALLERY FILTER + LIGHTBOX
  ═══════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('hidden', !match);
        item.classList.toggle('visible-item', match);
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  let currentIndex = 0;
  const visibleItems = () => [...galleryItems].filter(i => !i.classList.contains('hidden'));

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbCaption.textContent = item.dataset.title || '';
      currentIndex = i;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  document.getElementById('lbClose').addEventListener('click', closeLB);
  document.getElementById('lightboxBackdrop').addEventListener('click', closeLB);
  document.getElementById('lbPrev').addEventListener('click', () => {
    const items = visibleItems();
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    const img = items[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbCaption.textContent = items[currentIndex].dataset.title || '';
  });
  document.getElementById('lbNext').addEventListener('click', () => {
    const items = visibleItems();
    currentIndex = (currentIndex + 1) % items.length;
    const img = items[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbCaption.textContent = items[currentIndex].dataset.title || '';
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
  });

  /* ═══════════════════════════════════
     BOOKING FORM — Formspree AJAX
  ═══════════════════════════════════ */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm(bookingForm)) return;

      const btn = document.getElementById('bookingBtn');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      const data = new FormData(bookingForm);

      try {
        const res = await fetch(`https://formspree.io/f/${BOOKING_FORM_ID}`, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          bookingForm.style.display = 'none';
          const success = document.getElementById('bookingSuccess');
          success.style.display = 'block';
          success.classList.add('visible');
        } else {
          alert('Something went wrong. Please try again or WhatsApp us directly.');
          btn.disabled = false;
          btn.textContent = '✦ Confirm Appointment ✦';
        }
      } catch {
        alert('Network error. Please try again or WhatsApp us directly.');
        btn.disabled = false;
        btn.textContent = '✦ Confirm Appointment ✦';
      }
    });
  }

  /* ═══════════════════════════════════
     ORDER FORM — Formspree AJAX
  ═══════════════════════════════════ */
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm(orderForm)) return;

      const btn = document.getElementById('orderBtn');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      const data = new FormData(orderForm);

      try {
        const res = await fetch(`https://formspree.io/f/${ORDER_FORM_ID}`, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          orderForm.style.display = 'none';
          const success = document.getElementById('orderSuccess');
          success.style.display = 'block';
          success.classList.add('visible');
        } else {
          alert('Something went wrong. Please try again or WhatsApp us directly.');
          btn.disabled = false;
          btn.textContent = '✦ Place Order ✦';
        }
      } catch {
        alert('Network error. Please try again or WhatsApp us directly.');
        btn.disabled = false;
        btn.textContent = '✦ Place Order ✦';
      }
    });
  }

}); // end DOMContentLoaded

/* ── FORM VALIDATION ── */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    if (!field.value.trim()) {
      group.classList.add('has-error');
      field.classList.add('error');
      valid = false;
    } else {
      group.classList.remove('has-error');
      field.classList.remove('error');
    }
  });
  return valid;
}

/* ── RESET FORM UI ── */
function resetFormUI(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  form.reset();
  form.style.display = 'block';
  success.style.display = 'none';
  success.classList.remove('visible');
}
