<?php
/**
 * api/doorprize.php
 * GET    – daftar doorprize
 * POST   – tambah doorprize
 * PUT    – update doorprize / input pemenang (?id=)
 * DELETE – hapus doorprize (?id=)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();
$id     = (int)($_GET['id'] ?? 0);

switch ($method) {

    case 'GET':
        $stmt = $pdo->query(
            'SELECT d.*, k.nama AS nama_korlap
             FROM doorprize d
             LEFT JOIN korlap k ON k.id = d.korlap_id
             ORDER BY d.peringkat ASC'
        );
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    case 'POST':
        $body  = getRequestBody();
        $judul = trim($body['judul'] ?? '');
        if ($judul === '') {
            jsonResponse(['success' => false, 'message' => 'Judul doorprize wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'INSERT INTO doorprize (peringkat, judul, deskripsi, nilai, emoji, pemenang, korlap_id, waktu_undian)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            (int)($body['peringkat']  ?? 1),
            $judul,
            trim($body['deskripsi']   ?? '') ?: null,
            trim($body['nilai']       ?? '') ?: null,
            trim($body['emoji']       ?? '🎁') ?: '🎁',
            trim($body['pemenang']    ?? '') ?: null,
            !empty($body['korlap_id']) ? (int)$body['korlap_id'] : null,
            trim($body['waktu_undian'] ?? '') ?: null,
        ]);
        logAktivitas('tambah_doorprize', "Judul: {$judul}");
        jsonResponse(['success' => true, 'message' => 'Doorprize berhasil ditambahkan', 'id' => (int)$pdo->lastInsertId()], 201);

    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body  = getRequestBody();
        $judul = trim($body['judul'] ?? '');
        if ($judul === '') {
            jsonResponse(['success' => false, 'message' => 'Judul doorprize wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'UPDATE doorprize SET peringkat=?, judul=?, deskripsi=?, nilai=?, emoji=?,
             pemenang=?, korlap_id=?, waktu_undian=? WHERE id=?'
        );
        $pemenang = trim($body['pemenang'] ?? '') ?: null;
        $stmt->execute([
            (int)($body['peringkat']  ?? 1),
            $judul,
            trim($body['deskripsi']   ?? '') ?: null,
            trim($body['nilai']       ?? '') ?: null,
            trim($body['emoji']       ?? '🎁') ?: '🎁',
            $pemenang,
            !empty($body['korlap_id']) ? (int)$body['korlap_id'] : null,
            trim($body['waktu_undian'] ?? '') ?: null,
            $id,
        ]);
        if ($pemenang) {
            logAktivitas('input_pemenang_doorprize', "ID: {$id}, Pemenang: {$pemenang}");
        }
        jsonResponse(['success' => true, 'message' => 'Doorprize berhasil diupdate']);

    case 'DELETE':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM doorprize WHERE id = ?');
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Doorprize berhasil dihapus']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
