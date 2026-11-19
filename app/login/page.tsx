'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { EVENTS, SHOP_INFO } from '@/lib/data';
import { buildWhatsAppUrl, personalizeWhatsAppMessage } from '@/lib/logic';

export default function LoginPage() {
  const {
    user,
    signInWithGoogle,
    signInWithDemo,
    signInLocal,
    signOut,
    savedEvents,
    toggleSaveEvent,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleDemoFill = () => {
    setLoginEmail('member@monokala.id');
    setLoginPassword('monokala2026');
    setFormError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || loginPassword.length < 6) {
      setFormError('Masukkan email yang valid dan kata sandi minimal 6 karakter.');
      return;
    }
    setFormError(null);
    signInLocal(loginEmail);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || registerPassword.length < 6) {
      setFormError('Lengkapi nama, email yang valid, dan kata sandi minimal 6 karakter.');
      return;
    }
    setFormError(null);
    signInLocal(registerEmail, registerName);
  };

  // Resolve saved events info from catalog
  const savedEventItems = savedEvents.map((id) => {
    const found = EVENTS.find((ev) => ev.id === id);
    return found || { id, title: id, date: '', status: 'upcoming' as const };
  });

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Monokala Community Pass</span>
          <h1>Member Access</h1>
          <p>
            Masuk untuk menyimpan jadwal Monobar, Sunday Run &amp; Chill, atau workshop favoritmu agar tidak terlewat setiap akhir pekan.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container auth-layout">
          {/* Main Auth Container */}
          {!user ? (
            <div id="auth-card" className="auth-card">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => signInWithGoogle()}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <svg className="auth-google-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.98h5.27c-.45 2.38-2.55 3.92-5.27 3.92a6 6 0 1 1 0-12c1.5 0 2.86.55 3.9 1.47l2.24-2.24A9.15 9.15 0 0 0 12.18 3a9 9 0 1 0 0 18c5.2 0 8.65-3.66 8.65-8.82 0-.6-.06-1.02-.18-1.48Z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="auth-tabs" role="tablist" aria-label="Pilih mode autentikasi" style={{ marginTop: '1.25rem' }}>
                <button
                  className="filter-btn"
                  type="button"
                  role="tab"
                  onClick={() => {
                    setActiveTab('login');
                    setFormError(null);
                  }}
                  aria-selected={activeTab === 'login'}
                >
                  Sign In
                </button>
                <button
                  className="filter-btn"
                  type="button"
                  role="tab"
                  onClick={() => {
                    setActiveTab('register');
                    setFormError(null);
                  }}
                  aria-selected={activeTab === 'register'}
                >
                  Create Account
                </button>
              </div>

              {formError && (
                <div className="form-alert form-alert-error" role="alert" style={{ marginTop: '1rem' }}>
                  {formError}
                </div>
              )}

              {activeTab === 'login' ? (
                <form className="auth-form" onSubmit={handleLoginSubmit} style={{ marginTop: '1rem' }}>
                  <div className="form-field">
                    <label className="form-label" htmlFor="login-email">
                      Email
                    </label>
                    <input
                      id="login-email"
                      className="form-input"
                      type="email"
                      autoComplete="email"
                      placeholder="nama@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="login-password">
                      Password
                    </label>
                    <input
                      id="login-password"
                      className="form-input"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Minimal 6 karakter"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="btn-group" style={{ marginTop: '1.25rem' }}>
                    <button className="btn btn-primary" type="submit">
                      Sign In
                    </button>
                    <button className="btn btn-outline" type="button" onClick={handleDemoFill}>
                      Fill Demo Member
                    </button>
                  </div>

                  <div className="demo-hint" style={{ marginTop: '1.5rem' }}>
                    <p>
                      <strong>Demo Account Preview:</strong>
                    </p>
                    <p>
                      Email: <code>member@monokala.id</code> · Password: <code>monokala2026</code>
                    </p>
                    <p className="gallery-sub">
                      Prototype Next.js menyimpan status sesi di browser Anda untuk simulasi alur keanggotaan.
                    </p>
                  </div>
                </form>
              ) : (
                <form className="auth-form" onSubmit={handleRegisterSubmit} style={{ marginTop: '1rem' }}>
                  <div className="form-field">
                    <label className="form-label" htmlFor="register-name">
                      Full Name
                    </label>
                    <input
                      id="register-name"
                      className="form-input"
                      type="text"
                      autoComplete="name"
                      placeholder="Nama lengkap kamu"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="register-email">
                      Email
                    </label>
                    <input
                      id="register-email"
                      className="form-input"
                      type="email"
                      autoComplete="email"
                      placeholder="nama@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="register-password">
                      Password
                    </label>
                    <input
                      id="register-password"
                      className="form-input"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Minimal 6 karakter"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button className="btn btn-accent" type="submit" style={{ marginTop: '1.25rem' }}>
                    Create Account
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Logged-in Member Dashboard */
            <div id="member-dashboard" className="auth-card member-dashboard">
              <div className="card-top-row">
                <span className="badge badge-success">Active Member</span>
                <button className="btn btn-outline btn-sm" type="button" onClick={() => signOut()}>
                  Sign Out
                </button>
              </div>

              <h2 style={{ marginTop: '1rem', marginBottom: '0.25rem' }}>{user.name}</h2>
              <p className="gallery-sub">{user.email}</p>

              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Saved Events</h3>
                <p className="gallery-sub">Daftar event komunitas yang kamu tandai dari halaman Event.</p>

                <ul className="saved-events-list" style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                  {savedEventItems.length === 0 ? (
                    <li className="saved-event-item" style={{ padding: '1rem', border: '1px dashed var(--border-subtle)', borderRadius: '0.5rem' }}>
                      <span className="gallery-sub">
                        Belum ada acara tersimpan. Buka <Link href="/event" style={{ textDecoration: 'underline' }}>halaman Event</Link> dan klik &quot;Simpan Acara&quot;.
                      </span>
                    </li>
                  ) : (
                    savedEventItems.map((item) => {
                      const waMsg = personalizeWhatsAppMessage(
                        `Halo Monokala! Saya mau daftar event ${item.title}. Apakah kuota masih ada?`,
                        user.name
                      );
                      const waUrl = buildWhatsAppUrl(SHOP_INFO.phone, waMsg);

                      return (
                        <li key={item.id} className="saved-event-item">
                          <div>
                            <div className="saved-event-title" style={{ fontWeight: 600 }}>{item.title}</div>
                            {item.date && <div className="saved-event-date gallery-sub">{item.date}</div>}
                          </div>
                          <div className="btn-group">
                            <a
                              className="btn btn-accent btn-sm"
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Daftar WA →
                            </a>
                            <button
                              className="btn btn-outline btn-sm"
                              type="button"
                              onClick={() => toggleSaveEvent(item.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Member Benefits Info Aside */}
          <aside className="card">
            <div className="card-media card-media-wide">
              <img
                src="/assets/img/photos/hero-monokala.jpg"
                alt="Pengunjung member berkumpul hangat di meja panjang Monokala Coffee"
                width={800}
                height={600}
                loading="lazy"
              />
            </div>
            <div className="card-body">
              <span className="badge badge-navy">Why Join Member</span>
              <h3 style={{ marginTop: '0.75rem' }}>Member Perks</h3>
              <ul className="info-list" style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', lineHeight: '1.7' }}>
                <li>
                  <span>
                    <strong>Simpan Jadwal Event:</strong> Tandai Monobar, Run &amp; Chill, atau workshop agar mudah diakses lagi.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Akses Cepat WhatsApp:</strong> Konfirmasi kuota kursi langsung dari daftar event tersimpanmu tanpa ketik ulang.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Info Komunitas Prioritas:</strong> Dapatkan kabar awal pembukaan kuota kelas terbatas dan turnamen nobar.
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
