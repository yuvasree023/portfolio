import './style.css';
import * as THREE from 'three';

/* ---------- 3D background ---------- */
const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x06060f, 0.045);
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
camera.position.z = 9;

scene.add(new THREE.AmbientLight(0x6d5bd0, 0.7));
const l1 = new THREE.PointLight(0xa78bfa, 90, 40); l1.position.set(5, 4, 6); scene.add(l1);
const l2 = new THREE.PointLight(0x38bdf8, 70, 40); l2.position.set(-6, -3, 4); scene.add(l2);

const hero = new THREE.Group(); scene.add(hero);
const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.9, 0.5, 220, 28, 2, 3),
  new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.7, roughness: 0.22, emissive: 0x1e1065, emissiveIntensity: 1.1 })
);
hero.add(knot);
const wire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(3.6, 1),
  new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.22 })
);
hero.add(wire);
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(4.6, 0.012, 8, 160),
  new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
);
ring.rotation.x = 1.2; hero.add(ring);
const ring2 = ring.clone(); ring2.scale.setScalar(0.8); ring2.rotation.set(0.3, 0.8, 0); hero.add(ring2);

const orbs = [];
for (let i = 0; i < 7; i++) {
  const m = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.16 + Math.random() * 0.18),
    new THREE.MeshStandardMaterial({ color: i % 2 ? 0x38bdf8 : 0xc4b5fd, metalness: 0.6, roughness: 0.2, emissive: 0x2a2070 })
  );
  m.userData = { r: 3 + Math.random() * 2.4, s: 0.2 + Math.random() * 0.4, o: Math.random() * 6.28, y: (Math.random() - 0.5) * 3 };
  hero.add(m); orbs.push(m);
}

const N = 1400, pos = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  pos[i * 3] = (Math.random() - 0.5) * 60;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
  pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 6;
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xc4b5fd, size: 0.05, transparent: true, opacity: 0.8 }));
scene.add(stars);

