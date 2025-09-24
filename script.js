const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

const HEADER_OFFSET = 88;

// Smooth scrolling with header offset
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: targetPosition - HEADER_OFFSET,
            behavior: 'smooth'
        });

        if (navLinks && mobileMenuToggle) {
            navLinks.classList.remove('mobile-active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// Mobile navigation toggle

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Reveal on scroll
const animatedElements = document.querySelectorAll('[data-animate]');

if (animatedElements.length) {
    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });

    animatedElements.forEach(element => animateObserver.observe(element));
}

// Header behavior on scroll
const header = document.querySelector('.header');
let lastScrollY = window.pageYOffset;

window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset;

    if (header) {
        header.classList.toggle('header--scrolled', currentY > 12);

        if (currentY > lastScrollY && currentY > 140) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }
    }

    lastScrollY = currentY;
});

// Ensure hero content is visible on load for browsers that delay observers
window.addEventListener('load', () => {
    animatedElements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('is-visible');
        }
    });
});
