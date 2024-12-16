// Simulated database for users
const users = [];

// Registration logic
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const role = document.getElementById('role').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create a new user object
    const newUser = {
        role: role,
        name: name,
        email: email,
        password: password // In a real app, do not store plain passwords
    };

    // Simulate saving the user data (in practice, this would be sent to a server)
    users.push(newUser);
    alert(`Registered successfully!\nRole: ${role}\nName: ${name}\nEmail: ${email}`);

    // Reset the form
    document.getElementById('registrationForm').reset();
});

function bookAppointment() {
    const doctor = prompt("Enter the doctor's name you want to book an appointment with:");
    const date = prompt("Enter the date for the appointment (YYYY-MM-DD):");
    const time = prompt("Enter the time for the appointment (HH:MM):");
    if (doctor && date && time) {
        alert(`Appointment booked with Dr. ${doctor} on ${date} at ${time}.`);
    } else {
        alert("Appointment booking cancelled.");
    }
}

function startConsultation() {
    const consultationType = prompt("Enter the type of consultation (e.g., General, Specialist):");
    if (consultationType) {
        alert(`Starting a ${consultationType} consultation...`);
    } else {
        alert("Consultation cancelled.");
    }
}

function setReminder() {
    const medication = prompt("Enter the medication name:");
    const time = prompt("
