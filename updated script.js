// User state management
let currentUser = null;

// Show auth modal on page load if user is not logged in
document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('user');
    if (user) {
        currentUser = JSON.parse(user);
        showUserInfo();
        showMainMenu();
    } else {
        new mdb.Modal(document.getElementById('authModal')).show();
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.querySelector('input[name="loginRole"]:checked').value;

    // Here you would typically validate against your backend
    // For demo purposes, we'll just simulate a successful login
    currentUser = {
        email,
        role,
        name: email.split('@')[0], // Just for demo
    };

    localStorage.setItem('user', JSON.stringify(currentUser));
    showUserInfo();
    showMainMenu();
    mdb.Modal.getInstance(document.getElementById('authModal')).hide();
});

// Handle register form submission
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('registerName').value;
    const role = document.querySelector('input[name="registerRole"]:checked').value;

    // Additional doctor fields
    let doctorInfo = {};
    if (role === 'doctor') {
        doctorInfo = {
            specialization: document.getElementById('specialization').value,
            license: document.getElementById('license').value,
        };
    }

    // Here you would typically send this to your backend
    currentUser = {
        email,
        name,
        role,
        ...doctorInfo
    };

    localStorage.setItem('user', JSON.stringify(currentUser));
    showUserInfo();
    showMainMenu();
    mdb.Modal.getInstance(document.getElementById('authModal')).hide();
});

// Toggle doctor fields visibility
document.querySelectorAll('input[name="registerRole"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const doctorFields = document.getElementById('doctorFields');
        doctorFields.style.display = e.target.value === 'doctor' ? 'block' : 'none';
    });
});

// Show user info
function showUserInfo() {
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');

    userInfo.style.display = 'block';
    userName.textContent = currentUser.name;
    userRole.textContent = currentUser.role;
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    currentUser = null;
    location.reload();
}

// Function to display the main menu based on user role
function showMainMenu() {
    const mainMenu = document.getElementById('main-menu');
    mainMenu.innerHTML = '';

    const buttons = getMenuButtonsByRole(currentUser.role);

    buttons.forEach(button => {
        const buttonElement = document.createElement('a');
        buttonElement.classList.add('btn', 'btn-primary', 'btn-lg', 'mb-3', 'w-100');
        buttonElement.textContent = button.label;
        buttonElement.addEventListener('click', () => handleButtonClick(button.callback));
        mainMenu.appendChild(buttonElement);
    });
}

// Get menu buttons based on user role
function getMenuButtonsByRole(role) {
    const patientButtons = [
        { label: 'Book Appointment', callback: 'book_appointment' },
        { label: 'View Prescriptions', callback: 'view_prescriptions' },
        { label: 'Join Tele-Consultation', callback: 'join_consultation' },
        { label: 'Medication Reminders', callback: 'medication_reminders' },
        { label: 'Make Payment', callback: 'make_payment' }
    ];

    const doctorButtons = [
        { label: 'View Appointments', callback: 'view_appointments' },
        { label: 'Write Prescription', callback: 'write_prescription' },
        { label: 'Start Tele-Consultation', callback: 'start_consultation' },
        { label: 'Patient Records', callback: 'patient_records' }
    ];

    return role === 'patient' ? patientButtons : doctorButtons;
}

// Function to handle button clicks with role-based permissions
function handleButtonClick(callback) {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    switch (callback) {
        case 'book_appointment':
            if (currentUser.role === 'patient') {
                bookAppointment();
            }
            break;
        case 'view_appointments':
            if (currentUser.role === 'doctor') {
                viewAppointments();
            }
            break;
        case 'write_prescription':
            if (currentUser.role === 'doctor') {
                writePrescription();
            }
            break;
        // Add other cases for different functionalities
        default:
            break;
    }
}

