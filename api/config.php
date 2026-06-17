<?php
/**
 * api/config.php
 * Konfigurasi PDO, helper CORS, response JSON, parsing body, dan logging.
 * Digunakan oleh semua endpoint PHP lainnya.
 */

declare(strict_types=1);

// ---- Konfigurasi database -----------------------------------------------
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'agustusan_rt007_2026');
define('DB_USER', 'root');
define('DB_PASS', '');          // Sesuaikan password MySQL XAMPP Anda (WAJIB diganti di production!)
define('DB_CHARSET', 'utf8mb4');

// ---- CORS Header -----------------------------------------------------------
function setCorsHeaders(): void
{
    $allowedOrigins = [
        'http://localhost',
        'http://127.0.0.1',
        'https://mixwalsin.github.io',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
    }
    // Origin yang tidak dikenali tidak mendapat CORS header (request akan diblokir browser)

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ---- PDO Singleton ----------------------------------------------------------
function getDB(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
        );
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            jsonResponse(['success' => false, 'message' => 'Koneksi database gagal: ' . $e->getMessage()], 500);
        }
    }
    return $pdo;
}

// ---- Helpers ----------------------------------------------------------------
function jsonResponse(array $data, int $statusCode = 200): never
{
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getRequestBody(): array
{
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return $_POST ?: [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function getMethod(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function logAktivitas(string $aksi, string $keterangan = ''): void
{
    try {
        $pdo  = getDB();
        $ip   = $_SERVER['REMOTE_ADDR'] ?? '';
        $ua   = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 300);
        $stmt = $pdo->prepare(
            'INSERT INTO log_aktivitas (aksi, keterangan, ip_address, user_agent) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$aksi, $keterangan, $ip, $ua]);
    } catch (Throwable $e) {
        // Jangan hentikan eksekusi hanya karena log gagal; catat ke error_log untuk diagnosis
        error_log('[logAktivitas] Gagal menyimpan log: ' . $e->getMessage());
    }
}

// ---- Inisialisasi awal ------------------------------------------------------
setCorsHeaders();
header('Content-Type: application/json; charset=utf-8');
