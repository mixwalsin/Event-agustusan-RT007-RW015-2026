<?php
/**
 * api/galeri.php
 * GET    – daftar galeri
 * POST   – tambah item galeri
 * PUT    – update item galeri (?id=)
 * DELETE – hapus item galeri  (?id=)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();
$id     = (int)($_GET['id'] ?? 0);

switch ($method) {

    case 'GET':
        $stmt = $pdo->query('SELECT * FROM galeri WHERE is_active = 1 ORDER BY created_at DESC');
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    case 'POST':
        $body  = getRequestBody();
        $judul = trim($body['judul'] ?? '');
        if ($judul === '') {
            jsonResponse(['success' => false, 'message' => 'Judul galeri wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'INSERT INTO galeri (judul, emoji, kategori, url_foto, keterangan, is_active)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $judul,
            trim($body['emoji']      ?? '📷') ?: '📷',
            trim($body['kategori']   ?? '') ?: null,
            trim($body['url_foto']   ?? '') ?: null,
            trim($body['keterangan'] ?? '') ?: null,
            isset($body['is_active']) ? (int)(bool)$body['is_active'] : 1,
        ]);
        jsonResponse(['success' => true, 'message' => 'Galeri berhasil ditambahkan', 'id' => (int)$pdo->lastInsertId()], 201);

    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body  = getRequestBody();
        $judul = trim($body['judul'] ?? '');
        if ($judul === '') {
            jsonResponse(['success' => false, 'message' => 'Judul galeri wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'UPDATE galeri SET judul=?, emoji=?, kategori=?, url_foto=?, keterangan=?, is_active=?
             WHERE id=?'
        );
        $stmt->execute([
            $judul,
            trim($body['emoji']      ?? '📷') ?: '📷',
            trim($body['kategori']   ?? '') ?: null,
            trim($body['url_foto']   ?? '') ?: null,
            trim($body['keterangan'] ?? '') ?: null,
            isset($body['is_active']) ? (int)(bool)$body['is_active'] : 1,
            $id,
        ]);
        jsonResponse(['success' => true, 'message' => 'Galeri berhasil diupdate']);

    case 'DELETE':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM galeri WHERE id = ?');
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Galeri berhasil dihapus']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
