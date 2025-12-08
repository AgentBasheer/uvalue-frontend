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
// MODERN TESTIMONIALS GRID FUNCTIONALITY
// =========================================
let currentFilter = 'all';
let testimonialCards = [];
let filterButtons = [];

// Initialize testimonials grid
function initTestimonialsGrid() {
    testimonialCards = document.querySelectorAll('.testimonial-card');
    filterButtons = document.querySelectorAll('.filter-btn');
    
    if (testimonialCards.length === 0) return;
    
    // Initialize filter functionality
    initTestimonialFilters();
    
    // Initialize animations
    initTestimonialAnimations();
    
    // Initialize load more functionality
    initLoadMore();
    
    // Add hover effects and micro-interactions
    addTestimonialInteractions();
}

// Filter testimonials by category
function initTestimonialFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter testimonials
            filterTestimonials(filter);
            currentFilter = filter;
        });
    });
}

function filterTestimonials(category) {
    const grid = document.getElementById('testimonials-grid');
    const featuredCard = document.querySelector('.testimonial-card.featured');
    const isFeaturedVisible = featuredCard && (category === 'all' || featuredCard.getAttribute('data-category') === category);
    
    // Adjust grid layout based on featured card visibility
    if (featuredCard) {
        if (isFeaturedVisible) {
            featuredCard.style.display = 'grid';
            featuredCard.style.gridColumn = 'span 2';
        } else {
            featuredCard.style.display = 'none';
        }
    }
    
    testimonialCards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        const isFeatured = card.classList.contains('featured');
        const isHidden = card.classList.contains('hidden');
        
        // Skip cards that are still hidden (not loaded yet)
        if (isHidden && category === 'all') {
            card.style.display = 'none';
            return;
        }
        
        if ((category === 'all' || cardCategory === category) && (!isFeatured || isFeaturedVisible)) {
            // Show card with animation
            if (!isFeatured) {
                card.style.display = 'flex'; // Use flex for regular cards to maintain original layout
                card.style.flexDirection = 'column';
                // Reset any grid properties that might have been applied
                card.style.gridColumn = '';
                card.style.gridRow = '';
            }
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        } else if (!isFeatured) {
            // Hide non-featured card
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Reinitialize animations for visible cards
    setTimeout(() => {
        initTestimonialAnimations();
    }, 400);
}

// Add entrance animations to testimonials
function initTestimonialAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.style.display !== 'none') {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe visible testimonial cards
    testimonialCards.forEach(card => {
        if (card.style.display !== 'none') {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(card);
        }
    });
}

// Add interactive hover effects and micro-interactions
function addTestimonialInteractions() {
    testimonialCards.forEach(card => {
        // Add tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Reduce tilt effect for featured cards
            const isFeatured = card.classList.contains('featured');
            const tiltMultiplier = isFeatured ? 0.3 : 1;
            
            const rotateX = (y - centerY) / 20 * tiltMultiplier;
            const rotateY = (centerX - x) / 20 * tiltMultiplier;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
        
        // Add click to expand functionality for featured cards
        if (card.classList.contains('featured')) {
            card.addEventListener('click', () => {
                toggleFeaturedCard(card);
            });
        }
    });
}

// Toggle expanded view for featured testimonial
function toggleFeaturedCard(card) {
    const isExpanded = card.classList.contains('expanded');
    
    if (isExpanded) {
        card.classList.remove('expanded');
        card.style.maxHeight = '';
    } else {
        card.classList.add('expanded');
        card.style.maxHeight = card.scrollHeight + 'px';
    }
}

// Load more testimonials functionality
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Show loading state
            loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;
            
            // Show all hidden testimonials at once
            const hiddenCards = document.querySelectorAll('.testimonial-card.hidden');
            
            hiddenCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('hidden');
                    const isFeatured = card.classList.contains('featured');
                    
                    // Only show if it's not featured or if it matches current filter
                    if (!isFeatured || (currentFilter === 'all' || card.getAttribute('data-category') === currentFilter)) {
                        if (isFeatured) {
                            card.style.display = 'grid';
                            card.style.gridColumn = 'span 2';
                        } else {
                            card.style.display = 'flex'; // Use flex for regular cards
                            card.style.flexDirection = 'column';
                            // Reset any grid properties
                            card.style.gridColumn = '';
                            card.style.gridRow = '';
                        }
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }
                }, index * 100);
            });
            
            // Hide the button permanently after showing all testimonials
            setTimeout(() => {
                loadMoreBtn.style.display = 'none';
            }, hiddenCards.length * 100 + 500);
        });
    }
}

// Add keyboard navigation for filter buttons
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && document.activeElement.classList.contains('filter-btn')) {
        // Allow tab navigation through filters
        return;
    }
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn) {
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

// Add search functionality for testimonials
function initTestimonialSearch() {
    const searchInput = document.getElementById('testimonial-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            testimonialCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const isVisible = text.includes(searchTerm);
                
                if (isVisible) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
}

// Initialize hidden testimonials on page load
function initHiddenTestimonials() {
    // Show only featured + 2 more testimonials initially
    const allCards = document.querySelectorAll('.testimonial-card');
    const featuredCard = document.querySelector('.testimonial-card.featured');
    let visibleCount = 0;
    
    allCards.forEach((card, index) => {
        const isFeatured = card.classList.contains('featured');
        
        // Set initial display properties based on card type
        if (isFeatured) {
            card.style.display = 'grid';
            card.style.gridColumn = 'span 2';
            visibleCount++;
        } else {
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gridColumn = '';
            card.style.gridRow = '';
            
            // Show only 2 non-featured cards initially
            if (visibleCount < 3) { // 1 featured + 2 regular = 3 total
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none'; // Hide completely initially
            }
        }
    });
    
    // Initialize load more button
    const hiddenCount = document.querySelectorAll('.testimonial-card.hidden').length;
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn && hiddenCount > 0) {
        loadMoreBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Load More Testimonials';
        loadMoreBtn.style.display = 'inline-flex'; // Ensure button is visible
    } else if (loadMoreBtn && hiddenCount === 0) {
        // Hide button if there are no hidden testimonials
        loadMoreBtn.style.display = 'none';
    }
}

// Initialize testimonials grid when DOM is loaded
function initTestimonialsCarousel() {
    initHiddenTestimonials();
    initTestimonialsGrid();
    initTestimonialSearch();
}
