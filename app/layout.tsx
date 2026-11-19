import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Monokala Coffee — Titik Temu di Setiap Kala',
  description:
    'Monokala Coffee, titik temu di setiap kala. Nikmati kopi racikan spesial sambil ikut Monobar, Sunday Run & Chill, workshop, dan Monotalk.',
  openGraph: {
    title: 'Monokala Coffee — Titik Temu di Setiap Kala',
    description:
      'Kafe komunitas yang mempertemukan obrolan santai, Monobar seru, Sunday Run & Chill, dan workshop kreatif.',
    type: 'website',
    url: 'https://monokalacoffee.id/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monokala Coffee — Titik Temu di Setiap Kala',
    description: 'Kafe komunitas tempat bertemu di setiap momen: nobar, lari pagi, workshop, dan obrolan hangat.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&subset=latin&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@700&text=MONOKALA&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>
          <a className="skip-link" href="#main-content">
            Lewati ke konten utama
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
