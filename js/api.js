/**
 * API Client untuk Semarak Agustus 2026
 * Menggunakan Fetch API untuk berkomunikasi dengan backend PHP
 * Support fallback ke localStorage jika API belum aktif
 */

// ========== CONFIGURATION ==========

// Ubah ini sesuai dengan lokasi backend Anda:
// Development (XAMPP): "http://localhost/Event-agustusan-RT007-RW015-2026/api"
// Production (cPanel): "https://yourdomain.com/api"
const API_BASE_URL = "http://localhost/Event-agustusan-RT007-RW015-2026/api";

// Flag untuk mengetahui apakah API tersedia
let API_AVAILABLE = false;

// Token admin (disimpan setelah login)
let ADMIN_TOKEN = localStorage.getItem('admin_token') || null;
let ADMIN_INFO = JSON.parse(localStorage.getItem('admin_info') || 'null');

// Cek API availability saat page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkAPIStatus();
});

/**
 * Check apakah API tersedia
 */
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/config.php`, {
            method: 'OPTIONS',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        API_AVAILABLE = response.ok;
        console.log('API Status:', API_AVAILABLE ? '✓ Connected' : '✗ Offline');
    } catch (error) {
        API_AVAILABLE = false;
        console.log('API Status: ✗ Offline (using localStorage)');
    }
}

// ========== HELPER FUNCTIONS ==========

/**
 * Generic fetch wrapper dengan error handling
 */
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        // Add auth token jika ada
        if (ADMIN_TOKEN) {
            options.headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`;
        }

        // Add body untuk POST/PUT
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `API Error: ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
}

// ========== AUTHENTICATION ==========

/**
 * Login Admin
 */
async function loginAdmin(username, password) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/login.php', 'POST', {
                username: username,
                password: password
            });

            if (response.status === 'success') {
                ADMIN_TOKEN = response.data.token;
                ADMIN_INFO = response.data;

                // Simpan ke localStorage
                localStorage.setItem('admin_token', ADMIN_TOKEN);
                localStorage.setItem('admin_info', JSON.stringify(ADMIN_INFO));

                return { success: true, data: response.data };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        // Fallback: Simple local check
        if (username === 'admin' && password === 'admin123') {
            ADMIN_TOKEN = 'demo-token';
            ADMIN_INFO = { id: 1, username: 'admin', nama: 'Admin Demo', role: 'admin' };
            localStorage.setItem('admin_token', ADMIN_TOKEN);
            localStorage.setItem('admin_info', JSON.stringify(ADMIN_INFO));
            return { success: true, data: ADMIN_INFO };
        }
        return { success: false, error: 'Invalid credentials' };
    }
}

/**
 * Logout Admin
 */
function logoutAdmin() {
    ADMIN_TOKEN = null;
    ADMIN_INFO = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
}

// ========== PESERTA ==========

/**
 * Get semua peserta
 */
async function getPeserta(filters = {}) {
    if (API_AVAILABLE) {
        try {
            let endpoint = '/peserta.php';
            if (Object.keys(filters).length > 0) {
                const params = new URLSearchParams(filters).toString();
                endpoint += '?' + params;
            }
            const response = await apiCall(endpoint);
            return response.data || [];
        } catch (error) {
            console.error('Get peserta error:', error);
            return [];
        }
    } else {
        // Fallback ke localStorage
        return JSON.parse(localStorage.getItem('pesertaData') || '[]');
    }
}

/**
 * Add peserta baru
 */
async function addPeserta(data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/peserta.php', 'POST', data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        // Fallback: Simpan ke localStorage
        const peserta = JSON.parse(localStorage.getItem('pesertaData') || '[]');
        const newPeserta = { id: Date.now(), ...data };
        peserta.push(newPeserta);
        localStorage.setItem('pesertaData', JSON.stringify(peserta));
        return { success: true, data: newPeserta };
    }
}

/**
 * Update peserta
 */
async function updatePeserta(id, data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall(`/peserta.php?id=${id}`, 'PUT', data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const peserta = JSON.parse(localStorage.getItem('pesertaData') || '[]');
        const index = peserta.findIndex(p => p.id == id);
        if (index !== -1) {
            peserta[index] = { ...peserta[index], ...data };
            localStorage.setItem('pesertaData', JSON.stringify(peserta));
            return { success: true };
        }
        return { success: false, error: 'Peserta not found' };
    }
}

/**
 * Delete peserta
 */
async function deletePeserta(id) {
    if (API_AVAILABLE) {
        try {
            await apiCall(`/peserta.php?id=${id}`, 'DELETE');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const peserta = JSON.parse(localStorage.getItem('pesertaData') || '[]');
        const filtered = peserta.filter(p => p.id != id);
        localStorage.setItem('pesertaData', JSON.stringify(filtered));
        return { success: true };
    }
}

// ========== CABOR ==========

/**
 * Get semua cabor
 */
async function getCabor() {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/cabor.php');
            return response.data || [];
        } catch (error) {
            console.error('Get cabor error:', error);
            return [];
        }
    } else {
        // Return dummy data
        return [
            { id: 1, nama_cabor: 'Bulu Tangkis', emoji: '🏸', jumlah_peserta: 0 },
            { id: 2, nama_cabor: 'Voli', emoji: '🏐', jumlah_peserta: 0 },
            { id: 3, nama_cabor: 'Futsal', emoji: '⚽', jumlah_peserta: 0 },
            { id: 4, nama_cabor: 'Tenis Meja', emoji: '🏓', jumlah_peserta: 0 },
            { id: 5, nama_cabor: 'Catur', emoji: '♟️', jumlah_peserta: 0 },
            { id: 6, nama_cabor: 'Lari Estafet', emoji: '🏃', jumlah_peserta: 0 },
            { id: 7, nama_cabor: 'Lomba Anak', emoji: '🎯', jumlah_peserta: 0 },
            { id: 8, nama_cabor: 'Senam Bersama', emoji: '💃', jumlah_peserta: 0 }
        ];
    }
}

// ========== JADWAL ==========

/**
 * Get semua jadwal
 */
async function getJadwal(filters = {}) {
    if (API_AVAILABLE) {
        try {
            let endpoint = '/jadwal.php';
            if (Object.keys(filters).length > 0) {
                const params = new URLSearchParams(filters).toString();
                endpoint += '?' + params;
            }
            const response = await apiCall(endpoint);
            return response.data || [];
        } catch (error) {
            console.error('Get jadwal error:', error);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('jadwalData') || '[]');
    }
}

/**
 * Add jadwal baru
 */
async function addJadwal(data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/jadwal.php', 'POST', data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const jadwal = JSON.parse(localStorage.getItem('jadwalData') || '[]');
        const newJadwal = { id: Date.now(), ...data };
        jadwal.push(newJadwal);
        localStorage.setItem('jadwalData', JSON.stringify(jadwal));
        return { success: true, data: newJadwal };
    }
}

// ========== SKOR ==========

/**
 * Get semua skor
 */
async function getSkor(filters = {}) {
    if (API_AVAILABLE) {
        try {
            let endpoint = '/skor.php';
            if (Object.keys(filters).length > 0) {
                const params = new URLSearchParams(filters).toString();
                endpoint += '?' + params;
            }
            const response = await apiCall(endpoint);
            return response.data || [];
        } catch (error) {
            console.error('Get skor error:', error);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('skorData') || '[]');
    }
}

/**
 * Update skor pertandingan
 */
async function updateSkor(id, data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall(`/skor.php?id=${id}`, 'PUT', data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const skor = JSON.parse(localStorage.getItem('skorData') || '[]');
        const index = skor.findIndex(s => s.id == id);
        if (index !== -1) {
            skor[index] = { ...skor[index], ...data };
            localStorage.setItem('skorData', JSON.stringify(skor));
            return { success: true };
        }
        return { success: false, error: 'Skor not found' };
    }
}

// ========== LEADERBOARD ==========

/**
 * Get leaderboard
 */
async function getLeaderboard() {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/leaderboard.php');
            return response.data || [];
        } catch (error) {
            console.error('Get leaderboard error:', error);
            return [];
        }
    } else {
        // Return dummy leaderboard
        return [
            { id: 1, nama_korlap: 'Korlap 1', total_poin: 450, ranking: 1 },
            { id: 2, nama_korlap: 'Korlap 2', total_poin: 420, ranking: 2 },
            { id: 3, nama_korlap: 'Korlap 3', total_poin: 380, ranking: 3 },
            { id: 4, nama_korlap: 'Korlap 4', total_poin: 350, ranking: 4 },
            { id: 5, nama_korlap: 'Korlap 5', total_poin: 310, ranking: 5 }
        ];
    }
}

/**
 * Recalculate leaderboard
 */
async function recalculateLeaderboard() {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/leaderboard.php', 'POST', {});
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    return { success: true };
}

// ========== JUARA ==========

/**
 * Get juara
 */
async function getJuara(filters = {}) {
    if (API_AVAILABLE) {
        try {
            let endpoint = '/juara.php';
            if (Object.keys(filters).length > 0) {
                const params = new URLSearchParams(filters).toString();
                endpoint += '?' + params;
            }
            const response = await apiCall(endpoint);
            return response.data || [];
        } catch (error) {
            console.error('Get juara error:', error);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('juaraData') || '[]');
    }
}

/**
 * Add juara
 */
async function addJuara(data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/juara.php', 'POST', data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const juara = JSON.parse(localStorage.getItem('juaraData') || '[]');
        const newJuara = { id: Date.now(), ...data };
        juara.push(newJuara);
        localStorage.setItem('juaraData', JSON.stringify(juara));
        return { success: true, data: newJuara };
    }
}

// ========== DOORPRIZE ==========

/**
 * Get semua doorprize
 */
async function getDoorprize() {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/doorprize.php');
            return response.data || [];
        } catch (error) {
            console.error('Get doorprize error:', error);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('doorprizeData') || '[]');
    }
}

/**
 * Get doorprize winners
 */
async function getDoorprizeWinners() {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/doorprize-winner.php');
            return response.data || [];
        } catch (error) {
            console.error('Get doorprize winners error:', error);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('doorprizeWinners') || '[]');
    }
}

/**
 * Add doorprize winner
 */
async function addDoorprizeWinner(data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/doorprize-winner.php', 'POST', data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const winners = JSON.parse(localStorage.getItem('doorprizeWinners') || '[]');
        const newWinner = { id: Date.now(), ...data, waktu_undian: new Date().toLocaleString('id-ID') };
        winners.unshift(newWinner);
        localStorage.setItem('doorprizeWinners', JSON.stringify(winners));
        return { success: true, data: newWinner };
    }
}

// ========== VOTING ==========

/**
 * Get voting results
 */
async function getVoting() {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/voting.php');
            return response.data || [];
        } catch (error) {
            console.error('Get voting error:', error);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('votingData') || '[]');
    }
}

/**
 * Submit voting
 */
async function submitVoting(korlap_id) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/voting.php', 'POST', {
                korlap_id: korlap_id,
                device_id: getDeviceID()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        // Check if already voted (localStorage fallback)
        const votedKorlap = localStorage.getItem('votedKorlap');
        if (votedKorlap) {
            return { success: false, error: 'Anda sudah melakukan voting' };
        }

        // Record vote
        localStorage.setItem('votedKorlap', korlap_id);
        const voting = JSON.parse(localStorage.getItem('votingData') || '[]');
        const vote = voting.find(v => v.korlap_id == korlap_id);
        if (vote) {
            vote.total_suara++;
        }
        localStorage.setItem('votingData', JSON.stringify(voting));
        return { success: true };
    }
}

// ========== GALERI ==========

/**
 * Get semua galeri
 */
async function getGaleri(kategori = null) {
    if (API_AVAILABLE) {
        try {
            let endpoint = '/galeri.php';
            if (kategori) {
                endpoint += '?kategori=' + kategori;
            }
            const response = await apiCall(endpoint);
            return response.data || [];
        } catch (error) {
            console.error('Get galeri error:', error);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('galeriData') || '[]');
    }
}

/**
 * Add galeri
 */
async function addGaleri(data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/galeri.php', 'POST', data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const galeri = JSON.parse(localStorage.getItem('galeriData') || '[]');
        const newGaleri = { id: Date.now(), ...data };
        galeri.push(newGaleri);
        localStorage.setItem('galeriData', JSON.stringify(galeri));
        return { success: true, data: newGaleri };
    }
}

// ========== SPONSOR ==========

/**
 * Get sponsor
 */
async function getSponsor(kategori = null) {
    if (API_AVAILABLE) {
        try {
            let endpoint = '/sponsor.php';
            if (kategori) {
                endpoint += '?kategori=' + kategori;
            }
            const response = await apiCall(endpoint);
            return response.data || [];
        } catch (error) {
            console.error('Get sponsor error:', error);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('sponsorData') || '[]');
    }
}

/**
 * Add sponsor
 */
async function addSponsor(data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/sponsor.php', 'POST', data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const sponsor = JSON.parse(localStorage.getItem('sponsorData') || '[]');
        const newSponsor = { id: Date.now(), ...data };
        sponsor.push(newSponsor);
        localStorage.setItem('sponsorData', JSON.stringify(sponsor));
        return { success: true, data: newSponsor };
    }
}

// ========== PENGUMUMAN ==========

/**
 * Get pengumuman
 */
async function getPengumuman(tv_only = false) {
    if (API_AVAILABLE) {
        try {
            let endpoint = '/pengumuman.php';
            if (tv_only) {
                endpoint += '?tv_only=1';
            }
            const response = await apiCall(endpoint);
            return response.data || [];
        } catch (error) {
            console.error('Get pengumuman error:', error);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('pengumumanData') || '[]');
    }
}

/**
 * Add pengumuman
 */
async function addPengumuman(data) {
    if (API_AVAILABLE) {
        try {
            const response = await apiCall('/pengumuman.php', 'POST', data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    } else {
        const pengumuman = JSON.parse(localStorage.getItem('pengumumanData') || '[]');
        const newPengumuman = { id: Date.now(), ...data };
        pengumuman.push(newPengumuman);
        localStorage.setItem('pengumumanData', JSON.stringify(pengumuman));
        return { success: true, data: newPengumuman };
    }
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Generate device ID (untuk tracking voting)
 */
function getDeviceID() {
    let deviceID = localStorage.getItem('deviceID');
    if (!deviceID) {
        deviceID = 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceID', deviceID);
    }
    return deviceID;
}

/**
 * Export data ke CSV
 */
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        alert('Tidak ada data untuk diekspor');
        return;
    }

    // Get headers
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';

    // Get rows
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes jika ada comma
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        });
        csv += values.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || 'export.csv');
    link.click();
}
