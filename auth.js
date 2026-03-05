// Security configuration
const CONFIG = {
    // Users are now loaded from database.js
    USERS: {},
    SESSION_TIMEOUT: 60 * 60 * 1000 // 1 heure
};

// Load credentials from database
if (typeof DATABASE !== 'undefined') {
    CONFIG.USERS = DATABASE.getCredentials();
}

// Simple authentication management
class AuthManager {
    constructor() {
        this.sessionKey = 'intranetSession';
        this.timestampKey = 'intranetTimestamp';
        this.usersStorageKey = 'caxUsers';
    }

    isAuthenticated() {
        const session = sessionStorage.getItem(this.sessionKey);
        const timestamp = sessionStorage.getItem(this.timestampKey);
        
        if (!session || !timestamp) return false;

        const now = Date.now();
        if (now - parseInt(timestamp) > CONFIG.SESSION_TIMEOUT) {
            this.logout();
            return false;
        }

        // Renew the timestamp
        sessionStorage.setItem(this.timestampKey, now.toString());
        return true;
    }

    getUsername() {
        return sessionStorage.getItem('username') || '';
    }

    getUserRole() {
        const username = this.getUsername();
        return ['ceo', 'admin'].includes(username) ? username : 'user';
    }

    isCEO() {
        return this.getUsername() === 'ceo';
    }

    login(username, password) {
        const allUsers = this.getAllUsers();
        if (allUsers[username] && allUsers[username] === password) {
            sessionStorage.setItem(this.sessionKey, 'authenticated');
            sessionStorage.setItem('username', username);
            sessionStorage.setItem(this.timestampKey, Date.now().toString());
            return true;
        }
        return false;
    }

    logout() {
        sessionStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.timestampKey);
        sessionStorage.removeItem('username');
    }

    // Get all users (built-in + created + database)
    getAllUsers() {
        const createdUsers = JSON.parse(localStorage.getItem(this.usersStorageKey) || '{}');
        const dbUsers = typeof DATABASE !== 'undefined' ? DATABASE.getCredentials() : {};
        return { ...CONFIG.USERS, ...dbUsers, ...createdUsers };
    }

    // Create a new user
    createUser(username, password, role = 'user') {
        const allUsers = this.getAllUsers();
        
        if (allUsers[username]) {
            return { success: false, message: 'Username already exists' };
        }

        if (username.length < 3 || password.length < 6) {
            return { success: false, message: 'Username (min 3) and password (min 6) required' };
        }

        const createdUsers = JSON.parse(localStorage.getItem(this.usersStorageKey) || '{}');
        createdUsers[username] = password;
        localStorage.setItem(this.usersStorageKey, JSON.stringify(createdUsers));

        // Save user info (username, role, dateCreated)
        const usersList = JSON.parse(localStorage.getItem(this.usersStorageKey + '_list') || '[]');
        usersList.push({
            username: username,
            role: role,
            dateCreated: new Date().toLocaleString(),
            status: 'Active'
        });
        localStorage.setItem(this.usersStorageKey + '_list', JSON.stringify(usersList));

        return { success: true, message: 'User created successfully' };
    }

    // Get list of created users
    getCreatedUsers() {
        return JSON.parse(localStorage.getItem(this.usersStorageKey + '_list') || '[]');
    }

    // Delete a user
    deleteUser(username) {
        // Avoid deleting database users
        if (typeof DATABASE !== 'undefined' && DATABASE.getEmployeeByUsername(username)) {
            return { success: false, message: 'Cannot delete employee database users' };
        }
        
        if (CONFIG.USERS[username]) {
            return { success: false, message: 'Cannot delete built-in users' };
        }

        const createdUsers = JSON.parse(localStorage.getItem(this.usersStorageKey) || '{}');
        delete createdUsers[username];
        localStorage.setItem(this.usersStorageKey, JSON.stringify(createdUsers));

        const usersList = JSON.parse(localStorage.getItem(this.usersStorageKey + '_list') || '[]');
        const filtered = usersList.filter(u => u.username !== username);
        localStorage.setItem(this.usersStorageKey + '_list', JSON.stringify(filtered));

        return { success: true, message: 'User deleted' };
    }
}

const auth = new AuthManager();

// Check protection ONLY on index.html
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
    }
}
