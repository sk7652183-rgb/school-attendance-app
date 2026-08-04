🚀 School Attendance Application – DevOps






📌 Overview

This project demonstrates the containerization of the School Attendance Application by creating separate Docker images for the backend and frontend.

The implementation follows Docker best practices:

🏗️ Multi-stage builds
👤 Non-root user execution
📦 Lightweight Alpine base images
⚡ Optimized image size
🧹 Clean build context using .dockerignore
🖥️ Backend Docker Image
Version 1 – Basic Dockerfile

The initial implementation used a simple single-stage Docker build.

```bash

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```
🔨 Build
docker build -t school-attendance-app:v1 .

📊 Result
Image	Size
school-attendance-app:v1	300 MB
🚀 Optimized Multi-Stage Docker Build

To improve security and reduce image size, the Dockerfile was redesigned using a multi-stage build.

# Stage 1 - Install production dependencies

```bash

# Stage 1 - Install production dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2 - Production image
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY server.js seedAdmin.js createUser.js ./
COPY config ./config
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY frontend ./frontend

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]


```

🔨 Build Command
docker build --no-cache -t school-attendance-app .

📈 Image Size Comparison
Docker Image	Size
Initial Image	300 MB
Optimized Image	280 MB

✅ Reduced image size by approximately 20 MB while improving security and maintainability.

🛡️ Docker Best Practices
Practice	Status
Multi-stage build	✅
Alpine base image	✅
Production dependencies only	✅
Non-root user	✅
Smaller image size	✅
Optimized Docker layers	✅
📁 .dockerignore

To reduce the Docker build context, unnecessary files were excluded.

node_modules
.git
.gitignore
Dockerfile
README.md
.env
npm-debug.log
*.log

🎯 Benefits
⚡ Faster builds
📦 Smaller build context
🔒 Prevents accidental inclusion of sensitive files
🚀 Better Docker layer caching
🧪 Local Testing

The optimized Docker image was successfully built and tested locally.

docker build --no-cache -t school-attendance-app .

docker run -p 3000:3000 school-attendance-app


✔️ Application started successfully inside the container.

🌐 Frontend Docker Image

The frontend is served using Nginx Alpine.

```bash

FROM nginx:1.25-alpine

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

```

🔨 Build
cd frontend

docker build -t school-attendance-app-fe .

📊 Frontend Image
Image	Base Image	Size
school-attendance-app-fe	nginx:1.25-alpine	74 MB
🐳 Docker Images
Image	Purpose
school-attendance-app:latest	Backend (Optimized)
school-attendance-app:v1	Backend (Initial Version)
school-attendance-app-fe:latest	Frontend
📦 Project Structure
school-attendance-app
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── frontend/
├── Dockerfile
├── .dockerignore
├── package.json
└── server.js

🎯 Outcome

✅ Backend successfully containerized

✅ Frontend successfully containerized

✅ Multi-stage Docker build implemented

✅ Non-root user configured

✅ Docker image optimized

✅ Build context reduced with .dockerignore

✅ Images tested successfully on local Docker environment

🎉 Final Result

The School Attendance Application is now fully Dockerized with separate backend and frontend images, following modern containerization best practices for efficient deployment, improved security, and reduced image size.
