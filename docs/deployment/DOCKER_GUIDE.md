# Docker & CI/CD Setup Guide

This guide will help you understand and use the Docker and GitHub Actions setup for your portfolio website.

## 🐳 Docker Setup

### Files Created:

- `Dockerfile` - Multi-stage production build
- `Dockerfile.dev` - Development environment
- `docker-compose.yml` - Container orchestration
- `nginx.conf` - Web server configuration
- `.dockerignore` - Exclude unnecessary files

### Quick Start

#### Development Mode

```bash
# Run development server with hot reload
docker-compose --profile dev up portfolio-dev

# Or build and run manually
docker build -f Dockerfile.dev -t portfolio-dev .
docker run -p 3000:3000 -v $(pwd):/app portfolio-dev
```

#### Production Mode

```bash
# Run production build
docker-compose --profile prod up portfolio-prod

# Or run the default service
docker-compose up portfolio

# Build and run manually
docker build -t portfolio .
docker run -p 8080:8080 portfolio
```

### Environment Variables

Create a `.env` file to customize:

```bash
PORT=8080
NODE_ENV=production
```

## 🚀 GitHub Actions CI/CD

### Workflow Features:

- ✅ Automated testing and linting
- 🐳 Multi-architecture Docker builds (AMD64/ARM64)
- 🔍 Container security checks
- 🏥 Health checks and smoke tests
- 📦 Automatic package registry publishing
- 🌍 Environment-based deployments

### Setup Instructions:

#### 1. Enable GitHub Container Registry

1. Go to your GitHub repository
2. Click on **Settings** → **Actions** → **General**
3. Under "Workflow permissions", select **Read and write permissions**
4. Click **Save**

#### 2. Create Environment Secrets (Optional)

If you plan to deploy to external services:

1. Go to **Settings** → **Environments**
2. Create environments: `staging` and `production`
3. Add protection rules if needed
4. Add environment-specific secrets

#### 3. Push Your Code

```bash
git add .
git commit -m "Add Docker and CI/CD setup"
git push origin main
```

### Workflow Triggers:

- **Push to main/develop**: Full CI/CD pipeline
- **Pull Requests to main**: Test and build only
- **Manual dispatch**: Can be triggered manually

### What Happens:

1. **Test Job**: Runs linting and builds the app
2. **Docker Build**: Creates optimized container images
3. **Docker Test**: Validates container functionality
4. **Deploy**: Deploys to staging/production (if configured)

## 📊 Monitoring Your Builds

### GitHub Actions Dashboard:

1. Go to your repository
2. Click the **Actions** tab
3. View workflow runs and logs

### Container Registry:

1. Go to your repository
2. Click **Packages** (in the right sidebar)
3. View published Docker images

## 🔧 Troubleshooting

### Common Issues:

#### Build Fails:

```bash
# Test locally first
npm run build
docker build -t test .
```

#### Container Won't Start:

```bash
# Check logs
docker logs <container-name>

# Test health endpoint
curl http://localhost:8080/health
```

#### GitHub Actions Permission Error:

1. Check repository settings
2. Ensure workflow permissions are correct
3. Verify GITHUB_TOKEN has package write access

### Optimization Tips:

#### Reduce Image Size:

- The Dockerfile uses multi-stage builds
- Only production dependencies are included
- Alpine Linux base for minimal footprint

#### Improve Build Speed:

- Uses Docker layer caching
- npm ci for faster installs
- GitHub Actions cache for dependencies

## 🏗️ Customization

### Modify Nginx Configuration:

Edit `nginx.conf` to:

- Add custom headers
- Configure caching rules
- Set up SSL/TLS (for production)

### Update Docker Compose:

Edit `docker-compose.yml` to:

- Add databases or other services
- Configure networks
- Set up volumes for data persistence

### Extend GitHub Actions:

Edit `.github/workflows/ci-cd.yml` to:

- Add more test steps
- Configure different deployment targets
- Add security scanning
- Set up monitoring alerts

## 📱 Usage Examples

### Local Development:

```bash
# Start development environment
docker-compose --profile dev up

# View logs
docker-compose logs -f portfolio-dev

# Stop and clean up
docker-compose down
```

### Production Testing:

```bash
# Build and test production locally
docker-compose --profile prod up --build

# Run security scan (if you have tools installed)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image portfolio:latest
```

### Manual Deployment:

```bash
# Pull latest image
docker pull ghcr.io/yourusername/portfolio-website:latest

# Run in production
docker run -d --name portfolio -p 80:8080 \
  --restart unless-stopped \
  ghcr.io/yourusername/portfolio-website:latest
```

## 🎯 Next Steps

1. **Test locally**: Run both development and production builds
2. **Push to GitHub**: Trigger the CI/CD pipeline
3. **Monitor builds**: Check the Actions tab for results
4. **Configure deployment**: Set up staging and production environments
5. **Add monitoring**: Consider adding health checks and logging

## 📞 Need Help?

If you encounter issues:

1. Check the GitHub Actions logs
2. Test Docker builds locally
3. Verify all files are committed
4. Check file permissions and syntax

Happy coding! 🚀
