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
})();(() => {const tabs=[...document.querySelectorAll('.meal-tab')];const panels={buffet:document.getElementById('buffet'),marmitas:document.getElementById('marmitas')};function choose(name,focus=false){tabs.forEach(t=>{const active=t.dataset.meal===name;t.classList.toggle('is-active',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;if(active&&focus)t.focus()});Object.entries(panels).forEach(([key,el])=>{if(el)el.classList.toggle('is-selected',key===name)})}tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>choose(tab.dataset.meal));tab.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();choose(tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length].dataset.meal,true)}})});if(location.hash==='#marmitas')choose('marmitas');window.addEventListener('hashchange',()=>{if(location.hash==='#marmitas')choose('marmitas')})})();
(()=>{const detail=document.querySelector('.location-map-details');if(!detail)return;const media=matchMedia('(max-width:700px)');const apply=()=>{detail.open=!media.matches};apply();media.addEventListener?.('change',apply)})();
