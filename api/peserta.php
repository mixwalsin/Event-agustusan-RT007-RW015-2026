<?php
/**
 * api/peserta.php
 * GET    – daftar peserta (opsional: ?cabor_id=&korlap_id=)
 * POST   – tambah peserta
 * PUT    – update peserta (?id=)
 * DELETE – hapus peserta (?id=)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();
$id     = (int)($_GET['id'] ?? 0);

switch ($method) {

    // -------- GET --------
    case 'GET':
        $where  = [];
        $params = [];

        if (!empty($_GET['cabor_id'])) {
            $where[]  = 'p.cabor_id = ?';
            $params[] = (int)$_GET['cabor_id'];
        }
        if (!empty($_GET['korlap_id'])) {
            $where[]  = 'p.korlap_id = ?';
            $params[] = (int)$_GET['korlap_id'];
        }

        $sql = 'SELECT p.*, k.nama AS nama_korlap, c.nama AS nama_cabor
                FROM peserta p
                LEFT JOIN korlap k ON k.id = p.korlap_id
                LEFT JOIN cabor  c ON c.id = p.cabor_id';

        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY p.created_at DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    // -------- POST --------
    case 'POST':
        $body = getRequestBody();
        $nama = trim($body['nama'] ?? '');

        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'Nama peserta wajib diisi'], 400);
        }

        $stmt = $pdo->prepare(
            'INSERT INTO peserta (nama, no_rumah, korlap_id, cabor_id, kategori, no_hp)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $nama,
            trim($body['no_rumah']  ?? '') ?: null,
            !empty($body['korlap_id']) ? (int)$body['korlap_id'] : null,
            !empty($body['cabor_id'])  ? (int)$body['cabor_id']  : null,
            trim($body['kategori']  ?? '') ?: null,
            trim($body['no_hp']     ?? '') ?: null,
        ]);
        logAktivitas('tambah_peserta', "Nama: {$nama}");
        jsonResponse(['success' => true, 'message' => 'Peserta berhasil ditambahkan', 'id' => (int)$pdo->lastInsertId()], 201);

    // -------- PUT --------
    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body = getRequestBody();
        $nama = trim($body['nama'] ?? '');

        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'Nama peserta wajib diisi'], 400);
        }

        $stmt = $pdo->prepare(
            'UPDATE peserta SET nama=?, no_rumah=?, korlap_id=?, cabor_id=?, kategori=?, no_hp=?
             WHERE id=?'
        );
        $stmt->execute([
            $nama,
            trim($body['no_rumah']  ?? '') ?: null,
            !empty($body['korlap_id']) ? (int)$body['korlap_id'] : null,
            !empty($body['cabor_id'])  ? (int)$body['cabor_id']  : null,
            trim($body['kategori']  ?? '') ?: null,
            trim($body['no_hp']     ?? '') ?: null,
            $id,
        ]);
        jsonResponse(['success' => true, 'message' => 'Peserta berhasil diupdate']);

    // -------- DELETE --------
    case 'DELETE':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM peserta WHERE id = ?');
        $stmt->execute([$id]);
        logAktivitas('hapus_peserta', "ID: {$id}");
        jsonResponse(['success' => true, 'message' => 'Peserta berhasil dihapus']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
