-- Database: agustusan_rt007_2026
-- PHP 8.2 dengan MySQL & PDO
-- Created for Semarak Agustus 2026 Event Management System

-- Tabel Admin (Login)
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nama` VARCHAR(100),
  `email` VARCHAR(100),
  `role` ENUM('super_admin', 'admin', 'panitia') DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` DATETIME,
  `active` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Korlap (Kelompok Lingkungan)
CREATE TABLE IF NOT EXISTS `korlap` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_korlap` VARCHAR(50) NOT NULL,
  `ketua` VARCHAR(100),
  `no_telepon` VARCHAR(15),
  `jumlah_kk` INT DEFAULT 0,
  `poin_total` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Cabang Olahraga
CREATE TABLE IF NOT EXISTS `cabor` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_cabor` VARCHAR(100) NOT NULL,
  `emoji` VARCHAR(10),
  `deskripsi` TEXT,
  `kategori` VARCHAR(50),
  `jumlah_peserta` INT DEFAULT 0,
  `status` ENUM('pendaftaran', 'berlangsung', 'selesai') DEFAULT 'pendaftaran',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Peserta
CREATE TABLE IF NOT EXISTS `peserta` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `no_ktp` VARCHAR(20) UNIQUE,
  `nama` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100),
  `no_telepon` VARCHAR(15),
  `korlap_id` INT,
  `cabor_id` INT,
  `jenis_kelamin` ENUM('laki-laki', 'perempuan') DEFAULT 'laki-laki',
  `tanggal_lahir` DATE,
  `status` ENUM('daftar', 'aktif', 'nonaktif') DEFAULT 'daftar',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`korlap_id`) REFERENCES `korlap`(`id`),
  FOREIGN KEY (`cabor_id`) REFERENCES `cabor`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Jadwal
CREATE TABLE IF NOT EXISTS `jadwal` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cabor_id` INT NOT NULL,
  `waktu_mulai` DATETIME NOT NULL,
  `waktu_selesai` DATETIME,
  `lokasi` VARCHAR(100),
  `deskripsi` TEXT,
  `status` ENUM('terjadwal', 'berlangsung', 'selesai', 'batal') DEFAULT 'terjadwal',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`cabor_id`) REFERENCES `cabor`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Skor (Pertandingan)
CREATE TABLE IF NOT EXISTS `skor` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `jadwal_id` INT NOT NULL,
  `korlap_1_id` INT NOT NULL,
  `korlap_2_id` INT,
  `skor_korlap_1` INT DEFAULT 0,
  `skor_korlap_2` INT DEFAULT 0,
  `pemenang_id` INT,
  `poin_korlap_1` INT DEFAULT 0,
  `poin_korlap_2` INT DEFAULT 0,
  `status` ENUM('pending', 'berlangsung', 'selesai') DEFAULT 'pending',
  `catatan` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`jadwal_id`) REFERENCES `jadwal`(`id`),
  FOREIGN KEY (`korlap_1_id`) REFERENCES `korlap`(`id`),
  FOREIGN KEY (`korlap_2_id`) REFERENCES `korlap`(`id`),
  FOREIGN KEY (`pemenang_id`) REFERENCES `korlap`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Juara
CREATE TABLE IF NOT EXISTS `juara` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cabor_id` INT NOT NULL,
  `rangking` ENUM('1', '2', '3') NOT NULL,
  `korlap_id` INT NOT NULL,
  `poin` INT DEFAULT 0,
  `catatan` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`cabor_id`) REFERENCES `cabor`(`id`),
  FOREIGN KEY (`korlap_id`) REFERENCES `korlap`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Leaderboard (Ranking Korlap)
CREATE TABLE IF NOT EXISTS `leaderboard` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `korlap_id` INT NOT NULL UNIQUE,
  `total_poin` INT DEFAULT 0,
  `juara_1` INT DEFAULT 0,
  `juara_2` INT DEFAULT 0,
  `juara_3` INT DEFAULT 0,
  `ranking` INT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`korlap_id`) REFERENCES `korlap`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Doorprize
CREATE TABLE IF NOT EXISTS `doorprize` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_hadiah` VARCHAR(150) NOT NULL,
  `nilai_hadiah` INT,
  `emoji` VARCHAR(10),
  `jumlah_hadiah` INT DEFAULT 1,
  `tersisa` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pemenang Doorprize
CREATE TABLE IF NOT EXISTS `doorprize_winner` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `doorprize_id` INT NOT NULL,
  `no_ktp` VARCHAR(20),
  `nama_pemenang` VARCHAR(100),
  `korlap_id` INT,
  `waktu_undian` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`doorprize_id`) REFERENCES `doorprize`(`id`),
  FOREIGN KEY (`korlap_id`) REFERENCES `korlap`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Voting
CREATE TABLE IF NOT EXISTS `voting` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `korlap_id` INT NOT NULL,
  `total_suara` INT DEFAULT 0,
  `persentase` DECIMAL(5,2) DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`korlap_id`) REFERENCES `korlap`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Riwayat Voting
CREATE TABLE IF NOT EXISTS `voting_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `korlap_id` INT NOT NULL,
  `ip_address` VARCHAR(45),
  `device_id` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`korlap_id`) REFERENCES `korlap`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Sponsor
