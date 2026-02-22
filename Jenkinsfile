pipeline {
    agent any
    
    environment {
        // Docker Hub configuration
        DOCKER_USERNAME = 'raushann09'  // Your username
        
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
                    echo "Stopping and removing any existing test containers..."
                    docker stop test-backend test-frontend 2>nul || true
                    docker rm test-backend test-frontend 2>nul || true
                    
                    echo "Checking if ports are available..."
                    netstat -ano | findstr :5001 || echo "Port 5001 is free"
                    netstat -ano | findstr :3001 || echo "Port 3001 is free"
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository from GitHub...'
                checkout scm
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir('todo-app-frontend') {
                            echo '🐳 Building frontend Docker image...'
                            bat "docker build -t ${FRONTEND_IMAGE} -t ${LATEST_FRONTEND} ."
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        dir('todo-app-backend') {
                            echo '🐳 Building backend Docker image...'
                            bat "docker build -t ${BACKEND_IMAGE} -t ${LATEST_BACKEND} ."
                        }
                    }
                }
            }
        }
        
        stage('Test Locally') {
            steps {
                echo '🧪 Testing containers before push...'
                bat '''
                    echo "Starting test containers..."
                    
                    # Make sure no old containers are running
                    docker stop test-backend test-frontend 2>nul || true
                    docker rm test-backend test-frontend 2>nul || true
                    
                    # Run new test containers
                    docker run -d -p 5001:5000 --name test-backend %BACKEND_IMAGE%
                    docker run -d -p 3001:3000 --name test-frontend %FRONTEND_IMAGE%
                    
                    echo "Waiting 20 seconds for containers to start..."
                    powershell -Command "Start-Sleep -Seconds 20"
                    
                    echo "Testing backend health..."
                    powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:5001/health -UseBasicParsing; if ($response.StatusCode -eq 200) { Write-Host '✅ Backend healthy'; exit 0 } else { Write-Host '❌ Backend returned status ' $response.StatusCode; exit 1 } } catch { Write-Host '❌ Backend connection failed: ' $_.Exception.Message; exit 1 }"
                    if %errorlevel% neq 0 exit /b %errorlevel%
                    
                    echo "Testing frontend..."
                    powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:3001 -UseBasicParsing; if ($response.StatusCode -eq 200) { Write-Host '✅ Frontend healthy'; exit 0 } else { Write-Host '❌ Frontend returned status ' $response.StatusCode; exit 1 } } catch { Write-Host '❌ Frontend connection failed: ' $_.Exception.Message; exit 1 }"
                    if %errorlevel% neq 0 exit /b %errorlevel%
                    
                    echo "✅ All tests passed! Cleaning up test containers..."
                    docker stop test-backend test-frontend
                    docker rm test-backend test-frontend
                '''
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
                echo '🚀 Deploying application...'
                dir('C:\\Users\\Raushan\\Desktop\\Project') {
                    bat '''
                        docker-compose down
                        docker-compose up -d
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Verifying deployment...'
                bat '''
                    powershell -Command "Start-Sleep -Seconds 15"
                    
                    echo "Checking backend health..."
                    powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:5000/health -UseBasicParsing; if ($response.StatusCode -eq 200) { Write-Host '✅ Backend healthy'; exit 0 } else { Write-Host '❌ Backend failed'; exit 1 } } catch { Write-Host '❌ Backend connection failed'; exit 1 }"
                    if %errorlevel% neq 0 exit /b %errorlevel%
                    
                    echo "Checking frontend..."
                    powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing; if ($response.StatusCode -eq 200) { Write-Host '✅ Frontend running'; exit 0 } else { Write-Host '❌ Frontend failed'; exit 1 } } catch { Write-Host '❌ Frontend connection failed'; exit 1 }"
                    if %errorlevel% neq 0 exit /b %errorlevel%
                    
                    echo "✅ Application is running at http://localhost:3000"
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
            echo "✅ Images pushed to Docker Hub and app deployed locally"
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above.'
        }
        always {
            echo '🧹 Final cleanup...'
            bat '''
                docker stop test-backend test-frontend 2>nul || true
                docker rm test-backend test-frontend 2>nul || true
                docker system prune -f || true
            '''
        }
    }
}