// Implement role-specific functions
function bookAppointment() {
    const appointmentSection = document.getElementById('appointment-booking');
    appointmentSection.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Book an Appointment</h5>
                <form id="appointmentForm">
                    <div class="form-outline mb-4">
                        <input type="date" id="appointmentDate" class="form-control" required/>
                        <label class="form-label" for="appointmentDate">Preferred Date</label>
                    </div>
                    <div class="form-outline mb-4">
                        <select class="form-control" id="appointmentTime" required>
                            <option value="">Select Time</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                        </select>
                    </div>
                    <div class="form-outline mb-4">
                        <textarea id="appointmentReason" class="form-control" rows="3"></textarea>
                        <label class="form-label" for="appointmentReason">Reason for Visit</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Book Appointment</button>
                </form>
            </div>
        </div>
    `;
}

function viewAppointments() {
    const appointmentSection = document.getElementById('appointment-booking');
    appointmentSection.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Your Appointments</h5>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Patient</th>
                                <th>Reason</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- This would be populated dynamically from your backend -->
                            <tr>
                                <td>2024-12-16</td>
                                <td>09:00 AM</td>
                                <td>John Doe</td>
                                <td>Regular Checkup</td>
                                <td>
                                    <button class="btn btn-primary btn-sm">Accept</button>
                                    <button class="btn btn-danger btn-sm">Decline</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Function to set a medication reminder
function setMedicationReminder(medicationName, dosage, frequency) {
  // Save the reminder details to the database
  // ...

  // Schedule the reminder to be sent at the appropriate times
  setInterval(() => {
    // Send the reminder to the user via the bot
    // ...
  }, frequency * 1000); // Frequency in seconds
}

// Function to handle medication reminders
function medicationReminders() {
  const medicationRemindersSection = document.getElementById('medication-reminders');
  medicationRemindersSection.innerHTML = '';

  const medicationName = prompt('Enter the medication name:');
  const dosage = prompt('Enter the dosage:');
  const frequencyInMinutes = parseInt(prompt('Enter the reminder frequency in minutes:'));

  setMedicationReminder(medicationName, dosage, frequencyInMinutes * 60); // Frequency in seconds

  medicationRemindersSection.textContent = `Reminder set for ${medicationName}, ${dosage} every ${frequencyInMinutes} minutes.`;
}

// Add the medication reminders option to the main menu
function showMainMenu() {
  // ...
  buttons.push({ label: 'Medication Reminders', callback: 'medication_reminders' });
  // ...
}

// Handle button clicks
function handleButtonClick(callback) {
  // ...
  case 'medication_reminders':
    medicationReminders();
    break;
  // ...
}
// Function to send a payment request
function sendPaymentRequest(chatId, title, description, amount) {
  const providerToken = 'YOUR_PROVIDER_TOKEN';
  const currency = 'USD';

  fetch(`https://api.telegram.org/bot${TOKEN}/sendInvoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      title: title,
      description: description,
      provider_token: providerToken,
      currency: currency,
      prices: [{ label: title, amount: amount * 100 }] // Amount in the smallest currency unit (e.g., cents for USD)
    })
  })
    .then(response => {
      if (response.ok) {
        alert('Payment request sent successfully!');
      } else {
        alert('Error sending payment request. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Error sending payment request:', error);
      alert('An error occurred while processing the payment. Please try again later.');
    });
}

// Function to handle payment integration
function makePayment() {
  const paymentIntegrationSection = document.getElementById('payment-integration');
  paymentIntegrationSection.innerHTML = '';

  const chatId = 'YOUR_CHAT_ID'; // Replace with the user's chat ID
  const title = 'Consultation Fee';
  const description = 'Payment for healthcare consultation';
  const amount = 10; // Replace with the actual consultation fee

  sendPaymentRequest(chatId, title, description, amount);
}

// Add the payment integration option to the main menu
function showMainMenu() {
  // ...
  buttons.push({ label: 'Make a Payment', callback: 'make_payment' });
  // ...
}

// Handle button clicks
function handleButtonClick(callback) {
  // ...
  case 'make_payment':
    makePayment();
    break;
  // ...
}
// Function to create a video meeting
async function createZoomMeeting(topic, duration, timezone) {
  const headers = {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  };

  const meetingDetails = {
    'topic': topic,
    'type': 1,
    'duration': duration,
    'timezone': timezone
  };

  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(meetingDetails)
  });

  const data = await response.json();
  return data;
}

// Function to handle tele-consultation
function teleConsultation() {
  const teleConsultationSection = document.getElementById('tele-consultation');
  teleConsultationSection.innerHTML = '';

  const topic = 'Healthcare Consultation';
  const duration = 30;
  const timezone = 'UTC';

  createZoomMeeting(topic, duration, timezone)
    .then(meetingData => {
      const meetingLink = meetingData.join_url;

      const linkElement = document.createElement('a');
      linkElement.href = meetingLink;
      linkElement.textContent = 'Join Consultation';
      linkElement.classList.add('button');

      teleConsultationSection.appendChild(linkElement);

      // Send the meeting link to the user via the bot
      // ...
    })
    .catch(error => {
      console.error('Error creating Zoom meeting:', error);
      teleConsultationSection.textContent = 'An error occurred while scheduling the consultation. Please try again later.';
    });
}

// Add the tele-consultation option to the main menu
function showMainMenu() {
  // ...
  buttons.push({ label: 'Tele-Consultation', callback: 'tele_consultation' });
  // ...
}

// Handle button clicks
function handleButtonClick(callback) {
  // ...
  case 'tele_consultation':
    teleConsultation();
    break;
  // ...
}

