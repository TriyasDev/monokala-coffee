import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OPENING_HOURS,
  resolveTheme,
  toggleTheme,
  getKalaStatus,
  normalizeCategory,
  matchesCategory,
  filterEventItems,
  formatUserInitials,
  getFirstName,
  personalizeWhatsAppMessage,
  buildWhatsAppUrl,
  getNextLightboxIndex,
} from '../js/logic.js';

test('resolveTheme defaults to light and accepts dark only when explicit', () => {
  assert.equal(resolveTheme('dark'), 'dark');
  assert.equal(resolveTheme('light'), 'light');
  assert.equal(resolveTheme('unknown'), 'light');
  assert.equal(resolveTheme(null), 'light');
});

test('toggleTheme flips cleanly between light and dark', () => {
  assert.equal(toggleTheme('dark'), 'light');
  assert.equal(toggleTheme('light'), 'dark');
  assert.equal(toggleTheme(undefined), 'dark');
});

test('OPENING_HOURS and getKalaStatus compute WIB period and open/closed status', () => {
  assert.equal(OPENING_HOURS.openHour, 7);
  assert.equal(OPENING_HOURS.closeHour, 23);

  // 09:15 UTC = 16:15 WIB (Kala Sore, Buka)
  const soreOpen = getKalaStatus(new Date('2026-05-23T09:15:00Z'));
  assert.equal(soreOpen.kalaKey, 'sore');
  assert.equal(soreOpen.kalaLabel, 'Kala Sore');
  assert.equal(soreOpen.isOpen, true);
  assert.ok(soreOpen.chipText.includes('16.15 WIB'));
  assert.ok(soreOpen.chipText.includes('Buka sampai 23.00'));

  // 17:30 UTC = 00:30 WIB (Kala Malam, Tutup)
  const malamClosed = getKalaStatus(new Date('2026-05-23T17:30:00Z'));
  assert.equal(malamClosed.kalaKey, 'malam');
  assert.equal(malamClosed.isOpen, false);
  assert.ok(malamClosed.chipText.includes('Tutup dulu'));
});

test('formatUserInitials and getFirstName derive clean display tokens', () => {
  assert.equal(formatUserInitials('Triyas Pratama', 'triyas@example.com'), 'TP');
  assert.equal(formatUserInitials('', 'monokala@example.com'), 'MO');
  assert.equal(getFirstName('Triyas Pratama', 'triyas@example.com'), 'Triyas');
  assert.equal(getFirstName('', 'budi@example.com'), 'budi');
});

test('personalizeWhatsAppMessage prefills signed-in user name safely', () => {
  const base = 'Halo Monokala! Saya mau daftar event Monobar: Persib vs Persija.';
  assert.equal(personalizeWhatsAppMessage(base, ''), base);
  assert.equal(
    personalizeWhatsAppMessage(base, 'Triyas'),
    'Halo Monokala! Saya Triyas mau daftar event Monobar: Persib vs Persija.'
  );
  assert.equal(
    personalizeWhatsAppMessage('Ingin kolaborasi acara.', 'Sinta'),
    'Ingin kolaborasi acara. (Atas nama: Sinta)'
  );
});

test('normalizeCategory trims and lowercases input safely', () => {
  assert.equal(normalizeCategory('  Food & Snack '), 'food & snack');
  assert.equal(normalizeCategory(''), 'all');
  assert.equal(normalizeCategory(null), 'all');
});

test('matchesCategory handles All and specific categories', () => {
  assert.equal(matchesCategory('Coffee', 'all'), true);
  assert.equal(matchesCategory('Coffee', 'coffee'), true);
  assert.equal(matchesCategory('Food & Snack', 'coffee'), false);
});

test('filterEventItems filters by status and category', () => {
  const sample = [
    { id: 1, status: 'upcoming', category: 'monobar' },
    { id: 2, status: 'upcoming', category: 'run' },
    { id: 3, status: 'past', category: 'monobar' },
  ];
  assert.deepEqual(
    filterEventItems(sample, { status: 'upcoming', category: 'all' }).map((i) => i.id),
    [1, 2]
  );
  assert.deepEqual(
    filterEventItems(sample, { status: 'upcoming', category: 'monobar' }).map((i) => i.id),
    [1]
  );
  assert.deepEqual(
    filterEventItems(sample, { status: 'past', category: 'monobar' }).map((i) => i.id),
    [3]
  );
});

test('buildWhatsAppUrl enforces wa.me host and encodes message', () => {
  const url = buildWhatsAppUrl('+62 812-3456-7890', 'Halo Monokala! Saya Triyas mau daftar "Monobar: Persib vs Persija".');
  assert.ok(url.startsWith('https://wa.me/6281234567890?text='));
  assert.ok(url.includes(encodeURIComponent('Saya Triyas mau daftar')));
});

test('getNextLightboxIndex wraps cleanly forward and backward', () => {
  assert.equal(getNextLightboxIndex(0, 5, 'prev'), 4);
  assert.equal(getNextLightboxIndex(4, 5, 'next'), 0);
  assert.equal(getNextLightboxIndex(2, 5, 'next'), 3);
  assert.equal(getNextLightboxIndex(0, 0, 'next'), -1);
});
