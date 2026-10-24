pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install') {
            steps { bat 'npm ci' }
        }
        stage('Tests') {
            steps { bat 'npm test' }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}