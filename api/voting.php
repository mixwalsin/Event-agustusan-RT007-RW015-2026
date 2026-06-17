<?php
/**
 * API Voting - Vote Tracking
 * GET /api/voting.php - Get voting results
 * POST /api/voting.php - Submit vote
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil hasil voting
    try {
        $stmt = $pdo->prepare("
            SELECT v.*, k.nama_korlap,
                   (SELECT COUNT(*) FROM voting_log) as total_votes
            FROM voting v
            LEFT JOIN korlap k ON v.korlap_id = k.id
            ORDER BY v.total_suara DESC
        ");
        $stmt->execute();
        $voting = $stmt->fetchAll();

        // Hitung persentase
        if (!empty($voting)) {
            $total = array_sum(array_column($voting, 'total_suara'));
            foreach ($voting as &$vote) {
                $vote['persentase'] = $total > 0 ? round(($vote['total_suara'] / $total) * 100, 2) : 0;
            }
        }

        response('success', 'Data voting berhasil diambil', $voting);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Submit vote
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'korlap_id' => 'required|numeric'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        // Check korlap exists
        $stmt = $pdo->prepare('SELECT id FROM korlap WHERE id = ?');
        $stmt->execute([$input['korlap_id']]);
        if (!$stmt->fetch()) {
            response('error', 'Korlap tidak ditemukan', null, 404);
        }

        // Get device ID or IP
        $device_id = $input['device_id'] ?? md5(getClientIP());
        $ip = getClientIP();

        // Check if already voted (per device)
        $stmt = $pdo->prepare('SELECT id FROM voting_log WHERE device_id = ? OR ip_address = ?');
        $stmt->execute([$device_id, $ip]);
        if ($stmt->fetch()) {
            response('error', 'Anda sudah melakukan voting', null, 400);
        }

        // Add voting log
        $stmt = $pdo->prepare("
            INSERT INTO voting_log (korlap_id, ip_address, device_id)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$input['korlap_id'], $ip, $device_id]);

        // Update voting count
        $stmt = $pdo->prepare("
            UPDATE voting
            SET total_suara = total_suara + 1
            WHERE korlap_id = ?
        ");
        $stmt->execute([$input['korlap_id']]);

        logActivity(null, 'CREATE', 'Submit voting', 'voting', $input['korlap_id']);

        response('success', 'Voting berhasil dicatat');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>