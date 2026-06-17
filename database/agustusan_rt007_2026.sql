-- ============================================================
-- DATABASE: agustusan_rt007_2026
-- Event Agustusan Digital 2026 - RT 007 RW 015 TCI 2
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

CREATE DATABASE IF NOT EXISTS `agustusan_rt007_2026`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `agustusan_rt007_2026`;

-- -------------------------------------------------------
-- Tabel: admin
-- -------------------------------------------------------
CREATE TABLE `admin` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`   VARCHAR(50)  NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `nama`       VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password default: Admin@2026  (hash bcrypt dibuat dengan PHP password_hash)
-- GANTI PASSWORD INI SETELAH PERTAMA LOGIN!
INSERT INTO `admin` (`username`, `password`, `nama`) VALUES
('admin', '$2y$12$5uApJJc6L.UBEwP8H.Md5.ERTiYfpW7c6VFzJcY9aPSPv9JfSkCUe', 'Administrator RT 007');

-- -------------------------------------------------------
-- Tabel: korlap  (dikelola melalui seed, tidak ada endpoint CRUD khusus)
-- -------------------------------------------------------
CREATE TABLE `korlap` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama`       VARCHAR(100) NOT NULL,
  `ketua`      VARCHAR(100) DEFAULT NULL,
  `jumlah_kk`  INT UNSIGNED NOT NULL DEFAULT 0,
  `warna`      VARCHAR(30)  DEFAULT NULL,
  `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `korlap` (`nama`, `ketua`, `jumlah_kk`, `warna`) VALUES
('Korlap 1', 'Bapak Haryanto',    34, '#DC143C'),
('Korlap 2', 'Bapak Sumarno',     47, '#1E90FF'),
('Korlap 3', 'Bapak Rahmat',      63, '#228B22'),
('Korlap 4', 'Bapak Kusnanda',    38, '#FF8C00'),
('Korlap 5', 'Bapak Widiyatmoko', 47, '#9400D3');

-- -------------------------------------------------------
-- Tabel: cabor  (cabang olahraga)
-- -------------------------------------------------------
CREATE TABLE `cabor` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama`         VARCHAR(100) NOT NULL,
  `icon`         VARCHAR(10)  DEFAULT '🏆',
  `kategori`     VARCHAR(100) DEFAULT NULL,
  `jumlah_peserta` INT UNSIGNED DEFAULT 0,
  `is_active`    TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cabor` (`nama`, `icon`, `kategori`, `jumlah_peserta`) VALUES
('Bulu Tangkis', '🏸', 'Dewasa, Remaja',  24),
('Voli',         '🏐', 'Dewasa, Pemuda',  18),
('Futsal',       '⚽', 'Senior, Junior',  20),
('Tenis Meja',   '🏓', 'Tunggal, Ganda',  16),
('Catur',        '♟️', 'Terbuka',          12),
('Lari Estafet', '🏃', 'Keluarga',         30),
('Lomba Anak',   '🎯', '4-12 tahun',       45),
('Senam Bersama','💃', 'Terbuka',         200);

-- -------------------------------------------------------
-- Tabel: peserta
-- -------------------------------------------------------
CREATE TABLE `peserta` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama`       VARCHAR(100) NOT NULL,
  `no_rumah`   VARCHAR(50)  DEFAULT NULL,
  `korlap_id`  INT UNSIGNED DEFAULT NULL,
  `cabor_id`   INT UNSIGNED DEFAULT NULL,
  `kategori`   VARCHAR(50)  DEFAULT NULL,
  `no_hp`      VARCHAR(20)  DEFAULT NULL,
  `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_peserta_korlap` (`korlap_id`),
  KEY `fk_peserta_cabor`  (`cabor_id`),
  CONSTRAINT `fk_peserta_korlap` FOREIGN KEY (`korlap_id`) REFERENCES `korlap` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_peserta_cabor`  FOREIGN KEY (`cabor_id`)  REFERENCES `cabor`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- Tabel: jadwal
-- -------------------------------------------------------
CREATE TABLE `jadwal` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cabor_id`   INT UNSIGNED DEFAULT NULL,
  `nama_match` VARCHAR(150) NOT NULL,
  `tim_a`      VARCHAR(100) DEFAULT NULL,
  `tim_b`      VARCHAR(100) DEFAULT NULL,
  `lokasi`     VARCHAR(100) DEFAULT NULL,
  `waktu_mulai`DATETIME     DEFAULT NULL,
  `waktu_selesai` DATETIME  DEFAULT NULL,
  `status`     ENUM('scheduled','ongoing','selesai') NOT NULL DEFAULT 'scheduled',
  `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_jadwal_cabor` (`cabor_id`),
  CONSTRAINT `fk_jadwal_cabor` FOREIGN KEY (`cabor_id`) REFERENCES `cabor` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `jadwal` (`cabor_id`, `nama_match`, `tim_a`, `tim_b`, `lokasi`, `waktu_mulai`, `status`) VALUES
