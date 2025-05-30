#!/bin/sh
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Starting Portfolio Development Container...${NC}"

# Function to fix permissions
fix_permissions() {
    echo -e "${YELLOW}🔧 Checking and fixing file permissions...${NC}"

    # Get current user info
    CURRENT_UID=$(id -u)
    CURRENT_GID=$(id -g)

    echo -e "${BLUE}📋 Container user info:${NC}"
    echo -e "  User ID: ${CURRENT_UID}"
    echo -e "  Group ID: ${CURRENT_GID}"
    echo -e "  User: $(whoami)"

    # Check if we need to fix permissions
    if [ ! -w "/app" ]; then
        echo -e "${YELLOW}⚠️  /app directory is not writable${NC}"
        echo -e "${YELLOW}💡 This might be due to volume mount permissions${NC}"
        echo -e "${BLUE}ℹ️  Continuing anyway - some features may not work${NC}"
    fi

    # Ensure specific directories exist for Vite
    VITE_DIRS="node_modules .vite dist"
    for dir in $VITE_DIRS; do
        if [ ! -d "/app/$dir" ]; then
            # Create directory if it doesn't exist
            echo -e "${BLUE}📁 Creating directory: $dir${NC}"
            mkdir -p "/app/$dir" 2>/dev/null || true
        fi

        if [ -d "/app/$dir" ] && [ ! -w "/app/$dir" ]; then
            echo -e "${YELLOW}⚠️  Directory $dir is not writable${NC}"
        fi
    done

    # Check if package.json exists and is readable
    if [ ! -r "/app/package.json" ]; then
        echo -e "${RED}❌ package.json is not readable${NC}"
        echo -e "${YELLOW}💡 Make sure the source code is properly mounted${NC}"
        exit 1
    fi

    # Check if vite.config.ts exists and is readable
    if [ ! -r "/app/vite.config.ts" ]; then
        echo -e "${RED}❌ vite.config.ts is not readable${NC}"
        echo -e "${YELLOW}💡 Make sure the source code is properly mounted${NC}"
        exit 1
    fi

    # Try to create a test file to verify write permissions
    TEST_FILE="/app/.permission-test-$$"
    if touch "$TEST_FILE" 2>/dev/null; then
        rm -f "$TEST_FILE"
        echo -e "${GREEN}✅ Write permissions verified${NC}"
    else
        echo -e "${YELLOW}⚠️  Cannot write to /app directory${NC}"
        echo -e "${YELLOW}💡 Some features may not work properly${NC}"
        echo -e "${BLUE}ℹ️  Continuing anyway...${NC}"
    fi
}

# Function to check and install dependencies if needed
check_dependencies() {
    echo -e "${BLUE}📦 Checking dependencies...${NC}"

    if [ ! -d "/app/node_modules" ] || [ ! -f "/app/node_modules/.package-lock.json" ]; then
        echo -e "${YELLOW}📥 Installing dependencies...${NC}"
        npm ci --no-audit --no-fund || {
            echo -e "${RED}❌ Failed to install dependencies${NC}"
            exit 1
        }
        echo -e "${GREEN}✅ Dependencies installed${NC}"
    else
        echo -e "${GREEN}✅ Dependencies already installed${NC}"
    fi
}

# Function to clean up Vite cache if needed
clean_vite_cache() {
    echo -e "${BLUE}🧹 Cleaning Vite cache...${NC}"

    # Remove Vite cache directories that might cause issues
    CACHE_DIRS=".vite node_modules/.vite"
    for cache_dir in $CACHE_DIRS; do
        if [ -d "/app/$cache_dir" ]; then
            echo -e "${YELLOW}🗑️  Removing $cache_dir...${NC}"
            rm -rf "/app/$cache_dir" 2>/dev/null || {
                echo -e "${YELLOW}⚠️  Could not remove $cache_dir${NC}"
            }
        fi
    done

    echo -e "${GREEN}✅ Vite cache cleaned${NC}"
}

# Function to display environment info
show_environment_info() {
    echo -e "${BLUE}🌍 Environment Information:${NC}"
    echo -e "  Node.js: $(node --version)"
    echo -e "  npm: $(npm --version)"
    echo -e "  Working Directory: $(pwd)"
    echo -e "  NODE_ENV: ${NODE_ENV:-not set}"
    echo -e "  Port: 3000"
    echo ""
}

# Main execution
main() {
    echo -e "${GREEN}🚀 Portfolio Development Environment${NC}"
    echo -e "${BLUE}================================================${NC}"

    # Show environment info
    show_environment_info

    # Fix permissions
    fix_permissions

    # Clean Vite cache to prevent issues
    clean_vite_cache

    # Check dependencies
    check_dependencies

    echo -e "${BLUE}================================================${NC}"
    echo -e "${GREEN}🎉 Setup complete! Starting development server...${NC}"
    echo -e "${BLUE}📱 Access your app at: http://localhost:3000${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""

    # Execute the original command
    exec "$@"
}

# Run main function
main "$@"
