// ========== CENTRAL EMPLOYEE LIST ==========
// All employees available in the system — used for all dropdowns (appointments, tasks, etc.)
const allEmployees = [
    'Jan van der Berg',
    'Sophie Jansen',
    'Mohammed Al-Hassan',
    'Anna de Vries',
    'Mark Peters',
    'Eva Janssen',
    'Kees van Dam',
    'Laila Ahmed',
    'Tom Bakker',
    'Nora van Leeuwen',
    'Ibrahim Noor',
    'Saskia Groen',
    'Pieter Mulder',
    'Yara Haddad',
    'Rob van Dijk',
    'Maaike Vos',
    'Henk Scholten',
    'Fatima El Kadi',
    'Lars van Ham',
    'Jessica Muller',
    'Dirk Hendrickx',
    'Liesbeth Maes',
    'Filip Verhoeven',
    'Rudy Claes',
    'Petra Wouters',
    'Jozef Wouters',
    'Brigitte Vermeersch',
    'Stéphane Leblanc',
    'Marie-Claire Brun',
    'Antoine Marchal',
    'Christiane Dubois',
    'Bernard Fontaine',
    'Sylvie Germain',
    'Michel Hubert',
    'Isabelle Joly',
    'Karim Khoury',
    'Luc Leclerc',
    'Monique Michaud',
    'Nadine Noel',
    'Olivier Olivier',
    'Pascale Pichon',
    'Quentin Quentin',
    'Régine Remy',
    'Sabine Sauzet',
    'Thierry Thiebaut',
    'Ursule Uther',
    'Valérie Valmont',
    'Wilfried Weiner',
    'Ximena Ximénez',
    'Yves Yacine',
    'Zoé Zouari'
    
];

// Simple client-side menu switching for the Dashboard
document.addEventListener('DOMContentLoaded', function () {
    const menu = document.getElementById('dashboard-menu');
    if (!menu) return;

    const buttons = Array.from(menu.querySelectorAll('button'));
    const sections = Array.from(document.querySelectorAll('.content-section'));

    function showTarget(targetId) {
        sections.forEach(s => {
            if ('#' + s.id === targetId) {
                s.classList.add('active-section');
            } else {
                s.classList.remove('active-section');
            }
        });
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const target = this.getAttribute('data-target');
            if (target) showTarget(target);
        });
    });

    // ensure a default visible section
    const activeBtn = menu.querySelector('button.active');
    if (activeBtn) {
        const t = activeBtn.getAttribute('data-target');
        if (t) showTarget(t);
    }
});

