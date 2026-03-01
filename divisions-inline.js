// Divisions management for inline section in dashboard
let currentDivisionId = null;
const API_BASE = 'https://cax-intranet-server.onrender.com/api/divisions';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        checkDivisionsAccess();
    } catch (error) {
        console.error('Error initializing divisions:', error);
    }
});

function checkDivisionsAccess() {
    const currentUser = sessionStorage.getItem('username');
    const divisionsLink = document.getElementById('divisionsNavLink');
    const addBtn = document.getElementById('addDivisionBtn');
    const exportButtons = document.querySelectorAll('#exportDivisionsCSV, #exportDivisionsJSON');
    
    // Verify if user is CEO
    let isCEO = false;
    if (typeof DATABASE !== 'undefined' && DATABASE.getActiveEmployees) {
        const employees = DATABASE.getActiveEmployees();
        for (const user of employees) {
            if (user && user.username === currentUser && user.role === 'ceo') {
                isCEO = true;
                break;
            }
        }
    }
    
    // Show divisions section only for CEO
    if (isCEO && divisionsLink) {
        divisionsLink.style.display = 'inline-block';
        if (addBtn) addBtn.style.display = 'block';
        exportButtons.forEach(btn => btn.style.display = 'block');
        
        // Setup event listeners
        setupDivisionsEventListeners();
        
        // Load divisions
        loadDivisions();
    }
}

function setupDivisionsEventListeners() {
    const divisionForm = document.getElementById('divisionForm');
    const divisionModal = document.getElementById('divisionModal');
    const addBtn = document.getElementById('addDivisionBtn');
    const cancelBtn = document.getElementById('cancelDivisionBtn');
    const exportCSVBtn = document.getElementById('exportDivisionsCSV');
    const exportJSONBtn = document.getElementById('exportDivisionsJSON');
    
    if (divisionForm) {
        divisionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveDivision();
        });
    }
    
    if (divisionModal) {
        divisionModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', openAddModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', exportDivisions);
    }
    
    if (exportJSONBtn) {
        exportJSONBtn.addEventListener('click', exportDivisionsJSON);
    }
}

async function loadDivisions() {
    try {
        const response = await fetch(`${API_BASE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        const divisions = data.divisions || [];
        
        displayDivisions(divisions);
    } catch (error) {
        console.error('Error loading divisions:', error);
        // Fallback to showing message
        const grid = document.getElementById('divisionsGrid');
        if (grid) {
            grid.innerHTML = '<p style="grid-column: 1/-1; color: #666;">Error loading divisions. Please try again.</p>';
        }
    }
}

function displayDivisions(divisions) {
    const grid = document.getElementById('divisionsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid || !emptyState) return;
    
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
    
    console.log(`Loaded ${divisions.length} divisions`);
}

function openAddModal() {
    currentDivisionId = null;
    document.getElementById('modalTitle').textContent = 'Add Division';
    document.getElementById('divisionForm').reset();
    document.getElementById('divisionModal').style.display = 'flex';
}

function openEditModal(id) {
    // Fetch division data to populate form
    fetch(`${API_BASE}`)
        .then(res => res.json())
        .then(data => {
            const division = data.divisions.find(d => d.id === id);
            if (!division) return;
            
            currentDivisionId = id;
            document.getElementById('modalTitle').textContent = 'Edit Division';
            document.getElementById('divisionName').value = division.name;
            document.getElementById('divisionLocation').value = division.location || '';
            document.getElementById('divisionHead').value = division.head || '';
            document.getElementById('divisionEmployees').value = division.employees || '';
            document.getElementById('divisionDescription').value = division.description || '';
            
            document.getElementById('divisionModal').style.display = 'flex';
        })
        .catch(error => console.error('Error loading division:', error));
}

function closeModal() {
    document.getElementById('divisionModal').style.display = 'none';
    currentDivisionId = null;
}

async function saveDivision() {
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
    
    try {
        let response;
        
        if (currentDivisionId === null) {
            // Add new division
            response = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(divisionData)
            });
        } else {
            // Update existing division
            response = await fetch(`${API_BASE}/${currentDivisionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(divisionData)
            });
        }
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        closeModal();
        loadDivisions();
        
        // Show success message
        showSuccessMessage('Division saved successfully!');
    } catch (error) {
        console.error('Error saving division:', error);
        alert('Error saving division: ' + error.message);
    }
}

function confirmDelete(id) {
    // Fetch to get division name
    fetch(API_BASE)
        .then(res => res.json())
        .then(data => {
            const division = data.divisions.find(d => d.id === id);
            if (!division) return;
            
            if (confirm(`Are you sure you want to delete "${division.name}"?`)) {
                deleteDivision(id);
            }
        })
        .catch(error => console.error('Error:', error));
}

async function deleteDivision(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        loadDivisions();
        showSuccessMessage('Division deleted successfully!');
    } catch (error) {
        console.error('Error deleting division:', error);
        alert('Error deleting division');
    }
}

async function exportDivisions() {
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        const divisions = data.divisions || [];
        
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
    } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('Error exporting divisions');
    }
}

async function exportDivisionsJSON() {
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        const divisions = data.divisions || [];
        
        if (divisions.length === 0) {
            alert('No divisions to export');
            return;
        }
        
        const json = JSON.stringify(divisions, null, 2);
        downloadFile(json, 'divisions.json', 'application/json');
    } catch (error) {
        console.error('Error exporting JSON:', error);
        alert('Error exporting divisions');
    }
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

function showSuccessMessage(message) {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; padding: 15px 20px; border-radius: 4px; z-index: 2000; font-size: 14px;';
    successMsg.textContent = message;
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
}
