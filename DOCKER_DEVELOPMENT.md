# Docker Development Environment

This document describes how to use the Docker development environment for the portfolio website.

## Overview

The Docker development environment provides:

- ✅ **Consistent Development Environment**: Same Node.js version across all machines
- ✅ **Hot Reload**: File changes are automatically reflected in the browser
- ✅ **Proper User Permissions**: Files created in the container have correct ownership
- ✅ **Optimized Performance**: Cached node_modules and Vite cache for faster builds
- ✅ **Easy Setup**: One command to start developing

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git repository cloned locally

### Start Development Environment

```bash
# Make the helper script executable (first time only)
chmod +x dev-docker-helper.sh

# Start the development environment
./dev-docker-helper.sh up

# Or start in background (detached mode)
./dev-docker-helper.sh up --detach
```

The application will be available at: **http://localhost:3000**

### Stop Development Environment

```bash
./dev-docker-helper.sh down
```

## Helper Script Commands

The `dev-docker-helper.sh` script provides convenient commands for managing the development environment:

### Basic Commands

```bash
# Start development environment
./dev-docker-helper.sh up

# Start in background
./dev-docker-helper.sh up --detach

# Force rebuild and start
./dev-docker-helper.sh up --build

# Stop development environment
./dev-docker-helper.sh down

# Restart development environment
./dev-docker-helper.sh restart
```

### Debugging Commands

```bash
# View logs
./dev-docker-helper.sh logs

# Follow logs in real-time
./dev-docker-helper.sh logs --follow

# Open shell in container
./dev-docker-helper.sh shell

# Build development image
./dev-docker-helper.sh build
```

### Cleanup Commands

```bash
# Clean up containers, volumes, and images
./dev-docker-helper.sh clean
```

### Help

```bash
# Show help
./dev-docker-helper.sh help
```

## File Structure

```
portfolio-website/
├── docker-compose.dev.yml          # Development Docker Compose configuration
├── Dockerfile.dev                  # Development Docker image definition
├── docker-entrypoint-dev.sh        # Container startup script
├── dev-docker-helper.sh            # Helper script for easy management
├── .dockerignore                   # Files to exclude from Docker context
└── DOCKER_DEVELOPMENT.md          # This documentation
```

## How It Works

### 1. User ID Mapping

The development environment automatically detects your host user ID and group ID to ensure that files created inside the container have the correct ownership on your host system.

### 2. Volume Mounts

- **Source Code**: Your project directory is mounted to `/app` in the container
- **Node Modules**: Cached in a named volume for better performance
- **Vite Cache**: Cached in a named volume for faster builds
- **Dist**: Build output cached in a named volume

### 3. Hot Reload

Vite's development server watches for file changes and automatically reloads the browser when you save files.

### 4. Port Mapping

- Container port 3000 → Host port 3000
- Access your app at http://localhost:3000

## Troubleshooting

### Permission Issues

If you encounter permission issues:

1. **Check User ID Mapping**: The script automatically detects and uses your user ID
2. **Rebuild Image**: Run `./dev-docker-helper.sh build` to rebuild with correct user IDs
3. **Clean and Restart**: Run `./dev-docker-helper.sh clean` then `./dev-docker-helper.sh up`

### Port Already in Use

If port 3000 is already in use:

1. **Stop Other Services**: Stop any other services using port 3000
2. **Check Running Containers**: Run `docker ps` to see if the container is already running
3. **Stop Existing Container**: Run `./dev-docker-helper.sh down`

### Slow Performance

If the development server is slow:

1. **Check Docker Resources**: Ensure Docker has enough CPU and memory allocated
2. **Clean Cache**: Run `./dev-docker-helper.sh clean` to remove old volumes
3. **Rebuild**: Run `./dev-docker-helper.sh build` to rebuild the image

### Container Won't Start

If the container fails to start:

1. **Check Logs**: Run `./dev-docker-helper.sh logs` to see error messages
2. **Verify Prerequisites**: Ensure Docker is running and docker-compose is available
3. **Check File Permissions**: Ensure the helper script is executable

## Development Workflow

### Typical Development Session

```bash
# 1. Start development environment
./dev-docker-helper.sh up --detach

# 2. Open browser to http://localhost:3000

# 3. Edit files in your favorite editor
# Changes are automatically reflected in the browser

# 4. View logs if needed
./dev-docker-helper.sh logs --follow

# 5. Stop when done
./dev-docker-helper.sh down
```

### Working with Dependencies

```bash
# Install new dependencies
./dev-docker-helper.sh shell
npm install <package-name>
exit

# Or rebuild to pick up package.json changes
./dev-docker-helper.sh up --build
```

### Debugging

```bash
# Open shell in running container
./dev-docker-helper.sh shell

# View real-time logs
./dev-docker-helper.sh logs --follow

# Check container status
docker ps
```

## Performance Optimizations

The development environment includes several optimizations:

1. **Multi-stage Dockerfile**: Optimized for development with proper caching
2. **Named Volumes**: node_modules and Vite cache are persisted across container restarts
3. **User ID Mapping**: Prevents permission issues and improves file system performance
4. **Optimized .dockerignore**: Excludes unnecessary files from Docker context

## Security Considerations

- **Non-root User**: Container runs as non-root user for security
- **User ID Mapping**: Files have correct ownership on host system
- **Network Isolation**: Container runs in isolated Docker network
- **No Privileged Access**: Container doesn't require privileged mode

## Comparison with Local Development

| Aspect              | Docker Development                 | Local Development                   |
| ------------------- | ---------------------------------- | ----------------------------------- |
| **Consistency**     | ✅ Same environment everywhere     | ❌ Varies by machine                |
| **Setup Time**      | ✅ One command                     | ❌ Multiple steps                   |
| **Node.js Version** | ✅ Locked to specific version      | ❌ Depends on local install         |
| **Dependencies**    | ✅ Isolated in container           | ❌ Can conflict with other projects |
| **Performance**     | ⚠️ Slightly slower on some systems | ✅ Native performance               |
| **Hot Reload**      | ✅ Works perfectly                 | ✅ Works perfectly                  |

## Next Steps

- For production deployment, see the main README.md
- For CI/CD setup, check the GitHub Actions workflows
- For additional Docker configurations, see docker-compose.prod.yml
