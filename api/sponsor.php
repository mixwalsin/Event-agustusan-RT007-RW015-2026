<?php
/**
 * API Sponsor - CRUD Operations
 * GET /api/sponsor.php - Get all sponsor
 * POST /api/sponsor.php - Create sponsor
 * PUT /api/sponsor.php?id=X - Update sponsor
 * DELETE /api/sponsor.php?id=X - Delete sponsor
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua sponsor
    try {
        $kategori = $queryParams['kategori'] ?? null;

        $query = 'SELECT * FROM sponsor WHERE 1=1';
        $params = [];

        if ($kategori) {
            $query .= ' AND kategori = ?';
            $params[] = $kategori;
        }

        $query .= ' ORDER BY kategori DESC, created_at';

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $sponsor = $stmt->fetchAll();

        response('success', 'Data sponsor berhasil diambil', $sponsor);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah sponsor baru
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'nama_sponsor' => 'required'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO sponsor (nama_sponsor, kategori, logo_url, website, deskripsi, kontak, no_telepon, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $input['nama_sponsor'],
            $input['kategori'] ?? 'pendamping',
            $input['logo_url'] ?? null,
            $input['website'] ?? null,
            $input['deskripsi'] ?? null,
            $input['kontak'] ?? null,
            $input['no_telepon'] ?? null,
            $input['email'] ?? null
        ]);

        $id = $pdo->lastInsertId();
        logActivity(null, 'CREATE', 'Tambah sponsor baru', 'sponsor', $id);

        response('success', 'Sponsor berhasil ditambahkan', ['id' => $id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'PUT') {
    // PUT: Update sponsor
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID sponsor diperlukan', null, 400);
        }

        $input = getJsonInput();

        $stmt = $pdo->prepare('SELECT * FROM sponsor WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Sponsor tidak ditemukan', null, 404);
        }

        $updateFields = [];
        $params = [];

        $fields = ['nama_sponsor', 'kategori', 'logo_url', 'website', 'deskripsi', 'kontak', 'no_telepon', 'email'];
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
        $query = 'UPDATE sponsor SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        logActivity(null, 'UPDATE', 'Update sponsor', 'sponsor', $id);

        response('success', 'Sponsor berhasil diupdate');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'DELETE') {
    // DELETE: Hapus sponsor
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID sponsor diperlukan', null, 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM sponsor WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Sponsor tidak ditemukan', null, 404);
        }

        $stmt = $pdo->prepare('DELETE FROM sponsor WHERE id = ?');
        $stmt->execute([$id]);

        logActivity(null, 'DELETE', 'Hapus sponsor', 'sponsor', $id);

        response('success', 'Sponsor berhasil dihapus');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>