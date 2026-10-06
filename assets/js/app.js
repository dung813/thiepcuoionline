/* ================= THIỆP HOÀNG KIM — logic ================= */
(() => {
  const D = window.INVITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');
  const DOW = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const store = {
    get: (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  const wedding = new Date(D.date);
  const initial = s => s.trim().split(/\s+/).pop()[0].toUpperCase();
  const mono = `${initial(D.groom.nick)}&${initial(D.bride.nick)}`;

  /* ---------- Gắn dữ liệu ---------- */
  const bind = {
    couple: `${D.groom.nick} & ${D.bride.nick}`,
    initials: `${initial(D.groom.nick)}·${initial(D.bride.nick)}`,
    dateDots: `${pad(wedding.getDate())} · ${pad(wedding.getMonth() + 1)} · ${wedding.getFullYear()}`,
    heroDate: `${pad(wedding.getDate())} . ${pad(wedding.getMonth() + 1)} . ${wedding.getFullYear()}`,
    groomNick: D.groom.nick, brideNick: D.bride.nick, groomName: D.groom.name, brideName: D.bride.name,
    groomFather: D.groom.father, groomMother: D.groom.mother, brideFather: D.bride.father, brideMother: D.bride.mother,
    groomBio: D.groom.bio, brideBio: D.bride.bio, quote: D.quote, message: D.message, thanks: D.thanks
  };
  $$('[data-bind]').forEach(el => { el.textContent = bind[el.dataset.bind] ?? ''; });

  /* Tên khách mời qua URL: ?to=Anh%20Tuấn */
  const guest = new URLSearchParams(location.search).get('to');
  if (guest) $('#guestLine b').textContent = guest;

  /* ---------- Ảnh (có khung thay thế nếu thiếu) ---------- */
  // Ảnh nằm trong một lớp .img riêng để có thể zoom/parallax mà không làm méo khung
  const setPhoto = (el, src) => {
    el.classList.add('placeholder'); el.dataset.mono = mono;
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const layer = document.createElement('i');
      layer.className = 'img';
      layer.style.backgroundImage = `url("${src}")`;
      el.prepend(layer);
      el.classList.remove('placeholder');
      requestAnimationFrame(() => layer.classList.add('loaded'));
    };
    img.src = src;
  };
  const photoMap = { cover: D.cover || D.photos[0], groom: D.groom.photo, bride: D.bride.photo };
  $$('[data-photo]').forEach(el => setPhoto(el, photoMap[el.dataset.photo]));
  $('.hero-bg').classList.remove('placeholder'); // nền hero dùng gradient tối khi thiếu ảnh

  /* ---------- Tách chữ để hiện từng ký tự ---------- */
  $$('.split').forEach(el => {
    el.innerHTML = [...el.textContent].map((c, i) =>
      `<span class="ch${c === ' ' ? ' sp' : ''}" style="transition-delay:${(i * 0.06).toFixed(2)}s">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
  });

  /* ================= PHONG BÌ ================= */
  const intro = $('#intro'), env = $('#envelope');
  const openInvite = () => {
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    burst(innerWidth / 2, innerHeight / 2, 70);
    playMusic();
    setTimeout(() => {
      intro.classList.add('gone');
      document.body.classList.remove('locked'); window.__lenis?.start();
      startHero();
    }, reduce ? 50 : 1900);
    setTimeout(() => intro.remove(), 3200);
  };
  $('#openBtn').addEventListener('click', openInvite);
  if (new URLSearchParams(location.search).has('open')) { intro.remove(); document.body.classList.remove('locked'); setTimeout(() => startHero(), 50); }
  env.addEventListener('click', openInvite);

  const startHero = () => {
    $('#hero').classList.add('go');
    $$('.hero .split').forEach((el, i) => setTimeout(() => el.classList.add('in'), 200 + i * 700));
    $$('.hero .reveal').forEach(el => el.classList.add('in'));
  };

  /* ================= REVEAL KHI CUỘN ================= */
  // so le độ trễ cho các phần tử cùng nhóm
  $$('.sec').forEach(sec => $$('.reveal', sec).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 6) * 0.08}s`)));
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  const watch = root => $$('.reveal, .tl-item', root).forEach(el => { if (!el.closest('.hero')) io.observe(el); });

  /* ================= ĐẾM NGƯỢC ================= */
  const cdEls = Object.fromEntries($$('#cd b').map(b => [b.dataset.u, b]));
  const tickCd = () => {
    let s = Math.max(0, Math.floor((wedding - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    for (const k in v) {
      const t = k === 'd' ? String(v[k]).padStart(2, '0') : pad(v[k]);
      if (cdEls[k].textContent !== t) {
        cdEls[k].textContent = t;
        cdEls[k].classList.remove('tick'); void cdEls[k].offsetWidth; cdEls[k].classList.add('tick');
      }
    }
  };
  tickCd(); setInterval(tickCd, 1000);

  /* ---------- Lịch tháng ---------- */
  (() => {
    const y = wedding.getFullYear(), m = wedding.getMonth();
    const first = (new Date(y, m, 1).getDay() + 6) % 7; // bắt đầu từ thứ hai
    const days = new Date(y, m + 1, 0).getDate();
    let cells = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(x => `<span class="dow">${x}</span>`).join('');
    cells += '<span></span>'.repeat(first);
    for (let d = 1; d <= days; d++) cells += `<span class="d${d === wedding.getDate() ? ' hit' : ''}">${d}</span>`;
    $('#cal').innerHTML = `<h4>Tháng ${m + 1} · ${y}</h4><div class="grid">${cells}</div>`;
    const main = D.events[D.events.length - 1];
    const fmt = d => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const end = new Date(wedding.getTime() + 4 * 3600e3);
    $('#calBtn').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + `&text=${encodeURIComponent(`Đám cưới ${D.groom.nick} & ${D.bride.nick}`)}`
      + `&dates=${fmt(wedding)}/${fmt(end)}`
      + `&location=${encodeURIComponent(`${main.place}, ${main.address}`)}`;
  })();

  /* ================= SỰ KIỆN ================= */
  const icons = ['🏮', '💒', '🥂'];
  $('#eventList').innerHTML = D.events.map((e, i) => {
    const t = new Date(e.time);
    const q = encodeURIComponent(`${e.place}, ${e.address}`);
    return `<article class="ev reveal zoom"><div class="ev-in">
      <div class="ev-ico">${icons[i % icons.length]}</div>
      <h3>${esc(e.title)}</h3>
      <time>${pad(t.getHours())}:${pad(t.getMinutes())}</time>
      <div class="day">${DOW[t.getDay()]}, ${pad(t.getDate())}/${pad(t.getMonth() + 1)}/${t.getFullYear()}</div>
      <div class="place">${esc(e.place)}${e.hall ? `<br><small>${esc(e.hall)}</small>` : ''}</div>
      <div class="addr">${esc(e.address)}</div>
      <a class="btn ghost sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${q}">📍 Chỉ đường</a>
    </div></article>`;
  }).join('');

  /* ================= CHUYỆN TÌNH ================= */
  $('#timeline').insertAdjacentHTML('beforeend', D.story.map(s =>
    `<div class="tl-item reveal"><div class="yr">${esc(s.date)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join(''));

  /* ================= ALBUM + LIGHTBOX ================= */
  $('#gallery').innerHTML = D.photos.map((p, i) =>
    `<button class="g reveal zoom" data-i="${i}" aria-label="Xem ảnh ${i + 1}"><div class="ph" data-src="${esc(p)}"></div></button>`).join('');
  $$('#gallery .ph').forEach(el => setPhoto(el, el.dataset.src));

  const lb = $('#lb'), lbImg = $('#lbImg');
  let cur = 0;
  const show = i => {
    cur = (i + D.photos.length) % D.photos.length;
    const src = D.photos[cur], ph = $(`#gallery [data-i="${cur}"] .ph`);
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
    lbImg.className = 'lb-img'; lbImg.style.backgroundImage = '';
    if (ph.classList.contains('placeholder')) { lbImg.classList.add('placeholder'); lbImg.dataset.mono = mono; }
    else lbImg.style.backgroundImage = `url("${src}")`;
    $('#lbCap').textContent = `${cur + 1} / ${D.photos.length}`;
  };
  $('#gallery').addEventListener('click', e => {
    const g = e.target.closest('.g'); if (!g) return;
    show(+g.dataset.i); lb.hidden = false; document.body.style.overflow = 'hidden'; window.__lenis?.stop();
  });
  const closeLb = () => { if (lb.hidden) return; lb.hidden = true; document.body.style.overflow = ''; window.__lenis?.start(); };
  lb.addEventListener('click', e => {
    const a = e.target.dataset.lb;
    if (a === 'close' || e.target === lb) closeLb();
    else if (a === 'prev') show(cur - 1);
    else if (a === 'next') show(cur + 1);
  });
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLb(); closeGift(); }
    if (lb.hidden) return;
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  /* ================= RSVP ================= */
  const suggestions = ['Trăm năm hạnh phúc 💕', 'Chúc hai bạn mãi yêu thương', 'Sớm có tin vui nhé 👶', 'Hẹn gặp ở tiệc cưới! 🥂'];
  const form = $('#rsvpForm');
  $('#chips').innerHTML = suggestions.map(s => `<button type="button" class="chip">${esc(s)}</button>`).join('');
  $('#chips').addEventListener('click', e => { if (e.target.matches('.chip')) form.msg.value = e.target.textContent; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) { toast('Bạn vui lòng nhập họ tên nhé'); form.name.focus(); return; }
    const yes = form.att.value === 'yes';
    const entry = { name, yes, side: form.side.value, count: +form.count.value || 1, msg: form.msg.value.trim(), at: Date.now() };
    const list = store.get('hk-wishes', []); list.unshift(entry); store.set('hk-wishes', list.slice(0, 60));
    renderWishes();
    form.reset();
    if (yes) { confetti(); toast('Cảm ơn bạn! Hẹn gặp ở tiệc cưới nhé 🎉'); }
    else toast('Cảm ơn bạn đã báo tin và gửi lời chúc 💌');
  });

  /* ================= LỜI CHÚC ================= */
  const seed = [
    { name: 'Minh Anh', side: 'Nhà gái', msg: 'Chúc hai bạn trăm năm hạnh phúc, mãi yêu nhau như ngày đầu!', at: Date.now() - 864e5 },
    { name: 'Hoàng Long', side: 'Nhà trai', msg: 'Chúc mừng anh Kiệt và chị Ngọc. Hạnh phúc viên mãn nhé!', at: Date.now() - 2 * 864e5 },
    { name: 'Thu Trang', side: 'Nhà gái', msg: 'Cô dâu xinh nhất hệ mặt trời. Sớm có em bé nha 💕', at: Date.now() - 3 * 864e5 }
  ];
  const ago = t => { const m = Math.round((Date.now() - t) / 6e4); return m < 1 ? 'vừa xong' : m < 60 ? `${m} phút trước` : m < 1440 ? `${Math.round(m / 60)} giờ trước` : `${Math.round(m / 1440)} ngày trước`; };
  const renderWishes = () => {
    const list = [...store.get('hk-wishes', []).filter(w => w.msg), ...seed];
    $('#wishWall').innerHTML = list.map((w, i) =>
      `<div class="wish" style="animation-delay:${Math.min(i, 8) * 0.06}s"><b>${esc(w.name)}</b><small>${esc(w.side || '')} · ${ago(w.at)}</small><p>${esc(w.msg)}</p></div>`).join('');
  };
  renderWishes();

  /* ================= MỪNG CƯỚI ================= */
  const giftModal = $('#giftModal');
  $('#banks').innerHTML = Object.values(D.gift).map(g => {
    const qr = `https://img.vietqr.io/image/${encodeURIComponent(g.bank.toLowerCase().replace(/\s+/g, ''))}-${encodeURIComponent(g.acc)}-qr_only.png?accountName=${encodeURIComponent(g.owner)}`;
    return `<div class="bank"><h4>${esc(g.label)}</h4><img src="${qr}" alt="Mã QR ${esc(g.bank)}" loading="lazy" onerror="this.remove()">
      <div>${esc(g.bank)}</div><div class="acc">${esc(g.acc)}</div><small>${esc(g.owner)}</small>
      <button class="btn sm" data-copy="${esc(g.acc)}">Sao chép số tài khoản</button></div>`;
  }).join('');
  const openGift = () => {
    $('#giftOpen').classList.add('pop');
    setTimeout(() => { giftModal.hidden = false; document.body.style.overflow = 'hidden'; window.__lenis?.stop(); confetti(40); }, 350);
  };
  function closeGift() { if (giftModal.hidden) return; giftModal.hidden = true; $('#giftOpen').classList.remove('pop'); if (lb.hidden) { document.body.style.overflow = ''; window.__lenis?.start(); } }
  $('#giftOpen').addEventListener('click', openGift);
  $('#giftFab').addEventListener('click', openGift);
  giftModal.addEventListener('click', e => {
    if (e.target === giftModal || e.target.closest('[data-close]')) closeGift();
    const c = e.target.closest('[data-copy]');
    if (c) navigator.clipboard?.writeText(c.dataset.copy).then(() => toast('Đã sao chép số tài khoản ✓'), () => toast(c.dataset.copy));
  });

  /* ================= NHẠC NỀN ================= */
  const bgm = $('#bgm'), mBtn = $('#musicBtn');
  if (D.music) {
    bgm.src = D.music;
    bgm.addEventListener('canplay', () => { mBtn.hidden = false; }, { once: true });
    bgm.addEventListener('play', () => mBtn.classList.add('playing'));
    bgm.addEventListener('pause', () => mBtn.classList.remove('playing'));
    mBtn.addEventListener('click', () => bgm.paused ? bgm.play() : bgm.pause());
  }
  function playMusic() { if (D.music) { bgm.load(); bgm.play().catch(() => {}); } }

  /* ================= TOAST ================= */
  let tt;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ================= PHÁO GIẤY ================= */
  function confetti(n = 90) {
    if (reduce) return;
    const colors = ['#f6e3a8', '#d8b46a', '#9c7a3c', '#fff6d6', '#b3343a'];
    for (let i = 0; i < n; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[i % colors.length];
      c.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
      c.style.setProperty('--r', (Math.random() * 1080 - 540) + 'deg');
      c.style.animationDuration = 2.4 + Math.random() * 2 + 's';
      c.style.animationDelay = Math.random() * 0.6 + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5200);
    }
  }

  /* ================= BỤI VÀNG (canvas) ================= */
  const cv = $('#dust'), ctx = cv.getContext('2d');
  let W, H, dpr, parts = [], sparks = [];
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
  };
  resize(); addEventListener('resize', resize);
  const N = innerWidth < 700 ? 34 : 60;
  for (let i = 0; i < N; i++) parts.push({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .4,
    vx: (Math.random() - .5) * .00015, vy: -(Math.random() * .00025 + .00008), tw: Math.random() * Math.PI * 2
  });
  function burst(x, y, n) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = Math.random() * 6 + 2;
      sparks.push({ x: x * dpr, y: y * dpr, vx: Math.cos(a) * s * dpr, vy: Math.sin(a) * s * dpr - 2 * dpr, life: 1, r: (Math.random() * 2 + 1) * dpr });
    }
  }
  // vệt lấp lánh theo con trỏ (máy tính)
  let lastSpark = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || reduce) return;
    const now = performance.now(); if (now - lastSpark < 40) return; lastSpark = now;
    sparks.push({ x: e.clientX * dpr, y: e.clientY * dpr, vx: (Math.random() - .5) * dpr, vy: (Math.random() * .5 + .3) * dpr, life: .8, r: (Math.random() * 1.5 + .8) * dpr });
  });
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.tw += .03;
      if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
      if (p.x < -.02) p.x = 1.02; if (p.x > 1.02) p.x = -.02;
      const a = .25 + Math.sin(p.tw) * .2 + .2;
      ctx.beginPath(); ctx.fillStyle = `rgba(246,214,140,${a})`;
      ctx.arc(p.x * W, p.y * H, p.r * dpr, 0, 7); ctx.fill();
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vy += .12 * dpr; s.vx *= .98; s.life -= .016;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
      g.addColorStop(0, `rgba(255,240,200,${s.life})`); g.addColorStop(1, 'rgba(216,180,106,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3, 0, 7); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(draw);
  };
  if (!reduce) requestAnimationFrame(draw);

  /* ================= CUỘN: tiến trình, timeline, zoom ảnh ================= */
  const bar = $('#progress'), top = $('#topBtn'), tl = $('#timeline'), fill = $('#tlFill'), heroBg = $('.hero-bg');
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const lerp = (a, b, k) => a + (b - a) * k;

  // Mỗi khung ảnh: zoom-in dần + trôi nhẹ theo vị trí cuộn, được làm mượt bằng lerp
  const zooms = new Map(); // el -> {z, y, tz, ty, hover, on}
  const zio = new IntersectionObserver(es => es.forEach(e => { const s = zooms.get(e.target); if (s) s.on = e.isIntersecting; }),
    { rootMargin: '25% 0px' });
  const trackZoom = el => {
    if (zooms.has(el)) return;
    zooms.set(el, { z: 1.25, y: 0, tz: 1.25, ty: 0, hover: 0, on: false });
    zio.observe(el);
  };
  $$('.ph').forEach(trackZoom);
  $$('#gallery .g').forEach(g => {
    const ph = $('.ph', g);
    g.addEventListener('pointerenter', () => { zooms.get(ph).hover = 1; });
    g.addEventListener('pointerleave', () => { zooms.get(ph).hover = 0; });
  });

  let fillP = 0, heroZ = 1;
  const frame = () => {
    const vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    top.classList.toggle('show', scrollY > vh);

    const r = tl.getBoundingClientRect();
    fillP = lerp(fillP, clamp01((vh * .6 - r.top) / r.height), .12);
    fill.style.height = fillP * 100 + '%';

    if (reduce) return;
    // Hero: phóng to và trôi chậm khi cuộn khỏi màn hình đầu
    if (scrollY < vh * 1.2) {
      heroZ = lerp(heroZ, 1 + clamp01(scrollY / vh) * .18, .1);
      heroBg.style.transform = `translate3d(0,${scrollY * .3}px,0) scale(${heroZ.toFixed(4)})`;
    }
    for (const [el, s] of zooms) {
      if (!s.on) continue;
      const b = el.getBoundingClientRect();
      const t = clamp01((vh - b.top) / (vh + b.height)); // 0: vừa vào đáy · 1: rời đỉnh
      s.tz = 1.08 + t * .22 + s.hover * .07;
      s.ty = (.5 - t) * 8;
      s.z = lerp(s.z, s.tz, .08); s.y = lerp(s.y, s.ty, .08);
      el.style.setProperty('--z', s.z.toFixed(4));
      el.style.setProperty('--py', s.y.toFixed(3) + '%');
    }
  };

  /* ---------- Cuộn mượt (Lenis) ---------- */
  const lenis = (!reduce && window.Lenis) ? new Lenis({ lerp: .085, wheelMultiplier: .9, smoothWheel: true }) : null;
  if (lenis) document.documentElement.classList.add('lenis');
  if (lenis && document.body.classList.contains('locked')) lenis.stop();
  const loop = time => { lenis?.raf(time); frame(); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  const scrollToEl = target => lenis ? lenis.scrollTo(target, { duration: 1.6 }) : (typeof target === 'number' ? scrollTo({ top: target, behavior: 'smooth' }) : target.scrollIntoView({ behavior: 'smooth' }));
  top.addEventListener('click', () => scrollToEl(0));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const t = $(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); scrollToEl(t);
  });
  window.__lenis = lenis;

  /* ---------- Ảnh chân dung nghiêng 3D theo chuột ---------- */
  $$('.tilt').forEach(el => {
    el.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || reduce) return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateY(${(x - .5) * 14}deg) rotateX(${(.5 - y) * 14}deg)`;
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  watch(document);
})();
