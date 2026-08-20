# 📚 School Attendance API — DevOps Branch

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Authentication-blue?style=for-the-badge&logo=jsonwebtokens" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" />
</p>

<p align="center">
A secure <b>Node.js + Express + MongoDB</b> REST API for managing school attendance with JWT authentication, role-based authorization, attendance reports, and CSV export.
</p>

<p align="center">
<b>Branch:</b> <code>devops</code> — this branch adds containerization, CI/CD, environment/config management, and deployment tooling on top of the main application.
</p>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [DevOps Additions in This Branch](#-devops-additions-in-this-branch)
- [Installation (Local Dev)](#-installation-local-dev)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Running with Docker](#-running-with-docker)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment](#-deployment)
- [Health Checks & Monitoring](#-health-checks--monitoring)
- [Authentication](#-authentication)
- [User Roles](#-user-roles)
- [API Endpoints](#-api-endpoints)
- [Attendance Example](#-attendance-example)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Screenshots](#-screenshots)
- [Demo Video](#-demo-video)
- [Notes](#-notes)
- [Contributing](#-contributing)
- [Support](#-support)

---

## ✨ Features

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

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Encryption |
| json2csv | CSV Export |
| Docker / Docker Compose | Containerization |
| GitHub Actions | CI/CD |
| PM2 (optional) | Process Management |

---

## 🛠 DevOps Additions in This Branch

This branch is intended to make the API deployable in a repeatable, automated way. It layers the following on top of the application code:

| Area | What's Added |
|------|--------------|
| Containerization | `Dockerfile` + `docker-compose.yml` for app + MongoDB |
| CI | Lint, test, and build checks on every push/PR via GitHub Actions |
| CD | Automated build & push of Docker image to a registry on merge to `main` |
| Config | `.env.example` per environment (dev / staging / prod) |
| Health Checks | `/api/health` endpoint for uptime and readiness probes |
| Logging | Structured request logging (e.g., via `morgan`/`winston`) |
| Process Management | PM2 config for production process supervision |

> ⚠ If any of the above files (`Dockerfile`, `docker-compose.yml`, `.github/workflows/*`) don't exist yet in this branch, add them alongside this README so the sections below match the actual repo contents.

---

## ⚙ Installation (Local Dev)

Clone the repository

```bash
git clone https://github.com/yourusername/school-attendance-app.git
cd school-attendance-app
git checkout devops
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
NODE_ENV=development
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port the API listens on | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret used to sign JWTs | Yes |
| `NODE_ENV` | `development` \| `staging` \| `production` | Yes |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `1d`) | No |
| `LOG_LEVEL` | Logging verbosity (e.g. `info`, `debug`) | No |

---

## ▶ Running the Project

### Seed the Admin User

```bash
node seedAdmin.js
```

Default Login

```
Email: admin@school.com
Password: ChangeMe123!
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

## 🐳 Running with Docker

Build and run the API + MongoDB together:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

**Example `docker-compose.yml` (adjust to match repo):**

```yaml
version: "3.8"
services:
  api:
    build: .
    ports:
      - "5000:5000"
    env_file: .env
    depends_on:
      - mongo
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

**Example `Dockerfile`:**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

---

## 🔄 CI/CD Pipeline

This branch assumes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs on every push and pull request:

1. **Install** dependencies
2. **Lint** the codebase
3. **Test** (unit/integration, if present)
4. **Build** the Docker image
5. **Push** the image to a container registry (on merge to `main`)
6. **Deploy** (optional, e.g. to a VM, ECS, or Render/Railway/Fly.io)

**Example workflow skeleton:**

```yaml
name: CI/CD

on:
  push:
    branches: [main, devops]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint --if-present
      - run: npm test --if-present
      - run: docker build -t school-attendance-api .
```

---

## 🚢 Deployment

General flow for shipping this API to an environment:

1. Set environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) via your host's secret manager.
2. Build and push the Docker image to your registry (Docker Hub, GHCR, ECR, etc.).
3. Pull and run the image on the target host/cluster.
4. Point your MongoDB instance to a managed service (e.g., MongoDB Atlas) for production.
5. Put the API behind a reverse proxy (e.g., Nginx) or load balancer with HTTPS termination.
6. Verify with the `/api/health` endpoint before routing production traffic.

---

## ❤ Health Checks & Monitoring

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | Liveness/readiness check — returns `200 OK` with basic status info |

Suggested additions for production observability:
- Structured logs (JSON) shipped to a log aggregator
- Uptime monitoring hitting `/api/health`
- Alerting on error-rate/latency thresholds

---

## 🔐 Authentication

All endpoints require JWT except:

```
POST /api/auth/login
```

Include the token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 👥 User Roles

### 👑 Admin
✔ Manage Users · ✔ Manage Classes · ✔ Manage Students · ✔ Attendance CRUD · ✔ Reports · ✔ CSV Export

### 👨‍🏫 Teacher
✔ View Classes · ✔ View Students · ✔ Mark Attendance · ✔ Update Attendance · ✔ View Reports
❌ Cannot Create/Delete Users · ❌ Cannot Create/Delete Classes · ❌ Cannot Delete Attendance

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Admin |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Classes

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/classes` | All |
| GET | `/api/classes/:id` | All |
| POST | `/api/classes` | Admin |
| PUT | `/api/classes/:id` | Admin |
| DELETE | `/api/classes/:id` | Admin |

### Students

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/students` | All |
| GET | `/api/students/:id` | All |
| POST | `/api/students` | Admin |
| PUT | `/api/students/:id` | Admin |
| DELETE | `/api/students/:id` | Admin |

### Attendance

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/attendance` | Admin, Teacher |
| GET | `/api/attendance` | All |
| PUT | `/api/attendance/:id` | Admin, Teacher |
| DELETE | `/api/attendance/:id` | Admin |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/daily` | Daily Summary |
| GET | `/api/reports/monthly` | Monthly Report |
| GET | `/api/reports/export` | Export CSV |

### Ops

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health/readiness check |

---

## ✅ Attendance Example

```http
POST /api/attendance
```

```json
{
  "classId": "664f...",
  "date": "2026-08-02",
  "records": [
    { "studentId": "664a...", "status": "present" },
    { "studentId": "664b...", "status": "absent" },
    { "studentId": "664c...", "status": "late" }
  ]
}
```

---

## 📁 Project Structure

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
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── server.js
├── seedAdmin.js
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## 🔒 Security

- Passwords are hashed using **bcrypt**
- JWT Authentication
- Role-Based Authorization
- Protected Routes
- Environment Variables for Secrets
- Secrets managed via CI/CD secret store (never committed)

---

## 📸 Screenshots

### 🔑 Login
<p align="center">
<img src="https://github.com/user-attachments/assets/6d7ea361-a6e7-4812-b1a5-6489cde1fd24" width="900"/>
</p>

### 📋 Attendance Dashboard
<p align="center">
<img src="https://github.com/user-attachments/assets/cf4f125e-36bb-4242-8e19-1306a0d6bbb2" width="900"/>
</p>

### 📊 Reports
<p align="center">
<img src="https://github.com/user-attachments/assets/611b8423-771b-43db-8456-884f6e996c9c" width="900"/>
</p>

---

## 🎥 Demo Video

[![Watch Demo](https://img.shields.io/badge/▶-Watch%20Demo-red?style=for-the-badge)](https://github.com/user-attachments/assets/3e452e8a-b382-418f-a02b-8e36024da481)

---

## 📝 Notes

- Attendance is unique per **Student + Class + Date**
- Duplicate attendance automatically updates the existing record
- Always store a strong JWT secret in production
- Never commit your `.env` file
- Keep this `devops` branch in sync with `main` for application logic changes; this branch should only diverge on infra/config/pipeline files

---

# 📚 School Attendance API

[![Build and Push Docker Images](https://github.com/sk7652183-rgb/school-attendance-app/actions/workflows/docker-publish.yml/badge.svg?branch=DevOps)](https://github.com/sk7652183-rgb/school-attendance-app/actions/workflows/docker-publish.yml)

## 🤝 Contributing

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

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

<p align="center">
Made with ❤️ using Node.js, Express & MongoDB
</p>
