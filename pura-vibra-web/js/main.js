/* ═══════════════════════════════════════════════════════════
   PURA VIBRA — Interactive JavaScript
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ───── Navbar Scroll Effect ───── */
  const navbar = document.querySelector('.navbar');
  const mobileToggleBtn = document.querySelector('.mobile-toggle');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    const sections = ['inicio', 'menu', 'detox', 'testimonios', 'contacto'];
    const navLinks = document.querySelectorAll('.navbar-links a');

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.navbar-links a[href="#${sections[i]}"]`);
          if (activeLink) activeLink.classList.add('active');
          break;
        }
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ───── Smooth Scroll ───── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ───── Mobile Menu ───── */
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu on link click
  document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        closeMobileMenu();
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    });
  });

  /* ───── Product Tabs ───── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = document.getElementById(`tab-${target}`);
      if (content) content.classList.add('active');
    });
  });

  /* ───── Product Modal ───── */
  const modalOverlay = document.getElementById('productModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.querySelector('.modal-close');

  function openModal(product) {
    modalBody.innerHTML = `
      <div class="modal-img-wrap">
        <img src="img/${product.image}" alt="${product.name}">
        <button class="modal-close" aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body">
        <h2>${product.name}</h2>
        <p class="modal-price">$${product.price.toFixed(2)}</p>
        <div class="modal-ingredients">
          ${product.ingredients.map(ing => `<span>${ing}</span>`).join('')}
        </div>
        <div class="modal-benefits">
          <h4>Beneficios</h4>
          <ul>
            ${product.benefits.map(b => `
              <li>
                <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#58B368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>${b}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <button class="btn-primary btn-naranja" onclick="window.open('https://wa.me/1234567890','_blank')">
          Ordenar Ahora — $${product.price.toFixed(2)}
        </button>
      </div>
    `;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Attach close handler to new close button
    modalBody.querySelector('.modal-close').addEventListener('click', closeModal);
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Attach click handlers to product cards
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const data = JSON.parse(card.dataset.product);
      openModal(data);
    });
  });

  /* ───── Testimonial Carousel ───── */
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dots button');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoInterval;

  function goToSlide(index) {
    currentSlide = index;
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAuto() {
    autoInterval = setInterval(nextSlide, 5000);
  }

  function stopAuto() {
    clearInterval(autoInterval);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prevSlide(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); nextSlide(); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goToSlide(i);
      startAuto();
    });
  });

  startAuto();

  /* ───── Scroll Reveal Animations ───── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-80px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ───── Contact Form ───── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value;
      if (name) {
        alert(`Gracias ${name}! Tu mensaje ha sido enviado. Te contactaremos pronto.`);
        contactForm.reset();
      }
    });
  }

});
