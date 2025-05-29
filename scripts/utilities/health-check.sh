#!/bin/bash

# Health Check Script for Portfolio Website
# This script performs comprehensive health checks on the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEFAULT_URL="http://localhost:8080"
TIMEOUT=30
VERBOSE=false
CHECK_REDIS=true
CHECK_PERFORMANCE=false

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
Portfolio Website Health Check Script

Usage: $0 [OPTIONS]

OPTIONS:
    -u, --url URL           Base URL to check [default: http://localhost:8080]
    -t, --timeout SECONDS   Request timeout in seconds [default: 30]
    -v, --verbose           Enable verbose output
    -r, --skip-redis        Skip Redis health check
    -p, --performance       Include performance checks
    -h, --help              Show this help message

EXAMPLES:
    $0                                    # Check localhost:8080
    $0 -u https://mayurchavhan.com        # Check production site
    $0 -v -p                              # Verbose output with performance checks
    $0 -u http://localhost:3000 -r        # Check dev server, skip Redis

EOF
}

check_http_endpoint() {
    local endpoint="$1"
    local expected_status="$2"
    local description="$3"
    
    if [ "$VERBOSE" = true ]; then
        log_info "Checking $description: $endpoint"
    fi
    
    local response
    local status_code
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" --max-time "$TIMEOUT" "$endpoint" || echo "HTTPSTATUS:000")
    status_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    
    if [ "$status_code" = "$expected_status" ]; then
        log_success "$description: OK ($status_code)"
        return 0
    else
        log_error "$description: FAILED (Expected: $expected_status, Got: $status_code)"
        return 1
    fi
}

check_health_endpoint() {
    log_info "Checking application health endpoint..."
    
    local health_url="$BASE_URL/health"
    local response
    
    response=$(curl -s --max-time "$TIMEOUT" "$health_url" || echo '{"status":"error"}')
    
    if echo "$response" | grep -q '"status":"healthy"'; then
        log_success "Health endpoint: OK"
        
        if [ "$VERBOSE" = true ]; then
            echo "$response" | jq '.' 2>/dev/null || echo "$response"
        fi
        
        return 0
    else
        log_error "Health endpoint: FAILED"
        if [ "$VERBOSE" = true ]; then
            echo "Response: $response"
        fi
        return 1
    fi
}

check_metrics_endpoint() {
    log_info "Checking metrics endpoint..."
    
    local metrics_url="$BASE_URL/metrics"
    
    if check_http_endpoint "$metrics_url" "200" "Metrics endpoint"; then
        if [ "$VERBOSE" = true ]; then
            local response
            response=$(curl -s --max-time "$TIMEOUT" "$metrics_url")
            echo "$response" | jq '.' 2>/dev/null || echo "$response"
        fi
        return 0
    else
        return 1
    fi
}

check_main_page() {
    log_info "Checking main page..."
    
    if check_http_endpoint "$BASE_URL" "200" "Main page"; then
        # Check if the page contains expected content
        local content
        content=$(curl -s --max-time "$TIMEOUT" "$BASE_URL")
        
        if echo "$content" | grep -q "Mayur Chavhan"; then
            log_success "Main page content: OK"
        else
            log_warning "Main page content: Missing expected content"
        fi
        
        return 0
    else
        return 1
    fi
}

