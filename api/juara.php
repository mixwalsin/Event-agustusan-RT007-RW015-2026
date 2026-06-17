<?php
/**
 * api/juara.php
 * GET    – daftar juara (opsional: ?cabor_id=)
 * POST   – tambah juara
 * PUT    – update juara (?id=)
 * DELETE – hapus juara  (?id=)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();
$id     = (int)($_GET['id'] ?? 0);

switch ($method) {

    case 'GET':
        $where  = [];
        $params = [];
        if (!empty($_GET['cabor_id'])) {
            $where[]  = 'j.cabor_id = ?';
            $params[] = (int)$_GET['cabor_id'];
        }
        $sql = 'SELECT j.*, c.nama AS nama_cabor, c.icon AS icon_cabor,
                       k.nama AS nama_korlap
                FROM juara j
                LEFT JOIN cabor  c ON c.id = j.cabor_id
                LEFT JOIN korlap k ON k.id = j.korlap_id';
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY j.cabor_id ASC, j.peringkat ASC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    case 'POST':
        $body  = getRequestBody();
        $nama  = trim($body['nama_juara'] ?? '');
        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'nama_juara wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'INSERT INTO juara (cabor_id, peringkat, nama_juara, korlap_id, keterangan)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            !empty($body['cabor_id'])  ? (int)$body['cabor_id']  : null,
            (int)($body['peringkat'] ?? 1),
            $nama,
            !empty($body['korlap_id']) ? (int)$body['korlap_id'] : null,
            trim($body['keterangan']   ?? '') ?: null,
        ]);
        logAktivitas('tambah_juara', "Nama: {$nama}");
        jsonResponse(['success' => true, 'message' => 'Juara berhasil ditambahkan', 'id' => (int)$pdo->lastInsertId()], 201);

    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body = getRequestBody();
        $nama = trim($body['nama_juara'] ?? '');
        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'nama_juara wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'UPDATE juara SET cabor_id=?, peringkat=?, nama_juara=?, korlap_id=?, keterangan=?
             WHERE id=?'
        );
        $stmt->execute([
            !empty($body['cabor_id'])  ? (int)$body['cabor_id']  : null,
            (int)($body['peringkat'] ?? 1),
            $nama,
            !empty($body['korlap_id']) ? (int)$body['korlap_id'] : null,
            trim($body['keterangan']   ?? '') ?: null,
            $id,
        ]);
        jsonResponse(['success' => true, 'message' => 'Juara berhasil diupdate']);

    case 'DELETE':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM juara WHERE id = ?');
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Juara berhasil dihapus']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
