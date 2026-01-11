# 🧑‍💻 Code of Duty – Hackathon Submission

> **Instructions:**  
> Please edit this README by filling in the required details.  
> Do **not** remove section headings.

---

## 📌 Team Information

- **Team Name:**SPARK  
- **Team Members:**  
  - Member 1 – K Sarath sankar  
  - Member 2 – Jerin J George
  - Member 3 – Arundhathy S
  - Member 4 – Harinandan S

- **Problem Domain:**  
- **Selected Problem Statement:**
- Disaster Management & Emergency Response 

---

## 🧩 Problem Description

Briefly describe the problem you are addressing.  
Explain the background and why this problem is relevant.

Natural disasters in India often create emergency situations where timely and accurate information about affected areas and relief camps is crucial. However, such information is usually scattered across multiple sources, leading to delays, confusion, and poor coordination among volunteers and relief agencies. The absence of a centralized platform for verified disaster updates and volunteer coordination reduces the efficiency of relief efforts and increases risks for both affected individuals and volunteers.

---

## 💡 Proposed Solution

Describe your solution clearly:
- What is your approach?
- The approach is to build a centralized web platform that collects disaster alerts, relief camp information, and volunteer requirements from trusted government and humanitarian sources, and displays them based on the user’s location. Volunteers register through a secure form with identity verification and consent to risk-aware terms before accessing the platform.
- How does it solve the problem?
- It solves the problem by eliminating scattered information and providing a single, reliable source for disaster-related updates and nearby relief camps. This improves coordination, reduces response delays, and helps volunteers and affected individuals quickly identify where help is needed
- Key idea behind the solution.
- The key idea is to act as a trusted information bridge that connects authorities, relief organizations, and volunteers through a centralized, verified, and location-based digital system during disaster situations.

---

## ⚙️ Technology Stack

List the tools and technologies used:
- Programming Languages
- HTML5 – Structure of web pages
CSS3 – Styling and responsive design
JavaScript – Client-side interactivity and logic

- Frameworks / Libraries
Node.js – Server-side runtime environment
Express.js – Backend framework for handling APIs and routing
OpenStreetMap / Leaflet.js – Map visualization and location-based services

- Tools / Platforms  
Git & GitHub – Version control and project collaboration
VS Code – Code editor
Browser Geolocation API – User location detection
Open Government Data (data.gov.in) – Disaster-related datasets
Firebase / MongoDB (optional) – User authentication and database management

Example:
- HTML, CSS, JavaScript  
- React / Flutter / Node.js  
- Firebase / APIs (if any)

---

## 🖥️ Implementation Details

Explain how your project works:
- Overall workflow
  The system begins with a volunteer registration page where users enter their basic details, verify their mobile number, and agree to risk-aware terms and conditions. Once registered, the user is redirected to the main dashboard, which displays nearby disaster-affected areas and relief camps based on the user’s location. Disaster and relief camp information is fetched from trusted public datasets and stored in the backend database for easy access and updates.
  
- Key features implemented
  
Volunteer registration with consent-based terms and conditions

Location-based display of nearby relief camps and disaster zones

Interactive map view for better visualization

Verified relief camp data sourced from government and humanitarian platforms

Admin-controlled data updates to ensure accuracy and reliability
- Any challenges faced and how you solved them
A major challenge was the absence of a single real-time source for relief camp data in India. This was addressed by using verified government open datasets and introducing an admin-controlled system to manually update and validate relief camp information. Another challenge was ensuring volunteer safety and legal compliance, which was solved by implementing consent-based registration, minimal data collection, and clear disclaimers regarding risks and responsibilities.
---

## 📂 Project Structure

disaster-management-platform/
│
├── public/
│   ├── index.html          # Home / volunteer registration page
│   ├── dashboard.html      # Disaster and relief camp listing page
│   ├── admin.html          # Admin panel for camp updates
│   ├── css/
│   │   └── style.css       # Global styles
│   └── js/
│       ├── main.js         # Frontend logic and validation
│       ├── map.js          # Map and location handling
│       └── api.js          # API calls to backend
│
├── server/
│   ├── server.js           # Node.js backend entry point
│   ├── routes/
│   │   ├── auth.js         # Volunteer registration routes
│   │   ├── camps.js        # Relief camp data routes
│   │   └── admin.js        # Admin update routes
│   ├── models/
│   │   ├── Volunteer.js    # Volunteer data model
│   │   └── Camp.js         # Relief camp data model
│   └── config/
│       └── db.js           # Database configuration
│
├── .gitignore
├── package.json
└── README.md

---

## 🧪 Screenshots / Demo

Add screenshots of your website or application inside the `screenshots/` folder.

Mention them here:
- Screenshot 1 – Description  
- Screenshot 2 – Description  

*(Screenshots are mandatory for evaluation)*

---



