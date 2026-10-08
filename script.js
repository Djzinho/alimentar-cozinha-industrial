(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = document.querySelectorAll('.restaurant-copy,.restaurant-photo-wrap,.options-head,.option,.reviews-intro,.review,.review-action,.location-heading,.location-feature,.location-map-shell');
  if (!reduced && 'IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
    const seen = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        const element = entry.target;
        seen.add(element);
        observer.unobserve(element);
        const isMobile = window.innerWidth <= 700;
        const offset = isMobile ? 6 : 12;
        element.animate([{ transform: 'translateY('+offset+'px)' }, { transform: 'translateY(0)' }], {
          duration: isMobile ? 360 : 550, easing: 'cubic-bezier(.22,1,.36,1)', iterations: 1
        });
      }
    }, { threshold: .08, rootMargin: '0px 0px 36px 0px' });
    elements.forEach(el => observer.observe(el));
  }
  const video = document.querySelector('.film-frame video');
  if (video) {
    let intersecting = false;
    const update = () => {
      if (document.hidden || !intersecting) video.pause();
      else video.play().catch(() => {});
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        intersecting = !!entries[0]?.isIntersecting;
        update();
      }, { threshold: .05 }).observe(video);
    } else {
      intersecting = true;
      update();
    }
    document.addEventListener('visibilitychange', update);
  }
})();