DevOps - Dockerization
Task 2: Write the Dockerfile

The School Attendance Application was containerized by creating separate Docker images for the backend and frontend. The Dockerfiles follow Docker best practices such as multi-stage builds, lightweight Alpine images, running the application as a non-root user, and minimizing the final image size.

Backend Docker Image
Initial Dockerfile

The initial Dockerfile used a single-stage build:

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

Build Command
docker build -t school-attendance-app:v1 .

Result
Image Name: school-attendance-app:v1
Base Image: node:22-alpine
Image Size: 300 MB
Optimized Multi-Stage Dockerfile

To reduce the image size and improve security, the Dockerfile was optimized using a multi-stage build.

# Stage 1 - Install production dependencies
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

# Stage 2 - Production Image
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY server.js seedAdmin.js ./
COPY config ./config
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY frontend ./frontend

# Create non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]

Build Command
docker build --no-cache -t school-attendance-app .

Image Comparison
Image	Size
Initial Docker Image	300 MB
Multi-Stage Docker Image	280 MB
Improvements
Multi-stage build
Production dependencies only (npm ci --omit=dev)
Alpine Linux base image
Non-root user (appuser)
Reduced image size
Cleaner production image
.dockerignore

A .dockerignore file was added to reduce the Docker build context and exclude unnecessary files.

node_modules
.git
.gitignore
Dockerfile
README.md
.env
npm-debug.log
*.log


Benefits:

Faster Docker builds
Smaller build context
Prevents sensitive files from being copied
Reduces image size
Backend Testing

The backend image was successfully built and tested locally.

docker build --no-cache -t school-attendance-app .


The application started successfully inside the Docker container.

Frontend Docker Image

A separate Docker image was created for the frontend using Nginx.

Frontend Dockerfile
FROM nginx:1.25-alpine

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

Build Command
cd frontend

docker build -t school-attendance-app-fe .

Frontend Image Details
Image	Base Image	Size
school-attendance-app-fe	nginx:1.25-alpine	74 MB
Docker Images Created
Image Name	Purpose
school-attendance-app:latest	Backend Application
school-attendance-app:v1	Initial Backend Image
school-attendance-app-fe:latest	Frontend Application
Docker Best Practices Implemented
Multi-stage Docker build
Lightweight Alpine base images
Production-only dependencies
Non-root user execution
Reduced Docker image size
.dockerignore to minimize build context
Separate backend and frontend Docker images
Local build and validation completed successfully
