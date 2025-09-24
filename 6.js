// Gallery Filter Functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Filter functionality
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.remove('hidden');
                    }, 10);
                } else {
                    const itemCategory = item.getAttribute('data-category');

                    if (itemCategory === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.classList.remove('hidden');
                        }, 10);
                    } else {
                        item.classList.add('hidden');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });

    // Before/After Slider Functionality
    const sliderControls = document.querySelectorAll('.slider-control');

    sliderControls.forEach(slider => {
        let isDragging = false;
        const container = slider.closest('.before-after-container');
        const beforeSide = container.querySelector('.before-side');

        // Mouse events
        slider.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        // Touch events for mobile
        slider.addEventListener('touchstart', startDragging);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', stopDragging);

        function startDragging(e) {
            isDragging = true;
            container.style.cursor = 'ew-resize';
            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            const rect = container.getBoundingClientRect();
            let x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            let position = ((x - rect.left) / rect.width) * 100;

            // Limit position between 5% and 95%
            position = Math.max(5, Math.min(95, position));

            // Update slider position
            slider.style.left = position + '%';

            // Update before side clip-path
            beforeSide.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
        }

        function stopDragging() {
            isDragging = false;
            container.style.cursor = 'default';
        }
    });

    // Load More Button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Simulate loading more items
            loadMoreBtn.textContent = 'Loading...';
            loadMoreBtn.disabled = true;

            setTimeout(() => {
                // Here you would typically load more items from a server
                // For demo, we'll just show a message
                loadMoreBtn.textContent = 'No More Projects';
                loadMoreBtn.style.opacity = '0.5';
                loadMoreBtn.style.cursor = 'not-allowed';
            }, 1500);
        });
    }

    // Gallery Card Click - Open Lightbox (optional)
    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open lightbox if clicking on slider
            if (e.target.closest('.slider-control')) return;

            // Create and show lightbox
            createLightbox(card);
        });
    });

    function createLightbox(card) {
        // Remove existing lightbox if any
        const existingLightbox = document.querySelector('.lightbox');
        if (existingLightbox) {
            existingLightbox.remove();
        }

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';

        const content = document.createElement('div');
        content.className = 'lightbox-content';

        // Clone the card content
        const cardClone = card.cloneNode(true);
        cardClone.style.transform = 'none';
        cardClone.style.cursor = 'default';

        // Make the before/after container larger in lightbox
        const beforeAfter = cardClone.querySelector('.before-after-container');
        if (beforeAfter) {
            beforeAfter.style.height = '500px';
        }

        content.appendChild(cardClone);

        // Add close button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
            setTimeout(() => lightbox.remove(), 300);
        });

        content.appendChild(closeBtn);
        lightbox.appendChild(content);
        document.body.appendChild(lightbox);

        // Activate lightbox
        setTimeout(() => lightbox.classList.add('active'), 10);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                setTimeout(() => lightbox.remove(), 300);
            }
        });

        // Close on ESC key
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                setTimeout(() => lightbox.remove(), 300);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        // Re-initialize slider for cloned element
        const newSlider = cardClone.querySelector('.slider-control');
        if (newSlider) {
            initializeSlider(newSlider);
        }
    }

    function initializeSlider(slider) {
        let isDragging = false;
        const container = slider.closest('.before-after-container');
        const beforeSide = container.querySelector('.before-side');

        slider.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        function startDragging(e) {
            isDragging = true;
            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            const rect = container.getBoundingClientRect();
            let position = ((e.clientX - rect.left) / rect.width) * 100;
            position = Math.max(5, Math.min(95, position));

            slider.style.left = position + '%';
            beforeSide.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
        }

        function stopDragging() {
            isDragging = false;
        }
    }

    // Lazy Loading for Images (when real images are added)
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Animate gallery items on scroll
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                animateObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Initial animation setup
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        animateObserver.observe(item);
    });
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});