(() => {
  const video = document.querySelector('.film-frame video');
  if (!video) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  const update = () => {
    if (document.hidden || !visible || reduced.matches) video.pause();
    else video.play().catch(() => {});
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = Boolean(entries[0]?.isIntersecting);
      update();
    }, { threshold: 0.05 }).observe(video);
  } else { visible = true; update(); }
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener?.('change', update);
})();

;(() => {const tabs=[...document.querySelectorAll('.meal-tab')];const panels={buffet:document.getElementById('buffet'),marmitas:document.getElementById('marmitas')};function choose(name,focus=false){tabs.forEach(t=>{const active=t.dataset.meal===name;t.classList.toggle('is-active',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;if(active&&focus)t.focus()});Object.entries(panels).forEach(([key,el])=>{if(el)el.classList.toggle('is-selected',key===name)})}tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>choose(tab.dataset.meal));tab.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();choose(tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length].dataset.meal,true)}})});if(location.hash==='#marmitas')choose('marmitas');window.addEventListener('hashchange',()=>{if(location.hash==='#marmitas')choose('marmitas')})})();
(()=>{const detail=document.querySelector('.location-map-details');if(!detail)return;const media=matchMedia('(max-width:700px)');const apply=()=>{detail.open=!media.matches};apply();media.addEventListener?.('change',apply)})();

;(()=>{const el=document.querySelector('.reviews-quotes'),items=el?[...el.querySelectorAll('.review')]:[],counter=document.querySelector('.review-progress'),prev=document.querySelector('.review-prev'),next=document.querySelector('.review-next');if(!el||!items.length||!prev||!next)return;const index=()=>{const left=el.scrollLeft;return items.reduce((best,item,i)=>Math.abs(item.offsetLeft-items[0].offsetLeft-left)<Math.abs(items[best].offsetLeft-items[0].offsetLeft-left)?i:best,0)};const update=()=>{const i=index();if(counter)counter.textContent=(i+1)+' de '+items.length;prev.disabled=i===0;next.disabled=i===items.length-1};const move=delta=>{const i=Math.max(0,Math.min(items.length-1,index()+delta));el.scrollTo({left:items[i].offsetLeft-items[0].offsetLeft,behavior:'smooth'});setTimeout(update,350)};prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));el.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});window.addEventListener('resize',update);update()})();

/* Córtex motion V24 — GSAP ScrollTrigger + Lenis, same render ticker. */
(() => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return; // Browser and content stay functional if a CDN is unavailable.
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    let lenis;
    let ticker;
    if (typeof window.Lenis === 'function') {
      lenis = new window.Lenis({
        autoRaf: false, lerp: 0.105, smoothWheel: true,
        syncTouch: false, wheelMultiplier: 0.9, anchors: true
      });
      lenis.on('scroll', ScrollTrigger.update);
      ticker = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    // Entry motion on the real content, not letters or artificial typography.
    [
      '.restaurant-photo-wrap', '.restaurant-copy', '.options-head',
      '.options-layout', '.reviews-intro', '.reviews-quotes',
      '.review-action', '.location-heading', '.location-feature',
      '.location-map-details'
    ].forEach(selector => {
      const el = document.querySelector(selector);
      if (!el) return;
      gsap.fromTo(el, { autoAlpha: 0, y: 22 }, {
        autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });

    const map = document.querySelector('.location-map-details');
    const refresh = () => ScrollTrigger.refresh();
    map?.addEventListener('toggle', refresh);
    window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready?.then(refresh).catch(() => {});
    ScrollTrigger.refresh();
    return () => {
      map?.removeEventListener('toggle', refresh);
      window.removeEventListener('load', refresh);
      if (lenis) {
        gsap.ticker.remove(ticker);
        lenis.destroy();
      }
    };
  });

  mm.add('(min-width: 701px) and (prefers-reduced-motion: no-preference)', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-copy h1', { y: 26, autoAlpha: 0, duration: 1.0 })
      .from('.hero-description', { y: 16, autoAlpha: 0, duration: 0.75 }, '-=0.56')
      .from('.hero-actions', { y: 12, autoAlpha: 0, duration: 0.66 }, '-=0.48')
      .from('.service-times', { y: 10, autoAlpha: 0, duration: 0.58 }, '-=0.40')
      .from('.hero-film', { y: 25, autoAlpha: 0, scale: 1.035, duration: 1.15 }, 0.05);
    gsap.to('.restaurant-photo', {
      yPercent: 3.5, ease: 'none',
      scrollTrigger: { trigger: '.restaurant', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    });
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.querySelectorAll('.button,.option-action,.review-action-button').forEach(button => {
        button.addEventListener('pointerenter', () => gsap.to(button, { scale: 1.025, duration: 0.22, ease: 'power2.out', overwrite: 'auto' }));
        button.addEventListener('pointerleave', () => gsap.to(button, { scale: 1, duration: 0.28, ease: 'power2.out', overwrite: 'auto' }));
      });
    }
  });

  mm.add('(max-width: 700px) and (prefers-reduced-motion: no-preference)', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const title = hero.querySelector('.hero-copy h1');
    const desc = hero.querySelector('.hero-description');
    const action = hero.querySelector('.hero-actions');
    const hours = hero.querySelector('.service-times');
    const video = hero.querySelector('.film-frame video');
    if (!title || !desc || !action || !hours) return;

    // Mobile hero is sticky already: do not stack another GSAP pin.
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero, start: 'top top', end: 'bottom bottom',
        scrub: 0.75, invalidateOnRefresh: true
      }
    });
    timeline.fromTo(title, { opacity: 0.85, y: 13 }, { opacity: 1, y: 0, duration: 0.20 }, 0.02)
      .fromTo(desc, { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: 0.26 }, 0.16)
      .fromTo(action, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.23 }, 0.43)
      .fromTo(hours, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.66);
    if (video) timeline.fromTo(video, { scale: 1 }, { scale: 1.045, duration: 1 }, 0);

    const update = () => {
      const progress = timeline.scrollTrigger?.progress ?? 0;
      action.style.pointerEvents = progress >= 0.56 ? 'auto' : 'none';
      const rect = hero.getBoundingClientRect();
      document.body.classList.toggle('mobile-hero-active',
        rect.top < window.innerHeight && rect.bottom > window.innerHeight * 0.88);
    };
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom bottom',
      onUpdate: update, onRefresh: update, onToggle: update
    });
    update();
    return () => {
      action.style.removeProperty('pointer-events');
      document.body.classList.remove('mobile-hero-active');
    };
  });
})();
