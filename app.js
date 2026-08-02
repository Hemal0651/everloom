/* ==========================================================================
   EVERLOOM LUXURY APP LOGIC & INTERACTIVE PLASMA ENGINE
   ========================================================================== */

/* Scrollbar — invisible at rest, appears while scrolling */
let scrollTimeout;

// Inject the custom scrollbar into the DOM
const scrollbarTrack = document.createElement('div');
scrollbarTrack.id = 'custom-scrollbar';
const scrollbarThumb = document.createElement('div');
scrollbarThumb.id = 'custom-scrollbar-thumb';
scrollbarTrack.appendChild(scrollbarThumb);
document.body.appendChild(scrollbarTrack);

function updateScrollbar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const viewportHeight = window.innerHeight;

  // Thumb height proportional to viewport vs full page
  const thumbHeight = Math.max((viewportHeight / document.documentElement.scrollHeight) * viewportHeight, 40);
  // Thumb position
  const thumbTop = (scrollTop / docHeight) * (viewportHeight - thumbHeight);

  scrollbarThumb.style.height = thumbHeight + 'px';
  scrollbarThumb.style.top = thumbTop + 'px';
}

window.addEventListener('scroll', () => {
  updateScrollbar();
  scrollbarTrack.classList.add('is-scrolling');
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    scrollbarTrack.classList.remove('is-scrolling');
  }, 800);
}, { passive: true });

// Init on load
updateScrollbar();
// Plasma Subjects Metadata (All 9 Cutouts)
const plasmaSubjects = [
  { id: '001', img: './plasma/001.png', name: 'Look 01 — Monochrome Utility' },
  { id: '002', img: './plasma/002.png', name: 'Look 02 — Earth Knit & Linen' },
  { id: '003', img: './plasma/003.png', name: 'Look 03 — Junior Cargo Suit' },
  { id: '004', img: './plasma/004.png', name: 'Look 04 — Heavyweight Hoodie' },
  { id: '005', img: './plasma/005.png', name: 'Look 05 — Women\'s Tailored Knit' },
  { id: '006', img: './plasma/006.png', name: 'Look 06 — Junior Earth Sweat' },
  { id: '007', img: './plasma/007.png', name: 'Look 07 — Charcoal Oversized' },
  { id: '008', img: './plasma/008.png', name: 'Look 08 — Corduroy Workwear' },
  { id: '009', img: './plasma/009.png', name: 'Look 09 — Architectural Puffer' }
];

// Curated Product Catalog (Realistic High-Fashion Products on #e5e2dc Canvas)
const catalogProducts = [
  { id: 1, title: 'Architectural Pleated Charcoal Trousers', category: 'trousers', price: 6499, img: './media/products/trouser.png', tag: 'ESSENTIAL' },
  { id: 2, title: 'Relaxed Fit Linen Button-Down Shirt', category: 'tops', price: 4999, img: './media/products/shirt.png', tag: 'NEW' },
  { id: 3, title: 'Minimalist Architectural Leather Tote Bag', category: 'accessories', price: 8999, img: './media/products/bag.png', tag: 'LUXURY' },
  { id: 4, title: 'Monochrome Court Low Leather Sneakers', category: 'footwear', price: 7299, img: './media/products/sneaker.png', tag: 'BESTSELLER' },
  { id: 5, title: 'Junior Earth Linen Cargo Outfit Set', category: 'kids', price: 4299, img: './media/products/kids.png', tag: 'KIDS 2026' },
  { id: 6, title: 'Rich Mocha Suede Studio Loafers', category: 'footwear', price: 7899, img: './media/products/loafers.png', tag: 'LIMITED' },
  { id: 7, title: '450GSM Loopback Heavyweight Hoodie', category: 'tops', price: 5999, img: './media/products/hoodie.png', tag: 'RESTOCK' },
  { id: 8, title: 'Cream Cashmere Blend Tailored Knit', category: 'tops', price: 6899, img: './media/products/knit.png', tag: 'CRAFT' }
];

// State Management
let currentSubjectIndex = 0;
let cart = [];

