/* ============================================================
   js/api.js
   Frontend wrapper untuk API Backend PHP
   SEMARAK AGUSTUS 2026 – RT 007 RW 015 TCI 2
   ============================================================
   Ubah API_BASE_URL sesuai lingkungan:
     - Lokal (XAMPP) : "http://localhost/Event-agustusan-RT007-RW015-2026/api"
     - cPanel hosting : "https://yourdomain.com/api"
   ============================================================ */

const API_BASE_URL = "http://localhost/Event-agustusan-RT007-RW015-2026/api";

// ---- Helper fetch dengan timeout & fallback -------------------------
async function apiFetch(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 8000);

    try {
        const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
            signal: controller.signal,
            ...options,
        });
        clearTimeout(timeoutId);
        const data = await res.json();
        return data;
    } catch (err) {
        clearTimeout(timeoutId);
        console.warn(`[api.js] Fetch gagal (${endpoint}):`, err.message);
        return null; // null = backend tidak aktif → caller bisa fallback
    }
}

// ---- Peserta --------------------------------------------------------
async function getPeserta(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`peserta.php${qs ? '?' + qs : ''}`);
}

async function addPeserta(data) {
    return apiFetch('peserta.php', { method: 'POST', body: JSON.stringify(data) });
}

async function updatePeserta(id, data) {
    return apiFetch(`peserta.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

async function deletePeserta(id) {
    return apiFetch(`peserta.php?id=${id}`, { method: 'DELETE' });
}

// ---- Cabor ----------------------------------------------------------
async function getCabor() {
    return apiFetch('cabor.php');
}

async function addCabor(data) {
    return apiFetch('cabor.php', { method: 'POST', body: JSON.stringify(data) });
}

async function updateCabor(id, data) {
    return apiFetch(`cabor.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

async function deleteCabor(id) {
    return apiFetch(`cabor.php?id=${id}`, { method: 'DELETE' });
}

// ---- Jadwal ---------------------------------------------------------
async function getJadwal(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`jadwal.php${qs ? '?' + qs : ''}`);
}

async function addJadwal(data) {
    return apiFetch('jadwal.php', { method: 'POST', body: JSON.stringify(data) });
}

async function updateJadwal(id, data) {
    return apiFetch(`jadwal.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

async function deleteJadwal(id) {
    return apiFetch(`jadwal.php?id=${id}`, { method: 'DELETE' });
}

// ---- Skor -----------------------------------------------------------
async function getSkor(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`skor.php${qs ? '?' + qs : ''}`);
}

async function updateSkor(data) {
    return apiFetch('skor.php', { method: 'POST', body: JSON.stringify(data) });
}

// ---- Leaderboard ----------------------------------------------------
async function getLeaderboard() {
    return apiFetch('leaderboard.php');
}

async function updateLeaderboard(data) {
    return apiFetch('leaderboard.php', { method: 'POST', body: JSON.stringify(data) });
}

// ---- Juara ----------------------------------------------------------
async function getJuara(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`juara.php${qs ? '?' + qs : ''}`);
}

async function addJuara(data) {
    return apiFetch('juara.php', { method: 'POST', body: JSON.stringify(data) });
}

async function updateJuara(id, data) {
    return apiFetch(`juara.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

async function deleteJuara(id) {
    return apiFetch(`juara.php?id=${id}`, { method: 'DELETE' });
}

// ---- Doorprize ------------------------------------------------------
async function getDoorprize() {
    return apiFetch('doorprize.php');
}

async function addDoorprize(data) {
    return apiFetch('doorprize.php', { method: 'POST', body: JSON.stringify(data) });
}

async function addDoorprizeWinner(id, data) {
    return apiFetch(`doorprize.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

async function deleteDoorprize(id) {
    return apiFetch(`doorprize.php?id=${id}`, { method: 'DELETE' });
}

// ---- Voting ---------------------------------------------------------
async function getVoting(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`voting.php${qs ? '?' + qs : ''}`);
}

async function submitVoting(data) {
    return apiFetch('voting.php', { method: 'POST', body: JSON.stringify(data) });
}

// ---- Galeri ---------------------------------------------------------
async function getGaleri() {
    return apiFetch('galeri.php');
}

async function addGaleri(data) {
    return apiFetch('galeri.php', { method: 'POST', body: JSON.stringify(data) });
}

async function deleteGaleri(id) {
    return apiFetch(`galeri.php?id=${id}`, { method: 'DELETE' });
}

// ---- Sponsor --------------------------------------------------------
async function getSponsor() {
    return apiFetch('sponsor.php');
}

async function addSponsor(data) {
    return apiFetch('sponsor.php', { method: 'POST', body: JSON.stringify(data) });
}

async function deleteSponsor(id) {
    return apiFetch(`sponsor.php?id=${id}`, { method: 'DELETE' });
}

// ---- Pengumuman -----------------------------------------------------
async function getPengumuman() {
    return apiFetch('pengumuman.php');
}

async function addPengumuman(data) {
    return apiFetch('pengumuman.php', { method: 'POST', body: JSON.stringify(data) });
}

async function updatePengumuman(id, data) {
    return apiFetch(`pengumuman.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

async function deletePengumuman(id) {
    return apiFetch(`pengumuman.php?id=${id}`, { method: 'DELETE' });
}

// ---- Auth -----------------------------------------------------------
async function loginAdmin(username, password) {
    return apiFetch('login.php', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}

// ---- Cek koneksi backend (dipakai di admin.html) --------------------
async function checkBackend() {
    const res = await getPengumuman();
    return res !== null && res.success === true;
}
