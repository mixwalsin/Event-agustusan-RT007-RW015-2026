<?php
/**
 * API Galeri - CRUD Operations
 * GET /api/galeri.php - Get all galeri
 * POST /api/galeri.php - Create galeri
 * PUT /api/galeri.php?id=X - Update galeri
 * DELETE /api/galeri.php?id=X - Delete galeri
 */

require_once 'config.php';

if (getMethod() === 'GET') {
    // GET: Ambil semua galeri
    try {
        $kategori = $queryParams['kategori'] ?? null;

        $query = 'SELECT * FROM galeri WHERE 1=1';
        $params = [];

        if ($kategori) {
            $query .= ' AND kategori = ?';
            $params[] = $kategori;
        }

        $query .= ' ORDER BY created_at DESC';

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $galeri = $stmt->fetchAll();

        response('success', 'Data galeri berhasil diambil', $galeri);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'POST') {
    // POST: Tambah galeri baru
    try {
        $input = getJsonInput();

        $errors = validate($input, [
            'judul' => 'required',
            'url_foto' => 'required'
        ]);

        if (!empty($errors)) {
            response('error', 'Validation failed', $errors, 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO galeri (judul, deskripsi, url_foto, kategori)
            VALUES (?, ?, ?, ?)
        ");

        $stmt->execute([
            $input['judul'],
            $input['deskripsi'] ?? null,
            $input['url_foto'],
            $input['kategori'] ?? null
        ]);

        $id = $pdo->lastInsertId();
        logActivity(null, 'CREATE', 'Tambah galeri baru', 'galeri', $id);

        response('success', 'Galeri berhasil ditambahkan', ['id' => $id], 201);
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'PUT') {
    // PUT: Update galeri
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID galeri diperlukan', null, 400);
        }

        $input = getJsonInput();

        $stmt = $pdo->prepare('SELECT * FROM galeri WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Galeri tidak ditemukan', null, 404);
        }

        $updateFields = [];
        $params = [];

        $fields = ['judul', 'deskripsi', 'url_foto', 'kategori'];
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
        $query = 'UPDATE galeri SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        logActivity(null, 'UPDATE', 'Update galeri', 'galeri', $id);

        response('success', 'Galeri berhasil diupdate');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

elseif (getMethod() === 'DELETE') {
    // DELETE: Hapus galeri
    try {
        $id = $queryParams['id'] ?? null;
        if (!$id) {
            response('error', 'ID galeri diperlukan', null, 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM galeri WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            response('error', 'Galeri tidak ditemukan', null, 404);
        }

        $stmt = $pdo->prepare('DELETE FROM galeri WHERE id = ?');
        $stmt->execute([$id]);

        logActivity(null, 'DELETE', 'Hapus galeri', 'galeri', $id);

        response('success', 'Galeri berhasil dihapus');
    } catch (Exception $e) {
        response('error', $e->getMessage(), null, 500);
    }
}

else {
    response('error', 'Method not allowed', null, 405);
}
?>