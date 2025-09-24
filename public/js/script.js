const initializeNavigation = () => {
    const toggleButton = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('#primary-navigation');
    const navLinkItems = document.querySelectorAll('[data-nav-link]');

    if (!toggleButton || !navLinks) return;

    const toggleMenu = () => {
        const isOpen = navLinks.classList.toggle('open');
        toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    toggleButton.addEventListener('click', toggleMenu);

    navLinkItems.forEach((link) => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    const sections = document.querySelectorAll('section[data-section]');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '-100px 0px -55% 0px'
    };

    const removeActive = () => {
        navLinkItems.forEach((link) => link.classList.remove('is-active'));
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`a[data-nav-link][href="#${id}"]`);
                if (activeLink) {
                    removeActive();
                    activeLink.classList.add('is-active');
                }
            }
        });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
};

const initializeProjectsFilter = () => {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectCards = document.querySelectorAll('[data-project]');

    if (!filterButtons.length || !projectCards.length) return;

    let activeFilter = 'all';

    const updateProjects = () => {
        projectCards.forEach((card) => {
            const tags = card.dataset.tags.split(',').map((tag) => tag.trim());
            const shouldShow = activeFilter === 'all' || tags.includes(activeFilter);
            card.style.display = shouldShow ? '' : 'none';
            card.style.opacity = shouldShow ? '1' : '0';
        });
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeFilter = button.dataset.filter;
            filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
            updateProjects();
        });
    });

    updateProjects();
};

const initializeBackToTop = () => {
    const button = document.querySelector('[data-back-to-top]');
    if (!button) return;

    const toggleVisibility = () => {
        if (window.scrollY > 600) {
            button.classList.add('is-visible');
        } else {
            button.classList.remove('is-visible');
        }
    };

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
};

const updateYear = () => {
    const yearTarget = document.querySelector('[data-year]');
    if (yearTarget) {
        yearTarget.textContent = new Date().getFullYear();
    }
};

window.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeProjectsFilter();
    initializeBackToTop();
    updateYear();
});
=======
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

