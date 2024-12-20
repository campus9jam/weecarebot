// Initialize Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand();

// Global Variables
let currentUser = null;
let currentTab = 'home';
let healthScore = 85; // Default health score

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadUserData();
    updateHealthScore();
    loadDoctors();
    setupNotifications();
});

// App Initialization
function initializeApp() {
    switchTab('home');
    setupEventListeners();
    checkAuthStatus();
}

// Authentication & User Management
function checkAuthStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForUser();
    } else {
        showLoginPrompt();
    }
}

function updateUIForUser() {
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    if (currentUser) {
        userName.textContent = currentUser.name;
        userRole.textContent = currentUser.role;
    }
}

// Tab Management
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Update current tab
    currentTab = tabName;
    
    // Update bottom navigation
    const navItem = document.querySelector(`.nav-item[onclick="switchTab('${tabName}')"]`);
    if (navItem) navItem.classList.add('active');
}

// Health Score Management
function updateHealthScore() {
    const circle = document.querySelector('.circle');
    const scoreText = document.querySelector('.score');
    
    // Calculate health score based on user data
    calculateHealthScore().then(score => {
        healthScore = score;
        circle.style.strokeDasharray = `${score}, 100`;
        scoreText.textContent = `${score}%`;
    });
}

async function calculateHealthScore() {
    // Implement health score calculation algorithm
    // This is a placeholder implementation
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(Math.floor(Math.random() * 20) + 80); // Random score between 80-100
        }, 500);
    });
}

// Appointments Management
function showNewAppointmentForm() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h2>Schedule New Appointment</h2>
        <form onsubmit="handleAppointmentSubmit(event)">
            <div class="form-group">
                <label>Doctor</label>
                <select name="doctor" required>
                    <option value="">Select Doctor</option>
                    ${generateDoctorOptions()}
                </select>
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" name="date" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" name="time" required>
            </div>
            <div class="form-group">
                <label>Reason for Visit</label>
                <textarea name="reason" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Schedule Appointment</button>
        </form>
    `;
    showModal();
}

function handleAppointmentSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const appointmentData = {
        doctor: formData.get('doctor'),
        date: formData.get('date'),
        time: formData.get('time'),
        reason: formData.get('reason'),
        userId: currentUser.id
    };
    
    // Send to Telegram Bot
    tg.sendData(JSON.stringify({
        action: 'new_appointment',
        data: appointmentData
    }));
    
    closeModal();
    showNotification('Appointment scheduled successfully!');
}

// Prescription Management
function showUploadPrescription() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h2>Upload Prescription</h2>
        <form onsubmit="handlePrescriptionUpload(event)">
            <div class="form-group">
                <label>Upload Image/PDF</label>
                <input type="file" accept="image/*,.pdf" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Upload</button>
        </form>
    `;
    showModal();
}

function showManualEntry() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h2>Add Medication</h2>
        <form onsubmit="handleMedicationEntry(event)">
            <div class="form-group">
                <label>Medicine Name</label>
                <input type="text" name="medicine" required>
            </div>
            <div class="form-group">
                <label>Dosage</label>
                <input type="text" name="dosage" required>
            </div>
            <div class="form-group">
                <label>Schedule</label>
                <select name="schedule" required>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" name="time" required>
            </div>
            <button type="submit" class="btn-primary">Add Medication</button>
        </form>
    `;
    showModal();
}

// Emergency Services
function callEmergency(service) {
    const services = {
        ambulance: '911',
        police: '911',
        fire: '911'
    };
    
    const phone = services[service];
    window.location.href = `tel:${phone}`;
    
    // Log emergency call
    tg.sendData(JSON.stringify({
        action: 'emergency_call',
        service: service,
        timestamp: new Date().toISOString()
    }));
}

function showAddContactForm() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h2>Add Emergency Contact</h2>
        <form onsubmit="handleAddContact(event)">
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Relationship</label>
                <input type="text" name="relationship" required>
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" required>
            </div>
            <button type="submit" class="btn-primary">Add Contact</button>
        </form>
    `;
    showModal();
}

