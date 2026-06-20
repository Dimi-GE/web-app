function initTimeTracking() {
    const display    = document.getElementById('tt-display');
    const btnStart   = document.getElementById('tt-btn-start');
    const todayLabel = document.getElementById('tt-today-label');

    todayLabel.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    let running   = false;
    let startTime = null;
    let elapsed   = 0;
    let ticker    = null;

    function pad(n) { return String(n).padStart(2, '0'); }

    function formatDuration(ms) {
        const s = Math.floor(ms / 1000);
        return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
    }

    function tick() {
        display.textContent = formatDuration(elapsed + (Date.now() - startTime));
    }

    btnStart.addEventListener('click', () => {
        if (!running) {
            running   = true;
            startTime = Date.now();
            ticker    = setInterval(tick, 1000);
            btnStart.textContent = 'Stop';
            btnStart.classList.add('running');
            display.classList.add('running');
        } else {
            running  = false;
            elapsed += Date.now() - startTime;
            clearInterval(ticker);
            btnStart.textContent = 'Start';
            btnStart.classList.remove('running');
            display.classList.remove('running');
        }
    });
}
