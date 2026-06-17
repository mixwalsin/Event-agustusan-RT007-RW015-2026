<?php
/**
 * API Doorprize Winner - Add/Get Winners
 * GET /api/doorprize-winner.php - Get all winners
 * POST /api/doorprize-winner.php - Add winner
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua pemenang doorprize
    try {
        $stmt = $pdo->prepare("
            SELECT dw.*, d.nama_hadiah, d.emoji, k.nama_korlap
            FROM doorprize_winner dw
            LEFT JOIN doorprize d ON dw.doorprize_id = d.id
            LEFT JOIN korlap k ON dw.korlap_id = k.id
            ORDER BY dw.waktu_undian DESC
        ");
        $stmt->execute();
        $winners = $stmt->fetchAll();

        response('success', 'Data pemenang doorprize berhasil diambil', $winners);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah pemenang doorprize
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'doorprize_id' => 'required|numeric'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        // Check doorprize exists and has remaining stock
        $stmt = $pdo->prepare('SELECT * FROM doorprize WHERE id = ? AND tersisa > 0');
        $stmt->execute([$input['doorprize_id']]);
        $doorprize = $stmt->fetch();

        if (!$doorprize) {
            response('error', 'Doorprize tidak ditemukan atau stok habis', null, 404);
        }

        $stmt = $pdo->prepare("
            INSERT INTO doorprize_winner (doorprize_id, no_ktp, nama_pemenang, korlap_id, waktu_undian)
            VALUES (?, ?, ?, ?, NOW())
        ");

        $stmt->execute([
            $input['doorprize_id'],
            $input['no_ktp'] ?? null,
            $input['nama_pemenang'] ?? null,
            $input['korlap_id'] ?? null
        ]);

        $winner_id = $pdo->lastInsertId();

        // Update doorprize stock
        $stmt = $pdo->prepare('UPDATE doorprize SET tersisa = tersisa - 1 WHERE id = ?');
        $stmt->execute([$input['doorprize_id']]);

        logActivity(null, 'CREATE', 'Tambah pemenang doorprize', 'doorprize_winner', $winner_id);

        response('success', 'Pemenang doorprize berhasil ditambahkan', ['id' => $winner_id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>