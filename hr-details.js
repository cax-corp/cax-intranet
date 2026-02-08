// Vérifier l'authentification
if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
}

// Base de données des employés
const employees = [
    {
        id: 1,
        name: 'Sarah Mitchell',
        role: 'HR Director',
        department: 'hr',
        email: 'sarah.mitchell@cax.com',
        phone: '+33 1 23 45 67 89',
        hireDate: '2020-03-15',
        salary: 'Level 9',
        status: 'active'
    },
    {
        id: 2,
        name: 'Thomas Dupont',
        role: 'Recruitment Manager',
        department: 'hr',
        email: 'thomas.dupont@cax.com',
        phone: '+33 1 23 45 67 90',
        hireDate: '2019-07-20',
        salary: 'Level 7',
        status: 'active'
    },
    {
        id: 3,
        name: 'Julie Leclerc',
        role: 'Training & Development Specialist',
        department: 'hr',
        email: 'julie.leclerc@cax.com',
        phone: '+33 1 23 45 67 91',
        hireDate: '2021-01-10',
        salary: 'Level 6',
        status: 'active'
    },
    {
        id: 4,
        name: 'Marc Fontaine',
        role: 'Payroll Specialist',
        department: 'hr',
        email: 'marc.fontaine@cax.com',
        phone: '+33 1 23 45 67 92',
        hireDate: '2018-11-05',
        salary: 'Level 6',
        status: 'active'
    },
    {
        id: 5,
        name: 'Emma Rodriguez',
        role: 'HR Generalist',
        department: 'hr',
        email: 'emma.rodriguez@cax.com',
        phone: '+33 1 23 45 67 93',
        hireDate: '2022-02-14',
        salary: 'Level 5',
        status: 'active'
    },
    {
        id: 6,
        name: 'Antoine Bernard',
        role: 'Compliance Officer',
        department: 'hr',
        email: 'antoine.bernard@cax.com',
        phone: '+33 1 23 45 67 94',
        hireDate: '2020-09-01',
        salary: 'Level 7',
        status: 'active'
    },
    {
        id: 7,
        name: 'Alex Chen',
        role: 'IT Manager',
        department: 'it',
        email: 'alex.chen@cax.com',
        phone: '+33 1 23 45 67 95',
        hireDate: '2019-05-15',
        salary: 'Level 8',
        status: 'active'
    },
    {
        id: 8,
        name: 'Michaël Lefebvre',
        role: 'Senior Developer',
        department: 'it',
        email: 'michael.lefebvre@cax.com',
        phone: '+33 1 23 45 67 96',
        hireDate: '2018-03-20',
        salary: 'Level 7',
        status: 'active'
    },
    {
        id: 9,
        name: 'Sophie Martin',
        role: 'Financial Analyst',
        department: 'finance',
        email: 'sophie.martin@cax.com',
        phone: '+33 1 23 45 67 97',
        hireDate: '2020-08-10',
        salary: 'Level 6',
        status: 'active'
    },
    {
        id: 10,
        name: 'Pierre Dubois',
        role: 'Finance Manager',
        department: 'finance',
        email: 'pierre.dubois@cax.com',
        phone: '+33 1 23 45 67 98',
        hireDate: '2017-06-05',
        salary: 'Level 8',
        status: 'active'
    },
    { id: 11, name: 'Véronique Rousseau', role: 'Senior Developer', department: 'it', email: 'veronique.rousseau@cax.com', phone: '+33 1 23 45 67 99', hireDate: '2018-02-10', salary: 'Level 7', status: 'active' },
    { id: 12, name: 'Frédéric Moreau', role: 'System Administrator', department: 'it', email: 'frederic.moreau@cax.com', phone: '+33 1 23 45 68 00', hireDate: '2019-11-15', salary: 'Level 6', status: 'active' },
    { id: 13, name: 'Caroline Petit', role: 'HR Specialist', department: 'hr', email: 'caroline.petit@cax.com', phone: '+33 1 23 45 68 01', hireDate: '2021-05-20', salary: 'Level 5', status: 'active' },
    { id: 14, name: 'Laurent Garnier', role: 'Finance Director', department: 'finance', email: 'laurent.garnier@cax.com', phone: '+33 1 23 45 68 02', hireDate: '2016-08-01', salary: 'Level 9', status: 'active' },
    { id: 15, name: 'Isabelle Gallet', role: 'DevOps Engineer', department: 'it', email: 'isabelle.gallet@cax.com', phone: '+33 1 23 45 68 03', hireDate: '2020-03-15', salary: 'Level 7', status: 'active' },
    { id: 16, name: 'Nicolas Fabre', role: 'Business Analyst', department: 'it', email: 'nicolas.fabre@cax.com', phone: '+33 1 23 45 68 04', hireDate: '2021-01-10', salary: 'Level 6', status: 'active' },
    { id: 17, name: 'Marianne Chevalier', role: 'Accountant', department: 'finance', email: 'marianne.chevalier@cax.com', phone: '+33 1 23 45 68 05', hireDate: '2019-09-01', salary: 'Level 5', status: 'active' },
    { id: 18, name: 'Pascal Vidal', role: 'IT Support', department: 'it', email: 'pascal.vidal@cax.com', phone: '+33 1 23 45 68 06', hireDate: '2022-04-15', salary: 'Level 4', status: 'active' },
    { id: 19, name: 'Delphine Gros', role: 'HR Manager', department: 'hr', email: 'delphine.gros@cax.com', phone: '+33 1 23 45 68 07', hireDate: '2018-06-01', salary: 'Level 8', status: 'active' },
    { id: 20, name: 'Benjamin Lamy', role: 'Full Stack Developer', department: 'it', email: 'benjamin.lamy@cax.com', phone: '+33 1 23 45 68 08', hireDate: '2020-07-15', salary: 'Level 6', status: 'active' },
    { id: 21, name: 'Audrey Colin', role: 'Financial Controller', department: 'finance', email: 'audrey.colin@cax.com', phone: '+33 1 23 45 68 09', hireDate: '2017-10-15', salary: 'Level 7', status: 'active' },
    { id: 22, name: 'Thierry Blanc', role: 'QA Engineer', department: 'it', email: 'thierry.blanc@cax.com', phone: '+33 1 23 45 68 10', hireDate: '2021-02-01', salary: 'Level 6', status: 'active' },
    { id: 23, name: 'Nathalie Mercier', role: 'Admin Assistant', department: 'admin', email: 'nathalie.mercier@cax.com', phone: '+33 1 23 45 68 11', hireDate: '2020-01-15', salary: 'Level 3', status: 'active' },
    { id: 24, name: 'Christophe Arnaud', role: 'Network Engineer', department: 'it', email: 'christophe.arnaud@cax.com', phone: '+33 1 23 45 68 12', hireDate: '2019-03-01', salary: 'Level 7', status: 'active' },
    { id: 25, name: 'Solange Bernard', role: 'HR Coordinator', department: 'hr', email: 'solange.bernard@cax.com', phone: '+33 1 23 45 68 13', hireDate: '2022-01-10', salary: 'Level 4', status: 'active' },
    { id: 26, name: 'Raphaël Durand', role: 'Database Admin', department: 'it', email: 'raphael.durand@cax.com', phone: '+33 1 23 45 68 14', hireDate: '2018-09-01', salary: 'Level 7', status: 'active' },
    { id: 27, name: 'Valérie Legrand', role: 'Tax Specialist', department: 'finance', email: 'valerie.legrand@cax.com', phone: '+33 1 23 45 68 15', hireDate: '2018-05-15', salary: 'Level 6', status: 'active' },
    { id: 28, name: 'Olivier Germain', role: 'Project Manager', department: 'it', email: 'olivier.germain@cax.com', phone: '+33 1 23 45 68 16', hireDate: '2019-06-01', salary: 'Level 7', status: 'active' },
    { id: 29, name: 'Jacqueline Noel', role: 'Office Manager', department: 'admin', email: 'jacqueline.noel@cax.com', phone: '+33 1 23 45 68 17', hireDate: '2017-01-15', salary: 'Level 4', status: 'active' },
    { id: 30, name: 'Sébastien Roche', role: 'Backend Developer', department: 'it', email: 'sebastien.roche@cax.com', phone: '+33 1 23 45 68 18', hireDate: '2020-10-01', salary: 'Level 6', status: 'active' },
    { id: 31, name: 'Florence Poulain', role: 'Budget Analyst', department: 'finance', email: 'florence.poulain@cax.com', phone: '+33 1 23 45 68 19', hireDate: '2019-12-01', salary: 'Level 5', status: 'active' },
    { id: 32, name: 'Yves Girard', role: 'IT Security Officer', department: 'it', email: 'yves.girard@cax.com', phone: '+33 1 23 45 68 20', hireDate: '2018-08-15', salary: 'Level 8', status: 'active' },
    { id: 33, name: 'Monique Houde', role: 'Benefits Manager', department: 'hr', email: 'monique.houde@cax.com', phone: '+33 1 23 45 68 21', hireDate: '2017-11-01', salary: 'Level 6', status: 'active' },
    { id: 34, name: 'Gaston Blanc', role: 'Frontend Developer', department: 'it', email: 'gaston.blanc@cax.com', phone: '+33 1 23 45 68 22', hireDate: '2021-03-15', salary: 'Level 5', status: 'active' },
    { id: 35, name: 'Stéphanie Maric', role: 'Audit Manager', department: 'finance', email: 'stephanie.maric@cax.com', phone: '+33 1 23 45 68 23', hireDate: '2018-02-01', salary: 'Level 7', status: 'active' },
    { id: 36, name: 'Didier Gobert', role: 'Technical Lead', department: 'it', email: 'didier.gobert@cax.com', phone: '+33 1 23 45 68 24', hireDate: '2017-07-01', salary: 'Level 8', status: 'active' },
    { id: 37, name: 'Brigitte Chauvin', role: 'Recruitment Specialist', department: 'hr', email: 'brigitte.chauvin@cax.com', phone: '+33 1 23 45 68 25', hireDate: '2020-05-15', salary: 'Level 5', status: 'active' },
    { id: 38, name: 'Julien Collet', role: 'Infrastructure Engineer', department: 'it', email: 'julien.collet@cax.com', phone: '+33 1 23 45 68 26', hireDate: '2019-04-01', salary: 'Level 6', status: 'active' },
    { id: 39, name: 'Agnès Renault', role: 'Controller', department: 'finance', email: 'agnes.renault@cax.com', phone: '+33 1 23 45 68 27', hireDate: '2016-10-01', salary: 'Level 8', status: 'active' },
    { id: 40, name: 'Michaël Gautier', role: 'Software Architect', department: 'it', email: 'michael.gautier@cax.com', phone: '+33 1 23 45 68 28', hireDate: '2017-09-01', salary: 'Level 9', status: 'active' },
    { id: 41, name: 'Véronique Chartier', role: 'Learning Developer', department: 'hr', email: 'veronique.chartier@cax.com', phone: '+33 1 23 45 68 29', hireDate: '2021-06-01', salary: 'Level 5', status: 'active' },
    { id: 42, name: 'Adrien Ribeiro', role: 'UX Developer', department: 'it', email: 'adrien.ribeiro@cax.com', phone: '+33 1 23 45 68 30', hireDate: '2020-11-15', salary: 'Level 5', status: 'active' },
    { id: 43, name: 'Roxane Gallet', role: 'Financial Analyst', department: 'finance', email: 'roxane.gallet@cax.com', phone: '+33 1 23 45 68 31', hireDate: '2021-01-15', salary: 'Level 5', status: 'active' },
    { id: 44, name: 'Laurent Bernier', role: 'API Developer', department: 'it', email: 'laurent.bernier@cax.com', phone: '+33 1 23 45 68 32', hireDate: '2020-08-01', salary: 'Level 6', status: 'active' },
    { id: 45, name: 'Sylvie Bonny', role: 'HR Business Partner', department: 'hr', email: 'sylvie.bonny@cax.com', phone: '+33 1 23 45 68 33', hireDate: '2019-02-01', salary: 'Level 7', status: 'active' },
    { id: 46, name: 'Étienne Cotard', role: 'Data Analyst', department: 'it', email: 'etienne.cotard@cax.com', phone: '+33 1 23 45 68 34', hireDate: '2021-04-01', salary: 'Level 6', status: 'active' },
    { id: 47, name: 'Caroline Deschamps', role: 'Procurement Specialist', department: 'finance', email: 'caroline.deschamps@cax.com', phone: '+33 1 23 45 68 35', hireDate: '2020-02-15', salary: 'Level 5', status: 'active' },
    { id: 48, name: 'Maxime Faucheur', role: 'Mobile Developer', department: 'it', email: 'maxime.faucheur@cax.com', phone: '+33 1 23 45 68 36', hireDate: '2021-05-01', salary: 'Level 5', status: 'active' },
    { id: 49, name: 'Corinne Fortin', role: 'Grants Manager', department: 'finance', email: 'corinne.fortin@cax.com', phone: '+33 1 23 45 68 37', hireDate: '2018-11-01', salary: 'Level 6', status: 'active' },
    { id: 50, name: 'Philippe Grégoire', role: 'Lead Developer', department: 'it', email: 'philippe.gregoire@cax.com', phone: '+33 1 23 45 68 38', hireDate: '2017-03-15', salary: 'Level 8', status: 'active' },
    { id: 51, name: 'Nadia Hebert', role: 'Compensation Analyst', department: 'hr', email: 'nadia.hebert@cax.com', phone: '+33 1 23 45 68 39', hireDate: '2020-09-15', salary: 'Level 5', status: 'active' },
    { id: 52, name: 'Jérôme Ismail', role: 'Cloud Architect', department: 'it', email: 'jerome.ismail@cax.com', phone: '+33 1 23 45 68 40', hireDate: '2018-12-01', salary: 'Level 8', status: 'active' },
    { id: 53, name: 'Karine Janvier', role: 'Senior Accountant', department: 'finance', email: 'karine.janvier@cax.com', phone: '+33 1 23 45 68 41', hireDate: '2017-05-01', salary: 'Level 6', status: 'active' },
    { id: 54, name: 'Lucas Klein', role: 'IT Consultant', department: 'it', email: 'lucas.klein@cax.com', phone: '+33 1 23 45 68 42', hireDate: '2021-07-01', salary: 'Level 6', status: 'active' },
    { id: 55, name: 'Martine Lacroix', role: 'Payroll Manager', department: 'hr', email: 'martine.lacroix@cax.com', phone: '+33 1 23 45 68 43', hireDate: '2016-12-01', salary: 'Level 7', status: 'active' },
    { id: 56, name: 'Mathieu Lamarre', role: 'Test Automation', department: 'it', email: 'mathieu.lamarre@cax.com', phone: '+33 1 23 45 68 44', hireDate: '2020-06-01', salary: 'Level 5', status: 'active' },
    { id: 57, name: 'Pascale Lemaire', role: 'Expense Manager', department: 'finance', email: 'pascale.lemaire@cax.com', phone: '+33 1 23 45 68 45', hireDate: '2019-08-15', salary: 'Level 4', status: 'active' },
    { id: 58, name: 'Samuel Mercure', role: 'Performance Analyst', department: 'it', email: 'samuel.mercure@cax.com', phone: '+33 1 23 45 68 46', hireDate: '2020-12-01', salary: 'Level 6', status: 'active' },
    { id: 59, name: 'Thérèse Morin', role: 'Training Coordinator', department: 'hr', email: 'therese.morin@cax.com', phone: '+33 1 23 45 68 47', hireDate: '2021-08-15', salary: 'Level 4', status: 'active' },
    { id: 60, name: 'Vincent Moulin', role: 'Senior Architect', department: 'it', email: 'vincent.moulin@cax.com', phone: '+33 1 23 45 68 48', hireDate: '2016-04-01', salary: 'Level 9', status: 'active' }
];

