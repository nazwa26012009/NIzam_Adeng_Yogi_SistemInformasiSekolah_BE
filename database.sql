-- Database: sistem_informasi_sekolah
-- Import file ini melalui phpMyAdmin atau: mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS `sistem_informasi_sekolah`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `sistem_informasi_sekolah`;

-- --------------------------------------------------------
-- Tabel users (autentikasi login)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `nis` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username_nis` (`username`, `nis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Password default: admin123 (dihash bcrypt saat server pertama kali dijalankan jika belum ada user)

-- --------------------------------------------------------
-- Tabel kelas
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `kelas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kelas` varchar(100) NOT NULL,
  `wali_kelas` varchar(100) DEFAULT NULL,
  `jumlah_siswa` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `kelas` (`id`, `nama_kelas`, `wali_kelas`, `jumlah_siswa`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'XI-PPLG-2', 'Bu Siti', 34, '2026-07-04 03:27:42', '2026-07-04 03:27:42', NULL)
ON DUPLICATE KEY UPDATE
  `nama_kelas` = VALUES(`nama_kelas`),
  `wali_kelas` = VALUES(`wali_kelas`),
  `jumlah_siswa` = VALUES(`jumlah_siswa`);

-- --------------------------------------------------------
-- Tabel siswa
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `siswa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nis` varchar(20) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `kelas` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_siswa_nis` (`nis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `siswa` (`nis`, `nama`, `tanggal_lahir`, `alamat`, `kelas`) VALUES
('2024001001', 'Ahmad Fauzi', '2008-03-15', 'Jl. Merdeka No. 10', 'XI-PPLG-2'),
('2024001002', 'Siti Nurhaliza', '2008-07-22', 'Jl. Pahlawan No. 5', 'XI-PPLG-2')
ON DUPLICATE KEY UPDATE
  `nama` = VALUES(`nama`),
  `tanggal_lahir` = VALUES(`tanggal_lahir`),
  `alamat` = VALUES(`alamat`),
  `kelas` = VALUES(`kelas`);
