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
    const time = prompt("Enter the time for the reminder (HH:MM):");
    if (medication && time) {
        alert(`Reminder set for ${medication} at ${time}.`);
    } else {
        alert("Reminder setting cancelled.");
    }
}

function viewArticles() {
    const articles = [
        { title: "Understanding Telehealth", url: "https://example.com/telehealth" },
        { title: "Benefits of Online Consultations", url: "https://example.com/benefits" },
        { title: "Medication Management Tips", url: "https://example.com/medication" }
    ];
    let articleList = "Available Articles:\n";
    articles.forEach((article, index) => {
        articleList += `${index + 1}. ${article.title} - ${article.url}\n`;
    });
    alert(articleList);
}

function manageContacts() {
    const contacts = [];
    let contact;
    while (true) {
        contact = prompt("Enter an emergency contact name (or type 'done' to finish):");
        if (contact.toLowerCase() === 'done') break;
        contacts.push(contact);
    }
    alert("Emergency contacts: " + contacts.join(", ") || "No contacts added.");
}
