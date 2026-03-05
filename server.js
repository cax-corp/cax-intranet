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

const divisionsDB = {
    divisions: [
        {
            id: 1,
            name: 'Orbitals',
            location: 'France',
            head: 'Jean Dupont',
            employees: 250,
            description: 'Orbital ring and space infrastructure division'
        },
        {
            id: 2,
            name: 'Socialys',
            location: 'UK',
            head: 'Jane Smith',
            employees: 180,
            description: 'Social media and digital platforms'
        },
        {
            id: 3,
            name: 'Anoki',
            location: 'USA',
            head: 'Robert Johnson',
            employees: 150,
            description: 'American division specializing in analytics and data'
        }
    ],
    
    getDivisions() {
        return this.divisions.sort((a, b) => a.name.localeCompare(b.name));
    },
    
    addDivision(division) {
        const newDivision = {
            id: this.divisions.length > 0 ? Math.max(...this.divisions.map(d => d.id)) + 1 : 1,
            ...division
        };
        this.divisions.push(newDivision);
        return newDivision;
    },
    
    updateDivision(id, updates) {
        const division = this.divisions.find(d => d.id === id);
        if (division) {
            Object.assign(division, updates);
            return division;
        }
        return null;
    },
    
    deleteDivision(id) {
        const index = this.divisions.findIndex(d => d.id === id);
        if (index !== -1) {
            this.divisions.splice(index, 1);
            return true;
        }
        return false;
    }
};

const app = express();

// Create avatar folder if it doesn't exist
const avatarDir = path.join(__dirname, 'ressources', 'avatars');
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

// Configure multer for uploads
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
            cb(new Error('File type not allowed'), false);
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Route to upload an avatar
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const avatarPath = `/ressources/avatars/${req.file.filename}`;
    res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        avatarPath: avatarPath,
        filename: req.file.filename
    });
});

// Route to delete an avatar
app.delete('/delete-avatar/:username', (req, res) => {
    const username = req.params.username;
    const avatarDir = path.join(__dirname, 'ressources', 'avatars');
    
    // Find this user's files
    fs.readdir(avatarDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error deleting avatar' });
        }

        let deleted = false;
        files.forEach(file => {
            if (file.startsWith(username + '_')) {
                fs.unlinkSync(path.join(avatarDir, file));
                deleted = true;
            }
        });

        if (deleted) {
            res.json({ success: true, message: 'Avatar deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Avatar not found' });
        }
    });
});

// ============================================
// MESSAGE ENDPOINTS
// ============================================

// Endpoint to send a message
app.post('/api/messages/send', (req, res) => {
    const { sender, receiver, content } = req.body;

    if (!sender || !receiver || !content) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const message = messagesDB.sendMessage(sender, receiver, content);
    res.json({ success: true, message: message });
});

// Endpoint to get conversation between two users
app.get('/api/messages/conversation/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;
    const conversation = messagesDB.getConversation(user1, user2);
    
    // Mark messages as read
    messagesDB.markAsRead(user2, user1, user1);
    
    res.json({ success: true, messages: conversation });
});

// Endpoint to get all conversations for a user
app.get('/api/messages/conversations/:username', (req, res) => {
    const { username } = req.params;
    const conversations = messagesDB.getConversations(username);
    res.json({ success: true, conversations: conversations });
});

// Endpoint to get unread messages count
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

// Endpoint to get user profile
app.get('/api/profile/:username', (req, res) => {
    const { username } = req.params;
    const profile = profilesDB.getProfile(username);
    res.json({ success: true, profile: profile });
});

// Endpoint to save/update user profile
app.post('/api/profile/:username', (req, res) => {
    const { username } = req.params;
    const profileData = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const savedProfile = profilesDB.saveProfile(username, profileData);
    res.json({ success: true, message: 'Profile saved successfully', profile: savedProfile });
});

// Endpoint to update (alias for POST)
app.put('/api/profile/:username', (req, res) => {
    const { username } = req.params;
    const profileData = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const savedProfile = profilesDB.saveProfile(username, profileData);
    res.json({ success: true, message: 'Profile updated successfully', profile: savedProfile });
});

// ============================================
// DIVISIONS ENDPOINTS
// ============================================

// Get all divisions
app.get('/api/divisions', (req, res) => {
    const divisions = divisionsDB.getDivisions();
    res.json({ success: true, divisions: divisions });
});

// Add new division
app.post('/api/divisions', (req, res) => {
    const { name, location, head, employees, description } = req.body;
    
    if (!name) {
        return res.status(400).json({ success: false, message: 'Division name is required' });
    }
    
    const newDivision = divisionsDB.addDivision({
        name: name,
        location: location || '',
        head: head || '',
        employees: parseInt(employees) || 0,
        description: description || ''
    });
    
    res.json({ success: true, division: newDivision });
});

// Update division
app.put('/api/divisions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, location, head, employees, description } = req.body;
    
    const updated = divisionsDB.updateDivision(id, {
        name: name,
        location: location || '',
        head: head || '',
        employees: parseInt(employees) || 0,
        description: description || ''
    });
    
    if (!updated) {
        return res.status(404).json({ success: false, message: 'Division not found' });
    }
    
    res.json({ success: true, division: updated });
});

// Delete division
app.delete('/api/divisions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = divisionsDB.deleteDivision(id);
    
    if (!deleted) {
        return res.status(404).json({ success: false, message: 'Division not found' });
    }
    
    res.json({ success: true, message: 'Division deleted' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});