(2, 'Voli Putri Final',          'Tim Korlap 1', 'Tim Korlap 3', 'Lapangan Voli RT 007', '2026-08-17 08:00:00', 'scheduled'),
(3, 'Futsal Campuran Final',     'Tim Korlap 2', 'Tim Korlap 4', 'Lapangan Futsal',       '2026-08-17 09:00:00', 'scheduled'),
(1, 'Bulu Tangkis Ganda Final',  'Tim Korlap 5', 'Tim Korlap 1', 'GOR RT 007',            '2026-08-17 10:00:00', 'scheduled'),
(4, 'Tenis Meja Tunggal Final',  'Tim Korlap 3', 'Tim Korlap 2', 'Aula RT 007',           '2026-08-17 11:00:00', 'scheduled'),
(6, 'Lari Estafet Keluarga',     'Tim Korlap 1', 'Tim Korlap 3', 'Jalan Lingkungan',      '2026-08-17 13:00:00', 'scheduled'),
(5, 'Catur Terbuka Final',       'Tim Korlap 4', 'Tim Korlap 5', 'Pos Ronda RT 007',      '2026-08-17 14:00:00', 'scheduled');

-- -------------------------------------------------------
-- Tabel: skor
-- -------------------------------------------------------
CREATE TABLE `skor` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `jadwal_id`  INT UNSIGNED NOT NULL,
  `skor_a`     INT          NOT NULL DEFAULT 0,
  `skor_b`     INT          NOT NULL DEFAULT 0,
  `keterangan` VARCHAR(200) DEFAULT NULL,
  `updated_by` VARCHAR(50)  DEFAULT NULL,
  `updated_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_skor_jadwal` (`jadwal_id`),
  CONSTRAINT `fk_skor_jadwal` FOREIGN KEY (`jadwal_id`) REFERENCES `jadwal` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- Tabel: juara
-- -------------------------------------------------------
CREATE TABLE `juara` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cabor_id`   INT UNSIGNED DEFAULT NULL,
  `peringkat`  TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `nama_juara` VARCHAR(150) NOT NULL,
  `korlap_id`  INT UNSIGNED DEFAULT NULL,
  `keterangan` VARCHAR(200) DEFAULT NULL,
  `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_juara_cabor`  (`cabor_id`),
  KEY `fk_juara_korlap` (`korlap_id`),
  CONSTRAINT `fk_juara_cabor`  FOREIGN KEY (`cabor_id`)  REFERENCES `cabor`  (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_juara_korlap` FOREIGN KEY (`korlap_id`) REFERENCES `korlap` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- Tabel: leaderboard
-- -------------------------------------------------------
CREATE TABLE `leaderboard` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `korlap_id`   INT UNSIGNED NOT NULL,
  `emas`        INT UNSIGNED NOT NULL DEFAULT 0,
  `perak`       INT UNSIGNED NOT NULL DEFAULT 0,
  `perunggu`    INT UNSIGNED NOT NULL DEFAULT 0,
  `total_poin`  INT UNSIGNED NOT NULL DEFAULT 0,
  `updated_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_lb_korlap` (`korlap_id`),
  CONSTRAINT `fk_lb_korlap` FOREIGN KEY (`korlap_id`) REFERENCES `korlap` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `leaderboard` (`korlap_id`, `emas`, `perak`, `perunggu`, `total_poin`) VALUES
(1, 0, 0, 0, 0),
(2, 0, 0, 0, 0),
(3, 0, 0, 0, 0),
(4, 0, 0, 0, 0),
(5, 0, 0, 0, 0);

-- -------------------------------------------------------
-- Tabel: doorprize
-- -------------------------------------------------------
CREATE TABLE `doorprize` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `peringkat`   INT UNSIGNED NOT NULL DEFAULT 1,
  `judul`       VARCHAR(100) NOT NULL,
  `deskripsi`   VARCHAR(200) DEFAULT NULL,
  `nilai`       VARCHAR(50)  DEFAULT NULL,
  `emoji`       VARCHAR(10)  DEFAULT '🎁',
  `pemenang`    VARCHAR(150) DEFAULT NULL,
  `korlap_id`   INT UNSIGNED DEFAULT NULL,
  `waktu_undian`DATETIME     DEFAULT NULL,
  `created_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_dp_korlap` (`korlap_id`),
  CONSTRAINT `fk_dp_korlap` FOREIGN KEY (`korlap_id`) REFERENCES `korlap` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `doorprize` (`peringkat`, `judul`, `deskripsi`, `nilai`, `emoji`) VALUES
(1, 'Grand Prize', 'TV LED 55"',          'Rp. 5.000.000',  '🥇'),
(2, '1st Prize',   'Motor Vespa',         'Rp. 15.000.000', '🥈'),
(3, '2nd Prize',   'Sepeda Motor 125cc',  'Rp. 12.000.000', '🥉'),
(4, '3rd Prize',   'Kulkas 2 Pintu',      'Rp. 3.500.000',  '🎯'),
(5, '4th Prize',   'Paket Liburan Keluarga','Rp. 2.500.000','💝'),
(6, '5th Prize',   'Set Gadget Premium',  'Rp. 2.000.000',  '🏅');

