// Divisions management for inline section in dashboard
let currentDivisionId = null;

// Dynamic API base - use local server for localhost, Render for production
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://${window.location.hostname}:3000/api/divisions`
    : 'https://cax-intranet-server.onrender.com/api/divisions';

console.log('Using API endpoint:', API_BASE);

// Local storage key for divisions
const DIVISIONS_STORAGE_KEY = 'caxDivisions';

// Helper function to add random delay (800-1500ms for realism)
function getRandomDelay() {
    return Math.random() * 700 + 800; // 800-1500ms
}

// Helper to simulate network delay
async function simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, getRandomDelay()));
}

// Local storage functions for divisions
function saveDivisionsLocally(divisions) {
    try {
        localStorage.setItem(DIVISIONS_STORAGE_KEY, JSON.stringify(divisions));
        console.log('Divisions saved to localStorage');
    } catch (error) {
        console.error('Error saving divisions to localStorage:', error);
    }
}

function loadDivisionsLocally() {
    try {
        const stored = localStorage.getItem(DIVISIONS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading divisions from localStorage:', error);
        return [];
    }
}

// Loading spinner management
function showLoader(message = 'Loading...') {
    let loader = document.getElementById('divisionsLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'divisionsLoader';
        loader.innerHTML = `
            <div class="loader-overlay">
                <div class="loader-spinner">
                    <div class="loader-circle"></div>
                    <p>${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.getElementById('divisionsLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

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
    const exportButtons = document.querySelectorAll('.btn-export, #exportDivisionsCSV, #exportDivisionsJSON, #exportDivisionsPDF, #exportDivisionsTXT');
    
    console.log('Checking divisions access for user:', currentUser);
    
    // Verify if user is CEO
    let isCEO = false;
    if (typeof DATABASE !== 'undefined' && DATABASE.getActiveEmployees) {
        try {
            const employees = DATABASE.getActiveEmployees();
            for (const user of employees) {
                if (user && user.username === currentUser && user.role === 'ceo') {
                    isCEO = true;
                    break;
                }
            }
        } catch (error) {
            console.error('Error checking CEO status:', error);
        }
    } else {
        console.warn('DATABASE not available');
    }
    
    console.log('User is CEO:', isCEO);
    console.log('Export buttons found:', exportButtons.length);
    
    // Show divisions section only for CEO
    if (isCEO && divisionsLink) {
        console.log('Showing divisions section for CEO');
        divisionsLink.style.display = 'inline-block';
        if (addBtn) addBtn.style.display = 'block';
        exportButtons.forEach(btn => {
            btn.style.display = 'block';
            console.log('Showed button:', btn.id);
        });
        
        // Setup event listeners
        setupDivisionsEventListeners();
        
        // Load divisions
        loadDivisions();
    } else {
        console.log('Hiding divisions section');
    }
}

function setupDivisionsEventListeners() {
    const divisionForm = document.getElementById('divisionForm');
    const divisionModal = document.getElementById('divisionModal');
    const addBtn = document.getElementById('addDivisionBtn');
    const cancelBtn = document.getElementById('cancelDivisionBtn');
    const exportCSVBtn = document.getElementById('exportDivisionsCSV');
    const exportJSONBtn = document.getElementById('exportDivisionsJSON');
    const exportPDFBtn = document.getElementById('exportDivisionsPDF');
    const exportTXTBtn = document.getElementById('exportDivisionsTXT');
    
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
    
    if (exportPDFBtn) {
        exportPDFBtn.addEventListener('click', exportDivisionsPDF);
    }
    
    if (exportTXTBtn) {
        exportTXTBtn.addEventListener('click', exportDivisionsTXT);
    }
}

async function loadDivisions() {
    try {
        showLoader('Loading divisions...');
        console.log('Loading divisions from:', API_BASE);
        const response = await fetch(`${API_BASE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Simulate network delay for visual feedback
        await simulateDelay();
        
        console.log('Divisions data received:', data);
        
        const divisions = data.divisions || [];
        
        // Save to localStorage as backup
        saveDivisionsLocally(divisions);
        
        displayDivisions(divisions);
    } catch (error) {
        console.error('Error loading divisions from server:', error);
        
        // Fallback to localStorage
        console.log('Falling back to localStorage...');
        const localDivisions = loadDivisionsLocally();
        
        if (localDivisions.length > 0) {
            console.log('Loaded divisions from localStorage:', localDivisions);
            displayDivisions(localDivisions);
        } else {
            // No data anywhere
            const grid = document.getElementById('divisionsGrid');
            if (grid) {
                grid.innerHTML = `<p style="grid-column: 1/-1; color: #666;">Error loading divisions. Please try again later.</p>`;
            }
        }
    } finally {
        hideLoader();
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
    showLoader('Saving division...');
    const name = document.getElementById('divisionName').value.trim();
    const location = document.getElementById('divisionLocation').value.trim();
    const head = document.getElementById('divisionHead').value.trim();
    const employees = parseInt(document.getElementById('divisionEmployees').value) || 0;
    const description = document.getElementById('divisionDescription').value.trim();
    
    if (!name) {
        alert('Division name is required');
        hideLoader();
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

        const responseData = await response.json();
        
        // Simulate network delay
        await simulateDelay();
        
        // Update localStorage with the saved division
        const localDivisions = loadDivisionsLocally();
        
        if (currentDivisionId === null && responseData.division) {
            // New division - add it
            localDivisions.push(responseData.division);
        } else if (currentDivisionId !== null && responseData.division) {
            // Update existing - find and update
            const index = localDivisions.findIndex(d => d.id === responseData.division.id);
            if (index !== -1) {
                localDivisions[index] = responseData.division;
            } else {
                localDivisions.push(responseData.division);
            }
        }
        
        saveDivisionsLocally(localDivisions);
        
        closeModal();
        loadDivisions();
        
        // Show success message
        showSuccessMessage('Division saved successfully!');
    } catch (error) {
        console.error('Error saving division:', error);
        
        // Fallback: save to localStorage anyway
        try {
            const localDivisions = loadDivisionsLocally();
            
            if (currentDivisionId === null) {
                // Create new division with local ID
                const newId = localDivisions.length > 0 ? Math.max(...localDivisions.map(d => d.id || 0)) + 1 : 1;
                localDivisions.push({
                    id: newId,
                    ...divisionData
                });
            } else {
                // Update existing
                const index = localDivisions.findIndex(d => d.id === currentDivisionId);
                if (index !== -1) {
                    localDivisions[index] = {
                        id: currentDivisionId,
                        ...divisionData
                    };
                } else {
                    localDivisions.push({
                        id: currentDivisionId,
                        ...divisionData
                    });
                }
            }
            
            saveDivisionsLocally(localDivisions);
            
            closeModal();
            loadDivisions();
            
            alert('Division saved locally (offline mode)');
            console.log('Division saved to localStorage only');
        } catch (fallbackError) {
            console.error('Fallback save also failed:', fallbackError);
            alert('Error saving division: ' + error.message);
        }
        
        hideLoader();
    }
}

function confirmDelete(id) {
    // Try to get division name from localStorage first, then from server
    let division = null;
    
    // Check localStorage
    const localDivisions = loadDivisionsLocally();
    division = localDivisions.find(d => d.id === id);
    
    // If not in localStorage, try server
    if (!division) {
        fetch(API_BASE)
            .then(res => res.json())
            .then(data => {
                division = data.divisions ? data.divisions.find(d => d.id === id) : null;
                if (!division) return;
                
                if (confirm(`Are you sure you want to delete "${division.name}"?`)) {
                    deleteDivision(id);
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        // Division found in localStorage
        if (confirm(`Are you sure you want to delete "${division.name}"?`)) {
            deleteDivision(id);
        }
    }
}

async function deleteDivision(id) {
    try {
        showLoader('Deleting division...');
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        // Simulate network delay
        await simulateDelay();
        
        // Remove from localStorage
        const localDivisions = loadDivisionsLocally();
        const filtered = localDivisions.filter(d => d.id !== id);
        saveDivisionsLocally(filtered);
        
        loadDivisions();
        showSuccessMessage('Division deleted successfully!');
    } catch (error) {
        console.error('Error deleting division:', error);
        
        // Fallback: try to delete from localStorage anyway
        try {
            const localDivisions = loadDivisionsLocally();
            const filtered = localDivisions.filter(d => d.id !== id);
            saveDivisionsLocally(filtered);
            
            loadDivisions();
            
            alert('Division deleted locally (offline mode)');
            console.log('Division removed from localStorage only');
        } catch (fallbackError) {
            console.error('Fallback delete also failed:', fallbackError);
            alert('Error deleting division');
        }
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

async function exportDivisionsTXT() {
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        const divisions = data.divisions || [];
        
        if (divisions.length === 0) {
            alert('No divisions to export');
            return;
        }
        
        let txt = '='.repeat(70) + '\n';
        txt += 'CAX CORPORATION - DIVISIONS REPORT\n';
        txt += '='.repeat(70) + '\n';
        txt += `Generated: ${new Date().toLocaleString()}\n\n`;
        
        divisions.forEach((division, index) => {
            txt += `-`.repeat(70) + '\n';
            txt += `#${index + 1} - ${division.name}\n`;
            txt += `-`.repeat(70) + '\n';
            txt += `ID: ${division.id}\n`;
            txt += `Location: ${division.location || 'N/A'}\n`;
            txt += `Head: ${division.head || 'N/A'}\n`;
            txt += `Employees: ${division.employees || 0}\n`;
            txt += `Description: ${division.description || 'No description'}\n`;
            txt += '\n';
        });
        
        txt += '='.repeat(70) + '\n';
        txt += `Total Divisions: ${divisions.length}\n`;
        txt += `Total Employees: ${divisions.reduce((sum, d) => sum + (d.employees || 0), 0)}\n`;
        txt += '='.repeat(70) + '\n';
        
        downloadFile(txt, 'divisions.txt', 'text/plain');
    } catch (error) {
        console.error('Error exporting TXT:', error);
        alert('Error exporting divisions');
    }
}

async function exportDivisionsPDF() {
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        const divisions = data.divisions || [];
        
        if (divisions.length === 0) {
            alert('No divisions to export');
            return;
        }
        
        // Create PDF content manually (simple text-based)
        let pdfContent = generatePDFContent(divisions);
        
        // For a simple solution, we'll create a formatted HTML and let browser print to PDF
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>CAX Corporation - Divisions Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                    h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                    .division { margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 4px; }
                    .division h2 { margin: 0 0 10px 0; font-size: 18px; }
                    .field { margin: 5px 0; }
                    .label { font-weight: bold; display: inline-block; width: 120px; }
                    .summary { margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 4px; text-align: center; }
                    @media print { body { margin: 10px; } }
                </style>
            </head>
            <body>
                <h1>CAX Corporation - Divisions Report</h1>
                <p style="text-align: center; color: #666;">Generated: ${new Date().toLocaleString()}</p>
        `);
        
        divisions.forEach((division, index) => {
            printWindow.document.write(`
                <div class="division">
                    <h2>#${index + 1} - ${division.name}</h2>
                    <div class="field"><span class="label">ID:</span> ${division.id}</div>
                    <div class="field"><span class="label">Location:</span> ${division.location || 'N/A'}</div>
                    <div class="field"><span class="label">Head:</span> ${division.head || 'N/A'}</div>
                    <div class="field"><span class="label">Employees:</span> ${division.employees || 0}</div>
                    <div class="field"><span class="label">Description:</span> ${division.description || 'No description'}</div>
                </div>
            `);
        });
        
        const totalEmployees = divisions.reduce((sum, d) => sum + (d.employees || 0), 0);
        printWindow.document.write(`
                <div class="summary">
                    <strong>Summary:</strong> ${divisions.length} divisions with ${totalEmployees} total employees
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        
        // Auto-trigger print dialog
        setTimeout(() => {
            printWindow.print();
        }, 250);
        
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Error exporting divisions');
    }
}

function generatePDFContent(divisions) {
    // This is just a helper function - actual PDF generation happens in browser print
    return divisions.map(d => ({
        id: d.id,
        name: d.name,
        location: d.location,
        head: d.head,
        employees: d.employees,
        description: d.description
    }));
}

function showSuccessMessage(message) {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; padding: 15px 20px; border-radius: 4px; z-index: 2000; font-size: 14px;';
    successMsg.textContent = message;
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
}
