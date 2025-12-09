// MODAL FUNCTIONALITY
const modal = {
    open: function(type) {
        document.getElementById(type + '-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    close: function(type) {
        document.getElementById(type + '-modal').classList.remove('active');
        document.body.style.overflow = 'auto';
    },
    submit: function(type) {
        const el = document.getElementById(type + '-modal');
        const btn = el.querySelector('button[type="submit"]');
        const original = btn.innerText;
        btn.innerText = "Sent Successfully!";
        btn.style.background = "#10b981";
        btn.disabled = true;
        
        setTimeout(() => {
            this.close(type);
            btn.innerText = original;
            btn.removeAttribute('style');
            btn.disabled = false;
            const form = el.querySelector('form');
            if (form) form.reset();
        }, 2000);
    }
};

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            const modalType = activeModal.id.replace('-modal', '');
            modal.close(modalType);
        }
    }
});

// Close modal on backdrop click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            const modalType = overlay.id.replace('-modal', '');
            modal.close(modalType);
        }
    });
});

// Scroll to About section function
function scrollToAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Scroll to Top Monitor
window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTopBtn');
    if (window.scrollY > 400) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
});

// Enhanced scroll animations for service cards
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-entry');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
}

// Dropdown menu functionality
function initDropdownMenu() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if ('ontouchstart' in window) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.querySelector('.dropdown-menu').style.display = 'none';
                    }
                });
                menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
            });
            
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    menu.style.display = 'none';
                }
            });
        }
    });
}

// =========================================
// MODERN TESTIMONIALS GRID FUNCTIONALITY (REFACTORED)
// =========================================

// State Management
const testimonialState = {
    filter: 'all',
    searchQuery: '',
    expanded: false, // false = show initial limit, true = show all matching
    initialLimit: 3  // Number of cards to show initially
};

let testimonialCards = [];
let filterButtons = [];
let loadMoreBtn = null;

// Initialize testimonials grid
function initTestimonialsGrid() {
    testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
    filterButtons = document.querySelectorAll('.filter-btn');
    loadMoreBtn = document.querySelector('.load-more-btn');
    const searchInput = document.getElementById('testimonial-search');
    
    if (testimonialCards.length === 0) return;

    // 1. Setup Filter Buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update Active Class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update State
            testimonialState.filter = button.getAttribute('data-filter');
            // Optional: Reset expansion on filter change to keep list manageable
            // testimonialState.expanded = false; 
            
            renderGrid();
        });
    });

    // 2. Setup Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            testimonialState.searchQuery = e.target.value.toLowerCase();
            renderGrid();
        });
    }

    // 3. Setup Load More
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            
            // Fake loading delay for UX
            setTimeout(() => {
                testimonialState.expanded = true;
                renderGrid();
            }, 500);
        });
    }

    // 4. Setup Interactions (Tilt/Click)
    addTestimonialInteractions();

    // 5. Initial Render
    renderGrid();
}

/**
 * Core Render Function
 * Decides which cards to show based on Filter, Search, and Limit
 */
function renderGrid() {
    let visibleCount = 0;
    
    // 1. Filter the list based on Category and Search
    const matchingCards = testimonialCards.filter(card => {
        const category = card.getAttribute('data-category');
        const text = card.textContent.toLowerCase();
        
        const matchesCategory = testimonialState.filter === 'all' || category === testimonialState.filter;
        const matchesSearch = testimonialState.searchQuery === '' || text.includes(testimonialState.searchQuery);
        
        return matchesCategory && matchesSearch;
    });

    // 2. Apply Visibility Logic
    testimonialCards.forEach(card => {
        // If card is in the matching list
        if (matchingCards.includes(card)) {
            // Check if we should show it based on limits
            const shouldShow = testimonialState.expanded || visibleCount < testimonialState.initialLimit;
            
            if (shouldShow) {
                showCard(card, visibleCount); // Pass index for staggered animation
                visibleCount++;
            } else {
                hideCard(card);
            }
        } else {
            hideCard(card);
        }
    });

    // 3. Update Load More Button Visibility
    updateLoadMoreButton(matchingCards.length, visibleCount);
}

// Helper: Show a card with animation
function showCard(card, index) {
    if (card.style.display === 'none') {
        // Restore layout
        card.style.display = ''; // Clears inline display, falls back to CSS (flex/grid)
        card.classList.remove('hidden');
        
        // Handle Featured layout specifically if needed
        if (card.classList.contains('featured')) {
            card.style.gridColumn = 'span 2'; // Ensure grid logic remains
        } else {
            card.style.gridColumn = '';
        }

        // Animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Staggered delay based on index relative to current render batch
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    }
}

// Helper: Hide a card
function hideCard(card) {
    if (card.style.display !== 'none') {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            // Only apply display:none if it hasn't been made visible again quickly
            if (card.style.opacity === '0') {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        }, 300);
    }
}

// Helper: Update Button State
function updateLoadMoreButton(totalMatching, currentlyVisible) {
    if (!loadMoreBtn) return;

    if (currentlyVisible < totalMatching) {
        loadMoreBtn.style.display = 'inline-flex';
        loadMoreBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Load More Testimonials';
        loadMoreBtn.disabled = false;
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Add interactive hover effects
function addTestimonialInteractions() {
    testimonialCards.forEach(card => {
        // Tilt Effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const isFeatured = card.classList.contains('featured');
            const tiltMultiplier = isFeatured ? 0.3 : 1;
            
            const rotateX = (y - centerY) / 20 * tiltMultiplier;
            const rotateY = (centerX - x) / 20 * tiltMultiplier;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
        
        // Expand/Collapse Featured Card Text
        if (card.classList.contains('featured')) {
            card.addEventListener('click', () => {
                card.classList.toggle('expanded');
                if(card.classList.contains('expanded')) {
                    card.style.maxHeight = card.scrollHeight + 'px';
                } else {
                    card.style.maxHeight = '';
                }
            });
        }
    });
}

// Keyboard navigation for filters
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn) {
            e.preventDefault();
            const buttons = Array.from(filterButtons);
            const currentIndex = buttons.indexOf(activeBtn);
            let newIndex;
            
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
            } else {
                newIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
            }
            
            buttons[newIndex].click();
            buttons[newIndex].focus();
        }
    }
});

// INIT
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initDropdownMenu();
    initTestimonialsGrid(); // Single entry point for testimonials
});