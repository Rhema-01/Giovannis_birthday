// GIOVANNI LAMBERT — BIRTHDAY TRIBUTE

// PARTICLES
function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#3B82F6','#93C5FD','#F4C842','#FB7185','#6EE7B7','#DBEAFE'];
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 4;
    p.style.cssText = `width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s;opacity:0;`;
    container.appendChild(p);
  }
}

// CONFETTI
function createConfetti() {
  const container = document.getElementById('confetti');
  const colors = ['#3B82F6','#93C5FD','#F4C842','#FB7185','#6EE7B7','#DBEAFE','#FFF'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const size = Math.random()*10+5;
    c.style.cssText = `width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}%;animation-duration:${Math.random()*4+3}s;animation-delay:${Math.random()*5}s;border-radius:${Math.random()>.5?'50%':'2px'};opacity:0;`;
    container.appendChild(c);
  }
}

// MUSIC
let isPlaying = false, playlistOpen = false;
function toggleMusic() {
  isPlaying = !isPlaying;
  document.getElementById('musicBtn').textContent = isPlaying ? '⏸' : '▶';
  document.getElementById('vinyl').classList.toggle('spinning', isPlaying);
}
function togglePlaylist() {
  playlistOpen = !playlistOpen;
  document.getElementById('playlist').style.display = playlistOpen ? 'block' : 'none';
}
function selectTrack(name, artist, url) {
  document.getElementById('trackName').textContent = name;
  if (!isPlaying) toggleMusic();
  window.open(url, '_blank');
}

// SCROLL
function scrollToNotes() {
  document.getElementById('notesSection').scrollIntoView({ behavior: 'smooth' });
}

// CANDLE
let candleBlown = false;
const wishes = [
  "May every dream you carry come true this year ✨",
  "May joy follow you everywhere you go 🌟",
  "May this year be your greatest yet, Giovanni 🎂",
  "May love, laughter, and blessings overflow 💙",
  "The best is still ahead of you — we believe it 🙏"
];
function blowCandle() {
  if (candleBlown) return;
  candleBlown = true;
  const fw = document.getElementById('flameWrapper');
  fw.style.opacity = '0';
  fw.style.transform = 'scale(0)';
  fw.style.transition = 'all .4s ease';
  document.getElementById('candleHint').textContent = '🎉 Wish made!';
  setTimeout(() => {
    const wt = document.getElementById('wishText');
    wt.textContent = wishes[Math.floor(Math.random()*wishes.length)];
    wt.classList.add('show');
    triggerWishConfetti();
  }, 600);
}
function triggerWishConfetti() {
  const colors = ['#3B82F6','#93C5FD','#F4C842','#FB7185'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    const tx = (Math.random()-.5)*400, ty = (Math.random()-1)*400;
    c.style.cssText = `position:fixed;width:${Math.random()*10+5}px;height:${Math.random()*10+5}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${40+Math.random()*20}%;top:50%;border-radius:${Math.random()>.5?'50%':'2px'};pointer-events:none;z-index:9999;animation:wishBurst 1.5s ease forwards;--tx:${tx}px;--ty:${ty}px;`;
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 1600);
  }
  if (!document.getElementById('wishBurstStyle')) {
    const s = document.createElement('style');
    s.id = 'wishBurstStyle';
    s.textContent = `@keyframes wishBurst{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}`;
    document.head.appendChild(s);
  }
}

// UPLOAD PANEL
let selectedFile = null;
function toggleUploadPanel() {
  document.getElementById('uploadPanel').classList.toggle('open');
}
function handleFileSelect(input) {
  const file = input.files[0];
  if (!file) return;
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('previewImg').src = e.target.result;
    document.getElementById('uploadPreview').style.display = 'block';
    document.getElementById('dropZone').style.display = 'none';
  };
  reader.readAsDataURL(file);
}
function clearPreview() {
  selectedFile = null;
  document.getElementById('previewImg').src = '';
  document.getElementById('uploadPreview').style.display = 'none';
  document.getElementById('dropZone').style.display = 'block';
  document.getElementById('fileInput').value = '';
}
async function submitUpload() {
  if (!selectedFile) {
    document.getElementById('uploadStatus').textContent = 'Please select a photo first!';
    return;
  }
  const caption = document.getElementById('captionInput').value;
  const formData = new FormData();
  formData.append('photo', selectedFile);
  formData.append('caption', caption);
  document.getElementById('uploadStatus').textContent = 'Uploading...';
  try {
    const res = await fetch('/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      document.getElementById('uploadStatus').textContent = '✓ Photo added!';
      addPhotoToGallery(data.filename, data.url, data.caption);
      setTimeout(() => {
        clearPreview();
        document.getElementById('captionInput').value = '';
        document.getElementById('uploadStatus').textContent = '';
        toggleUploadPanel();
      }, 1200);
    } else {
      document.getElementById('uploadStatus').textContent = 'Upload failed. Try again.';
    }
  } catch {
    document.getElementById('uploadStatus').textContent = 'Something went wrong.';
  }
}
function addPhotoToGallery(filename, url, caption) {
  const grid = document.getElementById('galleryGrid');
  const empty = grid.querySelector('.gallery-empty');
  if (empty) empty.remove();
  const item = document.createElement('div');
  item.className = 'gallery-item reveal visible';
  item.dataset.filename = filename;
  item.innerHTML = `
    <img src="${url}" alt="Giovanni">
    ${caption ? `<div class="caption">${caption}</div>` : ''}
    <button class="delete-photo" onclick="deletePhoto('${filename}', this)">✕</button>
  `;
  item.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-photo')) return;
    openLightbox(url, caption);
  });
  grid.appendChild(item);
}
async function deletePhoto(filename, btn) {
  if (!confirm('Remove this photo?')) return;
  const item = btn.closest('.gallery-item');
  const res = await fetch('/delete-photo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename })
  });
  const data = await res.json();
  if (data.success) {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    item.style.transition = 'all .3s ease';
    setTimeout(() => {
      item.remove();
      if (!document.querySelector('.gallery-item')) {
        document.getElementById('galleryGrid').innerHTML = `<div class="gallery-empty"><p>📷 No photos yet — click the camera button to add some!</p></div>`;
      }
    }, 300);
  }
}

