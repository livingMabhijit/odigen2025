// Global toggle menu function
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const hamburger = document.querySelector('.hamburger');
    
    // Toggle menu state
    if (navMenu.classList.contains('active')) {
        // Close menu
        navMenu.classList.remove('active');
        body.classList.remove('nav-open');
        // Add a small delay before showing the hamburger button again
        setTimeout(() => {
            hamburger.style.opacity = '1';
            hamburger.style.visibility = 'visible';
        }, 300); // Match this with the CSS transition duration
    } else {
        // Open menu
        navMenu.classList.add('active');
        body.classList.add('nav-open');
    }
}

// Initialize navigation functionality
function initNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    // Menu toggle functionality
    const hamburger = document.querySelector('.hamburger');
    
    // Add click event listeners to hamburger and close buttons
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        // Check if menu is open
        if (!navMenu.classList.contains('active')) return;
        
        if (!e.target.closest('.nav-content') && !e.target.closest('.hamburger')) {
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

    // Device detection and app store redirection
    function detectDeviceAndRedirect() {
        // iOS detection
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        // Android detection
        const isAndroid = /Android/.test(navigator.userAgent);
        
        if (isIOS) {
            window.location.href = 'https://apps.apple.com/us/app/jazzee-edtech/id6743542317';
        } else if (isAndroid) {
            window.location.href = 'https://play.google.com/store/apps/details?id=com.jazzeetechnologies.jazzee_edtech';
        } else {
            // Fallback for desktop or unknown devices - open App Store by default
            window.location.href = 'https://play.google.com/store/apps/details?id=com.jazzeetechnologies.jazzee_edtech';
        }
    }

    // Add click event listener to Apply Now button
    const applyNowBtn = document.querySelector('.apply-now-btn');
    if (applyNowBtn) {
        applyNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            detectDeviceAndRedirect();
        });
    }
});
