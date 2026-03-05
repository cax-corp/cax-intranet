# CAX Intranet - Password Protected

A modern and secure intranet with password authentication.

## 📋 File Structure

```text
CAX Intranet/
├── login.html          # Login page
├── index.html          # Main intranet
├── styles.css          # Stylesheets
├── auth.js             # Authentication management
├── app.js              # Application logic
├── config.txt          # Password configuration
└── README.md           # This file
```

## 🔐 Access and Security

### Default Password

**Password:** `intranet2026`

> ⚠️ **IMPORTANT**: Change the password immediately after first access!

### How to Change the Password

1. Open the `auth.js` file
2. Find the line: `PASSWORD: 'intranet2026',`
3. Replace `intranet2026` with your new password
4. Save the file

### Security Features

- ✅ **Required Authentication** - Protected access to all content
- ✅ **1-Hour Session** - Automatic logout after inactivity
- ✅ **Secure Storage** - Uses sessionStorage (cleared on browser close)
- ✅ **Automatic Redirect** - Any unauthorized access redirects to login

## 🚀 Usage

### Getting Started

1. Open `login.html` in your browser (or double-click the file)
2. Enter the password: `intranet2026`
3. Click "Login"

### Navigation

Once logged in, you can navigate between:

- **Dashboard** - Overview and statistics
- **Documents** - Resources and downloadable files
- **Announcements** - Important communications
- **Team** - Directory and departments

### Logout

Click the "Logout" button in the top right corner

## 📱 Responsive Design

The intranet automatically adapts to:

- 💻 Desktop computers
- 📱 Tablets
- 📞 Smartphones

## 🎨 Customization

### Colors

Modify the gradients in `styles.css`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Content

Edit HTML sections directly in `index.html`:

- Dashboard cards
- Announcements
- Documents
- Teams

### Session Timeouts

In `auth.js`, modify:

```javascript
SESSION_TIMEOUT: 60 * 60 * 1000  // In milliseconds (60 min here)
```

## ⚡ Deployment Tips

### For Small Groups (< 50 people)

Perfect as-is! Static files are sufficient.

### For Larger Groups

Consider:

1. **Secure Password Storage** - Use hash instead of plain text password
2. **Multi-User Authentication** - Database with individual credentials
3. **HTTPS Required** - To secure password transmission
4. **Backend Server** - Node.js, PHP, Python, etc.
5. **Activity Logs** - Track logins and actions

## 🛡️ Security Notes

⚠️ **This version is suitable for:**

- Small team intranet
- Test/demo environment
- Secure internal network

⚠️ **Avoid in production:**

- Don't expose to Internet without HTTPS
- Don't use for sensitive data without encryption
- Implement stronger authentication for > 50 users

## 📧 Support

For any questions about the intranet, contact your system administrator.
'''