// Gestion du département HR
document.addEventListener('DOMContentLoaded', () => {
    const hrCard = document.querySelector('.team-card:nth-child(4)');
    const hrDetails = document.getElementById('hrDetails');
    const closeHRBtn = document.getElementById('closeHR');

    if (hrCard) {
        hrCard.addEventListener('click', (e) => {
            e.preventDefault();
            hrDetails.style.display = 'block';
            hrDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (closeHRBtn) {
        closeHRBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hrDetails.style.display = 'none';
        });
    }

    // Fermer aussi en cliquant sur le fond sombre
    hrDetails.addEventListener('click', (e) => {
        if (e.target === hrDetails) {
            hrDetails.style.display = 'none';
        }
    });
});
