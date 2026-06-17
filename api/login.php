<?php
/**
 * Login API - Admin Authentication
 * POST /api/login.php
 */

require_once 'config.php';

if (getMethod() !== 'POST') {
    response('error', 'Method not allowed', null, 405);
}

$input = getJsonInput();

// Validasi
$errors = validate($input, [
    'username' => 'required',
    'password' => 'required'
]);

if (!empty($errors)) {
    response('error', 'Validation failed', $errors, 400);
}

try {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    // Cari admin
    $stmt = $pdo->prepare('SELECT * FROM admin WHERE username = ? AND active = 1');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin || !verifyPassword($password, $admin['password'])) {
        response('error', 'Username atau password salah', null, 401);
    }

    // Update last login
    $stmt = $pdo->prepare('UPDATE admin SET last_login = NOW() WHERE id = ?');
    $stmt->execute([$admin['id']]);

    // Log aktivitas
    logActivity($admin['id'], 'LOGIN', 'Admin login berhasil');

    // Response
    $response = [
        'id' => $admin['id'],
        'username' => $admin['username'],
        'nama' => $admin['nama'],
        'email' => $admin['email'],
        'role' => $admin['role'],
        'token' => bin2hex(random_bytes(32)) // Simple token, bisa ganti JWT
    ];

    response('success', 'Login berhasil', $response);

} catch (Exception $e) {
    response('error', $e->getMessage(), null, 500);
}
?>