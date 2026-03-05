// Vérifier l'authentification et que c'est un CEO
if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
}

if (!auth.isCEO()) {
    window.location.href = 'index.html';
}

// Helper function to add random delay (800-1500ms for realism)
function getRandomDelay() {
    return Math.random() * 700 + 800; // 800-1500ms
}

// Helper to simulate network delay
async function simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, getRandomDelay()));
}

// Loading spinner management for users
function showUsersLoader(message = 'Chargement...') {
    let loader = document.getElementById('usersLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'usersLoader';
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
}

function hideUsersLoader() {
    const loader = document.getElementById('usersLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', () => {
    displayCreatedUsers();
    setupFormHandler();
    setupProfileMenu();
});

// Setup menu profil
function setupProfileMenu() {
    const logoutBtn = document.getElementById('profileLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.logout();
            window.location.href = 'login.html';
        });
    }

    document.addEventListener('click', (e) => {
        const menu = document.getElementById('profileMenu');
        const profile = document.getElementById('profileDiv');
        if (menu && profile && !e.target.closest('.navbar-profile-container')) {
            menu.classList.remove('active');
        }
    });
}

// Setup du formulaire de création
function setupFormHandler() {
    const form = document.getElementById('createUserForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        createNewUser();
    });
}

// Créer un nouvel utilisateur
function createNewUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    const messageDiv = document.getElementById('createUserMessage');

    if (!username || !password) {
        showMessage(messageDiv, 'All fields required', 'error');
        return;
    }

    showUsersLoader('Création de l\'utilisateur...');
    
    // Simulate network delay
    setTimeout(() => {
        const result = auth.createUser(username, password, role);

        if (result.success) {
            showMessage(messageDiv, result.message, 'success');
            document.getElementById('createUserForm').reset();
            hideUsersLoader();
            setTimeout(() => {
                displayCreatedUsers();
            }, 300);
        } else {
            showMessage(messageDiv, result.message, 'error');
            hideUsersLoader();
        }
    }, getRandomDelay());
}

// Afficher les utilisateurs créés
function displayCreatedUsers() {
    showUsersLoader('Chargement des utilisateurs...');
    
    const tbody = document.getElementById('usersTableBody');
    const createdUsers = auth.getCreatedUsers();
    const allEmployees = DATABASE.getActiveEmployees();

    // Simulate network delay
    setTimeout(() => {
        // Afficher tous les employés de la base de données
        tbody.innerHTML = allEmployees.map(emp => `
            <tr>
                <td><strong>${emp.firstName} ${emp.lastName}</strong></td>
                <td>${emp.username}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td><span class="status-badge active">${emp.status}</span></td>
            </tr>
        `).join('');
        
        hideUsersLoader();
    }, getRandomDelay());
}

// Afficher les messages
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message show ${type}`;
    setTimeout(() => {
        element.className = 'form-message';
    }, 3000);
}
