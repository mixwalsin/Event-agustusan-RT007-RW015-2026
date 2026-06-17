/**
 * hasil.html Integration Script
 * Menampilkan live score, hasil, klasemen dari API
 */

// Auto-refresh setiap 10 detik
setInterval(() => {
    loadHasilData();
}, 10000);

/**
 * Load semua data hasil
 */
async function loadHasilData() {
    loadLiveScore();
    loadLeaderboard();
    loadJuara();
    loadDoorprizeWinners();
    loadVotingResults();
}

/**
 * Load Live Score
 */
async function loadLiveScore() {
    const skor = await getSkor({ status: 'berlangsung' });
    const container = document.getElementById('liveScoreContainer');

    if (!container) return;

    if (skor.length === 0) {
        container.innerHTML = '<p class="empty-state">Tidak ada pertandingan berlangsung</p>';
        return;
    }

    container.innerHTML = '';
    skor.forEach(s => {
        const card = document.createElement('div');
        card.className = 'score-card live';
        card.innerHTML = `
            <div class="cabor-name">${s.nama_cabor || ''}</div>
            <div class="score-display">
                <div class="team team-1">
                    <div class="team-name">${s.nama_korlap_1 || ''}</div>
                    <div class="score">${s.skor_korlap_1 || 0}</div>
                </div>
                <div class="vs">VS</div>
                <div class="team team-2">
                    <div class="team-name">${s.nama_korlap_2 || '-'}</div>
                    <div class="score">${s.skor_korlap_2 || 0}</div>
                </div>
            </div>
            <div class="status live-badge">🔴 LIVE</div>
        `;
        container.appendChild(card);
    });
}

/**
 * Load Hasil Pertandingan (Selesai)
 */
async function loadHasilPertandingan() {
    const skor = await getSkor({ status: 'selesai' });
    const container = document.getElementById('hasilContainer');

    if (!container) return;

    if (skor.length === 0) {
        container.innerHTML = '<p class="empty-state">Belum ada hasil pertandingan</p>';
        return;
    }

    container.innerHTML = '';
    skor.forEach(s => {
        const card = document.createElement('div');
        card.className = 'score-card finished';
        const pemenang = s.pemenang_id === s.korlap_1_id ? s.nama_korlap_1 : s.nama_korlap_2;
        card.innerHTML = `
            <div class="cabor-name">${s.nama_cabor || ''}</div>
            <div class="score-display">
                <div class="team ${s.pemenang_id === s.korlap_1_id ? 'winner' : ''}">
                    <div class="team-name">${s.nama_korlap_1 || ''}</div>
                    <div class="score">${s.skor_korlap_1 || 0}</div>
                </div>
                <div class="vs">VS</div>
                <div class="team ${s.pemenang_id === s.korlap_2_id ? 'winner' : ''}">
                    <div class="team-name">${s.nama_korlap_2 || '-'}</div>
                    <div class="score">${s.skor_korlap_2 || 0}</div>
                </div>
            </div>
            <div class="pemenang">🏆 Pemenang: ${pemenang}</div>
        `;
        container.appendChild(card);
    });
}

/**
 * Load Leaderboard Korlap
 */
async function loadLeaderboard() {
    const leaderboard = await getLeaderboard();
    const container = document.getElementById('leaderboardContainer');

    if (!container) return;

    if (leaderboard.length === 0) {
        container.innerHTML = '<p class="empty-state">Data leaderboard belum tersedia</p>';
        return;
    }

    container.innerHTML = '<table class="leaderboard-table"><thead><tr><th>Ranking</th><th>Korlap</th><th>Poin</th></tr></thead><tbody>';

    const medals = ['🥇', '🥈', '🥉'];
    leaderboard.forEach(lb => {
        const medal = medals[lb.ranking - 1] || '';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${medal} ${lb.ranking}</td>
            <td>${lb.nama_korlap}</td>
            <td>${lb.total_poin}</td>
        `;
        container.querySelector('tbody').appendChild(row);
    });

    container.innerHTML += '</tbody></table>';
}

/**
 * Load Daftar Juara
 */
async function loadJuara() {
    const juara = await getJuara();
    const container = document.getElementById('juaraContainer');

    if (!container) return;

    if (juara.length === 0) {
        container.innerHTML = '<p class="empty-state">Daftar juara belum tersedia</p>';
        return;
    }

    // Group by cabor
    const groupedByType = {};
    juara.forEach(j => {
        if (!groupedByType[j.rangking]) {
            groupedByType[j.rangking] = [];
        }
        groupedByType[j.rangking].push(j);
    });

    container.innerHTML = '';
    const medals = { '1': '🥇 Juara 1', '2': '🥈 Juara 2', '3': '🥉 Juara 3' };

    for (const rank in groupedByType) {
        const section = document.createElement('div');
        section.className = 'juara-section';
        section.innerHTML = `<h3>${medals[rank]}</h3>`;

        const list = document.createElement('div');
        list.className = 'juara-list';

        groupedByType[rank].forEach(j => {
            const item = document.createElement('div');
            item.className = 'juara-item';
            item.innerHTML = `
                <div class="cabor">${j.nama_cabor}</div>
                <div class="korlap">${j.nama_korlap}</div>
                <div class="poin">${j.poin} poin</div>
            `;
            list.appendChild(item);
        });

        section.appendChild(list);
        container.appendChild(section);
    }
}

/**
 * Load Pemenang Doorprize
 */
async function loadDoorprizeWinners() {
    const winners = await getDoorprizeWinners();
    const container = document.getElementById('doorprizeWinnersContainer');

    if (!container) return;

    if (winners.length === 0) {
        container.innerHTML = '<p class="empty-state">Belum ada pemenang doorprize</p>';
        return;
    }

    container.innerHTML = '';
    // Show latest 10 winners
    winners.slice(0, 10).forEach(w => {
        const card = document.createElement('div');
        card.className = 'doorprize-winner';
        card.innerHTML = `
            <div class="emoji">${w.emoji || '🎁'}</div>
            <div class="hadiah">${w.nama_hadiah}</div>
            <div class="pemenang">${w.nama_pemenang || 'No. KTP: ' + (w.no_ktp || 'N/A')}</div>
            <div class="waktu">${new Date(w.waktu_undian).toLocaleString('id-ID')}</div>
        `;
        container.appendChild(card);
    });
}

/**
 * Load Hasil Voting
 */
async function loadVotingResults() {
    const voting = await getVoting();
    const container = document.getElementById('votingContainer');

    if (!container) return;

    if (voting.length === 0) {
        container.innerHTML = '<p class="empty-state">Data voting belum tersedia</p>';
        return;
    }

    container.innerHTML = '';
    const total = voting.reduce((sum, v) => sum + (v.total_suara || 0), 0);

    voting.forEach(v => {
        const percentage = total > 0 ? ((v.total_suara / total) * 100).toFixed(1) : 0;
        const item = document.createElement('div');
        item.className = 'voting-item';
        item.innerHTML = `
            <div class="voting-header">
                <span>${v.nama_korlap}</span>
                <span>${v.total_suara} suara (${percentage}%)</span>
            </div>
            <div class="voting-bar">
                <div class="voting-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        container.appendChild(item);
    });
}

// Load initial data
document.addEventListener('DOMContentLoaded', () => {
    loadHasilData();
});
