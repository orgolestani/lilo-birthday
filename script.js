// ---------- config ----------
// All times are LOCAL to whatever device opens the site. Edit freely.
const BIRTHDAY_START = new Date(2026, 7, 11, 0, 0, 0); // Aug 11 2026, 00:00

const STATIONS = [
  {
    id: 1,
    label: 'Station 1',
    unlockTime: new Date(2026, 7, 11, 11, 30, 0),
    icon: '🧖‍♀️',
    title: 'Spa Morning',
    details: [
      { text: 'Location: [ADD ADDRESS HERE]', placeholder: true },
      { text: 'Note: bring comfy clothes, we head out around 11:00 ✨', placeholder: true },
    ],
  },
  {
    id: 2,
    label: 'Station 2',
    unlockTime: new Date(2026, 7, 11, 18, 40, 0),
    icon: '🐴',
    title: 'Sunset Horse Riding on the Beach',
    details: [
      { text: 'Location: [ADD ADDRESS HERE]', placeholder: true },
      { text: 'Note: wear something you can ride in 🌅', placeholder: true },
    ],
  },
  {
    id: 3,
    label: 'Station 3',
    unlockTime: new Date(2026, 7, 11, 22, 0, 0),
    icon: '🍽️',
    title: "Selas — Chef's Dinner",
    details: [
      { text: 'Location: [ADD ADDRESS / RESERVATION NOTE HERE]', placeholder: true },
      { text: 'Note: come hungry, come happy 💛', placeholder: true },
    ],
  },
];

// ---------- sarcastic "find out early" messages ----------
const SASSY_MESSAGES = [
  "Nope. Still no.",
  "Maybe if you try clicking 20 more times I'll tell you.",
  "404: patience not found.",
  "Persistent. I respect it. Still no.",
  "Access denied. Try being cute instead. Oh wait, you already are. Still no.",
  "That's cute. Anyway, no.",
  "Bold of you to assume I'd fold that easily.",
  "Click #{n} and I'm still not telling you.",
  "This button has one job and it's not that.",
  "Wow, still here? Respect. Still not happening though.",
  "Try charm next time. Oh wait, you're already charming. Still no.",
  "You could be using this energy to guess. You won't get it. But you could.",
  "Warm... warmer... nope, ice cold actually.",
  "I have been personally instructed to never fold. Sorry not sorry.",
  "Legally, morally, and emotionally I cannot tell you.",
  "Keep clicking, it's very entertaining for me.",
  "This is now a personality trait for you. Impressive dedication.",
  "Ask me again in... let's see... a while.",
  "The button giggles and says nothing.",
  "Still a secret. Still adorable that you're trying.",
];

// ---------- helpers ----------
function pad(n) { return String(n).padStart(2, '0'); }

function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return { days, hours, mins, secs };
}

// ---------- confetti burst ----------
function burstConfetti(count = 36) {
  const colors = ['#ff7fa6', '#ffb86b', '#d9c7ff', '#ffd9c7', '#ffc2d9'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    const size = 6 + Math.random() * 6;
    piece.style.position = 'fixed';
    piece.style.top = '-5vh';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.width = size + 'px';
    piece.style.height = size * 0.4 + size + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.opacity = '0.9';
    piece.style.borderRadius = '2px';
    piece.style.zIndex = '999';
    piece.style.pointerEvents = 'none';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.transition = `transform ${2 + Math.random() * 1.5}s ease-in, top ${2 + Math.random() * 1.5}s cubic-bezier(.2,.6,.8,1), opacity 0.5s ease ${1.6 + Math.random()}s`;
    document.body.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.top = 100 + Math.random() * 10 + 'vh';
      piece.style.transform = `rotate(${Math.random() * 720 - 360}deg)`;
      piece.style.opacity = '0';
    });
    setTimeout(() => piece.remove(), 3600);
  }
}

// ---------- hero countdown ----------
const heroMessageEl = document.getElementById('hero-message');
const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins = document.getElementById('cd-mins');
const cdSecs = document.getElementById('cd-secs');
const countdownGrid = document.getElementById('hero-countdown');

let heroCelebrated = false;

function updateHero() {
  const now = new Date();
  const diff = BIRTHDAY_START - now;

  if (diff > 0) {
    const { days, hours, mins, secs } = formatDuration(diff);
    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
    heroMessageEl.textContent = diff < 60 * 60 * 1000
      ? "it's almost time... 🎈"
      : 'counting down to the best day 💛';
  } else {
    countdownGrid.style.display = 'none';
    heroMessageEl.textContent = "🎉 happy birthday, Lilo! today's the day 🎉";
    if (!heroCelebrated) {
      heroCelebrated = true;
      burstConfetti(50);
    }
  }
}

