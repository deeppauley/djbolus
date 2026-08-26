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
bookingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = bookingForm.querySelector('button[type="submit"]');
  const status = bookingForm.querySelector('.form-status');
  const data = Object.fromEntries(new FormData(bookingForm));
  button.disabled = true;
  button.firstChild.textContent = 'SENDING… ';
  status.textContent = '';

  try {
    const response = await fetch('https://formsubmit.co/ajax/pauleyc@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || 'Not provided',
        'event date': data.date || 'Not specified',
        location: data.location || 'Not specified',
        'event type': data.event || 'Not specified',
        details: data.details,
        _subject: `New DJ Bolus booking inquiry — ${data.name}`,
        _cc: 'chriscbolus@gmail.com',
        _template: 'table',
        _honey: data._honey
      })
    });
    if (!response.ok) throw new Error('Submission failed');
    bookingForm.reset();
    status.textContent = 'Booking request sent. We will be in touch.';
  } catch {
    status.textContent = 'Something went wrong. Please try again in a moment.';
  } finally {
    button.disabled = false;
    button.firstChild.textContent = 'SEND BOOKING REQUEST ';
  }
});
