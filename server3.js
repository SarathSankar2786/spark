/***********************
 * server3.js
 * Disaster SOS Backend
 ***********************/

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// =====================
// TEMP STORAGE
// =====================
let sosList = [];

// =====================
// EMAIL CONFIG (OPTIONAL)
// =====================
let transporter = null;

// ⚠️ ONLY enable this if you have a real Gmail + App Password
try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",        // 🔴 CHANGE THIS
      pass: "your_app_password_here"      // 🔴 CHANGE THIS
    }
  });
} catch (err) {
  console.log("Email disabled:", err.message);
}

// =====================
// PRIORITY LOGIC
// =====================
function getPriority(emergency, people) {
  if (emergency === "Medical") return "CRITICAL";
  if (emergency === "Fire" || emergency === "Flood") return "HIGH";
  if (people > 3) return "HIGH";
  if (emergency === "Shelter Needed") return "MEDIUM";
  return "LOW";
}

// =====================
// SOS ENDPOINT
// =====================
app.post("/sos", (req, res) => {
  const { phone, emergency, people, lat, lon } = req.body;

  const priority = getPriority(emergency, people);

  const sos = {
    phone,
    emergency,
    people,
    lat,
    lon,
    priority,
    status: "PENDING",
    time: new Date()
  };

  sosList.push(sos);

  console.log("🚨 SOS RECEIVED:", sos);

  // ===== EMAIL ALERT FOR CRITICAL =====
  if (priority === "CRITICAL" && transporter) {
    transporter.sendMail({
      from: "Disaster SOS System",
      to: "controlroom@gmail.com", // 🔴 CHANGE THIS
      subject: "🚨 CRITICAL SOS ALERT",
      text: `
CRITICAL EMERGENCY RECEIVED

Phone: ${phone}
Emergency: ${emergency}
People: ${people}
Location: https://www.google.com/maps?q=${lat},${lon}
Time: ${new Date().toLocaleString()}
      `
    }).catch(err => {
      console.log("Email failed:", err.message);
    });
  }

  res.json({
    message: `SOS sent successfully. Priority: ${priority}`
  });
});

// =====================
// ADMIN DASHBOARD
// =====================
app.get("/admin", (req,

