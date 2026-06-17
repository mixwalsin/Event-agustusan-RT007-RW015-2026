<?php
/**
 * API Pengumuman - CRUD Operations
 * GET /api/pengumuman.php - Get all pengumuman
 * POST /api/pengumuman.php - Create pengumuman
 * PUT /api/pengumuman.php?id=X - Update pengumuman
 * DELETE /api/pengumuman.php?id=X - Delete pengumuman
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua pengumuman
    try {
        $tv_only = $queryParams['tv_only'] ?? false;
        $tipe = $queryParams['tipe'] ?? null;

        $query = 'SELECT p.*, a.nama as admin_nama FROM pengumuman p
                  LEFT JOIN admin a ON p.admin_id = a.id
                  WHERE 1=1';
        $params = [];

        if ($tv_only) {
            $query .= ' AND p.tampil_di_tv = 1';
        }
        if ($tipe) {
            $query .= ' AND p.tipe = ?';
            $params[] = $tipe;
        }

        $query .= ' ORDER BY p.urutan ASC, p.created_at DESC';

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $pengumuman = $stmt->fetchAll();

        response('success', 'Data pengumuman berhasil diambil', $pengumuman);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah pengumuman baru
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'judul' => 'required',
            'isi' => 'required'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO pengumuman (judul, isi, tipe, admin_id, tampil_di_tv, urutan)
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $input['judul'],
            $input['isi'],
            $input['tipe'] ?? 'info',
            $input['admin_id'] ?? null,
            $input['tampil_di_tv'] ?? false,
            $input['urutan'] ?? 0
        ]);

        $id = $pdo->lastInsertId();
        logActivity(null, 'CREATE', 'Tambah pengumuman baru', 'pengumuman', $id);

        response('success', 'Pengumuman berhasil ditambahkan', ['id' => $id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'PUT') {
    // PUT: Update pengumuman
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID pengumuman diperlukan', null, 400);
        }

        $input = getJsonInput();

        $stmt = $pdo->prepare('SELECT * FROM pengumuman WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Pengumuman tidak ditemukan', null, 404);
        }

        $updateFields = [];
        $params = [];

        $fields = ['judul', 'isi', 'tipe', 'admin_id', 'tampil_di_tv', 'urutan'];
        foreach ($fields as $field) {
            if (isset($input[$field])) {
                $updateFields[] = "$field = ?";
                $params[] = $input[$field];
            }
        }

        if (empty($updateFields)) {
            response('error', 'Tidak ada data yang diupdate', null, 400);
        }

        $params[] = $id;
        $query = 'UPDATE pengumuman SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        logActivity(null, 'UPDATE', 'Update pengumuman', 'pengumuman', $id);

        response('success', 'Pengumuman berhasil diupdate');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'DELETE') {
    // DELETE: Hapus pengumuman
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID pengumuman diperlukan', null, 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM pengumuman WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Pengumuman tidak ditemukan', null, 404);
        }

        $stmt = $pdo->prepare('DELETE FROM pengumuman WHERE id = ?');
        $stmt->execute([$id]);

        logActivity(null, 'DELETE', 'Hapus pengumuman', 'pengumuman', $id);

        response('success', 'Pengumuman berhasil dihapus');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>