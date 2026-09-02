# 🎓 DSCH-Edu

### Digital Education Platform by Digital Smart City Hub

DSCH-Edu is the education module of **Digital Smart City Hub (DSCH)**, designed to provide a structured digital platform for discovering educational institutes, exploring courses, submitting admissions, and managing education-related workflows.

🌐 **Live Website:** https://edu.kohat.online

---

## 📌 About DSCH-Edu

DSCH-Edu brings important education services into one platform.

Students and parents can:

- Discover schools and colleges
- Explore available educational information
- Browse skill-based courses
- Submit admission applications online
- Upload required documents
- Submit admission payment information
- Track application and payment status
- Access their student account after approval

Institutes can:

- Register their institute
- Complete their institute profile
- Manage admission applications
- Review student documents
- Review admission payments
- Approve or reject applications
- Manage students and fee-related workflows

Platform administrators manage institute approvals, courses, and other platform-level operations.

---

## ✨ Key Features

### 👨‍🎓 Students

- Student registration and authentication
- School and college discovery
- Institute profile viewing
- Online admission applications
- Document uploads
- Admission payment submission
- Application status tracking
- Payment status tracking
- Student dashboard
- Course exploration and enrollment

### 🏫 Institutes

- Institute registration
- Institute profile management
- Academic programs management
- Facilities and information management
- Admission application management
- Student document review
- Admission payment review
- Student management
- Fee management

### 📚 Courses

- Course listing
- Course details
- Course categories
- Course enrollment
- Course provider information
- Enrollment and payment workflow

### ⚙️ Administration

- Institute registration review
- Institute approval workflow
- Course management
- Admission workflow management
- Student and payment management
- Platform-level administration

---

## 🔄 Admission Workflow

The admission process follows a structured workflow:

```text
Student
   ↓
Explore Institute
   ↓
Submit Admission Application
   ↓
Institute Reviews Application
   ↓
Approve / Reject
   ↓
Student Submits Admission Fee Proof
   ↓
Institute Reviews Payment
   ↓
Payment Approved
   ↓
Student Account Activation
   ↓
Student Management & Monthly Fees

---

### 📁 Folder Structure

A simplified project structure:

DSCH-Edu/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── apicalls/
│       ├── assets/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/
│   └── server.js
│
├── .gitignore
└── README.md

---

### ⚙️ Environment Variables

Create environment files for the frontend and backend according to the configuration used by the project.

# Frontend:

VITE_API_URL=your_backend_api_url

# Backend:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_email
SMTP_PASS=your_smtp_password
