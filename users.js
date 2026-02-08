// Vérifier l'authentification et que c'est un CEO
if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
}

if (!auth.isCEO()) {
    window.location.href = 'index.html';
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

    const result = auth.createUser(username, password, role);

    if (result.success) {
        showMessage(messageDiv, result.message, 'success');
        document.getElementById('createUserForm').reset();
        setTimeout(() => {
            displayCreatedUsers();
        }, 500);
    } else {
        showMessage(messageDiv, result.message, 'error');
    }
}

// Afficher les utilisateurs créés
function displayCreatedUsers() {
    const tbody = document.getElementById('usersTableBody');
    const createdUsers = auth.getCreatedUsers();
    const allEmployees = DATABASE.getActiveEmployees();

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
}

// Afficher les messages
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message show ${type}`;
    setTimeout(() => {
        element.className = 'form-message';
    }, 3000);
}
