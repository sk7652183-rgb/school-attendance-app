# 📚 School Attendance API

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
A secure <b>Node.js + Express + MongoDB</b> REST API for managing school attendance, with JWT authentication, role-based authorization, attendance reports, and CSV export.
</p>

<p align="center">
  <b>Branch:</b> <code>devops</code> — adds containerization, CI/CD, environment/config management, and deployment tooling on top of the core application.
</p>

<p align="center">
  <a href="https://github.com/sk7652183-rgb/school-attendance-app/actions/workflows/docker-publish.yml">
    <img src="https://github.com/sk7652183-rgb/school-attendance-app/actions/workflows/docker-publish.yml/badge.svg?branch=DevOps" alt="Build and Push Docker Images" />
  </a>
</p>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [DevOps Additions in This Branch](#-devops-additions-in-this-branch)
- [Quick Start](#-quick-start)
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

This branch makes the API deployable in a repeatable, automated way. It layers the following on top of the application code:

| Area | What's Added |
|------|--------------|
| Containerization | `Dockerfile` + `docker-compose.yml` for app + MongoDB |
| CI | Lint, test, and build checks on every push/PR via GitHub Actions |
| CD | Automated build & push of Docker image to a registry on merge to `main` |
| Config | `.env.example` per environment (dev / staging / prod) |
| Health Checks | `/api/health` endpoint for uptime and readiness probes |
| Logging | Structured request logging (e.g., via `morgan`/`winston`) |
| Process Management | PM2 config for production process supervision |

> ⚠️ If any of the above files (`Dockerfile`, `docker-compose.yml`, `.github/workflows/*`) don't exist yet in this branch, add them alongside this README so the sections below match the actual repo contents.

---

## ⚡ Quick Start

Follow these steps in order — this is all you need to get the API running locally.

**1. Clone the repository and switch to the `devops` branch**

```bash
git clone https://github.com/sk7652183-rgb/school-attendance-app.git
cd school-attendance-app
git checkout devops
```

**2. Install dependencies**

```bash
npm install
```

**3. Create your environment file**

```bash
cp .env.example .env
```

**4. Fill in `.env` with your own values**

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

> Need a MongoDB connection string quickly? Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) and copy the connection URI it gives you, or point `MONGO_URI` at a local instance (`mongodb://localhost:27017/school-attendance`).

**5. Seed the default admin user**

```bash
node seedAdmin.js
```

This creates a login you can use immediately:

```
Email: admin@school.com
Password: ChangeMe123!
```

> ⚠️ Change this password immediately after your first login — never leave the default credentials active anywhere but a local machine.

**6. Start the development server**

```bash
npm run dev
```

The API should now be running at `http://localhost:5000` (or whatever `PORT` you set). Confirm it's alive:

```bash
curl http://localhost:5000/api/health
```

**7. Log in and get a token**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"ChangeMe123!"}'
```

Use the returned JWT as a `Bearer` token on all subsequent requests (see [Authentication](#-authentication)).

That's it — you have a working local instance. The sections below cover Docker, CI/CD, deployment, and the full API reference.

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

### Development

```bash
npm run dev
```

Runs the server with hot-reload (e.g. via `nodemon`) — best for local development.

### Production

```bash
npm start
```

Runs the server as it would run in production. Pair this with PM2 if you're running it directly on a host rather than in a container (see [Deployment](#-deployment)).

---

## 🐳 Running with Docker

The fastest way to run the full stack (API + MongoDB) without installing MongoDB locally.

**1. Build and start both containers**

```bash
docker compose up --build
```

**2. Or run it in the background**

```bash
docker compose up -d
```

**3. Stop everything**

```bash
docker compose down
```

**`docker-compose.yml`** (adjust to match your repo if it differs):

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

**`Dockerfile`:**

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

A GitHub Actions workflow at `.github/workflows/ci.yml` (or `docker-publish.yml`) runs automatically on every push and pull request:

1. **Install** dependencies
2. **Lint** the codebase
3. **Test** (unit/integration, if present)
4. **Build** the Docker image
5. **Push** the image to a container registry (on push to `DevOps`/`main`)
6. **Deploy** (optional — e.g. to a VM, ECS, or Render/Railway/Fly.io)

**Current workflow:**

```yaml
name: Build and Push Docker Images

on:
  push:
    branches:
      - DevOps

jobs:
  Build-Image:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        services: [frontend, backend]

    steps:
      - name: Checkout the code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Login Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ vars.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Get short commit SHA
        id: short_sha
        run: echo "SHORT_SHA=${GITHUB_SHA::7}" >> $GITHUB_ENV

      - name: Build and push Docker image
        uses: docker/build-push-action@v7
        with:
          context: ${{ matrix.services == 'frontend' && './frontend' || '.' }}
          push: ${{ github.ref == 'refs/heads/DevOps' && github.event_name == 'push' }}
          tags: |
            ${{ vars.DOCKERHUB_USERNAME }}/school-attendance-app-${{ matrix.services }}:latest
            ${{ vars.DOCKERHUB_USERNAME }}/school-attendance-app-${{ matrix.services }}:sha-${{ steps.short_sha.outputs.sha }}
```

**Required repository secrets/variables:**

| Name | Type | Purpose |
|------|------|---------|
| `DOCKERHUB_USERNAME` | Variable | Your Docker Hub username, used to tag and push images |
| `DOCKERHUB_TOKEN` | Secret | Docker Hub access token (not your password) |

---

## 🚢 Deployment

General flow for shipping this API to an environment:

1. Set environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) via your host's secret manager.
2. Build and push the Docker image to your registry (Docker Hub, GHCR, ECR, etc.) — handled automatically by CI on merge to `main`/`DevOps`.
3. Pull and run the image on the target host or cluster.
4. Point `MONGO_URI` at a managed MongoDB instance (e.g., MongoDB Atlas) for production — don't use the local `mongo` container from `docker-compose.yml` in production.
5. Put the API behind a reverse proxy (e.g., Nginx) or load balancer with HTTPS termination.
6. Verify with the `/api/health` endpoint before routing production traffic to the new instance.

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

All endpoints require a JWT **except**:

```
POST /api/auth/login
```

Include the token on every other request:

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

- Attendance is unique per **Student + Class + Date** — a duplicate submission automatically updates the existing record rather than creating a new one.
- Always store a strong, random `JWT_SECRET` in production.
- Never commit your `.env` file.
- Keep this `devops` branch in sync with `main` for application logic changes; it should only diverge on infra/config/pipeline files.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes
   ```bash
   git commit -m "Added new feature"
   ```
4. Push the branch
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
