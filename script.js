/* ========================================================
   SEMARAK AGUSTUS 2026 - MAIN SCRIPT
   Integrasi: PHP API Backend + localStorage fallback
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initNavigation();
    initCabor();
    initLeaderboard();
    initLiveScore();
    initVoting();
    initGallery();
    initTVMode();
    initSponsor();
    initPassport();
    initCertificate();
    loadAllData();
});

// ======== NAVIGATION CONTROL ========
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    });
}

// ======== COUNTDOWN TIMER ========
function initCountdown() {
    const eventDate = new Date('2026-08-17T00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = eventDate - now;

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Validasi elemen pelindung jika id countdown tidak ditemukan di halaman tertentu
        if (document.getElementById('days')) {
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ======== CABOR REGISTRATION ========
function initCabor() {
    loadRegistrations();
}

async function registerCabor(sport) {
    const namaWarga = prompt(`Masukkan Nama Lengkap Anda untuk mendaftar Cabor [${sport}]:`);
    if (!namaWarga) return;

    const nomorRumah = prompt("Masukkan Nomor Rumah Anda (Contoh: Blok A-12 atau No. 07):");
    if (!nomorRumah) {
        showNotification("⚠️ Nomor rumah wajib diisi untuk validasi panitia Korlap.", "warning");
        return;
    }

    showNotification("⌛ Memproses pendaftaran...", "info");

    // Coba kirim ke API backend
    let berhasil = false;
    if (typeof addPeserta === 'function') {
        const res = await addPeserta({ nama: namaWarga, no_rumah: nomorRumah, kategori: sport });
        if (res && res.success) {
            berhasil = true;
        }
    }

    if (!berhasil) {
        // Fallback: simpan ke localStorage
        const stored = JSON.parse(localStorage.getItem('registrations') || '[]');
        stored.unshift({ nama_warga: namaWarga, nomor_rumah: nomorRumah, cabang_olahraga: sport });
        localStorage.setItem('registrations', JSON.stringify(stored));
    }

    showNotification(`✅ Berhasil! ${namaWarga} terdaftar dalam cabor ${sport}.`, "success");
    loadRegistrations();
}

async function loadRegistrations() {
    const listContainer = document.getElementById('registration-list');
    if (!listContainer) return;

    let registrations = [];

    // Coba ambil dari API
    if (typeof getPeserta === 'function') {
        const res = await getPeserta();
        if (res && res.success && res.data.length > 0) {
            registrations = res.data.map(r => ({
                nama_warga: r.nama,
                nomor_rumah: r.no_rumah || '-',
                cabang_olahraga: r.nama_cabor || r.kategori || '-'
            }));
        }
    }

    // Fallback ke localStorage
    if (registrations.length === 0) {
        registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    }

    if (registrations.length === 0) {
        listContainer.innerHTML = '<p class="empty-state">Belum ada warga yang mendaftar. Jadilah yang pertama!</p>';
        return;
    }

    listContainer.innerHTML = registrations.slice(0, 20).map(reg => `
        <div class="registration-item">
            <div class="registration-item-info">
                <span class="registration-item-badge">${reg.cabang_olahraga}</span>
                <strong>${reg.nama_warga}</strong> <small>(Rumah: ${reg.nomor_rumah})</small>
            </div>
        </div>
    `).join('');
}

// ======== LEADERBOARD ========
async function initLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    const statsContent = document.getElementById('stats-content');
    if (!leaderboardList || !statsContent) return;

    let korlaps = null;

    // Coba ambil dari API
    if (typeof getLeaderboard === 'function') {
        const res = await getLeaderboard();
        if (res && res.success && res.data.length > 0) {
            korlaps = res.data.map((row, i) => ({
                rank: i + 1,
                name: row.nama_korlap,
                kk: row.jumlah_kk || 0,
                score: row.total_poin,
                korlap_id: row.korlap_id
            }));
        }
    }

    // Fallback ke data.js
    if (!korlaps && typeof EVENT_DATA !== 'undefined') {
        korlaps = EVENT_DATA.korlaps.map((k, i) => ({
            rank: i + 1, name: k.name, kk: k.kk, score: k.score
        }));
    }

    if (!korlaps) return;

    leaderboardList.innerHTML = korlaps.map(korlap => `
        <div class="leaderboard-item">
            <div class="rank-badge rank-${korlap.rank}">
                ${korlap.rank}
            </div>
            <div class="leaderboard-info">
                <strong>${korlap.name}</strong>
                <small>👥 ${korlap.kk} KK | 🏆 ${korlap.score} Poin</small>
            </div>
        </div>
    `).join('');

    const totalKK = korlaps.reduce((sum, k) => sum + k.kk, 0);
    const totalPoin = korlaps.reduce((sum, k) => sum + k.score, 0);

    statsContent.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${totalKK}</div>
            <div class="stat-label">Total Kepala Keluarga</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${totalPoin}</div>
            <div class="stat-label">Total Poin Kompetisi</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">5</div>
            <div class="stat-label">Korlap Peserta</div>
        </div>
    `;

    updateDashboard(korlaps);
}

function updateDashboard(korlaps) {
    const dashboardGrid = document.getElementById('dashboard-grid');
    if (!dashboardGrid) return;

    const cabors = ['Bulu Tangkis', 'Voli', 'Futsal', 'Tenis Meja', 'Catur', 'Lari Estafet', 'Lomba Anak', 'Senam'];

    dashboardGrid.innerHTML = cabors.map(cabor => {
        const randomKorlap = korlaps[Math.floor(Math.random() * korlaps.length)];
        return `
            <div class="dashboard-card glass">
                <h3>🏆 ${cabor}</h3>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Peserta:</span>
                    <span class="dashboard-stat-value">${Math.floor(Math.random() * 20) + 10}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Juara 1:</span>
                    <span class="dashboard-stat-value">${randomKorlap.name}</span>
                </div>
                <div class="dashboard-stat">
                    <span class="dashboard-stat-label">Status:</span>
                    <span class="dashboard-stat-value" style="color: var(--success);">Selesai ✓</span>
                </div>
            </div>
        `;
    }).join('');
}

// ======== LIVE SCORE ========
async function initLiveScore() {
    const wrapper = document.getElementById('live-score-wrapper');
    if (!wrapper) return;

    let matches = null;

    if (typeof getSkor === 'function') {
        const res = await getSkor();
        if (res && res.success && res.data.length > 0) {
            matches = res.data.map(s => ({
                title: s.nama_cabor ? `${s.nama_cabor} – ${s.nama_match}` : s.nama_match,
                team1: s.tim_a || 'Tim A',
                team2: s.tim_b || 'Tim B',
                score1: s.skor_a,
                score2: s.skor_b,
                status: s.status_match === 'selesai' ? 'Selesai' : s.status_match === 'ongoing' ? '🔴 LIVE' : 'Scheduled'
            }));
        }
    }

    // Fallback data statis
    if (!matches) {
        matches = [
            { title: 'Voli Putra', team1: 'Tim Korlap 1', team2: 'Tim Korlap 3', score1: 25, score2: 18, status: 'Selesai' },
            { title: 'Futsal Campuran', team1: 'Tim Korlap 2', team2: 'Tim Korlap 4', score1: 5, score2: 3, status: 'Selesai' },
            { title: 'Bulu Tangkis Ganda', team1: 'Tim Korlap 5', team2: 'Tim Korlap 1', score1: 21, score2: 19, status: 'Selesai' },
            { title: 'Tenis Meja Tunggal', team1: 'Tim Korlap 3', team2: 'Tim Korlap 2', score1: 11, score2: 6, status: 'Selesai' }
        ];
    }

    wrapper.innerHTML = matches.map(match => `
        <div class="live-score-card live">
            <div class="live-score-header">
                <span class="live-score-title">${match.title}</span>
                <span class="live-badge">${match.status}</span>
            </div>
            <div class="live-score-match">
                <div>
                    <p class="team-name">${match.team1}</p>
                    <p class="team-score">${match.score1}</p>
                </div>
                <div class="vs">VS</div>
                <div style="text-align: right;">
                    <p class="team-name">${match.team2}</p>
                    <p class="team-score">${match.score2}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ======== RANDOM UNDIAN DOORPRIZE ========
function drawDoorprize() {
    const display = document.getElementById('doorprize-display');
    if (!display) return;

    const prizes = [
        '🥇 PEMENANG: TV LED 55"',
        '🥈 PEMENANG: Motor Vespa',
        '🥉 PEMENANG: Motor 125cc',
        '🎯 PEMENANG: Kulkas 2 Pintu',
        '💝 PEMENANG: Paket Liburan',
        '🏅 PEMENANG: Set Gadget'
    ];

    display.style.cursor = 'not-allowed';
    display.classList.remove('winner');

    let currentPrize = 0;
    const spinInterval = setInterval(() => {
        display.textContent = prizes[currentPrize];
        currentPrize = (currentPrize + 1) % prizes.length;
    }, 100);

    setTimeout(() => {
        clearInterval(spinInterval);
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        const noKTP = String(Math.floor(Math.random() * 1000000000)).padStart(10, '0');
        
        display.innerHTML = `${randomPrize}<br><small>No. KTP: ${noKTP}</small>`;
        display.classList.add('winner');
        display.style.cursor = 'pointer';

        showConfetti();
        playWinnerAnimation();
        showNotification(`🎉 Selamat! ${randomPrize}`, 'success');
    }, 2000);
}

function playWinnerAnimation() {
    const card = document.querySelector('.doorprize-card');
    if (!card) return;
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = '';
    }, 10);
}

// ======== VOTING SYSTEM ========
async function initVoting() {
    const votingGrid = document.getElementById('voting-grid');
    if (!votingGrid) return;

    let korlaps = null;

    if (typeof getLeaderboard === 'function') {
        const res = await getLeaderboard();
        if (res && res.success && res.data.length > 0) {
            korlaps = res.data.map(r => ({ id: r.korlap_id, name: r.nama_korlap }));
        }
    }

    if (!korlaps && typeof EVENT_DATA !== 'undefined') {
        korlaps = EVENT_DATA.korlaps.map(k => ({ id: k.id, name: k.name }));
    }

    if (!korlaps) {
        korlaps = [
            { id: 1, name: 'Korlap 1' },
            { id: 2, name: 'Korlap 2' },
            { id: 3, name: 'Korlap 3' },
            { id: 4, name: 'Korlap 4' },
            { id: 5, name: 'Korlap 5' }
        ];
    }

    votingGrid.innerHTML = korlaps.map(korlap => `
        <div class="voting-card" onclick="vote('${korlap.name}', ${korlap.id})">
            <h3>${korlap.name}</h3>
            <button class="btn btn-small">Pilih</button>
        </div>
    `).join('');

    updateVotingResults();
}

async function vote(korlapName, korlapId) {
    showNotification(` Mengirimkan suara Anda untuk ${korlapName}...`, "info");

    if (typeof submitVoting === 'function') {
        const res = await submitVoting({ kategori: 'Korlap Terkompak', korlap_id: korlapId });
        if (res && res.success) {
            showNotification(`🎉 Terima kasih! Pilihan Anda untuk ${korlapName} telah tercatat.`, "success");
            updateVotingResults();
            return;
        }
    }

    // Fallback localStorage
    const stored = JSON.parse(localStorage.getItem('votes') || '{}');
    stored[korlapName] = (stored[korlapName] || 0) + 1;
    localStorage.setItem('votes', JSON.stringify(stored));
    showNotification(`🎉 Vote untuk ${korlapName} tersimpan secara lokal.`, "success");
    updateVotingResults();
}

async function updateVotingResults() {
    const votingResults = document.getElementById('voting-results');
    if (!votingResults) return;

    let voteCounts = {};

    if (typeof getVoting === 'function') {
        const res = await getVoting({ kategori: 'Korlap Terkompak' });
        if (res && res.success && res.data.length > 0) {
            res.data.forEach(v => {
                voteCounts[v.nama_korlap] = parseInt(v.jumlah_vote) || 0;
            });
        }
    }

    // Fallback localStorage
    if (Object.keys(voteCounts).length === 0) {
        voteCounts = JSON.parse(localStorage.getItem('votes') || '{}');
        if (Object.keys(voteCounts).length === 0) {
            voteCounts = { 'Korlap 1': 0, 'Korlap 2': 0, 'Korlap 3': 0, 'Korlap 4': 0, 'Korlap 5': 0 };
        }
    }

    const totalVotes = Object.values(voteCounts).reduce((s, v) => s + v, 0);

    votingResults.innerHTML = Object.entries(voteCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => {
            const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;
            return `
                <div class="voting-bar">
                    <span class="voting-label">${name}</span>
                    <div class="voting-progress">
                        <div class="voting-progress-bar" style="width: ${percentage}%">
                            ${percentage}%
                        </div>
                    </div>
                    <span style="min-width: 50px; text-align: right; font-weight: 700;">${count} 🗳️</span>
                </div>
            `;
        }).join('');
}

// ======== LIVE MEDIA GALLERY ========
async function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    let images = null;

    if (typeof getGaleri === 'function') {
        const res = await getGaleri();
        if (res && res.success && res.data.length > 0) {
            images = res.data.map(g => ({ title: g.judul, emoji: g.emoji }));
        }
    }

    // Fallback ke data.js
    if (!images && typeof EVENT_DATA !== 'undefined') {
        images = EVENT_DATA.gallery.map(g => ({ title: g.title, emoji: g.emoji }));
    }

    if (!images) {
        images = [
            { title: 'Pembukaan Acara', emoji: '🎉' },
            { title: 'Senam Pagi', emoji: '🤸' },
            { title: 'Voli Putri', emoji: '🏐' },
            { title: 'Futsal Seru', emoji: '⚽' },
            { title: 'Lari Estafet', emoji: '🏃' },
            { title: 'Bulu Tangkis', emoji: '🏸' },
            { title: 'Doorprize Meriah', emoji: '🎁' },
            { title: 'Penutupan', emoji: '🏁' }
        ];
    }

    galleryGrid.innerHTML = images.map(img => `
        <div class="gallery-item">
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary), var(--accent)); font-size: 64px;">
                ${img.emoji}
            </div>
            <div class="gallery-overlay">
                <p style="font-size: 16px; font-weight: 700;">${img.title}</p>
            </div>
        </div>
    `).join('');
}

// ======== DIGITAL TV MODE STREAMING SIMULATION ========
function initTVMode() {
    let viewers = Math.floor(Math.random() * 5000) + 1000;
    let duration = 0;

    setInterval(() => {
        if (document.getElementById('viewers-count') && document.getElementById('duration')) {
            viewers += Math.floor(Math.random() * 10) - 5;
            viewers = Math.max(0, viewers);
            document.getElementById('viewers-count').textContent = viewers.toLocaleString('id-ID');

            duration++;
            const hours = String(Math.floor(duration / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, '0');
            const seconds = String(duration % 60).padStart(2, '0');
            document.getElementById('duration').textContent = `${hours}:${minutes}:${seconds}`;
        }
    }, 1000);
}

// ======== SPONSOR & HUB KEMITRAAN UMKM ========
async function initSponsor() {
    const sponsorGrid = document.getElementById('sponsor-grid');
    if (!sponsorGrid) return;

    let sponsors = null;

    if (typeof getSponsor === 'function') {
        const res = await getSponsor();
        if (res && res.success && res.data.length > 0) {
            sponsors = res.data.map(s => ({ name: s.nama, icon: s.icon, type: s.kategori }));
        }
    }

    // Fallback ke data.js
    if (!sponsors && typeof EVENT_DATA !== 'undefined') {
        sponsors = EVENT_DATA.sponsors.map(s => ({ name: s.name, icon: s.icon, type: s.category }));
    }

    if (!sponsors) {
        sponsors = [
            { name: 'Sponsor Utama', icon: '🏢', type: 'Sponsor' },
            { name: 'Sponsor Resmi', icon: '🏪', type: 'Sponsor' },
            { name: 'UMKM Makanan', icon: '🍜', type: 'UMKM' },
            { name: 'UMKM Kerajinan', icon: '🎨', type: 'UMKM' },
            { name: 'Apotek Kesehatan', icon: '💊', type: 'Kesehatan' },
            { name: 'Toko Kue', icon: '🍰', type: 'Kuliner' }
        ];
    }

    sponsorGrid.innerHTML = sponsors.map(sponsor => `
        <div class="sponsor-card glass">
            <div class="sponsor-icon">${sponsor.icon}</div>
            <h3>${sponsor.name}</h3>
            <p>${sponsor.type}</p>
        </div>
    `).join('');
}

// ======== DIGITAL PASSPORT MANAGEMENT ========
function initPassport() {
    loadPassportData();
}

function registerPassport() {
    const name = document.getElementById('passport-name').value;
    const ktp = document.getElementById('passport-ktp').value;
    const email = document.getElementById('passport-email').value;
    const phone = document.getElementById('passport-phone').value;
    const korlap = document.getElementById('passport-korlap').value;

    if (!name || !ktp || !email || !phone || !korlap) {
        showNotification('Mohon lengkapi semua field', 'warning');
        return;
    }

    const passportData = {
        name: name,
        ktp: ktp,
        email: email,
        phone: phone,
        korlap: korlap,
        registrationDate: new Date().toLocaleDateString('id-ID')
    };

    localStorage.setItem('passportData', JSON.stringify(passportData));
    
    document.getElementById('passport-name').value = '';
    document.getElementById('passport-ktp').value = '';
    document.getElementById('passport-email').value = '';
    document.getElementById('passport-phone').value = '';
    document.getElementById('passport-korlap').value = '';

    loadPassportData();
    showNotification('✅ Passport berhasil didaftarkan!', 'success');
}

function loadPassportData() {
    const passportData = JSON.parse(localStorage.getItem('passportData') || 'null');
    const passportCard = document.getElementById('passport-card');
    if (!passportCard) return;

    if (!passportData) {
        passportCard.innerHTML = '<p class="empty-state">Belum ada data passport. Lengkapi formulir di sebelah.</p>';
        return;
    }

    passportCard.innerHTML = `
        <div class="passport-card-display">
            <h4>🎫 PASSPORT WARGA</h4>
            <p class="name">${passportData.name}</p>
            <p><strong>No. KTP:</strong> ${passportData.ktp}</p>
            <p><strong>Email:</strong> ${passportData.email}</p>
            <p><strong>Telepon:</strong> ${passportData.phone}</p>
            <p><strong>Korlap:</strong> ${passportData.korlap}</p>
            <p><strong>Tanggal Daftar:</strong> ${passportData.registrationDate}</p>
            <button class="btn btn-secondary" onclick="clearPassport()" style="margin-top: 15px;">Hapus Data</button>
        </div>
    `;
}

function clearPassport() {
    if (confirm('Hapus data passport lokal browser Anda?')) {
        localStorage.removeItem('passportData');
        loadPassportData();
        showNotification('Data passport dihapus', 'info');
    }
}

// ======== DIGITAL CERTIFICATE GENERATOR ========
function initCertificate() {}

function generateCertificate() {
    const name = document.getElementById('cert-name').value;
    const category = document.getElementById('cert-category').value;

    if (!name || !category) {
        showNotification('Mohon lengkapi semua field', 'warning');
        return;
    }

    const display = document.getElementById('certificate-display');
    if (!display) return;
    
    display.innerHTML = `
        <div class="certificate">
            <div class="certificate-content">
                <h2>SERTIFIKAT</h2>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Ini menyatakan bahwa</p>
                <div class="cert-name">${name}</div>
                <p style="font-size: 14px; margin-bottom: 10px;">Telah berpartisipasi sebagai</p>
                <div class="cert-category">${category}</div>
                <p style="font-size: 12px; color: #666; margin-top: 20px;">Dalam Kegiatan</p>
                <p style="font-weight: 700; color: var(--primary); margin-top: 10px;">SEMARAK AGUSTUS 2026<br>HUT RI KE-81</p>
                <p style="font-size: 11px; color: #999; margin-top: 20px;">RT 007 RW 015 TCI 2</p>
                <div class="cert-date">17 Agustus 2026</div>
                <button class="btn btn-primary cert-print-btn" onclick="printCertificate()">🖨️ Cetak Sertifikat</button>
            </div>
        </div>
    `;

    showNotification('✅ Sertifikat telah dibuat!', 'success');
}

function printCertificate() {
    window.print();
}

// ======== ANIMASI CANVAS CONFETTI PERAYAAN ========
function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#DC143C', '#FFD700', '#FFFFFF'];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 5,
            radius: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;

            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.radius, p.radius);

            if (p.y > canvas.height) {
                particles.splice(i, 1);
            }
        });

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

// ======== TOAST SYSTEM NOTIFICATIONS ========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${
            type === 'success' ? '#10b981' :
            type === 'warning' ? '#f59e0b' :
            type === 'danger' ? '#ef4444' :
            '#3b82f6'
        };
        color: white;
        padding: 16px 24px;
        border-radius: 50px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        font-weight: 600;
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ======== AGREGASI DATA GLOBAL ========
function loadAllData() {
    initLeaderboard();
    loadRegistrations();
    updateVotingResults();
}

// ======== SISTEM LALU LINTAS LAYAR RESIZE ========
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// ======== PENYUNTINGAN STYLING DI KEPALA HEAD ========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);