// --------- Appointments calendar modal ---------
// Ensure modal and links exist by waiting for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {

    (function (){
    // sample appointment data (should match sidebar entries)
    const appointments = [
        // December 2025 (existing)
        { date: '2025-12-06', start: '10:00', end: '11:00', name: 'Jan van der Berg', room: 'Kamer 3B' },
        { date: '2025-12-07', start: '13:30', end: '14:00', name: 'Sophie Jansen', room: 'Kamer 1A' },
        { date: '2025-12-08', start: '09:00', end: '09:30', name: 'Mohammed Al-Hassan', room: 'Kamer 2C' },
        { date: '2025-12-09', start: '11:00', end: '11:30', name: 'Anna de Vries', room: 'Kamer 4A' },
        { date: '2025-12-10', start: '14:00', end: '15:00', name: 'Mark Peters', room: 'Kamer 5B' },
        { date: '2025-12-11', start: '08:30', end: '09:00', name: 'Eva Janssen', room: 'Kamer 1C' },
        { date: '2025-12-12', start: '16:00', end: '16:30', name: 'Kees van Dam', room: 'Kamer 2A' },
        { date: '2025-12-13', start: '09:45', end: '10:15', name: 'Laila Ahmed', room: 'Kamer 3C' },
        { date: '2025-12-14', start: '12:00', end: '12:30', name: 'Tom Bakker', room: 'Kamer 4B' },
        { date: '2025-12-15', start: '10:00', end: '10:30', name: 'Nora van Leeuwen', room: 'Kamer 1B' },

        // Other months (random names)
        { date: '2025-11-03', start: '09:00', end: '09:30', name: 'Ibrahim Noor', room: 'Kamer 2B' },
        { date: '2025-11-10', start: '14:00', end: '14:45', name: 'Saskia Groen', room: 'Kamer 1D' },
        { date: '2025-10-21', start: '11:15', end: '11:45', name: 'Pieter Mulder', room: 'Kamer 3A' },
        { date: '2026-01-05', start: '08:30', end: '09:00', name: 'Yara Haddad', room: 'Kamer 4C' },
        { date: '2026-01-20', start: '15:00', end: '15:30', name: 'Rob van Dijk', room: 'Kamer 2D' },
        { date: '2026-02-02', start: '10:30', end: '11:00', name: 'Maaike Vos', room: 'Kamer 5A' },
        { date: '2025-09-29', start: '13:00', end: '13:30', name: 'Henk Scholten', room: 'Kamer 1A' },
        { date: '2025-08-14', start: '16:00', end: '16:30', name: 'Fatima El Kadi', room: 'Kamer 3D' },
        { date: '2026-03-11', start: '09:00', end: '09:45', name: 'Lars van Ham', room: 'Kamer 2C' }
    ];

    const modalEl = document.getElementById('appointmentsModal');
    if (!modalEl) return;
    const bsModal = new bootstrap.Modal(modalEl);
    const calendarContainer = document.getElementById('calendarContainer');
    const monthLabel = document.getElementById('calendarMonthLabel');
    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');

    let currentYear = 2025;
    let currentMonth = 11; // December (0-based -> 11)

    function formatMonthYear(year, month) {
        const d = new Date(year, month, 1);
        return d.toLocaleString('nl-NL', { month: 'long', year: 'numeric' });
    }

    function buildCalendar(year, month) {
        monthLabel.textContent = formatMonthYear(year, month);
        calendarContainer.innerHTML = '';

        // header weekdays
        const table = document.createElement('table');
        table.className = 'table table-bordered';
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        const weekDays = ['Zo','Ma','Di','Wo','Do','Vr','Za'];
        weekDays.forEach(w => { const th = document.createElement('th'); th.textContent = w; headRow.appendChild(th); });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const first = new Date(year, month, 1);
        const startDay = first.getDay();
        const daysInMonth = new Date(year, month+1, 0).getDate();

        let row = document.createElement('tr');
        // fill blanks
        for (let i=0;i<startDay;i++) { const td=document.createElement('td'); td.innerHTML='&nbsp;'; row.appendChild(td); }

        for (let day=1; day<=daysInMonth; day++) {
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const td = document.createElement('td');
            td.className = 'calendar-cell';
            td.style.verticalAlign = 'top';

            // inner wrapper keeps the cell at fixed height and becomes scrollable if content overflows
            const cellInner = document.createElement('div');
            cellInner.className = 'calendar-cell-inner';

            const dayHead = document.createElement('div');
            dayHead.className = 'fw-bold mb-1';
            dayHead.textContent = day;
            cellInner.appendChild(dayHead);

            // find appointments for this day
            const appts = appointments.filter(a => a.date === dateStr);
            appts.forEach(a => {
                const ap = document.createElement('div');
                ap.className = 'mb-1';
                ap.innerHTML = `<div class="small text-primary">${a.start} - ${a.end}</div><div class="">${a.name}</div><div class="text-muted small">${a.room}</div>`;
                cellInner.appendChild(ap);
            });

            td.appendChild(cellInner);

            row.appendChild(td);
            if ((startDay + day) % 7 === 0) { tbody.appendChild(row); row = document.createElement('tr'); }
        }

        // fill remaining
        while (row.children.length < 7) { const td=document.createElement('td'); td.innerHTML='&nbsp;'; row.appendChild(td); }
        tbody.appendChild(row);
        table.appendChild(tbody);
        calendarContainer.appendChild(table);
    }

    // open modal when clicking the appointments link or 'Bekijk meer afspraken' button
    const appointmentsLink = document.getElementById('appointmentsLink');
    const viewMoreBtn = document.getElementById('viewMoreAppointmentsBtn');
    function openAppointmentsModal(e) {
        if (e) e.preventDefault();
        currentYear = 2025;
        currentMonth = 11;
        buildCalendar(currentYear, currentMonth);
        bsModal.show();
    }
    if (appointmentsLink) {
        appointmentsLink.addEventListener('click', openAppointmentsModal);
    }
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', openAppointmentsModal);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function(){
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            buildCalendar(currentYear, currentMonth);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function(){
            currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            buildCalendar(currentYear, currentMonth);
        });
    }

    // expose calendar state and helpers to other scripts
    try {
        window.appointments = appointments;
        window.buildCalendar = buildCalendar;
        window.getCalendarState = function(){ return { year: currentYear, month: currentMonth }; };
    } catch(e) {
        // ignore if window not available
    }

    })();

});

