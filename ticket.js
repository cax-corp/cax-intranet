// Check authentication
if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
}

// Initialize EmailJS
emailjs.init("eMji0_caM9w6gI4Us");

const SERVICE_ID = "service_jtz9gjj";
const TEMPLATE_ID = "template_suvyyd2";
const RECIPIENT_EMAIL = "thom.barial@gmail.com";

// Ticket form management
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

            // Create unique ticket number
            const ticketId = 'TKT-' + Date.now();
            const createdAt = new Date().toLocaleString('en-US');

            // Create ticket object
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

            // Save ticket in localStorage
            let tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
            tickets.push(ticket);
            localStorage.setItem('supportTickets', JSON.stringify(tickets));

            // Prepare email
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
                // Send email via EmailJS
                await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams);

                // Show success message
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';

                // Reset form
                ticketForm.reset();

                // Hide message after 5 seconds and redirect
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 5000);

            } catch (error) {
                console.error('Error sending email:', error);

                // Show error message
                errorMessage.textContent = 'Error creating ticket. Please try again.';
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
            }
        });
    }
});

// Function to get user's tickets
function getUserTickets() {
    const tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    const username = auth.getUsername();
    return tickets.filter(t => t.username === username);
}

// Function to display ticket history
function displayTicketHistory() {
    const tickets = getUserTickets();
    
    if (tickets.length === 0) {
        console.log('No tickets');
        return;
    }

    console.log('Your support tickets:');
    tickets.forEach(ticket => {
        console.log(`[${ticket.id}] ${ticket.title} - ${ticket.status}`);
    });
}

                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }).catch((error) => {
                errorMessage.textContent = 'Error sending ticket. Please try again.';
                errorMessage.style.display = 'block';
                console.error('EmailJS Error:', error);
            });
        });
    }
});