// DOM References
const heroSubjectImg = document.getElementById('hero-subject-img');
const subjectWrapper = document.getElementById('subject-wrapper');
const currentSlideNum = document.getElementById('current-slide-num');
const totalSlideNum = document.getElementById('total-slide-num');
const stepBarsContainer = document.getElementById('step-bars');
const thumbnailsTrack = document.getElementById('thumbnails-track');
const productsGrid = document.getElementById('products-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Cart DOM
const cartDrawer = document.getElementById('cart-drawer');
const cartBackdrop = document.getElementById('cart-backdrop');
const btnBag = document.getElementById('btn-bag');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartCountEl = document.getElementById('cart-count');
const drawerCartCountEl = document.getElementById('drawer-cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const shippingProgress = document.getElementById('shipping-progress');
const shippingMsg = document.getElementById('shipping-msg');

// Search DOM
const btnSearch = document.getElementById('btn-search');
const searchModal = document.getElementById('search-modal');
const searchCloseBtn = document.getElementById('search-close-btn');
const searchInput = document.getElementById('search-input');
const searchResultsGrid = document.getElementById('search-results');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initPlasmaEngine();
  initThumbnailsTrack();
  initProductCatalog();
  initParallaxEffect();
  initMobileScrollParallax();
  initMagneticButton();
  initEventListeners();
  initAutoPlay();
  initHamburgerMenu();
  initTouchSwipe();
});

/* ==========================================================================
   PLASMA ENGINE CONTROLLER
   ========================================================================== */
function preloadPlasmaImages() {
  plasmaSubjects.forEach(subject => {
    const img = new Image();
    img.src = subject.img;
  });
}

function initPlasmaEngine() {
  preloadPlasmaImages();
  if (totalSlideNum) totalSlideNum.textContent = String(plasmaSubjects.length).padStart(2, '0');
  updateSubjectStage(0, false);
}

function updateSubjectStage(index, animate = true) {
  if (index < 0) index = plasmaSubjects.length - 1;
  if (index >= plasmaSubjects.length) index = 0;

  currentSubjectIndex = index;
  const data = plasmaSubjects[currentSubjectIndex];

  // Update Counter
  if (currentSlideNum) currentSlideNum.textContent = String(index + 1).padStart(2, '0');

  // Update Active Step Bar
  if (stepBarsContainer) {
    const stepBars = stepBarsContainer.querySelectorAll('.step-bar');
    stepBars.forEach((bar, i) => {
      bar.classList.toggle('active', i === index % stepBars.length);
    });
  }

  // Update Thumbnail Active State
  if (thumbnailsTrack) {
    const thumbCards = thumbnailsTrack.querySelectorAll('.thumb-card');
    thumbCards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  }

  // CSS Keyframe Cutout Transition (Drift Left & Enter from Right)
  if (animate && heroSubjectImg) {
    // Phase 1: Drift current model to left while fading out
    heroSubjectImg.classList.remove('fly-in', 'fly-out');
    void heroSubjectImg.offsetWidth;
    heroSubjectImg.classList.add('fly-out');

    setTimeout(() => {
      // Phase 2: Swap image source & slide new model in from right
      heroSubjectImg.src = data.img;
      heroSubjectImg.classList.remove('fly-out');
      void heroSubjectImg.offsetWidth;
      heroSubjectImg.classList.add('fly-in');

      setTimeout(() => {
        heroSubjectImg.classList.remove('fly-in');
      }, 750);
    }, 380);
  } else if (heroSubjectImg) {
    heroSubjectImg.src = data.img;
    heroSubjectImg.classList.remove('fly-in', 'fly-out');
  }
}

/* ==========================================================================
   AUTO-PLAY SLIDESHOW — 3 second interval, fashion-smooth
   ========================================================================== */
let autoPlayTimer = null;
let autoPlayPaused = false;
let progressAnimFrame = null;
let progressStart = null;
const AUTO_PLAY_DURATION = 3000; // ms

function initAutoPlay() {
  const heroSection = document.getElementById('hero');

  // Pause on hover — user is browsing
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => { autoPlayPaused = true; stopProgress(); });
    heroSection.addEventListener('mouseleave', () => {
      autoPlayPaused = false;
      scheduleNextSlide();
    });
  }

  scheduleNextSlide();
}

function scheduleNextSlide() {
  clearTimeout(autoPlayTimer);
  cancelAnimationFrame(progressAnimFrame);

  if (autoPlayPaused) return;

  startProgress();

  autoPlayTimer = setTimeout(() => {
    if (!autoPlayPaused) {
      updateSubjectStage(currentSubjectIndex + 1, true);
      scheduleNextSlide();
    }
  }, AUTO_PLAY_DURATION);
}

function startProgress() {
  // Animate the active step-bar inner fill over AUTO_PLAY_DURATION
  progressStart = performance.now();

  // Update or create the progress fill element
  const activeBar = stepBarsContainer ? stepBarsContainer.querySelector('.step-bar.active') : null;
  if (!activeBar) return;

  // Ensure fill child exists
  let fill = activeBar.querySelector('.step-bar-fill');
  if (!fill) {
    fill = document.createElement('span');
    fill.className = 'step-bar-fill';
    activeBar.appendChild(fill);
  }
  fill.style.transition = 'none';
  fill.style.width = '0%';

  // Force reflow
  fill.getBoundingClientRect();

  fill.style.transition = `width ${AUTO_PLAY_DURATION}ms linear`;
  fill.style.width = '100%';
}

