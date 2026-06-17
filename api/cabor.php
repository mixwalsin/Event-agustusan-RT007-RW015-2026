<?php
/**
 * api/cabor.php
 * GET    – daftar cabor
 * POST   – tambah cabor
 * PUT    – update cabor (?id=)
 * DELETE – hapus cabor  (?id=)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();
$id     = (int)($_GET['id'] ?? 0);

switch ($method) {

    case 'GET':
        $stmt = $pdo->query('SELECT * FROM cabor ORDER BY id ASC');
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    case 'POST':
        $body = getRequestBody();
        $nama = trim($body['nama'] ?? '');
        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'Nama cabor wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'INSERT INTO cabor (nama, icon, kategori, jumlah_peserta, is_active) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $nama,
            trim($body['icon']          ?? '🏆') ?: '🏆',
            trim($body['kategori']      ?? '') ?: null,
            (int)($body['jumlah_peserta'] ?? 0),
            isset($body['is_active']) ? (int)(bool)$body['is_active'] : 1,
        ]);
        jsonResponse(['success' => true, 'message' => 'Cabor berhasil ditambahkan', 'id' => (int)$pdo->lastInsertId()], 201);

    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body = getRequestBody();
        $nama = trim($body['nama'] ?? '');
        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'Nama cabor wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'UPDATE cabor SET nama=?, icon=?, kategori=?, jumlah_peserta=?, is_active=? WHERE id=?'
        );
        $stmt->execute([
            $nama,
            trim($body['icon']          ?? '🏆') ?: '🏆',
            trim($body['kategori']      ?? '') ?: null,
            (int)($body['jumlah_peserta'] ?? 0),
            isset($body['is_active']) ? (int)(bool)$body['is_active'] : 1,
            $id,
        ]);
        jsonResponse(['success' => true, 'message' => 'Cabor berhasil diupdate']);

    case 'DELETE':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM cabor WHERE id = ?');
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Cabor berhasil dihapus']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
