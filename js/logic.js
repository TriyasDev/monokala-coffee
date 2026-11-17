const WA_HOST = 'https://wa.me/';
export const THEME_STORAGE_KEY = 'monokala_theme';

export function resolveTheme(value) {
  return value === 'dark' ? 'dark' : 'light';
}

export function toggleTheme(currentTheme) {
  return resolveTheme(currentTheme) === 'dark' ? 'light' : 'dark';
}

export function normalizeCategory(value) {
  return String(value || 'all').trim().toLowerCase();
}

export function matchesCategory(itemCategory, selectedCategory) {
  const selected = normalizeCategory(selectedCategory);
  if (selected === 'all' || selected === '') {
    return true;
  }
  return normalizeCategory(itemCategory) === selected;
}

export function filterEventItems(items, { status = 'upcoming', category = 'all' } = {}) {
  const targetStatus = normalizeCategory(status);
  return items.filter((item) => {
    const statusOk = normalizeCategory(item.status) === targetStatus;
    const categoryOk = matchesCategory(item.category, category);
    return statusOk && categoryOk;
  });
}

export function formatUserInitials(displayName, email) {
  const source = String(displayName || '').trim() || String(email || '').trim();
  if (!source) return 'M';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function getFirstName(displayName, email) {
  const name = String(displayName || '').trim();
  if (name) {
    return name.split(/\s+/)[0];
  }
  const mail = String(email || '').trim();
  if (mail && mail.includes('@')) {
    return mail.split('@')[0];
  }
  return 'Member';
}

export function personalizeWhatsAppMessage(baseMessage, userName) {
  const message = String(baseMessage || '').trim();
  const cleanName = String(userName || '').trim();
  if (!cleanName) {
    return message;
  }
  if (/^Halo Monokala!\s*Saya\s+/i.test(message)) {
    return message.replace(/^Halo Monokala!\s*Saya\s+/i, `Halo Monokala! Saya ${cleanName} `);
  }
  return `${message} (Atas nama: ${cleanName})`;
}

export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone || '').replace(/\D+/g, '');
  const cleanDigits = digits || '6281200000000';
  const encodedText = encodeURIComponent(String(message || ''));
  return `${WA_HOST}${cleanDigits}?text=${encodedText}`;
}

export function getNextLightboxIndex(currentIndex, total, direction) {
  if (total <= 0) return -1;
  const step = direction === 'prev' ? -1 : 1;
  return (currentIndex + step + total) % total;
}
