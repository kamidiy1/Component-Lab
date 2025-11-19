/* ========= jQuery About toggle ========= */
$('#aboutBtn').on('click', () => $('#about').slideToggle(150));

/* ========= CAROUSEL ========= */
const images = [
  {src:'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1400&auto=format&fit=crop', alt:'Happy dog',          cap:'Best friend vibes'},
  {src:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1400&auto=format&fit=crop', alt:'Puppy with bandana', cap:'Adventure partner'},
  {src:'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1400&auto=format&fit=crop', alt:'Dog on beach',      cap:'Sprint to the waves'}
];

const imgEl = document.getElementById('slideImg');
const capEl = document.getElementById('slideCaption');
const dotsEl = document.getElementById('dots');

let slideIndex = 0;
let slideTimer = null;

function paintDots(){
  dotsEl.innerHTML = '';
  images.forEach((_, idx) => {
    const b = document.createElement('button');
    b.className = 'dot' + (idx===slideIndex ? ' active':'');
    b.onclick = () => { slideIndex = idx; paintSlide(); };
    dotsEl.appendChild(b);
  });
}

function paintSlide(){
  const item = images[slideIndex];
  $('#slideImg').hide().attr({src:item.src, alt:item.alt}).fadeIn(180); // jQuery effect
  capEl.textContent = item.cap;
  [...dotsEl.children].forEach((d,idx)=>d.classList.toggle('active', idx===slideIndex));
}

function next(){ slideIndex = (slideIndex+1) % images.length; paintSlide(); }
function prev(){ slideIndex = (slideIndex-1+images.length) % images.length; paintSlide(); }

function togglePlay(){
  if (slideTimer){
    clearInterval(slideTimer);
    slideTimer = null;
    this.textContent = '▶ Play';
  } else {
    slideTimer = setInterval(next, 2500);
    this.textContent = '⏸ Pause';
  }
}

document.getElementById('nextBtn').onclick = next;
document.getElementById('prevBtn').onclick = prev;
document.getElementById('playBtn').onclick = togglePlay;

document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft')  prev();
});

paintDots();
paintSlide();

/* ========= STOPWATCH ========= */
const timeEl  = document.getElementById('time');
const lapsEl  = document.getElementById('lapsList');
const startBtn= document.getElementById('startStop');
const lapBtn  = document.getElementById('lapBtn');
const resetBtn= document.getElementById('resetBtn');

let running=false, startAt=0, elapsed=0, tick=null, laps=[];

function fmt(ms){
  const t = Math.floor(ms/100);
  const m = String(Math.floor(t/600)).padStart(2,'0');
  const s = String(Math.floor((t%600)/10)).padStart(2,'0');
  const d = t%10;
  return `${m}:${s}.${d}`;
}

function paintTime(){
  const now = running ? (Date.now()-startAt+elapsed) : elapsed;
  timeEl.textContent = fmt(now);
}

function start(){
  running = true;
  startAt = Date.now();
  tick = setInterval(paintTime, 100);
  startBtn.textContent = 'Stop';
  lapBtn.disabled = false; resetBtn.disabled = false;
}

function stop(){
  running = false;
  clearInterval(tick);
  elapsed += Date.now()-startAt;
  paintTime();
  startBtn.textContent = 'Start';
}

function reset(){
  stop();
  elapsed = 0;
  laps = [];
  paintTime();
  paintLaps();
  lapBtn.disabled = true; resetBtn.disabled = true;
}

function lap(){
  const v = running ? (Date.now()-startAt+elapsed) : elapsed;
  laps.unshift(v);
  paintLaps();
}

function paintLaps(){
  lapsEl.innerHTML = laps.map((v,idx)=>`<li>Lap ${laps.length-idx}: <b>${fmt(v)}</b></li>`).join('');
}

startBtn.onclick = () => running ? stop() : start();
resetBtn.onclick = reset;
lapBtn.onclick   = lap;

document.addEventListener('keydown', e=>{
  if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
  const k = e.key.toLowerCase();
  if (k==='s') running ? stop() : start();
  if (k==='l' && !lapBtn.disabled) lap();
  if (k==='r' && !resetBtn.disabled) reset();
});

paintTime();