CREATE TABLE IF NOT EXISTS `sponsor` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_sponsor` VARCHAR(150) NOT NULL,
  `kategori` ENUM('utama', 'pendamping', 'umkm') DEFAULT 'pendamping',
  `logo_url` VARCHAR(255),
  `website` VARCHAR(255),
  `deskripsi` TEXT,
  `kontak` VARCHAR(100),
  `no_telepon` VARCHAR(15),
  `email` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Galeri
CREATE TABLE IF NOT EXISTS `galeri` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(150) NOT NULL,
  `deskripsi` TEXT,
  `url_foto` VARCHAR(255) NOT NULL,
  `kategori` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Pengumuman
CREATE TABLE IF NOT EXISTS `pengumuman` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(255) NOT NULL,
  `isi` TEXT NOT NULL,
  `tipe` ENUM('info', 'warning', 'urgent') DEFAULT 'info',
  `admin_id` INT,
  `tampil_di_tv` BOOLEAN DEFAULT FALSE,
  `urutan` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Log Aktivitas
CREATE TABLE IF NOT EXISTS `log_aktivitas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT,
  `aksi` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT,
  `tabel` VARCHAR(50),
  `id_record` INT,
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data

-- Admin (password: admin123 - hashed dengan password_hash)
INSERT INTO `admin` (`username`, `password`, `nama`, `email`, `role`) VALUES
('admin', '$2y$10$e8UE9n.R0h4q6Qr9LpJHhO5YP1rF9nK8mXwZ3.5Y8.5J8.8.8', 'Admin Utama', 'admin@agustusan.local', 'super_admin');

-- Data Korlap
INSERT INTO `korlap` (`nama_korlap`, `ketua`, `jumlah_kk`) VALUES
('Korlap 1', 'Ketua Korlap 1', 34),
('Korlap 2', 'Ketua Korlap 2', 47),
('Korlap 3', 'Ketua Korlap 3', 63),
('Korlap 4', 'Ketua Korlap 4', 38),
('Korlap 5', 'Ketua Korlap 5', 47);

-- Data Cabor
INSERT INTO `cabor` (`nama_cabor`, `emoji`, `deskripsi`, `kategori`) VALUES
('Bulu Tangkis', '🏸', 'Pertandingan Bulu Tangkis Dewasa dan Remaja', 'Olahraga Raket'),
('Voli', '🏐', 'Pertandingan Voli Dewasa dan Pemuda', 'Olahraga Tim'),
('Futsal', '⚽', 'Pertandingan Futsal Senior dan Junior', 'Olahraga Tim'),
('Tenis Meja', '🏓', 'Pertandingan Tenis Meja Tunggal dan Ganda', 'Olahraga Raket'),
('Catur', '♟️', 'Pertandingan Catur Terbuka', 'Olahraga Strategi'),
('Lari Estafet', '🏃', 'Lomba Lari Estafet Keluarga', 'Olahraga Atletik'),
('Lomba Anak', '🎯', 'Lomba Anak-anak Usia 4-12 Tahun', 'Lomba Anak'),
('Senam Bersama', '💃', 'Senam Bersama untuk Semua Kalangan', 'Olahraga Sehat');

-- Data Voting (Inisialisasi)
INSERT INTO `voting` (`korlap_id`, `total_suara`) VALUES
(1, 0),
(2, 0),
(3, 0),
(4, 0),
(5, 0);

-- Data Leaderboard (Inisialisasi)
INSERT INTO `leaderboard` (`korlap_id`, `total_poin`, `ranking`) VALUES
(1, 450, 1),
(2, 420, 2),
(3, 380, 3),
(4, 350, 4),
(5, 310, 5);

-- Data Sponsor
INSERT INTO `sponsor` (`nama_sponsor`, `kategori`, `deskripsi`, `kontak`) VALUES
('Sponsor Utama 1', 'utama', 'Sponsor utama event Agustusan', 'Kontak Utama'),
('Sponsor Pendamping 1', 'pendamping', 'Sponsor pendamping', 'Kontak Pendamping'),
('UMKM Lokal 1', 'umkm', 'Kemitraan UMKM lokal', 'UMKM Lokal');

-- Doorprize
INSERT INTO `doorprize` (`nama_hadiah`, `nilai_hadiah`, `emoji`, `jumlah_hadiah`) VALUES
('Motor 125cc', 15000000, '🏍️', 1),
('Laptop Gaming', 10000000, '💻', 1),
('Smartphone Android', 5000000, '📱', 2),
('Voucher Belanja 1 Juta', 1000000, '🎟️', 5),
('Voucher Belanja 500 Ribu', 500000, '🎟️', 10),
('Peralatan Olahraga', 2000000, '⚽', 3);
