<?php
/**
 * api/login.php
 * Login admin – POST /api/login.php
 * Body: { "username": "...", "password": "..." }
 */

declare(strict_types=1);
require_once __DIR__ . '/config.php';

if (getMethod() !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method tidak diizinkan'], 405);
}

$body    = getRequestBody();
$user    = trim($body['username'] ?? '');
$pass    = $body['password'] ?? '';

if ($user === '' || $pass === '') {
    jsonResponse(['success' => false, 'message' => 'Username dan password wajib diisi'], 400);
}

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id, username, password, nama FROM admin WHERE username = ? LIMIT 1');
$stmt->execute([$user]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($pass, $admin['password'])) {
    logAktivitas('login_gagal', "Username: {$user}");
    jsonResponse(['success' => false, 'message' => 'Username atau password salah'], 401);
}

logAktivitas('login_sukses', "Username: {$user}");

jsonResponse([
    'success' => true,
    'message' => 'Login berhasil',
    'data'    => [
        'id'       => $admin['id'],
        'username' => $admin['username'],
        'nama'     => $admin['nama'],
        'token'    => base64_encode($admin['id'] . ':' . sha1($admin['password'] . date('Ymd'))),
    ],
]);
