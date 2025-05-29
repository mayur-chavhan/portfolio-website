#!/bin/bash

# Portfolio Development Docker Script
# This script helps you run the portfolio in development mode using Docker

set -e

echo "🐳 Portfolio Development Docker Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating one..."
    cp .env.example .env 2>/dev/null || echo "NODE_ENV=development" > .env
fi

# Function to clean up existing containers
cleanup() {
    print_status "Cleaning up existing containers..."
    docker-compose down 2>/dev/null || true
    docker stop portfolio-dev 2>/dev/null || true
    docker rm portfolio-dev 2>/dev/null || true
}

# Function to build and run with Docker Compose (recommended)
run_with_compose() {
    print_status "Building and starting with Docker Compose..."
    docker-compose --profile dev up --build portfolio-dev
}

# Function to build and run manually
run_manually() {
    print_status "Building development image..."
    docker build -f Dockerfile.dev -t portfolio-dev .
    
    print_status "Starting development container..."
    docker run -it --rm \
        -p 3000:3000 \
        -v "$(pwd):/app:cached" \
        -v /app/node_modules \
        --env-file .env \
        --name portfolio-dev \
        portfolio-dev
}

# Main menu
echo ""
echo "Choose how to run the development environment:"
echo "1) Docker Compose (Recommended)"
echo "2) Manual Docker build and run"
echo "3) Clean up and exit"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        cleanup
        run_with_compose
        ;;
    2)
        cleanup
        run_manually
        ;;
    3)
        cleanup
        print_success "Cleanup completed."
        ;;
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

print_success "Development environment is ready!"
echo ""
echo "🌐 Your portfolio should be available at: http://localhost:3000"
echo "📝 To stop the container, press Ctrl+C"
echo ""
