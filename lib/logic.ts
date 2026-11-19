const WA_HOST = 'https://wa.me/';
export const THEME_STORAGE_KEY = 'monokala_theme';

export interface OpeningHours {
  openHour: number;
  closeHour: number;
  openLabel: string;
  closeLabel: string;
  label: string;
}

export const OPENING_HOURS: OpeningHours = {
  openHour: 7,
  closeHour: 23,
  openLabel: '07.00',
  closeLabel: '23.00',
  label: '07.00–23.00 WIB',
};

export function resolveTheme(value: string | null | undefined): 'light' | 'dark' {
  return value === 'dark' ? 'dark' : 'light';
}

export function toggleTheme(currentTheme: string | null | undefined): 'light' | 'dark' {
  return resolveTheme(currentTheme) === 'dark' ? 'light' : 'dark';
}

export function getWibTimeParts(date = new Date()): { hour: number; minute: number; timeText: string } {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date);
    const hourVal = parts.find((p) => p.type === 'hour')?.value ?? '16';
    const minuteVal = parts.find((p) => p.type === 'minute')?.value ?? '00';
    const hour = Number.parseInt(hourVal, 10) % 24;
    const minute = Number.parseInt(minuteVal, 10) % 60;
    return {
      hour,
      minute,
      timeText: `${String(hour).padStart(2, '0')}.${String(minute).padStart(2, '0')} WIB`,
    };
  } catch {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return {
      hour,
      minute,
      timeText: `${String(hour).padStart(2, '0')}.${String(minute).padStart(2, '0')} WIB`,
    };
  }
}

export interface KalaStatus {
  kalaKey: 'pagi' | 'siang' | 'sore' | 'malam';
  kalaLabel: string;
  timeText: string;
  isOpen: boolean;
  statusText: string;
  chipText: string;
}

export function getKalaStatus(date = new Date()): KalaStatus {
  const { hour, timeText } = getWibTimeParts(date);

  let kalaKey: 'pagi' | 'siang' | 'sore' | 'malam' = 'malam';
  let kalaLabel = 'Kala Malam';
  if (hour >= 5 && hour < 11) {
    kalaKey = 'pagi';
    kalaLabel = 'Kala Pagi';
  } else if (hour >= 11 && hour < 15) {
    kalaKey = 'siang';
    kalaLabel = 'Kala Siang';
  } else if (hour >= 15 && hour < 19) {
    kalaKey = 'sore';
    kalaLabel = 'Kala Sore';
  }

  const isOpen = hour >= OPENING_HOURS.openHour && hour < OPENING_HOURS.closeHour;
  const statusText = isOpen
    ? `Buka sampai ${OPENING_HOURS.closeLabel}`
    : `Tutup dulu · Buka jam ${OPENING_HOURS.openLabel}`;

  return {
    kalaKey,
    kalaLabel,
    timeText,
    isOpen,
    statusText,
    chipText: `Sekarang ${kalaLabel} · ${timeText} · ${statusText}`,
  };
}

export function normalizeCategory(value: string | null | undefined): string {
  return String(value || 'all').trim().toLowerCase();
}

export function matchesCategory(itemCategory: string | null | undefined, selectedCategory: string | null | undefined): boolean {
  const selected = normalizeCategory(selectedCategory);
  if (selected === 'all' || selected === '') {
    return true;
  }
  return normalizeCategory(itemCategory) === selected;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  status: 'upcoming' | 'past';
  date: string;
  time?: string;
  location?: string;
  description: string;
  image?: string;
  badge?: string;
}

export function filterEventItems<T extends { status?: string; category?: string }>(
  items: T[],
  { status = 'upcoming', category = 'all' }: { status?: string; category?: string } = {}
): T[] {
  const targetStatus = normalizeCategory(status);
  return items.filter((item) => {
    const statusOk = normalizeCategory(item.status) === targetStatus;
    const categoryOk = matchesCategory(item.category, category);
    return statusOk && categoryOk;
  });
}

export function formatUserInitials(displayName: string | null | undefined, email: string | null | undefined): string {
  const source = String(displayName || '').trim() || String(email || '').trim();
  if (!source) return 'M';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function getFirstName(displayName: string | null | undefined, email: string | null | undefined): string {
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

export function personalizeWhatsAppMessage(baseMessage: string, userName: string | null | undefined): string {
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

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = String(phone || '').replace(/\D+/g, '');
  const cleanDigits = digits || '6281200000000';
  const encodedText = encodeURIComponent(String(message || ''));
  return `${WA_HOST}${cleanDigits}?text=${encodedText}`;
}

export function getNextLightboxIndex(currentIndex: number, total: number, direction: 'prev' | 'next'): number {
  if (total <= 0) return -1;
  const step = direction === 'prev' ? -1 : 1;
  return (currentIndex + step + total) % total;
}