// DRAG & DROP
function initDragDrop() {
  const zone = document.getElementById('dropZone');
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.style.borderColor='var(--blue-mid)'; });
  zone.addEventListener('dragleave', () => { zone.style.borderColor=''; });
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.style.borderColor='';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      selectedFile = file;
      const reader = new FileReader();
      reader.onload = (ev) => {
        document.getElementById('previewImg').src = ev.target.result;
        document.getElementById('uploadPreview').style.display = 'block';
        document.getElementById('dropZone').style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });
}

// LIGHTBOX
function openLightbox(src, caption) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:fixed;inset:0;background:rgba(11,31,58,0.92);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:pointer;flex-direction:column;gap:16px;animation:fadeIn .3s ease;`;
  overlay.innerHTML = `<img src="${src}" style="max-width:90vw;max-height:80vh;border-radius:16px;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,0.4);"><p style="color:#DBEAFE;font-family:'Lora',serif;font-style:italic;font-size:1rem;">${caption||''}</p>`;
  overlay.addEventListener('click', ()=>overlay.remove());
  document.body.appendChild(overlay);
}

// SCROLL REVEAL
function initScrollReveal() {
  const els = document.querySelectorAll('.gallery-section,.notes-section,.candle-section,.closing-section');
  els.forEach(el=>el.classList.add('reveal'));
  document.querySelectorAll('.note-card').forEach((c,i)=>{ c.classList.add('reveal'); c.style.transitionDelay=`${i*.1}s`; });
  document.querySelectorAll('.gallery-item').forEach((c,i)=>{ c.classList.add('reveal'); c.style.transitionDelay=`${i*.08}s`; });
  const obs = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); }); }, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

// GALLERY CLICK
function initGallery() {
  document.querySelectorAll('.gallery-item:not(.placeholder)').forEach(item=>{
    item.addEventListener('click', (e)=>{
      if(e.target.classList.contains('delete-photo')) return;
      const img = item.querySelector('img');
      const caption = item.querySelector('.caption')?.textContent||'';
      openLightbox(img.src, caption);
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  createParticles();
  createConfetti();
  initScrollReveal();
  initGallery();
  initDragDrop();
});

// FLOATING EMOJIS
function createFloatingEmojis() {
  const container = document.getElementById('floatingEmojis');
  const emojis = ['🎂','🎉','🎈','💙','🌊','✨','🌟','💜','❤️','🙏','⚓','🎊'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.className = 'float-emoji';
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    el.style.cssText = `left:${Math.random()*100}%;animation-duration:${Math.random()*20+15}s;animation-delay:${Math.random()*15}s;`;
    container.appendChild(el);
  }
}

// FLIP CARDS
function flipCard(card) {
  card.classList.toggle('flipped');
}

// Add to DOMContentLoaded
const _origInit = window.onload;
document.addEventListener('DOMContentLoaded', () => {
  createFloatingEmojis();
});

// FLOATING EMOJIS
function createFloatingEmojis() {
  const container = document.getElementById('floatingEmojis');
  const emojis = ['💙','🎂','⭐','🌊','⚓','🎉','💜','🙏','✨','🌟','❤️','🎈'];
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.className = 'float-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `left:${Math.random()*100}%;animation-duration:${Math.random()*20+15}s;animation-delay:${Math.random()*15}s;`;
    container.appendChild(el);
  }
}

// ANIMATED COUNTERS
function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); return; }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter('heartCount', 4, 1200);
        animateCounter('prayerCount', 100, 2000);
        animateCounter('wishCount', 1000, 2500);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const section = document.querySelector('.counter-section');
  if (section) observer.observe(section);
}

// LOVE CARDS TILT
function initTilt() {
  document.querySelectorAll('.love-card, .prayer-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y*8}deg) rotateY(${x*8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// INIT ALL
const _originalInit = document.addEventListener;
document.addEventListener('DOMContentLoaded', () => {
  createFloatingEmojis();
  initCounters();
  initTilt();
});