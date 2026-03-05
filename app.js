// Initialize everything in DOMContentLoaded to avoid timing conflicts
document.addEventListener('DOMContentLoaded', () => {
    
    // Helper functions for loaders
    window.getRandomDelay = function() {
        return Math.random() * 700 + 800; // 800-1500ms
    };
    
    window.simulateDelay = async function() {
        return new Promise(resolve => setTimeout(resolve, getRandomDelay()));
    };
    
    window.showLoginLoader = function(message = 'Logging in...') {
        let loader = document.getElementById('loginLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loginLoader';
            loader.innerHTML = `
                <div class="loader-overlay">
                    <div class="loader-spinner">
                        <div class="loader-circle"></div>
                        <p>${message}</p>
                    </div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    };
    
    window.hideLoginLoader = function() {
        const loader = document.getElementById('loginLoader');
        if (loader) {
            loader.style.display = 'none';
        }
    };
    
    // LOGIN PAGE MANAGEMENT
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            showLoginLoader('Verifying credentials...');
            
            // Simulate network delay
            await simulateDelay();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // Check username and password
            if (auth.login(username, password)) {
                showLoginLoader('Login successful...');
                
                // Show success message
                successMessage.textContent = 'Login successful! Redirecting...';
                successMessage.classList.add('show');

                // Wait a moment before redirecting
                await simulateDelay();
                
                // Redirect to intranet
                window.location.href = 'index.html';
            } else {
                hideLoginLoader();
                
                // Show error message
                errorMessage.textContent = 'Invalid username or password. Please try again.';
                errorMessage.classList.add('show');
                passwordInput.value = '';
                usernameInput.focus();

                // Hide error after 4 seconds
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 4000);
            }
        });
    }

    // MAIN INTRANET MANAGEMENT - NAVIGATION
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length > 0) {
        const sections = document.querySelectorAll('.section');

        // Navigation between sections
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const sectionName = this.getAttribute('data-section');
                const href = this.getAttribute('href');
                
                // If it's a link to another page (contains .html or /), navigate normally
                if (href && href.includes('.html')) {
                    e.preventDefault();
                    window.location.href = href;
                    return;
                }
                
                // Otherwise, manage as a section (href starts with #)
                e.preventDefault();
                
                // Remove active class from all links and sections
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked link and section
                this.classList.add('active');
                if (sectionName && document.getElementById(sectionName)) {
                    document.getElementById(sectionName).classList.add('active');
                }
            });
        });

        // Initialize first section
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
            if (sections.length > 0) {
                sections[0].classList.add('active');
            }
        }
    }

    // PROFILE AND MENU MANAGEMENT
    const profileDiv = document.getElementById('profileDiv');
    const profileMenu = document.getElementById('profileMenu');
    const profileLogout = document.getElementById('profileLogout');

    if (profileDiv) {
        const username = auth.getUsername();
        if (username) {
            const isCEO = auth.isCEO && auth.isCEO();
            
            // Display username directly - skip async profile loading to avoid Render timeout
            const displayText = isCEO ? `${username} (CEO)` : username;
            profileDiv.innerHTML = `<span class="navbar-username">${displayText}</span>`;
        }
    }

    // Click on profile to toggle menu
    if (profileDiv) {
        profileDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            if (profileMenu) {
                profileMenu.classList.toggle('active');
            }
        });
    }

    if (profileLogout) {
        profileLogout.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Are you sure you want to logout?')) {
                auth.logout();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 100);
            }
        });
    }

    // Close menu if clicking elsewhere
    document.addEventListener('click', (e) => {
        if (profileMenu && !e.target.closest('.navbar-profile-container')) {
            profileMenu.classList.remove('active');
        }
    });

    // DASHBOARD BUTTONS AND LINKS MANAGEMENT
    
    // Support button
    const supportBtn = document.getElementById('supportBtn');
    if (supportBtn) {
        supportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'ticket.html';
        });
    }

    // User Management link (CEO only)
    const usersLink = document.querySelector('.users-link-dashboard');
    if (usersLink) {
        if (auth.isCEO()) {
            usersLink.style.display = 'block';
            usersLink.addEventListener('click', () => {
                window.location.href = 'users.html';
            });
        }
    }

    // Statistics link
    const statsLink = document.querySelector('.stats-link-dashboard');
    if (statsLink) {
        statsLink.addEventListener('click', () => {
            window.location.href = 'statistics.html';
        });
    }

    // HR link
    const hrLink = document.querySelector('.hr-link-dashboard');
    if (hrLink) {
        hrLink.addEventListener('click', () => {
            window.location.href = 'hr.html';
        });
    }

    // Locations link
    const locationsLink = document.querySelector('.locations-link-dashboard');
    if (locationsLink) {
        locationsLink.addEventListener('click', () => {
            window.location.href = 'locations.html';
        });
    }
});