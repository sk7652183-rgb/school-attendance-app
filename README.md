# 📚 School Attendance API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Authentication-blue?style=for-the-badge&logo=jsonwebtokens" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" />
</p>

<p align="center">
A secure <b>Node.js + Express + MongoDB</b> REST API for managing school attendance with JWT authentication, role-based authorization, attendance reports, and CSV export.
</p>

---

# ✨ Features

- 🔐 JWT Authentication
- 👥 Role-Based Access Control (Admin & Teacher)
- 🏫 Class Management
- 🎓 Student Management
- ✅ Daily Attendance Tracking
- 📅 Monthly Attendance Reports
- 📊 Daily Attendance Summary
- 📄 CSV Report Export
- 🔒 Password Hashing using bcrypt
- ⚡ RESTful API Design
- 🗄 MongoDB + Mongoose

---

# 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Authentication](#-authentication)
- [User Roles](#-user-roles)
- [API Endpoints](#-api-endpoints)
- [Attendance Example](#-attendance-example)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Demo Video](#-demo-video)
- [Notes](#-notes)

---

# 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Encryption |
| json2csv | CSV Export |

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/school-attendance-app.git

cd school-attendance-app
```

Install dependencies

```bash
npm install
```

Copy environment variables

```bash
cp .env.example .env
```

Edit your `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_super_secret_key
```

---

# ▶ Running the Project

### Seed the Admin User

```bash
node seedAdmin.js
```

Default Login

```
Email:
admin@school.com

Password:
ChangeMe123!
```

> ⚠ Change the password immediately after first login.

Start Development Server

```bash
npm run dev
```

Production

```bash
npm start
```

---

# 🔐 Authentication

All endpoints require JWT except:

```
POST /api/auth/login
```

Include the token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 👥 User Roles

## 👑 Admin

✔ Manage Users

✔ Manage Classes

✔ Manage Students

✔ Attendance CRUD

✔ Reports

✔ CSV Export

---

## 👨‍🏫 Teacher

✔ View Classes

✔ View Students

✔ Mark Attendance

✔ Update Attendance

✔ View Reports

❌ Cannot Create/Delete Users

❌ Cannot Create/Delete Classes

❌ Cannot Delete Attendance

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Access |
|---------|----------|--------|
| POST | `/api/auth/register` | Admin |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

---

Connect

| Method | Endpoint | Access |
|---------|----------|--------|
| GET | `/api/classes` | All |
| GET | `/api/classes/:id` | All |
| POST | `/api/classes` | Admin |
| PUT | `/api/classes/:id` | Admin |
| DELETE | `/api/classes/:id` | Admin |

---

Use Database

| Method | Endpoint | Access |
|---------|----------|--------|
| GET | `/api/students` | All |
| GET | `/api/students/:id` | All |
| POST | `/api/students` | Admin |
| PUT | `/api/students/:id` | Admin |
| DELETE | `/api/students/:id` | Admin |

---

View Users

| Method | Endpoint | Access |
|---------|----------|--------|
| POST | `/api/attendance` | Admin, Teacher |
| GET | `/api/attendance` | All |
| PUT | `/api/attendance/:id` | Admin, Teacher |
| DELETE | `/api/attendance/:id` | Admin |

---

## Reports

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/reports/daily` | Daily Summary |
| GET | `/api/reports/monthly` | Monthly Report |
| GET | `/api/reports/export` | Export CSV |

---

# ✅ Attendance Example

```http
POST /api/attendance
```

```json
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

---

# 📁 Project Structure

```javascript
db.attendances.find().pretty()
```
school-attendance-app
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
│
├── server.js
├── seedAdmin.js
├── .env.example
└── package.json
```

---

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
