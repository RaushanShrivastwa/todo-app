pipeline {
    agent any
    
    environment {
        DOCKER_USERNAME = 'raushann09'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Cleanup') {
            steps {
                bat '''
                    docker stop test-backend test-frontend 2>nul
                    docker rm test-backend test-frontend 2>nul
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir('todo-app-frontend') {
                            bat "docker build -t ${DOCKER_USERNAME}/todo-frontend:${IMAGE_TAG} -t ${DOCKER_USERNAME}/todo-frontend:latest ."
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        dir('todo-app-backend') {
                            bat "docker build -t ${DOCKER_USERNAME}/todo-backend:${IMAGE_TAG} -t ${DOCKER_USERNAME}/todo-backend:latest ."
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
                            echo "========================================="
                            echo "🧪 Testing containers with MongoDB Atlas"
                            echo "========================================="
                            
                            :: Clean up any old test containers
                            echo "Cleaning up old containers..."
                            docker stop test-backend test-frontend 2>nul
                            docker rm test-backend test-frontend 2>nul
                            
                            :: Run new test containers with MongoDB URI
                            echo "Starting backend container with MongoDB Atlas..."
                            docker run -d -p 5001:5000 -e MONGODB_URI=%MONGODB_URI% --name test-backend raushann09/todo-backend:%IMAGE_TAG%
                            
                            echo "Starting frontend container..."
                            docker run -d -p 3001:3000 --name test-frontend raushann09/todo-frontend:%IMAGE_TAG%
                            
                            echo "Waiting 25 seconds for containers to initialize..."
                            timeout /t 25 /nobreak >nul
                            
                            :: Check if backend container is still running
                            echo "Checking backend container status..."
                            docker ps | findstr test-backend >nul
                            if %errorlevel% neq 0 (
                                echo "❌ Backend container crashed! Showing logs:"
                                echo "----------------------------------------"
                                docker logs test-backend
                                echo "----------------------------------------"
                                exit /b 1
                            )
                            
                            :: Test backend health endpoint
                            echo "Testing backend health endpoint..."
                            powershell -Command "$retryCount = 0; while ($retryCount -lt 3) { try { $res = Invoke-WebRequest -Uri http://localhost:5001/health -UseBasicParsing -TimeoutSec 5; if ($res.StatusCode -eq 200) { Write-Host '✅ Backend healthy'; exit 0 } } catch { $retryCount++; Write-Host \"Retry $retryCount/3...\"; Start-Sleep -Seconds 5 } } exit 1"
                            
                            if %errorlevel% neq 0 (
                                echo "❌ Backend health check failed after retries"
                                echo "Backend logs:"
                                echo "----------------------------------------"
                                docker logs test-backend
                                echo "----------------------------------------"
                                exit /b 1
                            )
                            
                            echo "✅ All tests passed! Cleaning up..."
                            
                            :: Clean up test containers
                            docker stop test-backend test-frontend
                            docker rm test-backend test-frontend
                            
                            echo "========================================="
                            echo "✅ Test stage completed successfully"
                            echo "========================================="
                        '''
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
                        @echo off
                        echo "========================================="
                        echo "📤 Pushing images to Docker Hub"
                        echo "========================================="
                        
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                        if %errorlevel% neq 0 (
                            echo "❌ Docker login failed"
                            exit /b %errorlevel%
                        )
                        
                        echo "Pushing frontend image..."
                        docker push raushann09/todo-frontend:%IMAGE_TAG%
                        docker push raushann09/todo-frontend:latest
                        
                        echo "Pushing backend image..."
                        docker push raushann09/todo-backend:%IMAGE_TAG%
                        docker push raushann09/todo-backend:latest
                        
                        echo "✅ All images pushed successfully"
                    '''
                }
            }
        }
        
        stage('Deploy Locally') {
            steps {
                dir('C:\\Users\\Raushan\\Desktop\\Project') {
                    bat '''
                        @echo off
                        echo "========================================="
                        echo "🚀 Deploying application locally"
                        echo "========================================="
                        
                        echo "Stopping existing deployment..."
                        docker-compose down
                        
                        echo "Starting new deployment..."
                        docker-compose up -d
                        
                        echo "Waiting for containers to start..."
                        timeout /t 15 /nobreak >nul
                        
                        echo "✅ Deployment complete"
                    '''
                }
            }
        }
        
        stage('Verify') {
            steps {
                bat '''
                    @echo off
                    echo "========================================="
                    echo "🔍 Verifying deployment"
                    echo "========================================="
                    
                    echo "Running containers:"
                    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
                    
                    echo ""
                    echo "✅ Application is running at: http://localhost:3000"
                    echo "✅ Backend API at: http://localhost:5000"
                    echo "========================================="
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
            echo "✅ Images pushed to Docker Hub with tag: ${IMAGE_TAG}"
            echo "✅ App running at: http://localhost:3000"
            echo "✅ Docker Hub: https://hub.docker.com/u/raushann09"
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above for details.'
        }
        always {
            bat '''
                @echo off
                echo "🧹 Performing cleanup..."
                docker system prune -f >nul 2>&1 || exit 0
            '''
        }
    }
}
