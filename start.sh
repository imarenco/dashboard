#!/bin/bash

echo "🚀 Starting Real-Time Sales Analytics Dashboard..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Function to check if ports are available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use. Please free up port $1 and try again."
        exit 1
    fi
}

# Check if required ports are available
echo "🔍 Checking if ports are available..."
check_port 3000
check_port 5001
check_port 27017

echo "✅ Ports are available"

# Ask user for mode
echo ""
echo "Choose deployment mode:"
echo "1) Production (optimized, no hot reloading)"
echo "2) Development (with hot reloading)"
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo "🏭 Starting in PRODUCTION mode..."
        docker-compose up -d
        ;;
    2)
        echo "🔧 Starting in DEVELOPMENT mode..."
        docker-compose -f docker-compose.dev.yml up -d
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."

if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ All services are running!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5001"
    echo "   MongoDB: localhost:27017"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart: docker-compose restart"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi 