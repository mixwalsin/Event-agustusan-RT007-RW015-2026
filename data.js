/* ========================================
   SEMARAK AGUSTUS 2026 - DATA FILE
   Event Data & Configuration
   ======================================== */

const EVENT_DATA = {
    name: 'SEMARAK AGUSTUS 2026',
    subtitle: 'HUT RI KE-81',
    location: 'RT 007 RW 015 TCI 2',
    date: '2026-08-17',
    time: '07:00 - 17:00 WIB',
    tagline: 'Guyub, Sportif, Meriah, dan Digital',
    
    colors: {
        primary: '#DC143C',
        secondary: '#F5F5F5',
        accent: '#FFD700',
        dark: '#1a1a1a',
        light: '#ffffff'
    },

    korlaps: [
        { id: 1, name: 'Korlap 1', kk: 34, score: 450 },
        { id: 2, name: 'Korlap 2', kk: 47, score: 420 },
        { id: 3, name: 'Korlap 3', kk: 63, score: 380 },
        { id: 4, name: 'Korlap 4', kk: 38, score: 350 },
        { id: 5, name: 'Korlap 5', kk: 47, score: 310 }
    ],

    cabors: [
        {
            id: 1,
            name: 'Bulu Tangkis',
            icon: '🏸',
            categories: ['Dewasa', 'Remaja'],
            participants: 24,
            winner: 'Korlap 1'
        },
        {
            id: 2,
            name: 'Voli',
            icon: '🏐',
            categories: ['Dewasa', 'Pemuda'],
            participants: 18,
            winner: 'Korlap 3'
        },
        {
            id: 3,
            name: 'Futsal',
            icon: '⚽',
            categories: ['Senior', 'Junior'],
            participants: 20,
            winner: 'Korlap 2'
        },
        {
            id: 4,
            name: 'Tenis Meja',
            icon: '🏓',
            categories: ['Tunggal', 'Ganda'],
            participants: 16,
            winner: 'Korlap 4'
        },
        {
            id: 5,
            name: 'Catur',
            icon: '♟️',
            categories: ['Terbuka'],
            participants: 12,
            winner: 'Korlap 5'
        },
        {
            id: 6,
            name: 'Lari Estafet',
            icon: '🏃',
            categories: ['Keluarga'],
            participants: 30,
            winner: 'Korlap 1'
        },
        {
            id: 7,
            name: 'Lomba Anak',
            icon: '🎯',
            categories: ['4-12 tahun'],
            participants: 45,
            winner: 'Korlap 3'
        },
        {
            id: 8,
            name: 'Senam Bersama',
            icon: '💃',
            categories: ['Terbuka'],
            participants: 200,
            winner: 'Semua'
        }
    ],

    doorprizes: [
        {
            rank: 1,
            title: 'Grand Prize',
            description: 'TV LED 55"',
            emoji: '🥇',
            value: 'Rp. 5.000.000'
        },
        {
            rank: 2,
            title: '1st Prize',
            description: 'Motor Vespa',
            emoji: '🥈',
            value: 'Rp. 15.000.000'
        },
        {
            rank: 3,
            title: '2nd Prize',
            description: 'Sepeda Motor 125cc',
            emoji: '🥉',
            value: 'Rp. 12.000.000'
        },
        {
            rank: 4,
            title: '3rd Prize',
            description: 'Kulkas 2 Pintu',
            emoji: '🎯',
            value: 'Rp. 3.500.000'
        },
        {
            rank: 5,
            title: '4th Prize',
            description: 'Paket Liburan Keluarga',
            emoji: '💝',
            value: 'Rp. 2.500.000'
        },
        {
            rank: 6,
            title: '5th Prize',
            description: 'Set Gadget Premium',
            emoji: '🏅',
            value: 'Rp. 2.000.000'
        }
    ],

    sponsors: [
        { name: 'PT Maju Jaya', icon: '🏢', category: 'Sponsor Utama', contact: '0812345678' },
        { name: 'Toko Elektronik Jaya', icon: '📺', category: 'Sponsor Resmi', contact: '0812345679' },
        { name: 'Warung Mak Ayu', icon: '🍜', category: 'UMKM Kuliner', contact: '0812345680' },
        { name: 'Toko Kerajinan Rakyat', icon: '🎨', category: 'UMKM Kerajinan', contact: '0812345681' },
        { name: 'Apotek Kesehatan', icon: '💊', category: 'Mitra Kesehatan', contact: '0812345682' },
        { name: 'Toko Kue Tradisional', icon: '🍰', category: 'UMKM Makanan', contact: '0812345683' }
    ],

    timeline: [
        {
            phase: 'H-90 s/d H-60',
            title: 'Fase Persiapan',
            emoji: '📋',
            activities: [
                'Pembentukan Panitia',
                'Brainstorming Konsep',
                'Penetapan Budget',
                'Perizinan'
            ]
        },
        {
            phase: 'H-60 s/d H-30',
            title: 'Fase Pengembangan',
            emoji: '🎯',
            activities: [
                'Pembentukan Divisi',
                'Penyusunan Rundown',
                'Pengadaan Barang',
                'Koordinasi Sponsor'
            ]
        },
        {
            phase: 'H-30 s/d H-7',
            title: 'Fase Finalisasi',
            emoji: '🔨',
            activities: [
                'Pembangunan Infrastructure',
                'Publikasi Online',
                'Rekrutmen Peserta',
                'Training Panitia'
            ]
        },
        {
            phase: 'H-7 s/d H-1',
            title: 'Fase Teknis',
            emoji: '⚡',
            activities: [
                'Setup Lapangan',
                'Test Sound & Lighting',
                'Uji Coba Sistem',
                'Briefing Akhir'
            ]
        },
        {
            phase: 'H-Day (17 Agustus)',
            title: 'Fase Pelaksanaan',
            emoji: '🎉',
            activities: [
                'Pembukaan Resmi 07:00',
                'Senam Bersama',
                'Kompetisi Olahraga',
                'Undian Doorprize 16:00',
                'Penutupan 17:00'
            ]
        },
        {
            phase: 'H+1 s/d H+14',
            title: 'Fase Evaluasi & LPJ',
            emoji: '📊',
            activities: [
                'Dokumentasi Lengkap',
                'Verifikasi Data',
                'Pembuatan Laporan',
                'Distribusi Sertifikat',
                'LPJ ke RT/RW'
            ]
        }
    ],

    gallery: [
        { title: 'Pembukaan Acara', emoji: '🎉', category: 'Upacara' },
        { title: 'Senam Pagi', emoji: '🤸', category: 'Olahraga' },
        { title: 'Voli Putri', emoji: '🏐', category: 'Cabor' },
        { title: 'Futsal Seru', emoji: '⚽', category: 'Cabor' },
        { title: 'Lari Estafet', emoji: '🏃', category: 'Cabor' },
        { title: 'Bulu Tangkis', emoji: '🏸', category: 'Cabor' },
        { title: 'Doorprize Meriah', emoji: '🎁', category: 'Undian' },
        { title: 'Penutupan', emoji: '🏁', category: 'Upacara' }
    ],

    statistics: {
        totalKK: 276,
        totalParticipants: 365,
        totalCabor: 8,
        totalKorlap: 5,
        expectedVisitors: 1000
    }
};

// Logging untuk debugging
console.log('%c🇮🇩 SEMARAK AGUSTUS 2026', 'color: #DC143C; font-size: 18px; font-weight: bold;');
console.log('Event Data Loaded Successfully!');
console.log('Total Korlap:', EVENT_DATA.korlaps.length);
console.log('Total Cabor:', EVENT_DATA.cabors.length);
console.log('Event Date:', EVENT_DATA.date);
console.table(EVENT_DATA.statistics);