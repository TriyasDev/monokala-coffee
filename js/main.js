import {
  THEME_STORAGE_KEY,
  resolveTheme,
  toggleTheme,
  normalizeCategory,
  matchesCategory,
  formatUserInitials,
  getFirstName,
  personalizeWhatsAppMessage,
  buildWhatsAppUrl,
  getNextLightboxIndex,
} from './logic.js';
import { initFirebaseAuth, signInWithGoogle, signOutUser } from './auth.js';

const WA_PHONE = '6281200000000';
const SAVED_EVENTS_KEY = 'monokala_saved_events';
const LOCAL_MEMBER_KEY = 'monokala_local_member';

const EVENT_CATALOG = {
  'monobar-persib-persija': {
    title: 'Monobar: Persib vs Persija',
    date: 'Sabtu, 23 Mei 2026',
  },
  'sunday-run-chill': {
    title: 'Sunday Run & Chill 5K',
    date: 'Minggu, 24 Mei 2026',
  },
  'color-expert-class': {
    title: 'Color Expert Class',
    date: 'Sabtu, 30 Mei 2026',
  },
  'monotalk-5-karier': {
    title: 'Monotalk #5: Kerja Santai Tapi Jalan Terus',
    date: 'Jumat, 5 Juni 2026',
  },
  'monobar-spanyol-argentina': {
    title: 'Monobar: Spanyol vs Argentina',
    date: 'Minggu, 14 Juni 2026',
  },
};

if (navigator.connection && navigator.connection.saveData) {
  document.documentElement.dataset.saveData = 'true';
}

let currentGoogleUser = null;

function getSavedEventIds() {
  try {
    const raw = localStorage.getItem(SAVED_EVENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setSavedEventIds(ids) {
  try {
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage errors
  }
}

function getLocalMember() {
  try {
    const raw = localStorage.getItem(LOCAL_MEMBER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocalMember(member) {
  try {
    if (member) {
      localStorage.setItem(LOCAL_MEMBER_KEY, JSON.stringify(member));
    } else {
      localStorage.removeItem(LOCAL_MEMBER_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

function getActiveMemberName() {
  if (currentGoogleUser) {
    return currentGoogleUser.displayName || getFirstName(currentGoogleUser.displayName, currentGoogleUser.email);
  }
  const localMember = getLocalMember();
  return localMember && localMember.name ? localMember.name : '';
}

// 0. Light / Dark Theme Switcher
function initThemeSwitcher() {
  const toggleBtn = document.querySelector('[data-theme-toggle]');
  const moonIcon = document.querySelector('[data-theme-icon="moon"]');
  const sunIcon = document.querySelector('[data-theme-icon="sun"]');
  const labelEl = document.querySelector('[data-theme-label]');

  const applyTheme = (theme, persist = true) => {
    const resolved = resolveTheme(theme);
    document.documentElement.dataset.theme = resolved;

    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, resolved);
      } catch {
        // Ignore storage errors
      }
    }

    const isDark = resolved === 'dark';
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', String(isDark));
      toggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'
      );
    }
    if (moonIcon) moonIcon.hidden = isDark;
    if (sunIcon) sunIcon.hidden = !isDark;
    if (labelEl) labelEl.textContent = isDark ? 'Light' : 'Dark';
  };

  let initialTheme = document.documentElement.dataset.theme;
  if (!initialTheme) {
    try {
      initialTheme = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      initialTheme = 'light';
    }
  }
  applyTheme(initialTheme, false);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = toggleTheme(document.documentElement.dataset.theme);
      applyTheme(next, true);
    });
  }

  window.addEventListener('storage', (event) => {
    if (event.key === THEME_STORAGE_KEY && event.newValue) {
      applyTheme(event.newValue, false);
    }
  });
}

// 1. Mobile Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.querySelector('[data-nav-toggle]');
  const drawer = document.querySelector('#mobile-nav');
  if (!toggleBtn || !drawer) return;

  const setOpen = (isOpen) => {
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    drawer.hidden = !isOpen;
  };

  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    setOpen(!expanded);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggleBtn.focus();
    }
  });
}

