<?php
/**
 * API Jadwal - CRUD Operations
 * GET /api/jadwal.php - Get all jadwal
 * POST /api/jadwal.php - Create jadwal
 * PUT /api/jadwal.php?id=X - Update jadwal
 * DELETE /api/jadwal.php?id=X - Delete jadwal
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua jadwal
    try {
        $cabor_id = $queryParams['cabor_id'] ?? null;
        $status = $queryParams['status'] ?? null;

        $query = 'SELECT j.*, c.nama_cabor, c.emoji
                  FROM jadwal j
                  LEFT JOIN cabor c ON j.cabor_id = c.id
                  WHERE 1=1';
        $params = [];

        if ($cabor_id) {
            $query .= ' AND j.cabor_id = ?';
            $params[] = $cabor_id;
        }
        if ($status) {
            $query .= ' AND j.status = ?';
            $params[] = $status;
        }

        $query .= ' ORDER BY j.waktu_mulai ASC';

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $jadwal = $stmt->fetchAll();

        response('success', 'Data jadwal berhasil diambil', $jadwal);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah jadwal baru
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'cabor_id' => 'required|numeric',
            'waktu_mulai' => 'required'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO jadwal (cabor_id, waktu_mulai, waktu_selesai, lokasi, deskripsi, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $input['cabor_id'],
            $input['waktu_mulai'],
            $input['waktu_selesai'] ?? null,
            $input['lokasi'] ?? null,
            $input['deskripsi'] ?? null,
            $input['status'] ?? 'terjadwal'
        ]);

        $id = $pdo->lastInsertId();
        logActivity(null, 'CREATE', 'Tambah jadwal baru', 'jadwal', $id);

        response('success', 'Jadwal berhasil ditambahkan', ['id' => $id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'PUT') {
    // PUT: Update jadwal
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID jadwal diperlukan', null, 400);
        }

        $input = getJsonInput();

        $stmt = $pdo->prepare('SELECT * FROM jadwal WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Jadwal tidak ditemukan', null, 404);
        }

        $updateFields = [];
        $params = [];

        $fields = ['cabor_id', 'waktu_mulai', 'waktu_selesai', 'lokasi', 'deskripsi', 'status'];
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
        $query = 'UPDATE jadwal SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        logActivity(null, 'UPDATE', 'Update jadwal', 'jadwal', $id);

        response('success', 'Jadwal berhasil diupdate');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'DELETE') {
    // DELETE: Hapus jadwal
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID jadwal diperlukan', null, 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM jadwal WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Jadwal tidak ditemukan', null, 404);
        }

        $stmt = $pdo->prepare('DELETE FROM jadwal WHERE id = ?');
        $stmt->execute([$id]);

        logActivity(null, 'DELETE', 'Hapus jadwal', 'jadwal', $id);

        response('success', 'Jadwal berhasil dihapus');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>