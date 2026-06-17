/**
 * Quick Start Guide untuk Menggunakan Backend API
 */

// ========== LANGKAH 1: Update HTML ==========

/*
Ubah file HTML (admin.html, hasil.html, event-tv.html):

1. Di bagian <head>, tambahkan:
   <script src="js/api.js"></script>
   <script src="js/admin-api-integration.js"></script>  <!-- untuk admin.html -->
   <script src="js/hasil-api-integration.js"></script>  <!-- untuk hasil.html -->
   <script src="js/event-tv-api-integration.js"></script> <!-- untuk event-tv.html -->

2. Update API_BASE_URL di js/api.js:
   - Development: const API_BASE_URL = "http://localhost/Event-agustusan-RT007-RW015-2026/api";
   - Production: const API_BASE_URL = "https://yourdomain.com/api";
*/

// ========== LANGKAH 2: Setup Backend ==========

/*
1. Install XAMPP dengan PHP 8.2
2. Copy project ke htdocs
3. Buat database di phpMyAdmin: agustusan_rt007_2026
4. Import file SQL: database/agustusan_rt007_2026.sql
5. Ubah DB credentials di api/config.php jika perlu
6. Test API dengan curl atau Postman
*/

// ========== LANGKAH 3: Contoh Penggunaan API ==========

// Login
async function exampleLogin() {
    const result = await loginAdmin('admin', 'admin123');
    if (result.success) {
        console.log('Login sukses:', result.data);
    } else {
        console.log('Login gagal:', result.error);
    }
}

// Get peserta
async function exampleGetPeserta() {
    const peserta = await getPeserta();
    console.log('Daftar peserta:', peserta);
}

// Add peserta
async function exampleAddPeserta() {
    const result = await addPeserta({
        nama: 'Budi Santoso',
        email: 'budi@example.com',
        no_telepon: '081234567890',
        korlap_id: 1,
        cabor_id: 1,
        jenis_kelamin: 'laki-laki'
    });
    console.log('Peserta ditambahkan:', result);
}

// Get leaderboard
async function exampleGetLeaderboard() {
    const leaderboard = await getLeaderboard();
    console.log('Leaderboard:', leaderboard);
}

// Submit voting
async function exampleVoting() {
    const result = await submitVoting(1); // vote untuk Korlap 1
    if (result.success) {
        console.log('Vote berhasil dicatat');
    }
}

// Get voting results
async function exampleGetVoting() {
    const voting = await getVoting();
    console.log('Hasil voting:', voting);
}

// Add doorprize winner
async function exampleAddWinner() {
    const result = await addDoorprizeWinner({
        doorprize_id: 1,
        nama_pemenang: 'Andi Wijaya',
        no_ktp: '1234567890123456',
        korlap_id: 1
    });
    console.log('Pemenang ditambahkan:', result);
}

// Export peserta ke CSV
function exampleExport() {
    exportPeserta();
}

// ========== LANGKAH 4: Error Handling ==========

/*
Semua function sudah handle error:

- Jika API tersedia: data dari MySQL
- Jika API tidak tersedia: fallback ke localStorage

Cek status API di browser Console:
  - "API Status: ✓ Connected" = API aktif
  - "API Status: ✗ Offline" = Fallback ke localStorage
*/

// ========== LANGKAH 5: Debugging ==========

/*
1. Buka browser DevTools (F12)
2. Cek tab Console untuk pesan API
3. Cek tab Network untuk melihat request ke API
4. Cek localStorage (Storage tab) untuk data local
*/

// ========== STRUKTUR FILE ==========

/*
Event-agustusan-RT007-RW015-2026/
├── index.html
├── admin.html (update untuk API)
├── hasil.html (update untuk API)
├── event-tv.html (update untuk API)
├── daftar.html
├── galeri.html
├── css/
│   └── style.css
├── js/
│   ├── api.js (BARU - API client)
│   ├── script.js (existing)
│   ├── admin-api-integration.js (BARU - admin form handling)
│   ├── hasil-api-integration.js (BARU - hasil display)
│   ├── event-tv-api-integration.js (BARU - TV display)
│   └── ...
├── api/ (BARU - Backend PHP)
│   ├── config.php
│   ├── login.php
│   ├── peserta.php
│   ├── cabor.php
│   ├── jadwal.php
│   ├── skor.php
│   ├── leaderboard.php
│   ├── juara.php
│   ├── doorprize.php
│   ├── doorprize-winner.php
│   ├── voting.php
│   ├── galeri.php
│   ├── sponsor.php
│   ├── pengumuman.php
│   └── log.php
└── database/ (BARU - Database)
    └── agustusan_rt007_2026.sql
*/

// ========== CATATAN PENTING ==========

/*
1. Default admin login:
   username: admin
   password: admin123
   
   ⚠️ UBAH PASSWORD DI PRODUCTION!

2. CORS sudah enabled di api/config.php
   Bisa diakses dari GitHub Pages

3. Semua data dilindungi dengan prepared statements (PDO)
   Aman dari SQL injection

4. Password di-hash dengan password_hash()
   Tidak disimpan plain text

5. Activity logging di tabel log_aktivitas
   Track semua aksi admin

6. Database default uses UTF-8mb4
   Support emoji dan karakter special

7. Timezone di-set ke UTC+7 (WIB)
   Sesuai Indonesia
*/

// ========== TIPS DEVELOPMENT ==========

/*
1. Selalu check API_AVAILABLE status
2. Fallback ke localStorage berfungsi sempurna
3. Data di-store secara otomatis
4. Export CSV untuk backup data
5. Monitor database size (phpMyAdmin)
6. Regular backup sebelum production
7. Test di mobile juga (responsive)
8. Enable browser cache untuk performa
*/

console.log('🎉 Backend integration setup selesai!');
console.log('📚 Baca README_BACKEND.md untuk detail lengkap');
