// profile.js - Profile page logic
let currentUsername = null;
let currentProfile = null;

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const username = sessionStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    currentUsername = username;
    loadProfileData();
    setupEventListeners();
});

// Load user profile data
function loadProfileData() {
    if (!currentUsername) return;

    const profile = profileManager.getProfile(currentUsername);
    currentProfile = profile;

    // Display name and role
    document.getElementById('profileDisplayName').textContent = currentUsername.charAt(0).toUpperCase() + currentUsername.slice(1);
    document.getElementById('profileDisplayRole').textContent = profile.department || 'Employee';

    // Display avatar
    if (profile.avatar) {
        const avatarImg = document.getElementById('profileAvatarDisplay');
        avatarImg.src = profile.avatar;
        avatarImg.classList.remove('empty');
        document.getElementById('removeAvatarBtn').style.display = 'block';
    }

    // Display stats
    const joinDate = new Date(profile.joinDate);
    const today = new Date();
    const daysSince = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
    document.getElementById('memberSince').textContent = daysSince;
    document.getElementById('linksCount').textContent = profile.links.length;

    // Format last update
    if (profile.lastUpdated) {
        const lastUpdate = new Date(profile.lastUpdated);
        const diffMs = today - lastUpdate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        let timeStr = 'Just now';
        if (diffMins > 0 && diffMins < 60) timeStr = `${diffMins}m ago`;
        else if (diffHours > 0 && diffHours < 24) timeStr = `${diffHours}h ago`;
        else if (diffDays > 0) timeStr = `${diffDays}d ago`;
        
        document.getElementById('lastUpdate').textContent = timeStr;
    }

    // Load form fields
    document.getElementById('biographyInput').value = profile.bio || '';
    document.getElementById('locationInput').value = profile.location || '';
    document.getElementById('emailInput').value = profile.email || '';
    document.getElementById('phoneInput').value = profile.phone || '';

    // Load links
    displayLinks();
}

// Display user links
function displayLinks() {
    const linksList = document.getElementById('linksList');
    linksList.innerHTML = '';

    if (currentProfile.links.length === 0) {
        linksList.innerHTML = '<p style="color: #999; text-align: center;">No links added yet. Add one below!</p>';
        return;
    }

    currentProfile.links.forEach((link, index) => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'link-item';
        linkDiv.innerHTML = `
            <strong>${link.title}</strong>
            <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.url}</a>
            <button type="button" class="btn-remove-link" onclick="removeLink(${index})">Remove</button>
        `;
        linksList.appendChild(linkDiv);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Avatar upload
    document.getElementById('avatarInput').addEventListener('change', handleAvatarUpload);

    // Remove avatar
    document.getElementById('removeAvatarBtn').addEventListener('click', removeProfileAvatar);

    // Link input validation
    document.getElementById('linkUrlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addLink();
            e.preventDefault();
        }
    });

    document.getElementById('linkTitleInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addLink();
            e.preventDefault();
        }
    });
}

// Handle avatar upload
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        showError('Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.');
        return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showError('Le fichier est trop volumineux (max 5MB).');
        return;
    }

    // Créer un FormData pour l'upload
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('username', currentUsername);

    // Afficher un loading
    const uploadBtn = document.querySelector('.btn-upload-avatar');
    const originalText = uploadBtn.textContent;
    uploadBtn.textContent = 'Uploading...';
    uploadBtn.disabled = true;

    // Envoyer au serveur
    fetch('http://localhost:3000/upload-avatar', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Sauvegarder le chemin de l'avatar
            profileManager.setAvatar(currentUsername, data.avatarPath);
            currentProfile.avatar = data.avatarPath;
            
            // Afficher l'avatar
            const avatarImg = document.getElementById('profileAvatarDisplay');
            avatarImg.src = data.avatarPath;
            avatarImg.classList.remove('empty');
            document.getElementById('removeAvatarBtn').style.display = 'block';
            
            showSuccess('Photo de profil uploadée avec succès !');
        } else {
            showError(data.message || 'Erreur lors de l\'upload');
        }
    })
    .catch(error => {
        showError('Erreur de connexion au serveur: ' + error.message);
    })
    .finally(() => {
        uploadBtn.textContent = originalText;
        uploadBtn.disabled = false;
        document.getElementById('avatarInput').value = '';
    });
}

// Remove avatar
function removeProfileAvatar() {
    const username = currentUsername;
    
    fetch(`http://localhost:3000/delete-avatar/${username}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            profileManager.removeAvatar(currentUsername);
            currentProfile.avatar = null;
            
            const avatarImg = document.getElementById('profileAvatarDisplay');
            avatarImg.src = '';
            avatarImg.classList.add('empty');
            document.getElementById('removeAvatarBtn').style.display = 'none';
            
            showSuccess('Photo de profil supprimée');
        } else {
            showError(data.message || 'Erreur lors de la suppression');
        }
    })
    .catch(error => {
        showError('Erreur de connexion au serveur: ' + error.message);
    })
    .finally(() => {
        document.getElementById('avatarInput').value = '';
    });
}

// Save personal info
function savePersonalInfo() {
    const updates = {
        bio: document.getElementById('biographyInput').value,
        location: document.getElementById('locationInput').value,
        email: document.getElementById('emailInput').value,
        phone: document.getElementById('phoneInput').value
    };

    profileManager.updateProfile(currentUsername, updates);
    currentProfile = profileManager.getProfile(currentUsername);
    
    showSuccess('Personal information saved');
    
    // Update stats
    const today = new Date();
    const lastUpdate = new Date(currentProfile.lastUpdated);
    const diffMs = today - lastUpdate;
    const diffMins = Math.floor(diffMs / 60000);
    
    document.getElementById('lastUpdate').textContent = diffMins > 0 ? `${diffMins}m ago` : 'Just now';
}

// Add link
function addLink() {
    const title = document.getElementById('linkTitleInput').value.trim();
    const url = document.getElementById('linkUrlInput').value.trim();

    if (!title) {
        showError('Please enter a link title');
        return;
    }

    if (!url) {
        showError('Please enter a URL');
        return;
    }

    if (!profileManager.isValidUrl(url)) {
        showError('Please enter a valid URL (starting with http:// or https://)');
        return;
    }

    profileManager.addLink(currentUsername, title, url);
    currentProfile = profileManager.getProfile(currentUsername);

    document.getElementById('linkTitleInput').value = '';
    document.getElementById('linkUrlInput').value = '';

    displayLinks();
    document.getElementById('linksCount').textContent = currentProfile.links.length;
    showSuccess('Link added successfully');
}

// Remove link
function removeLink(index) {
    profileManager.removeLink(currentUsername, index);
    currentProfile = profileManager.getProfile(currentUsername);
    
    displayLinks();
    document.getElementById('linksCount').textContent = currentProfile.links.length;
    showSuccess('Link removed');
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.classList.add('show');

    // Hide error if showing
    document.getElementById('errorMessage').classList.remove('show');

    setTimeout(() => {
        successDiv.classList.remove('show');
    }, 3000);
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');

    // Hide success if showing
    document.getElementById('successMessage').classList.remove('show');

    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 3000);
}
