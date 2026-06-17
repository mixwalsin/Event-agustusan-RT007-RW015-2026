<?php
/**
 * API Cabang Olahraga (Cabor) - CRUD Operations
 * GET /api/cabor.php - Get all cabor
 * POST /api/cabor.php - Create cabor
 * PUT /api/cabor.php?id=X - Update cabor
 * DELETE /api/cabor.php?id=X - Delete cabor
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua cabor dengan statistik peserta
    try {
        $stmt = $pdo->prepare("
            SELECT c.*,
                   COUNT(p.id) as jumlah_peserta
            FROM cabor c
            LEFT JOIN peserta p ON c.id = p.cabor_id
            GROUP BY c.id
            ORDER BY c.id
        ");
        $stmt->execute();
        $cabor = $stmt->fetchAll();

        response('success', 'Data cabor berhasil diambil', $cabor);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah cabor baru
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'nama_cabor' => 'required'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO cabor (nama_cabor, emoji, deskripsi, kategori, status)
            VALUES (?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $input['nama_cabor'],
            $input['emoji'] ?? '🏆',
            $input['deskripsi'] ?? null,
            $input['kategori'] ?? null,
            $input['status'] ?? 'pendaftaran'
        ]);

        $id = $pdo->lastInsertId();
        logActivity(null, 'CREATE', 'Tambah cabor baru', 'cabor', $id);

        response('success', 'Cabor berhasil ditambahkan', ['id' => $id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'PUT') {
    // PUT: Update cabor
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID cabor diperlukan', null, 400);
        }

        $input = getJsonInput();

        $stmt = $pdo->prepare('SELECT * FROM cabor WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Cabor tidak ditemukan', null, 404);
        }

        $updateFields = [];
        $params = [];

        $fields = ['nama_cabor', 'emoji', 'deskripsi', 'kategori', 'status'];
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
        $query = 'UPDATE cabor SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        logActivity(null, 'UPDATE', 'Update cabor', 'cabor', $id);

        response('success', 'Cabor berhasil diupdate');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'DELETE') {
    // DELETE: Hapus cabor
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID cabor diperlukan', null, 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM cabor WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Cabor tidak ditemukan', null, 404);
        }

        $stmt = $pdo->prepare('DELETE FROM cabor WHERE id = ?');
        $stmt->execute([$id]);

        logActivity(null, 'DELETE', 'Hapus cabor', 'cabor', $id);

        response('success', 'Cabor berhasil dihapus');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>