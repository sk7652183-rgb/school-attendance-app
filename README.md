# 🚀 School Attendance Application – DevOps

<p align="center">

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Alpine-009639?style=for-the-badge&logo=nginx&logoColor=white)

</p>

---

# 📚 Table of Contents

- 📌 Overview
- 🖥️ Backend Docker Image
- 🚀 Optimized Multi-Stage Build
- 🛡️ Docker Best Practices
- 📁 .dockerignore
- 🧪 Local Testing
- 🌐 Frontend Docker Image
- 🐳 Docker Images
- 📦 Docker Compose
- 🎥 Demo
- ☁️ Docker Hub
- 🎯 Final Result

---

# 📌 Overview

This project demonstrates the containerization of the **School Attendance Application** using Docker.

✨ **Features**

- 🏗️ Multi-stage Docker builds
- 👤 Non-root user execution
- 📦 Lightweight Alpine images
- ⚡ Optimized image size
- 🔒 Production-ready configuration
- 🧹 Clean build context using `.dockerignore`

---

# 🖥️ Backend Docker Image

<details>
<summary><b>📄 Version 1 – Basic Dockerfile</b></summary>

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]
```

### Build

```bash
docker build -t school-attendance-app:v1 .
```

| Image | Size |
|-------|------|
| school-attendance-app:v1 | 300 MB |

</details>

---

# 🚀 Optimized Multi-Stage Docker Build

<details>
<summary><b>📄 View Optimized Dockerfile</b></summary>

```dockerfile
# Stage 1 - Install production dependencies

FROM node:22-alpine AS deps
...

FROM node:22-alpine AS runner
...
```

</details>

### Build

```bash
docker build --no-cache -t school-attendance-app .
```

## 📊 Image Comparison

| Version | Size |
|---------|------|
| Initial | 300 MB |
| Optimized | 280 MB |

> ✅ Reduced image size by **20 MB**

---

# 🛡️ Docker Best Practices

| Practice | Status |
|----------|:------:|
| Multi-stage Build | ✅ |
| Alpine Image | ✅ |
| Production Dependencies | ✅ |
| Non-root User | ✅ |
| Smaller Image | ✅ |
| Optimized Layers | ✅ |

---

# 📁 .dockerignore

```gitignore
node_modules
.git
.gitignore
Dockerfile
README.md
.env
npm-debug.log
*.log
```

### Benefits

- ⚡ Faster builds
- 📦 Smaller build context
- 🔒 Keeps secrets out of images
- 🚀 Better Docker cache

---

# 🧪 Local Testing

```bash
docker build --no-cache -t school-attendance-app .

docker run -p 3000:3000 school-attendance-app
```

✅ Application started successfully inside the container.

---

# 🌐 Frontend Docker Image

```dockerfile
FROM nginx:1.25-alpine

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
```

### Build

```bash
cd frontend

docker build -t school-attendance-app-fe .
```

| Image | Base Image | Size |
|-------|------------|------|
| school-attendance-app-fe | nginx:1.25-alpine | 74 MB |

---

# 🐳 Docker Images

| Image | Purpose |
|-------|---------|
| school-attendance-app | Backend |
| school-attendance-app:v1 | Initial Backend |
| school-attendance-app-fe | Frontend |

---

# 📦 Docker Compose

✅ Configured Docker Compose with:

- 🖥️ Frontend Service
- ⚙️ Backend Service
- 🍃 MongoDB
- 💾 Persistent Volume
- 🌐 Custom Network
- 🔐 Environment Variables
- ❤️ Health Checks

---

# 🎥 Demo Video

Click below to watch the demo.

[![Watch Demo](https://img.shields.io/badge/▶-Watch%20Demo-red?style=for-the-badge)](https://github.com/user-attachments/assets/3e452e8a-b382-418f-a02b-8e36024da481)

---

# ☁️ Docker Hub

[![Docker Hub](https://img.shields.io/badge/Open-Docker%20Hub-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/repositories/sufiyn)

### 📦 Images

| Image | Link |
|------|------|
| 🖥️ Backend | https://hub.docker.com/r/sufiyn/school-attendance-app-backend |
| 🌐 Frontend | https://hub.docker.com/r/sufiyn/school-attendance-app-frontend |

### Pull Images

```bash
docker pull sufiyn/school-attendance-app-backend:latest

docker pull sufiyn/school-attendance-app-frontend:latest
```

---

# 🎯 Final Result

> ✅ Backend containerized

> ✅ Frontend containerized

> ✅ Multi-stage Docker build implemented

> ✅ Non-root user configured

> ✅ Docker image optimized

> ✅ Build context reduced

> ✅ Docker Compose configured

> ✅ Images published to Docker Hub

> ✅ Successfully tested

---

## ⭐ If you found this project useful, consider giving it a Star!
