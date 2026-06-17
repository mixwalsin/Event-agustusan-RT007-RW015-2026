<?php
/**
 * api/pengumuman.php
 * GET    – daftar pengumuman aktif
 * POST   – tambah pengumuman
 * PUT    – update pengumuman (?id=)
 * DELETE – hapus pengumuman  (?id=)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();
$id     = (int)($_GET['id'] ?? 0);

switch ($method) {

    case 'GET':
        $stmt = $pdo->query(
            'SELECT * FROM pengumuman WHERE is_active = 1 ORDER BY urutan ASC, created_at DESC'
        );
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    case 'POST':
        $body  = getRequestBody();
        $judul = trim($body['judul'] ?? '');
        $isi   = trim($body['isi']   ?? '');
        if ($judul === '' || $isi === '') {
            jsonResponse(['success' => false, 'message' => 'Judul dan isi pengumuman wajib diisi'], 400);
        }
        $tipeValid = ['info','warning','success','danger'];
        $tipe      = in_array($body['tipe'] ?? '', $tipeValid, true) ? $body['tipe'] : 'info';
        $stmt = $pdo->prepare(
            'INSERT INTO pengumuman (judul, isi, tipe, is_active, urutan) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $judul, $isi, $tipe,
            isset($body['is_active']) ? (int)(bool)$body['is_active'] : 1,
            (int)($body['urutan'] ?? 0),
        ]);
        logAktivitas('tambah_pengumuman', "Judul: {$judul}");
        jsonResponse(['success' => true, 'message' => 'Pengumuman berhasil ditambahkan', 'id' => (int)$pdo->lastInsertId()], 201);

    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body  = getRequestBody();
        $judul = trim($body['judul'] ?? '');
        $isi   = trim($body['isi']   ?? '');
        if ($judul === '' || $isi === '') {
            jsonResponse(['success' => false, 'message' => 'Judul dan isi pengumuman wajib diisi'], 400);
        }
        $tipeValid = ['info','warning','success','danger'];
        $tipe      = in_array($body['tipe'] ?? '', $tipeValid, true) ? $body['tipe'] : 'info';
        $stmt = $pdo->prepare(
            'UPDATE pengumuman SET judul=?, isi=?, tipe=?, is_active=?, urutan=? WHERE id=?'
        );
        $stmt->execute([
            $judul, $isi, $tipe,
            isset($body['is_active']) ? (int)(bool)$body['is_active'] : 1,
            (int)($body['urutan'] ?? 0),
            $id,
        ]);
        jsonResponse(['success' => true, 'message' => 'Pengumuman berhasil diupdate']);

    case 'DELETE':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM pengumuman WHERE id = ?');
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Pengumuman berhasil dihapus']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
