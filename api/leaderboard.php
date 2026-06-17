<?php
/**
 * api/leaderboard.php
 * GET  – klasemen korlap
 * POST – update poin korlap (upsert)
 * PUT  – update leaderboard (?id=)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();
$id     = (int)($_GET['id'] ?? 0);

switch ($method) {

    case 'GET':
        $stmt = $pdo->query(
            'SELECT l.*, k.nama AS nama_korlap, k.ketua, k.warna
             FROM leaderboard l
             JOIN korlap k ON k.id = l.korlap_id
             ORDER BY l.total_poin DESC, l.emas DESC, l.perak DESC, l.perunggu DESC'
        );
        $rows = $stmt->fetchAll();
        foreach ($rows as $i => &$row) {
            $row['peringkat'] = $i + 1;
        }
        unset($row);
        jsonResponse(['success' => true, 'data' => $rows]);

    case 'POST':
        $body     = getRequestBody();
        $korlapId = (int)($body['korlap_id'] ?? 0);
        if ($korlapId <= 0) {
            jsonResponse(['success' => false, 'message' => 'korlap_id wajib diisi'], 400);
        }
        $emas     = (int)($body['emas']     ?? 0);
        $perak    = (int)($body['perak']    ?? 0);
        $perunggu = (int)($body['perunggu'] ?? 0);
        $total    = isset($body['total_poin'])
            ? (int)$body['total_poin']
            : ($emas * 3 + $perak * 2 + $perunggu * 1);

        $stmt = $pdo->prepare(
            'INSERT INTO leaderboard (korlap_id, emas, perak, perunggu, total_poin)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               emas       = VALUES(emas),
               perak      = VALUES(perak),
               perunggu   = VALUES(perunggu),
               total_poin = VALUES(total_poin)'
        );
        $stmt->execute([$korlapId, $emas, $perak, $perunggu, $total]);
        logAktivitas('update_leaderboard', "KorlapID: {$korlapId}");
        jsonResponse(['success' => true, 'message' => 'Leaderboard berhasil diupdate']);

    case 'PUT':
        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'Parameter id wajib diisi'], 400);
        }
        $body     = getRequestBody();
        $emas     = (int)($body['emas']     ?? 0);
        $perak    = (int)($body['perak']    ?? 0);
        $perunggu = (int)($body['perunggu'] ?? 0);
        $total    = isset($body['total_poin'])
            ? (int)$body['total_poin']
            : ($emas * 3 + $perak * 2 + $perunggu * 1);
        $stmt = $pdo->prepare(
            'UPDATE leaderboard SET emas=?, perak=?, perunggu=?, total_poin=? WHERE id=?'
        );
        $stmt->execute([$emas, $perak, $perunggu, $total, $id]);
        jsonResponse(['success' => true, 'message' => 'Leaderboard berhasil diupdate']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
