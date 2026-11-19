export interface Product {
  id: string;
  name: string;
  category: 'coffee' | 'non-coffee' | 'food';
  categoryLabel: string;
  badge?: string;
  badgeType?: 'accent' | 'navy';
  description: string;
  price: number;
  formattedPrice: string;
  subtext: string;
  image: string;
  alt: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'monobar' | 'run' | 'workshop' | 'monotalk';
  categoryLabel: string;
  status: 'upcoming' | 'past';
  badge?: string;
  badgeType?: 'accent' | 'navy' | 'default';
  quotaText?: string;
  date: string;
  time?: string;
  location: string;
  priceInfo: string;
  description: string;
  image: string;
  alt: string;
}

export interface MomentItem {
  id: string;
  image: string;
  alt: string;
  caption: string;
  category: 'all' | 'suasana' | 'komunitas' | 'barista';
  categoryLabel: string;
}

export interface MonotalkEpisode {
  episodeNumber: string;
  title: string;
  description: string;
  tag: string;
}

export const SHOP_INFO = {
  name: 'Monokala Coffee',
  tagline: 'Titik Temu di Setiap Kala',
  description: 'Tempat nongkrong, Monobar, Sunday Run & Chill, workshop, dan Monotalk.',
  address: 'Jl. Contoh Titik Temu No. 18, Jakarta Selatan',
  hours: 'Setiap hari · 07.00 – 23.00 WIB',
  phone: '6281200000000',
  instagram: 'https://instagram.com/monokalacoffee',
  instagramHandle: '@monokalacoffee',
};

export const PRODUCTS: Product[] = [
  {
    id: 'signature-latte',
    name: 'Signature Latte',
    category: 'coffee',
    categoryLabel: 'Coffee',
    badge: 'Best Seller',
    badgeType: 'accent',
    description: 'Perpaduan espresso house blend dan susu segar dengan rasa manis lembut khas Monokala.',
    price: 32000,
    formattedPrice: 'Rp32.000',
    subtext: 'Hot / Iced',
    image: '/assets/img/photos/product-signature-latte.jpg',
    alt: 'Segelas Signature Latte Monokala Coffee dengan pusaran espresso dan susu creamy',
  },
  {
    id: 'dirty-latte',
    name: 'Dirty Latte',
    category: 'coffee',
    categoryLabel: 'Coffee',
    badge: 'Barista Pick',
    badgeType: 'navy',
    description: 'Double ristretto hangat langsung di atas susu dingin bertekstur tebal tanpa es batu.',
    price: 35000,
    formattedPrice: 'Rp35.000',
    subtext: 'Chilled Glass',
    image: '/assets/img/photos/product-dirty-latte.jpg',
    alt: 'Dirty Latte disajikan dingin berlapis double ristretto pekat di atas susu',
  },
  {
    id: 'es-kopi-susu',
    name: 'Es Kopi Susu',
    category: 'coffee',
    categoryLabel: 'Coffee',
    badge: 'Daily Favorite',
    badgeType: 'accent',
    description: 'Kopi susu gula aren klasik yang seimbang—kopinya terasa jelas, manisnya pas untuk sepanjang hari.',
    price: 26000,
    formattedPrice: 'Rp26.000',
    subtext: 'Iced Only',
    image: '/assets/img/photos/product-es-kopi-susu.jpg',
    alt: 'Es Kopi Susu Gula Aren dalam gelas tinggi dengan lapisan gula aren di dasar',
  },
  {
    id: 'matcha-oat',
    name: 'Matcha Oat Latte',
    category: 'non-coffee',
    categoryLabel: 'Non-Coffee',
    description: 'Matcha ceremonial yang dikocok halus bersama susu oat creamy, lembut tanpa rasa pahit berlebih.',
    price: 36000,
    formattedPrice: 'Rp36.000',
    subtext: 'Dairy Free',
    image: '/assets/img/photos/product-matcha-oat.jpg',
    alt: 'Segelas Matcha Oat Latte berlapis teh hijau ceremonial dan susu oat dingin',
  },
  {
    id: 'tahu-lada-garam',
    name: 'Tahu Lada Garam',
    category: 'food',
    categoryLabel: 'Food & Snack',
    badge: 'Nobar Buddy',
    badgeType: 'accent',
    description: 'Tahu lembut luar renyah dengan tumisan bawang putih goreng, cabai merah, dan garam lada gurih.',
    price: 26000,
    formattedPrice: 'Rp26.000',
    subtext: 'Sharing Bowl',
    image: '/assets/img/photos/product-tahu-lada-garam.jpg',
    alt: 'Tahu Lada Garam goreng renyah bertabur bawang putih goreng, cabai, dan daun bawang',
  },
  {
    id: 'pisang-wijen',
    name: 'Pisang Goreng Wijen',
    category: 'food',
    categoryLabel: 'Food & Snack',
    badge: 'Best Seller',
    badgeType: 'accent',
    description: 'Pisang goreng garing bertabur wijen sangrai wangi, nikmat disantap selagi hangat bersama kopi hitam.',
    price: 25000,
    formattedPrice: 'Rp25.000',
    subtext: '4 Pcs',
    image: '/assets/img/photos/product-pisang-wijen.jpg',
    alt: 'Pisang Goreng Wijen hangat dengan cocolan gula aren cair di piring keramik',
  },
  {
    id: 'nasi-ayam',
    name: 'Nasi Ayam',
    category: 'food',
    categoryLabel: 'Food & Snack',
    badge: 'Comfort Meal',
    badgeType: 'navy',
    description: 'Nasi hangat dengan ayam panggang gurih, telur mata sapi, dan sambal rumahan untuk makan kenyang.',
    price: 42000,
    formattedPrice: 'Rp42.000',
    subtext: 'Main Course',
    image: '/assets/img/photos/product-nasi-ayam.jpg',
    alt: 'Nasi Ayam Monokala berisi nasi hangat, ayam panggang gurih, telur mata sapi, dan lalapan',
  },
];

