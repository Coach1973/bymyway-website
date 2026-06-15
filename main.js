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

// 捲動淡入（iframe 內直接顯示，不等 IntersectionObserver）
var inIframe = (window.self !== window.top);
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
}, { threshold: 0.05, rootMargin: '200px' });
document.querySelectorAll('.pain-card,.service-card,.course-card,.speaking-card,.testi-card,.stat-item').forEach(el => {
  el.classList.add('fade');
  if (inIframe) { el.classList.add('in'); } else { observer.observe(el); }
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

  cards.forEach(function(c) { c.classList.add('fade'); if (inIframe) { c.classList.add('in'); } else { observer.observe(c); } });
})();

// iframe 內 anchor 連結修正：滾動到正確位置
if (inIframe) {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id = this.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// 學員見證輪播（翻頁式 + 文字計數器）
(function() {
  var track = document.getElementById('testiTrack');
  if (!track) return;
  var cards = track.querySelectorAll('.testi-card');
  var total = cards.length;
  var page = 0;
  var autoTimer;

  function perView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function totalPages() { return Math.ceil(total / perView()); }

  function goTo(p) {
    var pages = totalPages();
    page = ((p % pages) + pages) % pages;
    var pv = perView();
    var offset = page * pv;
    if (offset > total - pv) offset = total - pv;
    track.style.transform = 'translateX(-' + (offset * 100 / pv) + '%)';
    var counter = document.getElementById('testiDots');
    var start = offset + 1;
    var end = Math.min(offset + pv, total);
    if (counter) counter.textContent = '第 ' + start + ' – ' + end + ' 則，共 ' + total + ' 則見證（' + (page + 1) + ' / ' + pages + ' 頁）';
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() { goTo(page + 1); }, 5000);
  }

  document.getElementById('testiNext').addEventListener('click', function() { goTo(page + 1); resetAuto(); });
  document.getElementById('testiPrev').addEventListener('click', function() { goTo(page - 1); resetAuto(); });
  window.addEventListener('resize', function() { goTo(page); });
  goTo(0);
  resetAuto();
})();

// 最新消息輪播（翻頁式，比照學員見證）
(function() {
  var track = document.getElementById('newsTrack');
  if (!track) return;
  var cards = track.querySelectorAll('.news-card');
  var total = cards.length;
  var page = 0;

  function perView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function totalPages() { return Math.ceil(total / perView()); }

  function goTo(p) {
    var pages = totalPages();
    page = ((p % pages) + pages) % pages;
    var pv = perView();
    var offset = page * pv;
    if (offset > total - pv) offset = total - pv;
    track.style.transform = 'translateX(-' + (offset * 100 / pv) + '%)';
    var counter = document.getElementById('newsCounter');
    var start = offset + 1;
    var end = Math.min(offset + pv, total);
    if (counter) counter.textContent = '第 ' + start + ' – ' + end + ' 場，共 ' + total + ' 場（' + (page + 1) + ' / ' + pages + ' 頁）';
  }

  document.getElementById('newsNext').addEventListener('click', function() { goTo(page + 1); });
  document.getElementById('newsPrev').addEventListener('click', function() { goTo(page - 1); });
  window.addEventListener('resize', function() { goTo(page); });
  goTo(0);
})();
