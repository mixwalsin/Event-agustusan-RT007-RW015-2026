/* ========================================
   SEMARAK AGUSTUS 2026 - MAIN SCRIPT
   ======================================== */

// ======== INITIALIZATION ========
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

// ======== NAVIGATION ========
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

// ======== COUNTDOWN ========
function initCountdown() {
    const eventDate = new Date('2026-08-17T00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = eventDate - now;

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ======== CABOR REGISTRATION ========
function initCabor() {
    loadRegistrations();
}

function registerCabor(sport) {
    const registrations = JSON.parse(localStorage.getItem('caborRegistrations') || '[]');
    const timestamp = new Date().toLocaleString('id-ID');

    const registration = {
        id: Date.now(),
        sport: sport,
        timestamp: timestamp
    };

    registrations.push(registration);
    localStorage.setItem('caborRegistrations', JSON.stringify(registrations));

    showNotification(`✅ Terdaftar: ${sport}`, 'success');
    loadRegistrations();
}

function loadRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('caborRegistrations') || '[]');
    const listContainer = document.getElementById('registration-list');

    if (registrations.length === 0) {
        listContainer.innerHTML = '<p class="empty-state">Belum ada pendaftaran. Klik tombol "Daftar" untuk mendaftar.</p>';
        return;
    }

    listContainer.innerHTML = registrations.map(reg => `
        <div class="registration-item">
            <div class="registration-item-info">
                <span class="registration-item-badge">${reg.sport}</span>
                <small>${reg.timestamp}</small>
            </div>
            <button class="registration-item-remove" onclick="removeRegistration(${reg.id})">Hapus</button>
        </div>
    `).join('');
}

function removeRegistration(id) {
    const registrations = JSON.parse(localStorage.getItem('caborRegistrations') || '[]');
    const updated = registrations.filter(reg => reg.id !== id);
    localStorage.setItem('caborRegistrations', JSON.stringify(updated));
    loadRegistrations();
}

function clearRegistrations() {
    if (confirm('Apakah Anda yakin ingin menghapus semua pendaftaran?')) {
        localStorage.removeItem('caborRegistrations');
        loadRegistrations();
        showNotification('Semua pendaftaran telah dihapus', 'info');
    }
}

function exportRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('caborRegistrations') || '[]');
    if (registrations.length === 0) {
        showNotification('Tidak ada data untuk diunduh', 'warning');
        return;
    }

    let csv = 'No,Cabang Olahraga,Waktu Pendaftaran\n';
    registrations.forEach((reg, index) => {
        csv += `${index + 1},"${reg.sport}","${reg.timestamp}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pendaftaran-cabor.csv';
    a.click();
    showNotification('Data berhasil diunduh', 'success');
}

// ======== LEADERBOARD ========
function initLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    const statsContent = document.getElementById('stats-content');

    const korlaps = [
        { rank: 1, name: 'Korlap 1', kk: 34, score: 450 },
        { rank: 2, name: 'Korlap 2', kk: 47, score: 420 },
        { rank: 3, name: 'Korlap 3', kk: 63, score: 380 },
        { rank: 4, name: 'Korlap 4', kk: 38, score: 350 },
        { rank: 5, name: 'Korlap 5', kk: 47, score: 310 }
    ];

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

    // Update dashboard
    updateDashboard(korlaps);
}

function updateDashboard(korlaps) {
    const dashboardGrid = document.getElementById('dashboard-grid');

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
function initLiveScore() {
    const wrapper = document.getElementById('live-score-wrapper');

    const matches = [
        {
            title: 'Voli Putra',
            team1: 'Tim Korlap 1',
            team2: 'Tim Korlap 3',
            score1: 25,
            score2: 18,
            status: 'Selesai'
        },
        {
            title: 'Futsal Campuran',
            team1: 'Tim Korlap 2',
            team2: 'Tim Korlap 4',
            score1: 5,
            score2: 3,
            status: 'Selesai'
        },
        {
            title: 'Bulu Tangkis Ganda',
            team1: 'Tim Korlap 5',
            team2: 'Tim Korlap 1',
            score1: 21,
            score2: 19,
            status: 'Selesai'
        },
        {
            title: 'Tenis Meja Tunggal',
            team1: 'Tim Korlap 3',
            team2: 'Tim Korlap 2',
            score1: 11,
            score2: 6,
            status: 'Selesai'
        }
    ];

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

// ======== DOORPRIZE ========
function drawDoorprize() {
    const display = document.getElementById('doorprize-display');
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
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = '';
    }, 10);
}

// ======== VOTING ========
function initVoting() {
    const votingGrid = document.getElementById('voting-grid');
    const votingResults = document.getElementById('voting-results');

    const korlaps = [
        { name: 'Korlap 1', kk: 34 },
        { name: 'Korlap 2', kk: 47 },
        { name: 'Korlap 3', kk: 63 },
        { name: 'Korlap 4', kk: 38 },
        { name: 'Korlap 5', kk: 47 }
    ];

    // Initialize voting data
    if (!localStorage.getItem('votingData')) {
        const votingData = {};
        korlaps.forEach(k => {
            votingData[k.name] = Math.floor(Math.random() * 50) + 10;
        });
        localStorage.setItem('votingData', JSON.stringify(votingData));
    }

    votingGrid.innerHTML = korlaps.map(korlap => `
        <div class="voting-card" onclick="vote('${korlap.name}')">
            <h3>${korlap.name}</h3>
            <p>👥 ${korlap.kk} KK</p>
            <button class="btn btn-small">Pilih</button>
        </div>
    `).join('');

    updateVotingResults();
}

function vote(korlap) {
    const votingData = JSON.parse(localStorage.getItem('votingData') || '{}');
    votingData[korlap] = (votingData[korlap] || 0) + 1;
    localStorage.setItem('votingData', JSON.stringify(votingData));
    updateVotingResults();
    showNotification(`✅ Suara Anda untuk ${korlap} tercatat!`, 'success');
}

function updateVotingResults() {
    const votingData = JSON.parse(localStorage.getItem('votingData') || '{}');
    const votingResults = document.getElementById('voting-results');

    const totalVotes = Object.values(votingData).reduce((sum, v) => sum + v, 0);

    votingResults.innerHTML = Object.entries(votingData)
        .sort((a, b) => b[1] - a[1])
        .map(([name, votes]) => {
            const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0;
            return `
                <div class="voting-bar">
                    <span class="voting-label">${name}</span>
                    <div class="voting-progress">
                        <div class="voting-progress-bar" style="width: ${percentage}%">
                            ${percentage}%
                        </div>
                    </div>
                    <span style="min-width: 50px; text-align: right; font-weight: 700;">${votes} 🗳️</span>
                </div>
            `;
        }).join('');
}

// ======== GALLERY ========
function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');

    const images = [
        { title: 'Pembukaan Acara', emoji: '🎉' },
        { title: 'Senam Pagi', emoji: '🤸' },
        { title: 'Voli Putri', emoji: '🏐' },
        { title: 'Futsal Seru', emoji: '⚽' },
        { title: 'Lari Estafet', emoji: '🏃' },
        { title: 'Bulu Tangkis', emoji: '🏸' },
        { title: 'Doorprize Meriah', emoji: '🎁' },
        { title: 'Penutupan', emoji: '🏁' }
    ];

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

// ======== TV MODE ========
function initTVMode() {
    let viewers = Math.floor(Math.random() * 5000) + 1000;
    let duration = 0;

    setInterval(() => {
        viewers += Math.floor(Math.random() * 10) - 5;
        viewers = Math.max(0, viewers);
        document.getElementById('viewers-count').textContent = viewers.toLocaleString('id-ID');

        duration++;
        const hours = String(Math.floor(duration / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, '0');
        const seconds = String(duration % 60).padStart(2, '0');
        document.getElementById('duration').textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

// ======== SPONSOR ========
function initSponsor() {
    const sponsorGrid = document.getElementById('sponsor-grid');

    const sponsors = [
        { name: 'Sponsor Utama', icon: '🏢', type: 'Sponsor' },
        { name: 'Sponsor Resmi', icon: '🏪', type: 'Sponsor' },
        { name: 'UMKM Makanan', icon: '🍜', type: 'UMKM' },
        { name: 'UMKM Kerajinan', icon: '🎨', type: 'UMKM' },
        { name: 'Apotek Kesehatan', icon: '💊', type: 'Kesehatan' },
        { name: 'Toko Kue', icon: '🍰', type: 'Kuliner' }
    ];

    sponsorGrid.innerHTML = sponsors.map(sponsor => `
        <div class="sponsor-card glass">
            <div class="sponsor-icon">${sponsor.icon}</div>
            <h3>${sponsor.name}</h3>
            <p>${sponsor.type}</p>
        </div>
    `).join('');
}

// ======== PASSPORT ========
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
    if (confirm('Hapus data passport?')) {
        localStorage.removeItem('passportData');
        loadPassportData();
        showNotification('Data passport dihapus', 'info');
    }
}

// ======== CERTIFICATE ========
function initCertificate() {
    // Initialize
}

function generateCertificate() {
    const name = document.getElementById('cert-name').value;
    const category = document.getElementById('cert-category').value;

    if (!name || !category) {
        showNotification('Mohon lengkapi semua field', 'warning');
        return;
    }

    const display = document.getElementById('certificate-display');
    
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

// ======== CONFETTI ========
function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
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

// ======== NOTIFICATIONS ========
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

// ======== DATA LOADING ========
function loadAllData() {
    initLeaderboard();
    initVoting();
    updateVotingResults();
}

// ======== WINDOW EVENTS ========
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ======== CSS ANIMATIONS (Add to style) ========
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