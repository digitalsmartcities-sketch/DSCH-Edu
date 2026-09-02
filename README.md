# 🎓 DSCH-Edu

> A full-stack digital education platform by Digital Smart City Hub (DSCH) for discovering educational institutes, exploring courses, submitting admissions, managing students, and handling education-related workflows.

🌐 **Live Website:** https://edu.kohat.online

---

## 📌 About the Project

**DSCH-Edu** is the education module of **Digital Smart City Hub (DSCH)**.

The platform is designed to bring different education-related services into one centralized digital system. Instead of requiring students and parents to visit institutes physically for every stage of the admission process, DSCH-Edu provides online workflows for discovering institutes, exploring educational programs, submitting admission applications, uploading documents, submitting payment information, and tracking application progress.

Educational institutes can use the platform to create and manage their institute profiles, maintain academic information, review admission applications, verify student documents and payments, manage students, and handle fee-related workflows.

The platform also provides course discovery and enrollment functionality, allowing users to explore skill-based courses and interact with course providers.

Platform administrators are responsible for higher-level operations such as reviewing institute registrations, approving institutes, managing courses, and overseeing platform workflows.

---

## ✨ Features

### 👨‍🎓 Student Features

* Student registration and authentication
* Student account management
* School and college discovery
* Institute profile viewing
* Academic program exploration
* Online admission applications
* Required document uploads
* Admission payment information submission
* Application status tracking
* Payment status tracking
* Student dashboard
* Student account activation after admission workflow
* Student management after admission
* Monthly fee-related workflows

### 🏫 Institute Features

* Institute registration
* Institute approval workflow
* Institute profile management
* Academic programs management
* Facilities and institute information management
* Admission management
* Application review
* Student document review
* Admission payment review
* Application approval and rejection
* Student management
* Fee management

### 📚 Course Features

* Course listing
* Course discovery
* Course categories
* Course details
* Course provider information
* Course enrollment
* Course enrollment/payment workflow

### ⚙️ Administration

* Institute registration review
* Institute approval and rejection
* Course management
* Admission workflow management
* Student management
* Payment management
* Platform-level administration
* Administrative dashboard functionality

### 🔐 Authentication & Security

* User authentication
* JWT-based authentication
* Password hashing with Argon2
* Cookie-based authentication support
* Role-based middleware
* Protected API routes
* Separate administrative and student workflows

### ☁️ File & Communication Services

* Student document uploads
* Cloudinary integration
* Multipart file handling with Multer
* Email communication through Nodemailer
* Email templates for platform communication

---

## 🧑‍💼 User Roles

### Student

Students are the primary users of the education platform.

They can:

* Create an account
* Authenticate securely
* Discover educational institutes
* View institute information
* Explore academic programs
* Apply for admission
* Upload required documents
* Submit admission payment information
* Track application status
* Track payment status
* Access their student dashboard
* Explore and enroll in courses

### Institute

Educational institutes can manage their presence and education workflows through the platform.

Institutes can:

* Register their institute
* Maintain institute information
* Manage academic programs
* Manage facilities and other information
* Review admission applications
* Review uploaded documents
* Review admission payments
* Approve or reject applications
* Manage students
* Manage student fees

### Administrator

Platform administrators manage the overall education ecosystem.

Administrators can:

* Review institute registrations
* Approve or reject institutes
* Manage courses
* Manage platform-level admission workflows
* Manage students and payments
* Perform administrative operations across the platform

---

## 🛠️ Technology Stack

### Frontend

* ⚛️ React 19
* ⚡ Vite
* 🧭 React Router
* 🔗 Axios
* 🎯 React Icons
* 🧹 ESLint
* 📦 npm

The frontend is organized around reusable components, pages, dashboards, forms, API-call modules, application context, and static assets.

### Backend

* 🟢 Node.js
* 🚂 Express.js
* 🍃 MongoDB
* 🧩 Mongoose
* 🔐 JSON Web Tokens
* 🔒 Argon2
* 📧 Nodemailer
* 📦 Multer
* ☁️ Cloudinary
* 🍪 Cookie Parser
* 🌐 CORS
* 🔄 Streamifier

