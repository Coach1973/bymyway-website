// Navbar 捲動效果
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// 手機選單
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// 捲動淡入
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.pain-card,.service-card,.course-card,.speaking-card,.testi-card,.stat-item').forEach(el => {
  el.classList.add('fade');
  observer.observe(el);
});

// 數字計數動畫
const numEls = document.querySelectorAll('.stat-num[data-target]');
const numObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target);
    let cur = 0;
    const step = target / 60;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 16);
    numObs.unobserve(el);
  });
}, { threshold: 0.5 });
numEls.forEach(el => numObs.observe(el));

// 語錄輪播
(function() {
  const track = document.getElementById('qTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.carousel-card');
  const total = cards.length;
  let idx = 0;

  function perView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function update() {
    const pv = perView();
    if (idx > total - pv) idx = Math.max(0, total - pv);
    track.style.transform = 'translateX(-' + (idx * 100 / pv) + '%)';
    var atStart = idx === 0, atEnd = idx >= total - pv;
    ['qPrev','qPrevBottom'].forEach(function(id) {
      var b = document.getElementById(id);
      if (b) { b.style.opacity = atStart ? '0.3' : '1'; b.style.pointerEvents = atStart ? 'none' : 'auto'; }
    });
    ['qNext','qNextBottom'].forEach(function(id) {
      var b = document.getElementById(id);
      if (b) { b.style.opacity = atEnd ? '0.3' : '1'; b.style.pointerEvents = atEnd ? 'none' : 'auto'; }
    });
    var counter = document.getElementById('qCounter');
    if (counter) counter.textContent = (idx + 1) + ' / ' + (total - pv + 1);
    buildDots(pv);
  }

  function buildDots(pv) {
    var c = document.getElementById('qDots');
    if (!c) return;
    var pages = total - pv + 1;
    if (c.children.length !== pages) {
      c.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var d = document.createElement('button');
        d.dataset.i = i;
        d.addEventListener('click', function() { idx = parseInt(this.dataset.i); update(); });
        c.appendChild(d);
      }
    }
    Array.from(c.children).forEach(function(d, i) {
      d.className = i === idx ? 'active' : '';
    });
  }

  document.getElementById('qNext').addEventListener('click', function() { if (idx < total - perView()) { idx++; update(); } });
  document.getElementById('qPrev').addEventListener('click', function() { if (idx > 0) { idx--; update(); } });
  document.getElementById('qNextBottom').addEventListener('click', function() { if (idx < total - perView()) { idx++; update(); } });
  document.getElementById('qPrevBottom').addEventListener('click', function() { if (idx > 0) { idx--; update(); } });
  window.addEventListener('resize', update);
  update();

  cards.forEach(function(c) { c.classList.add('fade'); observer.observe(c); });
})();

// 訂閱表單
function handleSubscribe(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '訂閱成功！感謝你';
  btn.style.background = '#2a6e3a';
  btn.disabled = true;
}
