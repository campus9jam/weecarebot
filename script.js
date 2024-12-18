// Initialize Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand();

// Global variables
let currentUser = null;
let currentRole = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    checkUserRole();
    setupMainButton();
});

// Menu Functions
function toggleMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    menuOverlay.style.display = menuOverlay.style.display === 'block' ? 'none' : 'block';
    if (menuOverlay.style.display === 'block') {
        setTimeout(() => {
            menuOverlay.classList.add('active');
        }, 10);
    } else {
        menuOverlay.classList.remove('active');
    }
}

function navigateTo(section) {
    toggleMenu();
    // Handle navigation logic here
    switch(section) {
        case 'dashboard':
            showMainContent();
            break;
        case 'profile':
            openFeature('profile');
            break;
        case 'settings':
            openFeature('settings');
            break;
    }
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    location.reload();
}

// Role Selection
function selectRole(role) {
    currentRole = role;
    let userData = {
        role: role,
        user_id: tg.initDataUnsafe?.user?.id,
        timestamp: new Date().toISOString()
    };

    // Store user data
    localStorage.setItem('userRole', role);
    localStorage.setItem('userData', JSON.stringify(userData));

    // Notify the Telegram bot
    tg.sendData(JSON.stringify(userData));

    showMainContent();
}

function checkUserRole() {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
        currentRole = savedRole;
        showMainContent();
    }
}

function showMainContent() {
    document.getElementById('roleSelection').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
}

// Feature Management
function openFeature(feature) {
    const modal = document.getElementById('featureModal');
    const modalContent = document.getElementById('modalContent');
    
    // Clear previous content
    modalContent.innerHTML = '';
    
    // Generate feature-specific content
    switch(feature) {
        case 'medications':
            generateMedicationForm(modalContent);
            break;
        case 'prescriptions':
            generatePrescriptionForm(modalContent);
            break;
        case 'payments':
            generatePaymentForm(modalContent);
            break;
        case 'records':
            generateMedicalRecords(modalContent);
            break;
        case 'teleconsult':
            generateTeleconsultForm(modalContent);
            break;
        case 'notifications':
            generateNotificationSettings(modalContent);
            break;
        case 'profile':
            generateProfileForm(modalContent);
            break;
        case 'settings':
            generateSettingsForm(modalContent);
            break;
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('featureModal').style.display = 'none';
}

// Feature-specific form generators
function generateMedicationForm(container) {
    container.innerHTML = `
        <h2>Schedule Medication Reminder</h2>
        <form onsubmit="handleMedicationSubmit(event)">
            <div class="form-group">
                <label>Medication Name</label>
                <input type="text" required name="medName">
            </div>
            <div class="form-group">
                <label>Dosage</label>
                <input type="text" required name="dosage">
            </div>
            <div class="form-group">
                <label>Frequency</label>
                <select name="frequency" required>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" required name="time">
            </div>
            <button type="submit" class="btn">Schedule Reminder</button>
        </form>
    `;
}

function generatePrescriptionForm(container) {
    container.innerHTML = `
        <h2>Prescription Management</h2>
        <div class="form-group">
            <label>Upload Prescription</label>
            <input type="file" accept="image/*,.pdf" onchange="handlePrescriptionUpload(event)">
        </div>
        <div id="prescriptionsList">
            <!-- Prescriptions will be listed here -->
        </div>
    `;
}

function generatePaymentForm(container) {
    container.innerHTML = `
        <h2>Payment Processing</h2>
        <form onsubmit="handlePaymentSubmit(event)">
            <div class="form-group">
                <label>Amount</label>
                <input type="number" required name="amount">
            </div>
            <div class="form-group">
                <label>Purpose</label>
                <select name="purpose" required>
                    <option value="consultation">Consultation</option>
                    <option value="medication">Medication</option>
                    <option value="test">Medical Test</option>
                </select>
            </div>
            <button type="submit" class="btn">Process Payment</button>
        </form>
    `;
}

// Event Handlers
function handleMedicationSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const medicationData = {
        name: formData.get('medName'),
        dosage: formData.get('dosage'),
        frequency: formData.get('frequency'),
        time: formData.get('time')
    };
    
    // Send to Telegram Bot
    tg.sendData(JSON.stringify({
        action: 'medication_reminder',
        data: medicationData
    }));
    
    closeModal();
}

function handlePrescriptionUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Handle file upload
        const reader = new FileReader();
        reader.onload = function(e) {
            // Send to Telegram Bot
            tg.sendData(JSON.stringify({
                action: 'prescription_upload',
                data: {
                    filename: file.name,
                    content: e.target.result
                }
            }));
        };
        reader.readAsDataURL(file);
    }
}

function handlePaymentSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const paymentData = {
        amount: formData.get('amount'),
        purpose: formData.get('purpose')
    };
    
    // Send to Telegram Bot
    tg.sendData(JSON.stringify({
        action: 'process_payment',
        data: paymentData
    }));
    
    closeModal();
}

// Main Button Setup
function setupMainButton() {
    tg.MainButton.setParams({
        text: 'CLOSE APP',
        color: '#7B1FA2'
    });
    
    tg.MainButton.onClick(() => {
        tg.close();
    });
}

// Error Handling
function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

// Window click event to close modal
window.onclick = function(event) {
    const modal = document.getElementById('featureModal');
    if (event.target === modal) {
        closeModal();
    }
};
