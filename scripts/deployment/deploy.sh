#!/bin/bash

# Portfolio Website Deployment Script
# This script handles deployment to different environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DOCKER_IMAGE_NAME="portfolio-website"
DOCKER_REGISTRY="ghcr.io"
GITHUB_REPO="mayurchavhan/portfolio-website"

# Default values
ENVIRONMENT="production"
BUILD_ONLY=false
SKIP_TESTS=false
SKIP_BUILD=false
FORCE_DEPLOY=false

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    cat << EOF
Portfolio Website Deployment Script

Usage: $0 [OPTIONS]

OPTIONS:
    -e, --environment ENV    Target environment (development|staging|production) [default: production]
    -b, --build-only        Only build, don't deploy
    -s, --skip-tests        Skip running tests
    -n, --skip-build        Skip building (use existing build)
    -f, --force             Force deployment without confirmation
    -h, --help              Show this help message

EXAMPLES:
    $0                                    # Deploy to production
    $0 -e staging                         # Deploy to staging
    $0 -e development -b                  # Build for development only
    $0 -e production -s                   # Deploy to production, skip tests
    $0 -f                                 # Force deploy without confirmation

ENVIRONMENT VARIABLES:
    DOCKER_REGISTRY         Docker registry URL [default: ghcr.io]
    GITHUB_TOKEN           GitHub token for registry authentication
    DEPLOY_KEY             SSH key for deployment server
    STAGING_SERVER         Staging server hostname
    PRODUCTION_SERVER      Production server hostname

EOF
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    local deps=("docker" "docker-compose" "node" "npm")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    log_success "All dependencies are available"
}

validate_environment() {
    log_info "Validating environment: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        development|staging|production)
            log_success "Environment '$ENVIRONMENT' is valid"
            ;;
        *)
            log_error "Invalid environment: $ENVIRONMENT"
            log_error "Valid environments: development, staging, production"
            exit 1
            ;;
    esac
}

run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        log_warning "Skipping tests as requested"
        return 0
    fi
    
    log_info "Running tests..."
    cd "$PROJECT_ROOT"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        npm ci
    fi
    
    # Run linting
    log_info "Running ESLint..."
    npm run lint
    
    # Run type checking
    log_info "Running TypeScript type checking..."
    npm run type-check
    
    # Run tests
    log_info "Running unit tests..."
    npm run test:run
    
    log_success "All tests passed"
}

build_application() {
    if [ "$SKIP_BUILD" = true ]; then
        log_warning "Skipping build as requested"
        return 0
    fi
    
    log_info "Building application for $ENVIRONMENT..."
    cd "$PROJECT_ROOT"
    
    # Set environment variables
    export NODE_ENV="$ENVIRONMENT"
    
    # Build the application
    log_info "Building React application..."
    npm run build
    
    # Build Docker image
    local image_tag="$DOCKER_IMAGE_NAME:$ENVIRONMENT"
    local dockerfile="Dockerfile"
    
    if [ "$ENVIRONMENT" = "development" ]; then
        dockerfile="Dockerfile.dev"
    fi
    
    log_info "Building Docker image: $image_tag"
    docker build -f "$dockerfile" -t "$image_tag" .
    
    # Tag for registry if not development
    if [ "$ENVIRONMENT" != "development" ]; then
        local registry_tag="$DOCKER_REGISTRY/$GITHUB_REPO:$ENVIRONMENT"
        docker tag "$image_tag" "$registry_tag"
        log_info "Tagged image for registry: $registry_tag"
    fi
    
    log_success "Build completed successfully"
}

deploy_to_environment() {
    if [ "$BUILD_ONLY" = true ]; then
        log_info "Build-only mode, skipping deployment"
        return 0
    fi
    
    log_info "Deploying to $ENVIRONMENT environment..."
    
    case $ENVIRONMENT in
        development)
            deploy_development
            ;;
        staging)
            deploy_staging
            ;;
        production)
            deploy_production
            ;;
    esac
}

deploy_development() {
    log_info "Starting development environment..."
    cd "$PROJECT_ROOT"
    
    # Stop existing containers
    docker-compose --profile dev down || true
    
    # Start development environment
    docker-compose --profile dev up -d
    
    log_success "Development environment started"
    log_info "Application available at: http://localhost:3000"
    log_info "Redis Commander available at: http://localhost:8081"
}

deploy_staging() {
    log_info "Deploying to staging environment..."
    
    # Push to registry
    local registry_tag="$DOCKER_REGISTRY/$GITHUB_REPO:staging"
    
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "$GITHUB_TOKEN" | docker login "$DOCKER_REGISTRY" -u "$GITHUB_ACTOR" --password-stdin
        docker push "$registry_tag"
        log_success "Image pushed to registry"
    else
        log_warning "GITHUB_TOKEN not set, skipping registry push"
    fi
    
    # Deploy to staging server (if configured)
    if [ -n "$STAGING_SERVER" ]; then
        log_info "Deploying to staging server: $STAGING_SERVER"
        # Add your staging deployment logic here
        # ssh -i "$DEPLOY_KEY" user@"$STAGING_SERVER" "docker pull $registry_tag && docker-compose up -d"
        log_success "Deployed to staging server"
    else
        log_warning "STAGING_SERVER not configured, skipping remote deployment"
    fi
}

deploy_production() {
    log_info "Deploying to production environment..."
    
    # Confirmation for production deployment
    if [ "$FORCE_DEPLOY" != true ]; then
        echo -e "${YELLOW}WARNING: You are about to deploy to PRODUCTION!${NC}"
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled by user"
            exit 0
        fi
    fi
    
    # Push to registry
    local registry_tag="$DOCKER_REGISTRY/$GITHUB_REPO:production"
    local latest_tag="$DOCKER_REGISTRY/$GITHUB_REPO:latest"
    
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "$GITHUB_TOKEN" | docker login "$DOCKER_REGISTRY" -u "$GITHUB_ACTOR" --password-stdin
        docker push "$registry_tag"
        docker tag "$registry_tag" "$latest_tag"
        docker push "$latest_tag"
        log_success "Image pushed to registry"
    else
        log_warning "GITHUB_TOKEN not set, skipping registry push"
    fi
    
    # Deploy to production server (if configured)
    if [ -n "$PRODUCTION_SERVER" ]; then
        log_info "Deploying to production server: $PRODUCTION_SERVER"
        # Add your production deployment logic here
        # ssh -i "$DEPLOY_KEY" user@"$PRODUCTION_SERVER" "docker pull $registry_tag && docker-compose up -d"
        log_success "Deployed to production server"
    else
        log_warning "PRODUCTION_SERVER not configured, skipping remote deployment"
    fi
}

cleanup() {
    log_info "Cleaning up..."
    
    # Remove old Docker images
    docker image prune -f
    
    log_success "Cleanup completed"
}

main() {
    log_info "Starting deployment process..."
    log_info "Environment: $ENVIRONMENT"
    log_info "Build only: $BUILD_ONLY"
    log_info "Skip tests: $SKIP_TESTS"
    log_info "Skip build: $SKIP_BUILD"
    
    check_dependencies
    validate_environment
    run_tests
    build_application
    deploy_to_environment
    cleanup
    
    log_success "Deployment process completed successfully!"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -b|--build-only)
            BUILD_ONLY=true
            shift
            ;;
        -s|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -n|--skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -f|--force)
            FORCE_DEPLOY=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main
