const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(90, Math.max(40, Math.floor(window.innerWidth / 16)));
  particles = [];

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.1 + 0.7,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      alpha: Math.random() * 0.6 + 0.2
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -4 || particle.x > window.innerWidth + 4) particle.vx *= -1;
    if (particle.y < -4 || particle.y > window.innerHeight + 4) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,105,180, ${particle.alpha})`;
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);

      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(255,182,212,${0.06 * (1 - distance / 120)})`;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animateParticles);
}

const typingElement = document.getElementById('typing-text');
const words = ['Thalia Tanguila', 'Diseñadora creativa', 'Desarrolladora web'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    typingElement.textContent = currentWord.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    typingElement.textContent = currentWord.slice(0, charIndex - 1);
    charIndex -= 1;

    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeLoop, isDeleting ? 70 : 95);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateParticles();
typeLoop();

// --- Progress panel: generar estrellas dinámicamente ---
const progressData = [
  { name: 'Unidad 1', rating: 4 },
  { name: 'Unidad 2', rating: 5 },
  { name: 'Unidad 3', rating: 4 }
];

function renderProgress() {
  const list = document.getElementById('progress-list');
  if (!list) return;
  list.innerHTML = '';

  progressData.forEach((item) => {
    const li = document.createElement('li');

    const name = document.createElement('span');
    name.className = 'unit-name';
    name.textContent = item.name;

    const stars = document.createElement('span');
    stars.className = 'stars';
    stars.setAttribute('aria-hidden', 'true');

    for (let i = 1; i <= 5; i += 1) {
      const star = document.createElement('i');
      if (i <= item.rating) {
        star.className = 'fa-solid fa-star filled';
      } else {
        star.className = 'fa-regular fa-star empty';
      }
      star.tabIndex = 0;
      stars.appendChild(star);
    }

    // Accessibility: readable label per unit
    li.setAttribute('aria-label', `${item.name}: ${item.rating} de 5 estrellas`);

    li.appendChild(name);
    li.appendChild(stars);
    list.appendChild(li);
  });
}

renderProgress();

// Toggle entre versión estática y dinámica del panel de progreso
const btnStatic = document.getElementById('btn-static');
const btnDynamic = document.getElementById('btn-dynamic');
const progressStatic = document.getElementById('progress-static');
const progressDynamic = document.getElementById('progress-list');

function setProgressView(isDynamic) {
  if (progressStatic) progressStatic.classList.toggle('hidden', isDynamic);
  if (progressDynamic) progressDynamic.classList.toggle('hidden', !isDynamic);
  if (btnStatic && btnDynamic) {
    btnStatic.classList.toggle('active', !isDynamic);
    btnDynamic.classList.toggle('active', isDynamic);
    btnStatic.setAttribute('aria-selected', String(!isDynamic));
    btnDynamic.setAttribute('aria-selected', String(isDynamic));
  }
}

if (btnStatic && btnDynamic) {
  btnStatic.addEventListener('click', () => setProgressView(false));
  btnDynamic.addEventListener('click', () => { renderProgress(); setProgressView(true); });
}

// --- Topics: permitir vista estática y dinámica por unidad ---
const topicsData = {
  unidad1: [
    { title: 'Tema 1', desc: 'Breve descripción del Tema 1.', link: 'tema1.html' },
    { title: 'Tema 2', desc: 'Breve descripción del Tema 2.', link: 'tema2.html' },
    { title: 'Tema 3', desc: 'Breve descripción del Tema 3.', link: 'tema3.html' }
  ],
  unidad2: [
    { title: 'Tema 1', desc: 'Descripción del Tema 1 de la Unidad 2.', link: 'tema1.html' },
    { title: 'Tema 2', desc: 'Descripción del Tema 2 de la Unidad 2.', link: 'tema2.html' },
    { title: 'Tema 3', desc: 'Descripción del Tema 3 de la Unidad 2.', link: 'tema3.html' }
  ],
  unidad3: [
    { title: 'Tema 1', desc: 'Descripción del Tema 1 de la Unidad 3.', link: 'tema1.html' },
    { title: 'Tema 2', desc: 'Descripción del Tema 2 de la Unidad 3.', link: 'tema2.html' },
    { title: 'Tema 3', desc: 'Descripción del Tema 3 de la Unidad 3.', link: 'tema3.html' }
  ]
};

function renderTopics(unitKey) {
  const suffix = 'u' + unitKey.replace('unidad', '');
  const dynId = `topic-list-dynamic-${suffix}`;
  const dynContainer = document.getElementById(dynId);
  if (!dynContainer) return;
  dynContainer.innerHTML = '';

  const list = topicsData[unitKey] || [];
  list.forEach((t) => {
    const article = document.createElement('article');
    article.className = 'tema-card';

    const inner = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = t.title;
    const p = document.createElement('p');
    p.textContent = t.desc;
    inner.appendChild(h3);
    inner.appendChild(p);

    const actions = document.createElement('div');
    actions.className = 'tema-actions';
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = t.link;
    a.textContent = 'Abrir';
    actions.appendChild(a);

    article.appendChild(inner);
    article.appendChild(actions);
    dynContainer.appendChild(article);
  });
}

// Inicializar toggles en páginas de unidad
document.querySelectorAll('.topics-toggle').forEach((tg) => {
  const section = tg.closest('.content-section');
  if (!section) return;
  const unitKey = section.dataset.unit;
  if (!unitKey) return;
  const suffix = 'u' + unitKey.replace('unidad', '');
  const btnStaticTopics = document.getElementById(`btn-topics-static-${suffix}`);
  const btnDynamicTopics = document.getElementById(`btn-topics-dynamic-${suffix}`);
  const staticContainer = document.getElementById(`topic-list-static-${suffix}`);
  const dynamicContainer = document.getElementById(`topic-list-dynamic-${suffix}`);

  if (!btnStaticTopics || !btnDynamicTopics || !staticContainer || !dynamicContainer) return;

  btnStaticTopics.addEventListener('click', () => {
    btnStaticTopics.classList.add('active');
    btnDynamicTopics.classList.remove('active');
    staticContainer.classList.remove('hidden');
    dynamicContainer.classList.add('hidden');
  });

  btnDynamicTopics.addEventListener('click', () => {
    btnDynamicTopics.classList.add('active');
    btnStaticTopics.classList.remove('active');
    staticContainer.classList.add('hidden');
    dynamicContainer.classList.remove('hidden');
    renderTopics(unitKey);
  });
});

// --- Back to top button ---
function createBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  btn.style.opacity = '0';
  btn.setAttribute('aria-label', 'Volver arriba');
  document.body.appendChild(btn);

  let visible = false;
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 420;
    if (show && !visible) { btn.style.opacity = '1'; visible = true; }
    if (!show && visible) { btn.style.opacity = '0'; visible = false; }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

createBackToTop();