// --------- New appointment modal behavior ---------
(function(){
    function initNewAppointment(){
        // helpers
        function unique(arr) { return Array.from(new Set(arr)); }
        function pad(n){ return String(n).padStart(2,'0'); }
        function addMinutesToTime(time, mins){ // time: 'HH:MM'
            const [hh,mm] = time.split(':').map(Number);
            const dt = new Date(2000,0,1,hh,mm);
            dt.setMinutes(dt.getMinutes()+mins);
            return pad(dt.getHours())+':'+pad(dt.getMinutes());
        }

        const newBtn = document.getElementById('newAppointmentBtn');
        if (!newBtn) return;
        const newModalEl = document.getElementById('newAppointmentModal');
        if (!newModalEl) return;
        const newModal = new bootstrap.Modal(newModalEl);
        const apptLocation = document.getElementById('apptLocation');
        const apptEmployee = document.getElementById('apptEmployee');
        const apptDate = document.getElementById('apptDate');
        const apptTime = document.getElementById('apptTime');
        const apptEndTime = document.getElementById('apptEndTime');
        const createBtn = document.getElementById('createAppointmentBtn');

        function refreshSelects(){
            // derive employees from central list (allEmployees) and sort alphabetically
            const src = [...allEmployees].sort((a,b)=>a.localeCompare(b,'nl',{sensitivity:'base'}));

            apptEmployee.innerHTML = '';
            src.forEach(e => { const opt = document.createElement('option'); opt.value = e; opt.textContent = e; apptEmployee.appendChild(opt); });

            // derive locations from existing appointments array
            function unique(arr) { return Array.from(new Set(arr)); }
            const appointments = (window.appointments || []);
            const locations = unique(appointments.map(a => a.room)).sort();

            apptLocation.innerHTML = '';
            locations.forEach(l => { const opt = document.createElement('option'); opt.value = l; opt.textContent = l; apptLocation.appendChild(opt); });
        }

        newBtn.addEventListener('click', function(){
            // populate selects
            refreshSelects();
            // default date -> current displayed month first day
            const state = (window.getCalendarState && window.getCalendarState()) || { year: new Date().getFullYear(), month: new Date().getMonth() };
            const defaultDate = new Date(state.year, state.month, 1);
            apptDate.value = defaultDate.toISOString().slice(0,10);
            apptTime.value = '09:00';
            apptEndTime.value = '09:30';
            newModal.show();
        });

        createBtn.addEventListener('click', function(){
            const date = apptDate.value;
            const time = apptTime.value;
            const endTime = apptEndTime.value;
            const location = apptLocation.value;
            const name = apptEmployee.value;

            if (!date || !time || !endTime || !location || !name) {
                alert('Vul alle velden in.');
                return;
            }

            // validate end > start
            function toMinutes(t){ const [h,m]=t.split(':').map(Number); return h*60 + m; }
            const startMin = toMinutes(time);
            const endMin = toMinutes(endTime);
            if (endMin <= startMin) {
                alert('Eindtijd moet na de starttijd liggen.');
                return;
            }

            // prevent overlapping appointments on same date
            const existing = (window.appointments || []).filter(a => a.date === date);
            const overlap = existing.some(a => {
                const aStart = toMinutes(a.start);
                const aEnd = toMinutes(a.end);
                return (startMin < aEnd) && (aStart < endMin);
            });
            if (overlap) {
                alert('Er is al een overlapende afspraak op deze datum/tijd. Kies een andere tijd.');
                return;
            }

            const newAppt = { date: date, start: time, end: endTime, name: name, room: location };
            (window.appointments = window.appointments || []).push(newAppt);

            // rebuild calendar for the current displayed month
            const s = (window.getCalendarState && window.getCalendarState()) || { year: new Date().getFullYear(), month: new Date().getMonth() };
            (window.buildCalendar || function(){})(s.year, s.month);

            // close modal
            newModal.hide();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNewAppointment);
    } else {
        initNewAppointment();
    }

})();

// --------- Projects per employee modal ---------
(function(){
    const employees = [
        // First 5 employees have 2 projects each (each project includes a status)
        { first: 'Jan', last: 'Smit', projects: [ { name: 'Website Redesign', status: 'In behandeling' }, { name: 'API Development', status: 'Voltooid' } ] },
        { first: 'Sophie', last: 'Jansen', projects: [ { name: 'Mobile App', status: 'In behandeling' }, { name: 'CRM Implementatie', status: 'In behandeling' } ] },
        { first: 'Mohammed', last: 'Al-Hassan', projects: [ { name: 'Database Optimalisatie', status: 'Voltooid' }, { name: 'Data Warehouse', status: 'In behandeling' } ] },
        { first: 'Anna', last: 'de Vries', projects: [ { name: 'Social Media Campagne', status: 'Voltooid' }, { name: 'Website Redesign', status: 'In behandeling' } ] },
        { first: 'Mark', last: 'Peters', projects: [ { name: 'API Development', status: 'In behandeling' }, { name: 'Mobile App', status: 'Voltooid' } ] },
        // Remaining 10 employees have 1 project each
        { first: 'Eva', last: 'Janssen', projects: [ { name: 'CRM Implementatie', status: 'In behandeling' } ] },
        { first: 'Kees', last: 'van Dam', projects: [ { name: 'Database Optimalisatie', status: 'Voltooid' } ] },
        { first: 'Laila', last: 'Ahmed', projects: [ { name: 'Data Warehouse', status: 'In behandeling' } ] },
        { first: 'Tom', last: 'Bakker', projects: [ { name: 'Website Redesign', status: 'Voltooid' } ] },
        { first: 'Nora', last: 'van Leeuwen', projects: [ { name: 'Mobile App', status: 'In behandeling' } ] },
        { first: 'Ibrahim', last: 'Noor', projects: [ { name: 'API Development', status: 'Voltooid' } ] },
        { first: 'Saskia', last: 'Groen', projects: [ { name: 'Social Media Campagne', status: 'In behandeling' } ] },
        { first: 'Pieter', last: 'Mulder', projects: [ { name: 'Data Warehouse', status: 'Voltooid' } ] },
        { first: 'Yara', last: 'Haddad', projects: [ { name: 'Database Optimalisatie', status: 'In behandeling' } ] },
        { first: 'Rob', last: 'van Dijk', projects: [ { name: 'CRM Implementatie', status: 'Voltooid' } ] }
    ];

    // projectsByMonth stores an array of employees (with projects) keyed by YYYY-MM
    window.projectsByMonth = window.projectsByMonth || {};

    // initialize current month key with a deep copy of employees sample
    function monthKeyFromDate(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0'); }
    const initialKey = monthKeyFromDate(new Date(2025,11,1)); // default sample month Dec 2025
    if (!window.projectsByMonth[initialKey]){
        // deep copy employees into the default month
        window.projectsByMonth[initialKey] = employees.map(e => ({ first: e.first, last: e.last, projects: (e.projects||[]).map(p=>({ name: p.name, status: p.status })) }));
    }

    function buildProjectsList(container, year, month){
        container.innerHTML = '';
        const key = year + '-' + String(month+1).padStart(2,'0');
        const data = window.projectsByMonth[key];

        // If explicit data exists for this month, render it
        if (data && data.length) {
            data.forEach(emp => renderEmployeeCard(container, emp));
            return;
        }

        // If this is the initial sample month, keep example content
        if (key === initialKey) {
            employees.forEach(emp => renderEmployeeCard(container, emp));
            return;
        }

        // For all other months: do NOT prefill employees or projects.
        // Show an informational empty state prompting the user to add tasks manually.
        const info = document.createElement('div');
        info.className = 'alert alert-info';
        info.textContent = 'Medewerkers zijn nog niet vastgesteld voor deze maand. Gebruik "+ Nieuwe taak toevoegen" om taken toe te wijzen wanneer je medewerkers hebt geselecteerd.';
        container.appendChild(info);
        return;

        function renderEmployeeCard(container, emp){
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6';

            const card = document.createElement('div');
            card.className = 'p-3 border rounded project-item';

            const name = document.createElement('div');
            name.className = 'fw-bold';
            name.textContent = emp.first + ' ' + emp.last;
            card.appendChild(name);

            // render projects as small badges/pills underneath the name
            const badgesWrap = document.createElement('div');
            badgesWrap.className = 'project-badges';
            (emp.projects || []).forEach(p => {
                const span = document.createElement('span');
                span.className = 'project-badge';
                const pname = document.createElement('span');
                pname.className = 'project-name';
                pname.textContent = p.name;
                span.appendChild(pname);
                const pstatus = document.createElement('span');
                pstatus.className = 'project-status ' + (p.status === 'Voltooid' ? 'status-done' : 'status-pending');
                pstatus.textContent = p.status;
                span.appendChild(pstatus);
                badgesWrap.appendChild(span);
            });
            card.appendChild(badgesWrap);

            col.appendChild(card);
            container.appendChild(col);
        }
    }

    function initProjectsModal(){
        const link = document.getElementById('projectsOverviewLink');
        const modalEl = document.getElementById('projectsModal');
        if (!link || !modalEl) return;
        const bsModal = new bootstrap.Modal(modalEl);
        const container = document.getElementById('projectsListContainer');
        const monthLabel = document.getElementById('projectsMonthLabel');
        const prevBtn = document.getElementById('prevProjectMonthBtn');
        const nextBtn = document.getElementById('nextProjectMonthBtn');
        const newTaskBtn = document.getElementById('newTaskBtn');

        let viewYear = 2025;
        let viewMonth = 11; // December default (0-based)

        function renderView(){
            monthLabel.textContent = new Date(viewYear, viewMonth, 1).toLocaleString('nl-NL', { month: 'long', year: 'numeric' });
            buildProjectsList(container, viewYear, viewMonth);
        }

        link.addEventListener('click', function(e){
            e.preventDefault();
            // show the modal with the current view
            renderView();
            bsModal.show();
        });

        if (prevBtn) prevBtn.addEventListener('click', function(){ viewMonth--; if (viewMonth<0){ viewMonth=11; viewYear--; } renderView(); });
        if (nextBtn) nextBtn.addEventListener('click', function(){ viewMonth++; if (viewMonth>11){ viewMonth=0; viewYear++; } renderView(); });

        // New Task modal handling
        if (newTaskBtn){
            const newTaskModalEl = document.getElementById('newTaskModal');
            const newTaskModal = new bootstrap.Modal(newTaskModalEl);
            const empSelect = document.getElementById('newTaskEmployee');
            const nameInput = document.getElementById('newTaskName');
            const monthInput = document.getElementById('newTaskMonth');
            const createBtn = document.getElementById('createTaskBtn');

            function refreshEmployeeOptions(){
                empSelect.innerHTML = '';
                // use central allEmployees list (same as appointments modal), sorted alphabetically
                const names = [...allEmployees].sort((a,b)=>a.localeCompare(b,'nl',{sensitivity:'base'}));
                names.forEach(n => { const opt = document.createElement('option'); opt.value = n; opt.textContent = n; empSelect.appendChild(opt); });
            }

            newTaskBtn.addEventListener('click', function(){
                refreshEmployeeOptions();
                // prefill month to currently viewed month
                monthInput.value = viewYear + '-' + String(viewMonth+1).padStart(2,'0');
                nameInput.value = '';
                empSelect.value = '';
                newTaskModal.show();
            });

            createBtn.addEventListener('click', function(){
                const emp = empSelect.value;
                const taskName = nameInput.value.trim();
                const monthVal = monthInput.value; // 'YYYY-MM'
                if (!emp || !taskName || !monthVal){ alert('Vul medewerker, taaknaam en maand in.'); return; }

                // ensure month key exists
                if (!window.projectsByMonth[monthVal]){
                    // do NOT prefill employees for future months — start with empty array
                    window.projectsByMonth[monthVal] = [];
                }

                // find employee entry
                const arr = window.projectsByMonth[monthVal];
                const parts = emp.split(' ');
                const first = parts.shift() || emp;
                const last = parts.join(' ') || '';
                let entry = arr.find(x => x.first === first && x.last === last);
                if (!entry){
                    entry = { first: first, last: last, projects: [] };
                    arr.push(entry);
                }
                entry.projects.push({ name: taskName, status: 'In behandeling' });

                // if the added task is for the currently viewed month, re-render
                if (monthVal === (viewYear + '-' + String(viewMonth+1).padStart(2,'0'))){
                    buildProjectsList(container, viewYear, viewMonth);
                }

                newTaskModal.hide();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectsModal);
    } else {
        initProjectsModal();
    }

})();

