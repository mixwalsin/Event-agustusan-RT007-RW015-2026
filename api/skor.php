<?php
/**
 * api/skor.php
 * GET    – semua skor atau skor per jadwal (?jadwal_id=)
 * POST   – tambah/upsert skor
 * PUT    – update skor (?id=)
 * DELETE – hapus skor  (?id=)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();
$id     = (int)($_GET['id'] ?? 0);

switch ($method) {

    case 'GET':
        if (!empty($_GET['jadwal_id'])) {
            $stmt = $pdo->prepare(
                'SELECT s.*, j.nama_match, j.tim_a, j.tim_b, j.status AS status_match
                 FROM skor s
                 JOIN jadwal j ON j.id = s.jadwal_id
                 WHERE s.jadwal_id = ?'
            );
            $stmt->execute([(int)$_GET['jadwal_id']]);
        } else {
            $stmt = $pdo->query(
                'SELECT s.*, j.nama_match, j.tim_a, j.tim_b, j.status AS status_match,
                        c.nama AS nama_cabor
                 FROM skor s
                 JOIN jadwal j ON j.id = s.jadwal_id
                 LEFT JOIN cabor c ON c.id = j.cabor_id
                 ORDER BY s.updated_at DESC'
            );
        }
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    case 'POST':
        $body      = getRequestBody();
        $jadwalId  = (int)($body['jadwal_id'] ?? 0);
        if ($jadwalId <= 0) {
            jsonResponse(['success' => false, 'message' => 'jadwal_id wajib diisi'], 400);
        }
        // Upsert
        $stmt = $pdo->prepare(
            'INSERT INTO skor (jadwal_id, skor_a, skor_b, keterangan, updated_by)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               skor_a      = VALUES(skor_a),
               skor_b      = VALUES(skor_b),
               keterangan  = VALUES(keterangan),
               updated_by  = VALUES(updated_by)'
        );
        $stmt->execute([
            $jadwalId,
            (int)($body['skor_a']     ?? 0),
            (int)($body['skor_b']     ?? 0),
            trim($body['keterangan']  ?? '') ?: null,
            trim($body['updated_by']  ?? '') ?: null,
        ]);
        // Update status jadwal menjadi 'selesai' jika ada flag
        if (!empty($body['selesai'])) {
            $upd = $pdo->prepare("UPDATE jadwal SET status = 'selesai' WHERE id = ?");
            $upd->execute([$jadwalId]);
        }
        logAktivitas('update_skor', "JadwalID: {$jadwalId}");
        jsonResponse(['success' => true, 'message' => 'Skor berhasil disimpan']);

    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body = getRequestBody();
        $stmt = $pdo->prepare(
            'UPDATE skor SET skor_a=?, skor_b=?, keterangan=?, updated_by=? WHERE id=?'
        );
        $stmt->execute([
            (int)($body['skor_a']    ?? 0),
            (int)($body['skor_b']    ?? 0),
            trim($body['keterangan'] ?? '') ?: null,
            trim($body['updated_by'] ?? '') ?: null,
            $id,
        ]);
        jsonResponse(['success' => true, 'message' => 'Skor berhasil diupdate']);

    case 'DELETE':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM skor WHERE id = ?');
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Skor berhasil dihapus']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
