# 📚 School Attendance API

```{=html}
<p align="center">
```
`<img src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js" />`{=html}
`<img src="https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express" />`{=html}
`<img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb" />`{=html}
`<img src="https://img.shields.io/badge/JWT-Authentication-blue?style=for-the-badge&logo=jsonwebtokens" />`{=html}
`<img src="https://img.shields.io/badge/Docker-Containerization-blue?style=for-the-badge&logo=docker" />`{=html}
`<img src="https://img.shields.io/badge/AWS%20EC2-Deployment-orange?style=for-the-badge&logo=amazonaws" />`{=html}
`<img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" />`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
A secure `<strong>`{=html}Node.js + Express + MongoDB`</strong>`{=html}
REST API for managing school attendance with JWT authentication,
role-based authorization, attendance reports, CSV export, Docker
containerization, and CI/CD using GitHub Actions.
```{=html}
</p>
```

------------------------------------------------------------------------

## ✨ Features

-   🔐 JWT-based authentication
-   👥 Role-based access control (Admin & Teacher)
-   🏫 Class management
-   🎓 Student management
-   ✅ Daily attendance tracking
-   📅 Monthly attendance reports
-   📊 Daily attendance summaries
-   📄 CSV report export
-   🔒 Password hashing with bcrypt
-   ⚡ RESTful API architecture
-   🗄 MongoDB with Mongoose
-   🐳 Docker containerization
-   📦 Docker Hub image publishing
-   🔄 GitHub Actions CI/CD
-   ☁️ AWS EC2 deployment
-   🌐 Nginx frontend/reverse proxy

------------------------------------------------------------------------

## 📑 Table of Contents