function stopProgress() {
  const bars = stepBarsContainer ? stepBarsContainer.querySelectorAll('.step-bar-fill') : [];
  bars.forEach(f => {
    f.style.transition = 'none';
    f.style.width = '0%';
  });
}

function initThumbnailsTrack() {
  if (!thumbnailsTrack) return;
  thumbnailsTrack.innerHTML = '';
  plasmaSubjects.forEach((sub, i) => {
    const card = document.createElement('div');
    card.className = `thumb-card ${i === 0 ? 'active' : ''}`;
    card.innerHTML = `
      <div class="thumb-img-wrapper">
        <img src="${sub.img}" alt="${sub.name}" class="thumb-img" />
      </div>
      <div class="thumb-info">
        <span class="thumb-num">0${i + 1}</span>
        <span class="thumb-name">${sub.name.split('—')[1] || sub.name}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      updateSubjectStage(i, true);
      // Restart autoplay timer on manual pick
      autoPlayPaused = false;
      scheduleNextSlide();
    });
    thumbnailsTrack.appendChild(card);
  });
}

/* ==========================================================================
   3D MOUSE PARALLAX — text only, NOT the subject (avoids positional jump)
   ========================================================================== */
function initParallaxEffect() {
  const heroSection = document.getElementById('hero');
  const giantText = document.getElementById('giant-text');

  if (!heroSection || !giantText) return;

  heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const moveX = (clientX - innerWidth / 2) / (innerWidth / 2);
    const moveY = (clientY - innerHeight / 2) / (innerHeight / 2);

    // Only subtly shift the giant background text for depth
    // The subject image stays perfectly anchored — no jumping
    giantText.style.transform = `translate3d(${-moveX * 8}px, ${-moveY * 4}px, 0)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    giantText.style.transform = 'translate3d(0,0,0)';
  });
}

/* ==========================================================================
   MAGNETIC CIRCULAR CTA BUTTON
   ========================================================================== */
