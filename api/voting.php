<?php
/**
 * api/voting.php
 * GET  – hasil voting (opsional: ?kategori=)
 * POST – submit vote { kategori, korlap_id }
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

$pdo    = getDB();
$method = getMethod();

switch ($method) {

    case 'GET':
        if (!empty($_GET['kategori'])) {
            $stmt = $pdo->prepare(
                'SELECT v.*, k.nama AS nama_korlap
                 FROM voting v
                 JOIN korlap k ON k.id = v.korlap_id
                 WHERE v.kategori = ?
                 ORDER BY v.jumlah_vote DESC'
            );
            $stmt->execute([$_GET['kategori']]);
        } else {
            $stmt = $pdo->query(
                'SELECT v.*, k.nama AS nama_korlap
                 FROM voting v
                 JOIN korlap k ON k.id = v.korlap_id
                 ORDER BY v.kategori ASC, v.jumlah_vote DESC'
            );
        }
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);

    case 'POST':
        $body     = getRequestBody();
        $kategori = trim($body['kategori'] ?? '');
        $korlapId = (int)($body['korlap_id'] ?? 0);

        if ($kategori === '' || $korlapId <= 0) {
            jsonResponse(['success' => false, 'message' => 'kategori dan korlap_id wajib diisi'], 400);
        }

        // Cek apakah kombinasi sudah ada
        $check = $pdo->prepare('SELECT id FROM voting WHERE kategori = ? AND korlap_id = ?');
        $check->execute([$kategori, $korlapId]);
        if (!$check->fetch()) {
            // Insert baru jika belum ada
            $ins = $pdo->prepare('INSERT INTO voting (kategori, korlap_id, jumlah_vote) VALUES (?, ?, 1)');
            $ins->execute([$kategori, $korlapId]);
        } else {
            // Increment
            $upd = $pdo->prepare(
                'UPDATE voting SET jumlah_vote = jumlah_vote + 1 WHERE kategori = ? AND korlap_id = ?'
            );
            $upd->execute([$kategori, $korlapId]);
        }
        jsonResponse(['success' => true, 'message' => 'Vote berhasil dikirim']);

    default:
        jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}
