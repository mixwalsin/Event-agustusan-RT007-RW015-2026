<?php
/**
 * api/sponsor.php
 * GET    – daftar sponsor aktif
 * POST   – tambah sponsor
 * PUT    – update sponsor (?id=)
 * DELETE – hapus sponsor  (?id=)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();
$id     = (int)($_GET['id'] ?? 0);

switch ($method) {

    case 'GET':
        $stmt = $pdo->query(
            'SELECT * FROM sponsor WHERE is_active = 1 ORDER BY urutan ASC, id ASC'
        );
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    case 'POST':
        $body = getRequestBody();
        $nama = trim($body['nama'] ?? '');
        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'Nama sponsor wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'INSERT INTO sponsor (nama, icon, kategori, kontak, website, is_active, urutan)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $nama,
            trim($body['icon']     ?? '🏢') ?: '🏢',
            trim($body['kategori'] ?? '') ?: null,
            trim($body['kontak']   ?? '') ?: null,
            trim($body['website']  ?? '') ?: null,
            isset($body['is_active']) ? (int)(bool)$body['is_active'] : 1,
            (int)($body['urutan'] ?? 0),
        ]);
        jsonResponse(['success' => true, 'message' => 'Sponsor berhasil ditambahkan', 'id' => (int)$pdo->lastInsertId()], 201);

    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body = getRequestBody();
        $nama = trim($body['nama'] ?? '');
        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'Nama sponsor wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'UPDATE sponsor SET nama=?, icon=?, kategori=?, kontak=?, website=?, is_active=?, urutan=?
             WHERE id=?'
        );
        $stmt->execute([
            $nama,
            trim($body['icon']     ?? '🏢') ?: '🏢',
            trim($body['kategori'] ?? '') ?: null,
            trim($body['kontak']   ?? '') ?: null,
            trim($body['website']  ?? '') ?: null,
            isset($body['is_active']) ? (int)(bool)$body['is_active'] : 1,
            (int)($body['urutan'] ?? 0),
            $id,
        ]);
        jsonResponse(['success' => true, 'message' => 'Sponsor berhasil diupdate']);

    case 'DELETE':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM sponsor WHERE id = ?');
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Sponsor berhasil dihapus']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
