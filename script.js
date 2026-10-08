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

;(()=>{const el=document.querySelector('.reviews-quotes'),items=el?[...el.querySelectorAll('.review')]:[],counter=document.querySelector('.review-progress'),prev=document.querySelector('.review-prev'),next=document.querySelector('.review-next');if(!el||!items.length||!prev||!next)return;const index=()=>{const left=el.scrollLeft;return items.reduce((best,item,i)=>Math.abs(item.offsetLeft-items[0].offsetLeft-left)<Math.abs(items[best].offsetLeft-items[0].offsetLeft-left)?i:best,0)};const update=()=>{const i=index();if(counter)counter.textContent=(i+1)+' de '+items.length;prev.disabled=i===0;next.disabled=i===items.length-1};const move=delta=>{const i=Math.max(0,Math.min(items.length-1,index()+delta));el.scrollTo({left:items[i].offsetLeft-items[0].offsetLeft,behavior:'smooth'});setTimeout(update,350)};prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));el.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});window.addEventListener('resize',update);update()})();

;(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const mobile = window.matchMedia('(max-width:700px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mobile.matches || reduced.matches) return;
  const clamp = (n) => Math.max(0, Math.min(1, n));
  const ease = (n) => {const x = clamp(n); return x*x*(3-2*x)};
  const fade = (p,a,b) => ease((p-a)/(b-a));
  hero.classList.add('scroll-hero-enabled');
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const rect = hero.getBoundingClientRect();
    const distance = Math.max(1, rect.height - window.innerHeight);
    const p = clamp(-rect.top / distance);
    const title = .83 + .17 * fade(p, .015, .17);
    const description = fade(p, .16, .41);
    const action = fade(p, .43, .67);
    const hours = fade(p, .61, .84);
    hero.style.setProperty('--hero-title-opacity', title.toFixed(3));
    hero.style.setProperty('--hero-title-y', ((1-title)*19).toFixed(1)+'px');
    hero.style.setProperty('--hero-desc-opacity', description.toFixed(3));
    hero.style.setProperty('--hero-desc-y', ((1-description)*21).toFixed(1)+'px');
    hero.style.setProperty('--hero-cta-opacity', action.toFixed(3));
    hero.style.setProperty('--hero-cta-y', ((1-action)*20).toFixed(1)+'px');
    hero.style.setProperty('--hero-hours-opacity', hours.toFixed(3));
    hero.style.setProperty('--hero-eyebrow-opacity', (.88+.12*fade(p,0,.2)).toFixed(3));
    hero.classList.toggle('hero-actions-ready', p >= .52);
    document.body.classList.toggle('mobile-hero-active', rect.bottom > window.innerHeight * .9 && rect.top < window.innerHeight);
  };
  const request = () => {if (!scheduled){scheduled = true; requestAnimationFrame(update)}};
  document.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  window.addEventListener('pageshow', request);
  update();
})();
