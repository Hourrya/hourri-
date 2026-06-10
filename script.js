// fichier nettoyé : pas de déclarations dupliquées, protections si éléments manquent
document.addEventListener('DOMContentLoaded', () => {
    // safe selectors
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    const deadlineEl = document.getElementById('deadline');
    const modal = document.getElementById('courseModal');
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('courseForm');
    const table = document.querySelector('.planning-table table');

    // live clock + date
    if (timeEl && dateEl) {
        function updateClock() {
            const now = new Date();
            timeEl.textContent = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
            dateEl.textContent = now.toLocaleDateString('fr-FR');
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // modal controls (guarded)
    if (openBtn && modal) {
        openBtn.addEventListener('click', () => modal.setAttribute('aria-hidden', 'false'));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.setAttribute('aria-hidden', 'true'));
    }
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.setAttribute('aria-hidden', 'true'); });
    }

    // mapping helpers
    const dayToCol = { 'lundi':1,'mardi':2,'mercredi':3,'jeudi':4,'vendredi':5,'samedi':6,'dimanche':7 };
    const dayToWeekdayNum = { 'dimanche':0,'lundi':1,'mardi':2,'mercredi':3,'jeudi':4,'vendredi':5,'samedi':6 };

    function saveItem(name, day, time) {
        try {
            const data = JSON.parse(localStorage.getItem('planning_v1') || '[]');
            data.push({name, day, time});
            localStorage.setItem('planning_v1', JSON.stringify(data));
        } catch (e) { console.warn(e); }
    }

    function placeCourse(name, day, time, save=true) {
        if (!table) return;
        const col = dayToCol[day];
        if (!col) return;
        const rows = Array.from(table.tBodies[0].rows);
        const targetStart = time.slice(0,5);
        let placed = false;
        for (const row of rows) {
            const cellTime = row.cells[0].textContent.trim();
            const start = cellTime.split('-')[0].trim();
            if (start === targetStart) {
                row.cells[col].textContent = name;
                placed = true;
                break;
            }
        }
        if (placed && save) saveItem(name, day, time);
    }

    function updateDeadlineFromItem(item) {
        if (!deadlineEl) return;
        const today = new Date();
        const target = dayToWeekdayNum[item.day];
        if (typeof target === 'undefined') return;
        const todayNum = today.getDay();
        let daysUntil = (target - todayNum + 7) % 7;
        if (daysUntil === 0) daysUntil = 7;
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntil);
        const formatted = nextDate.toLocaleDateString('fr-FR') + ' ' + item.time.slice(0,5);
        const current = deadlineEl.textContent;
        if (current === 'Aucun examen programmé') {
            deadlineEl.textContent = formatted;
        } else {
            const [d,m,y] = current.split(' ')[0].split('/');
            const curDate = new Date(`${y}-${m}-${d}`);
            if (nextDate < curDate) deadlineEl.textContent = formatted;
        }
    }

    // load saved
    (function loadSaved(){
        if (!table) return;
        try {
            const data = JSON.parse(localStorage.getItem('planning_v1') || '[]');
            data.forEach(item => {
                placeCourse(item.name, item.day, item.time, false);
                updateDeadlineFromItem(item);
            });
        } catch (e){ console.warn(e); }
    })();

    form.addEventListener('submit', (e) => {

    e.preventDefault();

    const name = document.getElementById('courseName').value.trim();
    const day = document.getElementById('courseDay').value;
    const time = document.getElementById('courseTime').value;

    if (!name || !day || !time) return;

    if (celluleSelectionnee) {

        celluleSelectionnee.textContent = name;

        celluleSelectionnee = null;

    } else {

        placeCourse(name, day, time, true);

    }

    modal.setAttribute('aria-hidden', 'true');
    form.reset();

});
const deleteBtn = document.getElementById("deleteCourse");

deleteBtn.addEventListener("click", () => {

    if(celluleSelectionnee){

        celluleSelectionnee.textContent = "";

        celluleSelectionnee = null;

        modal.setAttribute("aria-hidden", "true");

        form.reset();
    }

});
    let celluleSelectionnee = null;

// rendre les cellules du planning cliquables
const cellules = document.querySelectorAll(".planning-table tbody td");

cellules.forEach(cellule => {

    cellule.addEventListener("click", () => {

        // ignorer la colonne des heures
        const ligne = cellule.parentElement;
        const indexColonne = cellule.cellIndex;

        if(indexColonne === 0) return;

        celluleSelectionnee = cellule;

        document.getElementById("courseName").value =
            cellule.textContent;

        modal.setAttribute("aria-hidden", "false");
    });

});


});