// 2. Category Filters (Product & Moments)
function initCategoryFilters() {
  const filterGroup = document.querySelector('[data-filter-group]');
  if (!filterGroup) return;

  const productGrid = document.querySelector('[data-product-grid]');
  const galleryGrid = document.querySelector('[data-gallery-grid]');
  const grid = productGrid || galleryGrid;
  if (!grid) return;

  const countEl = document.querySelector('[data-product-count], [data-moments-count]');
  const emptyEl = document.querySelector('[data-product-empty], [data-moments-empty]');
  const items = Array.from(grid.querySelectorAll('[data-filter-item]'));

  const applyFilter = (selectedCategory) => {
    filterGroup.querySelectorAll('[data-filter]').forEach((btn) => {
      const active = normalizeCategory(btn.getAttribute('data-filter')) === normalizeCategory(selectedCategory);
      btn.setAttribute('aria-pressed', String(active));
    });

    let visibleCount = 0;
    items.forEach((item) => {
      const matched = matchesCategory(item.getAttribute('data-category'), selectedCategory);
      item.hidden = !matched;
      if (matched) visibleCount += 1;
    });

    if (countEl) countEl.textContent = `Menampilkan ${visibleCount} item`;
    if (emptyEl) emptyEl.hidden = visibleCount > 0;
  };

  filterGroup.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-filter]');
    if (!btn) return;
    applyFilter(btn.getAttribute('data-filter'));
  });
}

// 3. Event Tabs (Upcoming / Past) & Category Filter
function initEventExplorer() {
  const tabBar = document.querySelector('[data-event-tabs]');
  const categoryBar = document.querySelector('[data-event-categories]');
  const eventList = document.querySelector('[data-event-list]');
  if (!tabBar || !eventList) return;

  const tabs = Array.from(tabBar.querySelectorAll('[role="tab"]'));
  const cards = Array.from(eventList.querySelectorAll('[data-event-item]'));
  const countEl = document.querySelector('[data-event-count]');
  const emptyEl = document.querySelector('[data-event-empty]');

  let activeStatus = 'upcoming';
  let activeCategory = 'all';

  const updateVisibility = () => {
    tabs.forEach((tab) => {
      const selected = tab.getAttribute('data-tab') === activeStatus;
      tab.setAttribute('aria-selected', String(selected));
    });

    let visibleCount = 0;
    cards.forEach((card) => {
      const statusOk = card.getAttribute('data-status') === activeStatus;
      const categoryOk = matchesCategory(card.getAttribute('data-category'), activeCategory);
      const visible = statusOk && categoryOk;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (countEl) {
      const label = activeStatus === 'upcoming' ? 'event mendatang' : 'event terdahulu';
      countEl.textContent = `Menampilkan ${visibleCount} ${label}`;
    }
    if (emptyEl) emptyEl.hidden = visibleCount > 0;
  };

  tabBar.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-tab]');
    if (!tab) return;
    activeStatus = tab.getAttribute('data-tab') || 'upcoming';
    updateVisibility();
  });

  if (categoryBar) {
    categoryBar.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-category-filter]');
      if (!btn) return;
      activeCategory = btn.getAttribute('data-category-filter') || 'all';
      categoryBar.querySelectorAll('[data-category-filter]').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === btn));
      });
      updateVisibility();
    });
  }

  updateVisibility();
}

// 4. Save Event Toggle Buttons on Event Page
function initSaveEventButtons() {
  const buttons = Array.from(document.querySelectorAll('[data-save-event]'));
  if (buttons.length === 0) return;

  const syncButtons = () => {
    const saved = getSavedEventIds();
    buttons.forEach((btn) => {
      const eventId = btn.getAttribute('data-save-event');
      const isSaved = saved.includes(eventId);
      btn.setAttribute('aria-pressed', String(isSaved));
      btn.textContent = isSaved ? 'Saved' : 'Save Event';
    });
  };

  syncButtons();

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventId = btn.getAttribute('data-save-event');
      if (!eventId) return;
      const saved = getSavedEventIds();
      const next = saved.includes(eventId)
        ? saved.filter((id) => id !== eventId)
        : [...saved, eventId];
      setSavedEventIds(next);
      syncButtons();
    });
  });
}