export const EVENTS: EventItem[] = [
  {
    id: 'monobar-persib-persija',
    title: 'Monobar: Persib vs Persija',
    category: 'monobar',
    categoryLabel: 'Monobar',
    status: 'upcoming',
    badge: 'Monobar',
    badgeType: 'navy',
    quotaText: 'Sisa 12 kursi',
    date: 'Sabtu, 23 Mei 2026',
    time: '18:30 WIB',
    location: 'Ruang Utama Monokala Coffee',
    priceInfo: 'HTM Rp35.000 (Termasuk Es Kopi Susu)',
    description: 'Nonton bareng laga klasik Liga Indonesia di layar proyektor penuh dengan tata suara menggelegar.',
    image: '/assets/img/photos/event-monobar.jpg',
    alt: 'Penonton Monobar menonton laga Persib vs Persija di Monokala Coffee',
  },
  {
    id: 'sunday-run-chill',
    title: 'Sunday Run & Chill 5K',
    category: 'run',
    categoryLabel: 'Run & Chill',
    status: 'upcoming',
    badge: 'Run & Chill',
    badgeType: 'accent',
    quotaText: 'Sisa 18 slot',
    date: 'Minggu, 24 Mei 2026',
    time: '06:00 WIB',
    location: 'Start & Finish: Monokala Coffee',
    priceInfo: 'Free (Titip Barang Gratis di Kasir)',
    description: 'Kolaborasi komunitas lari santai rute 5K dengan pacer ramah pemula, lanjut ngopi bareng di halaman kafe.',
    image: '/assets/img/photos/event-run.jpg',
    alt: 'Pelari berkumpul di halaman depan Monokala sebelum memulai Sunday Run & Chill 5K',
  },
  {
    id: 'color-expert-class',
    title: 'Color Expert Class',
    category: 'workshop',
    categoryLabel: 'Class & Workshop',
    status: 'upcoming',
    badge: 'Class & Workshop',
    badgeType: 'default',
    quotaText: 'Sisa 6 kursi',
    date: 'Sabtu, 30 Mei 2026',
    time: '14:00 WIB',
    location: 'Meja Panjang Lantai 2, Monokala',
    priceInfo: 'HTM Rp145.000 (Free 1 Minuman & Snack)',
    description: 'Workshop interaktif analisis warna kulit dan panduan memilih busana sehari-hari bersama Color Stylist.',
    image: '/assets/img/photos/event-workshop.jpg',
    alt: 'Peserta Color Expert Class berdiskusi menggunakan kartu swatch warna di meja komunal',
  },
  {
    id: 'monotalk-5-karier',
    title: 'Monotalk #5: Kerja Santai Tapi Jalan Terus',
    category: 'monotalk',
    categoryLabel: 'Monotalk',
    status: 'upcoming',
    badge: 'Monotalk',
    badgeType: 'navy',
    quotaText: 'Sisa 15 kursi',
    date: 'Jumat, 5 Juni 2026',
    time: '19:30 WIB',
    location: 'Area Indoor Monokala Coffee',
    priceInfo: 'Free (Cukup Pesan 1 Menu Apa Saja)',
    description: 'Bincang santai #Inikatamereka bersama pekerja kreatif tentang membangun karier berkelanjutan tanpa burnout.',
    image: '/assets/img/photos/event-monotalk.jpg',
    alt: 'Suasana talkshow intim Monotalk bersama narasumber dan pengunjung di Monokala Coffee',
  },
  {
    id: 'monobar-spanyol-argentina',
    title: 'Monobar: Spanyol vs Argentina',
    category: 'monobar',
    categoryLabel: 'Monobar',
    status: 'upcoming',
    badge: 'Monobar',
    badgeType: 'navy',
    quotaText: 'Sisa 20 kursi',
    date: 'Minggu, 14 Juni 2026',
    time: '01:00 WIB',
    location: 'Ruang Utama Monokala Coffee',
    priceInfo: 'HTM Rp40.000 (Termasuk Kopi & Snack)',
    description: 'Big match dini hari yang seru! Dapur tetap buka dengan Tahu Lada Garam dan kopi penyegar mata.',
    image: '/assets/img/photos/event-monobar.jpg',
    alt: 'Nobar pertandingan internasional Spanyol vs Argentina bersama komunitas di Monokala',
  },
  {
    id: 'monotalk-4-arsip',
    title: 'Monotalk #4: Cerita Suporter Kota',
    category: 'monotalk',
    categoryLabel: 'Monotalk',
    status: 'past',
    badge: 'Completed',
    badgeType: 'default',
    date: '18 April 2026',
    location: 'Monokala Coffee',
    priceInfo: 'Selesai',
    description: 'Diikuti lebih dari 45 peserta yang berbagi kisah membangun budaya nobar yang aman dan hangat.',
    image: '/assets/img/photos/event-monotalk.jpg',
    alt: 'Arsip sesi Monotalk #4 tentang sepak bola dan budaya suporter kota',
  },
  {
    id: 'sunday-run-vol-11',
    title: 'Sunday Run & Chill Vol. 11',
    category: 'run',
    categoryLabel: 'Run & Chill',
    status: 'past',
    badge: 'Completed',
    badgeType: 'default',
    date: '12 April 2026',
    location: 'Monokala Coffee',
    priceInfo: 'Selesai',
    description: 'Lebih dari 60 pelari hadir meramaikan rute pagi dan sarapan pisang wijen bersama di halaman kafe.',
    image: '/assets/img/photos/event-run.jpg',
    alt: 'Arsip Sunday Run edisi April 2026 bersama komunitas pelari kota',
  },
];

