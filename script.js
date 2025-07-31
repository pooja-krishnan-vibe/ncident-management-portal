// Global variables
let incidents = [];
let shifts = [];
let currentShiftIndex = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeDefaultData();
    updateDashboard();
    updateShiftInfo();
    setInterval(updateShiftInfo, 60000); // Update every minute
});

// Load data from localStorage
function loadData() {
    const savedIncidents = localStorage.getItem('incidents');
    const savedShifts = localStorage.getItem('shifts');
    
    if (savedIncidents) {
        incidents = JSON.parse(savedIncidents);
    }
    
    if (savedShifts) {
        shifts = JSON.parse(savedShifts);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('incidents', JSON.stringify(incidents));
    localStorage.setItem('shifts', JSON.stringify(shifts));
}

// Initialize with default data if empty
function initializeDefaultData() {
    if (incidents.length === 0) {
        incidents = [
            {
                id: 'INC00674951',
                idealTime: '6PM to 3:30AM',
                uploadedBy: 'Arya',
                assignedTo: 'Syed',
                status: 'Transferred',
                uploadTime: new Date().toISOString()
            },
            {
                id: 'INC00775290',
                idealTime: 'PM To 05:00 AM',
                uploadedBy: 'Praveen',
                assignedTo: 'Vignesh',
                status: 'hold',
                uploadTime: new Date().toISOString()
            },
            {
                id: 'INC00774678',
                idealTime: '19 pm - 7:19 am',
                uploadedBy: 'Vineesha',
                assignedTo: 'Bharathi',
                status: 'Transferred',
                uploadTime: new Date().toISOString()
            },
            {
                id: 'INC00775202',
                idealTime: '10 PM to 4:00 AM',
                uploadedBy: 'Vineesha',
                assignedTo: 'Nandan',
                status: 'Confirmation',
                uploadTime: new Date().toISOString()
            },
            {
                id: 'INC00773788',
                idealTime: '30 PM -3:30 AM',
                uploadedBy: 'Vineesha',
                assignedTo: 'Syed',
                status: 'Transferred',
                uploadTime: new Date().toISOString()
            }
        ];
    }
    
    if (shifts.length === 0) {
        shifts = [
            {
                id: 1,
                name: 'Morning Shift',
                startTime: '06:00',
                endTime: '14:00',
                analyst: 'Arya'
            },
            {
                id: 2,
                name: 'Afternoon Shift',
                startTime: '14:00',
                endTime: '22:00',
                analyst: 'Praveen'
            },
            {
                id: 3,
                name: 'Night Shift',
                startTime: '22:00',
                endTime: '06:00',
                analyst: 'Syed'
            },
            {
                id: 4,
                name: 'Evening Support',
                startTime: '18:00',
                endTime: '02:00',
                analyst: 'Vignesh'
            },
            {
                id: 5,
                name: 'Weekend Shift',
                startTime: '09:00',
                endTime: '21:00',
                analyst: 'Bharathi'
            }
        ];
    }
    
    saveData();
}

// Update dashboard statistics and table
function updateDashboard() {
    updateStatistics();
    updateIncidentsTable();
}

// Update statistics cards
function updateStatistics() {
    const totalIncidents = incidents.length;
    const pendingIncidents = incidents.filter(inc => inc.status === 'hold').length;
    const transferredToday = incidents.filter(inc => {
        const today = new Date().toDateString();
        const incidentDate = new Date(inc.uploadTime).toDateString();
        return inc.status === 'Transferred' && incidentDate === today;
    }).length;
    
    const uniqueAnalysts = [...new Set(shifts.map(shift => shift.analyst))].length;
    
    document.getElementById('totalIncidents').textContent = totalIncidents;
    document.getElementById('pendingIncidents').textContent = pendingIncidents;
    document.getElementById('activeAnalysts').textContent = uniqueAnalysts;
    document.getElementById('transferredIncidents').textContent = transferredToday;
}

// Update incidents table
function updateIncidentsTable() {
    const tableBody = document.getElementById('incidentsTableBody');
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredIncidents = incidents;
    if (statusFilter) {
        filteredIncidents = incidents.filter(inc => inc.status === statusFilter);
    }
    
    tableBody.innerHTML = '';
    
    filteredIncidents.forEach((incident, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${incident.id}</strong></td>
            <td>${incident.idealTime}</td>
            <td>${incident.uploadedBy}</td>
            <td><span class="analyst-tag">${incident.assignedTo}</span></td>
            <td><span class="status-badge status-${incident.status.toLowerCase().replace(' ', '-')}">${incident.status}</span></td>
            <td>
                <button class="btn btn-small btn-outline" onclick="reassignIncident(${index})">
                    <i class="fas fa-user-edit"></i> Reassign
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteIncident(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update shift information
function updateShiftInfo() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Find current shift
    const currentShift = findCurrentShift(currentTimeString);
    const nextShift = findNextShift(currentTimeString);
    const onDutyAnalysts = getOnDutyAnalysts(currentTimeString);
    
    document.getElementById('currentShift').textContent = currentShift ? 
        `${currentShift.name} (${currentShift.startTime} - ${currentShift.endTime})` : 
        'No active shift';
    
    document.getElementById('nextShift').textContent = nextShift ? 
        `${nextShift.name} starts at ${nextShift.startTime}` : 
        'No upcoming shift';
    
    const onDutyContainer = document.getElementById('onDutyAnalysts');
    onDutyContainer.innerHTML = '';
    onDutyAnalysts.forEach(analyst => {
        const tag = document.createElement('span');
        tag.className = 'analyst-tag';
        tag.textContent = analyst;
        onDutyContainer.appendChild(tag);
    });
}

// Find current shift based on time
function findCurrentShift(currentTime) {
    return shifts.find(shift => {
        return isTimeInRange(currentTime, shift.startTime, shift.endTime);
    });
}

// Find next shift
function findNextShift(currentTime) {
    const sortedShifts = [...shifts].sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    for (let shift of sortedShifts) {
        if (shift.startTime > currentTime) {
            return shift;
        }
    }
    
    // If no shift found for today, return first shift of tomorrow
    return sortedShifts[0];
}

// Get analysts currently on duty
function getOnDutyAnalysts(currentTime) {
    const onDutyShifts = shifts.filter(shift => 
        isTimeInRange(currentTime, shift.startTime, shift.endTime)
    );
    return [...new Set(onDutyShifts.map(shift => shift.analyst))];
}

// Check if time is in range (handles overnight shifts)
function isTimeInRange(time, start, end) {
    if (start <= end) {
        return time >= start && time <= end;
    } else {
        // Overnight shift
        return time >= start || time <= end;
    }
}

// Auto-assign incident to analyst based on current shift
function autoAssignIncident(incident) {
    const currentTime = new Date();
    const currentTimeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
    
    const onDutyAnalysts = getOnDutyAnalysts(currentTimeString);
    
    if (onDutyAnalysts.length > 0) {
        // Round-robin assignment among on-duty analysts
        const assignedAnalyst = onDutyAnalysts[currentShiftIndex % onDutyAnalysts.length];
        currentShiftIndex++;
        return assignedAnalyst;
    }
    
    // Fallback to any available analyst
    const allAnalysts = [...new Set(shifts.map(shift => shift.analyst))];
    return allAnalysts[Math.floor(Math.random() * allAnalysts.length)];
}

// Modal functions
function showUploadModal() {
    document.getElementById('uploadModal').style.display = 'block';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('uploadForm').reset();
}

function showShiftModal() {
    document.getElementById('shiftModal').style.display = 'block';
    updateShiftsDisplay();
}

function closeShiftModal() {
    document.getElementById('shiftModal').style.display = 'none';
    document.getElementById('shiftForm').reset();
}

// Upload new incident
function uploadIncident(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const incidentData = {
        id: formData.get('incidentId'),
        idealTime: formData.get('idealTime'),
        uploadedBy: formData.get('uploadedBy'),
        assignedTo: '',
        status: 'hold',
        uploadTime: new Date().toISOString()
    };
    
    // Auto-assign to analyst based on current shift
    incidentData.assignedTo = autoAssignIncident(incidentData);
    incidentData.status = 'Transferred';
    
    incidents.unshift(incidentData);
    saveData();
    updateDashboard();
    closeUploadModal();
    
    showMessage('Incident uploaded and assigned successfully!', 'success');
}

// Add new shift
function addShift(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const shiftData = {
        id: Date.now(),
        name: formData.get('shiftName') || `${formData.get('analystName')} Shift`,
        startTime: formData.get('shiftStart'),
        endTime: formData.get('shiftEnd'),
        analyst: formData.get('analystName')
    };
    
    shifts.push(shiftData);
    saveData();
    updateShiftsDisplay();
    updateShiftInfo();
    document.getElementById('shiftForm').reset();
    
    showMessage('Shift added successfully!', 'success');
}

// Update shifts display in modal
function updateShiftsDisplay() {
    const container = document.getElementById('shiftsContainer');
    container.innerHTML = '';
    
    shifts.forEach((shift, index) => {
        const shiftElement = document.createElement('div');
        shiftElement.className = 'shift-item';
        shiftElement.innerHTML = `
            <div class="shift-info">
                <h5>${shift.name}</h5>
                <p>${shift.startTime} - ${shift.endTime} | ${shift.analyst}</p>
            </div>
            <div class="shift-actions">
                <button class="btn btn-small btn-danger" onclick="deleteShift(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(shiftElement);
    });
}

// Delete shift
function deleteShift(index) {
    if (confirm('Are you sure you want to delete this shift?')) {
        shifts.splice(index, 1);
        saveData();
        updateShiftsDisplay();
        updateShiftInfo();
        showMessage('Shift deleted successfully!', 'success');
    }
}

// Reassign incident
function reassignIncident(index) {
    const incident = incidents[index];
    const analysts = [...new Set(shifts.map(shift => shift.analyst))];
    
    const newAnalyst = prompt(`Reassign incident ${incident.id} to:\n${analysts.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nEnter analyst name:`);
    
    if (newAnalyst && analysts.includes(newAnalyst)) {
        incidents[index].assignedTo = newAnalyst;
        saveData();
        updateDashboard();
        showMessage(`Incident ${incident.id} reassigned to ${newAnalyst}`, 'success');
    } else if (newAnalyst) {
        showMessage('Invalid analyst name', 'error');
    }
}

// Delete incident
function deleteIncident(index) {
    if (confirm('Are you sure you want to delete this incident?')) {
        const incident = incidents[index];
        incidents.splice(index, 1);
        saveData();
        updateDashboard();
        showMessage(`Incident ${incident.id} deleted successfully!`, 'success');
    }
}

// Filter incidents
function filterIncidents() {
    updateIncidentsTable();
}

// Refresh dashboard
function refreshDashboard() {
    updateDashboard();
    updateShiftInfo();
    showMessage('Dashboard refreshed successfully!', 'info');
}

// Show message
function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${text}
    `;
    
    document.querySelector('main').insertBefore(message, document.querySelector('.stats-section'));
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const uploadModal = document.getElementById('uploadModal');
    const shiftModal = document.getElementById('shiftModal');
    
    if (event.target === uploadModal) {
        closeUploadModal();
    }
    if (event.target === shiftModal) {
        closeShiftModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeUploadModal();
        closeShiftModal();
    }
    
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        showUploadModal();
    }
    
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        showShiftModal();
    }
});

// Export/Import functions (bonus features)
function exportData() {
    const data = {
        incidents: incidents,
        shifts: shifts,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.incidents && data.shifts) {
                incidents = data.incidents;
                shifts = data.shifts;
                saveData();
                updateDashboard();
                updateShiftInfo();
                showMessage('Data imported successfully!', 'success');
            } else {
                showMessage('Invalid data format', 'error');
            }
        } catch (error) {
            showMessage('Error importing data: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

// Real-time updates simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update any pending incidents to transferred status randomly
        const pendingIncidents = incidents.filter(inc => inc.status === 'hold');
        if (pendingIncidents.length > 0 && Math.random() > 0.8) {
            const randomIncident = pendingIncidents[Math.floor(Math.random() * pendingIncidents.length)];
            randomIncident.status = 'Transferred';
            randomIncident.assignedTo = autoAssignIncident(randomIncident);
            saveData();
            updateDashboard();
        }
    }, 30000); // Every 30 seconds
}

// Start real-time updates
simulateRealTimeUpdates(); 