// 5. WhatsApp Links (hardcoded wa.me + encodeURIComponent + signed-in prefill)
function syncWhatsAppLinks() {
  const userName = getActiveMemberName();

  document.querySelectorAll('[data-wa-event]').forEach((link) => {
    const eventName = link.getAttribute('data-wa-event') || 'Event Monokala';
    const eventDate = link.getAttribute('data-wa-date') || '';
    const dateSuffix = eventDate ? ` (${eventDate})` : '';
    const baseMsg = `Halo Monokala! Saya mau daftar event ${eventName}${dateSuffix}. Apakah kuota masih tersedia?`;
    const finalMsg = personalizeWhatsAppMessage(baseMsg, userName);
    link.setAttribute('href', buildWhatsAppUrl(WA_PHONE, finalMsg));
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  document.querySelectorAll('[data-wa-general]').forEach((link) => {
    const baseMsg = 'Halo Monokala! Saya mau tanya info menu dan jadwal kumpul di Monokala Coffee.';
    const finalMsg = personalizeWhatsAppMessage(baseMsg, userName);
    link.setAttribute('href', buildWhatsAppUrl(WA_PHONE, finalMsg));
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  document.querySelectorAll('[data-wa-partner]').forEach((link) => {
    const baseMsg = 'Halo Monokala! Saya tertarik kolaborasi bikin event komunitas di Monokala Coffee.';
    const finalMsg = personalizeWhatsAppMessage(baseMsg, userName);
    link.setAttribute('href', buildWhatsAppUrl(WA_PHONE, finalMsg));
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

// 6. Moments Lightbox
function initLightbox() {
  const lightbox = document.querySelector('#moments-lightbox');
  const gallery = document.querySelector('[data-gallery-grid]');
  if (!lightbox || !gallery) return;

  const imgEl = lightbox.querySelector('[data-lightbox-img]');
  const titleEl = lightbox.querySelector('[data-lightbox-title]');
  const captionEl = lightbox.querySelector('[data-lightbox-caption]');
  const closeBtn = lightbox.querySelector('[data-lightbox-close]');
  const prevBtn = lightbox.querySelector('[data-lightbox-prev]');
  const nextBtn = lightbox.querySelector('[data-lightbox-next]');

  let activeTrigger = null;
  let activeIndex = 0;

  const getVisibleTriggers = () =>
    Array.from(gallery.querySelectorAll('[data-lightbox-trigger]')).filter((el) => !el.hidden);

  const renderAt = (index) => {
    const triggers = getVisibleTriggers();
    if (triggers.length === 0) return;
    activeIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[activeIndex];

    const src = trigger.getAttribute('data-full-src') || '';
    const title = trigger.getAttribute('data-full-title') || '';
    const alt = trigger.getAttribute('data-full-alt') || title;
    const caption = trigger.getAttribute('data-full-caption') || '';

    if (imgEl) {
      imgEl.setAttribute('src', src);
      imgEl.setAttribute('alt', alt);
    }
    if (titleEl) titleEl.textContent = title;
    if (captionEl) captionEl.textContent = `${caption} (${activeIndex + 1}/${triggers.length})`;
  };

  const openAt = (trigger) => {
    const triggers = getVisibleTriggers();
    activeTrigger = trigger;
    renderAt(triggers.indexOf(trigger));
    lightbox.hidden = false;
    if (closeBtn) closeBtn.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    if (activeTrigger) activeTrigger.focus();
  };

  gallery.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-lightbox-trigger]');
    if (!trigger) return;
    openAt(trigger);
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const triggers = getVisibleTriggers();
      renderAt(getNextLightboxIndex(activeIndex, triggers.length, 'prev'));
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const triggers = getVisibleTriggers();
      renderAt(getNextLightboxIndex(activeIndex, triggers.length, 'next'));
    });
  }

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    const triggers = getVisibleTriggers();
    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      renderAt(getNextLightboxIndex(activeIndex, triggers.length, 'prev'));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      renderAt(getNextLightboxIndex(activeIndex, triggers.length, 'next'));
    }
  });
}

