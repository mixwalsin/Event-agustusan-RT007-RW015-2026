# 🇮🇩 SEMARAK AGUSTUS 2026 - Microsite Event Agustusan Digital

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with](https://img.shields.io/badge/Made%20with-HTML%20CSS%20JS-red?logo=html5)](https://developer.mozilla.org/)
[![GitHub Pages](https://img.shields.io/badge/Published%20on-GitHub%20Pages-brightgreen?logo=github)](https://pages.github.com/)

> **Guyub, Sportif, Meriah, dan Digital** — Microsite profesional untuk Event Agustusan Digital 2026 HUT RI KE-81 di RT 007 RW 015 TCI 2

![Preview](https://img.shields.io/badge/Modern-Glassmorphism-blue)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20First-green)
![Theme](https://img.shields.io/badge/Theme-Merah%20Putih%20Emas-red)

## 📋 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [🎯 Spesifikasi Teknis](#-spesifikasi-teknis)
- [🚀 Cara Menggunakan](#-cara-menggunakan)
- [📁 Struktur File](#-struktur-file)
- [🎨 Desain & Tema](#-desain--tema)
- [💾 Penyimpanan Data](#-penyimpanan-data)
- [📱 Responsivitas](#-responsivitas)
- [🌐 Deploy ke GitHub Pages](#-deploy-ke-github-pages)
- [📊 Data Korlap](#-data-korlap)
- [🎮 Petunjuk Penggunaan](#-petunjuk-penggunaan)
- [🔧 Troubleshooting](#-troubleshooting)
- [📝 Lisensi](#-lisensi)

## ✨ Fitur Utama

### 1. **🎨 Landing Page Merah Putih Modern**
- Design profesional dengan gradien merah-putih-emas
- Animated hero section dengan blob animation
- Responsive untuk semua ukuran layar
- Glassmorphism UI dengan frosted glass effect

### 2. **⏱️ Countdown 17 Agustus 2026**
- Real-time countdown dengan animasi pulse
- Update setiap detik
- Tampilan hari, jam, menit, detik
- Background information event

### 3. **📌 Menu Sticky Navigation**
- Navigation bar yang sticky saat scroll
- Active link indicator
- Hamburger menu untuk mobile
- Smooth scroll ke section

### 4. **⚽ Daftar Cabang Olahraga (Cabor)**
- 8 kategori olahraga: Bulu Tangkis, Voli, Futsal, Tenis Meja, Catur, Lari Estafet, Lomba Anak, Senam
- Tombol pendaftaran untuk setiap cabor
- Data tersimpan di **localStorage** (tidak perlu server)
- Dashboard pendaftaran dengan list
- Export data ke CSV

### 5. **📊 Dashboard Cabor**
- Statistik peserta per cabang olahraga
- Juara 1 setiap cabor
- Status kompetisi
- Grid view dinamis

### 6. **🏆 Leaderboard Korlap 1-5**
- Peringkat Korlap berdasarkan poin
- Data real-time dengan statistik
- Rank badge dengan warna khusus (Gold, Silver, Bronze)
- Total KK dan poin kompetisi

### 7. **⚡ Live Score Dummy**
- Pertandingan real-time dengan score
- Status live/selesai
- Multiple match display
- Animasi badge live

### 8. **🎁 Doorprize Random Draw**
- Tombol "TARIK UNDIAN" dengan animasi spin
- Random winner selection
- Confetti animation celebration
- Display hadiah dengan No. KTP winner
- Daftar hadiah dengan emoji dan nilai

### 9. **🗳️ Voting Warga**
- Voting untuk Korlap terbaik
- Real-time voting bar dengan persentase
- Total suara per Korlap
- Penyimpanan voting di localStorage

### 10. **📷 Galeri Live**
- 8 item galeri dengan emoji placeholder
- Hover overlay dengan judul
- Responsive grid layout
- Animation on scroll

### 11. **📺 Event TV Mode**
- Streaming player placeholder
- Live viewers counter (dummy)
- Duration tracker
- Professional TV broadcast style

### 12. **🏢 Sponsor & UMKM**
- Showcase sponsor utama
- UMKM lokal partnership
- Card dengan icon dan kategori
- Hover animation

### 13. **🎫 Passport Warga**
- Form pendaftaran passport
- Data disimpan ke localStorage
- Display passport card profesional
- Informasi: Nama, KTP, Email, Telepon, Korlap
- Clear data option

### 14. **📜 Sertifikat Digital Dummy**
- Generate sertifikat dengan nama custom
- Pilih kategori (Peserta, Juara 1-3, Panitia)
- Print-friendly design
- Glassmorphism certificate design

### 15. **📅 Timeline Acara H-90 sampai LPJ**
- Timeline dari H-90 hingga H+14
- 6 fase persiapan hingga evaluasi
- Activity checklist per fase
- Emoji markers untuk visual appeal

## 🎯 Spesifikasi Teknis

| Aspek | Detail |
|-------|--------|
| **Language** | HTML5, CSS3, Vanilla JavaScript |
| **Framework** | Tanpa framework (Pure) |
| **Storage** | Browser localStorage |
| **Browser** | Chrome, Firefox, Safari, Edge (modern) |
| **Mobile** | Responsive (480px - 4K) |
| **Theme** | Merah Putih Emas |
| **Design Pattern** | Glassmorphism, Card UI |
| **Hosting** | GitHub Pages (Static) |
| **Performance** | Lightweight, Fast Loading |

## 🚀 Cara Menggunakan

### Instalasi & Setup Lokal

1. **Clone Repository**
```bash
git clone https://github.com/mixwalsin/Event-agustusan-RT007-RW015-2026.git
cd Event-agustusan-RT007-RW015-2026
```

2. **Buka di Browser**
```bash
# Menggunakan Live Server (VSCode Extension)
# Klik kanan pada index.html > Open with Live Server

# Atau buka langsung
open index.html  # macOS
start index.html # Windows
```

3. **Atau gunakan Python Server**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Lalu buka: http://localhost:8000
```

### Publish ke GitHub Pages

1. **Push ke GitHub**
```bash
git add .
git commit -m "Initial commit: Semarak Agustus 2026 Microsite"
git push origin main
```

2. **Enable GitHub Pages**
   - Buka repository settings
   - Scroll ke "Pages" section
   - Source: `main` branch
   - Klik Save

3. **Akses Microsite**
   - URL: `https://mixwalsin.github.io/Event-agustusan-RT007-RW015-2026`
   - Tunggu 1-2 menit untuk deploy

## 📁 Struktur File

```
Event-agustusan-RT007-RW015-2026/
├── index.html          # Main HTML structure (800+ lines)
├── style.css           # Complete styling (1000+ lines)
├── script.js           # JavaScript functionality (800+ lines)
├── data.js             # Event data & configuration
├── README.md           # Documentation ini
└── .gitignore          # Git ignore file (optional)
```

### File Details

| File | Size | Deskripsi |
|------|------|-----------|
| **index.html** | ~35 KB | Struktur HTML lengkap dengan 15+ section |
| **style.css** | ~42 KB | Glassmorphism, responsive, animasi |
| **script.js** | ~28 KB | Semua fitur interaktif & logic |
| **data.js** | ~7 KB | Konfigurasi data event |
| **Total** | ~112 KB | Lightweight & Fast |

## 🎨 Desain & Tema

### Color Palette

```css
--primary: #DC143C      /* Merah Crimson */
--accent: #FFD700       /* Emas Gold */
--secondary: #F5F5F5    /* Putih */
--dark: #1a1a1a         /* Hitam */
--light: #ffffff        /* Putih Terang */
```

### Design Elements

✓ **Glassmorphism** - Frosted glass effect dengan blur
✓ **Gradient** - Linear dan radial gradient effects
✓ **Card UI** - Modern card-based layout
✓ **Animations** - Smooth transitions & keyframe animations
✓ **Icons** - Emoji icons untuk visual appeal
✓ **Typography** - Modern font stacking (Segoe UI)
✓ **Shadows** - Layered shadows untuk depth

## 💾 Penyimpanan Data

Data disimpan menggunakan **Browser localStorage** (tidak perlu database/server):

```javascript
// Contoh: Simpan data
localStorage.setItem('caborRegistrations', JSON.stringify(data));

// Contoh: Ambil data
const data = JSON.parse(localStorage.getItem('caborRegistrations') || '[]');

// Contoh: Hapus data
localStorage.removeItem('caborRegistrations');
```

### Data yang Disimpan

| Data | Key | Format |
|------|-----|--------|
| **Pendaftaran Cabor** | `caborRegistrations` | JSON Array |
| **Voting Data** | `votingData` | JSON Object |
| **Passport Data** | `passportData` | JSON Object |

**Catatan**: Data hilang jika browser cache dihapus. Untuk persistent storage, gunakan server/database.

## 📱 Responsivitas

### Breakpoints

```css
Mobile: 480px - 768px
Tablet: 768px - 1024px
Desktop: 1024px+
```

### Responsive Features

✓ Hamburger menu untuk mobile
✓ Flexible grid layouts
✓ Font size scaling (clamp)
✓ Touch-friendly buttons
✓ Mobile-first design approach

## 🌐 Deploy ke GitHub Pages

### Metode 1: Automatic Deploy

1. Repository sudah di GitHub
2. Settings → Pages
3. Build and deployment: `Deploy from a branch`
4. Branch: `main` → Save
5. Selesai! Akses: `https://username.github.io/repo-name`

### Metode 2: GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### Testing Lokal Sebelum Deploy

```bash
# Mulai local server
python -m http.server 8000

# Buka browser
http://localhost:8000
```

## 📊 Data Korlap

### Statistik Korlap

| Korlap | Kepala Keluarga | Poin | Rank |
|--------|-----------------|------|------|
| **Korlap 1** | 34 KK | 450 | 🥇 1 |
| **Korlap 2** | 47 KK | 420 | 🥈 2 |
| **Korlap 3** | 63 KK | 380 | 🥉 3 |
| **Korlap 4** | 38 KK | 350 | 4 |
| **Korlap 5** | 47 KK | 310 | 5 |
| **TOTAL** | **229 KK** | **1,910** | - |

### Cabang Olahraga (8 Cabor)

1. 🏸 **Bulu Tangkis** - Dewasa, Remaja
2. 🏐 **Voli** - Dewasa, Pemuda
3. ⚽ **Futsal** - Senior, Junior
4. 🏓 **Tenis Meja** - Tunggal, Ganda
5. ♟️ **Catur** - Terbuka
6. 🏃 **Lari Estafet** - Keluarga
7. 🎯 **Lomba Anak** - 4-12 tahun
8. 💃 **Senam Bersama** - Terbuka

## 🎮 Petunjuk Penggunaan

### 1. Pendaftaran Cabor

```
1. Scroll ke section "Daftar Cabang Olahraga"
2. Klik tombol "Daftar" pada cabor pilihan
3. Data tersimpan otomatis di localStorage
4. Lihat list pendaftaran di dashboard
5. Export ke CSV jika diperlukan
```

### 2. Voting Warga

```
1. Scroll ke section "Voting Warga"
2. Klik card Korlap pilihan
3. Suara terrekam otomatis
4. Lihat real-time voting results
5. Refresh halaman, data tetap tersimpan
```

### 3. Doorprize Draw

```
1. Scroll ke section "Doorprize"
2. Siapkan No. KTP peserta
3. Klik tombol "TARIK UNDIAN"
4. Spin animation berputar
5. Pemenang ditampilkan dengan confetti
```

### 4. Daftar Passport

```
1. Scroll ke section "Passport Warga"
2. Isi form dengan data lengkap
3. Klik "Daftar Passport"
4. Kartu passport langsung ditampilkan
5. Bisa dihapus dengan tombol "Hapus Data"
```

### 5. Generate Sertifikat

```
1. Scroll ke section "Sertifikat Digital"
2. Masukkan nama
3. Pilih kategori
4. Klik "Generate Sertifikat"
5. Klik "Cetak Sertifikat" untuk print
```

## 🔧 Troubleshooting

### ❌ Masalah: Data hilang setelah refresh

**Solusi:**
- Pastikan browser bukan private/incognito mode
- Cek localStorage quota (biasanya 5-10MB)
- Clear cache dan coba lagi

### ❌ Masalah: Countdown tidak jalan

**Solusi:**
```javascript
// Edit di script.js baris ~120
const eventDate = new Date('2026-08-17T00:00:00').getTime();
```

### ❌ Masalah: Styling tidak muncul

**Solusi:**
- Pastikan style.css dan script.js di folder yang sama
- Clear browser cache (Ctrl+Shift+Del)
- Reload halaman (Ctrl+F5)

### ❌ Masalah: GitHub Pages tidak deploy

**Solusi:**
1. Pastikan branch adalah `main` (bukan `master`)
2. Tunggu 1-2 menit setelah push
3. Cek GitHub Pages settings
4. Refresh halaman GitHub Pages

### ❌ Masalah: Confetti tidak muncul

**Solusi:**
- Update browser ke versi terbaru
- Pastikan canvas element di HTML
- Cek browser console untuk error

## 📝 Lisensi

MIT License - Bebas digunakan untuk keperluan komersial dan non-komersial.

## 👨‍💻 Author

**Nurhasan (@mixwalsin)**
- GitHub: [@mixwalsin](https://github.com/mixwalsin)
- Event: SEMARAK AGUSTUS 2026 - HUT RI KE-81
- Location: RT 007 RW 015 TCI 2

## 🎯 Event Details

- **📅 Tanggal**: 17 Agustus 2026
- **⏰ Waktu**: 07:00 - 17:00 WIB
- **📍 Lokasi**: Lapangan RT 007 RW 015 TCI 2
- **🏳️ Tema**: HUT RI KE-81
- **✨ Tagline**: Guyub, Sportif, Meriah, dan Digital

## 🤝 Kontribusi

Silakan fork repository ini dan buat pull request untuk perbaikan atau fitur tambahan.

## ⭐ Support

Jika microsite ini bermanfaat, jangan lupa beri star ⭐ di GitHub!

---

## 🖥️ Setup Backend PHP 8.2 + MySQL (XAMPP)

Backend API PHP tersedia di folder `api/` dan mendukung koneksi dari GitHub Pages maupun lokal.

### 1. Cara Install XAMPP PHP 8.2

1. Unduh XAMPP versi 8.2.x dari [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
2. Jalankan installer, pilih komponen: **Apache**, **MySQL**, **PHP**
3. Install ke direktori default (`C:\xampp` di Windows atau `/opt/lampp` di Linux)
4. Buka **XAMPP Control Panel** → klik **Start** pada **Apache** dan **MySQL**

### 2. Cara Taruh Project di htdocs

```bash
# Copy folder project ke:
C:\xampp\htdocs\Event-agustusan-RT007-RW015-2026\
# atau clone langsung:
cd C:\xampp\htdocs
git clone https://github.com/mixwalsin/Event-agustusan-RT007-RW015-2026.git
```

### 3. Cara Buat Database di phpMyAdmin

1. Buka browser → `http://localhost/phpmyadmin`
2. Klik **New** di sidebar kiri
3. Isi nama database: `agustusan_rt007_2026`
4. Pilih collation: `utf8mb4_unicode_ci`
5. Klik **Create**

### 4. Cara Import File SQL

1. Di phpMyAdmin, klik database `agustusan_rt007_2026`
2. Klik tab **Import**
3. Klik **Choose File** → pilih file `database/agustusan_rt007_2026.sql`
4. Klik **Import** (tombol biru bawah halaman)

> File SQL sudah berisi semua tabel, foreign key, dan data seed awal termasuk **1 akun admin default**.

**Kredensial Admin Default:**
- Username: `admin`
- Password: `Admin@2026`
- ⚠️ **Segera ganti password** setelah pertama login via `admin.html`!

Untuk generate hash baru jika lupa password, jalankan di CLI PHP:
```php
php -r "echo password_hash('PasswordBaru123!', PASSWORD_DEFAULT);"
```
Lalu UPDATE tabel `admin` di phpMyAdmin.

### 5. Cara Test API

Setelah XAMPP berjalan dan database diimport:

```bash
# Buka browser atau gunakan curl:
GET  http://localhost/Event-agustusan-RT007-RW015-2026/api/pengumuman.php
GET  http://localhost/Event-agustusan-RT007-RW015-2026/api/leaderboard.php
GET  http://localhost/Event-agustusan-RT007-RW015-2026/api/peserta.php

# Test POST (gunakan curl atau Postman):
curl -X POST http://localhost/Event-agustusan-RT007-RW015-2026/api/login.php \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"Admin@2026"}'
```

Semua API mengembalikan JSON dengan format:
```json
{ "success": true, "data": [...] }
```

### 6. Cara Ubah API_BASE_URL untuk Hosting

File `js/api.js` secara **otomatis** memilih URL berdasarkan hostname:
- Jika diakses dari `localhost` atau `127.0.0.1` → gunakan URL XAMPP lokal
- Jika diakses dari domain lain (GitHub Pages, dsb.) → gunakan URL hosting

Untuk mengaktifkan URL hosting, ubah baris berikut di `js/api.js`:

```javascript
// Ubah URL ini sesuai domain cPanel Anda:
return 'https://yourdomain.com/api';
```

### 7. Cara Upload Backend ke cPanel

1. Login ke cPanel → **File Manager**
2. Masuk ke `public_html/` (atau subdomain)
3. Upload seluruh folder `api/` dan `database/`
4. Buat database MySQL baru via **MySQL Databases** di cPanel
5. Import file `database/agustusan_rt007_2026.sql` via **phpMyAdmin** di cPanel
6. Edit `api/config.php` sesuai kredensial database hosting:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'cpanel_user_dbname');
   define('DB_PASS', 'password_database');
   define('DB_NAME', 'cpanel_user_agustusan');
   ```

### 8. Cara Tetap Memakai GitHub Pages sebagai Frontend

Frontend (HTML/CSS/JS) tetap berjalan di GitHub Pages. Yang perlu diubah:

1. Pastikan `api/config.php` sudah menambahkan origin GitHub Pages ke daftar CORS:
   ```php
   $allowedOrigins = [
       'https://mixwalsin.github.io',  // ← sudah ada
       'http://localhost',
   ];
   ```
2. Update `js/api.js` dengan URL API backend hosting:
   ```javascript
   const API_BASE_URL = "https://yourdomain.com/api";
   ```
3. Push perubahan `js/api.js` ke GitHub → GitHub Pages otomatis update
4. Frontend akan fetch data ke backend hosting; jika gagal, fallback ke `data.js`

---

## 📁 Struktur File (Updated)

```
Event-agustusan-RT007-RW015-2026/
├── index.html          # Halaman utama / beranda
├── hasil.html          # Halaman hasil event
├── admin.html          # Admin panel (login required)
├── event-tv.html       # Tampilan TV / display publik (auto-refresh 30 det)
├── style.css           # Stylesheet utama (glassmorphism)
├── script.js           # Script utama (integrasi API + fallback)
├── hasil-script.js     # Script halaman hasil (integrasi API + fallback)
├── data.js             # Data statis fallback
├── js/
│   └── api.js          # Frontend API wrapper (fetch ke PHP backend)
├── api/                # Backend PHP 8.2
│   ├── config.php      # Konfigurasi PDO, CORS, helper response
│   ├── login.php       # Auth admin
│   ├── peserta.php     # CRUD peserta
│   ├── cabor.php       # CRUD cabang olahraga
│   ├── jadwal.php      # CRUD jadwal pertandingan
│   ├── skor.php        # CRUD skor live
│   ├── leaderboard.php # Klasemen korlap
│   ├── juara.php       # CRUD daftar juara
│   ├── doorprize.php   # CRUD doorprize + pemenang
│   ├── voting.php      # Sistem voting
│   ├── galeri.php      # CRUD galeri foto
│   ├── sponsor.php     # CRUD sponsor / UMKM
│   ├── pengumuman.php  # CRUD pengumuman
│   └── log.php         # Log aktivitas (GET only)
└── database/
    └── agustusan_rt007_2026.sql  # Skema + seed data MySQL
```

---

**Made with ❤️ for SEMARAK AGUSTUS 2026**


**🇮🇩 Indonesia Raya! Merdeka! Merdeka! Merdeka!**