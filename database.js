// ============================================================
// BASE DE DONNÉES DES EMPLOYÉS - CAX Corporation
// ============================================================
// Chaque employé est aussi un utilisateur par défaut du système

const DATABASE = {
    employees: [
        // CADRES DIRIGEANTS
        {
            id: 'EMP001',
            username: 'ceo',
            password: '@C_astlefox:13',
            firstName: 'Thomas',
            lastName: 'Barial',
            email: 'ceo@cax-corp.com',
            department: 'Executive',
            position: 'Chief Executive Officer',
            role: 'ceo',
            status: 'active',
            dateHired: '2021-01-01',
            salary: 750000,
            location: 'Châteaurenard',
            phone: '+33 6 33 14 24 31'
        },
        {
            id: 'EMP002',
            username: 'admin',
            password: 'intranet2026',
            firstName: 'Marie',
            lastName: 'Dubois',
            email: 'm.dubois@cax.fr',
            department: 'Administration',
            position: 'Administrator',
            role: 'admin',
            status: 'active',
            dateHired: '2015-06-01',
            salary: 65000,
            location: 'Châteaurenard',
            phone: '+33 1 23 45 67 90'
        },
        {
            id: 'EMP003',
            username: 'user',
            password: 'user1234',
            firstName: 'Jean',
            lastName: 'Martin',
            email: 'j.martin@cax.fr',
            department: 'IT',
            position: 'Software Developer',
            role: 'user',
            status: 'active',
            dateHired: '2018-09-10',
            salary: 55000,
            location: 'Châteaurenard',
            phone: '+33 1 23 45 67 91'
        },
        {
            id: 'EMP004',
            username: 'test',
            password: 'test1234',
            firstName: 'Pierre',
            lastName: 'Leclerc',
            email: 'p.leclerc@cax.fr',
            department: 'Quality Assurance',
            position: 'QA Engineer',
            role: 'user',
            status: 'active',
            dateHired: '2019-02-20',
            salary: 48000,
            location: 'Châteaurenard',
            phone: '+33 1 23 45 67 92'
        },

        // IT DEPARTMENT
        {
            id: 'EMP005',
            username: 'tsouquet',
            password: 'tech2026',
            firstName: 'Thomas',
            lastName: 'Souquet',
            email: 't.souquet@cax.fr',
            department: 'IT',
            position: 'Senior DevOps Engineer',
            role: 'user',
            status: 'active',
            dateHired: '2016-03-15',
            salary: 72000,
            location: 'Paris',
            phone: '+33 1 23 45 67 93'
        },
        {
            id: 'EMP006',
            username: 'lrodriguez',
            password: 'secure2026',
            firstName: 'Laura',
            lastName: 'Rodriguez',
            email: 'l.rodriguez@cax.fr',
            department: 'IT',
            position: 'Cybersecurity Specialist',
            role: 'user',
            status: 'active',
            dateHired: '2017-07-01',
            salary: 68000,
            location: 'Paris',
            phone: '+33 1 23 45 67 94'
        },
        {
            id: 'EMP007',
            username: 'mchen',
            password: 'network2026',
            firstName: 'Ming',
            lastName: 'Chen',
            email: 'm.chen@cax.fr',
            department: 'IT',
            position: 'Network Administrator',
            role: 'user',
            status: 'active',
            dateHired: '2015-11-20',
            salary: 58000,
            location: 'Châteaurenard',
            phone: '+33 1 23 45 67 95'
        },

        // FINANCE DEPARTMENT
        {
            id: 'EMP008',
            username: 'jmartinez',
            password: 'finance2026',
            firstName: 'José',
            lastName: 'Martinez',
            email: 'j.martinez@cax.fr',
            department: 'Finance',
            position: 'Finance Director',
            role: 'user',
            status: 'active',
            dateHired: '2010-01-15',
            salary: 95000,
            location: 'Châteaurenard',
            phone: '+33 1 23 45 67 96'
        },
        {
            id: 'EMP009',
            username: 'ssophie',
            password: 'accounts2026',
            firstName: 'Sophie',
            lastName: 'Lemoine',
            email: 's.lemoine@cax.fr',
            department: 'Finance',
            position: 'Accountant',
            role: 'user',
            status: 'active',
            dateHired: '2019-03-01',
            salary: 42000,
            location: 'Paris',
            phone: '+33 1 23 45 67 97'
        },

        // SALES DEPARTMENT
        {
            id: 'EMP010',
            username: 'djones',
            password: 'sales2026',
            firstName: 'David',
            lastName: 'Jones',
            email: 'd.jones@cax.fr',
            department: 'Sales',
            position: 'Sales Manager',
            role: 'user',
            status: 'active',
            dateHired: '2014-05-10',
            salary: 75000,
            location: 'New York',
            phone: '+1 212 555 0101'
        },
        {
            id: 'EMP011',
            username: 'amoore',
            password: 'sales2026',
            firstName: 'Amanda',
            lastName: 'Moore',
            email: 'a.moore@cax.fr',
            department: 'Sales',
            position: 'Sales Executive',
            role: 'user',
            status: 'active',
            dateHired: '2020-01-15',
            salary: 52000,
            location: 'London',
            phone: '+44 20 7946 0958'
        },

        // HR DEPARTMENT
        {
            id: 'EMP012',
            username: 'kmiller',
            password: 'hr2026',
            firstName: 'Kate',
            lastName: 'Miller',
            email: 'k.miller@cax.fr',
            department: 'HR',
            position: 'HR Manager',
            role: 'user',
            status: 'active',
            dateHired: '2016-08-01',
            salary: 58000,
            location: 'Châteaurenard',
            phone: '+33 1 23 45 67 98'
        },
        {
            id: 'EMP013',
            username: 'rgarcia',
            password: 'recruit2026',
            firstName: 'Rosa',
            lastName: 'Garcia',
            email: 'r.garcia@cax.fr',
            department: 'HR',
            position: 'Recruiter',
            role: 'user',
            status: 'active',
            dateHired: '2018-02-20',
            salary: 45000,
            location: 'Barcelona',
            phone: '+34 93 123 45 67'
        },

        // MARKETING DEPARTMENT
        {
            id: 'EMP014',
            username: 'ewilson',
            password: 'marketing2026',
            firstName: 'Emily',
            lastName: 'Wilson',
            email: 'e.wilson@cax.fr',
            department: 'Marketing',
            position: 'Marketing Director',
            role: 'user',
            status: 'active',
            dateHired: '2015-09-10',
            salary: 70000,
            location: 'Paris',
            phone: '+33 1 23 45 67 99'
        },
        {
            id: 'EMP015',
            username: 'jlewis',
            password: 'marketing2026',
            firstName: 'James',
            lastName: 'Lewis',
            email: 'j.lewis@cax.fr',
            department: 'Marketing',
            position: 'Content Strategist',
            role: 'user',
            status: 'active',
            dateHired: '2019-06-01',
            salary: 50000,
            location: 'London',
            phone: '+44 20 7946 0959'
        },

        // OPERATIONS DEPARTMENT
        {
            id: 'EMP016',
            username: 'ktanaka',
            password: 'ops2026',
            firstName: 'Kenji',
            lastName: 'Tanaka',
            email: 'k.tanaka@cax.fr',
            department: 'Operations',
            position: 'Operations Manager',
            role: 'user',
            status: 'active',
            dateHired: '2013-04-15',
            salary: 68000,
            location: 'Tokyo',
            phone: '+81 3 1234 5678'
        },
        {
            id: 'EMP017',
            username: 'shuang',
            password: 'logistics2026',
            firstName: 'Shuang',
            lastName: 'Wang',
            email: 's.wang@cax.fr',
            department: 'Operations',
            position: 'Logistics Coordinator',
            role: 'user',
            status: 'active',
            dateHired: '2018-10-01',
            salary: 38000,
            location: 'Shanghai',
            phone: '+86 21 1234 5678'
        },

        // AEROSPACE DIVISION
        {
            id: 'EMP018',
            username: 'rsteele',
            password: 'aerospace2026',
            firstName: 'Richard',
            lastName: 'Steele',
            email: 'r.steele@cax.fr',
            department: 'Aerospace',
            position: 'Chief Engineer - Orbital Systems',
            role: 'user',
            status: 'active',
            dateHired: '2012-01-10',
            salary: 125000,
            location: 'Châteaurenard',
            phone: '+33 1 23 45 67 00'
        },
        {
            id: 'EMP019',
            username: 'nkowalski',
            password: 'aerospace2026',
            firstName: 'Nicolas',
            lastName: 'Kowalski',
            email: 'n.kowalski@cax.fr',
            department: 'Aerospace',
            position: 'Aerospace Engineer',
            role: 'user',
            status: 'active',
            dateHired: '2017-05-20',
            salary: 95000,
            location: 'Toulouse',
            phone: '+33 5 61 12 34 56'
        },
        {
            id: 'EMP020',
            username: 'ayoussef',
            password: 'aerospace2026',
            firstName: 'Amira',
            lastName: 'Youssef',
            email: 'a.youssef@cax.fr',
            department: 'Aerospace',
            position: 'Systems Analyst',
            role: 'user',
            status: 'active',
            dateHired: '2019-08-15',
            salary: 72000,
            location: 'Paris',
            phone: '+33 1 23 45 67 01'
        }
    ],

    // Fonction pour obtenir un employé par username
    getEmployeeByUsername(username) {
        return this.employees.find(emp => emp.username === username);
    },

    // Fonction pour obtenir un employé par ID
    getEmployeeById(id) {
        return this.employees.find(emp => emp.id === id);
    },

    // Fonction pour obtenir tous les employés d'un département
    getEmployeesByDepartment(department) {
        return this.employees.filter(emp => emp.department === department);
    },

    // Fonction pour obtenir les employés actifs
    getActiveEmployees() {
        return this.employees.filter(emp => emp.status === 'active');
    },

    // Fonction pour obtenir les credentials (username/password) pour l'authentification
    getCredentials() {
        const credentials = {};
        this.employees.forEach(emp => {
            credentials[emp.username] = emp.password;
        });
        return credentials;
    },

    // Fonction pour ajouter un nouvel employé
    addEmployee(employee) {
        if (this.getEmployeeByUsername(employee.username)) {
            return { success: false, message: 'Employee already exists' };
        }
        employee.id = 'EMP' + String(this.employees.length + 1).padStart(3, '0');
        employee.status = employee.status || 'active';
        employee.dateHired = employee.dateHired || new Date().toISOString().split('T')[0];
        this.employees.push(employee);
        return { success: true, message: 'Employee added successfully', employee: employee };
    },

    // Fonction pour supprimer un employé
    deleteEmployee(username) {
        const index = this.employees.findIndex(emp => emp.username === username);
        if (index !== -1) {
            this.employees.splice(index, 1);
            return { success: true, message: 'Employee deleted successfully' };
        }
        return { success: false, message: 'Employee not found' };
    },

    // Fonction pour mettre à jour un employé
    updateEmployee(username, updates) {
        const employee = this.getEmployeeByUsername(username);
        if (employee) {
            Object.assign(employee, updates);
            return { success: true, message: 'Employee updated successfully', employee: employee };
        }
        return { success: false, message: 'Employee not found' };
    },

    // Fonction pour obtenir les statistiques
    getStatistics() {
        const total = this.employees.length;
        const active = this.getActiveEmployees().length;
        const byDepartment = {};

        this.employees.forEach(emp => {
            if (!byDepartment[emp.department]) {
                byDepartment[emp.department] = 0;
            }
            byDepartment[emp.department]++;
        });

        return {
            total: total,
            active: active,
            inactive: total - active,
            byDepartment: byDepartment
        };
},

    // Messages Storage
    messages: [],

    // Fonction pour ajouter un message
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

    // Fonction pour obtenir les messages entre deux utilisateurs
    getConversation(user1, user2) {
        return this.messages.filter(msg => 
            (msg.sender === user1 && msg.receiver === user2) ||
            (msg.sender === user2 && msg.receiver === user1)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },

    // Fonction pour obtenir les conversations d'un utilisateur
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

    // Fonction pour marquer les messages comme lus
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
