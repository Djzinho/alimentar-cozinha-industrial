(() => {
  const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.hero-copy, .restaurant-copy, .options-header, .option, .location-copy, .location-action, .location-map-shell');
  if (motionAllowed && 'IntersectionObserver' in window) {
    targets.forEach(el => el.setAttribute('data-reveal', ''));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }, { threshold: .06, rootMargin: '0px 0px 20px 0px' });
    targets.forEach(el => observer.observe(el));
  }
  const video = document.querySelector('.film-frame video');
  if (video) {
    const update = () => {
      if (document.hidden) video.pause();
      else if (video.paused) video.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', update);
    video.addEventListener('error', () => { video.setAttribute('aria-label', 'Vídeo indisponível'); });
  }
})();
