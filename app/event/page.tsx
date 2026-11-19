'use client';

import React, { useState } from 'react';
import { EVENTS, SHOP_INFO } from '@/lib/data';
import { useApp } from '@/lib/context';
import { buildWhatsAppUrl, matchesCategory, personalizeWhatsAppMessage } from '@/lib/logic';

export default function EventPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { user, isEventSaved, toggleSaveEvent } = useApp();
  const userName = user?.name;

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'monobar', label: 'Monobar' },
    { key: 'run', label: 'Run & Chill' },
    { key: 'workshop', label: 'Class & Workshop' },
    { key: 'monotalk', label: 'Monotalk' },
  ];

  const filteredEvents = EVENTS.filter((event) => {
    const statusOk = event.status === activeTab;
    const categoryOk = matchesCategory(event.category, activeCategory);
    return statusOk && categoryOk;
  });

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Monokala Programs</span>
          <h1>Not Just a Coffee Shop, It&apos;s a Meeting Point</h1>
          <p>
            Di Monokala, kopi hanyalah pembuka percakapan. Kami merancang kalender rutin agar kamu selalu punya alasan seru untuk datang dan menjadi bagian dari sebuah momen.
          </p>
        </div>
      </section>

      {/* Program Categories Overview */}
      <section className="section section-compact">
        <div className="container">
          <div className="grid-4 grid-compact">
            <div className="card">
              <div className="card-body">
                <span className="step-index">01</span>
                <h2 className="card-title">Monobar</h2>
                <p className="card-desc">Nobar bola paling hidup dengan layar proyektor lebar dan atmosfer suportif.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <span className="step-index">02</span>
                <h2 className="card-title">Run &amp; Chill</h2>
                <p className="card-desc">Kolaborasi lari santai bareng komunitas setiap Minggu pagi di rute kota.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <span className="step-index">03</span>
                <h2 className="card-title">Class &amp; Workshop</h2>
                <p className="card-desc">Belajar keterampilan baru—mulai personal color hingga seduh kopi—dengan kuota terbatas.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <span className="step-index">04</span>
                <h2 className="card-title">Monotalk</h2>
                <p className="card-desc">Sesi bincang inspiratif #Inikatamereka bersama pembicara lintas industri.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Explorer */}
      <section className="section">
        <div className="container">
          {/* Status Tabs */}
          <div className="filter-bar" role="tablist" aria-label="Status jadwal event">
            <button
              className="filter-btn"
              type="button"
              role="tab"
              onClick={() => setActiveTab('upcoming')}
              aria-selected={activeTab === 'upcoming'}
            >
              Upcoming Events
            </button>
            <button
              className="filter-btn"
              type="button"
              role="tab"
              onClick={() => setActiveTab('past')}
              aria-selected={activeTab === 'past'}
            >
              Past Events
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-bar" role="group" aria-label="Kategori event">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className="filter-btn"
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                aria-pressed={activeCategory === cat.key}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <p className="filter-count">
            Menampilkan {filteredEvents.length} {activeTab === 'upcoming' ? 'acara mendatang' : 'arsip acara'}
          </p>

          {/* Event Cards Grid */}
          <div className="grid-3">
            {filteredEvents.map((item) => {
              const saved = isEventSaved(item.id);
              const waMsg = personalizeWhatsAppMessage(
                `Halo Monokala! Saya mau daftar event ${item.title} (${item.date}). Apakah kuota masih tersedia?`,
                userName
              );
              const waUrl = buildWhatsAppUrl(SHOP_INFO.phone, waMsg);

              return (
                <article key={item.id} className="card">
                  <div className="card-media card-media-wide">
                    <img
                      src={item.image}
                      alt={item.alt}
                      width={960}
                      height={540}
                      loading="lazy"
                    />
                  </div>
                  <div className="card-body">
                    <div className="card-top-row">
                      <span className={`badge ${item.badgeType === 'accent' ? 'badge-accent' : 'badge-navy'}`}>
                        {item.categoryLabel}
                      </span>
                      {item.quotaText && <span className="quota-text">{item.quotaText}</span>}
                    </div>
                    <h2 className="card-title">{item.title}</h2>
                    <p className="card-desc">{item.description}</p>

                    <div className="card-meta">
                      <div className="meta-row">
                        <span>{item.date}{item.time ? ` · ${item.time}` : ''}</span>
                      </div>
                      <div className="meta-row">
                        <span>{item.location}</span>
                      </div>
                      <div className="meta-row">
                        <strong>{item.priceInfo}</strong>
                      </div>
                    </div>

                    {item.status === 'upcoming' && (
                      <div className="card-inline-actions">
                        <a
                          className="btn btn-accent"
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join the Moment
                        </a>
                        <button
                          className={`btn ${saved ? 'btn-primary' : 'btn-outline'} btn-sm`}
                          type="button"
                          onClick={() => toggleSaveEvent(item.id)}
                          aria-pressed={saved}
                        >
                          {saved ? '✓ Tersimpan' : 'Simpan Acara'}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="empty-state">
              <p>Belum ada jadwal di filter ini. Coba ganti kategori atau lihat tab lain.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Alur Mudah</span>
            <h2>How It Works</h2>
            <p>Tiga langkah ringkas supaya kamu langsung terhubung dan menikmati suasana tanpa ribet.</p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div className="card-body">
                <span className="step-number">1</span>
                <h3>Daftar via WhatsApp</h3>
                <p className="card-desc">
                  Klik tombol <strong>Join the Moment</strong> pada acara pilihanmu untuk konfirmasi kuota dan pembayaran HTM (jika berbayar).
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <span className="step-number">2</span>
                <h3>Datang Lebih Awal</h3>
                <p className="card-desc">
                  Tiba 15–30 menit sebelum kickoff atau jadwal dimulai untuk memilih kursi favorit, pesan makanan, dan saling menyapa kawan baru.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <span className="step-number">3</span>
                <h3>Nikmati Kebersamaan</h3>
                <p className="card-desc">
                  Bersorak bareng, nikmati kopi hangat, dan jadilah bagian dari cerita seru di setiap kala bersama kawan Monokala.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
