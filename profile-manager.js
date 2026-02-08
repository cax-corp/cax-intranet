// ============================================================
// GESTION DES PROFILS UTILISATEURS - CAX Corporation
// ============================================================

class ProfileManager {
    constructor() {
        this.profilesKey = 'userProfiles';
        this.apiBase = 'https://cax-intranet-server.onrender.com/api/profile';
        this.defaultProfile = {
            username: '',
            avatar: null,
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

    // Obtenir le profil d'un utilisateur (depuis le serveur avec fallback localStorage)
    async getProfile(username) {
        try {
            // Essayer de récupérer depuis le serveur
            const response = await fetch(`${this.apiBase}/${username}`);
            if (response.ok) {
                const data = await response.json();
                const profile = data.profile;
                // Sauvegarder en cache local
                this._cacheProfileLocally(username, profile);
                return profile;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du profil depuis le serveur:', error);
        }

        // Fallback: récupérer depuis localStorage
        const profiles = JSON.parse(localStorage.getItem(this.profilesKey) || '{}');
        if (profiles[username]) {
            return profiles[username];
        }

        // Créer un profil par défaut
        const newProfile = {...this.defaultProfile, username: username};
        this.saveProfile(username, newProfile);
        return newProfile;
    }

    // Sauvegarder le profil (sur le serveur + cache local)
    async saveProfile(username, profileData) {
        const profileToSave = {
            ...profileData,
            lastUpdated: new Date().toISOString()
        };

        try {
            // Sauvegarder sur le serveur Render
            const response = await fetch(`${this.apiBase}/${username}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileToSave)
            });

            if (response.ok) {
                // Sauvegarder aussi en cache local
                this._cacheProfileLocally(username, profileToSave);
                return { success: true, message: 'Profile sauvegardé sur le serveur' };
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du profil:', error);
        }

        // Fallback: sauvegarder seulement en localStorage
        this._cacheProfileLocally(username, profileToSave);
        return { success: true, message: 'Profile sauvegardé localement' };
    }

    // Mettre en cache le profil en localStorage
    _cacheProfileLocally(username, profileData) {
        const profiles = JSON.parse(localStorage.getItem(this.profilesKey) || '{}');
        profiles[username] = profileData;
        localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
    }

    // Mettre à jour une partie du profil
    async updateProfile(username, updates) {
        const profile = await this.getProfile(username);
        const updated = {...profile, ...updates};
        return this.saveProfile(username, updated);
    }

    // Ajouter une image de profil
    async setAvatar(username, imageData) {
        return this.updateProfile(username, { avatar: imageData });
    }

    // Ajouter un lien
    async addLink(username, title, url) {
        const profile = await this.getProfile(username);
        if (!profile.links) profile.links = [];
        profile.links.push({ title, url, addedDate: new Date().toISOString() });
        return this.saveProfile(username, profile);
    }

    // Supprimer un lien
    async removeLink(username, linkIndex) {
        const profile = await this.getProfile(username);
        if (profile.links && profile.links[linkIndex]) {
            profile.links.splice(linkIndex, 1);
            return this.saveProfile(username, profile);
        }
        return { success: false, message: 'Link not found' };
    }

    // Obtenir l'avatar
    async getAvatar(username) {
        const profile = await this.getProfile(username);
        return profile.avatar;
    }

    // Supprimer l'avatar
    async removeAvatar(username) {
        return this.updateProfile(username, { avatar: null });
    }

    // Valider une URL
    isValidUrl(string) {
        try {
            new URL(string);            return true;
        } catch (_) {
            return false;
        }
    }
}

const profileManager = new ProfileManager();