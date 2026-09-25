/**
 * FASHION - Modern E-Commerce Client Architecture & Dynamic Engine
 * Incorporating Luxury Animations, Interactive Cart, Wishlist, Quick View,
 * Scroll Reveals, Counters, Real-Time Form Validation & Theme Modes.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. PRODUCT CATALOG DATA REPOSITORY
  // --------------------------------------------------------------------------
  const PRODUCTS_CATALOG = {
    'hoodies': {
      id: 'hoodies',
      name: 'Hoodies & Sweatshirt',
      subtitle: 'Ultra-Comfort Heavyweight Fleece Drop-Shoulder',
      category: 'Streetwear',
      price: 49.99,
      originalPrice: 79.99,
      badge: 'BESTSELLER',
      rating: 4.9,
      reviews: 184,
      image: 'assets/img/category-item-1.png',
      description: 'Crafted from 420 GSM French Terry cotton with custom brushed fleece lining. Features relaxed drop shoulders, double-layered drawstring hood, and ribbed cuffs engineered to hold their shape through countless washes.',
      colors: [
        { name: 'Onyx Black', hex: '#1c1c1c' },
        { name: 'Mustard Gold', hex: '#EBD96B' },
        { name: 'Heather Grey', hex: '#8e8e8e' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true
    },
    'coats': {
      id: 'coats',
      name: 'Coats & Parkas',
      subtitle: 'All-Weather Tailored Storm Trench & Parka',
      category: 'Outerwear',
      price: 89.99,
      originalPrice: 129.99,
      badge: 'TRENDING',
      rating: 4.8,
      reviews: 126,
      image: 'assets/img/category-item-2.png',
      description: 'Engineered for crisp seasons with high-density water-repellent shell and thermal quilted insulation. Features dual storm welt pockets, storm flap collar, and sleek tailored silhouette.',
      colors: [
        { name: 'Camel Tan', hex: '#c59b6d' },
        { name: 'Midnight Charcoal', hex: '#232528' },
        { name: 'Deep Forest', hex: '#2b3a32' }
      ],
      sizes: ['M', 'L', 'XL'],
      inStock: true
    },
    'tees': {
      id: 'tees',
      name: 'Tees & T-Shirt',
      subtitle: '100% Peruvian Pima Cotton Vintage Fit',
      category: 'Essentials',
      price: 29.99,
      originalPrice: 42.00,
      badge: 'NEW',
      rating: 5.0,
      reviews: 215,
      image: 'assets/img/category-item-3.png',
      description: 'The definitive daily luxury tee. Spun from long-staple combed cotton for an extraordinarily soft handfeel, pre-shrunk with seamless collar construction that never rolls.',
      colors: [
        { name: 'Optic White', hex: '#f8f9fa' },
        { name: 'Pitch Black', hex: '#111111' },
        { name: 'Vintage Olive', hex: '#556b2f' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      inStock: true
    },
    'trending': {
      id: 'trending',
      name: 'Trending On Instagram Ensemble',
      subtitle: 'Viral Statement Urban Coordinates',
      category: 'Featured',
      price: 64.99,
      originalPrice: 94.99,
      badge: 'HOT DROP',
      rating: 4.9,
      reviews: 342,
      image: 'assets/img/product-item-1.png',
      description: 'The outfit seen everywhere on your social feed. Minimalist lines combined with premium heavyweight texture, designed for effortless day-to-night styling.',
      colors: [
        { name: 'Sand Beige', hex: '#e3d7bf' },
        { name: 'Shadow Black', hex: '#191919' }
      ],
      sizes: ['S', 'M', 'L'],
      inStock: true
    },
    'under40': {
      id: 'under40',
      name: 'All Under $40 Capsule',
      subtitle: 'Modern Everyday Wardrobe Essentials',
      category: 'Value Select',
      price: 36.99,
      originalPrice: 58.00,
      badge: 'VALUE DEAL',
      rating: 4.7,
      reviews: 95,
      image: 'assets/img/product-item-2.png',
      description: 'Exceptional designer quality at an accessible price. Breathable lightweight knit with clean stitch details and all-day comfort.',
      colors: [
        { name: 'Slate Blue', hex: '#4a607a' },
        { name: 'Off-White Cream', hex: '#f0ece1' },
        { name: 'Rich Ochre', hex: '#e0a93b' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true
    }
  };

  // --------------------------------------------------------------------------
  // 2. STATE MANAGEMENT (Cart, Wishlist, Theme)
  // --------------------------------------------------------------------------
  const State = {
    cart: JSON.parse(localStorage.getItem('fashion_cart_items')) || [
      {
        id: 'hoodies',
        name: 'Hoodies & Sweatshirt',
        price: 49.99,
        image: 'assets/img/category-item-1.png',
        size: 'L',
        color: 'Mustard Gold',
        qty: 1
      }
    ],
    wishlist: JSON.parse(localStorage.getItem('fashion_wishlist_items')) || ['trending'],
    discountPercent: 0,
    activeCoupon: null
  };

  function saveCart() {
    localStorage.setItem('fashion_cart_items', JSON.stringify(State.cart));
    updateCartUI();
  }

  function saveWishlist() {
    localStorage.setItem('fashion_wishlist_items', JSON.stringify(State.wishlist));
    updateWishlistUI();
  }

  // --------------------------------------------------------------------------
  // 3. TOAST NOTIFICATION SYSTEM (Aurelia Inspired)
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message, icon = '✨') {
    let toast = document.getElementById('fashionToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'fashionToast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    toast.classList.add('is-visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // 4. THEME CONTROLLER (DARK / LIGHT LUXURY)
  // --------------------------------------------------------------------------
  function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const storedTheme = localStorage.getItem('fashion_theme') || 'light';

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('fashion_theme', theme);

      if (themeBtn) {
        themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        themeBtn.innerHTML = theme === 'dark' 
          ? '<i class="fa-solid fa-sun text-warning"></i>' 
          : '<i class="fa-solid fa-moon"></i>';
      }
    }

    applyTheme(storedTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        showToast(newTheme === 'dark' ? 'Dark Luxury Mode activated 🌙' : 'Light Classic Mode activated ☀️', '🎨');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 5. HEADER ELEVATION, SCROLL SPY & MOBILE DRAWER
  // --------------------------------------------------------------------------
  function initHeaderAndNav() {
    const header = document.querySelector('.header-main');
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    const navLinks = document.querySelectorAll('.nav-link, .nav-item a');
    const sections = document.querySelectorAll('section[id], footer[id]');

    // Header elevation on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 35) {
        header?.classList.add('is-scrolled');
      } else {
        header?.classList.remove('is-scrolled');
      }
    }, { passive: true });

    // Close Bootstrap mobile collapse on nav link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });

    // Scroll spy for active section highlight
    if (sections.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('active');
              } else if (href && href.startsWith('#')) {
                link.classList.remove('active');
              }
            });
          }
        });
      }, { rootMargin: '-20% 0px -65% 0px' });

      sections.forEach(sec => observer.observe(sec));
    }
  }

  // --------------------------------------------------------------------------
  // 6. LUXURY CUSTOM CURSOR (From Aurelia)
  // --------------------------------------------------------------------------
  function initCustomCursor() {
    // Only initialize on desktop with fine mouse pointer
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');

    if (!cursorDot || !cursorOutline) return;
    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    function renderCursor() {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover expansion on buttons & links
    const interactiveSelectors = 'a, button, input, select, textarea, .category-item, .product-item, .logo-item';
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        cursorOutline.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        cursorOutline.classList.remove('cursor-hover');
      }
    });

    // Image preview exploration hover state
    const viewSelectors = '.category-item-img, .product-item-img, .hero-image img, .offer-image img';
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(viewSelectors);
      if (target) {
        cursorOutline.classList.add('cursor-view');
        if (cursorText) cursorText.textContent = 'EXPLORE';
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(viewSelectors);
      if (target) {
        cursorOutline.classList.remove('cursor-view');
        if (cursorText) cursorText.textContent = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. SCROLL REVEAL ANIMATIONS (Aurelia data-reveal engine)
  // --------------------------------------------------------------------------
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // --------------------------------------------------------------------------
  // 8. ANIMATED STATS / NUMBER COUNTERS (From Aurelia)
  // --------------------------------------------------------------------------
  function initCounters() {
    const counterElements = document.querySelectorAll('.counter-val');
    if (!counterElements.length || !('IntersectionObserver' in window)) return;

    let hasRun = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          counterElements.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target') || '0');
            const suffix = counter.getAttribute('data-suffix') || '';
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();

            function step(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Cubic ease out
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = target * easeOut;

              counter.textContent = isDecimal 
                ? currentVal.toFixed(1) + suffix 
                : Math.floor(currentVal).toLocaleString() + suffix;

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                counter.textContent = isDecimal 
                  ? target.toFixed(1) + suffix 
                  : target.toLocaleString() + suffix;
              }
            }

            requestAnimationFrame(step);
          });
        }
      });
    }, { threshold: 0.25 });

    const metricSection = document.querySelector('.fashion-metrics-section');
    if (metricSection) observer.observe(metricSection);
  }

  // --------------------------------------------------------------------------
  // 9. PAYDAY SALE COUNTDOWN & 1-CLICK PROMO CODE COPY
  // --------------------------------------------------------------------------
  function initPaydaySale() {
    // 1. Live Countdown Timer (set for 7 days in future from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(23, 59, 59, 999);

    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minsEl = document.getElementById('timerMins');
    const secsEl = document.getElementById('timerSecs');

    function updateTimer() {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // 2. One-click Copy Coupon Code
    const copyBtn = document.getElementById('copyCouponBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const code = 'PAYDAY30';
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>COPIED!</span>';
          copyBtn.classList.add('btn-success');
          showToast(`Coupon code ${code} copied! 30% discount ready at checkout.`, '🎟️');
          
          // Auto-apply to cart discount
          State.discountPercent = 30;
          State.activeCoupon = 'PAYDAY30';
          updateCartUI();

          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span>COPY CODE</span>';
            copyBtn.classList.remove('btn-success');
          }, 3000);
        }).catch(() => {
          showToast(`Use coupon code PAYDAY30 for 30% off!`, '🎟️');
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // 10. PRODUCT QUICK VIEW MODAL
  // --------------------------------------------------------------------------
  let selectedQuickViewProduct = null;
  let selectedSize = null;
  let selectedColor = null;

  function initQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.getElementById('closeQuickView');
    const addToBagBtn = document.getElementById('qvAddToBagBtn');
    const wishlistBtn = document.getElementById('qvWishlistBtn');
    const qtyInput = document.getElementById('qvQtyInput');
    const qtyMinus = document.getElementById('qvQtyMinus');
    const qtyPlus = document.getElementById('qvQtyPlus');

    if (!modal) return;

    function openQuickView(productKey) {
      const product = PRODUCTS_CATALOG[productKey];
      if (!product) return;

      selectedQuickViewProduct = product;
      selectedSize = product.sizes[0];
      selectedColor = product.colors[0].name;

      // Populate Elements
      document.getElementById('qvImage').src = product.image;
      document.getElementById('qvImage').alt = product.name;
      document.getElementById('qvBadge').textContent = product.badge;
      document.getElementById('qvTitle').textContent = product.name;
      document.getElementById('qvSubtitle').textContent = product.subtitle;
      document.getElementById('qvPrice').textContent = `$${product.price.toFixed(2)}`;
      document.getElementById('qvOriginalPrice').textContent = `$${product.originalPrice.toFixed(2)}`;
      document.getElementById('qvDescription').textContent = product.description;
      document.getElementById('qvReviews').textContent = `(${product.reviews} Customer Reviews)`;

      // Render Sizes
      const sizesContainer = document.getElementById('qvSizesContainer');
      sizesContainer.innerHTML = '';
      product.sizes.forEach((size, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `size-pill ${idx === 0 ? 'active' : ''}`;
        btn.textContent = size;
        btn.addEventListener('click', () => {
          sizesContainer.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedSize = size;
        });
        sizesContainer.appendChild(btn);
      });

      // Render Colors
      const colorsContainer = document.getElementById('qvColorsContainer');
      colorsContainer.innerHTML = '';
      product.colors.forEach((col, idx) => {
        const swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = `color-swatch ${idx === 0 ? 'active' : ''}`;
        swatch.style.backgroundColor = col.hex;
        swatch.title = col.name;
        swatch.setAttribute('aria-label', col.name);
        swatch.addEventListener('click', () => {
          colorsContainer.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          selectedColor = col.name;
        });
        colorsContainer.appendChild(swatch);
      });

      // Reset Quantity
      if (qtyInput) qtyInput.value = 1;

      // Update wishlist heart button in modal
      const isWishlisted = State.wishlist.includes(product.id);
      if (wishlistBtn) {
        wishlistBtn.innerHTML = isWishlisted 
          ? '<i class="fa-solid fa-heart text-danger"></i>' 
          : '<i class="fa-regular fa-heart"></i>';
      }

      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    // Modal listeners
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Quantity selectors
    qtyMinus?.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });

    qtyPlus?.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val < 10) qtyInput.value = val + 1;
    });

    // Add to Bag action from Quick View
    addToBagBtn?.addEventListener('click', () => {
      if (!selectedQuickViewProduct) return;
      const qty = parseInt(qtyInput.value, 10) || 1;

      addToCart({
        id: selectedQuickViewProduct.id,
        name: selectedQuickViewProduct.name,
        price: selectedQuickViewProduct.price,
        image: selectedQuickViewProduct.image,
        size: selectedSize,
        color: selectedColor,
        qty: qty
      });

      closeModal();
      openCartDrawer();
      showToast(`${selectedQuickViewProduct.name} (${selectedSize}) added to your Bag!`, '🛍️');
    });

    // Wishlist button inside Quick View
    wishlistBtn?.addEventListener('click', () => {
      if (!selectedQuickViewProduct) return;
      toggleWishlist(selectedQuickViewProduct.id);
      const isWishlisted = State.wishlist.includes(selectedQuickViewProduct.id);
      wishlistBtn.innerHTML = isWishlisted 
        ? '<i class="fa-solid fa-heart text-danger"></i>' 
        : '<i class="fa-regular fa-heart"></i>';
    });

    // Attach trigger listeners to all Quick View buttons across page
    document.querySelectorAll('[data-quick-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-quick-view');
        openQuickView(key);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 11. SHOPPING BAG / CART DRAWER SYSTEM
  // --------------------------------------------------------------------------
  function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    drawer.classList.add('is-open');
    overlay?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    drawer?.classList.remove('is-open');
    overlay?.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function addToCart(item) {
    const existing = State.cart.find(i => i.id === item.id && i.size === item.size && i.color === item.color);
    if (existing) {
      existing.qty += item.qty;
    } else {
      State.cart.push(item);
    }
    saveCart();
  }

  function updateCartUI() {
    const totalCount = State.cart.reduce((sum, item) => sum + item.qty, 0);
    const navBadges = document.querySelectorAll('#navCartBadge, #cartCountBadge');
    navBadges.forEach(b => {
      b.textContent = totalCount;
      if (totalCount > 0) {
        b.classList.add('has-items');
      } else {
        b.classList.remove('has-items');
      }
    });

    const itemsContainer = document.getElementById('cartItemsContainer');
    const cartFooter = document.getElementById('cartFooter');
    if (!itemsContainer) return;

    if (State.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty text-center py-5">
          <div class="empty-icon mb-3"><i class="fa-solid fa-bag-shopping fa-3x text-muted"></i></div>
          <h5>Your Bag is Empty</h5>
          <p class="text-muted">Looks like you haven't added any chic styles yet.</p>
          <a href="#CATALOGUE" class="btn btn-dark mt-2" onclick="document.getElementById('closeCartBtn').click()">EXPLORE CATALOGUE</a>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (cartFooter) cartFooter.style.display = 'block';

    let subtotal = 0;
    let html = '<div class="cart-items-list">';
    State.cart.forEach((item, index) => {
      const lineTotal = item.price * item.qty;
      subtotal += lineTotal;
      html += `
        <div class="cart-item d-flex align-items-center gap-3">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details flex-grow-1">
            <h6 class="cart-item-title mb-1">${item.name}</h6>
            <div class="cart-item-meta text-muted mb-2">Size: <strong>${item.size}</strong> | Color: <strong>${item.color}</strong></div>
            <div class="cart-item-price-row d-flex align-items-center justify-content-between">
              <div class="cart-item-qty d-flex align-items-center">
                <button class="cart-qty-btn" data-action="minus" data-index="${index}">-</button>
                <span class="cart-qty-num">${item.qty}</span>
                <button class="cart-qty-btn" data-action="plus" data-index="${index}">+</button>
              </div>
              <span class="cart-item-price">$${lineTotal.toFixed(2)}</span>
            </div>
          </div>
          <button class="cart-remove-btn" data-action="remove" data-index="${index}" title="Remove item">&times;</button>
        </div>
      `;
    });
    html += '</div>';
    itemsContainer.innerHTML = html;

    // Attach cart item quantity & remove triggers
    itemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (action === 'minus') {
          if (State.cart[idx].qty > 1) {
            State.cart[idx].qty -= 1;
          } else {
            State.cart.splice(idx, 1);
          }
        } else if (action === 'plus') {
          State.cart[idx].qty += 1;
        }
        saveCart();
      });
    });

    itemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const removed = State.cart.splice(idx, 1);
        saveCart();
        if (removed.length) showToast(`Removed ${removed[0].name} from Bag`, '🗑️');
      });
    });

    // Subtotal & Discount calculations
    const discountAmount = subtotal * (State.discountPercent / 100);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const subtotalEl = document.getElementById('cartSubtotal');
    const discountRow = document.getElementById('cartDiscountRow');
    const discountEl = document.getElementById('cartDiscount');
    const discountPercentEl = document.getElementById('discountPercent');
    const totalEl = document.getElementById('cartTotal');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    if (State.discountPercent > 0 && discountRow) {
      discountRow.style.setProperty('display', 'flex', 'important');
      if (discountPercentEl) discountPercentEl.textContent = `${State.discountPercent}%`;
      if (discountEl) discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    } else if (discountRow) {
      discountRow.style.setProperty('display', 'none', 'important');
    }

    if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;
  }

  function initCartDrawer() {
    const openBtn = document.getElementById('navCartBtn');
    const closeBtn = document.getElementById('closeCartBtn');
    const overlay = document.getElementById('cartOverlay');
    const applyPromoBtn = document.getElementById('btnApplyPromo');
    const promoInput = document.getElementById('cartPromoInput');
    const promoFeedback = document.getElementById('promoFeedback');
    const checkoutBtn = document.getElementById('btnCheckout');

    openBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });

    const heroViewBagBtn = document.getElementById('heroViewBagBtn');
    heroViewBagBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });

    closeBtn?.addEventListener('click', closeCartDrawer);
    overlay?.addEventListener('click', closeCartDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCartDrawer();
    });

    // Promo code apply in cart
    applyPromoBtn?.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) return;

      if (code === 'PAYDAY30' || code === 'FASHION30') {
        State.discountPercent = 30;
        State.activeCoupon = code;
        saveCart();
        if (promoFeedback) {
          promoFeedback.className = 'promo-feedback text-success mt-1';
          promoFeedback.innerHTML = `<i class="fa-solid fa-check"></i> Code <strong>${code}</strong> applied! 30% savings unlocked.`;
        }
        showToast(`Promo ${code} applied successfully! 🎉`, '🎟️');
      } else {
        if (promoFeedback) {
          promoFeedback.className = 'promo-feedback text-danger mt-1';
          promoFeedback.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Invalid promo code. Try <strong>PAYDAY30</strong>`;
        }
      }
    });

    // Checkout button
    checkoutBtn?.addEventListener('click', () => {
      if (State.cart.length === 0) return;
      closeCartDrawer();
      showToast('Thank you for shopping! Proceeding to Demo Secure Payment Gateway...', '💳');
      setTimeout(() => {
        State.cart = [];
        saveCart();
        showToast('Order confirmed! Tracking details sent to your email. 🎉', '📦');
      }, 2500);
    });

    updateCartUI();
  }

  // --------------------------------------------------------------------------
  // 12. WISHLIST SYSTEM
  // --------------------------------------------------------------------------
  function toggleWishlist(productId) {
    const idx = State.wishlist.indexOf(productId);
    if (idx > -1) {
      State.wishlist.splice(idx, 1);
      showToast('Removed from your Wishlist', '🤍');
    } else {
      State.wishlist.push(productId);
      showToast('Saved to your Wishlist! ❤️', '❤️');
    }
    saveWishlist();
  }

  function updateWishlistUI() {
    const badge = document.getElementById('navWishlistBadge');
    if (badge) {
      badge.textContent = State.wishlist.length;
      badge.classList.toggle('has-items', State.wishlist.length > 0);
    }

    // Update all heart buttons on page
    document.querySelectorAll('[data-wishlist]').forEach(btn => {
      const id = btn.getAttribute('data-wishlist');
      const isWishlisted = State.wishlist.includes(id);
      btn.innerHTML = isWishlisted 
        ? '<i class="fa-solid fa-heart text-danger"></i>' 
        : '<i class="fa-regular fa-heart"></i>';
    });
  }

  function initWishlist() {
    document.querySelectorAll('[data-wishlist]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-wishlist');
        toggleWishlist(id);
      });
    });

    const navWishlistBtn = document.getElementById('navWishlistBtn');
    navWishlistBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(`You have ${State.wishlist.length} item(s) in your Wishlist. Click on any item to view details!`, '❤️');
    });

    updateWishlistUI();
  }

  // --------------------------------------------------------------------------
  // 13. NEWSLETTER REAL-TIME VALIDATION & ANIMATIONS (From Aurelia)
  // --------------------------------------------------------------------------
  function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('userEmail');
    const emailWrapper = emailInput?.closest('.newsletter-input-wrapper');
    const emailMessage = document.getElementById('emailMessage');
    const submitBtn = document.getElementById('newsletterBtn');
    const btnText = submitBtn?.querySelector('.btn-text');

    if (!form || !emailInput) return;

    function validateEmail(email) {
      return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email);
    }

    function clearValidation() {
      emailWrapper?.classList.remove('is-valid', 'is-invalid', 'is-checking', 'shake');
      if (emailMessage) {
        emailMessage.textContent = '';
        emailMessage.className = 'email-message';
      }
    }

    // Real-time input checking
    emailInput.addEventListener('input', () => {
      const email = emailInput.value.trim();
      if (!email) {
        clearValidation();
        return;
      }

      if (validateEmail(email)) {
        emailWrapper?.classList.add('is-valid');
        emailWrapper?.classList.remove('is-invalid');
        if (emailMessage) {
          emailMessage.textContent = 'Valid email address recognized.';
          emailMessage.className = 'email-message show-success';
        }
      } else {
        emailWrapper?.classList.remove('is-valid');
      }
    });

    // Submission with shake animation & state transitions
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!validateEmail(email)) {
        emailWrapper?.classList.remove('is-valid');
        emailWrapper?.classList.remove('shake');
        void emailWrapper?.offsetWidth; // Trigger DOM reflow for CSS animation
        emailWrapper?.classList.add('shake', 'is-invalid');

        if (emailMessage) {
          emailMessage.textContent = 'Please enter a valid email address.';
          emailMessage.className = 'email-message show-error';
        }
        emailInput.focus();
        return;
      }

      // Start loading simulation
      clearValidation();
      emailWrapper?.classList.add('is-checking');
      emailInput.disabled = true;

      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        if (btnText) btnText.textContent = 'JOINING...';
      }

      setTimeout(() => {
        emailWrapper?.classList.remove('is-checking');
        emailWrapper?.classList.add('is-valid');

        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.classList.add('is-success');
          if (btnText) btnText.textContent = 'WELCOME!';
        }

        if (emailMessage) {
          emailMessage.textContent = 'Success! Welcome to the FASHION VIP Shopping Club. Check your inbox for your 30% discount code.';
          emailMessage.className = 'email-message show-success';
        }

        showToast('Welcome to the VIP Club! Your 30% promo code has been dispatched. 🎉', '💌');

        setTimeout(() => {
          emailInput.disabled = false;
          emailInput.value = '';
          clearValidation();
          if (submitBtn) {
            submitBtn.classList.remove('is-success');
            if (btnText) btnText.textContent = 'SEND';
          }
        }, 4500);
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 14. SMOOTH SCROLL & BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 15. BRAND LOGO INFINITE MARQUEE ENHANCER
  // --------------------------------------------------------------------------
  function initLogoMarquee() {
    const wrapper = document.querySelector('.logo-wrapper');
    if (!wrapper) return;

    // Clone logos for seamless infinite marquee scroll
    const items = Array.from(wrapper.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      wrapper.appendChild(clone);
    });
  }

  // --------------------------------------------------------------------------
  // DOM READY INITIALIZATION
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeaderAndNav();
    initCustomCursor();
    initScrollReveal();
    initCounters();
    initPaydaySale();
    initQuickViewModal();
    initCartDrawer();
    initWishlist();
    initNewsletter();
    initBackToTop();
    initLogoMarquee();
  });

})();
