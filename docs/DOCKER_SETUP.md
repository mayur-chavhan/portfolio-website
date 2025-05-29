# Docker Setup Guide

This guide explains how to run the Mayur Chavhan Portfolio using Docker with separate configurations for development and production environments.

## 📋 Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- At least 2GB of available RAM
- At least 1GB of available disk space

## 🏗️ Available Configurations

### 1. Development Environment (`docker-compose.dev.yml`)

- **Purpose**: Local development with hot reload
- **Port**: 3000
- **Features**:
  - Hot reload enabled
  - Source code mounted as volume
  - Development tools enabled
  - Debug logging
  - Interactive terminal support

### 2. Production Environment (`docker-compose.prod.yml`)

- **Purpose**: Production-ready deployment
- **Port**: 8080 (configurable via PORT env var)
- **Features**:
  - Optimized build
  - Security hardening
  - Resource limits
  - Log rotation
  - Health checks

### 3. Default Configuration (`docker-compose.yml`)

- **Purpose**: Simple production deployment
- **Port**: 8080 (configurable via PORT env var)
- **Features**: Basic production setup

## 🚀 Quick Start

### Development Environment

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Start in detached mode
docker-compose -f docker-compose.dev.yml up -d --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production Environment

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up --build

# Start in detached mode
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Default Configuration

```bash
# Start with default configuration
docker-compose up --build

# Start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Application Configuration
NODE_ENV=production
PORT=8080

# Vite Configuration
VITE_APP_NAME=Mayur Chavhan Portfolio
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=DevOps Engineer & Cloud Architect Portfolio

# Feature Flags
VITE_DEV_TOOLS=false
VITE_SHOW_PERFORMANCE_METRICS=false
VITE_BUILD_SOURCEMAP=false

# Social Media Links
VITE_GITHUB_URL=https://github.com/mayurchavhan
VITE_LINKEDIN_URL=https://linkedin.com/in/mayurchavhan
VITE_TWITTER_URL=https://twitter.com/mayurchavhan
VITE_EMAIL=mayur@example.com
```

### Port Configuration

You can customize the port by setting the `PORT` environment variable:

```bash
# Use custom port
PORT=3001 docker-compose up

# Or set in .env file
echo "PORT=3001" >> .env
```

## 🏥 Health Checks

All configurations include health checks:

- **Development**: `http://localhost:3000/`
- **Production**: `http://localhost:8080/health`

### Health Check Endpoints

- `GET /health` - Application health status
- `GET /metrics` - Application metrics and performance data

## 📊 Monitoring

### View Container Status

```bash
# Check running containers
docker ps

# View container resource usage
docker stats

# Check container health
docker inspect <container_name> | grep Health -A 10
```

### View Logs

```bash
# Follow logs for specific service
docker-compose logs -f portfolio

# View logs with timestamps
docker-compose logs -t portfolio

# View last 100 lines
docker-compose logs --tail=100 portfolio
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using the port
   lsof -i :3000
   # or
   lsof -i :8080

   # Kill the process or use a different port
   PORT=3001 docker-compose up
   ```

2. **Build Failures**

   ```bash
   # Clean build (remove cache)
   docker-compose build --no-cache

   # Remove all containers and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

3. **Permission Issues**

   ```bash
   # Fix file permissions (Linux/macOS)
   sudo chown -R $USER:$USER .
   ```

4. **Out of Disk Space**
   ```bash
   # Clean up Docker resources
   docker system prune -a
   docker volume prune
   ```

### Debug Mode

For development debugging:

```bash
# Run with debug output
docker-compose -f docker-compose.dev.yml up --build --verbose

# Access container shell
docker-compose -f docker-compose.dev.yml exec portfolio-dev sh

# View container logs in real-time
docker-compose -f docker-compose.dev.yml logs -f --tail=50
```

## 🔒 Security Notes

- Production containers run as non-root user
- Security options are enabled (`no-new-privileges`)
- Resource limits are applied in production
- Health checks ensure service availability
- Logs are rotated to prevent disk space issues

## 📝 Development Workflow

1. **Start Development Environment**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

2. **Make Code Changes**

   - Files are automatically synced via volume mounts
   - Hot reload will restart the development server

3. **View Changes**

   - Open http://localhost:3000 in your browser
   - Changes should appear automatically

4. **Test Production Build**

   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

5. **Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

## 🚀 Production Deployment

For production deployment, use the production configuration:

```bash
# Pull latest code
git pull origin main

# Build and start production services
docker-compose -f docker-compose.prod.yml up -d --build

# Verify deployment
curl http://localhost:8080/health
```

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify health status: `curl http://localhost:8080/health`
3. Check container status: `docker ps`
4. Review this troubleshooting guide

For additional help, please refer to the main project documentation.