export const MOMENTS: MomentItem[] = [
  {
    id: 'moment-nobar',
    image: '/assets/img/photos/event-monobar.jpg',
    alt: 'Sorak riuh pengunjung Monobar merayakan gol di depan layar proyektor',
    caption: 'Keseruan nonton bareng laga besar dengan layar proyektor lebar di ruang utama Monokala.',
    category: 'komunitas',
    categoryLabel: 'Komunitas',
  },
  {
    id: 'moment-run',
    image: '/assets/img/photos/event-run.jpg',
    alt: 'Komunitas pelari berfoto dan peregangan di depan kedai Monokala Coffee',
    caption: 'Start pukul 06.00 WIB bareng pelari kota, ditutup sarapan hangat dan es kopi susu dingin.',
    category: 'komunitas',
    categoryLabel: 'Komunitas',
  },
  {
    id: 'moment-workshop',
    image: '/assets/img/photos/event-workshop.jpg',
    alt: 'Peserta workshop membandingkan palet warna kain bersama mentor di meja kayu',
    caption: 'Sesi interaktif menentukan palet warna harian bersama mentor sambil menikmati kopi hangat.',
    category: 'suasana',
    categoryLabel: 'Suasana',
  },
  {
    id: 'moment-monotalk',
    image: '/assets/img/photos/event-monotalk.jpg',
    alt: 'Pembicara Monotalk memegang mikrofon berbagi cerita bersama audiens di Monokala',
    caption: 'Bincang malam tanpa sekat panggung—audiens bebas bertanya dan saling bertukar cerita.',
    category: 'suasana',
    categoryLabel: 'Suasana',
  },
  {
    id: 'moment-ambience',
    image: '/assets/img/photos/hero-monokala.jpg',
    alt: 'Pengunjung berkumpul mengobrol di meja komunal kayu saat sore di Monokala',
    caption: 'Suasana hangat di meja komunal sebelum kickoff dimulai—saling sapa dan pesan menu favorit.',
    category: 'suasana',
    categoryLabel: 'Suasana',
  },
  {
    id: 'moment-bar-class',
    image: '/assets/img/photos/product-dirty-latte.jpg',
    alt: 'Segelas Dirty Latte hasil racikan sesi kelas seduh di bar Monokala',
    caption: 'Sesi kelas kopi santai mengenali ekstraksi espresso dan paduan susu dingin di bar Monokala.',
    category: 'barista',
    categoryLabel: 'Barista',
  },
  {
    id: 'moment-post-run',
    image: '/assets/img/photos/product-es-kopi-susu.jpg',
    alt: 'Segelas Es Kopi Susu Gula Aren segar untuk pelari usai garis finis di Monokala',
    caption: 'Hadiah paling dicari setelah menuntaskan lari 5 kilometer di Minggu pagi bareng komunitas.',
    category: 'komunitas',
    categoryLabel: 'Komunitas',
  },
  {
    id: 'moment-snack-talk',
    image: '/assets/img/photos/product-tahu-lada-garam.jpg',
    alt: 'Sepiring Tahu Lada Garam menemani sesi tanya jawab Monotalk malam',
    caption: 'Obrolan malam makin hidup ditemani sepiring camilan gurih di tengah meja.',
    category: 'suasana',
    categoryLabel: 'Suasana',
  },
];