// ---------- station cards ----------
const stationsEl = document.getElementById('stations');
const cardState = new Map(); // id -> { revealed, clickCount }

function buildLockedCard(station) {
  const card = document.createElement('div');
  card.className = 'station-card';
  card.id = `station-${station.id}`;

  card.innerHTML = `
    <span class="station-label">${station.label}</span>
    <div class="station-lock-icon">🔒</div>
    <div class="station-unlock-time" data-role="countdown"></div>
    <div class="tease-wrap">
      <button class="tease-btn" type="button">find out early?</button>
    </div>
    <p class="tease-msg" data-role="tease-msg"></p>
  `;

  const btn = card.querySelector('.tease-btn');
  const teaseWrap = card.querySelector('.tease-wrap');
  const msgEl = card.querySelector('[data-role="tease-msg"]');
  const state = { clicks: 0, lastMsgIdx: -1 };

  function randomMessage() {
    let idx;
    do {
      idx = Math.floor(Math.random() * SASSY_MESSAGES.length);
    } while (idx === state.lastMsgIdx && SASSY_MESSAGES.length > 1);
    state.lastMsgIdx = idx;
    return SASSY_MESSAGES[idx].replace('#{n}', state.clicks);
  }

  function dodge() {
    const wrapRect = teaseWrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const maxLeft = Math.max(0, wrapRect.width - btnRect.width);
    const maxTop = Math.max(0, wrapRect.height - btnRect.height);
    const newLeft = Math.random() * maxLeft;
    const newTop = Math.random() * maxTop;
    btn.style.left = newLeft + 'px';
    btn.style.top = newTop + 'px';
    btn.style.transform = 'none';
  }

  function playMessageAnimation() {
    msgEl.classList.remove('pop');
    void msgEl.offsetWidth; // force reflow so the animation restarts every click
    msgEl.classList.add('pop');
  }

  function playButtonAnimation() {
    btn.classList.remove('squish');
    void btn.offsetWidth;
    btn.classList.add('squish');
  }

  btn.addEventListener('click', () => {
    state.clicks += 1;
    msgEl.textContent = randomMessage();
    playMessageAnimation();
    playButtonAnimation();
    if (state.clicks >= 3) dodge();
  });

  btn.addEventListener('mouseenter', () => {
    if (state.clicks >= 3) dodge();
  });

  return card;
}

function buildRevealedCard(station) {
  const card = document.createElement('div');
  card.className = 'station-card revealed';
  card.id = `station-${station.id}`;

  const details = station.details
    .map(d => `<p class="station-detail${d.placeholder ? ' placeholder' : ''}">${d.text}</p>`)
    .join('');

  card.innerHTML = `
    <span class="station-label">${station.label}</span>
    <div class="station-icon">${station.icon}</div>
    <h3 class="station-title">${station.title}</h3>
    ${details}
  `;
  return card;
}

function renderStations(firstRun = false) {
  const now = new Date();

  STATIONS.forEach(station => {
    const isUnlocked = now >= station.unlockTime;
    const prev = cardState.get(station.id);

    if (isUnlocked && (!prev || !prev.revealed)) {
      const newCard = buildRevealedCard(station);
      const existing = document.getElementById(`station-${station.id}`);
      if (existing) existing.replaceWith(newCard);
      else stationsEl.appendChild(newCard);
      cardState.set(station.id, { revealed: true });
      if (!firstRun) burstConfetti(30);
      return;
    }

    if (!isUnlocked && !prev) {
      const card = buildLockedCard(station);
      stationsEl.appendChild(card);
      cardState.set(station.id, { revealed: false });
    }

    if (!isUnlocked) {
      const countdownEl = document.querySelector(`#station-${station.id} [data-role="countdown"]`);
      if (countdownEl) {
        const { days, hours, mins, secs } = formatDuration(station.unlockTime - now);
        countdownEl.textContent = days > 0
          ? `unlocks in ${days}d ${pad(hours)}h ${pad(mins)}m`
          : `unlocks in ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
      }
    }
  });
}

// ---------- gallery lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(polaroid) {
  const img = polaroid.querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = polaroid.dataset.caption || '';
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
}

document.querySelectorAll('.polaroid').forEach(polaroid => {
  polaroid.setAttribute('tabindex', '0');
  polaroid.setAttribute('role', 'button');
  polaroid.addEventListener('click', () => openLightbox(polaroid));
  polaroid.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(polaroid);
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

// ---------- init ----------
updateHero();
renderStations(true);
setInterval(updateHero, 1000);
setInterval(() => renderStations(false), 1000);
