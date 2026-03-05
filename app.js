// Tout initialiser dans DOMContentLoaded pour éviter les conflits de timing
document.addEventListener('DOMContentLoaded', () => {
    
    // Helper functions for loaders
    window.getRandomDelay = function() {
        return Math.random() * 700 + 800; // 800-1500ms
    };
    
    window.simulateDelay = async function() {
        return new Promise(resolve => setTimeout(resolve, getRandomDelay()));
    };
    
    window.showLoginLoader = function(message = 'Connexion...') {
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
    
    // GESTION DE LA PAGE DE CONNEXION
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            showLoginLoader('Vérification des identifiants...');
            
            // Simulate network delay
            await simulateDelay();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // Vérifier le nom d'utilisateur et le mot de passe
            if (auth.login(username, password)) {
                showLoginLoader('Connexion réussie...');
                
                // Afficher le message de succès
                successMessage.textContent = 'Connexion réussie ! Redirection en cours...';
                successMessage.classList.add('show');

                // Attendre un peu avant de rediriger
                await simulateDelay();
                
                // Rediriger vers l'intranet
                window.location.href = 'index.html';
            } else {
                hideLoginLoader();
                
                // Afficher le message d'erreur
                errorMessage.textContent = 'Identifiant ou mot de passe incorrect. Veuillez réessayer.';
                errorMessage.classList.add('show');
                passwordInput.value = '';
                usernameInput.focus();

                // Masquer l'erreur après 4 secondes
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 4000);
            }
        });
    }

    // GESTION DE L'INTRANET PRINCIPAL - NAVIGATION
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length > 0) {
        const sections = document.querySelectorAll('.section');

        // Gestion de la navigation entre les sections
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const sectionName = this.getAttribute('data-section');
                const href = this.getAttribute('href');
                
                // Si c'est un lien vers une autre page (contient .html ou /), naviguer normalement
                if (href && href.includes('.html')) {
                    e.preventDefault();
                    window.location.href = href;
                    return;
                }
                
                // Sinon, gérer comme une section (href commence par #)
                e.preventDefault();
                
                // Retirer la classe active de tous les liens et sections
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Ajouter la classe active au lien et à la section cliqués
                this.classList.add('active');
                if (sectionName && document.getElementById(sectionName)) {
                    document.getElementById(sectionName).classList.add('active');
                }
            });
        });

        // Initialiser la première section
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
            if (sections.length > 0) {
                sections[0].classList.add('active');
            }
        }
    }

    // GESTION DU PROFIL ET MENU
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

    // Click sur profil pour toggler le menu
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
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                auth.logout();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 100);
            }
        });
    }

    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (profileMenu && !e.target.closest('.navbar-profile-container')) {
            profileMenu.classList.remove('active');
        }
    });

    // GESTION DES BOUTONS ET LIENS DU DASHBOARD
    
    // Bouton Support
    const supportBtn = document.getElementById('supportBtn');
    if (supportBtn) {
        supportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'ticket.html';
        });
    }

    // Lien User Management (CEO only)
    const usersLink = document.querySelector('.users-link-dashboard');
    if (usersLink) {
        if (auth.isCEO()) {
            usersLink.style.display = 'block';
            usersLink.addEventListener('click', () => {
                window.location.href = 'users.html';
            });
        }
    }

    // Lien Statistics
    const statsLink = document.querySelector('.stats-link-dashboard');
    if (statsLink) {
        statsLink.addEventListener('click', () => {
            window.location.href = 'statistics.html';
        });
    }

    // Lien HR
    const hrLink = document.querySelector('.hr-link-dashboard');
    if (hrLink) {
        hrLink.addEventListener('click', () => {
            window.location.href = 'hr.html';
        });
    }

    // Lien Locations
    const locationsLink = document.querySelector('.locations-link-dashboard');
    if (locationsLink) {
        locationsLink.addEventListener('click', () => {
            window.location.href = 'locations.html';
        });
    }
});