/* Interações progressivas sem dependências. Modelo demonstrativo Guará Agency. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('#header');
  const progress = document.querySelector('#progress-bar');
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#nav');
  let scheduled = false;
  function updateScroll() {
    const y = Math.max(0, window.scrollY);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (header) header.classList.toggle('scrolled', y > 50);
    if (progress) progress.style.width = Math.min(100, (y / max) * 100) + '%';
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateScroll); }
  }, { passive: true });
  updateScroll();
  if (menuToggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    };
    menuToggle.addEventListener('click', () => {
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }
  const revealElements = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -45px 0px', threshold: .11 });
    revealElements.forEach((el, index) => {
      if (index < 5) el.style.transitionDelay = Math.min(index * .06, .2) + 's';
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
  const faqs = [...document.querySelectorAll('.faq-list details')];
  faqs.forEach(current => current.addEventListener('toggle', () => {
    if (current.open) faqs.forEach(other => { if (other !== current) other.open = false; });
  }));
  const form = document.querySelector('#demo-form');
  const response = document.querySelector('#form-response');
  if (form && response) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      response.hidden = false;
      response.textContent = 'Simulação concluída. Este é um modelo de apresentação: nenhum dado foi enviado ou armazenado.';
      response.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
  }
  const stats = [...document.querySelectorAll('[data-count]')];
  if ('IntersectionObserver' in window && !reducedMotion) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target, value = Number(el.getAttribute('data-count'));
        if (!Number.isFinite(value)) continue;
        const duration = 850, start = performance.now();
        function frame(t) {
          const ratio = Math.min(1, (t - start) / duration);
          const n = Math.round(value * (1 - Math.pow(1 - ratio, 3)));
          el.textContent = String(n).padStart(2, '0');
          if (ratio < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        observer.unobserve(el);
      }
    }, { threshold: .8 });
    stats.forEach(el => countObserver.observe(el));
  }
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      window.history.replaceState(null, '', id);
    });
  });
})();