// Utility Functions
function showModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Data Loading Functions
function loadDoctors() {
    // Implement doctor loading logic
    const doctors = [
        { name: 'Dr. Smith', specialty: 'Cardiology', rating: 4.8 },
        { name: 'Dr. Johnson', specialty: 'Pediatrics', rating: 4.9 },
        { name: 'Dr. Williams', specialty: 'Dermatology', rating: 4.7 }
        // Add more doctors as needed
    ];
    
    const carousel = document.querySelector('.doctors-carousel');
    carousel.innerHTML = doctors.map(doctor => `
        <div class="doctor-card">
            <img src="https://via.placeholder.com/100" alt="${doctor.name}">
            <h3>${doctor.name}</h3>
            <p>${doctor.specialty}</p>
            <div class="rating">★ ${doctor.rating}</div>
        </div>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target.className === 'modal') {
            closeModal();
        }
    };
    
    // Handle menu toggle
    document.querySelector('.menu-btn').addEventListener('click', toggleMenu);
}

// Menu Functions
function toggleMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    menuOverlay.style.display = menuOverlay.style.display === 'block' ? 'none' : 'block';
}

// Notifications
function setupNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

// Initialize Main Button
tg.MainButton.setText('CLOSE APP');
tg.MainButton.onClick(() => {
    tg.close();
});
// Initialize Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand();

// Global Variables
let currentUser = null;
let currentPage = 'home';
let pageHistory = ['home'];
let appointments = [];
let medications = [];
let emergencyContacts = [];
let doctors = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadUserData();
    setupEventListeners();
    loadDoctors();
    setupNotifications();
});

// App Initialization
function initializeApp() {
    // Check authentication
    checkAuthStatus();
    
    // Load saved data
    loadSavedData();
    
    // Show initial page
    showPage('home');
    
    // Setup back button
    setupBackButton();
}

// Authentication & User Management
function checkAuthStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForUser();
    } else {
        showLoginPrompt();
    }
}

function updateUIForUser() {
    if (currentUser) {
        document.querySelector('.page-title').textContent = `Welcome, ${currentUser.name}`;
    }
}

// Navigation Management
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.service-page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show selected page
    const page = document.getElementById(`${pageName}Page`);
    if (page) {
        page.classList.remove('hidden');
        currentPage = pageName;
        
        // Update navigation
        updateNavigation(pageName);
        
        // Load page-specific content
        loadPageContent(pageName);
    }
}

function navigateToService(service) {
    pageHistory.push(service);
    showPage(service);
}

function goBack() {
    if (pageHistory.length > 1) {
        pageHistory.pop(); // Remove current page
        const previousPage = pageHistory[pageHistory.length - 1];
        showPage(previousPage);
    }
}

function updateNavigation(pageName) {
    // Update bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNav = document.querySelector(`.nav-item[onclick="navigateToService('${pageName}')"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// Appointments Management
function showNewAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <form id="appointmentForm" onsubmit="handleAppointmentSubmit(event)">
            <div class="form-group">
                <label>Select Doctor</label>
                <select name="doctor" required>
                    <option value="">Choose a doctor</option>
                    ${generateDoctorOptions()}
                </select>
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" name="date" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" name="time" required>
            </div>
            <div class="form-group">
                <label>Reason for Visit</label>
                <textarea name="reason" required></textarea>
            </div>
            <button type="submit" class="action-btn">Schedule Appointment</button>
        </form>
    `;
    
    showModal('appointmentModal');
}

function handleAppointmentSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const appointment = {
        id: generateId(),
        doctor: formData.get('doctor'),
        date: formData.get('date'),
        time: formData.get('time'),
        reason: formData.get('reason'),
        status: 'upcoming'
    };
    
    appointments.push(appointment);
    saveAppointments();
    closeModal('appointmentModal');
    showNotification('Appointment scheduled successfully!');
    loadAppointments();
}

// Prescription Management
function showUploadPrescriptionModal() {
    const modal = document.getElementById('prescriptionModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <form id="prescriptionUploadForm" onsubmit="handlePrescriptionUpload(event)">
            <div class="form-group">
                <label>Upload Prescription</label>
                <input type="file" name="prescription" accept="image/*,.pdf" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" required></textarea>
            </div>
            <button type="submit" class="action-btn">Upload Prescription</button>
        </form>
    `;
    
    showModal('prescriptionModal');
}

function showAddMedicationModal() {
    const modal = document.getElementById('medicationModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <form id="medicationForm" onsubmit="handleMedicationSubmit(event)">
            <div class="form-group">
                <label>Medication Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Dosage</label>
                <input type="text" name="dosage" required>
            </div>
            <div class="form-group">
                <label>Frequency</label>
                <select name="frequency" required>
                    <option value="daily">Daily</option>
                    <option value="twice">Twice Daily</option>
                    <option value="thrice">Thrice Daily</option>
                </select>
            </div>
            <div class="form-group">
                <label>Time(s)</label>
                <input type="time" name="time" required>
            </div>
            <button type="submit" class="action-btn">Add Medication</button>
        </form>
    `;
    
    showModal('medicationModal');
}

// Emergency Services
function callEmergency(service) {
    const services = {
        ambulance: '911',
        police: '911',
        fire: '911'
    };
    
    if (confirm(`Are you sure you want to call ${service.toUpperCase()} services?`)) {
        window.location.href = `tel:${services[service]}`;
        
        // Log emergency call
        logEmergencyCall(service);
    }
}

function showAddContactModal() {
    const modal = document.getElementById('contactModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <form id="contactForm" onsubmit="handleContactSubmit(event)">
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Relationship</label>
                <input type="text" name="relationship" required>
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" required>
            </div>
            <button type="submit" class="action-btn">Add Contact</button>
        </form>
    `;
    
    showModal('contactModal');
}

// Doctors Search and Filtering
function searchDoctors(query) {
    const filteredDoctors = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(query.toLowerCase())
    );
    
    renderDoctors(filteredDoctors);
}

function filterBySpecialty(specialty) {
    const filteredDoctors = specialty === 'all' 
        ? doctors 
        : doctors.filter(doctor => doctor.specialty === specialty);
    
    renderDoctors(filteredDoctors);
}

// Data Management
function loadSavedData() {
    appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    medications = JSON.parse(localStorage.getItem('medications')) || [];
    emergencyContacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
}

function saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function saveMedications() {
    localStorage.setItem('medications', JSON.stringify(medications));
}

function saveEmergencyContacts() {
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
}

// UI Rendering Functions
function loadPageContent(pageName) {
    switch(pageName) {
        case 'appointments':
            loadAppointments();
            break;
        case 'prescriptions':
            loadMedications();
            break;
        case 'emergency':
            loadEmergencyContacts();
            break;
        case 'doctors':
            loadDoctors();
            break;
    }
}

function loadAppointments() {
    const container = document.querySelector('.appointments-list');
    container.innerHTML = appointments
        .filter(apt => apt.status === 'upcoming')
        .map(apt => `
            <div class="appointment-card">
                <div class="appointment-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="appointment-details">
                    <h3>${apt.doctor}</h3>
                    <p>${apt.date} at ${apt.time}</p>
                    <small>${apt.reason}</small>
                </div>
                <button onclick="cancelAppointment('${apt.id}')" class="action-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
}

// Utility Functions
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // Handle back button
    window.addEventListener('popstate', function() {
        goBack();
    });
}

// Telegram Integration
function sendToTelegram(data) {
    tg.sendData(JSON.stringify(data));
}

// Initialize Telegram Main Button
tg.MainButton.setText('CLOSE APP');
tg.MainButton.onClick(() => {
    tg.close();
});

// Setup Notifications
function setupNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

function scheduleNotification(title, body, timestamp) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '/icon.png'
        });
    }
}

// Health Monitoring
function calculateHealthScore() {
    // Implement health score calculation based on:
    // - Medication adherence
    // - Appointment attendance
    // - Regular check-ups
    // Return score between 0-100
    return 85; // Placeholder
}

// Export functions for external use
window.navigateToService = navigateToService;
window.showNewAppointmentModal = showNewAppointmentModal;
window.showUploadPrescriptionModal = showUploadPrescriptionModal;
window.showAddMedicationModal = showAddMedicationModal;
window.callEmergency = callEmergency;
window.showAddContactModal = showAddContactModal;
window.searchDoctors = searchDoctors;
window.filterBySpecialty = filterBySpecialty;

