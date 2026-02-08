// Données statistiques de l'entreprise - CAX Corp, Maître du Monde
const dashboardData = {
    totalEmployees: 2847650,
    departments: {
        hr: 142350,
        it: 456800,
        finance: 289450,
        admin: 154200,
        operations: 735600,
        sales: 598500,
        marketing: 182750,
        aerospace: 238000
    },
    revenue: 8470000000000, // 8,47 TRILLIONS EUR
    offices: 247,
    founded: 1987,
    locations: {
        france: 425650,
        uk: 186500,
        usa: 489450,
        japan: 298750,
        singapore: 312300,
        germany: 287200,
        india: 347800,
        canada: 312300
    },
    subsidiaries: [
        { name: 'CAX Aerospace', employees: 238000, focus: 'Orbital Ring & Space Infrastructure - Niveau Z' },
        { name: 'CAX Energy', employees: 312000, focus: 'Distribution Énergétique Mondiale' },
        { name: 'CAX Defense', employees: 245000, focus: 'Systèmes Défense Avancés' },
        { name: 'CAX AI', employees: 189000, focus: 'IA & Computing Quantique' },
        { name: 'CAX Biotech', employees: 167000, focus: 'Ingénierie Génétique & Médecine' },
        { name: 'CAX Finance', employees: 289450, focus: 'Monopole Bancaire Mondial' }
    ]
};

// Initialiser le dashboard
document.addEventListener('DOMContentLoaded', () => {
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
        loadAnnouncements();
    }
});

function loadStatistics() {
    const statsCard = document.querySelector('.dashboard-card:first-child');
    
    if (statsCard) {
        // Garder juste le contenu simple sans données
        statsCard.innerHTML = `
            <h3>📊 Statistics</h3>
            <p>Company data and analytics</p>
        `;
    }
}

function loadAnnouncements() {
    const announcements = [
        {
            date: '02 Feb 2026',
            title: 'Welcome to the new intranet',
            content: 'The new CAX intranet is now online with improved features and a better interface.',
            priority: 'normal'
        },
        {
            date: '31 Jan 2026',
            title: 'Q4 2025 Results - Record Performance',
            content: 'CAX Corporation achieved record revenue in Q4 2025 with a 15% growth year-over-year. Congratulations to all teams!',
            priority: 'high'
        },
        {
            date: '28 Jan 2026',
            title: 'Annual Offsite Meeting - February 15-17',
            content: 'All employees are invited to our annual offsite meeting in Châteaurenard. More details coming soon.',
            priority: 'high'
        },
        {
            date: '25 Jan 2026',
            title: 'New IT Security Policy',
            content: 'Updated security guidelines are now in effect. Please review the security policy in the Documents section.',
            priority: 'normal'
        },
        {
            date: '20 Jan 2026',
            title: 'Welcome New Team Members',
            content: 'Please join us in welcoming 23 new employees who joined CAX in January 2026.',
            priority: 'normal'
        }
    ];

    const announcementsSection = document.getElementById('annonces');
    if (announcementsSection) {
        const announcementsList = announcementsSection.querySelector('.announcements-list');
        if (announcementsList) {
            announcementsList.innerHTML = announcements.map(announcement => `
                <div class="announcement-item ${announcement.priority === 'high' ? 'priority-high' : ''}">
                    <div class="announcement-date">${announcement.date}</div>
                    <div class="announcement-content">
                        <h3>${announcement.title}</h3>
                        <p>${announcement.content}</p>
                    </div>
                    ${announcement.priority === 'high' ? '<div class="priority-badge">Important</div>' : ''}
                </div>
            `).join('');
        }
    }
}
