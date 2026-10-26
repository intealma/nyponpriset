// Mobilmeny
const btn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
btn.addEventListener('click', () => {
  const open = nav.classList.toggle('show');
  btn.setAttribute('aria-expanded', open);
  btn.textContent = open ? 'Stäng' : 'Meny';
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('show');
  btn.setAttribute('aria-expanded', false);
  btn.textContent = 'Meny';
}));

// Årtalsraden öppnar rätt stipendiat i arkivet
function openYear(id, scroll) {
  const row = document.getElementById(id);
  if (!row || row.tagName !== 'DETAILS') return false;
  row.open = true;
  if (scroll) row.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}
document.querySelectorAll('.years a[href^="#y"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href').slice(1);
  if (openYear(id, true)) {
    e.preventDefault();
    history.replaceState(null, '', '#' + id);
  }
}));
if (location.hash) openYear(location.hash.slice(1), false);

// Nästa prisutdelning: remsan försvinner dagen efter, även om sajten inte byggts om
const nasta = document.querySelector('.nasta');
if (nasta && new Date() > new Date(nasta.dataset.slut)) nasta.remove();

// Glimten: stipendiatens foto och årets nypon när man pekar på ett år
const years = document.querySelector('.years');
const glimt = years.querySelector('.glimt');
// Bilderna skapas först när de behövs, så att inga tomma bilder finns i sidan
const gStip = Object.assign(document.createElement('img'), { className: 'glimt-stip', alt: '' });
const gNypon = Object.assign(document.createElement('img'), { className: 'glimt-nypon', alt: '' });
let gBilderKlara = false;
let gDolj;

function visaGlimt(a) {
  clearTimeout(gDolj);
  if (!gBilderKlara) { glimt.querySelector('.glimt-bilder').append(gStip, gNypon); gBilderKlara = true; }
  if (gStip.getAttribute('src') !== a.dataset.bild) gStip.src = a.dataset.bild;
  gNypon.hidden = !a.dataset.nypon;
  if (a.dataset.nypon && gNypon.getAttribute('src') !== a.dataset.nypon) gNypon.src = a.dataset.nypon;
  glimt.querySelector('.glimt-ar').textContent = a.textContent;
  glimt.querySelector('.glimt-namn').textContent = a.dataset.namn;
  glimt.hidden = false;
  // Kortet centreras över året men får inte sticka ut utanför skärmen
  const r = a.getBoundingClientRect(), y = years.getBoundingClientRect();
  const half = glimt.offsetWidth / 2, kant = 16;
  const x = Math.min(Math.max(r.left + r.width / 2, half + kant), y.width - half - kant);
  glimt.style.left = (x - y.left) + 'px';
  requestAnimationFrame(() => glimt.classList.add('syns'));
}
function doljGlimt(ms = 0) {
  clearTimeout(gDolj);
  gDolj = setTimeout(() => { glimt.classList.remove('syns'); glimt.hidden = true; }, ms);
}

const harMus = matchMedia('(hover: hover)').matches;
years.querySelectorAll('a[data-bild]').forEach(a => {
  if (harMus) a.addEventListener('mouseenter', () => visaGlimt(a));
  a.addEventListener('focus', () => { if (a.matches(':focus-visible')) visaGlimt(a); });
  a.addEventListener('blur', () => doljGlimt());
  // Mobil: håll fingret på året för att se glimten, ett vanligt tryck går till stipendiaten
  let hall, langt = false;
  a.addEventListener('touchstart', () => {
    langt = false;
    hall = setTimeout(() => { langt = true; visaGlimt(a); }, 350);
  }, { passive: true });
  a.addEventListener('touchmove', () => clearTimeout(hall), { passive: true });
  a.addEventListener('touchend', e => {
    clearTimeout(hall);
    if (langt) { e.preventDefault(); doljGlimt(1500); }
  });
  a.addEventListener('contextmenu', e => e.preventDefault());
});
years.addEventListener('mouseleave', () => doljGlimt());

// Sidbläddring för inlägg
const PER_PAGE = 3;
const section = document.getElementById('inlagg');
const posts = [...section.querySelectorAll('.post')];
const pages = Math.ceil(posts.length / PER_PAGE);
const nums = section.querySelector('.pager .nums');
const [prev, next] = section.querySelectorAll('.pager > button');
let current = 0;

for (let i = 0; i < pages; i++) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = i + 1;
  b.setAttribute('aria-label', 'Sida ' + (i + 1));
  b.addEventListener('click', () => show(i, true));
  nums.appendChild(b);
}
prev.addEventListener('click', () => show(current - 1, true));
next.addEventListener('click', () => show(current + 1, true));

function show(page, scroll) {
  current = Math.max(0, Math.min(pages - 1, page));
  posts.forEach((p, i) => { p.hidden = Math.floor(i / PER_PAGE) !== current; });
  [...nums.children].forEach((b, i) => {
    if (i === current) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  prev.disabled = current === 0;
  next.disabled = current === pages - 1;
  if (scroll) section.scrollIntoView({ behavior: 'smooth' });
}
show(0, false);
