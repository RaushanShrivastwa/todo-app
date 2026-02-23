# ✅ Todo App - Full Stack with CI/CD Pipeline

A modern, production-ready Todo application featuring a React frontend, Node.js backend, MongoDB Atlas database, and a complete Jenkins CI/CD pipeline with Docker containerization.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Docker Setup](#docker-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Jenkins Setup](#jenkins-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Responsive design with Shadcn UI
- ✅ Dark mode support
- ✅ Real-time updates
- ✅ Persistent storage with MongoDB Atlas
- ✅ Containerized with Docker
- ✅ Automated CI/CD pipeline with Jenkins
- ✅ Parallel stage execution in pipeline
- ✅ Health checks for all services

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **Shadcn UI** | Component library |
| **Tailwind CSS** | Styling |
| **Lucide React** | Icons |
| **React Hooks** | State management |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 20** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Cloud database |
| **Mongoose** | ODM for MongoDB |
| **CORS** | Cross-origin resource sharing |

### DevOps
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Jenkins** | CI/CD automation |
| **GitHub** | Version control |
| **Docker Hub** | Container registry |
| **Windows Server** | Hosting platform |

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────────┐
│ GitHub Repository │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Frontend │ │ Backend │ │ Jenkinsfile │ │
│ │ Code │ │ Code │ │ (Pipeline as Code) │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
│ Git Push
▼
┌─────────────────────────────────────────────────────────────┐
│ Jenkins CI/CD │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Cleanup │→│ Checkout │→│ Build Images │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
│ │ │
│ ┌─────────────┐ ┌───────▼─────┐ ┌─────────────────────┐ │
│ │ Test │→│ Push to │→│ Deploy │ │
│ │ Locally │ │ Docker Hub │ │ Locally │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
│ │ │
│ ┌────▼────┐ │
│ │ Verify │ │
│ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Production Environment │
│ ┌─────────────────────┐ ┌─────────────────────────────┐ │
│ │ Frontend Container │ │ Backend Container │ │
│ │ (Port 3000) │ │ (Port 5000) │ │
│ └─────────────────────┘ └──────────────┬──────────────┘ │
│ │ │
│ ┌───────▼───────┐ │
│ │ MongoDB Atlas │ │
│ │ (Cloud DB) │ │
│ └───────────────┘ │
└─────────────────────────────────────────────────────────────┘


## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download Link |
|-------------|---------|---------------|
| **Node.js** | v20 or higher | [nodejs.org](https://nodejs.org) |
| **Docker Desktop** | v24 or higher | [docker.com](https://www.docker.com/products/docker-desktop) |
| **Jenkins** | v2.479 or higher | [jenkins.io](https://www.jenkins.io/download/) |
| **Git** | v2.30 or higher | [git-scm.com](https://git-scm.com/downloads) |
| **MongoDB Atlas** | Free tier | [mongodb.com/atlas](https://www.mongodb.com/atlas) |

## 🚀 Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/RaushanShrivastwa/todo-app.git
cd todo-app


#2. Backend Setup

# Navigate to backend directory
cd todo-app-backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env
# Edit .env with your MongoDB Atlas URI

# Start development server
npm run dev

#Expected Output:
✅ Connected to MongoDB
🚀 Server running on port 5000



# 3. Frontend Setup

# Open new terminal, navigate to frontend
cd todo-app-frontend

# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local
# Edit .env.local with API URL: http://localhost:5000/api

# Start development server
npm run dev

#Expected Output:
▲ Next.js 16.1.6
- Local: http://localhost:3000
✓ Ready in 2.3s



# 4. Access the Application
Service	            URL
Frontend	        http://localhost:3000
Backend API	        http://localhost:5000/api/todos
Health Check	    http://localhost:5000/health



#----🐳 Docker Setup----#
Running with Docker Compose

# Start all services in background
docker-compose up -d

# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f backend

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Stop and remove volumes (caution: deletes data)
docker-compose down -v


###--Docker Commands Reference--###
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# List all images
docker images

# Stop specific container
docker stop todo-backend

# Start specific container
docker start todo-backend

# View container logs
docker logs todo-backend

# Execute command in container
docker exec -it todo-backend sh

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune -a


![alt text](image.png)


#---Pipeline Visualization---#

✅ Cleanup → ✅ Checkout → ⚡ Build Images (Parallel)
              ↓
         ✅ Test Locally
              ↓
         ✅ Push to Docker Hub
              ↓
         ✅ Deploy Locally
              ↓
         ✅ Verify


#--Jenkinsfile Structure--#

pipeline {
    agent any
    
    environment {
        DOCKER_USERNAME = 'raushann09'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Cleanup') { ... }
        stage('Checkout') { ... }
        stage('Build Images') { 
            parallel {
                stage('Build Frontend') { ... }
                stage('Build Backend') { ... }
            }
        }
        stage('Test Locally') { ... }
        stage('Push to Docker Hub') { ... }
        stage('Deploy Locally') { ... }
        stage('Verify') { ... }
    }
}



#---------⚙️ Jenkins Setup--------#
#Step 1: Install Jenkins on Windows
Download Jenkins from jenkins.io

Run installer as Administrator

Set port: 8080

Complete installation wizard

Access Jenkins: http://localhost:8080

Get initial password: 
type C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword


#Step 2: Install Required Plugins
Navigate to Manage Jenkins → Manage Plugins → Available

Install these plugins:

✅ Docker Pipeline

✅ Docker plugin

✅ GitHub Integration

✅ Credentials Binding

✅ Pipeline: Stage View

#Step 3: Configure Jenkins Credentials
Go to Manage Jenkins → Credentials → System → Global credentials

Add GitHub Credentials:
Kind: Username with password
Username: your_github_username
Password: [Your GitHub Personal Access Token]
ID: github-credentials
Description: GitHub access for cloning repo

Add Docker Hub Credentials
Kind: Username with password
Username: your_docker_username
Password: [Your Docker Hub Password/Access Token]
ID: docker-hub-credentials
Description: Docker Hub credentials for pushing images

Add MongoDB URI Credential
Kind: Secret text
Secret: mongodb+srv://your_db_name:db_password@your_appname.q7sgykn.mongodb.net/?appName=your_appname
ID: mongodb-uri
Description: MongoDB Atlas connection string


#Step 4: Create Pipeline Job
Click New Item

Name: todo-app-pipeline

Select Pipeline

Configure:

Definition: Pipeline script from SCM

SCM: Git

Repository URL: https://github.com/RaushanShrivastwa/todo-app.git

Credentials: github-credentials

Branch: */main

Script Path: Jenkinsfile

Click Save

#Step 5: Run Pipeline
Click Build Now for manual trigger

Or push to GitHub for automatic trigger

#----🔐 Environment Variables----#

Backend (.env)
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
NODE_ENV=production

Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

Docker Compose (.env)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp

![alt text](image-1.png)




#-----🔧 Troubleshooting----#
Common Issues and Solutions
Issue: Docker containers not starting
powershell
# Check Docker status
docker ps

# View error logs
docker-compose logs

# Restart Docker Desktop
# Right-click Docker icon → Restart
Issue: MongoDB connection failed
powershell
# Check if MongoDB URI is correct
echo %MONGODB_URI%

# Test connection manually
docker run -it --rm mongo:6 mongosh %MONGODB_URI% --eval "db.runCommand({connectionStatus:1})"
Issue: Jenkins build stuck
powershell
# Restart Jenkins service
net stop jenkins
net start jenkins

# Clear build queue in Jenkins UI
# Click "X" next to queued builds
Issue: Port conflicts
powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process
taskkill /PID [PID] /F
Issue: Git push rejected
powershell
# Pull latest changes first
git pull origin main --allow-unrelated-histories

# Resolve conflicts, then push
git add .
git commit -m "Resolved conflicts"
git push origin main


![alt text](image-2.png)



🤝 Contributing
Fork the repository

Create feature branch

bash
git checkout -b feature/AmazingFeature
Commit changes

bash
git commit -m 'Add some AmazingFeature'
Push to branch

bash
git push origin feature/AmazingFeature
Open a Pull Request



#---📄 License---#  
This project is licensed under the MIT License - see below:
MIT License

Copyright (c) 2026 Raushan Shrivastwa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.


👨‍💻 Author
Raushan Shrivastwa

GitHub: @RaushanShrivastwa

Docker Hub: @raushann09

Project Repository: github.com/RaushanShrivastwa/todo-app

🙏 Acknowledgments
Next.js team for the amazing framework

Shadcn UI for beautiful components

MongoDB Atlas for free cloud database

Jenkins community for CI/CD tools

Docker for containerization platform

GitHub for version control and hosting

📚 Additional Resources
Next.js Documentation

Docker Documentation

Jenkins Handbook

MongoDB Atlas Docs

Express.js Guide

🎯 Future Enhancements
Add user authentication

Implement Redis caching

Add unit tests

Deploy to cloud (AWS/Azure)

Add monitoring with Prometheus

Implement Kubernetes orchestration

Add Slack notifications for pipeline

Made with ❤️ by Raushan Shrivastwa 