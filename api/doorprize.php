<?php
/**
 * API Doorprize - CRUD Operations
 * GET /api/doorprize.php - Get all doorprize
 * POST /api/doorprize.php - Create doorprize
 * PUT /api/doorprize.php?id=X - Update doorprize
 * DELETE /api/doorprize.php?id=X - Delete doorprize
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua doorprize
    try {
        $stmt = $pdo->prepare("
            SELECT d.*, COUNT(dw.id) as terpilih
            FROM doorprize d
            LEFT JOIN doorprize_winner dw ON d.id = dw.doorprize_id
            GROUP BY d.id
            ORDER BY d.id
        ");
        $stmt->execute();
        $doorprize = $stmt->fetchAll();

        response('success', 'Data doorprize berhasil diambil', $doorprize);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah doorprize baru
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'nama_hadiah' => 'required'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO doorprize (nama_hadiah, nilai_hadiah, emoji, jumlah_hadiah, tersisa)
            VALUES (?, ?, ?, ?, ?)
        ");

        $jumlah = $input['jumlah_hadiah'] ?? 1;
        $stmt->execute([
            $input['nama_hadiah'],
            $input['nilai_hadiah'] ?? 0,
            $input['emoji'] ?? '🎁',
            $jumlah,
            $jumlah
        ]);

        $id = $pdo->lastInsertId();
        logActivity(null, 'CREATE', 'Tambah doorprize baru', 'doorprize', $id);

        response('success', 'Doorprize berhasil ditambahkan', ['id' => $id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'PUT') {
    // PUT: Update doorprize
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID doorprize diperlukan', null, 400);
        }

        $input = getJsonInput();

        $stmt = $pdo->prepare('SELECT * FROM doorprize WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Doorprize tidak ditemukan', null, 404);
        }

        $updateFields = [];
        $params = [];

        $fields = ['nama_hadiah', 'nilai_hadiah', 'emoji', 'jumlah_hadiah', 'tersisa'];
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
        $query = 'UPDATE doorprize SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        logActivity(null, 'UPDATE', 'Update doorprize', 'doorprize', $id);

        response('success', 'Doorprize berhasil diupdate');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'DELETE') {
    // DELETE: Hapus doorprize
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID doorprize diperlukan', null, 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM doorprize WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Doorprize tidak ditemukan', null, 404);
        }

        $stmt = $pdo->prepare('DELETE FROM doorprize WHERE id = ?');
        $stmt->execute([$id]);

        logActivity(null, 'DELETE', 'Hapus doorprize', 'doorprize', $id);

        response('success', 'Doorprize berhasil dihapus');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>