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
