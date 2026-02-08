// Messages Service
class MessagesService {
    constructor() {
        this.currentConversation = null;
        this.refreshInterval = null;
        this.messageRefreshInterval = null;
        this.apiBase = 'https://cax-intranet-server.onrender.com/api/messages';
    }

    async sendMessage(sender, receiver, content) {
        try {
            const response = await fetch(`${this.apiBase}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender, receiver, content })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, message: 'Failed to send message' };
        }
    }

    async getConversation(user1, user2) {
        try {
            const response = await fetch(`${this.apiBase}/conversation/${user1}/${user2}`);
            const data = await response.json();
            return data.messages || [];
        } catch (error) {
            console.error('Error fetching conversation:', error);
            return [];
        }
    }

    async getConversations(username) {
        try {
            const response = await fetch(`${this.apiBase}/conversations/${username}`);
            const data = await response.json();
            return data.conversations || [];
        } catch (error) {
            console.error('Error fetching conversations:', error);
            return [];
        }
    }

    async getUnreadCount(username) {
        try {
            const response = await fetch(`${this.apiBase}/unread/${username}`);
            const data = await response.json();
            return data.unreadCount || 0;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    }
}

// Initialize service
const messagesService = new MessagesService();
let currentUsername = '';
let selectedUser = null;
let displayedMessageIds = new Set();

// DOM Elements
const newConversationBtn = document.getElementById('newConversationBtn');
const conversationsList = document.getElementById('conversationsList');
const messagesArea = document.getElementById('messagesArea');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messageInputArea = document.getElementById('messageInputArea');
const selectedUserNameElement = document.getElementById('selectedUserName');
const usersModal = document.getElementById('usersModal');
const closeUsersModal = document.getElementById('closeUsersModal');
const usersList = document.getElementById('usersList');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    currentUsername = auth.getUsername();
    
    if (!currentUsername) {
        window.location.href = 'login.html';
        return;
    }

    loadConversations();
    setupEventListeners();

    // Refresh conversations every 3 seconds
    messagesService.refreshInterval = setInterval(() => {
        loadConversations();
    }, 3000);

    // Refresh messages every 1 second if conversation is open
    messagesService.messageRefreshInterval = setInterval(() => {
        if (selectedUser) {
            loadMessages(selectedUser);
        }
    }, 1000);
});

function setupEventListeners() {
    newConversationBtn.addEventListener('click', openUsersModal);
    closeUsersModal.addEventListener('click', closeUsersModalFn);
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
    });

    // Close modal on backdrop click
    usersModal.addEventListener('click', (e) => {
        if (e.target === usersModal) {
            closeUsersModalFn();
        }
    });
}

async function loadConversations() {
    try {
        const conversations = await messagesService.getConversations(currentUsername);
        
        if (conversations.length === 0) {
            conversationsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">No conversations yet</div>';
            return;
        }

        conversationsList.innerHTML = '';
        conversations.forEach(conversation => {
            const div = document.createElement('div');
            div.className = 'conversation-item' + (selectedUser === conversation.otherUser ? ' active' : '');
            
            const timestamp = new Date(conversation.lastTimestamp);
            const timeString = formatTime(timestamp);
            
            const unreadBadge = conversation.unreadCount > 0 ? 
                `<span class="conversation-unread">${conversation.unreadCount}</span>` : '';
            
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <div class="conversation-user">${conversation.otherUser}</div>
                        <div class="conversation-last-message">${conversation.lastMessage}</div>
                    </div>
                    ${unreadBadge}
                </div>
                <div class="conversation-timestamp">${timeString}</div>
            `;
            
            div.addEventListener('click', () => selectConversation(conversation.otherUser));
            conversationsList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

async function selectConversation(otherUser) {
    selectedUser = otherUser;
    selectedUserNameElement.textContent = otherUser;
    messageInputArea.style.display = 'flex';
    messageInput.focus();
    
    // Reset displayed messages when changing conversation
    displayedMessageIds.clear();
    
    // Update active state
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget?.classList.add('active');
    
    await loadMessages(otherUser);
}

async function loadMessages(otherUser) {
    try {
        const messages = await messagesService.getConversation(currentUsername, otherUser);
        
        if (messages.length === 0) {
            messagesArea.innerHTML = '<div class="messages-empty">No messages yet. Start a conversation!</div>';
            displayedMessageIds.clear();
            return;
        }

        // Check which messages are new
        const newMessages = messages.filter(msg => !displayedMessageIds.has(msg.id));
        
        // If this is the first load for this conversation
        if (displayedMessageIds.size === 0) {
            // Clear and display all messages (first time, initial load)
            messagesArea.innerHTML = '';
            messages.forEach(message => {
                displayedMessageIds.add(message.id);
                appendMessageElement(message, true); // isNew = true for animation
            });
        } else if (newMessages.length > 0) {
            // Only add new messages without animation
            newMessages.forEach(message => {
                displayedMessageIds.add(message.id);
                appendMessageElement(message, true); // Show animation only for new messages
            });
        }
        
        // Scroll to bottom
        messagesArea.scrollTop = messagesArea.scrollHeight;
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function appendMessageElement(message, isNew) {
    const isOwn = message.sender === currentUsername;
    const div = document.createElement('div');
    div.className = `message ${isOwn ? 'sent' : 'received'}`;
    div.setAttribute('data-message-id', message.id);
    
    const timestamp = new Date(message.timestamp);
    const timeString = timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    div.innerHTML = `
        <div class="message-time">${timeString}</div>
        <div class="message-content">${escapeHtml(message.content)}</div>
    `;
    
    messagesArea.appendChild(div);
}

async function sendMessage() {
    const content = messageInput.value.trim();
    
    if (!content || !selectedUser) {
        return;
    }

    sendButton.disabled = true;
    
    try {
        const result = await messagesService.sendMessage(currentUsername, selectedUser, content);
        
        if (result.success) {
            messageInput.value = '';
            messageInput.style.height = 'auto';
            await loadMessages(selectedUser);
            await loadConversations();
        } else {
            alert('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message');
    } finally {
        sendButton.disabled = false;
        messageInput.focus();
    }
}

async function openUsersModal() {
    usersModal.classList.add('active');
    
    try {
        const allUsers = DATABASE.getActiveEmployees();
        const currentUserData = DATABASE.getEmployeeByUsername(currentUsername);
        
        // Filter out current user
        const otherUsers = allUsers.filter(emp => emp.username !== currentUsername);
        
        usersList.innerHTML = '';
        otherUsers.forEach(user => {
            const div = document.createElement('div');
            div.className = 'user-item';
            div.innerHTML = `
                <div class="user-item-name">${user.firstName} ${user.lastName}</div>
                <div class="user-item-department">${user.department} • ${user.position}</div>
            `;
            div.addEventListener('click', () => {
                closeUsersModalFn();
                selectConversation(user.username);
            });
            usersList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function closeUsersModalFn() {
    usersModal.classList.remove('active');
}

function formatTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (messagesService.refreshInterval) {
        clearInterval(messagesService.refreshInterval);
    }
    if (messagesService.messageRefreshInterval) {
        clearInterval(messagesService.messageRefreshInterval);
    }
});
