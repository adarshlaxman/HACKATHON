import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./styles.css";

function Home() {
    const sendSOS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                alert(`🚨 SOS Sent! 📍 Location: ${lat}, ${lon}`);

                // You can modify this to send location to emergency services via API
                console.log(`Sending SOS: Latitude: ${lat}, Longitude: ${lon}`);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const showHospitals = () => {
        window.open("https://www.google.com/maps/search/nearby+hospitals");
    };

    return (
        <div className="home container">
            <h2>🚑 Welcome to SOS Emergency System 🚓</h2>
            <button className="sos" onClick={sendSOS}>🚨 Send SOS</button>
            <button className="hospital" onClick={showHospitals}>🏥 Find Nearby Hospitals</button>
        </div>
    );
}

function EmergencyContacts() {
    return (
        <div className="contacts container">
            <h2>📞 Emergency Contacts</h2>
            <ul>
                <li>👮 Police: <strong>100</strong></li>
                <li>🚑 Ambulance: <strong>102</strong></li>
                <li>🔥 Fire: <strong>101</strong></li>
            </ul>
        </div>
    );
}

function ReportAccident() {
    const [report, setReport] = useState("");

    const handleReportSubmit = () => {
        if (report.trim() === "") {
            alert("⚠️ Please enter accident details before submitting.");
            return;
        }

        alert("✅ Accident report submitted successfully!");
        console.log("Accident Report:", report);
        setReport(""); // Clear the textarea after submission
    };

    return (
        <div className="report container">
            <h2>📝 Report an Accident</h2>
            <textarea 
                placeholder="Describe the accident..." 
                rows="4" 
                value={report} 
                onChange={(e) => setReport(e.target.value)}
            ></textarea>
            <button className="sos" onClick={handleReportSubmit}>🚔 Submit Report</button>
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="container">
                <h1>🚨 SOS Emergency System 🚨</h1>
                <nav>
                    <Link to="/">🏠 Home</Link>
                    <Link to="/contacts">📞 Emergency Contacts</Link>
                    <Link to="/report">⚠️ Report Accident</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contacts" element={<EmergencyContacts />} />
                    <Route path="/report" element={<ReportAccident />} />
                </Routes>
            </div>
        </Router>
    );
}

// Use ReactDOM.createRoot() for React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);