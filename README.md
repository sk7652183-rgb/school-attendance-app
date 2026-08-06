# 🚀 School Attendance Application – DevOps

<p align="center">

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Alpine-009639?style=for-the-badge&logo=nginx&logoColor=white)

</p>

---

# 📚 Table of Contents

- Overview
- Architecture
- Backend Docker Image
- Optimized Multi-Stage Build
- Docker Best Practices
- .dockerignore
- Frontend Docker Image
- Docker Compose
- Running the Project
- Default Credentials
- Create Additional Users
- Verify Users in MongoDB
- Docker Images
- Docker Hub
- Demo
- Final Result

---

# 📌 Overview

This project demonstrates containerizing a **Full Stack School Attendance Application** using Docker.

The application consists of:

- 🌐 HTML/CSS/JavaScript Frontend
- ⚙️ Node.js + Express REST API
- 🍃 MongoDB Database
- 🌍 Nginx Reverse Proxy
- 🐳 Docker & Docker Compose

---

# 🏗️ Architecture

```
                    Browser
                        │
                        ▼
                Nginx (Frontend)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
 Static HTML/CSS/JS             /api Requests
                                        │
                                        ▼
                            Node.js + Express API
                                        │
                                        ▼
                                   MongoDB
```

---

# 🖥️ Backend Docker Image

## Basic Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm","start"]
```

Build

```bash
docker build -t school-attendance-app:v1 .
```

Image Size

| Version | Size |
|----------|------|
| Initial | 300 MB |

---

# 🚀 Optimized Multi-Stage Docker Build

```dockerfile
# Stage 1
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# Stage 2

FROM node:22-alpine

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

USER node

EXPOSE 5000

CMD ["node","server.js"]
```

Build

```bash
docker build --no-cache -t school-attendance-app .
```

---

## 📊 Image Comparison

| Version | Size |
|----------|------|
| Initial | 300 MB |
| Optimized | 280 MB |

✅ Reduced image size by **20 MB**

---

# 🛡️ Docker Best Practices

| Practice | Status |
|----------|:------:|
| Multi-stage Build | ✅ |
| Non-root User | ✅ |
| Alpine Image | ✅ |
| Docker Cache | ✅ |
| Optimized Layers | ✅ |
| Smaller Image | ✅ |
| Production Dependencies | ✅ |

---

# 📁 .dockerignore

```gitignore
node_modules
.git
.gitignore
README.md
.env
npm-debug.log
*.log
```

Benefits

- Faster Docker Builds
- Smaller Build Context
- Better Cache Usage
- Keeps Secrets Out of Images

---

# 🌐 Frontend Docker Image

```dockerfile
FROM nginx:1.25-alpine

COPY . /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
```

Build

```bash
cd frontend

docker build -t school-attendance-app-frontend .
```

---

# 📦 Docker Compose

Services

- Frontend
- Backend
- MongoDB
- Persistent Volume
- Docker Network

Start

```bash
docker compose up -d --build
```

Stop

```bash
docker compose down
```

View Logs

```bash
docker compose logs -f
```

---

# ▶ Running the Project

Application

```
http://<EC2-PUBLIC-IP>
```

Backend API

```
http://<EC2-PUBLIC-IP>/api
```

---

# 🔑 Default Credentials

The backend automatically creates an Admin user.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | ChangeMe123! |

---

# 👥 Create Additional Users

Create Teacher One

```bash
docker exec -it school-attendance-backend node createUser.js "Teacher One" teacher1@school.com Password123!
```

Create Teacher Two

```bash
docker exec -it school-attendance-backend node createUser.js "Teacher Two" teacher2@school.com Password123!
```

General Command

```bash
docker exec -it school-attendance-backend node createUser.js "<Name>" <Email> <Password>
```

---

# 🔍 Verify Users in MongoDB

Connect

```bash
docker exec -it attendance-mongodb mongosh
```

Use Database

```javascript
use school_attendance
```

View Users

```javascript
db.users.find({},{
password:0
}).pretty()
```

View Students

```javascript
db.students.find().pretty()
```

View Classes

```javascript
db.classes.find().pretty()
```

View Attendance

```javascript
db.attendances.find().pretty()
```

---

# 🐳 Docker Images

| Image | Purpose |
|------|----------|
| school-attendance-app | Backend |
| school-attendance-app:v1 | Initial Backend |
| school-attendance-app-frontend | Frontend |

---

# ☁ Docker Hub

Backend

https://hub.docker.com/r/sufiyn/school-attendance-app-backend

Frontend

https://hub.docker.com/r/sufiyn/school-attendance-app-frontend

Pull Images

```bash
docker pull sufiyn/school-attendance-app-backend:latest

docker pull sufiyn/school-attendance-app-frontend:latest
```

---

# 🎥 Demo

🎬 Watch the project demo below.

https://github.com/user-attachments/assets/3e452e8a-b382-418f-a02b-8e36024da481

---

# 🎯 Final Result

✅ Backend Containerized

✅ Frontend Containerized

✅ MongoDB Containerized

✅ Docker Compose Configured

✅ Multi-stage Docker Build

✅ Optimized Image Size

✅ Non-root User

✅ Nginx Reverse Proxy

✅ Persistent MongoDB Volume

✅ Docker Hub Images Published

✅ Production Ready Deployment

---

## ⭐ Support

If you found this project useful, please consider giving it a **⭐ Star** on GitHub.

Happy Learning! 🚀
