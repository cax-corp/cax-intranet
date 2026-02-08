// Tout initialiser dans DOMContentLoaded pour éviter les conflits de timing
document.addEventListener('DOMContentLoaded', () => {
    
    // GESTION DE LA PAGE DE CONNEXION
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // Vérifier le nom d'utilisateur et le mot de passe
            if (auth.login(username, password)) {
                // Afficher le message de succès
                successMessage.textContent = 'Connexion réussie ! Redirection en cours...';
                successMessage.classList.add('show');

                // Rediriger vers l'intranet après 1.2 secondes
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1200);
            } else {
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
                e.preventDefault();
                
                const sectionName = this.getAttribute('data-section');
                
                // Retirer la classe active de tous les liens et sections
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Ajouter la classe active au lien et à la section cliqués
                this.classList.add('active');
                if (document.getElementById(sectionName)) {
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
            
            // Get user profile for avatar
            let profileHTML = '';
            if (typeof profileManager !== 'undefined') {
                const userProfile = profileManager.getProfile(username);
                if (userProfile && userProfile.avatar) {
                    profileHTML += `<img src="${userProfile.avatar}" alt="Avatar" class="navbar-avatar">`;
                }
            }
            
            // Add username text
            const displayText = isCEO ? `${username} (CEO)` : username;
            profileHTML += `<span class="navbar-username">${displayText}</span>`;
            
            profileDiv.innerHTML = profileHTML;
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