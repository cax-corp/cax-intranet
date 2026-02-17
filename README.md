# Intranet CAX - Protégé par mot de passe

Un intranet moderne et sécurisé avec authentification par mot de passe.

## 📋 Structure des fichiers

```text
CAX Intranet/
├── login.html          # Page de connexion
├── index.html          # Intranet principal
├── styles.css          # Feuilles de style
├── auth.js             # Gestion de l'authentification
├── app.js              # Logique de l'application
├── config.txt          # Configuration du mot de passe
└── README.md           # Ce fichier
```

## 🔐 Accès et sécurité

### Mot de passe par défaut

**Mot de passe:** `intranet2026`

> ⚠️ **IMPORTANT**: Modifiez le mot de passe immédiatement après le premier accès!

### Comment changer le mot de passe

1. Ouvrez le fichier `auth.js`
2. Localisez la ligne: `PASSWORD: 'intranet2026',`
3. Remplacez `intranet2026` par votre nouveau mot de passe
4. Sauvegardez le fichier

### Fonctionnalités de sécurité

- ✅ **Authentification obligatoire** - Accès protégé à tous les contenus
- ✅ **Session de 1 heure** - Déconnexion automatique après inactivité
- ✅ **Stockage sécurisé** - Utilisation de sessionStorage (vidé à la fermeture du navigateur)
- ✅ **Redirection automatique** - Toute tentative d'accès direct sans authentification redirige vers la connexion

## 🚀 Utilisation

### Démarrage

1. Ouvrez `login.html` dans votre navigateur (ou double-cliquez sur le fichier)
2. Entrez le mot de passe: `intranet2026`
3. Cliquez sur "Connexion"

### Navigation

Une fois connecté, vous pouvez naviguer entre:

- **Tableau de bord** - Vue d'ensemble et statistiques
- **Documents** - Ressources et fichiers téléchargeables
- **Annonces** - Communications importantes
- **Équipe** - Annuaire et départements

### Déconnexion

Cliquez sur le bouton "Déconnexion" en haut à droite

## 📱 Responsive design

L'intranet s'adapte automatiquement à:

- 💻 Ordinateur de bureau
- 📱 Tablettes
- 📞 Smartphones

## 🎨 Personnalisation

### Couleurs

Modifiez les gradients dans `styles.css`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Contenu

Éditez directement les sections HTML dans `index.html`:

- Cartes du tableau de bord
- Annonces
- Documents
- Équipes

### Timeouts de session

Dans `auth.js`, modifiez:

```javascript
SESSION_TIMEOUT: 60 * 60 * 1000  // En millisecondes (60 min ici)
```

## ⚡ Conseils de déploiement

### Pour un petit groupe (< 50 personnes)

Parfait tel quel ! Les fichiers statiques suffisent.

### Pour un groupe plus grand

Envisagez:

1. **Stockage sécurisé du mot de passe** - Utiliser un hash au lieu du mot de passe en clair
2. **Authentification multi-utilisateurs** - Base de données avec identifiants individuels
3. **HTTPS obligatoire** - Pour sécuriser la transmission du mot de passe
4. **Backend server** - Node.js, PHP, Python, etc.
5. **Logs d'activité** - Trace des connexions et actions

## 🛡️ Notes de sécurité

⚠️ **Cette version est adaptée pour:**

- Intranet local d'équipe réduite
- Environnement de test/démonstration
- Réseau interne sécurisé

⚠️ **À éviter en production:**

- Ne pas exposer sur Internet sans HTTPS
- Ne pas utiliser pour données sensibles sans chiffrement
- Implémenter une authentification plus robuste pour > 50 utilisateurs

## 📧 Support

Pour toute question sur l'intranet, contactez votre administrateur système.
'''