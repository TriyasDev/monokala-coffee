'use client';

import React, { useState } from 'react';
import { MOMENTS, MONOTALK_EPISODES, SHOP_INFO } from '@/lib/data';
import { matchesCategory } from '@/lib/logic';

export default function MomentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'suasana', label: 'Suasana' },
    { key: 'komunitas', label: 'Komunitas' },
    { key: 'barista', label: 'Barista' },
  ];

  const filteredMoments = MOMENTS.filter((m) => matchesCategory(m.category, selectedCategory));

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Monokala Stories</span>
          <h1>Moments That Connect Us</h1>
          <p>
            Koleksi foto dan potongan cerita dari nobar seru, lari pagi bareng, kelas seduh, hingga obrolan hangat yang berlanjut sampai larut malam.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div className="filter-bar" role="group" aria-label="Filter kategori momen">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className="filter-btn"
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                aria-pressed={selectedCategory === cat.key}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <p className="filter-count">Menampilkan {filteredMoments.length} item</p>

          <div className="gallery-grid gallery-grid-4">
            {filteredMoments.map((item) => (
              <article
                key={item.id}
                className="gallery-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveModalImage(item.image)}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                />
                <div className="gallery-caption">
                  <p className="gallery-desc">{item.caption}</p>
                </div>
              </article>
            ))}
          </div>

          {filteredMoments.length === 0 && (
            <div className="empty-state">
              <p>Belum ada dokumentasi untuk kategori ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* Monotalk Episodes Series */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Archive Series · #Inikatamereka</span>
            <h2>Monotalk Episodes</h2>
            <p>
              Obrolan santai tapi berisi bersama praktisi, pegiat komunitas, dan kawan Monokala tentang karya dan keseharian.
            </p>
          </div>

          <div className="grid-2">
            {MONOTALK_EPISODES.map((ep) => (
              <article key={ep.episodeNumber} className="card">
                <div className="card-body">
                  <div className="card-top-row">
                    <span className="badge badge-navy">{ep.episodeNumber}</span>
                    <span className="badge">{ep.tag}</span>
                  </div>
                  <h3 className="card-title">{ep.title}</h3>
                  <p className="card-desc">{ep.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Social Invitation */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Tag Kami di Instagram</span>
          <h2>Bagikan Kala Terbaikmu</h2>
          <p style={{ maxWidth: '580px', margin: '0 auto 1.5rem' }}>
            Unggah foto saat nongkrong, nobar, atau lari pagi, lalu tag <strong>{SHOP_INFO.instagramHandle}</strong> dengan hashtag <strong>#TitikTemuDiSetiapKala</strong> untuk kami tampilkan di galeri komunitas.
          </p>
          <a
            className="btn btn-primary"
            href={SHOP_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka Instagram @monokalacoffee →
          </a>
        </div>
      </section>

      {/* Simple Image Lightbox Modal */}
      {activeModalImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setActiveModalImage(null)}
        >
          <div style={{ maxWidth: '900px', width: '100%', position: 'relative' }}>
            <img
              src={activeModalImage}
              alt="Momen Monokala"
              style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', maxHeight: '85vh', objectFit: 'contain' }}
            />
            <button
              type="button"
              className="btn btn-accent btn-sm"
              style={{ position: 'absolute', top: '10px', right: '10px' }}
              onClick={() => setActiveModalImage(null)}
            >
              Tutup ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
