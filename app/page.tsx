'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import KalaBadge from '@/components/KalaBadge';
import { PRODUCTS, MOMENTS, SHOP_INFO } from '@/lib/data';
import { useApp } from '@/lib/context';
import { buildWhatsAppUrl, personalizeWhatsAppMessage } from '@/lib/logic';

export default function HomePage() {
  const { user } = useApp();
  const userName = user?.name;

  const partnerMsg = personalizeWhatsAppMessage(
    'Halo Monokala! Saya tertarik kolaborasi bikin event komunitas di Monokala Coffee.',
    userName
  );
  const partnerWaUrl = buildWhatsAppUrl(SHOP_INFO.phone, partnerMsg);

  const featuredProducts = PRODUCTS.slice(0, 3);
  const featuredMoments = MOMENTS.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="eyebrow">{SHOP_INFO.tagline}</span>
              <h1 className="hero-title">Where Every Moment Meets</h1>
              <p className="hero-desc">
                Kafe komunitas yang mempertemukan obrolan santai, Monobar seru, Sunday Run &amp; Chill, workshop kreatif, dan kopi racikan berkualitas tinggi.
              </p>

              <div style={{ marginBlock: '1.25rem' }}>
                <KalaBadge />
              </div>

              <div className="hero-actions">
                <Link className="btn btn-accent" href="/product">
                  Lihat Menu &amp; Order
                </Link>
                <Link className="btn btn-primary" href="/event">
                  Jadwal Acara Komunitas
                </Link>
              </div>

              {/* Quick Info Points */}
              <div className="hero-perks" style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <strong>07.00 – 23.00 WIB</strong>
                  <p className="gallery-sub" style={{ margin: 0 }}>Buka Setiap Hari</p>
                </div>
                <div>
                  <strong>Wifi &amp; Colokan</strong>
                  <p className="gallery-sub" style={{ margin: 0 }}>Nyaman Kerja &amp; Santai</p>
                </div>
                <div>
                  <strong>Komunitas Aktif</strong>
                  <p className="gallery-sub" style={{ margin: 0 }}>Nobar, Run, &amp; Talk</p>
                </div>
              </div>
            </div>

            <div className="hero-media">
              <div className="hero-image-wrap" style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
                <img
                  src="/assets/img/photos/hero-monokala.jpg"
                  alt="Suasana pengunjung menikmati sore di Monokala Coffee"
                  width={900}
                  height={600}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Program Rutin</span>
            <h2>Lebih dari Sekadar Kedai Kopi</h2>
            <p>Selalu ada alasan untuk mampir dan terhubung dengan kawan baru setiap minggunya.</p>
          </div>

          <div className="grid-3">
            <article className="card">
              <div className="card-media card-media-wide">
                <img
                  src="/assets/img/photos/event-monobar.jpg"
                  alt="Suasana nonton bareng Monobar di Monokala"
                  width={600}
                  height={400}
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <div className="card-top-row">
                  <span className="badge badge-navy">Monobar</span>
                  <span className="badge">Weekend Night</span>
                </div>
                <h3 className="card-title">Monobar Nobar Seru</h3>
                <p className="card-desc">
                  Nonton bareng laga top dan turnamen akbar di layar lebar dengan sound menggelegar dan camilan hangat.
                </p>
                <Link className="btn btn-outline btn-sm" href="/event">
                  Lihat Jadwal Nobar →
                </Link>
              </div>
            </article>

            <article className="card">
              <div className="card-media card-media-wide">
                <img
                  src="/assets/img/photos/event-run.jpg"
                  alt="Sunday Run & Chill di Monokala"
                  width={600}
                  height={400}
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <div className="card-top-row">
                  <span className="badge badge-accent">Run &amp; Chill</span>
                  <span className="badge">Sunday 06:00</span>
                </div>
                <h3 className="card-title">Sunday Run &amp; Chill</h3>
                <p className="card-desc">
                  Lari santai 5K keliling rute kota bersama komunitas pelari, finis dengan kopi susu dan sarapan pisang goreng wijen.
                </p>
                <Link className="btn btn-outline btn-sm" href="/event">
                  Gabung Lari →
                </Link>
              </div>
            </article>

            <article className="card">
              <div className="card-media card-media-wide">
                <img
                  src="/assets/img/photos/event-workshop.jpg"
                  alt="Workshop kreatif di Monokala"
                  width={600}
                  height={400}
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <div className="card-top-row">
                  <span className="badge badge-navy">Workshop &amp; Talk</span>
                  <span className="badge">Creative Space</span>
                </div>
                <h3 className="card-title">Class &amp; Monotalk</h3>
                <p className="card-desc">
                  Ruang belajar dan berbagi cerita lewat workshop personal style, seni seduh, serta talkshow intim #Inikatamereka.
                </p>
                <Link className="btn btn-outline btn-sm" href="/moments">
                  Arsip Episode →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Featured Menu Highlights */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Signature Bar</span>
            <h2>Menu Pilihan Kawan Monokala</h2>
            <p>Racikan andalan untuk menyegarkan fokus kerja atau melengkapi obrolan santaimu.</p>
          </div>

          <div className="grid-3">
            {featuredProducts.map((product) => {
              const itemMsg = personalizeWhatsAppMessage(
                `Halo Monokala! Saya mau pesan menu ${product.name} (${product.formattedPrice}). Apakah tersedia?`,
                userName
              );
              const itemWaUrl = buildWhatsAppUrl(SHOP_INFO.phone, itemMsg);

              return (
                <article key={product.id} className="card">
                  <div className="card-media">
                    <img
                      src={product.image}
                      alt={product.alt}
                      width={600}
                      height={450}
                      loading="lazy"
                    />
                  </div>
                  <div className="card-body">
                    <div className="card-top-row">
                      {product.badge && (
                        <span className={`badge ${product.badgeType === 'navy' ? 'badge-navy' : 'badge-accent'}`}>
                          {product.badge}
                        </span>
                      )}
                      <span className="badge">{product.categoryLabel}</span>
                    </div>
                    <h3 className="card-title">{product.name}</h3>
                    <p className="card-desc">{product.description}</p>
                    <div className="card-footer-row">
                      <span className="price-tag">{product.formattedPrice}</span>
                      <a
                        className="btn btn-accent btn-sm"
                        href={itemWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Pesan via WA
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link className="btn btn-primary" href="/product">
              Lihat Seluruh Menu ({PRODUCTS.length} Menu) →
            </Link>
          </div>
        </div>
      </section>

      {/* Community Moments Teaser */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Momen &amp; Cerita</span>
            <h2>Captured at Monokala</h2>
            <p>Setiap tawa, sorak gol, dan obrolan hangat terekam di sini.</p>
          </div>

          <div className="gallery-grid gallery-grid-4">
            {featuredMoments.map((m) => (
              <article key={m.id} className="gallery-card">
                <img src={m.image} alt={m.alt} width={600} height={450} loading="lazy" />
                <div className="gallery-caption">
                  <p className="gallery-desc">{m.caption}</p>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link className="btn btn-outline" href="/moments">
              Buka Galeri Momen Lengkap →
            </Link>
          </div>
        </div>
      </section>

      {/* Community Collaboration CTA */}
      <section className="section">
        <div className="container">
          <div
            style={{
              background: 'var(--bg-banner)',
              color: 'var(--text-on-emphasis)',
              borderRadius: '1rem',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                color: 'var(--text-eyebrow-on-emphasis)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.875rem',
              }}
            >
              Ruang Kolaborasi Komunitas
            </span>
            <h2 style={{ color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Punya Komunitas atau Ingin Menggelar Event di Monokala?
            </h2>
            <p style={{ color: 'var(--text-on-emphasis-muted)', maxWidth: '640px', margin: '0 auto 1.5rem' }}>
              Kami membuka ruang untuk nobar klub suporter, rute gathering komunitas lari/sepeda, pameran mini, workshop, hingga peluncuran buku.
            </p>
            <a
              className="btn btn-accent"
              href={partnerWaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ajukan Kolaborasi Komunitas via WA
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