let mx = 0, my = 0, tx = 0, ty = 0;
addEventListener('pointermove', e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const mobile = w < 800;
  hero.position.x = mobile ? 0 : 3.4;
  hero.position.y = mobile ? -2.4 : 0;
  hero.scale.setScalar(mobile ? 0.6 : 0.88);
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clock = new THREE.Clock();
function tick() {
  const t = clock.getElapsedTime();
  const sy = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
  tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
  if (!reduce) {
    knot.rotation.x = t * 0.18 + ty * 1.2; knot.rotation.y = t * 0.25 + tx * 1.6;
    wire.rotation.y = -t * 0.08; wire.rotation.x = t * 0.05;
    ring.rotation.z = t * 0.3; ring2.rotation.z = -t * 0.4;
    orbs.forEach(o => { const u = o.userData, a = t * u.s + u.o; o.position.set(Math.cos(a) * u.r, u.y + Math.sin(a * 1.3) * 0.5, Math.sin(a) * u.r); o.rotation.x += 0.01; o.rotation.y += 0.015; });
    stars.rotation.y = t * 0.012 + sy * 1.5;
  }
  hero.rotation.y = tx * 0.4; hero.rotation.x = ty * 0.3;
  camera.position.y = -sy * 14; camera.position.x = tx * 0.6;
  hero.position.y = (innerWidth < 800 ? -2.4 : 0) - sy * 6 * (innerWidth < 800 ? 0 : 1) + (sy * 14);
  hero.position.z = -sy * 10;
  canvas.style.opacity = Math.max(0.16, 1 - scrollY / (innerHeight * 0.8));
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

/* ---------- reveal + counters ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  e.target.querySelectorAll('[data-count]').forEach(count);
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
function count(el) {
  const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), t0 = performance.now();
  const step = n => { const p = Math.min(1, (n - t0) / 1200); el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ---------- tilt + glow ---------- */
document.querySelectorAll('.tilt').forEach(el => {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
    el.style.transform = `rotateY(${(x - 0.5) * 12}deg) rotateX(${(0.5 - y) * 12}deg) translateZ(8px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

/* ---------- toolkit ---------- */
const tools = [
  ['Python', 'My main language for APIs, ML and evals'],
  ['FastAPI', 'Backend services and REST APIs'],
  ['Flask', 'Lightweight web services'],
  ['SQL / SQLite', 'Relational data and test fixtures'],
  ['MongoDB', 'NoSQL document storage'],
  ['scikit-learn', 'Classical ML and clustering'],
  ['XGBoost', 'Churn prediction model'],
  ['MLflow', 'Experiment tracking'],
  ['LLM APIs', 'Groq and Gemini in agents and judges'],
  ['Docker', 'Packaging services to run anywhere'],
  ['GitHub Actions', 'CI/CD pipelines'],
  ['Google Cloud', '41 skill badges, Cloud Run deploys'],
  ['AWS ECS', 'Container deployment workflow'],
  ['Prometheus / Grafana', 'Monitoring a live service'],
  ['Git', 'Version control and clean history'],
  ['Figma', 'Interface design and prototypes'],
  ['HTML / Front-end', 'Building the visible side of a product']
];
const box = document.getElementById('tools');
tools.forEach(([n, d]) => { const el = document.createElement('div'); el.className = 'tool reveal'; el.tabIndex = 0; el.setAttribute('role','button'); el.setAttribute('aria-label',n + ': ' + d); el.dataset.icon = n==='Python'?'Py':n==='FastAPI'?'ϟ':n==='SQL / SQLite'?'SQL':n==='Docker'?'▤':n==='Git'?'⑂':n==='Figma'?'◉':n==='LLM APIs'?'✳':n==='Google Cloud'?'☁':n.slice(0,2); el.addEventListener('click',()=>el.classList.toggle('open')); el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.classList.toggle('open')}}); el.innerHTML = `${n}<small>${d}</small>`; box.appendChild(el); io.observe(el); });

/* ---------- contact ---------- */
const EMAIL = 'yuvasree.ar@gmail.com';
const toast = document.getElementById('toast');
function say(m) { toast.textContent = m; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800); }
document.getElementById('copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText(EMAIL); say('Email copied'); } catch { say(EMAIL); } });
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(e.target.tagName)) return;
  const k = e.key.toLowerCase();
  if (k === 'm') location.href = 'mailto:' + EMAIL;
  if (k === 'g') open('https://github.com/yuvasree023', '_blank');
  if (k === 'l') open('https://www.linkedin.com/in/yuvasree-a-039360275', '_blank');
});

/* ---------- draggable note ---------- */
const note = document.getElementById('note');
let dx = 0, dy = 0, drag = false;
note.addEventListener('pointerdown', e => { drag = true; const r = note.getBoundingClientRect(); dx = e.clientX - r.left; dy = e.clientY - r.top; note.setPointerCapture(e.pointerId); note.style.cursor = 'grabbing'; });
note.addEventListener('pointermove', e => { if (!drag) return; note.style.right = 'auto'; note.style.bottom = 'auto'; note.style.left = e.clientX - dx + 'px'; note.style.top = e.clientY - dy + 'px'; });
note.addEventListener('pointerup', () => { drag = false; note.style.cursor = 'grab'; });

/* ---------- journey notebook ---------- */
const stops = [
 ['Jun - Jul 2025','Learning beyond the classroom.','ML & AI internship at Digitalytic Technologies, Chennai. Four weeks of moving from coursework into practical work.','Digitalytic Technologies'],
 ['Jun 2026','Another step into AI.','A virtual AI internship with CodeAlpha. Another chance to put what I was learning into practice.','CodeAlpha'],
 ['Aug - Sep 2026','Connecting the whole product.','Full Stack Development internship at Innovation Hacks. I built DevPulse as the program project, bringing data, APIs and a dashboard together.','Innovation Hacks'],
 ['Final year','Still curious. Still building.','B.Tech in AI & Data Science, CGPA 8.18. My team is building Smart Care AI, a patient-monitoring device, as our final-year project.','B.Tech AI & Data Science']
];
let currentStop=0;
function selectStop(i){currentStop=(i+stops.length)%stops.length;const [date,title,desc,name]=stops[currentStop];document.getElementById('journey-date').textContent=date;document.getElementById('journey-title').textContent=title;document.getElementById('journey-description').textContent=desc;document.getElementById('journey-count').textContent='0'+(currentStop+1)+' / 04';document.getElementById('stop-name').textContent=name;document.querySelectorAll('.map-pin').forEach((el,j)=>{el.classList.toggle('active',j===currentStop);el.setAttribute('aria-pressed',j===currentStop)})}
document.querySelectorAll('.map-pin').forEach(el=>el.addEventListener('click',()=>selectStop(+el.dataset.stop)));
document.getElementById('prev-stop').addEventListener('click',()=>selectStop(currentStop-1));document.getElementById('next-stop').addEventListener('click',()=>selectStop(currentStop+1));selectStop(0);
const projectCards=[...document.querySelectorAll('.cards .card')], projectTabs=[...document.querySelectorAll('.project-tab')];
let showAll=false;
function selectProject(i){projectCards.forEach((c,j)=>c.classList.toggle('is-selected',i===j));projectTabs.forEach((t,j)=>{t.classList.toggle('active',i===j);t.setAttribute('aria-selected',i===j)});}
projectTabs.forEach((t,i)=>{t.addEventListener('click',()=>selectProject(i));t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=(i+(e.key==='ArrowRight'?1:3))%4;selectProject(n);projectTabs[n].focus()}})});selectProject(0);
document.getElementById('all-projects').addEventListener('click',e=>{showAll=!showAll;document.querySelector('.cards').classList.toggle('show-all',showAll);e.currentTarget.textContent=showAll?'Back to selected project −':'Show all 8 projects +';e.currentTarget.setAttribute('aria-expanded',showAll);});
