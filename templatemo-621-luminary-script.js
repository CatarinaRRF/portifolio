/*
TemplateMo 621 Luminary
https://templatemo.com/tm-621-luminary
*/

// ── Smooth Scroll (JS-driven, overrides CSS) ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (link.dataset.legalModal) return;

  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ── Reveal ──
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
reveals.forEach(el => io.observe(el));

// ── Counters ──
document.querySelectorAll('.counter').forEach(el => {
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const t = parseFloat(el.dataset.target), d = parseInt(el.dataset.decimals), dur = 1800, s = performance.now();
    const ease = x => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2;
    (function u(n) { const p = Math.min((n-s)/dur,1); el.textContent = (t*ease(p)).toFixed(d); if(p<1) requestAnimationFrame(u); })(s);
    e.target._counted = true;
  }, { threshold: 0.5 }).observe(el);
});

// ── Nav scroll ──
const topNav = document.getElementById('topNav');
if (topNav) {
  window.addEventListener('scroll', () => topNav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
}

const gallerySlider = document.querySelector('[data-gallery-slider]');
if (gallerySlider) {
  const gallerySlides = gallerySlider.querySelectorAll('.gallery-slide');
  const galleryDots = gallerySlider.querySelectorAll('.gallery-dot');
  const previousGalleryButton = gallerySlider.querySelector('.gallery-arrow-prev');
  const nextGalleryButton = gallerySlider.querySelector('.gallery-arrow-next');
  let galleryIndex = 0;
  let galleryTimer;

  function showGallerySlide(index) {
    galleryIndex = (index + gallerySlides.length) % gallerySlides.length;
    gallerySlides.forEach((slide, i) => slide.classList.toggle('active', i === galleryIndex));
    galleryDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === galleryIndex);
      dot.setAttribute('aria-selected', i === galleryIndex ? 'true' : 'false');
    });
  }

  function startGalleryTimer() {
    clearInterval(galleryTimer);
    galleryTimer = setInterval(() => showGallerySlide(galleryIndex + 1), 5000);
  }

  galleryDots.forEach((dot, i) => dot.addEventListener('click', () => {
    showGallerySlide(i);
    startGalleryTimer();
  }));
  previousGalleryButton.addEventListener('click', () => {
    showGallerySlide(galleryIndex - 1);
    startGalleryTimer();
  });
  nextGalleryButton.addEventListener('click', () => {
    showGallerySlide(galleryIndex + 1);
    startGalleryTimer();
  });
  gallerySlider.addEventListener('mouseenter', () => clearInterval(galleryTimer));
  gallerySlider.addEventListener('mouseleave', startGalleryTimer);
  gallerySlider.addEventListener('focusin', () => clearInterval(galleryTimer));
  gallerySlider.addEventListener('focusout', startGalleryTimer);
  startGalleryTimer();
}


// ── Hero grid spotlight ──
const heroGrid = document.querySelector('.hero-grid');
const heroEl = document.getElementById('hero') || document.querySelector('.about-page-intro');
if (heroGrid && heroEl) {
  let gx = 0, gy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    const heroRect = heroEl.getBoundingClientRect();
    const gridRect = heroGrid.getBoundingClientRect();
    const activeTop = heroRect.top + heroRect.height * 0.3;
    if (e.clientY >= activeTop && e.clientY <= heroRect.bottom) {
      tx = e.clientX - gridRect.left;
      ty = e.clientY - gridRect.top;
    } else {
      tx = gridRect.width / 2;
      ty = gridRect.height * 0.3;
    }
  });

  (function lerpGrid() {
    gx += (tx - gx) * 0.08;
    gy += (ty - gy) * 0.08;
    heroGrid.style.setProperty('--mx', gx + 'px');
    heroGrid.style.setProperty('--my', gy + 'px');
    requestAnimationFrame(lerpGrid);
  })();
}