check_static_assets() {
    log_info "Checking static assets..."
    
    local assets_checked=0
    local assets_failed=0
    
    # Get the main page and extract asset URLs
    local main_page
    main_page=$(curl -s --max-time "$TIMEOUT" "$BASE_URL" || echo "")
    
    if [ -n "$main_page" ]; then
        # Extract CSS and JS files
        local assets
        assets=$(echo "$main_page" | grep -oE '(href|src)="[^"]*\.(css|js)"' | cut -d'"' -f2)
        
        for asset in $assets; do
            if [[ "$asset" == /* ]]; then
                asset="$BASE_URL$asset"
            elif [[ "$asset" != http* ]]; then
                asset="$BASE_URL/$asset"
            fi
            
            assets_checked=$((assets_checked + 1))
            
            if ! check_http_endpoint "$asset" "200" "Asset" >/dev/null 2>&1; then
                assets_failed=$((assets_failed + 1))
                if [ "$VERBOSE" = true ]; then
                    log_warning "Failed to load asset: $asset"
                fi
            fi
        done
    fi
    
    if [ $assets_failed -eq 0 ]; then
        log_success "Static assets: OK ($assets_checked checked)"
    else
        log_warning "Static assets: $assets_failed/$assets_checked failed"
    fi
}

check_redis_connection() {
    if [ "$CHECK_REDIS" != true ]; then
        log_info "Skipping Redis check as requested"
        return 0
    fi
    
    log_info "Checking Redis connection..."
    
    # Try to get health status which includes Redis info
    local health_url="$BASE_URL/health"
    local response
    
    response=$(curl -s --max-time "$TIMEOUT" "$health_url" || echo '{}')
    
    local redis_status
    redis_status=$(echo "$response" | jq -r '.services.redis // "unknown"' 2>/dev/null || echo "unknown")
    
    case "$redis_status" in
        "healthy")
            log_success "Redis connection: OK"
            return 0
            ;;
        "disabled")
            log_warning "Redis connection: Disabled"
            return 0
            ;;
        "unhealthy")
            log_error "Redis connection: FAILED"
            return 1
            ;;
        *)
            log_warning "Redis connection: Status unknown"
            return 0
            ;;
    esac
}

check_performance() {
    if [ "$CHECK_PERFORMANCE" != true ]; then
        return 0
    fi
    
    log_info "Running performance checks..."
    
    # Check response time
    local start_time
    local end_time
    local response_time
    
    start_time=$(date +%s%N)
    curl -s --max-time "$TIMEOUT" "$BASE_URL" >/dev/null
    end_time=$(date +%s%N)
    
    response_time=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
    
    if [ $response_time -lt 1000 ]; then
        log_success "Response time: ${response_time}ms (Good)"
    elif [ $response_time -lt 3000 ]; then
        log_warning "Response time: ${response_time}ms (Acceptable)"
    else
        log_error "Response time: ${response_time}ms (Poor)"
    fi
    
    # Check if gzip compression is enabled
    local content_encoding
    content_encoding=$(curl -s -H "Accept-Encoding: gzip" -I "$BASE_URL" | grep -i "content-encoding" | grep -i "gzip" || echo "")
    
    if [ -n "$content_encoding" ]; then
        log_success "Gzip compression: Enabled"
    else
        log_warning "Gzip compression: Not detected"
    fi
}

check_security_headers() {
    log_info "Checking security headers..."
    
    local headers
    headers=$(curl -s -I --max-time "$TIMEOUT" "$BASE_URL")
    
    local security_checks=(
        "X-Content-Type-Options:nosniff"
        "X-Frame-Options"
        "X-XSS-Protection"
        "Referrer-Policy"
    )
    
    local passed=0
    local total=${#security_checks[@]}
    
    for check in "${security_checks[@]}"; do
        local header_name
        header_name=$(echo "$check" | cut -d: -f1)
        
        if echo "$headers" | grep -qi "$header_name"; then
            if [ "$VERBOSE" = true ]; then
                log_success "Security header present: $header_name"
            fi
            passed=$((passed + 1))
        else
            if [ "$VERBOSE" = true ]; then
                log_warning "Security header missing: $header_name"
            fi
        fi
    done
    
    if [ $passed -eq $total ]; then
        log_success "Security headers: All present ($passed/$total)"
    else
        log_warning "Security headers: $passed/$total present"
    fi
}

run_all_checks() {
    log_info "Starting comprehensive health check for: $BASE_URL"
    echo
    
    local total_checks=0
    local passed_checks=0
    
    # Main application checks
    if check_main_page; then passed_checks=$((passed_checks + 1)); fi
    total_checks=$((total_checks + 1))
    
    if check_health_endpoint; then passed_checks=$((passed_checks + 1)); fi
    total_checks=$((total_checks + 1))
    
    if check_metrics_endpoint; then passed_checks=$((passed_checks + 1)); fi
    total_checks=$((total_checks + 1))
    
    # Static assets check
    check_static_assets
    
    # Redis check
    if check_redis_connection; then passed_checks=$((passed_checks + 1)); fi
    total_checks=$((total_checks + 1))
    
    # Security headers check
    check_security_headers
    
    # Performance checks (optional)
    check_performance
    
    echo
    log_info "Health check summary: $passed_checks/$total_checks core checks passed"
    
    if [ $passed_checks -eq $total_checks ]; then
        log_success "All core health checks passed!"
        return 0
    else
        log_error "Some health checks failed!"
        return 1
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            BASE_URL="$2"
            shift 2
            ;;
        -t|--timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -r|--skip-redis)
            CHECK_REDIS=false
            shift
            ;;
        -p|--performance)
            CHECK_PERFORMANCE=true
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

# Set default URL if not provided
BASE_URL="${BASE_URL:-$DEFAULT_URL}"

# Run health checks
run_all_checks
