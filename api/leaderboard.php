<?php
/**
 * API Leaderboard - Ranking Korlap
 * GET /api/leaderboard.php - Get leaderboard
 * POST /api/leaderboard.php - Recalculate leaderboard
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil leaderboard dengan ranking
    try {
        $stmt = $pdo->prepare("
            SELECT l.*, k.nama_korlap, k.jumlah_kk
            FROM leaderboard l
            LEFT JOIN korlap k ON l.korlap_id = k.id
            ORDER BY l.ranking ASC
        ");
        $stmt->execute();
        $leaderboard = $stmt->fetchAll();

        response('success', 'Leaderboard berhasil diambil', $leaderboard);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Recalculate leaderboard dari skor
    try {
        // Get all skor dengan poin
        $stmt = $pdo->prepare("
            SELECT korlap_1_id as korlap_id, SUM(poin_korlap_1) as total_poin,
                   COUNT(CASE WHEN pemenang_id = korlap_1_id THEN 1 END) as wins
            FROM skor
            WHERE status = 'selesai'
            GROUP BY korlap_1_id
            UNION ALL
            SELECT korlap_2_id as korlap_id, SUM(poin_korlap_2) as total_poin,
                   COUNT(CASE WHEN pemenang_id = korlap_2_id THEN 1 END) as wins
            FROM skor
            WHERE korlap_2_id IS NOT NULL AND status = 'selesai'
            GROUP BY korlap_2_id
        ");
        $stmt->execute();
        $scores = $stmt->fetchAll();

        // Combine scores for each korlap
        $korlap_totals = [];
        foreach ($scores as $score) {
            $id = $score['korlap_id'];
            if (!isset($korlap_totals[$id])) {
                $korlap_totals[$id] = ['total_poin' => 0, 'wins' => 0];
            }
            $korlap_totals[$id]['total_poin'] += $score['total_poin'] ?? 0;
            $korlap_totals[$id]['wins'] += $score['wins'] ?? 0;
        }

        // Sort by total poin
        uasort($korlap_totals, function($a, $b) {
            return $b['total_poin'] <=> $a['total_poin'];
        });

        // Update leaderboard
        $ranking = 1;
        foreach ($korlap_totals as $korlap_id => $data) {
            $stmt = $pdo->prepare("
                UPDATE leaderboard
                SET total_poin = ?, ranking = ?
                WHERE korlap_id = ?
            ");
            $stmt->execute([$data['total_poin'], $ranking, $korlap_id]);
            $ranking++;
        }

        logActivity(null, 'CALCULATE', 'Recalculate leaderboard', 'leaderboard', null);

        response('success', 'Leaderboard berhasil diperbarui', ['updated_at' => date('Y-m-d H:i:s')]);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>