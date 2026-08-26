document.querySelector('#year').textContent = new Date().getFullYear();

const heroVideo = document.querySelector('.hero-video');
const soundToggle = document.querySelector('.hero-sound');
let soundEnabled = false;

function updateSoundControl() {
  soundToggle.classList.toggle('muted', !soundEnabled);
  soundToggle.querySelector('span').textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
  soundToggle.setAttribute('aria-label', soundEnabled ? 'Mute background audio' : 'Turn background audio on');
}

heroVideo.volume = .8;
heroVideo.play().catch(() => {});
updateSoundControl();

soundToggle.addEventListener('click', async () => {
  if (!soundEnabled) {
    heroVideo.removeAttribute('muted');
    heroVideo.defaultMuted = false;
    heroVideo.muted = false;
    heroVideo.volume = 1;
    try {
      await heroVideo.play();
      soundEnabled = true;
    } catch {
      heroVideo.muted = true;
      soundEnabled = false;
    }
  } else {
    heroVideo.muted = true;
    soundEnabled = false;
  }
  updateSoundControl();
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const orbit = document.querySelector('.orbit-two');
  let frame = false;
  const update = () => {
    const progress = Math.min(1, scrollY / Math.max(1, innerHeight));
    orbit.style.transform = `translate(-50%, -50%) rotate(${progress * 85 - 18}deg)`;
    frame = false;
  };
  addEventListener('scroll', () => {
    if (!frame) { requestAnimationFrame(update); frame = true; }
  }, { passive: true });
}

const bookingForm = document.querySelector('#bolus-booking-form');
bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const value = (name) => String(data.get(name) || '').trim();
  const subject = `DJ Bolus booking inquiry${value('event') ? ` — ${value('event')}` : ''}`;
  const body = [
    'DJ BOLUS BOOKING INQUIRY', '',
    `Name: ${value('name')}`,
    `Contact: ${value('contact')}`,
    `Event date: ${value('date') || 'Not specified'}`,
    `Location: ${value('location') || 'Not specified'}`,
    `Event type: ${value('event') || 'Not specified'}`,
    '', 'Details:', value('details')
  ].join('\n');
  window.location.href = `mailto:pauleyc@gmail.com,chriscbolus@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
