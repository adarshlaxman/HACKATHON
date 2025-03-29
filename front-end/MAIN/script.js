// Emergency contacts data
const emergencyContacts = [
    { name: "Police", number: "100", description: "Immediate danger, crimes in progress" },
    { name: "Fire Department", number: "101", description: "Fires, smoke, chemical spills" },
    { name: "Ambulance", number: "102", description: "Medical emergencies, injuries" },
    { name: "Emergency Rescue", number: "108", description: "Natural disasters, trapped persons" },
    { name: "Poison Control", number: "1-800-222-1222", description: "Ingested toxins" }
];

// Initialize the app
function init() {
    displayContacts();
}

// Show main home screen
function showHome() {
    document.getElementById("main-content").classList.remove("hidden");
    document.getElementById("contact-info").classList.add("hidden");
    document.getElementById("report-form").classList.add("hidden");
    document.getElementById("emergency-checklist").classList.add("hidden");
}

// Display emergency contacts
function showContacts() {
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("contact-info").classList.remove("hidden");
    document.getElementById("report-form").classList.add("hidden");
    document.getElementById("emergency-checklist").classList.add("hidden");
}

// Show emergency report form
function showReportForm() {
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("contact-info").classList.add("hidden");
    document.getElementById("report-form").classList.remove("hidden");
    document.getElementById("emergency-checklist").classList.add("hidden");
}

// Show emergency checklist
function showChecklist() {
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("contact-info").classList.add("hidden");
    document.getElementById("report-form").classList.add("hidden");
    document.getElementById("emergency-checklist").classList.remove("hidden");
}

// Display contacts in the contact-info div
function displayContacts() {
    let html = '<h3>🆘 Emergency Contacts</h3>';
    emergencyContacts.forEach(contact => {
        html += `
        <div class="contact-card">
            <h4>${contact.name}</h4>
            <p class="emergency-number">${contact.number}</p>
            <p>${contact.description}</p>
            <button class="btn" onclick="callNumber('${contact.number}')">
                <i class="fas fa-phone"></i> Call Now
            </button>
        </div>`;
    });
    document.getElementById("contact-info").innerHTML = html;
}

// Call emergency number
function callNumber(number) {
    if (confirm(`Call ${number}?`)) {
        window.location.href = `tel:${number}`;
    }
}

// Send SOS with location
function sendSOS() {
    if (confirm("This will send your location to emergency services. Continue?")) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // In a real app, this would send to emergency services
                console.log(`SOS sent to authorities! Location: ${lat}, ${lon}`);
                alert(`EMERGENCY ALERT SENT!\nRescue teams notified of your location at:\nLatitude: ${lat}\nLongitude: ${lon}`);
            }, (error) => {
                alert("Error getting location: " + error.message + "\nSending SOS without location.");
                console.log("SOS sent without location");
            }, { 
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            alert("Geolocation not supported - sending SOS without location");
            console.log("SOS sent without location");
        }
    }
}

// Find nearby hospitals
function findHospitals() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const mapLink = `https://www.google.com/maps/search/hospital+emergency+room/@${lat},${lon},15z/data=!3m1!4b1`;
            window.open(mapLink, "_blank");
            
            alert(`Nearest emergency rooms mapped.\nCall 911 if immediate assistance is needed.`);
        }, (error) => {
            alert("Error getting location: " + error.message + "\nShowing general hospital map.");
            window.open("https://www.google.com/maps/search/hospital+emergency+room/", "_blank");
        }, {
            enableHighAccuracy: true,
            timeout: 10000
        });
    } else {
        window.open("https://www.google.com/maps/search/hospital+emergency+room/", "_blank");
    }
}

// Submit emergency report
function submitReport() {
    const emergencyType = document.getElementById("emergency-type").value;
    const description = document.getElementById("accident-description").value;
    const needsAssistance = document.getElementById("need-assistance").checked;

    if (!emergencyType) {
        alert("Please select the emergency type");
        return;
    }

    if (description.trim() === "") {
        alert("Please describe the emergency situation");
        return;
    }

    // In a real app, this would send to emergency services
    console.log(`Emergency Report:
Type: ${emergencyType}
Description: ${description}
Needs Immediate Assistance: ${needsAssistance ? 'YES' : 'no'}`);

    alert(`Emergency report submitted successfully!${needsAssistance ? '\nHelp is on the way!' : ''}`);
    
    // Reset form
    document.getElementById("emergency-type").value = "";
    document.getElementById("accident-description").value = "";
    document.getElementById("need-assistance").checked = false;
    showHome();
}

// Initialize the app when page loads
window.onload = init;