// MODAL FUNCTIONALITY
const modal = {
    open: function(type) {
        document.getElementById(type + '-modal').classList.add('active');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    },
    close: function(type) {
        document.getElementById(type + '-modal').classList.remove('active');
        // Restore body scroll
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
    // Intersection Observer for service cards
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

    // Observe all service cards
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
        
        // For touch devices, add click event to toggle dropdown
        if ('ontouchstart' in window) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.querySelector('.dropdown-menu').style.display = 'none';
                    }
                });
                
                // Toggle current dropdown
                if (menu.style.display === 'block') {
                    menu.style.display = 'none';
                } else {
                    menu.style.display = 'block';
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    menu.style.display = 'none';
                }
            });
        }
    });
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    initScrollAnimations();
    // Initialize dropdown menu
    initDropdownMenu();
    // Initialize testimonials carousel
    initTestimonialsCarousel();
    // No router initialization needed - using standard page navigation
});
// =========================================
// MODERN TESTIMONIALS GRID FUNCTIONALITY (REFACTORED)
// =========================================

const testimonialState = {
    filter: 'all',
    itemsToShow: 3,     // Start with 3 items (1 featured + 2 regular)
    increment: 3,       // How many to add when clicking "Load More"
    cards: [],          // Will hold DOM elements
    buttons: []         // Will hold Filter buttons
};

function initTestimonialsGrid() {
    testimonialState.cards = Array.from(document.querySelectorAll('.testimonial-card'));
    testimonialState.buttons = document.querySelectorAll('.filter-btn');
    
    if (testimonialState.cards.length === 0) return;

    // 1. Initialize Filter Buttons
    testimonialState.buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update UI
            testimonialState.buttons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Update State
            testimonialState.filter = e.currentTarget.getAttribute('data-filter');
            testimonialState.itemsToShow = 3; // Reset limit when changing filter
            
            // Render
            renderTestimonials(true); // true = animate reset
        });
    });

    // 2. Initialize Load More Button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;

            setTimeout(() => {
                testimonialState.itemsToShow += testimonialState.increment;
                renderTestimonials(false); // false = just append animation
                loadMoreBtn.disabled = false;
            }, 600); // Artificial delay for effect
        });
    }

    // 3. Initial Render
    renderTestimonials(true);
    initTestimonialSearch();
}

/**
 * The Core Logic: Decides what is shown/hidden based on state
 * @param {boolean} isHardReset - If true, triggers entrance animations for all items
 */
function renderTestimonials(isHardReset) {
    let visibleCount = 0;
    let hiddenMatches = 0;

    testimonialState.cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const isFeatured = card.classList.contains('featured');
        
        // 1. Check if card matches current filter
        const matchesFilter = testimonialState.filter === 'all' || category === testimonialState.filter;

        if (matchesFilter) {
            // 2. Check if we are within the limit
            if (visibleCount < testimonialState.itemsToShow) {
                // SHOW CARD
                const wasHidden = card.style.display === 'none' || card.classList.contains('hidden');
                
                card.classList.remove('hidden');
                
                // Restore specific display types
                if (isFeatured) {
                    card.style.display = 'grid';
                    card.style.gridColumn = 'span 2';
                } else {
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.gridColumn = ''; // Reset grid prop
                }

                // Animation Logic
                if (wasHidden || isHardReset) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    // Staggered animation based on position
                    setTimeout(() => {
                        card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, visibleCount * 100); // Stagger delay
                }

                visibleCount++;
            } else {
                // HIDE CARD (Exceeds limit)
                hideCard(card);
                hiddenMatches++;
            }
        } else {
            // HIDE CARD (Does not match filter)
            hideCard(card);
        }
    });

    updateLoadMoreButton(hiddenMatches);
    addTestimonialInteractions(); // Re-bind hover effects
}

// Helper to hide card cleanly
function hideCard(card) {
    card.classList.add('hidden');
    card.style.display = 'none';
    card.style.opacity = '0';
}

// Helper to update Load More Button State
function updateLoadMoreButton(remainingCount) {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;

    if (remainingCount > 0) {
        loadMoreBtn.style.display = 'inline-flex';
        loadMoreBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Load More (${remainingCount})`;
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Search Functionality (Integrated with State)
function initTestimonialSearch() {
    const searchInput = document.getElementById('testimonial-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        if (term.length > 0) {
            // Override standard filter logic for search
            testimonialState.cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(term)) {
                    card.classList.remove('hidden');
                    card.style.display = card.classList.contains('featured') ? 'grid' : 'flex';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                } else {
                    hideCard(card);
                }
            });
            // Hide load more during search
            const btn = document.querySelector('.load-more-btn');
            if(btn) btn.style.display = 'none';
        } else {
            // Restore standard view
            renderTestimonials(true);
        }
    });
}

// Tilt and Micro-interactions (Preserved from original)
function addTestimonialInteractions() {
    testimonialState.cards.forEach(card => {
        // Remove old listeners to prevent stacking if function called multiple times
        // (Note: In production, better to use named functions, but this simple overwrite works for this context)
        card.onmousemove = (e) => {
            if(card.style.display === 'none') return;
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
        };
        
        card.onmouseleave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        };

        if (card.classList.contains('featured')) {
            card.onclick = () => {
                card.classList.toggle('expanded');
                card.style.maxHeight = card.classList.contains('expanded') ? card.scrollHeight + 'px' : '';
            };
        }
    });
}

// Init Wrapper
function initTestimonialsCarousel() {
    initTestimonialsGrid();
}
