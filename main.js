// Register service worker (if supported)
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('sw.js')
.then(reg => console.log('SW registered', reg))
.catch(err => console.warn('SW register failed', err));
}


// beforeinstallprompt handling
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
e.preventDefault();
deferredPrompt = e;
if (installBtn) {
installBtn.style.display = 'inline-block';
installBtn.setAttribute('aria-hidden', 'false');
}
});


if (installBtn) {
installBtn.addEventListener('click', async () => {
if (!deferredPrompt) return;
deferredPrompt.prompt();
const choice = await deferredPrompt.userChoice;
console.log('User install choice', choice);
deferredPrompt = null;
installBtn.style.display = 'none';
});
}


// Simple contact form handler (client-side only)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
contactForm.addEventListener('submit', (e) => {
e.preventDefault();
// In demo we just show a message
alert('Thank you! Your message is received (demo).');
contactForm.reset();
});
}


// Optional: show install button if already available
window.addEventListener('appinstalled', () => {
console.log('App installed');
if (installBtn) installBtn.style.display = 'none';
});
