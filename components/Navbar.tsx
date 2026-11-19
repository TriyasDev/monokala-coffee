'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';
import { formatUserInitials, getFirstName } from '@/lib/logic';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, user, signInWithGoogle, signOut, feedback, setFeedback } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Product', href: '/product' },
    { label: 'Moments', href: '/moments' },
    { label: 'Event', href: '/event' },
  ];

  const firstName = user ? getFirstName(user.name, user.email) : 'Member';
  const initials = user ? formatUserInitials(user.name, user.email) : 'M';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          MONOKALA
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop" aria-label="Navigasi utama">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Theme Toggle Button */}
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
          >
            {theme === 'dark' ? (
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span className="theme-toggle-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Auth Widget */}
          <div className="auth-control">
            {!user ? (
              <button
                className="btn btn-primary btn-sm auth-signin-btn"
                type="button"
                onClick={() => signInWithGoogle()}
                aria-label="Masuk dengan akun Google"
              >
                <svg className="auth-google-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.98h5.27c-.45 2.38-2.55 3.92-5.27 3.92a6 6 0 1 1 0-12c1.5 0 2.86.55 3.9 1.47l2.24-2.24A9.15 9.15 0 0 0 12.18 3a9 9 0 1 0 0 18c5.2 0 8.65-3.66 8.65-8.82 0-.6-.06-1.02-.18-1.48Z"
                  />
                </svg>
                <span>Sign in</span>
              </button>
            ) : (
              <div className="auth-profile" style={{ position: 'relative' }}>
                <button
                  className="auth-avatar-btn"
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-label="Menu akun"
                >
                  {user.photoURL ? (
                    <img
                      className="auth-avatar-img"
                      src={user.photoURL}
                      alt={user.name}
                      width={28}
                      height={28}
                    />
                  ) : (
                    <span className="auth-avatar-fallback" aria-hidden="true">
                      {initials}
                    </span>
                  )}
                  <span className="auth-user-name">{firstName}</span>
                  <svg className="icon" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m6 8 4 4 4-4"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div
                    className="auth-dropdown"
                    role="menu"
                    style={{ display: 'block', position: 'absolute', right: 0, top: '100%', zIndex: 50 }}
                  >
                    <div className="auth-dropdown-header">
                      <span className="auth-dropdown-name">{user.name}</span>
                      <span className="auth-dropdown-email">{user.email}</span>
                    </div>
                    <Link
                      className="auth-dropdown-link"
                      href="/login"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Saved Events & Pass
                    </Link>
                    <button
                      className="auth-signout-btn"
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        signOut();
                        setDropdownOpen(false);
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="nav-toggle"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Buka menu navigasi"
          >
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Auth Feedback Alert */}
      {feedback && (
        <div className="auth-feedback" role="status" aria-live="polite">
          <div className="container auth-feedback-inner">
            <p>{feedback}</p>
            <button
              className="auth-feedback-close"
              type="button"
              onClick={() => setFeedback(null)}
              aria-label="Tutup pemberitahuan"
            >
              <svg className="icon" viewBox="0 0 20 20" aria-hidden="true">
                <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <nav id="mobile-nav" className="nav-mobile" aria-label="Navigasi seluler" hidden={!mobileMenuOpen}>
        <ul className="nav-mobile-list">
          {navLinks.map((item) => (
            <li key={item.href}>
              <Link
                className="nav-link"
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              className="nav-link"
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              {user ? `Kartu Kawan (${firstName})` : 'Member Pass'}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
