import './style.css';
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