// 7. Member Page Dashboard Interop (login.html)
function renderSavedEventsList() {
  const listEl = document.querySelector('[data-saved-events-list]');
  if (!listEl) return;

  while (listEl.firstChild) {
    listEl.removeChild(listEl.firstChild);
  }

  const savedIds = getSavedEventIds();
  if (savedIds.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'saved-event-item';
    const text = document.createElement('span');
    text.textContent = 'Belum ada event tersimpan. Pilih "Save Event" di halaman Event.';
    emptyLi.appendChild(text);
    listEl.appendChild(emptyLi);
    return;
  }

  const userName = getActiveMemberName();

  savedIds.forEach((id) => {
    const info = EVENT_CATALOG[id] || { title: id, date: '' };
    const li = document.createElement('li');
    li.className = 'saved-event-item';

    const metaDiv = document.createElement('div');
    const titleSpan = document.createElement('div');
    titleSpan.className = 'saved-event-title';
    titleSpan.textContent = info.title;
    metaDiv.appendChild(titleSpan);

    if (info.date) {
      const dateSpan = document.createElement('div');
      dateSpan.className = 'gallery-sub';
      dateSpan.textContent = info.date;
      metaDiv.appendChild(dateSpan);
    }

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'btn-group';

    const waLink = document.createElement('a');
    waLink.className = 'btn btn-accent btn-sm';
    const msg = personalizeWhatsAppMessage(
      `Halo Monokala! Saya mau daftar event ${info.title}.`,
      userName
    );
    waLink.setAttribute('href', buildWhatsAppUrl(WA_PHONE, msg));
    waLink.setAttribute('target', '_blank');
    waLink.setAttribute('rel', 'noopener noreferrer');
    waLink.textContent = 'Join via WA';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-outline btn-sm';
    removeBtn.setAttribute('type', 'button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      const next = getSavedEventIds().filter((item) => item !== id);
      setSavedEventIds(next);
      renderSavedEventsList();
    });

    actionsDiv.appendChild(waLink);
    actionsDiv.appendChild(removeBtn);

    li.appendChild(metaDiv);
    li.appendChild(actionsDiv);
    listEl.appendChild(li);
  });
}

function syncLoginPageDashboard() {
  const authCard = document.querySelector('#auth-card');
  const dashboard = document.querySelector('#member-dashboard');
  if (!authCard || !dashboard) return;

  const memberNameEl = dashboard.querySelector('[data-member-name]');
  const memberEmailEl = dashboard.querySelector('[data-member-email]');

  const activeUser = currentGoogleUser
    ? {
        name: currentGoogleUser.displayName || getFirstName('', currentGoogleUser.email),
        email: currentGoogleUser.email || '',
      }
    : getLocalMember();

  if (activeUser) {
    authCard.hidden = true;
    dashboard.hidden = false;
    if (memberNameEl) memberNameEl.textContent = activeUser.name || 'Member Monokala';
    if (memberEmailEl) memberEmailEl.textContent = activeUser.email || '';
    renderSavedEventsList();
  } else {
    authCard.hidden = false;
    dashboard.hidden = true;
  }
}

