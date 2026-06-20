function initTimeTracking() {

    // ── Shared helpers ─────────────────────────────────────────────────────
    function pad(n) { return String(n).padStart(2, '0'); }

    function dateKey(date) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    function formatDateDMY(date) {
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    }

    const MONTH_NAMES = ['January','February','March','April','May','June',
                         'July','August','September','October','November','December'];

    // ── Timer ──────────────────────────────────────────────────────────────
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

    function formatDuration(ms) {
        const s = Math.floor(ms / 1000);
        return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
    }

    btnStart.addEventListener('click', () => {
        if (!running) {
            running   = true;
            startTime = Date.now();
            ticker    = setInterval(() => {
                display.textContent = formatDuration(elapsed + (Date.now() - startTime));
            }, 1000);
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

    // ── Settings ───────────────────────────────────────────────────────────
    const freelancerInput = document.getElementById('tt-freelancer');
    const companyInput    = document.getElementById('tt-company');
    const btnSaveSettings = document.getElementById('tt-settings-save');

    function loadSettings() {
        return JSON.parse(localStorage.getItem('tt_settings') || '{}');
    }

    (function applySettings() {
        const s = loadSettings();
        freelancerInput.value = s.freelancer || '';
        companyInput.value    = s.company    || '';
    })();

    btnSaveSettings.addEventListener('click', () => {
        localStorage.setItem('tt_settings', JSON.stringify({
            freelancer: freelancerInput.value.trim(),
            company:    companyInput.value.trim(),
        }));
        btnSaveSettings.textContent = 'Saved';
        setTimeout(() => { btnSaveSettings.textContent = 'Save'; }, 1500);
    });

    // ── Timesheet data ─────────────────────────────────────────────────────
    function loadEntries() {
        return JSON.parse(localStorage.getItem('tt_entries') || '{}');
    }

    function saveEntries(entries) {
        localStorage.setItem('tt_entries', JSON.stringify(entries));
    }

    // ── Calendar ───────────────────────────────────────────────────────────
    const now          = new Date();
    let   calYear      = now.getFullYear();
    let   calMonth     = now.getMonth();

    const calContainer = document.getElementById('tt-calendar');
    const calLabel     = document.getElementById('tt-cal-label');
    const btnCalPrev   = document.getElementById('tt-cal-prev');
    const btnCalNext   = document.getElementById('tt-cal-next');

    const WEEKDAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    function getTimesheetWeeks(year, month) {
        const firstDay   = new Date(year, month, 1);
        const firstDow   = firstDay.getDay(); // 0=Sun
        const toMonday   = firstDow === 0 ? 6 : firstDow - 1;
        const start      = new Date(year, month, 1 - toMonday);

        const lastDay    = new Date(year, month + 1, 0);
        const lastDow    = lastDay.getDay();
        const toSunday   = lastDow === 0 ? 0 : 7 - lastDow;
        const end        = new Date(year, month + 1, toSunday);

        const weeks = [];
        const cur   = new Date(start);
        while (cur <= end) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(cur));
                cur.setDate(cur.getDate() + 1);
            }
            weeks.push(week);
        }
        return weeks;
    }

    function renderCalendar() {
        const entries  = loadEntries();
        const todayKey = dateKey(now);
        const weeks    = getTimesheetWeeks(calYear, calMonth);

        calLabel.textContent = `${MONTH_LABELS[calMonth]} ${calYear}`;

        const weekdayHeaders = WEEKDAY_LABELS
            .map(d => `<div class="tt-cal-weekday">${d}</div>`)
            .join('');

        let daysHtml = '';
        weeks.forEach(week => {
            week.forEach(date => {
                const key       = dateKey(date);
                const entry     = entries[key];
                const isOther   = date.getMonth() !== calMonth;
                const isToday   = key === todayKey;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                let cls = 'tt-cal-day';
                if (isOther)   cls += ' tt-cal-day--other-month';
                if (isToday)   cls += ' tt-cal-day--today';
                if (isWeekend) cls += ' tt-cal-day--weekend';

                const hoursHtml = entry && entry.hours > 0
                    ? `<span class="tt-cal-day-hours">${entry.hours}h</span>` : '';
                const tasksHtml = entry && entry.tasks && entry.tasks.length
                    ? `<span class="tt-cal-day-tasks">${entry.tasks.join(', ')}</span>` : '';

                daysHtml += `<button class="${cls}" data-key="${key}">
                    <span class="tt-cal-day-num">${date.getDate()}</span>
                    ${hoursHtml}
                    ${tasksHtml}
                </button>`;
            });
        });

        calContainer.innerHTML = `
            <div class="tt-cal-weekdays">${weekdayHeaders}</div>
            <div class="tt-cal-days">${daysHtml}</div>`;

        calContainer.querySelectorAll('.tt-cal-day').forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.key));
        });
    }

    const MONTH_LABELS = MONTH_NAMES;

    btnCalPrev.addEventListener('click', () => {
        calMonth--;
        if (calMonth < 0) { calMonth = 11; calYear--; }
        renderCalendar();
    });

    btnCalNext.addEventListener('click', () => {
        calMonth++;
        if (calMonth > 11) { calMonth = 0; calYear++; }
        renderCalendar();
    });

    renderCalendar();

    // ── Modal ──────────────────────────────────────────────────────────────
    const backdrop     = document.getElementById('tt-modal-backdrop');
    const modalTitle   = document.getElementById('tt-modal-date-label');
    const modalHours   = document.getElementById('tt-modal-hours');
    const modalTasks   = document.getElementById('tt-modal-tasks');
    const btnModalSave = document.getElementById('tt-modal-save');
    const btnModalDel  = document.getElementById('tt-modal-delete');
    const btnModalCanc = document.getElementById('tt-modal-cancel');

    let activeKey = null;

    function openModal(key) {
        activeKey = key;
        const entry   = loadEntries()[key] || { hours: 0, tasks: [] };
        const [y,m,d] = key.split('-').map(Number);
        const date    = new Date(y, m - 1, d);

        modalTitle.textContent = date.toLocaleDateString('en-GB', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
        modalHours.value = entry.hours || '';
        modalTasks.value = (entry.tasks || []).join('\n');

        backdrop.classList.add('open');
        modalHours.focus();
    }

    function closeModal() {
        backdrop.classList.remove('open');
        activeKey = null;
    }

    btnModalSave.addEventListener('click', () => {
        if (!activeKey) return;
        const entries = loadEntries();
        const hours   = parseFloat(modalHours.value) || 0;
        const tasks   = modalTasks.value.split('\n').map(t => t.trim()).filter(Boolean);
        entries[activeKey] = { hours, tasks };
        saveEntries(entries);
        closeModal();
        renderCalendar();
    });

    btnModalDel.addEventListener('click', () => {
        if (!activeKey) return;
        const entries = loadEntries();
        delete entries[activeKey];
        saveEntries(entries);
        closeModal();
        renderCalendar();
    });

    btnModalCanc.addEventListener('click', closeModal);

    backdrop.addEventListener('click', e => {
        if (e.target === backdrop) closeModal();
    });

    // ── PDF Export ─────────────────────────────────────────────────────────
    const JSPDF_CDN     = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    const AUTOTABLE_CDN = 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js';

    document.getElementById('tt-export-pdf').addEventListener('click', () => {
        const load = window.jspdf
            ? Promise.resolve()
            : loadScript(JSPDF_CDN).then(() => loadScript(AUTOTABLE_CDN));
        load.then(generatePDF);
    });

    function generatePDF() {
        const { jsPDF }   = window.jspdf;
        const doc         = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const settings    = loadSettings();
        const entries     = loadEntries();
        const weeks       = getTimesheetWeeks(calYear, calMonth);

        const margin      = 14;
        const pageWidth   = 297 - margin * 2;   // A4 landscape
        const labelColW   = 20;
        const dayColW     = (pageWidth - labelColW) / 7;

        const COLOR_SALMON     = [244, 177, 131];
        const COLOR_SALMON_WKD = [252, 228, 214];
        const COLOR_HOURS      = [255, 204, 153];
        const COLOR_HOURS_WKD  = [255, 235, 210];
        const COLOR_GREY_FILL  = [217, 217, 217];
        const COLOR_WHITE      = [255, 255, 255];
        const COLOR_GREEN      = [198, 239, 206];
        const COLOR_BLACK      = [0, 0, 0];
        const COLOR_VIOLET     = [112, 48, 160];

        let y = margin;

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Time Sheet', margin, y);  y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Freelancer details: ${settings.freelancer || '—'}`, margin, y); y += 5.5;
        doc.text(settings.company || '—', margin, y);                             y += 5.5;
        doc.text(`Year: ${calYear}`, margin, y);                                  y += 5.5;
        doc.text(`Month: ${MONTH_NAMES[calMonth]}`, margin, y);                   y += 9;

        // Column width map — same for every table
        const colStyles = { 0: { cellWidth: labelColW } };
        for (let i = 1; i <= 7; i++) colStyles[i] = { cellWidth: dayColW };

        // Weekly tables
        weeks.forEach(week => {
            const dayRow   = ['Day'];
            const hoursRow = ['Hours'];
            const tasksRow = ['Tasks'];

            week.forEach(date => {
                const entry = entries[dateKey(date)] || { hours: 0, tasks: [] };
                dayRow.push(formatDateDMY(date));
                hoursRow.push(entry.hours > 0 ? entry.hours : 0);
                tasksRow.push((entry.tasks || []).join('\n'));
            });

            doc.autoTable({
                startY:      y,
                margin:      { left: margin, right: margin },
                tableWidth:  pageWidth,
                head:        [],
                body:        [dayRow, hoursRow, tasksRow],
                theme:       'grid',
                columnStyles: colStyles,
                styles: {
                    fontSize:    9.5,
                    cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 3 },
                    overflow:    'linebreak',
                    textColor:   [30, 30, 30],
                    lineColor:   COLOR_BLACK,
                    lineWidth:   0.3,
                },
                didParseCell(data) {
                    if (data.column.index === 0) {
                        data.cell.styles.fontStyle  = 'bold';
                        data.cell.styles.fillColor  = COLOR_VIOLET;
                        data.cell.styles.textColor  = COLOR_WHITE;
                        return;
                    }
                    const date      = week[data.column.index - 1];
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const hasHours  = (entries[dateKey(date)] || {}).hours > 0;

                    if (data.row.index === 0) {           // Day row
                        data.cell.styles.fillColor = hasHours ? COLOR_GREY_FILL
                                                   : isWeekend ? COLOR_SALMON_WKD : COLOR_SALMON;
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.halign    = 'center';
                    } else if (data.row.index === 1) {    // Hours row
                        data.cell.styles.fillColor = isWeekend ? COLOR_HOURS_WKD : COLOR_HOURS;
                        data.cell.styles.halign    = 'right';
                    } else {                              // Tasks row
                        data.cell.styles.fillColor    = COLOR_WHITE;
                        data.cell.styles.minCellHeight = 12;
                    }
                },
            });

            y = doc.lastAutoTable.finalY + 5;
        });

        // Total
        const totalHours = weeks.flat().reduce((sum, date) => {
            return sum + ((entries[dateKey(date)] || {}).hours || 0);
        }, 0);

        const emptyColW = labelColW + dayColW * 6;
        doc.autoTable({
            startY:     y,
            margin:     { left: margin, right: margin },
            tableWidth: pageWidth,
            head:       [],
            body:       [
                ['', 'Total'],
                ['', totalHours],
            ],
            theme: 'grid',
            columnStyles: {
                0: { cellWidth: emptyColW },
                1: { cellWidth: dayColW },
            },
            styles: {
                fontSize:    9.5,
                cellPadding: { top: 2.5, right: 3, bottom: 2.5, left: 3 },
                textColor:   [30, 30, 30],
                lineColor:   COLOR_BLACK,
                lineWidth:   0.3,
            },
            didParseCell(data) {
                if (data.column.index === 1) {
                    if (data.row.index === 0) {
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        data.cell.styles.fillColor = COLOR_GREEN;
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.halign    = 'right';
                    }
                }
            },
        });

        doc.save(`${calYear}_${MONTH_NAMES[calMonth]}_TimeSheet.pdf`);
    }
}