function initMagneticButton() {
  const circleBtn = document.getElementById('shop-circle');
  if (!circleBtn) return;

  circleBtn.addEventListener('mousemove', (e) => {
    const rect = circleBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    circleBtn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0) scale(1.06)`;
  });

  circleBtn.addEventListener('mouseleave', () => {
    circleBtn.style.transform = 'translate3d(0, 0, 0) scale(1)';
  });
}

/* ==========================================================================
   CATALOG GRID & FILTERS
   ========================================================================== */
function initProductCatalog() {
  renderCatalog('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderCatalog(filter);
    });
  });
}

function renderCatalog(filter) {
  if (!productsGrid) return;
  productsGrid.innerHTML = '';

  const filtered = filter === 'all'
    ? catalogProducts
    : catalogProducts.filter(p => p.category === filter);

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-wrapper">
        <span class="product-badge">${item.tag}</span>
        <img src="${item.img}" alt="${item.title}" class="product-img" />
        <button class="quick-view-overlay-btn" onclick="addToCart('${item.title.replace(/'/g, "\\'")}', ${item.price}, '${item.img}')">+ QUICK ADD</button>
      </div>
      <div class="product-info">
        <div>
          <h3 class="product-title">${item.title}</h3>
          <span class="product-cat">${item.category.toUpperCase()}</span>
        </div>
        <span class="product-price">₹${item.price.toLocaleString('en-IN')}</span>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

/* ==========================================================================
   SHOPPING CART DRAWER LOGIC
   ========================================================================== */
function addToCart(title, price, img) {
  const existing = cart.find(item => item.title === title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ title, price, img, qty: 1 });
  }

  updateCartUI();
  showToast(`Added "${title}" to your bag`);
  toggleCart(true);
}

function removeFromCart(title) {
  cart = cart.filter(item => item.title !== title);
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (cartCountEl) cartCountEl.textContent = totalItems;
  if (drawerCartCountEl) drawerCartCountEl.textContent = totalItems;
  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

  const freeThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);
  if (shippingProgress) shippingProgress.style.width = `${progressPercent}%`;

  if (shippingMsg) {
    if (subtotal >= freeThreshold) {
      shippingMsg.innerHTML = '🎉 You unlocked <strong>FREE EXPRESS SHIPPING</strong>!';
    } else {
      const remaining = freeThreshold - subtotal;
      shippingMsg.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for FREE SHIPPING`;
    }
  }

  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-msg">
          <p>Your bag is currently empty.</p>
          <button class="start-shopping-btn" onclick="toggleCart(false)">EXPLORE COLLECTION</button>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.title}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.title}</h4>
            <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')} × ${item.qty}</p>
            <span class="cart-item-remove" onclick="removeFromCart('${item.title.replace(/'/g, "\\'")}')">Remove Item</span>
          </div>
        </div>
      `).join('');
    }
  }
}

function toggleCart(open) {
  if (open) {
    if (cartDrawer) cartDrawer.classList.add('active');
    if (cartBackdrop) cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    if (cartDrawer) cartDrawer.classList.remove('active');
    if (cartBackdrop) cartBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   SEARCH & EVENT LISTENERS
   ========================================================================== */
function initEventListeners() {
  if (stepBarsContainer) {
    const stepBars = stepBarsContainer.querySelectorAll('.step-bar');
    stepBars.forEach(bar => {
      bar.addEventListener('click', () => {
        const idx = parseInt(bar.dataset.index);
        updateSubjectStage(idx, true);
      });
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateSubjectStage(currentSubjectIndex - 1, true);
    if (e.key === 'ArrowRight') updateSubjectStage(currentSubjectIndex + 1, true);
  });

  if (btnBag) btnBag.addEventListener('click', () => toggleCart(true));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => toggleCart(false));
  if (cartBackdrop) cartBackdrop.addEventListener('click', () => toggleCart(false));

  if (btnSearch) btnSearch.addEventListener('click', () => toggleSearch(true));
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', () => toggleSearch(false));

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      renderSearchResults(query);
    });
  }
}

function toggleSearch(open) {
  if (open) {
    if (searchModal) searchModal.classList.add('active');
    if (searchInput) searchInput.focus();
  } else {
    if (searchModal) searchModal.classList.remove('active');
  }
}

function quickSearch(query) {
  if (searchInput) {
    searchInput.value = query;
    renderSearchResults(query.toLowerCase());
  }
}

function renderSearchResults(query) {
  if (!searchResultsGrid) return;
  if (!query) {
    searchResultsGrid.innerHTML = '';
    return;
  }

  const results = catalogProducts.filter(p =>
    p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    searchResultsGrid.innerHTML = `<p style="grid-column: 1/-1; color: var(--color-muted);">No products found matching "${query}".</p>`;
    return;
  }

  searchResultsGrid.innerHTML = results.map(item => `
    <div class="product-card" onclick="addToCart('${item.title.replace(/'/g, "\\'")}', ${item.price}, '${item.img}'); toggleSearch(false);">
      <div class="product-img-wrapper" style="height: 220px;">
        <img src="${item.img}" alt="${item.title}" class="product-img" />
      </div>
      <div class="product-info">
        <div>
          <h4 class="product-title">${item.title}</h4>
          <span class="product-price">₹${item.price.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function copyPromoCode(code, btnElement) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code);
  }

  if (btnElement) {
    const originalText = btnElement.innerText;
    btnElement.innerText = 'COPIED! ✓';
    btnElement.style.backgroundColor = '#27ae60';
    btnElement.style.color = '#ffffff';

    setTimeout(() => {
      btnElement.innerText = originalText;
      btnElement.style.backgroundColor = '';
      btnElement.style.color = '';
    }, 2500);
  }

  showToast(`Code ${code} copied to clipboard! (20% OFF)`);
}

/* ==========================================================================
   HAMBURGER MENU
   ========================================================================== */
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  if (!hamburgerBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('active');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
  });

  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) closeMenu();
  });
}

/* ==========================================================================
   MOBILE SCROLL PARALLAX
   ========================================================================== */
function initMobileScrollParallax() {
  const bgContainer = document.getElementById('bg-text-container');
  const heroSection = document.getElementById('hero');
  if (!bgContainer || !heroSection) return;

  let rafId = null;

  function onScroll() {
    if (!window.matchMedia('(max-width: 1024px)').matches) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroH = heroSection.offsetHeight;
      if (scrollY <= heroH) {
        const shift = (scrollY / heroH) * -55;
        bgContainer.style.transform = `translate(-50%, calc(-50% + ${shift}px))`;
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   TOUCH SWIPE HERO
   ========================================================================== */
function initTouchSwipe() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  let startX = 0, startY = 0;

  hero.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
  }, { passive: true });

  hero.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - startX;
    const dy = e.changedTouches[0].screenY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      updateSubjectStage(currentSubjectIndex + (dx < 0 ? 1 : -1), true);
      autoPlayPaused = false;
      scheduleNextSlide();
    }
  }, { passive: true });
}
