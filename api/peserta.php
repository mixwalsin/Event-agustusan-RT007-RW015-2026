<?php
/**
 * API Peserta - CRUD Operations
 * GET /api/peserta.php - Get all peserta
 * POST /api/peserta.php - Create peserta
 * PUT /api/peserta.php?id=X - Update peserta
 * DELETE /api/peserta.php?id=X - Delete peserta
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua peserta
    try {
        $korlap_id = $queryParams['korlap_id'] ?? null;
        $cabor_id = $queryParams['cabor_id'] ?? null;
        $status = $queryParams['status'] ?? null;

        $query = 'SELECT p.*, k.nama_korlap, c.nama_cabor FROM peserta p
                  LEFT JOIN korlap k ON p.korlap_id = k.id
                  LEFT JOIN cabor c ON p.cabor_id = c.id
                  WHERE 1=1';
        $params = [];

        if ($korlap_id) {
            $query .= ' AND p.korlap_id = ?';
            $params[] = $korlap_id;
        }
        if ($cabor_id) {
            $query .= ' AND p.cabor_id = ?';
            $params[] = $cabor_id;
        }
        if ($status) {
            $query .= ' AND p.status = ?';
            $params[] = $status;
        }

        $query .= ' ORDER BY p.created_at DESC';

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $peserta = $stmt->fetchAll();

        response('success', 'Data peserta berhasil diambil', $peserta);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah peserta baru
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'nama' => 'required',
            'korlap_id' => 'required|numeric',
            'cabor_id' => 'required|numeric'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO peserta (no_ktp, nama, email, no_telepon, korlap_id, cabor_id, jenis_kelamin, tanggal_lahir, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $input['no_ktp'] ?? null,
            $input['nama'],
            $input['email'] ?? null,
            $input['no_telepon'] ?? null,
            $input['korlap_id'],
            $input['cabor_id'],
            $input['jenis_kelamin'] ?? 'laki-laki',
            $input['tanggal_lahir'] ?? null,
            $input['status'] ?? 'daftar'
        ]);

        $id = $pdo->lastInsertId();
        logActivity(null, 'CREATE', 'Tambah peserta baru', 'peserta', $id);

        response('success', 'Peserta berhasil ditambahkan', ['id' => $id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'PUT') {
    // PUT: Update peserta
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID peserta diperlukan', null, 400);
        }

        $input = getJsonInput();

        $stmt = $pdo->prepare('SELECT * FROM peserta WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Peserta tidak ditemukan', null, 404);
        }

        $updateFields = [];
        $params = [];

        $fields = ['nama', 'email', 'no_telepon', 'korlap_id', 'cabor_id', 'jenis_kelamin', 'tanggal_lahir', 'status', 'no_ktp'];
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
        $query = 'UPDATE peserta SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        logActivity(null, 'UPDATE', 'Update peserta', 'peserta', $id);

        response('success', 'Peserta berhasil diupdate');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'DELETE') {
    // DELETE: Hapus peserta
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID peserta diperlukan', null, 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM peserta WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Peserta tidak ditemukan', null, 404);
        }

        $stmt = $pdo->prepare('DELETE FROM peserta WHERE id = ?');
        $stmt->execute([$id]);

        logActivity(null, 'DELETE', 'Hapus peserta', 'peserta', $id);

        response('success', 'Peserta berhasil dihapus');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>