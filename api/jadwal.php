<?php
/**
 * api/jadwal.php
 * GET    – daftar jadwal (opsional: ?status=)
 * POST   – tambah jadwal
 * PUT    – update jadwal (?id=)
 * DELETE – hapus jadwal  (?id=)
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
        if (!empty($_GET['status'])) {
            $where[]  = 'j.status = ?';
            $params[] = $_GET['status'];
        }
        $sql = 'SELECT j.*, c.nama AS nama_cabor, c.icon AS icon_cabor
                FROM jadwal j
                LEFT JOIN cabor c ON c.id = j.cabor_id';
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY j.waktu_mulai ASC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    case 'POST':
        $body = getRequestBody();
        $nama = trim($body['nama_match'] ?? '');
        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'Nama match wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'INSERT INTO jadwal (cabor_id, nama_match, tim_a, tim_b, lokasi, waktu_mulai, waktu_selesai, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            !empty($body['cabor_id']) ? (int)$body['cabor_id'] : null,
            $nama,
            trim($body['tim_a']          ?? '') ?: null,
            trim($body['tim_b']          ?? '') ?: null,
            trim($body['lokasi']         ?? '') ?: null,
            trim($body['waktu_mulai']    ?? '') ?: null,
            trim($body['waktu_selesai']  ?? '') ?: null,
            in_array($body['status'] ?? '', ['scheduled','ongoing','selesai'], true)
                ? $body['status'] : 'scheduled',
        ]);
        logAktivitas('tambah_jadwal', "Match: {$nama}");
        jsonResponse(['success' => true, 'message' => 'Jadwal berhasil ditambahkan', 'id' => (int)$pdo->lastInsertId()], 201);

    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body = getRequestBody();
        $nama = trim($body['nama_match'] ?? '');
        if ($nama === '') {
            jsonResponse(['success' => false, 'message' => 'Nama match wajib diisi'], 400);
        }
        $stmt = $pdo->prepare(
            'UPDATE jadwal SET cabor_id=?, nama_match=?, tim_a=?, tim_b=?, lokasi=?,
             waktu_mulai=?, waktu_selesai=?, status=? WHERE id=?'
        );
        $stmt->execute([
            !empty($body['cabor_id']) ? (int)$body['cabor_id'] : null,
            $nama,
            trim($body['tim_a']          ?? '') ?: null,
            trim($body['tim_b']          ?? '') ?: null,
            trim($body['lokasi']         ?? '') ?: null,
            trim($body['waktu_mulai']    ?? '') ?: null,
            trim($body['waktu_selesai']  ?? '') ?: null,
            in_array($body['status'] ?? '', ['scheduled','ongoing','selesai'], true)
                ? $body['status'] : 'scheduled',
            $id,
        ]);
        jsonResponse(['success' => true, 'message' => 'Jadwal berhasil diupdate']);

    case 'DELETE':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM jadwal WHERE id = ?');
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Jadwal berhasil dihapus']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
