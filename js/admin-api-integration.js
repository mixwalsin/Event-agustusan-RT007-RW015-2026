/**
 * Integration layer untuk Admin Panel
 * Menghubungkan form inputs dengan API calls
 */

// ========== LOGIN SECTION ==========

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const result = await loginAdmin(username, password);
        if (result.success) {
            alert('Login berhasil! Selamat datang ' + result.data.nama);
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            updateAdminUI();
        } else {
            alert('Login gagal: ' + result.error);
        }
    });
}

/**
 * Update Admin UI setelah login
 */
function updateAdminUI() {
    if (ADMIN_INFO) {
        const adminName = document.getElementById('adminName');
        if (adminName) adminName.textContent = ADMIN_INFO.nama || ADMIN_INFO.username;
    }
}

/**
 * Logout
 */
function handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        logoutAdmin();
        location.reload();
    }
}

// ========== PESERTA INPUT ==========

const pesertaForm = document.getElementById('pesertaForm');
if (pesertaForm) {
    pesertaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            no_ktp: document.getElementById('pesertaKTP').value,
            nama: document.getElementById('pesertaNama').value,
            email: document.getElementById('pesertaEmail').value,
            no_telepon: document.getElementById('pesertaTelepon').value,
            korlap_id: document.getElementById('pesertaKorlap').value,
            cabor_id: document.getElementById('pesertaCabor').value,
            jenis_kelamin: document.getElementById('pesertaJK').value,
            tanggal_lahir: document.getElementById('pesertaTanggalLahir').value
        };

        const result = await addPeserta(data);
        if (result.success) {
            alert('Peserta berhasil ditambahkan!');
            pesertaForm.reset();
            loadPesertaList();
        } else {
            alert('Error: ' + result.error);
        }
    });
}

/**
 * Load daftar peserta
 */
async function loadPesertaList() {
    const peserta = await getPeserta();
    const table = document.getElementById('pesertaTable');

    if (!table) return;

    table.innerHTML = '<tr><th>ID</th><th>Nama</th><th>Korlap</th><th>Cabor</th><th>Aksi</th></tr>';

    peserta.forEach(p => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.nama}</td>
            <td>${p.nama_korlap || 'N/A'}</td>
            <td>${p.nama_cabor || 'N/A'}</td>
            <td>
                <button onclick="deletePesertaRow(${p.id})" class="btn-small">Hapus</button>
            </td>
        `;
    });
}

/**
 * Delete peserta
 */
async function deletePesertaRow(id) {
    if (confirm('Apakah Anda yakin ingin menghapus peserta ini?')) {
        const result = await deletePeserta(id);
        if (result.success) {
            alert('Peserta berhasil dihapus!');
            loadPesertaList();
        } else {
            alert('Error: ' + result.error);
        }
    }
}

// ========== SKOR INPUT ==========

const skorForm = document.getElementById('skorForm');
if (skorForm) {
    skorForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            jadwal_id: document.getElementById('skorJadwal').value,
            korlap_1_id: document.getElementById('skorKorlap1').value,
            korlap_2_id: document.getElementById('skorKorlap2').value || null,
            skor_korlap_1: document.getElementById('skorNilai1').value,
            skor_korlap_2: document.getElementById('skorNilai2').value || 0,
            pemenang_id: document.getElementById('skorPemenang').value || null,
            status: document.getElementById('skorStatus').value
        };

        // Jika ini update
        const skorId = skorForm.dataset.editId;
        let result;
        if (skorId) {
            result = await updateSkor(skorId, data);
            delete skorForm.dataset.editId;
        } else {
            result = await addSkor(data);
        }

        if (result.success) {
            alert('Skor berhasil disimpan!');
            skorForm.reset();
            loadSkorList();
        } else {
            alert('Error: ' + result.error);
        }
    });
}

/**
 * Add skor (diperlukan di api.js)
 */
async function addSkor(data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/skor.php', 'POST', data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const skor = JSON.parse(localStorage.getItem('skorData') || '[]');
        const newSkor = { id: Date.now(), ...data };
        skor.push(newSkor);
        localStorage.setItem('skorData', JSON.stringify(skor));
        return { success: true, data: newSkor };
    }
}

/**
 * Load daftar skor
 */
async function loadSkorList() {
    const skor = await getSkor();
    const table = document.getElementById('skorTable');

    if (!table) return;

    table.innerHTML = '<tr><th>ID</th><th>Jadwal</th><th>Korlap 1</th><th>Skor</th><th>Korlap 2</th><th>Status</th><th>Aksi</th></tr>';

    skor.forEach(s => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${s.id}</td>
            <td>${s.nama_cabor || 'N/A'}</td>
            <td>${s.nama_korlap_1 || 'N/A'}</td>
            <td>${s.skor_korlap_1} - ${s.skor_korlap_2}</td>
            <td>${s.nama_korlap_2 || '-'}</td>
            <td>${s.status}</td>
            <td>
                <button onclick="deleteSkorRow(${s.id})" class="btn-small">Hapus</button>
            </td>
        `;
    });
}

/**
 * Delete skor
 */
async function deleteSkorRow(id) {
    if (confirm('Apakah Anda yakin ingin menghapus skor ini?')) {
        // Implement delete skor
    }
}

// ========== PENGUMUMAN INPUT ==========

const pengumumanForm = document.getElementById('pengumumanForm');
if (pengumumanForm) {
    pengumumanForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            judul: document.getElementById('pengumumanJudul').value,
            isi: document.getElementById('pengumumanIsi').value,
            tipe: document.getElementById('pengumumanTipe').value,
            tampil_di_tv: document.getElementById('pengumumanTV').checked,
            urutan: document.getElementById('pengumumanUrutan').value || 0
        };

        const result = await addPengumuman(data);
        if (result.success) {
            alert('Pengumuman berhasil ditambahkan!');
            pengumumanForm.reset();
            loadPengumumanList();
        } else {
            alert('Error: ' + result.error);
        }
    });
}

/**
 * Load pengumuman
 */
async function loadPengumumanList() {
    const pengumuman = await getPengumuman();
    const list = document.getElementById('pengumumanList');

    if (!list) return;

    list.innerHTML = '';
    pengumuman.forEach(p => {
        const item = document.createElement('div');
        item.className = 'pengumuman-item';
        item.innerHTML = `
            <h4>${p.judul}</h4>
            <p>${p.isi}</p>
            <small>Tipe: ${p.tipe} | TV: ${p.tampil_di_tv ? 'Ya' : 'Tidak'}</small>
        `;
        list.appendChild(item);
    });
}

// ========== EXPORT DATA ==========

function exportPeserta() {
    getPeserta().then(data => {
        exportToCSV(data, 'peserta-' + new Date().toISOString().split('T')[0] + '.csv');
    });
}

function exportSkor() {
    getSkor().then(data => {
        exportToCSV(data, 'skor-' + new Date().toISOString().split('T')[0] + '.csv');
    });
}

function exportJadwal() {
    getJadwal().then(data => {
        exportToCSV(data, 'jadwal-' + new Date().toISOString().split('T')[0] + '.csv');
    });
}

// ========== INITIALIZE ON PAGE LOAD ==========

document.addEventListener('DOMContentLoaded', async () => {
    // Check login status
    if (ADMIN_INFO) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        updateAdminUI();

        // Load all data
        loadPesertaList();
        loadSkorList();
        loadPengumumanList();
    }
});