These dependencies are defined in the current backend package configuration.

### External Services

* ☁️ **Cloudinary** — file and media storage
* 📩 **SMTP / Nodemailer** — email communication
* 🍃 **MongoDB** — application database

---

## 🔐 Authentication & Authorization

The backend separates application functionality into different route and controller groups.

```text
                    ┌─────────────────┐
                    │   Authentication│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ User Middleware │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌─────────────┐
        │ Student  │   │  Admin   │   │ Super Admin │
        │ Routes   │   │ Routes   │   │   Routes    │
        └──────────┘   └──────────┘   └─────────────┘
```

The backend currently contains dedicated controller and router modules for:

* Public functionality
* Students
* Administrators
* Super administrators

The middleware layer contains user authentication/authorization functionality.

```

## 📁 Project Structure

The repository is divided into separate frontend and backend applications.

```text
DSCH-Edu/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── apicalls/
│   │   ├── app_context/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── dashboards/
│   │   ├── forms/
│   │   ├── pages/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── Config/
│   ├── Controller/
│   │   ├── admin_cont.js
│   │   ├── public_cont.js
│   │   ├── student_cont.js
│   │   └── super_admin_cont.js
│   │
│   ├── Middleware/
│   │   └── userMW.js
│   │
│   ├── Models/
│   │   ├── Admin.js
│   │   ├── Admission.js
│   │   ├── Course.js
│   │   ├── CourseEnrollment.js
│   │   ├── Fee.js
│   │   ├── Institute.js
│   │   ├── Reviews.js
│   │   └── Student.js
│   │
│   ├── Router/
│   │   ├── admin_router.js
│   │   ├── public_router.js
│   │   ├── student_router.js
│   │   └── super_admin_router.js
│   │
│   ├── Template/
│   ├── Utils/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

The structure above reflects the current repository rather than the simplified `client/server` structure in the older README.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* MongoDB / MongoDB Atlas
* Git
* npm

---

## 1. Clone the Repository

```bash
git clone https://github.com/digitalsmartcities-sketch/DSCH-Edu.git

cd DSCH-Edu
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

# ⚙️ Environment Variables

The project uses environment variables for frontend API configuration and backend services.

### Frontend

Create an environment file inside `frontend/`:

```env
VITE_API_URL=your_backend_api_url
```

### Backend

Create a `.env` file inside `backend/`:

```env
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
```

**Do not commit real credentials to the repository.**

The repository's `.gitignore` excludes `.env` files, build output, uploaded files, logs, IDE configuration, and other local development files.

---

# ▶️ Running the Project

## Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend development script uses Node's watch mode and loads environment variables from `.env`.

---

## Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The frontend uses Vite's development server.

The development frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🏗️ Build for Production

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

To preview the production frontend build locally:

```bash
npm run preview
```

The frontend package defines `dev`, `build`, `lint`, and `preview` scripts.

---

# 🌐 Deployment

The production platform is available at:

**https://edu.kohat.online**

DSCH-Edu is structured as two independently managed applications:

```text
                    Production
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
   React / Vite                  Node / Express
    Frontend                       Backend
          │                           │
          └──────────────┬────────────┘
                         │
                         ▼
                      MongoDB
                         │
                         ├── Cloudinary
                         │
                         └── SMTP
```

The production environment requires the appropriate frontend API URL and backend credentials for MongoDB, Cloudinary, JWT authentication, and SMTP services.

---

# 📩 Feedback

Have a suggestion, improvement, or feature idea?

You can use the platform's **Contact Us** functionality or open an issue in the repository.

---

# 👨‍💻 Project

**DSCH-Edu**

Part of **Digital Smart City Hub (DSCH)**.

Built as a real-world digital education platform to bring institutes, students, courses, admissions, payments, and education management workflows into one centralized system.

---

## 📜 License

Copyright © 2026 Digital Smart City Hub. All rights reserved.
