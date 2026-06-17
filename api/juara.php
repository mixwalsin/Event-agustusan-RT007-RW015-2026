<?php
/**
 * API Juara - CRUD Operations
 * GET /api/juara.php - Get all juara
 * POST /api/juara.php - Create juara
 * PUT /api/juara.php?id=X - Update juara
 * DELETE /api/juara.php?id=X - Delete juara
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua juara
    try {
        $cabor_id = $queryParams['cabor_id'] ?? null;
        $rangking = $queryParams['rangking'] ?? null;

        $query = 'SELECT j.*, c.nama_cabor, c.emoji, k.nama_korlap
                  FROM juara j
                  LEFT JOIN cabor c ON j.cabor_id = c.id
                  LEFT JOIN korlap k ON j.korlap_id = k.id
                  WHERE 1=1';
        $params = [];

        if ($cabor_id) {
            $query .= ' AND j.cabor_id = ?';
            $params[] = $cabor_id;
        }
        if ($rangking) {
            $query .= ' AND j.rangking = ?';
            $params[] = $rangking;
        }

        $query .= ' ORDER BY j.cabor_id, j.rangking';

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $juara = $stmt->fetchAll();

        response('success', 'Data juara berhasil diambil', $juara);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah juara baru
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'cabor_id' => 'required|numeric',
            'rangking' => 'required',
            'korlap_id' => 'required|numeric'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        // Check if combination already exists
        $stmt = $pdo->prepare('SELECT id FROM juara WHERE cabor_id = ? AND rangking = ?');
        $stmt->execute([$input['cabor_id'], $input['rangking']]);
        if ($stmt->fetch()) {
            response('error', 'Juara untuk cabor dan ranking ini sudah ada', null, 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO juara (cabor_id, rangking, korlap_id, poin, catatan)
            VALUES (?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $input['cabor_id'],
            $input['rangking'],
            $input['korlap_id'],
            $input['poin'] ?? 0,
            $input['catatan'] ?? null
        ]);

        $id = $pdo->lastInsertId();
        logActivity(null, 'CREATE', 'Tambah juara baru', 'juara', $id);

        response('success', 'Juara berhasil ditambahkan', ['id' => $id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'PUT') {
    // PUT: Update juara
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID juara diperlukan', null, 400);
        }

        $input = getJsonInput();

        $stmt = $pdo->prepare('SELECT * FROM juara WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Juara tidak ditemukan', null, 404);
        }

        $updateFields = [];
        $params = [];

        $fields = ['cabor_id', 'rangking', 'korlap_id', 'poin', 'catatan'];
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
        $query = 'UPDATE juara SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        logActivity(null, 'UPDATE', 'Update juara', 'juara', $id);

        response('success', 'Juara berhasil diupdate');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'DELETE') {
    // DELETE: Hapus juara
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID juara diperlukan', null, 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM juara WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Juara tidak ditemukan', null, 404);
        }

        $stmt = $pdo->prepare('DELETE FROM juara WHERE id = ?');
        $stmt->execute([$id]);

        logActivity(null, 'DELETE', 'Hapus juara', 'juara', $id);

        response('success', 'Juara berhasil dihapus');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>