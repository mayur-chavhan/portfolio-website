#!/bin/bash

# Portfolio Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "Portfolio Docker Management Script"
    echo ""
    echo "Usage: ./docker-helper.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev       Start development environment"
    echo "  prod      Start production environment"
    echo "  build     Build production Docker image"
    echo "  test      Test the Docker container"
    echo "  clean     Clean up Docker containers and images"
    echo "  logs      Show container logs"
    echo "  health    Check container health"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-helper.sh dev     # Start development server"
    echo "  ./docker-helper.sh prod    # Start production server"
    echo "  ./docker-helper.sh build   # Build production image"
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    docker-compose --profile dev up --build portfolio-dev
}

# Function to start production environment
start_prod() {
    print_status "Starting production environment..."
    docker-compose --profile prod up --build portfolio-prod
}

# Function to build production image
build_prod() {
    print_status "Building production Docker image..."
    docker build -t portfolio:latest .
    print_status "Build completed successfully!"

    # Show image size
    size=$(docker images portfolio:latest --format "table {{.Size}}" | tail -n 1)
    print_status "Image size: $size"
}

# Function to test container
test_container() {
    print_status "Testing Docker container..."

    # Build image if it doesn't exist
    if ! docker images portfolio:latest --format "table {{.Repository}}" | grep -q portfolio; then
        print_warning "Image not found. Building first..."
        build_prod
    fi

    # Start container in background
    print_status "Starting test container..."
    docker run -d --name portfolio-test -p 8081:8080 portfolio:latest

    # Wait for container to start
    print_status "Waiting for container to be ready..."
    sleep 5

    # Test health endpoint
    if curl -f http://localhost:8081/health >/dev/null 2>&1; then
        print_status "Health check passed ✓"
    else
        print_error "Health check failed ✗"
        docker logs portfolio-test
        docker rm -f portfolio-test
        exit 1
    fi

    # Test main page
    if curl -f http://localhost:8081/ | grep -q "Mayur Chavhan" 2>/dev/null; then
        print_status "Main page test passed ✓"
    else
        print_error "Main page test failed ✗"
        docker logs portfolio-test
        docker rm -f portfolio-test
        exit 1
    fi

    # Clean up
    docker rm -f portfolio-test
    print_status "All tests passed! Container is working correctly."
}

# Function to clean up Docker resources
clean_up() {
    print_warning "This will remove all portfolio-related containers and images."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up Docker resources..."

        # Stop and remove containers
        docker-compose down --remove-orphans 2>/dev/null || true
        docker rm -f portfolio-test 2>/dev/null || true

        # Remove images
        docker rmi portfolio:latest 2>/dev/null || true
        docker rmi portfolio-dev:latest 2>/dev/null || true

        # Clean up unused resources
        docker system prune -f

        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing container logs..."
    if docker ps --format "table {{.Names}}" | grep -q portfolio; then
        docker-compose logs -f
    else
        print_warning "No running portfolio containers found."
    fi
}

# Function to check health
check_health() {
    print_status "Checking container health..."

    # Check if container is running
    if docker ps --format "table {{.Names}}" | grep -q portfolio; then
        # Try to access health endpoint
        if curl -f http://localhost:8080/health 2>/dev/null; then
            print_status "Container is healthy ✓"
        else
            print_warning "Container is running but health check failed"
            print_status "Trying main page..."
            if curl -f http://localhost:8080/ >/dev/null 2>&1; then
                print_status "Main page is accessible ✓"
            else
                print_error "Main page is not accessible ✗"
            fi
        fi
    else
        print_warning "No portfolio containers are currently running."
        print_status "To start a container, run:"
        echo "  ./docker-helper.sh dev   # For development"
        echo "  ./docker-helper.sh prod  # For production"
    fi
}

# Main script logic
main() {
    # Check if Docker is running
    check_docker

    # Parse command line arguments
    case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "build")
        build_prod
        ;;
    "test")
        test_container
        ;;
    "clean")
        clean_up
        ;;
    "logs")
        show_logs
        ;;
    "health")
        check_health
        ;;
    "help" | "--help" | "-h")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
    esac
}

# Run main function with all arguments
main "$@"
