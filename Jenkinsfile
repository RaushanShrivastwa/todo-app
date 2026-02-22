pipeline {
    agent any
    
    environment {
        // Docker Hub configuration
        DOCKER_USERNAME = 'raushann09'
        
        // Image tags
        FRONTEND_IMAGE = "${DOCKER_USERNAME}/todo-frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "${DOCKER_USERNAME}/todo-backend:${BUILD_NUMBER}"
        LATEST_FRONTEND = "${DOCKER_USERNAME}/todo-frontend:latest"
        LATEST_BACKEND = "${DOCKER_USERNAME}/todo-backend:latest"
    }
    
    stages {
        stage('Cleanup Old Containers') {
            steps {
                echo '🧹 Cleaning up old test containers...'
                bat '''
                    @echo off
                    echo "Stopping and removing any existing test containers..."
                    
                    :: Use "|| ver > nul" to ensure the script continues if containers don't exist
                    docker stop test-backend 2>nul || ver > nul
                    docker stop test-frontend 2>nul || ver > nul
                    docker rm test-backend 2>nul || ver > nul
                    docker rm test-frontend 2>nul || ver > nul
                    
                    echo "Checking if ports are available..."
                    netstat -ano | findstr :5001 >nul && (echo Port 5001 is in use) || (echo Port 5001 is free)
                    netstat -ano | findstr :3001 >nul && (echo Port 3001 is in use) || (echo Port 3001 is free)
                    
                    :: Force success exit code so findstr doesn't kill the pipeline
                    exit /b 0
                '''
            }
        }
        
        // Note: Declarative SCM Checkout happens automatically at the start.
        // We keep this here only if you need to pull additional submodules.

        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir('todo-app-frontend') {
                            echo '🐳 Building frontend Docker image...'
                            bat "docker build -t %FRONTEND_IMAGE% -t %LATEST_FRONTEND% ."
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        dir('todo-app-backend') {
                            echo '🐳 Building backend Docker image...'
                            bat "docker build -t %BACKEND_IMAGE% -t %LATEST_BACKEND% ."
                        }
                    }
                }
            }
        }
        
stage('Test Locally') {
    steps {
        script {
            withCredentials([string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI')]) {
                bat '''
                    @echo off
                    echo "Starting test containers with MongoDB Atlas..."
                    
                    docker stop test-backend test-frontend 2>nul
                    docker rm test-backend test-frontend 2>nul
                    
                    echo "Using MongoDB URI from Jenkins credentials"
                    
                    docker run -d -p 5001:5000 -e MONGODB_URI=%MONGODB_URI% --name test-backend raushann09/todo-backend:%IMAGE_TAG%
                    docker run -d -p 3001:3000 --name test-frontend raushann09/todo-frontend:%IMAGE_TAG%
                    
                    echo "Waiting 25 seconds for containers to initialize..."
                    timeout /t 25 /nobreak >nul
                    
                    echo "Testing backend health..."
                    powershell -Command "try { $res = Invoke-WebRequest -Uri http://localhost:5001/health -UseBasicParsing -TimeoutSec 10; if ($res.StatusCode -eq 200) { Write-Host '✅ Backend healthy'; exit 0 } else { Write-Host '❌ Backend returned ' $res.StatusCode; exit 1 } } catch { Write-Host '❌ Backend not responding'; exit 1 }"
                    if %errorlevel% neq 0 (
                        echo "Backend logs:"
                        docker logs test-backend
                        exit /b 1
                    )
                    
                    echo "✅ Backend test passed"
                    
                    docker stop test-backend test-frontend
                    docker rm test-backend test-frontend
                '''
            }
        }
    }
}
        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        bat '''
                            @echo off
                            echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                            
                            docker push %FRONTEND_IMAGE%
                            docker push %BACKEND_IMAGE%
                            docker push %LATEST_FRONTEND%
                            docker push %LATEST_BACKEND%
                        '''
                    }
                }
            }
        }
        
        stage('Deploy Locally') {
            steps {
                echo '🚀 Deploying application via Docker Compose...'
                // Using the specific path provided in your snippet
                dir('C:\\Users\\Raushan\\Desktop\\Project') {
                    bat '''
                        @echo off
                        docker-compose down || ver > nul
                        docker-compose up -d
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Verifying production deployment...'
                bat '''
                    @echo off
                    :: Checking production ports (3000/5000)
                    powershell -Command "Start-Sleep -Seconds 15"
                    powershell -Command "$res = Invoke-WebRequest -Uri http://localhost:5000/health -UseBasicParsing; if ($res.StatusCode -ne 200) { exit 1 }"
                    if %errorlevel% neq 0 (echo "Production Backend Unhealthy" && exit /b 1)
                    
                    powershell -Command "$res = Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing; if ($res.StatusCode -ne 200) { exit 1 }"
                    if %errorlevel% neq 0 (echo "Production Frontend Unhealthy" && exit /b 1)
                    
                    echo "✅ Deployment Successful!"
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above.'
        }
        always {
            echo '🧹 Final cleanup...'
            bat '''
                @echo off
                docker stop test-backend test-frontend 2>nul || ver > nul
                docker rm test-backend test-frontend 2>nul || ver > nul
                :: Prune only unused images to save disk space
                docker image prune -f
            '''
        }
    }
}
