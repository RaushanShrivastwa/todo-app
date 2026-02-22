pipeline {
    agent any
    
    environment {
        // Docker Hub configuration
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        
        // Image tags
        FRONTEND_IMAGE = "raushann09/todo-frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "raushann09/todo-backend:${BUILD_NUMBER}"
        LATEST_FRONTEND = "raushann09/todo-frontend:latest"
        LATEST_BACKEND = "raushann09/todo-backend:latest"
    }
    
    stages {
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
                    docker run -d -p 5001:5000 --name test-backend %BACKEND_IMAGE%
                    docker run -d -p 3001:3000 --name test-frontend %FRONTEND_IMAGE%
                    
                    echo "Waiting for containers to start..."
                    timeout /t 10
                    
                    echo "Testing backend health..."
                    curl http://localhost:5001/health || exit 1
                    echo "✅ Backend test passed"
                    
                    echo "Cleaning up test containers..."
                    docker stop test-backend test-frontend
                    docker rm test-backend test-frontend
                '''
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing images to Docker Hub...'
                bat '''
                    echo %DOCKER_HUB_CREDS_PSW% | docker login -u %DOCKER_HUB_CREDS_USR% --password-stdin
                    docker push %FRONTEND_IMAGE%
                    docker push %BACKEND_IMAGE%
                    docker push %LATEST_FRONTEND%
                    docker push %LATEST_BACKEND%
                    echo "✅ Images pushed successfully!"
                '''
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying application with docker-compose...'
                dir('C:\\Users\\Raushan\\Desktop\\Project') {
                    bat '''
                        echo "Stopping old containers..."
                        docker-compose down
                        
                        echo "Starting new containers..."
                        docker-compose up -d
                        
                        echo "Waiting for deployment..."
                        timeout /t 10
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Verifying deployment...'
                bat '''
                    echo "Checking backend health..."
                    curl http://localhost:5000/health || exit 1
                    echo "✅ Backend is healthy"
                    
                    echo "Checking frontend..."
                    curl http://localhost:3000 || exit 1
                    echo "✅ Frontend is running"
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
            echo "✅ Your app is running at http://localhost:3000"
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above for errors.'
        }
        always {
            echo '🧹 Cleaning up...'
            bat 'docker system prune -f || true'
        }
    }
}