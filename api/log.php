<?php
/**
 * api/log.php
 * GET – daftar log aktivitas (opsional: ?limit=50)
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

if (getMethod() !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}

$limit = min((int)($_GET['limit'] ?? 50), 200);
$pdo   = getDB();
$stmt  = $pdo->prepare(
    'SELECT * FROM log_aktivitas ORDER BY created_at DESC LIMIT ?'
);
$stmt->bindValue(1, $limit, PDO::PARAM_INT);
$stmt->execute();

jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
