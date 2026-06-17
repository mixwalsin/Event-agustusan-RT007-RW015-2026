/**
 * event-tv.html Integration Script
 * Auto-refresh setiap 30 detik untuk display TV
 */

// Auto-refresh TV setiap 30 detik
setInterval(() => {
    loadTVData();
}, 30000);

/**
 * Load semua data untuk TV display
 */
async function loadTVData() {
    loadCountdownTV();
    loadNextJadwalTV();
    loadRankingTV();
    loadPengumumanMC();
    loadSponsorBerjalan();
}

/**
 * Countdown untuk TV (lebih besar)
 */
function loadCountdownTV() {
    const countdownContainer = document.getElementById('tvCountdown');
    if (!countdownContainer) return;

    const targetDate = new Date('2026-08-17T00:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            countdownContainer.innerHTML = `
                <div class="countdown-item">
                    <span class="label">EVENT TELAH DIMULAI!</span>
                    <span class="value">🇮🇩 SEMARAK AGUSTUS 2026 🇮🇩</span>
                </div>
            `;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownContainer.innerHTML = `
            <div class="countdown-display">
                <div class="countdown-item">
                    <span class="value">${days}</span>
                    <span class="label">HARI</span>
                </div>
                <div class="countdown-item">
                    <span class="value">${hours}</span>
                    <span class="label">JAM</span>
                </div>
                <div class="countdown-item">
                    <span class="value">${minutes}</span>
                    <span class="label">MENIT</span>
                </div>
                <div class="countdown-item">
                    <span class="value">${seconds}</span>
                    <span class="label">DETIK</span>
                </div>
            </div>
        `;
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Load Jadwal Berikutnya
 */
async function loadNextJadwalTV() {
    const jadwal = await getJadwal({ status: 'terjadwal' });
    const container = document.getElementById('tvJadwal');

    if (!container) return;

    if (jadwal.length === 0) {
        container.innerHTML = '<p>Tidak ada jadwal berikutnya</p>';
        return;
    }

    // Ambil 3 jadwal berikutnya
    const nextJadwal = jadwal.slice(0, 3);
    container.innerHTML = '';

    nextJadwal.forEach(j => {
        const time = new Date(j.waktu_mulai).toLocaleString('id-ID');
        const item = document.createElement('div');
        item.className = 'jadwal-item';
        item.innerHTML = `
            <div class="jadwal-time">${time}</div>
            <div class="jadwal-cabor">${j.nama_cabor} ${j.emoji || ''}</div>
            <div class="jadwal-lokasi">📍 ${j.lokasi || 'TBD'}</div>
        `;
        container.appendChild(item);
    });
}

/**
 * Load Ranking Korlap untuk TV
 */
async function loadRankingTV() {
    const leaderboard = await getLeaderboard();
    const container = document.getElementById('tvRanking');

    if (!container) return;

    if (leaderboard.length === 0) {
        container.innerHTML = '<p>Data ranking belum tersedia</p>';
        return;
    }

    container.innerHTML = '';
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

    leaderboard.forEach((lb, index) => {
        const medal = medals[index] || '';
        const item = document.createElement('div');
        item.className = `ranking-item rank-${lb.ranking}`;
        item.innerHTML = `
            <div class="ranking-medal">${medal}</div>
            <div class="ranking-info">
                <div class="ranking-name">${lb.nama_korlap}</div>
                <div class="ranking-poin">${lb.total_poin} poin</div>
            </div>
        `;
        container.appendChild(item);
    });
}

/**
 * Load Pemenang Terbaru (Doorprize)
 */
async function loadLatestWinnerTV() {
    const winners = await getDoorprizeWinners();
    const container = document.getElementById('tvLatestWinner');

    if (!container || winners.length === 0) return;

    const latest = winners[0];
    container.innerHTML = `
        <div class="winner-card">
            <div class="winner-emoji">${latest.emoji || '🎁'}</div>
            <div class="winner-title">PEMENANG DOORPRIZE</div>
            <div class="winner-hadiah">${latest.nama_hadiah}</div>
            <div class="winner-name">${latest.nama_pemenang || latest.no_ktp || 'Tidak ada nama'}</div>
            <div class="winner-animation">🎉 SELAMAT! 🎉</div>
        </div>
    `;
}

/**
 * Load Pengumuman MC
 */
async function loadPengumumanMC() {
    const pengumuman = await getPengumuman(true); // tv_only = true
    const container = document.getElementById('tvPengumuman');

    if (!container) return;

    if (pengumuman.length === 0) {
        container.innerHTML = '<p>Tidak ada pengumuman</p>';
        return;
    }

    container.innerHTML = '';
    // Rotating pengumuman
    let currentIndex = 0;

    const displayPengumuman = () => {
        const p = pengumuman[currentIndex];
        container.innerHTML = `
            <div class="pengumuman-content">
                <h2>${p.judul}</h2>
                <p>${p.isi}</p>
                <small>Jenis: ${p.tipe}</small>
            </div>
        `;

        currentIndex = (currentIndex + 1) % pengumuman.length;
    };

    displayPengumuman();
    // Ganti pengumuman setiap 5 detik
    setInterval(displayPengumuman, 5000);
}

/**
 * Load Sponsor Berjalan (Scrolling)
 */
async function loadSponsorBerjalan() {
    const sponsors = await getSponsor();
    const container = document.getElementById('tvSponsors');

    if (!container || sponsors.length === 0) return;

    container.innerHTML = '';
    sponsors.forEach(s => {
        const item = document.createElement('div');
        item.className = 'sponsor-item';
        item.innerHTML = `
            <div class="sponsor-logo">📦</div>
            <div class="sponsor-name">${s.nama_sponsor}</div>
            <div class="sponsor-category">${s.kategori}</div>
        `;
        container.appendChild(item);
    });
}

/**
 * Load Live Score (untuk TV ticker)
 */
async function loadLiveScoreTicker() {
    const skor = await getSkor({ status: 'berlangsung' });
    const container = document.getElementById('tvScoreTicker');

    if (!container) return;

    if (skor.length === 0) {
        container.innerHTML = '<div class="ticker-item">📺 Tidak ada pertandingan live saat ini</div>';
        return;
    }

    container.innerHTML = '';
    skor.forEach(s => {
        const item = document.createElement('div');
        item.className = 'ticker-item';
        item.innerHTML = `
            🔴 LIVE: ${s.nama_cabor} | ${s.nama_korlap_1} ${s.skor_korlap_1} - ${s.skor_korlap_2} ${s.nama_korlap_2 || 'TBD'}
        `;
        container.appendChild(item);
    });
}

// Load initial data
document.addEventListener('DOMContentLoaded', () => {
    loadTVData();
});