function initMemberPageForms() {
  const authCard = document.querySelector('#auth-card');
  const dashboard = document.querySelector('#member-dashboard');
  if (!authCard || !dashboard) return;

  const tabBtns = Array.from(authCard.querySelectorAll('[data-auth-tab]'));
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');
  const loginError = document.querySelector('#login-error');
  const registerError = document.querySelector('#register-error');
  const demoFillBtn = document.querySelector('[data-demo-fill]');
  const logoutBtn = dashboard.querySelector('[data-logout-btn]');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-auth-tab');
      tabBtns.forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      if (loginForm) loginForm.hidden = target !== 'login';
      if (registerForm) registerForm.hidden = target !== 'register';
    });
  });

  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', () => {
      const emailInput = document.querySelector('#login-email');
      const passInput = document.querySelector('#login-password');
      if (emailInput) emailInput.value = 'member@monokala.id';
      if (passInput) passInput.value = 'monokala2026';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = (document.querySelector('#login-email')?.value || '').trim();
      const pass = (document.querySelector('#login-password')?.value || '').trim();
      if (!email || pass.length < 6) {
        if (loginError) {
          loginError.textContent = 'Masukkan email valid dan password minimal 6 karakter.';
          loginError.hidden = false;
        }
        return;
      }
      if (loginError) loginError.hidden = true;
      setLocalMember({ name: getFirstName('', email), email });
      syncLoginPageDashboard();
      syncWhatsAppLinks();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = (document.querySelector('#register-name')?.value || '').trim();
      const email = (document.querySelector('#register-email')?.value || '').trim();
      const pass = (document.querySelector('#register-password')?.value || '').trim();
      if (!name || !email || pass.length < 6) {
        if (registerError) {
          registerError.textContent = 'Lengkapi nama, email valid, dan password minimal 6 karakter.';
          registerError.hidden = false;
        }
        return;
      }
      if (registerError) registerError.hidden = true;
      setLocalMember({ name, email });
      syncLoginPageDashboard();
      syncWhatsAppLinks();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      setLocalMember(null);
      if (currentGoogleUser) {
        await signOutUser();
      }
      syncLoginPageDashboard();
      syncWhatsAppLinks();
    });
  }

  syncLoginPageDashboard();
}

