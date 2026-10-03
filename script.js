(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('open');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  const motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  let ticking = false;
  function updateParallax() {
    if (!motionOff) {
      const viewport = window.innerHeight;
      parallaxItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < viewport + 100) {
          const speed = Number(item.dataset.parallax || 0.08);
          const offset = (rect.top + rect.height / 2 - viewport / 2) * speed;
          item.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });
    }
    ticking = false;
  }
  function requestParallax() { if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); } }
  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax);
  updateParallax();

  const reviewModal = document.getElementById('review-modal');
  if (reviewModal) {
    const reviewKey = 'no-brand-review-prompt-shown';
    let alreadyShown = false;
    try { alreadyShown = sessionStorage.getItem(reviewKey) === '1'; } catch (_) {}
    if (!alreadyShown) {
      window.setTimeout(() => {
        try { sessionStorage.setItem(reviewKey, '1'); } catch (_) {}
        reviewModal.hidden = false;
        reviewModal.querySelector('.review-close')?.focus();
      }, 120000);
    }
    const closeReview = () => { reviewModal.hidden = true; };
    reviewModal.querySelectorAll('[data-review-close]').forEach(button => button.addEventListener('click', closeReview));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !reviewModal.hidden) closeReview();
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
