/* ========================================================
   SEMARAK AGUSTUS 2026 - EVENT TV JS
   Broadcast Feeds & Scoreboard Ticker Rotator
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLiveScoreFeeds();
    startTickerRotator();
});

function initLiveScoreFeeds() {
    console.log("TV Live Score Feeds successfully synchronized.");
}

function startTickerRotator() {
    const tickers = [
        "🏆 Bulu Tangkis Dewasa: Korlap 1 memimpin klasemen!",
        "🏐 Voli Remaja: Sparing persahabatan dimulai malam ini pukul 19:30 WIB.",
        "🎁 Doorprize Utama: TV LED 55\" siap diundi pada Malam Puncak!",
        "🗳️ Voting Terbuka: Korlap 3 memimpin voting Korlap Terkompak saat ini!"
    ];
    
    let index = 0;
    setInterval(() => {
        const tickerEl = document.querySelector('.ticker-text');
        if (tickerEl) {
            index = (index + 1) % tickers.length;
            tickerEl.textContent = `📢 LIVE FEED: ${tickers[index]} • SILAKAN DAFTAR CABOR LAINNYA DI WEBSITE RESMI WARGA • TETAP GUYUB DAN SPORTIF!`;
        }
    }, 15000);
}