export const MONOTALK_EPISODES: MonotalkEpisode[] = [
  {
    episodeNumber: 'Episode #1',
    title: 'Mulai Komunitas dari Nol Tanpa Budget Besar',
    description: 'Bincang bareng pendiri klub lari lokal tentang konsistensi kumpul tiap Minggu pagi sejak hanya 4 orang.',
    tag: '#Inikatamereka',
  },
  {
    episodeNumber: 'Episode #2',
    title: 'Hidup Sehat di Tengah Deadline Pekerjaan',
    description: 'Berbagi cara realistis menjaga ritme istirahat, olahraga ringan, dan kebiasaan minum kopi yang seimbang.',
    tag: '#Inikatamereka',
  },
  {
    episodeNumber: 'Episode #3',
    title: 'Bekerja Kreatif dari Ruang Ketiga',
    description: 'Bagaimana kedai kopi bisa jadi titik temu kolaborasi lintas profesi antara desainer, penulis, dan developer.',
    tag: '#Inikatamereka',
  },
  {
    episodeNumber: 'Episode #4',
    title: 'Cerita di Balik Sepak Bola & Suporter Kota',
    description: 'Mengupas sisi humanis menonton bola bersama, menjaga atmosfer ramah, dan membangun persahabatan baru.',
    tag: '#Inikatamereka',
  },
];
