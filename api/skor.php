<?php
/**
 * API Skor (Pertandingan) - CRUD Operations
 * GET /api/skor.php - Get all skor
 * POST /api/skor.php - Create skor
 * PUT /api/skor.php?id=X - Update skor
 * DELETE /api/skor.php?id=X - Delete skor
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua skor dengan detail
    try {
        $jadwal_id = $queryParams['jadwal_id'] ?? null;
        $status = $queryParams['status'] ?? null;

        $query = 'SELECT s.*,
                         j.waktu_mulai,
                         j.lokasi,
                         c.nama_cabor,
                         k1.nama_korlap as nama_korlap_1,
                         k2.nama_korlap as nama_korlap_2,
                         kp.nama_korlap as nama_pemenang
                  FROM skor s
                  LEFT JOIN jadwal j ON s.jadwal_id = j.id
                  LEFT JOIN cabor c ON j.cabor_id = c.id
                  LEFT JOIN korlap k1 ON s.korlap_1_id = k1.id
                  LEFT JOIN korlap k2 ON s.korlap_2_id = k2.id
                  LEFT JOIN korlap kp ON s.pemenang_id = kp.id
                  WHERE 1=1';
        $params = [];

        if ($jadwal_id) {
            $query .= ' AND s.jadwal_id = ?';
            $params[] = $jadwal_id;
        }
        if ($status) {
            $query .= ' AND s.status = ?';
            $params[] = $status;
        }

        $query .= ' ORDER BY j.waktu_mulai DESC';

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $skor = $stmt->fetchAll();

        response('success', 'Data skor berhasil diambil', $skor);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah skor baru
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'jadwal_id' => 'required|numeric',
            'korlap_1_id' => 'required|numeric'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO skor (jadwal_id, korlap_1_id, korlap_2_id, skor_korlap_1, skor_korlap_2, pemenang_id, poin_korlap_1, poin_korlap_2, status, catatan)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $input['jadwal_id'],
            $input['korlap_1_id'],
            $input['korlap_2_id'] ?? null,
            $input['skor_korlap_1'] ?? 0,
            $input['skor_korlap_2'] ?? 0,
            $input['pemenang_id'] ?? null,
            $input['poin_korlap_1'] ?? 0,
            $input['poin_korlap_2'] ?? 0,
            $input['status'] ?? 'pending',
            $input['catatan'] ?? null
        ]);

        $id = $pdo->lastInsertId();
        logActivity(null, 'CREATE', 'Tambah skor pertandingan baru', 'skor', $id);

        response('success', 'Skor berhasil ditambahkan', ['id' => $id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'PUT') {
    // PUT: Update skor
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID skor diperlukan', null, 400);
        }

        $input = getJsonInput();

        $stmt = $pdo->prepare('SELECT * FROM skor WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Skor tidak ditemukan', null, 404);
        }

        $updateFields = [];
        $params = [];

        $fields = ['jadwal_id', 'korlap_1_id', 'korlap_2_id', 'skor_korlap_1', 'skor_korlap_2', 'pemenang_id', 'poin_korlap_1', 'poin_korlap_2', 'status', 'catatan'];
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
        $query = 'UPDATE skor SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        logActivity(null, 'UPDATE', 'Update skor pertandingan', 'skor', $id);

        response('success', 'Skor berhasil diupdate');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'DELETE') {
    // DELETE: Hapus skor
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID skor diperlukan', null, 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM skor WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Skor tidak ditemukan', null, 404);
        }

        $stmt = $pdo->prepare('DELETE FROM skor WHERE id = ?');
        $stmt->execute([$id]);

        logActivity(null, 'DELETE', 'Hapus skor pertandingan', 'skor', $id);

        response('success', 'Skor berhasil dihapus');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>