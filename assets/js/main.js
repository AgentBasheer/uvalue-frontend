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
    // No router initialization needed - using standard page navigation
});