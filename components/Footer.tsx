'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { SHOP_INFO } from '@/lib/data';
import { buildWhatsAppUrl, personalizeWhatsAppMessage } from '@/lib/logic';

export default function Footer() {
  const { user } = useApp();
  const userName = user?.name;

  const orderMsg = personalizeWhatsAppMessage(
    'Halo Monokala! Saya mau tanya info menu dan jadwal kumpul di Monokala Coffee.',
    userName
  );
  const orderWaUrl = buildWhatsAppUrl(SHOP_INFO.phone, orderMsg);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h2 className="card-title">MONOKALA COFFEE</h2>
            <p>
              Titik temu di setiap kala. Pesan menu favoritmu untuk teman kerja, ngobrol santai, atau nonton bareng.
            </p>
            <a
              className="btn btn-accent btn-sm"
              href={orderWaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order / Tanya Menu
            </a>
          </div>

          <div>
            <h3 className="card-title">Explore</h3>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/product">Product Menu</Link></li>
              <li><Link href="/moments">Community Moments</Link></li>
              <li><Link href="/event">Upcoming Events</Link></li>
              <li><Link href="/login">Member Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="card-title">Visit &amp; Social</h3>
            <ul className="footer-links">
              <li><span>{SHOP_INFO.address}</span></li>
              <li><span>{SHOP_INFO.hours}</span></li>
              <li>
                <a href={SHOP_INFO.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram {SHOP_INFO.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Monokala Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
