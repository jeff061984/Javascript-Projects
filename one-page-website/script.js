const words = ['Web Developer', 'Gamer'];
const typedEl = document.getElementById('typed');
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const word = words[wordIndex];
  typedEl.textContent = word.substring(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
  } else if (deleting && charIndex > 0) {
    charIndex--;
  } else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeLoop, deleting ? 1200 : 300); // pause at full word / empty
    return;
  }
  setTimeout(typeLoop, deleting ? 50 : 100);
}
typeLoop();

// ===== Scroll progress bar =====
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progress.style.width = (scrolled * 100) + '%';
});

// ===== Mobile menu =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ===== Reveal sections + skill bars on scroll =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.fill').forEach(fill => {
        fill.style.width = fill.dataset.level + '%';
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(section => observer.observe(section));

// ===== Score system =====
let score = 0;
const scoreEl = document.getElementById('score');

function addPoints(points, x, y) {
  score += points;
  scoreEl.textContent = score;

  const pop = document.createElement('div');
  pop.className = 'points-pop';
  pop.textContent = '+' + points;
  pop.style.left = x + 'px';
  pop.style.top = y + 'px';
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

// ===== Gallery filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = [...document.querySelectorAll('.gallery-item')];

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hide', !match);
    });
  });
});

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbCaption');
const lbCounter = document.getElementById('lbCounter');
const lbThumbs = document.getElementById('lbThumbs');
let visibleItems = [];
let currentIndex = 0;

// Only include images that are currently shown by the filter
function getVisibleItems() {
  return galleryItems.filter(item => !item.classList.contains('hide'));
}

function openLightbox(index) {
  visibleItems = getVisibleItems();
  currentIndex = index;
  buildThumbnails();
  showImage();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // stop page scrolling behind the modal
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showImage() {
  const img = visibleItems[currentIndex].querySelector('img');

  // Restart the zoom animation each time the image changes
  lbImage.classList.remove('pop');
  void lbImage.offsetWidth;
  lbImage.classList.add('pop');

  lbImage.src = img.src;
  lbImage.alt = img.alt;
  lbCaption.textContent = img.dataset.caption || img.alt;
  lbCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;

  lbThumbs.querySelectorAll('img').forEach((thumb, i) =>
    thumb.classList.toggle('active', i === currentIndex)
  );
}

function buildThumbnails() {
  lbThumbs.innerHTML = '';
  visibleItems.forEach((item, i) => {
    const thumb = document.createElement('img');
    thumb.src = item.querySelector('img').src;
    thumb.alt = 'Thumbnail ' + (i + 1);
    thumb.addEventListener('click', () => {
      currentIndex = i;
      showImage();
    });
    lbThumbs.appendChild(thumb);
  });
}

function nextImage() {
  currentIndex = (currentIndex + 1) % visibleItems.length; // wraps to first
  showImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; // wraps to last
  showImage();
}

// Open on click (+10 points)
galleryItems.forEach(item => {
  item.addEventListener('click', e => {
    openLightbox(getVisibleItems().indexOf(item));
    addPoints(10, e.clientX, e.clientY);
  });
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbNext').addEventListener('click', nextImage);
document.getElementById('lbPrev').addEventListener('click', prevImage);

// Close when clicking the dark background
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard controls
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});

// Swipe support for phones
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});
lightbox.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (diff > 50) prevImage();
  if (diff < -50) nextImage();
});

// ===== Contact form (demo only) =====
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault(); // stop the page from reloading
  const name = document.getElementById('name').value.trim();
  showToast(`Thanks, ${name}! Message received 🎉`);
  e.target.reset();
});

// ===== Konami code easter egg =====
const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPos = 0;

document.addEventListener('keydown', e => {
  konamiPos = (e.key === konami[konamiPos]) ? konamiPos + 1 : 0;
  if (konamiPos === konami.length) {
    document.body.classList.toggle('rainbow');
    showToast('🌈 CHEAT CODE ACTIVATED! 🌈');
    konamiPos = 0;
  }
});