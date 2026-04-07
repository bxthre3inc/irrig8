#!/bin/bash
# farmsense-zo-deploy.sh
# Deployment script for FarmSense on CSE.computer ($18 tier)

set -e

echo "=========================================="
echo "🌾 Starting FarmSense CSE.computer Deployment"
echo "=========================================="

echo ">>> Checking dependencies..."
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo ">>> Starting unified CSE.computer stack..."
cd docker || { echo "Please put this script in the deployment/ directory."; exit 1; }

echo ">>> Building and starting the containers..."
docker-compose -f docker-compose.zo-unified.yml up --build -d

echo "=========================================="
echo "✅ Deployment Successful!"
echo "FarmSense Platform Dashboard: http://localhost"
echo "Map Tile Service: http://localhost:8001"
echo "Backend API: http://localhost:8000"
echo "=========================================="