let currentUser = '';
let userRole = '';
let filteredEmployees = [...employees];
let currentView = 'card'; // 'card' or 'list'

document.addEventListener('DOMContentLoaded', () => {
    // Récupérer les infos utilisateur
    currentUser = auth.getUsername();
    
    // Déterminer le rôle (CEO ou utilisateur régulier)
    userRole = currentUser === 'ceo' ? 'ceo' : 'user';
    
    // Mettre à jour le niveau d'accès
    const accessLevel = document.getElementById('accessLevel');
    if (userRole === 'ceo') {
        accessLevel.textContent = 'Full administrative access - CEO';
    } else {
        accessLevel.textContent = 'View only - Regular employee';
    }

    // Afficher les employés
    displayEmployees(employees);

    // Filtrage
    document.getElementById('searchEmployee').addEventListener('input', filterEmployees);
    document.getElementById('departmentFilter').addEventListener('change', filterEmployees);

    // View toggle
    document.getElementById('cardViewBtn').addEventListener('click', () => switchView('card'));
    document.getElementById('listViewBtn').addEventListener('click', () => switchView('list'));

    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('employeeModal').addEventListener('click', (e) => {
        if (e.target.id === 'employeeModal') closeModal();
    });
});

function displayEmployees(empList) {
    const container = document.getElementById('employeesList');
    container.innerHTML = '';
    container.className = currentView === 'list' ? 'employees-grid list-view' : 'employees-grid';

    empList.forEach(emp => {
        const card = document.createElement('div');
        card.className = `employee-card-large ${currentView === 'list' ? 'list-view' : ''}`;
        
        if (currentView === 'card') {
            card.innerHTML = `
                <div class="employee-header">
                    <h3>${emp.name}</h3>
                    ${emp.status === 'terminated' ? '<span class="status-badge terminated">Terminated</span>' : '<span class="status-badge active">Active</span>'}
                </div>
                <p class="employee-role">${emp.role}</p>
                <p class="employee-dept">${emp.department.toUpperCase()}</p>
                <button class="btn-view-details">View Details</button>
            `;
        } else {
            // List view
            card.innerHTML = `
                <div class="employee-header">
                    <h3>${emp.name}</h3>
                    ${emp.status === 'terminated' ? '<span class="status-badge terminated">Terminated</span>' : '<span class="status-badge active">Active</span>'}
                </div>
                <p class="employee-role">${emp.role}</p>
                <p class="employee-dept">${emp.department.toUpperCase()}</p>
                <button class="btn-view-details">View Details</button>
            `;
        }
        
        card.addEventListener('click', () => openEmployeeModal(emp));
        container.appendChild(card);
    });
}