// ── Active nav + Side panels ──
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionEls = document.querySelectorAll('section[id]');
const leftDots = document.querySelectorAll('.side-panel.left .side-dot');
const rightDots = document.querySelectorAll('.side-panel.right .side-dot');
const leftTrack = document.getElementById('leftTrack');
const rightTrack = document.getElementById('rightTrack');
const timelineTrackFill = document.getElementById('timelineTrackFill');
const scrollPctEl = document.getElementById('scrollPct');

function updateNavAndPanels() {
  const y = scrollY + innerHeight * 0.4;
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const pct = Math.min(scrollY / maxScroll, 1);

  // Active nav link
  let id = '', activeIndex = 0;
  sectionEls.forEach((s, i) => { if (y >= s.offsetTop) { id = s.id; activeIndex = i; } });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));

  // Side panel tracks
  const trackPct = (pct * 100).toFixed(0);
  if (leftTrack) leftTrack.style.height = trackPct + '%';
  if (rightTrack) rightTrack.style.height = trackPct + '%';
  if (timelineTrackFill) timelineTrackFill.style.height = trackPct + '%';
  if (scrollPctEl) scrollPctEl.textContent = String(trackPct).padStart(2, '0');

  // Side panel dots
  const leftIdx = Math.min(activeIndex, leftDots.length - 1);
  const rightIdx = Math.min(activeIndex, rightDots.length - 1);
  leftDots.forEach((d, i) => d.classList.toggle('active', i === leftIdx));
  rightDots.forEach((d, i) => d.classList.toggle('active', i === rightIdx));
}

window.addEventListener('scroll', updateNavAndPanels, { passive: true });
updateNavAndPanels();

// ── Post TOC active state ──
const tocLinks = document.querySelectorAll('.toc-link');
const tocSections = document.querySelectorAll('#draft, #cutting, #practice');

function updateTocState() {
  if (!tocLinks.length || !tocSections.length) return;

  let activeId = tocSections[0].id;
  tocSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.35) activeId = section.id;
  });

  tocLinks.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + activeId;
    link.classList.toggle('active', isActive);
  });
}

window.addEventListener('scroll', updateTocState, { passive: true });
updateTocState();

// ── Copy code block ──
const copyButtons = document.querySelectorAll('.copy-btn');
copyButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const selector = button.dataset.copy;
    const target = selector ? document.querySelector(selector) : null;
    const text = target ? target.textContent : '';

    if (!text) return;

    const label = button.querySelector('.copy-label');

    try {
      await navigator.clipboard.writeText(text);
      if (label) label.textContent = 'Copied';
      button.classList.add('copied');
      setTimeout(() => {
        if (label) label.textContent = 'Copy';
        button.classList.remove('copied');
      }, 1200);
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      if (label) label.textContent = 'Copied';
      button.classList.add('copied');
      setTimeout(() => {
        if (label) label.textContent = 'Copy';
        button.classList.remove('copied');
      }, 1200);
    }
  });
});

// ── Legal modal ──
const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    body: `
      <p>All information and datasets provided by clients for analysis, including genomic, transcriptomic, proteomic, and other biological data, are treated as confidential and protected with the utmost care.</p>
      <p>Client materials are used exclusively for the purpose of delivering the agreed analytical service and are not sold, disclosed, published, or transferred to third parties without prior written authorization.</p>
      <p>Access to project files and associated information is limited to the professional activities required for analysis, interpretation, reporting, and client communication. Data are stored only for as long as necessary to fulfill the work and maintain contractual obligations.</p>
      <p>Confidentiality is maintained throughout the collaboration, and any exception to this policy requires explicit written agreement from the client or project owner.</p>
    `
  },
  terms: {
    title: 'Terms of Use',
    body: `
      <p>This website presents selected examples of analytical work, workflows, visual summaries, and project highlights for professional, scientific, and informational purposes.</p>
      <p>Unless explicitly agreed in writing, analyses, figures, datasets, methodologies, and results displayed on this site must not be copied, reposted, republished, redistributed, or reused in publications, presentations, promotional content, social media, websites, or commercial materials without prior authorization.</p>
      <p>Any public reference to a project must respect confidentiality obligations, institutional rights, and the ownership of the underlying data and results.</p>
      <p>Visitors acknowledge that portfolio content is provided as a sample of professional work and does not constitute unrestricted permission for reuse outside the agreed scope of the client relationship.</p>
    `
  }
};

