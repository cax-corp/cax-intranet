// ============================================================
// GESTION DES PROFILS UTILISATEURS - CAX Corporation
// ============================================================

class ProfileManager {
    constructor() {
        this.profilesKey = 'userProfiles';
        this.defaultProfile = {
            username: '',
            avatar: null, // base64 image
            bio: '',
            location: '',
            department: '',
            email: '',
            phone: '',
            links: [], // Array of {title, url}
            joinDate: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString()
        };
    }

    // Obtenir le profil d'un utilisateur
    getProfile(username) {
        const profiles = JSON.parse(localStorage.getItem(this.profilesKey) || '{}');
        if (profiles[username]) {
            return profiles[username];
        }
        // Créer un profil par défaut
        const newProfile = {...this.defaultProfile, username: username};
        this.saveProfile(username, newProfile);
        return newProfile;
    }

    // Sauvegarder le profil d'un utilisateur
    saveProfile(username, profileData) {
        const profiles = JSON.parse(localStorage.getItem(this.profilesKey) || '{}');
        profiles[username] = {
            ...profileData,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
        return { success: true, message: 'Profile updated successfully' };
    }

    // Mettre à jour une partie du profil
    updateProfile(username, updates) {
        const profile = this.getProfile(username);
        const updated = {...profile, ...updates};
        return this.saveProfile(username, updated);
    }

    // Ajouter une image de profil (base64)
    setAvatar(username, imageData) {
        return this.updateProfile(username, { avatar: imageData });
    }

    // Ajouter un lien
    addLink(username, title, url) {
        const profile = this.getProfile(username);
        if (!profile.links) profile.links = [];
        profile.links.push({ title, url, addedDate: new Date().toISOString() });
        return this.saveProfile(username, profile);
    }

    // Supprimer un lien
    removeLink(username, linkIndex) {
        const profile = this.getProfile(username);
        if (profile.links && profile.links[linkIndex]) {
            profile.links.splice(linkIndex, 1);
            return this.saveProfile(username, profile);
        }
        return { success: false, message: 'Link not found' };
    }

    // Obtenir l'avatar
    getAvatar(username) {
        const profile = this.getProfile(username);
        return profile.avatar;
    }

    // Supprimer l'avatar
    removeAvatar(username) {
        return this.updateProfile(username, { avatar: null });
    }

    // Valider une URL
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

const profileManager = new ProfileManager();
