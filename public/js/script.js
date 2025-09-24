// Portfolio interactions

document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear();
    setupSmoothScroll();
    setupNavbarObserver();
    setupProjectFilters();
    setupBackToTop();
});

function setCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse?.classList.contains('show')) {
                const collapse = bootstrap.Collapse.getInstance(navbarCollapse);
                collapse?.hide();
            }
        });
    });
}

function setupNavbarObserver() {
    const navbar = document.querySelector('.navbar');
    const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }, { rootMargin: '-120px 0px 0px 0px', threshold: 0 });

    const hero = document.querySelector('.hero-section');
    if (hero) {
        observer.observe(hero);
    }
}

function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectCards = document.querySelectorAll('[data-category]');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category')?.split(',') || [];
                const normalized = categories.map(cat => cat.trim());
                if (filter === 'all' || normalized.includes(filter)) {
                    card.classList.remove('d-none');
                } else {
                    card.classList.add('d-none');
                }
            });
        });
    });
}

function setupBackToTop() {
    const button = document.getElementById('backToTop');
    if (!button) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