// 8. Navbar Firebase Google OAuth UI
function initAuthUI() {
  const authRoot = document.querySelector('[data-auth-root]');
  if (!authRoot) return;

  const signInBtn = authRoot.querySelector('[data-auth-signin]');
  const profileBox = authRoot.querySelector('[data-auth-profile]');
  const menuToggle = authRoot.querySelector('[data-auth-menu-toggle]');
  const dropdown = authRoot.querySelector('[data-auth-dropdown]');
  const avatarImg = authRoot.querySelector('[data-auth-avatar]');
  const initialsEl = authRoot.querySelector('[data-auth-initials]');
  const shortNameEl = authRoot.querySelector('[data-auth-name]');
  const fullNameEl = authRoot.querySelector('[data-auth-full-name]');
  const emailEl = authRoot.querySelector('[data-auth-email]');
  const signOutBtn = authRoot.querySelector('[data-auth-signout]');
  const pageGoogleBtn = document.querySelector('[data-page-google-signin]');
  const mobileAuthLabel = document.querySelector('[data-auth-nav-label]');
  const feedbackEl = document.querySelector('[data-auth-feedback]');
  const feedbackTextEl = document.querySelector('[data-auth-feedback-text]');
  const feedbackCloseBtn = document.querySelector('[data-auth-feedback-close]');

  const showFeedback = (message) => {
    if (!feedbackEl || !feedbackTextEl) return;
    feedbackTextEl.textContent = message;
    feedbackEl.hidden = false;
  };

  const hideFeedback = () => {
    if (!feedbackEl) return;
    feedbackEl.hidden = true;
  };

  if (feedbackCloseBtn) {
    feedbackCloseBtn.addEventListener('click', hideFeedback);
  }

  const setDropdownOpen = (isOpen) => {
    if (!menuToggle || !dropdown) return;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    dropdown.hidden = !isOpen;
  };

  const renderUserState = (user) => {
    currentGoogleUser = user || null;

    if (user) {
      const displayName = user.displayName || '';
      const email = user.email || '';
      const firstName = getFirstName(displayName, email);
      const initials = formatUserInitials(displayName, email);

      if (signInBtn) signInBtn.hidden = true;
      if (profileBox) profileBox.hidden = false;
      if (shortNameEl) shortNameEl.textContent = firstName;
      if (fullNameEl) fullNameEl.textContent = displayName || firstName;
      if (emailEl) emailEl.textContent = email;
      if (initialsEl) initialsEl.textContent = initials;
      if (mobileAuthLabel) mobileAuthLabel.textContent = `Member (${firstName})`;

      if (avatarImg && user.photoURL) {
        avatarImg.setAttribute('src', user.photoURL);
        avatarImg.setAttribute('alt', `Foto profil ${displayName || firstName}`);
        avatarImg.hidden = false;
        if (initialsEl) initialsEl.hidden = true;
        avatarImg.addEventListener(
          'error',
          () => {
            avatarImg.hidden = true;
            if (initialsEl) initialsEl.hidden = false;
          },
          { once: true }
        );
      } else {
        if (avatarImg) avatarImg.hidden = true;
        if (initialsEl) initialsEl.hidden = false;
      }

      setDropdownOpen(false);
    } else {
      if (signInBtn) signInBtn.hidden = false;
      if (profileBox) profileBox.hidden = true;
      if (mobileAuthLabel) mobileAuthLabel.textContent = 'Member Pass';
      if (avatarImg) {
        avatarImg.setAttribute('src', '');
        avatarImg.hidden = true;
      }
      setDropdownOpen(false);
    }

    syncWhatsAppLinks();
    syncLoginPageDashboard();
  };

  const handleGoogleSignIn = async (triggerBtn) => {
    hideFeedback();
    if (triggerBtn) triggerBtn.disabled = true;
    try {
      await signInWithGoogle();
    } catch (err) {
      const code = err && err.code ? err.code : '';
      if (code === 'auth/popup-blocked') {
        showFeedback('Popup login diblokir oleh browser. Izinkan popup untuk masuk dengan Google.');
      } else if (code === 'auth/popup-closed-by-user') {
        showFeedback('Login Google dibatalkan sebelum selesai.');
      } else if (code === 'auth/unauthorized-domain') {
        showFeedback('Domain ini belum terdaftar di Firebase Authorized Domains.');
      } else {
        showFeedback('Gagal masuk dengan Google. Silakan coba beberapa saat lagi.');
      }
    } finally {
      if (triggerBtn) triggerBtn.disabled = false;
    }
  };

  if (menuToggle && dropdown) {
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setDropdownOpen(!expanded);
    });

    document.addEventListener('click', (event) => {
      if (!dropdown.hidden && !authRoot.contains(event.target)) {
        setDropdownOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !dropdown.hidden) {
        setDropdownOpen(false);
        menuToggle.focus();
      }
    });
  }

  if (signInBtn) {
    signInBtn.addEventListener('click', () => handleGoogleSignIn(signInBtn));
  }

  if (pageGoogleBtn) {
    pageGoogleBtn.addEventListener('click', () => handleGoogleSignIn(pageGoogleBtn));
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      hideFeedback();
      try {
        await signOutUser();
        setDropdownOpen(false);
      } catch {
        showFeedback('Gagal keluar dari akun. Silakan coba lagi.');
      }
    });
  }

  initFirebaseAuth(renderUserState).catch(() => {
    if (signInBtn) {
      signInBtn.disabled = true;
      signInBtn.setAttribute('title', 'Layanan login Google sedang tidak tersedia');
    }
  });
}

// 9. Service Worker Registration
function initServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ignore registration error in restricted preview contexts
    });
  }
}

initThemeSwitcher();
initMobileNav();
initCategoryFilters();
initEventExplorer();
initSaveEventButtons();
syncWhatsAppLinks();
initLightbox();
initMemberPageForms();
initAuthUI();
initServiceWorker();
