// Initialize navigation functionality
function initNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    let menuOpen = false;

    // Menu toggle functionality
    const hamburger = document.querySelector('.hamburger');
    
    window.toggleMenu = function() {
        menuOpen = !menuOpen;
        if (menuOpen) {
            navMenu.classList.add('active');
            body.classList.add('nav-open');
        } else {
            navMenu.classList.remove('active');
            body.classList.remove('nav-open');
            // Add a small delay before showing the hamburger button again
            setTimeout(() => {
                hamburger.style.opacity = '1';
                hamburger.style.visibility = 'visible';
            }, 300); // Match this with the CSS transition duration
        }
    };

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuOpen) return;
        
        if (!e.target.closest('.nav-content') && !e.target.closest('.hamburger')) {
            menuOpen = false;
            navMenu.classList.remove('active');
            body.classList.remove('nav-open');
            // Add a small delay before showing the hamburger button again
            setTimeout(() => {
                hamburger.style.opacity = '1';
                hamburger.style.visibility = 'visible';
            }, 300); // Match this with the CSS transition duration
        }
    });

    // Prevent clicks inside menu from closing it
    const navContent = document.querySelector('.nav-content');
    if (navContent) {
        navContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Set active nav link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath === '/' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();

    // Sponsor Navigation
    const sponsors = [
        { name: 'Sponsor 1' },
        { name: 'Sponsor 2' },
        { name: 'Sponsor 3' },
        { name: 'Sponsor 4' },
        { name: 'Sponsor 5' },
        { name: 'Sponsor 6' }
    ];

    const sponsorGrid = document.querySelector('.sponsor-grid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (sponsorGrid && prevBtn && nextBtn) {
        let currentSponsorIndex = 0;

        function updateSponsors() {
            const sponsorElements = Array.from(sponsorGrid.children);
            for (let i = 0; i < 3; i++) {
                const sponsorIndex = (currentSponsorIndex + i) % sponsors.length;
                sponsorElements[i].querySelector('p').textContent = sponsors[sponsorIndex].name;
            }

            // Update button states
            prevBtn.style.opacity = currentSponsorIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentSponsorIndex >= sponsors.length - 3 ? '0.5' : '1';
        }

        prevBtn.addEventListener('click', () => {
            if (currentSponsorIndex > 0) {
                currentSponsorIndex--;
                updateSponsors();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentSponsorIndex < sponsors.length - 3) {
                currentSponsorIndex++;
                updateSponsors();
            }
        });

        // Initialize sponsors
        updateSponsors();
    }

    // Registration Form
    const form = document.getElementById('registrationForm');
    if (form) {
        // Phone number validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                    e.target.value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                }
            });
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic validation
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            const phone = document.getElementById('phone').value.replace(/\D/g, '');
            if (phone.length !== 10) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }

            // Get resume file
            const resumeFile = document.getElementById('resume').files[0];
            if (!resumeFile) {
                alert('Please upload your resume');
                return;
            }

            // Create FormData object
            const formData = new FormData(form);

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Registration successful! Please check your email for confirmation details.');
                    form.reset();
                } else {
                    const error = await response.json();
                    alert(`Registration failed: ${error.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration. Please try again later.');
            }
        });
    }
});
