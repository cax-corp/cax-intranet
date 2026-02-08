const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// In-memory database for messages (persists during server runtime)
const profilesDB = {
    profiles: {}, // { username: { links: [...], bio, avatar, ... } }
    
    getProfile(username) {
        return this.profiles[username] || {
            username: username,
            links: [],
            bio: '',
            avatar: null,
            phone: '',
            address: ''
        };
    },

    saveProfile(username, profileData) {
        this.profiles[username] = {
            username: username,
            ...profileData,
            updatedAt: new Date().toISOString()
        };
        return this.profiles[username];
    }
};

const messagesDB = {
    messages: [],
    sendMessage(sender, receiver, content) {
        const message = {
            id: 'MSG' + Date.now(),
            sender: sender,
            receiver: receiver,
            content: content,
            timestamp: new Date().toISOString(),
            read: false
        };
        this.messages.push(message);
        return message;
    },
    getConversation(user1, user2) {
        return this.messages.filter(msg => 
            (msg.sender === user1 && msg.receiver === user2) ||
            (msg.sender === user2 && msg.receiver === user1)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },
    getConversations(username) {
        const conversations = new Map();
        this.messages.forEach(msg => {
            if (msg.sender === username) {
                if (!conversations.has(msg.receiver)) {
                    conversations.set(msg.receiver, {
                        otherUser: msg.receiver,
                        lastMessage: msg.content,
                        lastTimestamp: msg.timestamp,
                        unreadCount: 0
                    });
                } else {
                    const conv = conversations.get(msg.receiver);
                    conv.lastMessage = msg.content;
                    conv.lastTimestamp = msg.timestamp;
                }
            } else if (msg.receiver === username) {
                if (!conversations.has(msg.sender)) {
                    conversations.set(msg.sender, {
                        otherUser: msg.sender,
                        lastMessage: msg.content,
                        lastTimestamp: msg.timestamp,
                        unreadCount: msg.read ? 0 : 1
                    });
                } else {
                    const conv = conversations.get(msg.sender);
                    conv.lastMessage = msg.content;
                    conv.lastTimestamp = msg.timestamp;
                    if (!msg.read) conv.unreadCount++;
                }
            }
        });
        return Array.from(conversations.values()).sort((a, b) => 
            new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
        );
    },
    markAsRead(sender, receiver, username) {
        let count = 0;
        this.messages.forEach(msg => {
            if (msg.sender === sender && msg.receiver === receiver && msg.receiver === username && !msg.read) {
                msg.read = true;
                count++;
            }
        });
        return count;
    }
};

const app = express();
const PORT = 3000;

// Créer le dossier des avatars s'il n'existe pas
const avatarDir = path.join(__dirname, 'ressources', 'avatars');
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

// Configuration multer pour les uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarDir);
    },
    filename: (req, file, cb) => {
        const username = req.body.username || 'default';
        const ext = path.extname(file.originalname);
        const filename = `${username}_${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Type de fichier non autorisé'), false);
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Route pour uploader un avatar
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
    }

    const avatarPath = `/ressources/avatars/${req.file.filename}`;
    res.json({
        success: true,
        message: 'Avatar uploadé avec succès',
        avatarPath: avatarPath,
        filename: req.file.filename
    });
});

// Route pour supprimer un avatar
app.delete('/delete-avatar/:username', (req, res) => {
    const username = req.params.username;
    const avatarDir = path.join(__dirname, 'ressources', 'avatars');
    
    // Chercher les fichiers de cet utilisateur
    fs.readdir(avatarDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erreur lors de la suppression' });
        }

        let deleted = false;
        files.forEach(file => {
            if (file.startsWith(username + '_')) {
                fs.unlinkSync(path.join(avatarDir, file));
                deleted = true;
            }
        });

        if (deleted) {
            res.json({ success: true, message: 'Avatar supprimé' });
        } else {
            res.status(404).json({ success: false, message: 'Avatar non trouvé' });
        }
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur CAX Intranet en cours d'exécution sur http://localhost:${PORT}`);
    console.log(`Les avatars sont stockés dans: ${avatarDir}`);
});

// ============================================
// MESSAGE ENDPOINTS
// ============================================

// Endpoint pour envoyer un message
app.post('/api/messages/send', (req, res) => {
    const { sender, receiver, content } = req.body;

    if (!sender || !receiver || !content) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const message = messagesDB.sendMessage(sender, receiver, content);
    res.json({ success: true, message: message });
});

// Endpoint pour obtenir la conversation entre deux utilisateurs
app.get('/api/messages/conversation/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;
    const conversation = messagesDB.getConversation(user1, user2);
    
    // Mark messages as read
    messagesDB.markAsRead(user2, user1, user1);
    
    res.json({ success: true, messages: conversation });
});

// Endpoint pour obtenir toutes les conversations d'un utilisateur
app.get('/api/messages/conversations/:username', (req, res) => {
    const { username } = req.params;
    const conversations = messagesDB.getConversations(username);
    res.json({ success: true, conversations: conversations });
});

// Endpoint pour obtenir les unread messages count
app.get('/api/messages/unread/:username', (req, res) => {
    const { username } = req.params;
    const unreadCount = messagesDB.messages.filter(msg => 
        msg.receiver === username && !msg.read
    ).length;
    res.json({ success: true, unreadCount: unreadCount });
});
// ============================================
// PROFILE ENDPOINTS
// ============================================

// Endpoint pour récupérer le profil d'un utilisateur
app.get('/api/profile/:username', (req, res) => {
    const { username } = req.params;
    const profile = profilesDB.getProfile(username);
    res.json({ success: true, profile: profile });
});

// Endpoint pour sauvegarder/mettre à jour le profil
app.post('/api/profile/:username', (req, res) => {
    const { username } = req.params;
    const profileData = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const savedProfile = profilesDB.saveProfile(username, profileData);
    res.json({ success: true, message: 'Profile saved successfully', profile: savedProfile });
});

// Endpoint pour mettre à jour (alias pour POST)
app.put('/api/profile/:username', (req, res) => {
    const { username } = req.params;
    const profileData = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const savedProfile = profilesDB.saveProfile(username, profileData);
    res.json({ success: true, message: 'Profile updated successfully', profile: savedProfile });
});