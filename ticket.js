// Vérifier l'authentification
if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
}

// Initialiser EmailJS
emailjs.init("eMji0_caM9w6gI4Us");

const SERVICE_ID = "service_jtz9gjj";
const TEMPLATE_ID = "template_suvyyd2";
const RECIPIENT_EMAIL = "thom.barial@gmail.com";

// Gestion du formulaire de ticket
document.addEventListener('DOMContentLoaded', () => {
    const ticketForm = document.getElementById('ticketForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (ticketForm) {
        ticketForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('ticketTitle').value;
            const category = document.getElementById('ticketCategory').value;
            const priority = document.getElementById('ticketPriority').value;
            const description = document.getElementById('ticketDescription').value;
            const email = document.getElementById('ticketEmail').value;
            const username = auth.getUsername();

            // Créer un numéro de ticket unique
            const ticketId = 'TKT-' + Date.now();
            const createdAt = new Date().toLocaleString('fr-FR');

            // Créer l'objet du ticket
            const ticket = {
                id: ticketId,
                title: title,
                category: category,
                priority: priority,
                description: description,
                email: email,
                username: username,
                status: 'open',
                createdAt: createdAt,
                updatedAt: createdAt
            };

            // Sauvegarder le ticket en localStorage
            let tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
            tickets.push(ticket);
            localStorage.setItem('supportTickets', JSON.stringify(tickets));

            // Préparer l'email
            const emailParams = {
                to_email: RECIPIENT_EMAIL,
                from_email: email,
                from_name: username,
                ticket_id: ticketId,
                ticket_title: title,
                ticket_category: category,
                ticket_priority: priority,
                ticket_description: description,
                ticket_date: createdAt
            };

            try {
                // Envoyer l'email via EmailJS
                await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams);

                // Afficher le message de succès
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';

                // Réinitialiser le formulaire
                ticketForm.reset();

                // Masquer le message après 5 secondes et rediriger
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 5000);

            } catch (error) {
                console.error('Erreur lors de l\'envoi de l\'email:', error);

                // Afficher le message d'erreur
                errorMessage.textContent = 'Erreur lors de la création du ticket. Veuillez réessayer.';
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
            }
        });
    }
});

// Fonction pour récupérer les tickets de l'utilisateur
function getUserTickets() {
    const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    const username = auth.getUsername();
    return tickets.filter(t => t.username === username);
}

// Fonction pour afficher l'historique des tickets
function displayTicketHistory() {
    const tickets = getUserTickets();
    
    if (tickets.length === 0) {
        console.log('Aucun ticket');
        return;
    }

    console.log('Vos tickets de support:');
    tickets.forEach(ticket => {
        console.log(`[${ticket.id}] ${ticket.title} - ${ticket.status}`);
    });
}

                // Rediriger après 2 secondes
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }).catch((error) => {
                errorMessage.textContent = 'Erreur lors de l\'envoi du ticket. Veuillez réessayer.';
                errorMessage.style.display = 'block';
                console.error('Erreur EmailJS:', error);
            });
        });
    }
});