const legalModalBackdrop = document.getElementById('legalModalBackdrop');
const legalModalTitle = document.getElementById('legalModalTitle');
const legalModalBody = document.getElementById('legalModalBody');
const legalModalClose = document.getElementById('legalModalClose');

function openLegalModal(type) {
  const content = legalContent[type];
  if (!content || !legalModalBackdrop || !legalModalTitle || !legalModalBody) return;

  legalModalTitle.textContent = content.title;
  legalModalBody.innerHTML = content.body;
  legalModalBackdrop.classList.add('open');
  legalModalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLegalModal() {
  if (!legalModalBackdrop) return;
  legalModalBackdrop.classList.remove('open');
  legalModalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-legal-modal]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    openLegalModal(link.dataset.legalModal);
  });
});

if (legalModalClose) {
  legalModalClose.addEventListener('click', closeLegalModal);
}

if (legalModalBackdrop) {
  legalModalBackdrop.addEventListener('click', event => {
    if (event.target === legalModalBackdrop) closeLegalModal();
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && legalModalBackdrop && legalModalBackdrop.classList.contains('open')) {
    closeLegalModal();
  }
});

// ── Mobile menu ──
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('mobileMenu');
if (toggle && menu) {
  const menuLinks = menu.querySelectorAll('.mobile-menu-link');
  let menuOpen = false;
  function openMenu() { menuOpen=true; toggle.classList.add('active'); toggle.setAttribute('aria-expanded','true'); menu.classList.add('open'); document.body.classList.add('menu-open'); }
  function closeMenu() { if(!menuOpen) return; menuOpen=false; toggle.classList.remove('active'); toggle.setAttribute('aria-expanded','false'); menu.classList.remove('open'); document.body.classList.remove('menu-open'); }
  toggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  menuLinks.forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (innerWidth > 1024) closeMenu(); });
}

// ── Pricing toggle ──
const pToggle = document.getElementById('pricingToggle');
if (pToggle) {
  const mLabel = document.getElementById('monthlyLabel');
  const aLabel = document.getElementById('annualLabel');
  const saveBadge = document.getElementById('saveBadge');
  const monthlyOpts = document.querySelectorAll('.price-option.monthly');
  const annualOpts = document.querySelectorAll('.price-option.annual');
  let annual = false;

  function setPricing() {
    annual = !annual;
    pToggle.classList.toggle('annual', annual);
    pToggle.setAttribute('aria-checked', annual);
    mLabel.classList.toggle('active', !annual);
    aLabel.classList.toggle('active', annual);
    saveBadge.classList.toggle('show', annual);
    monthlyOpts.forEach(el => el.classList.toggle('active', !annual));
    annualOpts.forEach(el => el.classList.toggle('active', annual));
  }
  pToggle.addEventListener('click', setPricing);
  pToggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPricing(); } });
}

// ── FAQ accordion ──
const faqItems = document.querySelectorAll('.faq-item');
const faqToggleAll = document.getElementById('faqToggleAll');
if (faqToggleAll && faqItems.length) {
  let allExpanded = false;

  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('open');
      updateFaqToggleLabel();
    });
  });

  faqToggleAll.addEventListener('click', () => {
    allExpanded = !allExpanded;
    if (allExpanded) {
      faqItems.forEach((item, i) => {
        setTimeout(() => item.classList.add('open'), i * 220);
      });
    } else {
      const total = faqItems.length;
      faqItems.forEach((item, i) => {
        setTimeout(() => item.classList.remove('open'), (total - 1 - i) * 60);
      });
    }
    setTimeout(updateFaqToggleLabel, faqItems.length * 220 + 100);
  });

  function updateFaqToggleLabel() {
    const openCount = document.querySelectorAll('.faq-item.open').length;
    allExpanded = openCount === faqItems.length;
    faqToggleAll.textContent = allExpanded ? 'Collapse All' : 'Expand All';
  }
}

