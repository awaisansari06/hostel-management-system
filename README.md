# 🏨 Hostel Management System

![Project Banner](https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

> A modern, robust, and aesthetic full-stack solution for managing hostel operations, built with the **MERN Stack** and **Tailwind CSS**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933.svg?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css)

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
- [📂 Project Structure](#-project-structure)
- [🔑 Environment Variables](#-environment-variables)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🛡️ Admin Portal
- **Dashboard Overview**: Real-time statistics on total students, room occupancy, and maintenance alerts.
- **Room Management**: 
  - Create, edit, and delete rooms.
  - Visual occupancy progress bars (Green/Yellow/Red status).
  - Quick assign/unassign functionality.
- **Student Management**:
  - Full CRUD operations for student records.
  - Search by name or email.
  - Filter students by assigned/unassigned status.
  - One-click room allocation.
- **Global Search**: Find any resource instantly.

### 🎓 Student Portal
- **Personal Dashboard**: View room assignment status, roommate details, and profile info at a glance.
- **Room Details**: See room capacity, amenities, and connected roommates.
- **Profile Management**: customizable profile (Name/Phone) with ID-card style visual.
- **Mobile Responsive**: Fully accessible on smartphones and tablets.

### 💎 UI/UX Highlights
- **Dark Mode Aesthetic**: A sleek, modern dark theme using Slate and Emerald color palettes.
- **Bento Grid Layouts**: Responsive and cleaner information density.
- **Micro-Interactions**: Smooth transitions, hover effects, and skeleton loading states.
- **Toast Notifications**: Global success/error feedback system.

---

## 🛠️ Tech Stack

### Client-Side (Frontend)
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS, PostCSS
- **Routing**: React Router DOM v6
- **State Management**: React Context API (Auth, Toast)
- **Icons**: Heroicons / SVGs

### Server-Side (Backend)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Security**: Cors, Helmet

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URL)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/hostel-management-system.git
cd hostel-management-system
```

### 2️⃣ Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```
> Server runs on `http://localhost:5000`

### 3️⃣ Frontend Setup
Navigate to the frontend folder and install dependencies:
```bash
cd ../frontend
npm install
```

Start the client:
```bash
npm run dev
```
> Client runs on `http://localhost:5173`

---

## 📂 Project Structure

```bash
hostel-management-system/
├── backend/                # Express API
│   ├── config/             # DB Connection
│   ├── controllers/        # Route Logic (Auth, Rooms, Students)
│   ├── middleware/         # Auth protection
│   ├── models/             # Mongoose Schemas
│   └── routes/             # API Endpoints
│
└── frontend/               # React Application
    ├── public/
    └── src/
        ├── components/     # Reusable UI (Card, Modal, Toast)
        ├── context/        # Global State (AuthContext, ToastContext)
        ├── pages/          # Admin & Student Views
        ├── services/       # Axios API integration
        └── App.jsx         # Main Router
```

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/login` | User authentication |
| **GET** | `/api/rooms` | Get all rooms |
| **POST** | `/api/rooms` | Create a new room (Admin) |
| **GET** | `/api/students` | Get list of students (Admin) |
| **PUT** | `/api/student/profile` | Update student profile |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Awais Ansari
</p>
