<?php
/**
 * API Log Aktivitas - Read Only
 * GET /api/log.php - Get activity logs
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil log aktivitas
    try {
        $limit = intval($queryParams['limit'] ?? 100);
        $admin_id = $queryParams['admin_id'] ?? null;
        $tabel = $queryParams['tabel'] ?? null;
        $aksi = $queryParams['aksi'] ?? null;

        $query = 'SELECT l.*, a.nama as admin_nama FROM log_aktivitas l
                  LEFT JOIN admin a ON l.admin_id = a.id
                  WHERE 1=1';
        $params = [];

        if ($admin_id) {
            $query .= ' AND l.admin_id = ?';
            $params[] = $admin_id;
        }
        if ($tabel) {
            $query .= ' AND l.tabel = ?';
            $params[] = $tabel;
        }
        if ($aksi) {
            $query .= ' AND l.aksi = ?';
            $params[] = $aksi;
        }

        $query .= ' ORDER BY l.created_at DESC LIMIT ?';
        $params[] = $limit;

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $logs = $stmt->fetchAll();

        response('success', 'Log aktivitas berhasil diambil', $logs);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>