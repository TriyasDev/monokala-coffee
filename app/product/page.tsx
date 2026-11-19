'use client';

import React, { useState } from 'react';
import { PRODUCTS, SHOP_INFO } from '@/lib/data';
import { useApp } from '@/lib/context';
import { buildWhatsAppUrl, matchesCategory, personalizeWhatsAppMessage } from '@/lib/logic';

export default function ProductPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useApp();
  const userName = user?.name;

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'coffee', label: 'Coffee' },
    { key: 'non-coffee', label: 'Non-Coffee' },
    { key: 'food', label: 'Food & Snack' },
  ];

  const filteredProducts = PRODUCTS.filter((p) => matchesCategory(p.category, selectedCategory));

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Signature Bar &amp; Kitchen</span>
          <h1>Crafted for Every Kala</h1>
          <p>
            Semua menu diracik segar setiap pesanan masuk—dari kopi andalan harian sampai camilan hangat yang pas buat dibagi saat nobar atau nongkrong.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Filter Group */}
          <div className="filter-bar" role="group" aria-label="Filter kategori menu">
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

          <p className="filter-count">Menampilkan {filteredProducts.length} item</p>

          {/* Product Grid */}
          <div className="grid-3">
            {filteredProducts.map((product) => {
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
                      width={800}
                      height={600}
                      loading="lazy"
                    />
                  </div>
                  <div className="card-body">
                    <div className="card-top-row">
                      {product.badge && (
                        <span
                          className={`badge ${product.badgeType === 'navy' ? 'badge-navy' : 'badge-accent'}`}
                        >
                          {product.badge}
                        </span>
                      )}
                      <span className="badge">{product.categoryLabel}</span>
                    </div>
                    <h2 className="card-title">{product.name}</h2>
                    <p className="card-desc">{product.description}</p>
                    <div className="card-footer-row">
                      <span className="price-tag">{product.formattedPrice}</span>
                      <span className="gallery-sub">{product.subtext}</span>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <a
                        className="btn btn-accent btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        href={itemWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Pesan via WhatsApp →
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>Belum ada menu di kategori ini. Silakan pilih kategori lain.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