-   [Tech Stack](#-tech-stack)
-   [Installation](#-installation)
-   [Environment Variables](#-environment-variables)
-   [Running the Project](#-running-the-project)
-   [Authentication](#-authentication)
-   [User Roles](#-user-roles)
-   [API Endpoints](#-api-endpoints)
-   [Attendance Example](#-attendance-example)
-   [Project Structure](#-project-structure)
-   [Docker Deployment](#-docker-deployment)
-   [EC2 Security Group
    Configuration](#-ec2-security-group-configuration)
-   [GitHub Actions CI/CD](#-github-actions-cicd)
-   [Docker Troubleshooting](#-docker-troubleshooting)
-   [Deployment Architecture](#-deployment-architecture)
-   [Screenshots](#-screenshots)
-   [Demo Video](#-demo-video)
-   [Security](#-security)
-   [Notes](#-notes)
-   [Contributing](#-contributing)
-   [Support](#-support)

------------------------------------------------------------------------

## 🚀 Tech Stack

  Technology       Purpose
  ---------------- -------------------------------------
  Node.js          Runtime environment
  Express.js       Backend framework
  MongoDB          Database
  Mongoose         MongoDB ODM
  JWT              Authentication
  bcrypt           Password hashing
  json2csv         CSV report generation
  Docker           Containerization
  Docker Hub       Container image registry
  GitHub Actions   CI/CD
  AWS EC2          Cloud deployment
  Nginx            Frontend web server / reverse proxy

------------------------------------------------------------------------

## ⚙️ Installation

### 1. Clone the repository

``` bash
git clone https://github.com/sk7652183-rgb/school-attendance-app.git
cd school-attendance-app
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

``` bash
cp .env.example .env
```

Update `.env`:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Never commit your `.env` file to GitHub.

------------------------------------------------------------------------

## ▶️ Running the Project

### Seed the Admin User

``` bash
node seedAdmin.js
```

Default credentials:

``` text
Email: admin@school.com
Password: ChangeMe123!
```

> ⚠️ Change the default password immediately after the first login.

### Development

``` bash
npm run dev
```

### Production

``` bash
npm start
```

------------------------------------------------------------------------

## 🔐 Authentication

All protected endpoints require a valid JWT token.

Public endpoint:

``` http
POST /api/auth/login
```

Include the JWT token in the request header:

``` http
Authorization: Bearer YOUR_JWT_TOKEN
```

------------------------------------------------------------------------

## 👥 User Roles

### 👑 Admin

-   ✅ Manage users
-   ✅ Manage classes
-   ✅ Manage students
-   ✅ Create, update, and delete attendance
-   ✅ View reports
-   ✅ Export CSV reports

### 👨‍🏫 Teacher

-   ✅ View classes
-   ✅ View students
-   ✅ Mark attendance
-   ✅ Update attendance
-   ✅ View reports
-   ❌ Cannot create or delete users
-   ❌ Cannot create or delete classes
-   ❌ Cannot delete attendance

------------------------------------------------------------------------

## 📡 API Endpoints

### Authentication

  Method   Endpoint               Access
  -------- ---------------------- ---------------
  `POST`   `/api/auth/register`   Admin
  `POST`   `/api/auth/login`      Public
  `GET`    `/api/auth/me`         Authenticated

### Classes

  Method     Endpoint             Access
  ---------- -------------------- --------
  `GET`      `/api/classes`       All
  `GET`      `/api/classes/:id`   All
  `POST`     `/api/classes`       Admin
  `PUT`      `/api/classes/:id`   Admin
  `DELETE`   `/api/classes/:id`   Admin

### Students

  Method     Endpoint              Access
  ---------- --------------------- --------
  `GET`      `/api/students`       All
  `GET`      `/api/students/:id`   All
  `POST`     `/api/students`       Admin
  `PUT`      `/api/students/:id`   Admin
  `DELETE`   `/api/students/:id`   Admin

### Attendance

  Method     Endpoint                Access
  ---------- ----------------------- ----------------
  `POST`     `/api/attendance`       Admin, Teacher
  `GET`      `/api/attendance`       All
  `PUT`      `/api/attendance/:id`   Admin, Teacher
  `DELETE`   `/api/attendance/:id`   Admin

### Reports

  Method   Endpoint                 Description
  -------- ------------------------ ---------------------------
  `GET`    `/api/reports/daily`     Daily attendance summary
  `GET`    `/api/reports/monthly`   Monthly attendance report
  `GET`    `/api/reports/export`    Export attendance as CSV

------------------------------------------------------------------------

## ✅ Attendance Example

### Request

``` http
POST /api/attendance
```

### Request Body

``` json
{
  "classId": "664f...",
  "date": "2026-08-02",
  "records": [
    {
      "studentId": "664a...",
      "status": "present"
    },
    {
      "studentId": "664b...",
      "status": "absent"
    },
    {
      "studentId": "664c...",
      "status": "late"
    }
  ]
}
```

------------------------------------------------------------------------

## 📁 Project Structure

``` text
school-attendance-app/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── classController.js
│   ├── studentController.js
│   ├── attendanceController.js
│   └── reportController.js
│
├── middleware/
│   ├── auth.js
│   └── role.js
│
├── models/
│   ├── User.js
│   ├── Class.js
│   ├── Student.js
│   └── Attendance.js
│
├── routes/
│   ├── authRoutes.js
│   ├── classRoutes.js
│   ├── studentRoutes.js
│   ├── attendanceRoutes.js
│   └── reportRoutes.js
│
├── frontend/
│
├── .github/
│   └── workflows/
│       └── docker-publish.yml
│
├── server.js
├── seedAdmin.js
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── package-lock.json
```


# 📸 Screenshots

## 🔑 Login

<p align="center">
<img src="https://github.com/user-attachments/assets/6d7ea361-a6e7-4812-b1a5-6489cde1fd24" width="900"/>
</p>

---

## 📋 Attendance Dashboard

<p align="center">
<img src="https://github.com/user-attachments/assets/cf4f125e-36bb-4242-8e19-1306a0d6bbb2" width="900"/>
</p>

---

## 📊 Reports

<p align="center">
<img src="https://github.com/user-attachments/assets/611b8423-771b-43db-8456-884f6e996c9c" width="900"/>
</p>

---

# 🎥 Demo Video

Click the image below to watch the demo.

[![Watch Demo](https://img.shields.io/badge/▶-Watch%20Demo-red?style=for-the-badge)](https://github.com/user-attachments/assets/3e452e8a-b382-418f-a02b-8e36024da481)

---

# 🔒 Security

- Passwords are hashed using **bcrypt**
- JWT Authentication
- Role-Based Authorization
- Protected Routes
- Environment Variables for Secrets

---

# 📝 Notes

- Attendance is unique per **Student + Class + Date**
- Duplicate attendance automatically updates the existing record.
- Always store a strong JWT secret in production.
- Never commit your `.env` file.

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

---

<p align="center">
Made with ❤️ using Node.js, Express & MongoDB
</p>
