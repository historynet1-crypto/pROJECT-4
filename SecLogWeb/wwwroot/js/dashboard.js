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
