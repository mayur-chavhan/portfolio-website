#!/bin/bash

# Portfolio Development Docker Helper Script
# This script helps run the development environment with proper user permissions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
COMPOSE_FILE="docker-compose.dev.yml"
SERVICE_NAME="portfolio-dev"

# Function to display help
show_help() {
    echo -e "${BLUE}Portfolio Development Docker Helper${NC}"
    echo ""
    echo -e "${GREEN}Usage:${NC}"
    echo "  $0 [COMMAND] [OPTIONS]"
    echo ""
    echo -e "${GREEN}Commands:${NC}"
    echo "  up          Start the development environment"
    echo "  down        Stop the development environment"
    echo "  restart     Restart the development environment"
    echo "  logs        Show container logs"
    echo "  shell       Open a shell in the container"
    echo "  clean       Clean up volumes and containers"
    echo "  build       Build the development image"
    echo "  help        Show this help message"
    echo ""
    echo -e "${GREEN}Options:${NC}"
    echo "  --detach    Run in detached mode (background)"
    echo "  --build     Force rebuild of the image"
    echo "  --follow    Follow logs (for logs command)"
    echo ""
    echo -e "${GREEN}Examples:${NC}"
    echo "  $0 up                    # Start development environment"
    echo "  $0 up --detach           # Start in background"
    echo "  $0 up --build            # Start with rebuild"
    echo "  $0 logs --follow         # Follow logs"
    echo "  $0 shell                 # Open shell in container"
    echo ""
}

# Function to get current user and group IDs
get_user_ids() {
    if command -v id >/dev/null 2>&1; then
        USER_ID=$(id -u)
        GROUP_ID=$(id -g)
    else
        # Fallback for systems without 'id' command
        USER_ID=1001
        GROUP_ID=1001
        echo -e "${YELLOW}⚠️  Could not detect user ID, using default: ${USER_ID}:${GROUP_ID}${NC}"
    fi

    echo -e "${BLUE}👤 Using User ID: ${USER_ID}, Group ID: ${GROUP_ID}${NC}"
    export USER_ID
    export GROUP_ID
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

    # Check if Docker is installed and running
    if ! command -v docker >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running${NC}"
        exit 1
    fi

    # Check if Docker Compose is available
    if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker Compose is not available${NC}"
        exit 1
    fi

    # Check if compose file exists
    if [ ! -f "$COMPOSE_FILE" ]; then
        echo -e "${RED}❌ Docker Compose file not found: $COMPOSE_FILE${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Function to run docker-compose with proper command
run_compose() {
    if command -v docker-compose >/dev/null 2>&1; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

# Function to start the development environment
start_dev() {
    local detach_flag=""
    local build_flag=""

    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
        --detach | -d)
            detach_flag="-d"
            shift
            ;;
        --build)
            build_flag="--build"
            shift
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            exit 1
            ;;
        esac
    done

    echo -e "${GREEN}🚀 Starting Portfolio Development Environment...${NC}"

    get_user_ids

    # Export environment variables for docker-compose
    export USER_ID
    export GROUP_ID

    # Start the services
    run_compose -f "$COMPOSE_FILE" up $detach_flag $build_flag

    if [ -n "$detach_flag" ]; then
        echo -e "${GREEN}✅ Development environment started in background${NC}"
        echo -e "${BLUE}📱 Access your app at: http://localhost:3000${NC}"
        echo -e "${BLUE}📋 View logs with: $0 logs${NC}"
    fi
}

# Function to stop the development environment
stop_dev() {
    echo -e "${YELLOW}🛑 Stopping Portfolio Development Environment...${NC}"
    run_compose -f "$COMPOSE_FILE" down
    echo -e "${GREEN}✅ Development environment stopped${NC}"
}

# Function to restart the development environment
restart_dev() {
    echo -e "${BLUE}🔄 Restarting Portfolio Development Environment...${NC}"
    stop_dev
    start_dev "$@"
}

# Function to show logs
show_logs() {
    local follow_flag=""

    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
        --follow | -f)
            follow_flag="-f"
            shift
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            exit 1
            ;;
        esac
    done

    echo -e "${BLUE}📋 Showing logs for $SERVICE_NAME...${NC}"
    run_compose -f "$COMPOSE_FILE" logs $follow_flag $SERVICE_NAME
}

# Function to open shell in container
open_shell() {
    echo -e "${BLUE}🐚 Opening shell in $SERVICE_NAME container...${NC}"

    # Check if container is running
    if ! run_compose -f "$COMPOSE_FILE" ps | grep -q "$SERVICE_NAME.*Up"; then
        echo -e "${RED}❌ Container is not running. Start it first with: $0 up${NC}"
        exit 1
    fi

    run_compose -f "$COMPOSE_FILE" exec $SERVICE_NAME sh
}

# Function to clean up
clean_up() {
    echo -e "${YELLOW}🧹 Cleaning up development environment...${NC}"

    # Stop and remove containers
    run_compose -f "$COMPOSE_FILE" down -v --remove-orphans

    # Remove development volumes
    echo -e "${YELLOW}🗑️  Removing development volumes...${NC}"
    docker volume rm portfolio_dev_node_modules portfolio_dev_vite_cache portfolio_dev_dist 2>/dev/null || true

    # Remove development images
    echo -e "${YELLOW}🗑️  Removing development images...${NC}"
    docker image rm portfolio-website-portfolio-dev 2>/dev/null || true

    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Function to build the image
build_image() {
    echo -e "${BLUE}🔨 Building development image...${NC}"

    get_user_ids

    # Export environment variables for docker-compose
    export USER_ID
    export GROUP_ID

    run_compose -f "$COMPOSE_FILE" build --no-cache
    echo -e "${GREEN}✅ Development image built${NC}"
}

# Main script logic
main() {
    # Check prerequisites
    check_prerequisites

    # Parse command
    case "${1:-help}" in
    up | start)
        shift
        start_dev "$@"
        ;;
    down | stop)
        stop_dev
        ;;
    restart)
        shift
        restart_dev "$@"
        ;;
    logs)
        shift
        show_logs "$@"
        ;;
    shell | bash | sh)
        open_shell
        ;;
    clean | cleanup)
        clean_up
        ;;
    build)
        build_image
        ;;
    help | --help | -h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
    esac
}

# Run main function with all arguments
main "$@"
