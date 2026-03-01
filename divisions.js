let currentDivisionId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAccessAndLoad();
});

document.getElementById('divisionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveDivision();
});

function checkAccessAndLoad() {
    const currentUser = sessionStorage.getItem('username');
    
    let isCEO = false;
    for (const user of DATABASE.getActiveEmployees()) {
        if (user.username === currentUser && user.role === 'ceo') {
            isCEO = true;
            break;
        }
    }

    if (!isCEO) {
        document.getElementById('accessDenied').style.display = 'block';
        document.getElementById('divisionsContent').style.display = 'none';
        return;
    }

    document.getElementById('divisionsContent').style.display = 'block';
    loadDivisions();
}

function loadDivisions() {
    const divisions = DATABASE.getDivisions();
    const grid = document.getElementById('divisionsGrid');
    const emptyState = document.getElementById('emptyState');

    grid.innerHTML = '';

    if (divisions.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    divisions.forEach(division => {
        const card = document.createElement('div');
        card.className = 'division-card';
        card.innerHTML = `
            <h3 class="division-name">${division.name}</h3>
            <div class="division-info"><strong>Location:</strong> ${division.location || 'N/A'}</div>
            <div class="division-info"><strong>Head:</strong> ${division.head || 'N/A'}</div>
            <div class="division-info"><strong>Employees:</strong> ${division.employees || 0}</div>
            <div class="division-info"><strong>Description:</strong> ${division.description || 'No description'}</div>
            <div class="division-actions">
                <button class="btn-edit" onclick="openEditModal(${division.id})">Edit</button>
                <button class="btn-delete" onclick="confirmDelete(${division.id})">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openAddModal() {
    currentDivisionId = null;
    document.getElementById('modalTitle').textContent = 'Add Division';
    document.getElementById('divisionForm').reset();
    document.getElementById('divisionModal').classList.add('active');
}

function openEditModal(id) {
    const divisions = DATABASE.getDivisions();
    const division = divisions.find(d => d.id === id);

    if (!division) return;

    currentDivisionId = id;
    document.getElementById('modalTitle').textContent = 'Edit Division';
    document.getElementById('divisionName').value = division.name;
    document.getElementById('divisionLocation').value = division.location || '';
    document.getElementById('divisionHead').value = division.head || '';
    document.getElementById('divisionEmployees').value = division.employees || '';
    document.getElementById('divisionDescription').value = division.description || '';

    document.getElementById('divisionModal').classList.add('active');
}

function closeModal() {
    document.getElementById('divisionModal').classList.remove('active');
    currentDivisionId = null;
}

function saveDivision() {
    const name = document.getElementById('divisionName').value.trim();
    const location = document.getElementById('divisionLocation').value.trim();
    const head = document.getElementById('divisionHead').value.trim();
    const employees = parseInt(document.getElementById('divisionEmployees').value) || 0;
    const description = document.getElementById('divisionDescription').value.trim();

    if (!name) {
        alert('Division name is required');
        return;
    }

    const divisionData = {
        name,
        location,
        head,
        employees,
        description
    };

    if (currentDivisionId === null) {
        DATABASE.addDivision(divisionData);
    } else {
        DATABASE.updateDivision(currentDivisionId, divisionData);
    }

    closeModal();
    loadDivisions();
}

function confirmDelete(id) {
    const divisions = DATABASE.getDivisions();
    const division = divisions.find(d => d.id === id);

    if (!division) return;

    if (confirm(`Are you sure you want to delete "${division.name}"?`)) {
        deleteDivision(id);
    }
}

function deleteDivision(id) {
    DATABASE.deleteDivision(id);
    loadDivisions();
}

function exportDivisions() {
    const divisions = DATABASE.getDivisions();

    if (divisions.length === 0) {
        alert('No divisions to export');
        return;
    }

    const headers = ['ID', 'Name', 'Location', 'Head', 'Employees', 'Description'];
    const rows = divisions.map(d => [
        d.id,
        d.name,
        d.location || '',
        d.head || '',
        d.employees || 0,
        d.description || ''
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => {
            if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
                return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
        }).join(',') + '\n';
    });

    downloadFile(csv, 'divisions.csv', 'text/csv');
}

function exportDivisionsJSON() {
    const divisions = DATABASE.getDivisions();

    if (divisions.length === 0) {
        alert('No divisions to export');
        return;
    }

    const json = JSON.stringify(divisions, null, 2);
    downloadFile(json, 'divisions.json', 'application/json');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Close modal when clicking outside
document.getElementById('divisionModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
