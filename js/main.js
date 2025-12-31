/**
 * Jack B. Lysander - Website JavaScript
 * Handles navigation, smooth scrolling, and basic interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const newsletterForm = document.getElementById('newsletter-form');
    const currentYearEl = document.getElementById('current-year');

    // Update current year
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Navigation scroll effect
    function handleScroll() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Newsletter form handling
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // Here you would typically send the email to your backend/service
            // For now, we'll just show a success message

            // Create success message
            const successMessage = document.createElement('p');
            successMessage.textContent = '¡Gracias por suscribirte! Te mantendré informado.';
            successMessage.style.color = '#c9a962';
            successMessage.style.marginTop = '1rem';

            // Replace form with success message
            this.innerHTML = '';
            this.appendChild(successMessage);

            // Log for development
            console.log('Newsletter subscription:', email);
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.section').forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        observer.observe(section);
    });

    // Active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const scrollPosition = window.scrollY + nav.offsetHeight + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // Parallax effect for hero (subtle)
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
            }
        });
    }

    // Console greeting for developers
    console.log('%c Jack B. Lysander ',
        'background: #0a0a0a; color: #c9a962; font-size: 20px; font-family: serif; padding: 10px 20px;'
    );
    console.log('%c Escritor ',
        'color: #888; font-size: 12px; font-family: sans-serif;'
    );
});