function filterEmployees() {
    const search = document.getElementById('searchEmployee').value.toLowerCase();
    const dept = document.getElementById('departmentFilter').value;

    filteredEmployees = employees.filter(emp => {
        const matchSearch = emp.name.toLowerCase().includes(search) || 
                          emp.email.toLowerCase().includes(search);
        const matchDept = !dept || emp.department === dept;
        return matchSearch && matchDept;
    });

    displayEmployees(filteredEmployees);
}

function openEmployeeModal(employee) {
    const modal = document.getElementById('employeeModal');
    
    document.getElementById('modalEmployeeName').textContent = employee.name;
    document.getElementById('detailName').textContent = employee.name;
    document.getElementById('detailRole').textContent = employee.role;
    document.getElementById('detailDept').textContent = employee.department.toUpperCase();
    document.getElementById('detailEmail').textContent = employee.email;
    document.getElementById('detailPhone').textContent = employee.phone;
    document.getElementById('detailHireDate').textContent = new Date(employee.hireDate).toLocaleDateString('fr-FR');
    document.getElementById('detailSalary').textContent = employee.salary;
    document.getElementById('detailStatus').textContent = employee.status === 'active' ? 'Active' : 'Terminated';

    // Afficher les actions CEO seulement si utilisateur est CEO
    const ceoActions = document.getElementById('ceoActions');
    if (userRole === 'ceo') {
        ceoActions.style.display = 'block';
        
        const fireBtn = document.getElementById('fireBtn');
        fireBtn.onclick = () => terminateEmployee(employee);
        
        // Désactiver le bouton si déjà terminé
        if (employee.status === 'terminated') {
            fireBtn.disabled = true;
            fireBtn.textContent = 'Already Terminated';
        } else {
            fireBtn.disabled = false;
            fireBtn.textContent = 'Terminate Employment';
        }
    } else {
        ceoActions.style.display = 'none';
    }

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
}

function switchView(view) {
    currentView = view;
    
    // Update button states
    document.getElementById('cardViewBtn').classList.toggle('active', view === 'card');
    document.getElementById('listViewBtn').classList.toggle('active', view === 'list');
    
    // Redisplay with new view
    displayEmployees(filteredEmployees);
}

function terminateEmployee(employee) {
    if (confirm(`Are you sure you want to terminate ${employee.name}? This action cannot be undone.`)) {
        employee.status = 'terminated';
        
        // Sauvegarder dans localStorage
        let terminatedList = JSON.parse(localStorage.getItem('terminatedEmployees') || '[]');
        terminatedList.push({
            employeeId: employee.id,
            employeeName: employee.name,
            terminationDate: new Date().toISOString(),
            terminatedBy: currentUser
        });
        localStorage.setItem('terminatedEmployees', JSON.stringify(terminatedList));

        // Afficher le modal avec confirmation
        alert(`${employee.name} has been terminated from the system.`);
        
        // Rafraîchir l'affichage
        displayEmployees(filteredEmployees);
        closeModal();
    }
}
