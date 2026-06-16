/* ========================================
   HASIL EVENT SCRIPT
   Menampilkan hasil event Agustusan 2026
   ======================================== */

// ======== INITIALIZATION ========
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initResultsDisplay();
    initKlasemenDisplay();
    initJuaraDisplay();
    initDoorprizeResults();
    initVotingResults();
    initGaleriJuara();
    initSummary();
    animateOnScroll();
});

// ======== NAVIGATION ========
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

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

// ======== HASIL PERTANDINGAN ========
function initResultsDisplay() {
    const resultsGrid = document.getElementById('results-grid');

    const matches = [
        {
            cabor: 'Voli Putri',
            icon: '🏐',
            teamA: 'Tim Korlap 1',
            scoreA: 25,
            teamB: 'Tim Korlap 3',
            scoreB: 18,
            status: 'SELESAI'
        },
        {
            cabor: 'Futsal Campuran',
            icon: '⚽',
            teamA: 'Tim Korlap 2',
            scoreA: 5,
            teamB: 'Tim Korlap 4',
            scoreB: 3,
            status: 'SELESAI'
        },
        {
            cabor: 'Bulu Tangkis Ganda',
            icon: '🏸',
            teamA: 'Tim Korlap 5',
            scoreA: 21,
            teamB: 'Tim Korlap 1',
            scoreB: 19,
            status: 'SELESAI'
        },
        {
            cabor: 'Tenis Meja Tunggal',
            icon: '🏓',
            teamA: 'Tim Korlap 3',
            scoreA: 11,
            teamB: 'Tim Korlap 2',
            scoreB: 6,
            status: 'SELESAI'
        },
        {
            cabor: 'Lari Estafet Keluarga',
            icon: '🏃',
            teamA: 'Tim Korlap 1',
            scoreA: 45,
            teamB: 'Tim Korlap 3',
            scoreB: 48,
            status: 'SELESAI'
        },
        {
            cabor: 'Catur Terbuka',
            icon: '♟️',
            teamA: 'Tim Korlap 4',
            scoreA: 7,
            teamB: 'Tim Korlap 5',
            scoreB: 5,
            status: 'SELESAI'
        }
    ];

    resultsGrid.innerHTML = matches.map(match => `
        <div class="hasil-card glass">
            <div class="hasil-header">
                <h3>${match.icon} ${match.cabor}</h3>
                <span class="badge-status badge-selesai">${match.status}</span>
            </div>
            <div class="hasil-match">
                <div class="tim">
                    <p class="tim-nama">${match.teamA}</p>
                    <p class="tim-score">${match.scoreA}</p>
                </div>
                <div class="vs">VS</div>
                <div class="tim" style="text-align: right;">
                    <p class="tim-nama">${match.teamB}</p>
                    <p class="tim-score">${match.scoreB}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ======== KLASEMEN KORLAP ========
function initKlasemenDisplay() {
    const tableBody = document.getElementById('klasemen-table-body');

    const klasemen = [
        {
            rank: 1,
            name: 'Korlap 1',
            emas: 3,
            perak: 2,
            perunggu: 1,
            total: 450
        },
        {
            rank: 2,
            name: 'Korlap 3',
            emas: 2,
            perak: 2,
            perunggu: 2,
            total: 420
        },
        {
            rank: 3,
            name: 'Korlap 2',
            emas: 2,
            perak: 1,
            perunggu: 2,
            total: 380
        },
        {
            rank: 4,
            name: 'Korlap 4',
            emas: 1,
            perak: 1,
            perunggu: 1,
            total: 350
        },
        {
            rank: 5,
            name: 'Korlap 5',
            emas: 0,
            perak: 2,
            perunggu: 2,
            total: 310
        }
    ];

    tableBody.innerHTML = klasemen.map((item, index) => `
        <tr class="rank-row rank-${index + 1}">
            <td class="rank-cell">
                <div class="rank-badge rank-${item.rank}">
                    ${item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                </div>
            </td>
            <td class="korlap-cell"><strong>${item.name}</strong></td>
            <td class="medal-cell">👑 ${item.emas}</td>
            <td class="medal-cell">🥈 ${item.perak}</td>
            <td class="medal-cell">🥉 ${item.perunggu}</td>
            <td class="total-cell"><strong>${item.total}</strong></td>
        </tr>
    `).join('');

    // Animate table rows
    document.querySelectorAll('.rank-row').forEach((row, index) => {
        setTimeout(() => {
            row.style.animation = 'slideInLeft 0.5s ease-out';
        }, index * 100);
    });
}

// ======== DAFTAR JUARA ========
function initJuaraDisplay() {
    const juaraGrid = document.getElementById('juara-grid');

    const juara = [
        {
            cabor: 'Bulu Tangkis',
            icon: '🏸',
            juara1: 'Hery Suryanto (Korlap 1)',
            juara2: 'Budi Santoso (Korlap 3)',
            juara3: 'Ahmad Hidayat (Korlap 2)'
        },
        {
            cabor: 'Voli Putri',
            icon: '🏐',
            juara1: 'Tim Korlap 1',
            juara2: 'Tim Korlap 3',
            juara3: 'Tim Korlap 2'
        },
        {
            cabor: 'Futsal',
            icon: '⚽',
            juara1: 'Tim Korlap 2',
            juara2: 'Tim Korlap 4',
            juara3: 'Tim Korlap 1'
        },
        {
            cabor: 'Tenis Meja',
            icon: '🏓',
            juara1: 'Siti Nurhaliza (Korlap 3)',
            juara2: 'Riyo Kusnanda (Korlap 2)',
            juara3: 'Dwi Pratama (Korlap 5)'
        },
        {
            cabor: 'Catur',
            icon: '♟️',
            juara1: 'Rahman Wijaya (Korlap 4)',
            juara2: 'Hartono (Korlap 5)',
            juara3: 'Sumarno (Korlap 1)'
        },
        {
            cabor: 'Lari Estafet',
            icon: '🏃',
            juara1: 'Tim Korlap 1',
            juara2: 'Tim Korlap 3',
            juara3: 'Tim Korlap 2'
        },
        {
            cabor: 'Lomba Anak',
            icon: '🎯',
            juara1: 'Anak-anak Korlap 3',
            juara2: 'Anak-anak Korlap 1',
            juara3: 'Anak-anak Korlap 2'
        },
        {
            cabor: 'Senam Bersama',
            icon: '💃',
            juara1: 'Semua Peserta',
            juara2: 'Partisipasi Aktif',
            juara3: 'Berhasil Luar Biasa'
        }
    ];

    juaraGrid.innerHTML = juara.map(item => `
        <div class="juara-card glass">
            <div class="juara-header">
                <h3>${item.icon} ${item.cabor}</h3>
            </div>
            <div class="juara-list">
                <div class="juara-item rank-1">
                    <span class="juara-rank">🥇 Juara 1</span>
                    <p>${item.juara1}</p>
                </div>
                <div class="juara-item rank-2">
                    <span class="juara-rank">🥈 Juara 2</span>
                    <p>${item.juara2}</p>
                </div>
                <div class="juara-item rank-3">
                    <span class="juara-rank">🥉 Juara 3</span>
                    <p>${item.juara3}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ======== DOORPRIZE RESULTS ========
function initDoorprizeResults() {
    const doorprizeResults = document.getElementById('doorprize-results');

    const winners = [
        {
            name: 'Budi Hartono',
            korlap: 'Korlap 1',
            hadiah: '🥇 TV LED 55"',
            waktu: '16:05 WIB'
        },
        {
            name: 'Siti Muslikhah',
            korlap: 'Korlap 3',
            hadiah: '🥈 Motor Vespa',
            waktu: '16:15 WIB'
        },
        {
            name: 'Ahmad Wijaya',
            korlap: 'Korlap 2',
            hadiah: '🥉 Motor 125cc',
            waktu: '16:25 WIB'
        },
        {
            name: 'Rina Suryani',
            korlap: 'Korlap 4',
            hadiah: '🎯 Kulkas 2 Pintu',
            waktu: '16:35 WIB'
        },
        {
            name: 'Hendro Sutrisno',
            korlap: 'Korlap 5',
            hadiah: '💝 Paket Liburan',
            waktu: '16:45 WIB'
        },
        {
            name: 'Dewi Lestari',
            korlap: 'Korlap 1',
            hadiah: '🏅 Set Gadget',
            waktu: '16:55 WIB'
        }
    ];

    doorprizeResults.innerHTML = winners.map((winner, index) => `
        <div class="doorprize-result-card glass" style="animation-delay: ${index * 0.1}s;">
            <div class="doorprize-result-header">
                <h4>${winner.hadiah}</h4>
                <span class="time-badge">⏰ ${winner.waktu}</span>
            </div>
            <div class="doorprize-result-info">
                <p class="winner-name">👤 ${winner.name}</p>
                <p class="winner-korlap">👥 ${winner.korlap}</p>
            </div>
        </div>
    `).join('');
}

// ======== VOTING RESULTS ========
function initVotingResults() {
    // Voting Results 1 - Korlap Terkompak
    const votingData1 = {
        'Korlap 1': 125,
        'Korlap 2': 98,
        'Korlap 3': 142,
        'Korlap 4': 87,
        'Korlap 5': 110
    };
    displayVotingResults('voting-results-1', votingData1);

    // Voting Results 2 - Supporter Terheboh
    const votingData2 = {
        'Korlap 1': 156,
        'Korlap 2': 143,
        'Korlap 3': 189,
        'Korlap 4': 76,
        'Korlap 5': 120
    };
    displayVotingResults('voting-results-2', votingData2);

    // Voting Results 3 - Maskot Terbaik
    const votingData3 = {
        'Korlap 1': 134,
        'Korlap 2': 112,
        'Korlap 3': 156,
        'Korlap 4': 98,
        'Korlap 5': 145
    };
    displayVotingResults('voting-results-3', votingData3);

    // Voting Results 4 - Peserta Terfavorit
    const votingData4 = {
        'Korlap 1': 167,
        'Korlap 2': 145,
        'Korlap 3': 198,
        'Korlap 4': 112,
        'Korlap 5': 128
    };
    displayVotingResults('voting-results-4', votingData4);
}

function displayVotingResults(elementId, data) {
    const container = document.getElementById(elementId);
    const totalVotes = Object.values(data).reduce((sum, v) => sum + v, 0);

    const sorted = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .map(([name, votes], index) => {
            const percentage = (votes / totalVotes * 100).toFixed(1);
            const medalIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            return {
                name,
                votes,
                percentage,
                medalIcon,
                rank: index + 1
            };
        });

    container.innerHTML = sorted.map(item => `
        <div class="voting-result-item">
            <div class="voting-result-label">
                <span>${item.medalIcon} ${item.name}</span>
                <strong>${item.votes} 🗳️</strong>
            </div>
            <div class="voting-result-bar">
                <div class="voting-result-progress" style="width: ${item.percentage}%">
                    <span>${item.percentage}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ======== GALERI JUARA ========
function initGaleriJuara() {
    const galeriGrid = document.getElementById('galeri-grid');

    const galeri = [
        { title: 'Juara Bulu Tangkis', emoji: '🏸', category: 'Cabor' },
        { title: 'Juara Voli', emoji: '🏐', category: 'Cabor' },
        { title: 'Juara Futsal', emoji: '⚽', category: 'Cabor' },
        { title: 'Doorprize Meriah', emoji: '🎁', category: 'Undian' },
        { title: 'Malam Puncak', emoji: '🎊', category: 'Acara' },
        { title: 'Panitia Hebat', emoji: '👥', category: 'Tim' },
        { title: 'Sponsor Setia', emoji: '🏢', category: 'Sponsor' },
        { title: 'UMKM Berjaya', emoji: '🏪', category: 'UMKM' }
    ];

    galeriGrid.innerHTML = galeri.map(item => `
        <div class="galeri-juara-item">
            <div class="galeri-juara-image" style="font-size: 64px; background: linear-gradient(135deg, var(--primary), var(--accent));">
                ${item.emoji}
            </div>
            <div class="galeri-juara-overlay">
                <h4>${item.title}</h4>
                <p>${item.category}</p>
            </div>
        </div>
    `).join('');
}

// ======== SUMMARY ========
function initSummary() {
    // Data dari data.js
    let totalPeserta = 0;
    if (typeof EVENT_DATA !== 'undefined') {
        totalPeserta = EVENT_DATA.statistics.totalParticipants || 365;
    }

    document.getElementById('total-peserta').textContent = totalPeserta;
    document.getElementById('total-cabor').textContent = '8';
    document.getElementById('total-korlap').textContent = '5';
    document.getElementById('total-hadiah').textContent = '6+';
}

// ======== ANIMATIONS ========
function animateOnScroll() {
    const cards = document.querySelectorAll('.hasil-card, .juara-card, .doorprize-result-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
}

// ======== NOTIFICATION ========
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

// ======== CSS ANIMATIONS ========
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

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);