-- -------------------------------------------------------
-- Tabel: voting
-- -------------------------------------------------------
CREATE TABLE `voting` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `kategori`    VARCHAR(100) NOT NULL,
  `korlap_id`   INT UNSIGNED NOT NULL,
  `jumlah_vote` INT UNSIGNED NOT NULL DEFAULT 0,
  `updated_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_voting` (`kategori`, `korlap_id`),
  KEY `fk_voting_korlap` (`korlap_id`),
  CONSTRAINT `fk_voting_korlap` FOREIGN KEY (`korlap_id`) REFERENCES `korlap` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `voting` (`kategori`, `korlap_id`, `jumlah_vote`) VALUES
('Korlap Terkompak',   1, 0), ('Korlap Terkompak',   2, 0), ('Korlap Terkompak',   3, 0), ('Korlap Terkompak',   4, 0), ('Korlap Terkompak',   5, 0),
('Supporter Terheboh', 1, 0), ('Supporter Terheboh', 2, 0), ('Supporter Terheboh', 3, 0), ('Supporter Terheboh', 4, 0), ('Supporter Terheboh', 5, 0),
('Maskot Terbaik',     1, 0), ('Maskot Terbaik',     2, 0), ('Maskot Terbaik',     3, 0), ('Maskot Terbaik',     4, 0), ('Maskot Terbaik',     5, 0),
('Peserta Terfavorit', 1, 0), ('Peserta Terfavorit', 2, 0), ('Peserta Terfavorit', 3, 0), ('Peserta Terfavorit', 4, 0), ('Peserta Terfavorit', 5, 0);

-- -------------------------------------------------------
-- Tabel: sponsor
-- -------------------------------------------------------
CREATE TABLE `sponsor` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama`       VARCHAR(100) NOT NULL,
  `icon`       VARCHAR(10)  DEFAULT '🏢',
  `kategori`   VARCHAR(100) DEFAULT NULL,
  `kontak`     VARCHAR(50)  DEFAULT NULL,
  `website`    VARCHAR(200) DEFAULT NULL,
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `urutan`     INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sponsor` (`nama`, `icon`, `kategori`, `kontak`, `urutan`) VALUES
('PT Maju Jaya',            '🏢', 'Sponsor Utama',    '0812345678', 1),
('Toko Elektronik Jaya',    '📺', 'Sponsor Resmi',    '0812345679', 2),
('Warung Mak Ayu',          '🍜', 'UMKM Kuliner',     '0812345680', 3),
('Toko Kerajinan Rakyat',   '🎨', 'UMKM Kerajinan',   '0812345681', 4),
('Apotek Kesehatan',        '💊', 'Mitra Kesehatan',  '0812345682', 5),
('Toko Kue Tradisional',    '🍰', 'UMKM Makanan',     '0812345683', 6);

-- -------------------------------------------------------
-- Tabel: galeri
-- -------------------------------------------------------
CREATE TABLE `galeri` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `judul`       VARCHAR(150) NOT NULL,
  `emoji`       VARCHAR(10)  DEFAULT '📷',
  `kategori`    VARCHAR(50)  DEFAULT NULL,
  `url_foto`    VARCHAR(500) DEFAULT NULL,
  `keterangan`  VARCHAR(300) DEFAULT NULL,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `galeri` (`judul`, `emoji`, `kategori`) VALUES
('Pembukaan Acara',  '🎉', 'Upacara'),
('Senam Pagi',       '🤸', 'Olahraga'),
('Voli Putri',       '🏐', 'Cabor'),
('Futsal Seru',      '⚽', 'Cabor'),
('Lari Estafet',     '🏃', 'Cabor'),
('Bulu Tangkis',     '🏸', 'Cabor'),
('Doorprize Meriah', '🎁', 'Undian'),
('Penutupan',        '🏁', 'Upacara');

-- -------------------------------------------------------
-- Tabel: pengumuman
-- -------------------------------------------------------
CREATE TABLE `pengumuman` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `judul`       VARCHAR(200) NOT NULL,
  `isi`         TEXT         NOT NULL,
  `tipe`        ENUM('info','warning','success','danger') NOT NULL DEFAULT 'info',
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `urutan`      INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pengumuman` (`judul`, `isi`, `tipe`, `urutan`) VALUES
('Selamat Datang!', 'Selamat datang di Microsite SEMARAK AGUSTUS 2026 RT 007 RW 015 TCI 2. Mari bersatu dan bersemangat!', 'success', 1),
('Pendaftaran Peserta', 'Pendaftaran cabang olahraga dibuka mulai H-30. Hubungi ketua Korlap masing-masing.', 'info', 2),
('Jadwal Acara', 'Acara dimulai pukul 07.00 WIB dengan senam bersama. Harap hadir tepat waktu!', 'warning', 3);

-- -------------------------------------------------------
-- Tabel: log_aktivitas
-- -------------------------------------------------------
CREATE TABLE `log_aktivitas` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `aksi`        VARCHAR(100) NOT NULL,
  `keterangan`  TEXT         DEFAULT NULL,
  `ip_address`  VARCHAR(45)  DEFAULT NULL,
  `user_agent`  VARCHAR(300) DEFAULT NULL,
  `created_at`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
