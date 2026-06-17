# 🔧 Backend Setup Guide - Semarak Agustus 2026

## 📋 Daftar Isi

1. [Install XAMPP PHP 8.2](#install-xampp-php-82)
2. [Setup Project di htdocs](#setup-project-di-htdocs)
3. [Buat Database di phpMyAdmin](#buat-database-di-phpmyadmin)
4. [Import File SQL](#import-file-sql)
5. [Test API](#test-api)
6. [Konfigurasi untuk Production](#konfigurasi-untuk-production)
7. [Upload ke cPanel](#upload-ke-cpanel)
8. [Integrasi Frontend & Backend](#integrasi-frontend--backend)
9. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Install XAMPP PHP 8.2

### Windows

1. **Download XAMPP** dari https://www.apachefriends.org/download.html
   - Pilih versi dengan PHP 8.2

2. **Jalankan installer**
   - Klik Next sampai selesai
   - Pilih direktori instalasi (default: `C:\xampp`)

3. **Buka XAMPP Control Panel**
   - Klik tombol **Start** untuk Apache dan MySQL
   - Status harus hijau (running)

4. **Verifikasi instalasi**
   ```bash
   php -v
   # Output: PHP 8.2.x
   ```

### macOS

1. **Download XAMPP** dari https://www.apachefriends.org/download.html

2. **Install**
   ```bash
   open XAMPP*.dmg
   # Drag ke Applications folder
   ```

3. **Jalankan XAMPP Manager**
   ```bash
   /Applications/XAMPP/manager-osx
   ```

4. **Mulai Apache & MySQL**

### Linux

```bash
# Download
cd Downloads
wget https://www.apachefriends.org/xampp-files/..../xampp-linux-x64.run

# Install
sudo chmod +x xampp-linux-x64.run
sudo ./xampp-linux-x64.run

# Start
sudo /opt/lampp/manager-linux-x64.run
```

---

## 2️⃣ Setup Project di htdocs

### Lokasi Folder htdocs

- **Windows**: `C:\xampp\htdocs\`
- **macOS**: `/Applications/XAMPP/htdocs/`
- **Linux**: `/opt/lampp/htdocs/`

### Cara Setup

1. **Clone/copy project ke htdocs**
   ```bash
   cd C:\xampp\htdocs  # Windows
   git clone https://github.com/mixwalsin/Event-agustusan-RT007-RW015-2026.git
   ```

2. **Struktur folder seharusnya**
   ```
   C:\xampp\htdocs\Event-agustusan-RT007-RW015-2026\
   ├── index.html
   ├── admin.html
   ├── hasil.html
   ├── event-tv.html
   ├── css/
   ├── js/
   │   ├── api.js
   │   ├── script.js
   │   └── ...
   ├── api/
   │   ├── config.php
   │   ├── login.php
   │   ├── peserta.php
   │   ├── ...
   │   └── log.php
   └── database/
       └── agustusan_rt007_2026.sql
   ```

3. **Akses melalui browser**
   ```
   http://localhost/Event-agustusan-RT007-RW015-2026
   ```

---

## 3️⃣ Buat Database di phpMyAdmin

1. **Buka phpMyAdmin**
   ```
   http://localhost/phpmyadmin
   ```

2. **Login** (default: username `root`, password kosong)

3. **Buat database baru**
   - Klik menu **Database**
   - Nama database: `agustusan_rt007_2026`
   - Charset: `utf8mb4_unicode_ci`
   - Klik **Create**

---

## 4️⃣ Import File SQL

1. **Dari phpMyAdmin**
   - Pilih database `agustusan_rt007_2026`
   - Klik tab **Import**
   - Choose file: `database/agustusan_rt007_2026.sql`
   - Klik **Go**

2. **Alternatif: Dari command line**
   ```bash
   mysql -u root agustusan_rt007_2026 < database/agustusan_rt007_2026.sql
   ```

3. **Verifikasi import**
   - Refresh phpMyAdmin
   - Seharusnya ada 14 tabel:
     - admin
     - korlap
     - cabor
     - peserta
     - jadwal
     - skor
     - juara
     - leaderboard
     - doorprize
     - doorprize_winner
     - voting
     - voting_log
     - sponsor
     - galeri
     - pengumuman
     - log_aktivitas

---

## 5️�� Test API

### Test Login

```bash
curl -X POST http://localhost/Event-agustusan-RT007-RW015-2026/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Response yang diharapkan:**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "id": 1,
    "username": "admin",
    "nama": "Admin Utama",
    "email": "admin@agustusan.local",
    "role": "super_admin",
    "token": "..."
  }
}
```

### Test Get Peserta

```bash
curl http://localhost/Event-agustusan-RT007-RW015-2026/api/peserta.php
```

### Test Get Cabor

```bash
curl http://localhost/Event-agustusan-RT007-RW015-2026/api/cabor.php
```

### Test Posting Data

```bash
curl -X POST http://localhost/Event-agustusan-RT007-RW015-2026/api/peserta.php \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Budi Santoso",
    "email": "budi@example.com",
    "no_telepon": "081234567890",
    "korlap_id": 1,
    "cabor_id": 1,
    "jenis_kelamin": "laki-laki"
  }'
```

---

## 6️⃣ Konfigurasi untuk Production

### Update api/config.php

```php
// Database Configuration
define('DB_HOST', 'your-cPanel-host');  // Biasanya: localhost
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');
define('DB_NAME', 'agustusan_rt007_2026');
define('DB_PORT', 3306);
```

### Update js/api.js

```javascript
// Untuk production, ubah:
const API_BASE_URL = "https://yourdomain.com/api";

// Atau jika di subfolder:
const API_BASE_URL = "https://yourdomain.com/path/to/api";
```

### Password Admin

Default password `admin123` di-hash dengan `password_hash()`. Untuk change:

1. Buka phpMyAdmin
2. Pilih tabel `admin`
3. Edit row dengan username `admin`
4. Ubah field `password`
5. Masukkan hash baru (gunakan online tool atau PHP)

**Generate hash di PHP:**
```php
<?php
echo password_hash('password-baru', PASSWORD_BCRYPT);
?>
```

---

## 7️⃣ Upload ke cPanel

### Via FTP

1. **Download FTP Client** (WinSCP, FileZilla, Cyberduck, dll)

2. **Koneksi ke cPanel**
   - Host: `your-domain.com` atau `your-ftp-address.com`
   - Username: cPanel username
   - Password: cPanel password
   - Port: 21 (FTP) atau 22 (SFTP)

3. **Upload folder project**
   ```
   /public_html/Event-agustusan-RT007-RW015-2026/
   ```

### Via cPanel File Manager

1. Login ke cPanel
2. Buka **File Manager**
3. Navigate ke `public_html`
4. Upload project folder
5. Extract jika upload sebagai ZIP

### Via SSH

```bash
# Login ke server
ssh username@your-domain.com

# Navigate ke public_html
cd public_html

# Clone dari GitHub
git clone https://github.com/mixwalsin/Event-agustusan-RT007-RW015-2026.git
```

---

## 8️⃣ Integrasi Frontend & Backend

### Update js/api.js di Production

```javascript
// Ubah dari:
const API_BASE_URL = "http://localhost/Event-agustusan-RT007-RW015-2026/api";

// Menjadi:
const API_BASE_URL = "https://yourdomain.com/Event-agustusan-RT007-RW015-2026/api";
```

### Frontend tetap di GitHub Pages

Jika frontend tetap di GitHub Pages:

1. **Fork/clone repo**
   ```bash
   git clone https://github.com/mixwalsin/Event-agustusan-RT007-RW015-2026.git
   cd Event-agustusan-RT007-RW015-2026
   ```

2. **Update js/api.js**
   ```javascript
   const API_BASE_URL = "https://your-cPanel-domain.com/api";
   ```

3. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

4. **Enable GitHub Pages**
   - Repository Settings → Pages
   - Source: `main` branch
   - Akses: `https://username.github.io/Event-agustusan-RT007-RW015-2026`

---

## 9️⃣ Troubleshooting

### ❌ "CORS Error"

**Masalah**: Request dari GitHub Pages ke API di cPanel ditolak

**Solusi**: CORS headers sudah ada di `api/config.php`:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

**Jika masih error**:
1. Pastikan `.htaccess` memungkinkan CORS
2. Contact hosting provider untuk enable mod_headers

### ❌ "Database connection failed"

**Masalah**: Koneksi ke MySQL gagal

**Solusi**:
1. Pastikan MySQL running (XAMPP Control Panel)
2. Check credentials di `api/config.php`
3. Database `agustusan_rt007_2026` sudah dibuat
4. Cek di phpMyAdmin

### ❌ "404 Not Found"

**Masalah**: API endpoint tidak ditemukan

**Solusi**:
1. Check URL di `js/api.js`
2. Pastikan folder `api/` ada dan file `.php` lengkap
3. Check file permissions (755)

### ❌ "localStorage fallback muncul"

**Masalah**: Data tidak disimpan ke database

**Solusi**: API belum tersedia
1. Cek di browser Console (F12)
2. Lihat pesan "API Status"
3. Check konfigurasi API_BASE_URL
4. Test dengan curl command di atas

### ❌ "PHP version mismatch"

**Masalah**: PHP version bukan 8.2

**Solusi**:
1. Download XAMPP dengan PHP 8.2
2. Atau upgrade XAMPP existing
3. Verify: `php -v` harus menunjukkan 8.2.x

### ❌ "PDO Extension not found"

**Masalah**: PDO driver tidak aktif

**Solusi**:
1. Buka file `php.ini` (XAMPP/php/php.ini)
2. Uncomment baris:
   ```ini
   extension=pdo_mysql
   ```
3. Restart Apache di XAMPP Control Panel

---

## 🎯 Testing Checklist

- [ ] XAMPP berjalan (Apache & MySQL hijau)
- [ ] phpMyAdmin accessible
- [ ] Database `agustusan_rt007_2026` dibuat
- [ ] 14 tabel ada di database
- [ ] Login API berhasil
- [ ] Get peserta/cabor/jadwal berhasil
- [ ] Post peserta berhasil simpan ke DB
- [ ] Admin panel loading
- [ ] Data form bisa dikirim ke API
- [ ] Export CSV berfungsi
- [ ] Voting/doorprize berfungsi

---

## 📚 API Documentation

### Base URL
```
http://localhost/Event-agustusan-RT007-RW015-2026/api
```

### Response Format
```json
{
  "status": "success" | "error",
  "message": "String description",
  "data": {}
}
```

### Endpoints

#### Authentication
- `POST /login.php` - Login admin

#### Peserta
- `GET /peserta.php` - Get all peserta
- `POST /peserta.php` - Add peserta
- `PUT /peserta.php?id=X` - Update peserta
- `DELETE /peserta.php?id=X` - Delete peserta

#### Cabor
- `GET /cabor.php` - Get all cabor
- `POST /cabor.php` - Add cabor
- `PUT /cabor.php?id=X` - Update cabor
- `DELETE /cabor.php?id=X` - Delete cabor

#### Jadwal
- `GET /jadwal.php` - Get all jadwal
- `POST /jadwal.php` - Add jadwal
- `PUT /jadwal.php?id=X` - Update jadwal
- `DELETE /jadwal.php?id=X` - Delete jadwal

#### Skor
- `GET /skor.php` - Get all skor
- `POST /skor.php` - Add skor
- `PUT /skor.php?id=X` - Update skor
- `DELETE /skor.php?id=X` - Delete skor

#### Leaderboard
- `GET /leaderboard.php` - Get leaderboard
- `POST /leaderboard.php` - Recalculate leaderboard

#### Doorprize
- `GET /doorprize.php` - Get all doorprize
- `POST /doorprize.php` - Add doorprize
- `GET /doorprize-winner.php` - Get winners
- `POST /doorprize-winner.php` - Add winner

#### Voting
- `GET /voting.php` - Get voting results
- `POST /voting.php` - Submit vote

#### Galeri
- `GET /galeri.php` - Get all galeri
- `POST /galeri.php` - Add galeri

#### Sponsor
- `GET /sponsor.php` - Get all sponsor
- `POST /sponsor.php` - Add sponsor

#### Pengumuman
- `GET /pengumuman.php` - Get all pengumuman
- `POST /pengumuman.php` - Add pengumuman

#### Log
- `GET /log.php` - Get activity logs

---

## 🎓 Tips & Tricks

1. **Enable API debugging**: Uncomment baris di `api/config.php`
2. **Monitor logs**: Check `log_aktivitas` tabel di database
3. **Backup database**: Secara berkala export dari phpMyAdmin
4. **Update credentials**: Jangan gunakan default password di production
5. **Enable HTTPS**: Jika di production/cPanel, selalu gunakan HTTPS

---

**Made with ❤️ for SEMARAK AGUSTUS 2026**
