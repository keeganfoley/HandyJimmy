// Testimonial Carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const totalTestimonials = testimonials.length;

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
        testimonial.style.animation = i === index ? 'fadeInScale 0.6s ease forwards' : '';
    });

    // Update dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(currentTestimonial);
}

function previousTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    showTestimonial(currentTestimonial);
}

// Auto-rotate testimonials
let autoRotate = setInterval(nextTestimonial, 5000);

// Pause auto-rotate on hover
const carousel = document.querySelector('.testimonial-carousel');
if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
    carousel.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextTestimonial, 5000);
    });
}

// Scroll Animations with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Stagger animations for child elements
            const children = entry.target.querySelectorAll('.stagger-animation');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe elements with animations
document.querySelectorAll('.slide-in-left, .slide-in-right, .fade-in-up, .fade-in-scale').forEach(el => {
    observer.observe(el);
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 300) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Service card interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Gallery masonry layout initialization
function initMasonry() {
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;

    const items = gallery.querySelectorAll('.gallery-item');
    let columns = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;

    // Calculate positions
    const columnHeights = new Array(columns).fill(0);
    const gap = 20;

    items.forEach((item, index) => {
        const column = index % columns;
        const x = column * (100 / columns);
        const y = columnHeights[column];

        item.style.position = 'absolute';
        item.style.left = `${x}%`;
        item.style.top = `${y}px`;
        item.style.width = `calc(${100 / columns}% - ${gap}px)`;

        // Update column height
        columnHeights[column] += item.offsetHeight + gap;
    });

    // Set container height
    gallery.style.height = `${Math.max(...columnHeights)}px`;
}

// Initialize masonry on load and resize
window.addEventListener('load', initMasonry);
window.addEventListener('resize', debounce(initMasonry, 250));

// Form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Show success message
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.backgroundColor = '#27ae60';

            // Reset form
            contactForm.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// Parallax effect for hero background
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.backgroundPositionY = `${parallax}px`;
    });
}

// Utility function: debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize first testimonial
    if (testimonials.length > 0) {
        showTestimonial(0);
    }

    // Add loaded class for initial animations
    document.body.classList.add('loaded');

    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Performance optimization: Request idle callback for non-critical tasks
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Initialize analytics or other non-critical features
        console.log('Handy Jimmy website loaded successfully');
    });
}