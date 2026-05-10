// ── Load all uploaded images as base64 ──
const imgs = [];
async function loadImg(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });
}

// Map image IDs to uploaded files by index
// We have 20 images uploaded — assign them:
const assignments = {
  heroImg: 0,   // img1 — hero
  featImg: 10,  // img11 — features center
  svc1: 0,      // bridal
  svc2: 3,      // designer/portrait
  svc3: 6,      // festival/circle
  svc4: 7,      // arabic/simple
  svc5: 1,      // dulhan/legs
  svc6: 11,     // kids/simple
  cr1: 15,      // course basic
  cr2: 16,      // course adv
  cr3: 17,      // course bridal
  cd1: 15,
  cd2: 18,
  cd3: 3,
  bl1: 4,
  bl2: 12,
  bl3: 13,
};

// Gallery uses all 20 images
const galleryIndices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];

window.addEventListener('load', () => {
  // Try to read uploaded files from the page context
  // Since images were uploaded to the chat, we use the window.fs API
  tryLoadFiles();
});

async function tryLoadFiles() {
  const fileNames = [
    'image_1.jpg','image_2.jpg','image_3.jpg','image_4.jpg','image_5.jpg',
    'image_6.jpg','image_7.jpg','image_8.jpg','image_9.jpg','image_10.jpg',
    'image_11.jpg','image_12.jpg','image_13.jpg','image_14.jpg','image_15.jpg',
    'image_16.jpg','image_17.jpg','image_18.jpg','image_19.jpg','image_20.jpg'
  ];
  
  const loaded = [];
  for (let i = 0; i < fileNames.length; i++) {
    try {
      const data = await window.fs.readFile(fileNames[i]);
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      loaded.push(url);
    } catch(e) {
      loaded.push('');
    }
  }
  
  // Assign to elements
  Object.entries(assignments).forEach(([id, idx]) => {
    const el = document.getElementById(id);
    if (el && loaded[idx]) el.src = loaded[idx];
  });
  
  // Build gallery
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';
  galleryIndices.forEach((idx, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-item fade-up';
    div.style.transitionDelay = (i * 0.05) + 's';
    if (loaded[idx]) {
      div.innerHTML = `<img src="${loaded[idx]}" alt="Mehndi ${i+1}" onclick="openLB(${idx})"/>
        <div class="gallery-overlay"><i class="fa-solid fa-magnifying-glass-plus"></i></div>`;
    }
    grid.appendChild(div);
  });
  
  // Re-observe
  document.querySelectorAll('.gallery-item').forEach(el => obs.observe(el));
  
  // Store for lightbox
  window._galleryImgs = galleryIndices.map(i => loaded[i]).filter(Boolean);
}

// Lightbox
let lbIdx = 0;
function openLB(idx) {
  const imgs = window._galleryImgs || [];
  if (!imgs.length) return;
  lbIdx = idx < imgs.length ? idx : 0;
  document.getElementById('lbImg').src = imgs[lbIdx];
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function changeLB(dir) {
  const imgs = window._galleryImgs || [];
  lbIdx = (lbIdx + dir + imgs.length) % imgs.length;
  document.getElementById('lbImg').src = imgs[lbIdx];
}
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLB();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowRight') changeLB(1);
  if (e.key === 'ArrowLeft') changeLB(-1);
});

// Nav + scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  document.querySelectorAll('.nav-links a').forEach(a => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec) { const r = sec.getBoundingClientRect(); a.classList.toggle('active', r.top <= 80 && r.bottom > 80); }
  });
});
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Intersection observer
const obs = new IntersectionObserver(e => {
  e.forEach(x => { if (x.isIntersecting) x.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up,.fade-left,.fade-right,.course-detail').forEach(el => obs.observe(el));

// Counter
function animateCount(el, target) {
  let c = 0, step = Math.ceil(target / 60);
  const t = setInterval(() => { c = Math.min(c + step, target); el.textContent = c + '+'; if (c >= target) clearInterval(t); }, 25);
}
const sObs = new IntersectionObserver(e => {
  e.forEach(x => { if (x.isIntersecting) { x.target.querySelectorAll('.stat-item h2').forEach(h => animateCount(h, parseInt(h.textContent))); sObs.disconnect(); } });
}, { threshold: .5 });
const sr = document.querySelector('.stats-row'); if (sr) sObs.observe(sr);

// WhatsApp send
function sendWA() {
  const name = document.getElementById('fname').value || 'Customer';
  const phone = document.getElementById('fphone').value || '';
  const service = document.getElementById('fservice').value || 'General Inquiry';
  const msg = document.getElementById('fmsg').value || '';
  const text = `Hello Prachi! My name is ${name}. I am interested in: ${service}. ${msg ? 'Message: ' + msg : ''} ${phone ? 'My number: ' + phone : ''}`;
  window.open('https://wa.me/916261145605?text=' + encodeURIComponent(text), '_blank');
}