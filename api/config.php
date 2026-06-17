<?php
/**
 * Configuration Database
 * PHP 8.2 dengan PDO untuk MySQL
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Default XAMPP: kosong
define('DB_NAME', 'agustusan_rt007_2026');
define('DB_PORT', 3306);

// API Configuration
define('API_KEY', 'semarak-agustusan-2026');
define('JWT_SECRET', 'your-secret-key-change-this');

// Connection String DSN
$dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';

try {
    $pdo = new PDO(
        $dsn,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
    // Set timezone
    $pdo->exec("SET time_zone='+07:00'");
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed',
        'detail' => $e->getMessage() // Remove in production
    ]);
    exit();
}

// Helper Functions

/**
 * Get request method
 */
function getMethod() {
    return strtoupper($_SERVER['REQUEST_METHOD']);
}

/**
 * Get JSON input
 */
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

/**
 * Response JSON
 */
function response($status, $message, $data = null, $code = 200) {
    http_response_code($code);
    $response = [
        'status' => $status,
        'message' => $message
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Validasi input
 */
function validate($data, $rules) {
    $errors = [];
    foreach ($rules as $field => $rule) {
        if (strpos($rule, 'required') !== false && empty($data[$field])) {
            $errors[$field] = "Field $field is required";
        }
        if (strpos($rule, 'email') !== false && !empty($data[$field]) && !filter_var($data[$field], FILTER_VALIDATE_EMAIL)) {
            $errors[$field] = "Field $field must be valid email";
        }
        if (strpos($rule, 'numeric') !== false && !empty($data[$field]) && !is_numeric($data[$field])) {
            $errors[$field] = "Field $field must be numeric";
        }
    }
    return $errors;
}

/**
 * Hash password
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

/**
 * Verify password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Log aktivitas
 */
function logActivity($admin_id, $action, $description, $table = null, $record_id = null) {
    global $pdo;
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
        $stmt = $pdo->prepare("
            INSERT INTO log_aktivitas (admin_id, aksi, deskripsi, tabel, id_record, ip_address)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$admin_id, $action, $description, $table, $record_id, $ip]);
    } catch (Exception $e) {
        // Silent fail for logging
    }
}

/**
 * Get client IP
 */
function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

// Get query parameters
$queryParams = $_GET ?? [];
$pathInfo = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
?>