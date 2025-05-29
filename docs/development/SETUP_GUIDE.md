# Complete Setup Guide for Docker & GitHub Actions

## 🎯 What We've Created

I've set up a complete Docker and CI/CD solution for your portfolio website with the following files:

### Docker Files:

- **`Dockerfile`** - Production-ready multi-stage build (minimal size ~15-20MB)
- **`Dockerfile.dev`** - Development environment with hot reloading
- **`docker-compose.yml`** - Easy container management
- **`nginx.conf`** - Optimized web server configuration
- **`.dockerignore`** - Reduces build context size

### GitHub Actions:

- **`.github/workflows/ci-cd.yml`** - Complete CI/CD pipeline

### Helper Files:

- **`docker-helper.sh`** - Easy-to-use management script
- **`DOCKER_GUIDE.md`** - Comprehensive documentation

## 🚀 Step-by-Step Setup

### Step 1: Install Docker

Since Docker isn't installed on your system, you need to install it first:

#### On macOS:

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Verify installation: `docker --version`

#### Alternative (using Homebrew):

```bash
brew install --cask docker
```

### Step 2: Test Docker Setup

Once Docker is installed, test the build:

```bash
# Navigate to your project
cd /Users/mayur/Desktop/Github-repos/portfolio-website

# Build the production image
docker build -t portfolio .

# Run the container
docker run -p 8080:8080 portfolio

# Visit http://localhost:8080 in your browser
```

### Step 3: Use the Helper Script

The helper script makes Docker management easier:

```bash
# Make it executable (already done)
chmod +x docker-helper.sh

# Start development environment
./docker-helper.sh dev

# Start production environment
./docker-helper.sh prod

# Build and test
./docker-helper.sh build
./docker-helper.sh test

# View help
./docker-helper.sh help
```

### Step 4: Set Up GitHub Actions

#### 4.1 Push Files to GitHub:

```bash
# Add all new files
git add .

# Commit changes
git commit -m "Add Docker setup and CI/CD pipeline"

# Push to GitHub
git push origin main
```

#### 4.2 Enable GitHub Actions:

1. Go to your GitHub repository
2. Click **Settings** → **Actions** → **General**
3. Under "Actions permissions", select **Allow all actions and reusable workflows**
4. Under "Workflow permissions", select **Read and write permissions**
5. Click **Save**

#### 4.3 Watch Your First Build:

1. Go to the **Actions** tab in your repository
2. You should see a workflow running after your push
3. Click on it to see the progress

## 📊 What the CI/CD Pipeline Does

### Automatic Testing:

- ✅ Runs ESLint to check code quality
- 🏗️ Builds the application to catch errors
- 🧪 Tests the Docker container

### Docker Image Building:

- 🐳 Creates optimized production images
- 🏷️ Tags images with version and branch info
- 📦 Publishes to GitHub Container Registry
- 🔄 Supports multiple architectures (AMD64/ARM64)

### Security & Quality:

- 🔒 Runs containers as non-root user
- 🏥 Includes health checks
- 📈 Monitors build performance
- 🛡️ Security headers configured

## 🎛️ Usage Examples

### Development Workflow:

```bash
# Start development with hot reload
./docker-helper.sh dev

# Your app will be available at http://localhost:3000
# Changes to your code will automatically reload
```

### Production Testing:

```bash
# Build and test production version
./docker-helper.sh build
./docker-helper.sh test

# Start production server
./docker-helper.sh prod

# Visit http://localhost:8080
```

### Docker Compose Commands:

```bash
# Development
docker-compose --profile dev up

# Production
docker-compose --profile prod up

# Background mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

## 🔧 Customization Options

### Environment Variables:

Create a `.env` file:

```bash
PORT=3000
NODE_ENV=development
```

### Nginx Configuration:

Edit `nginx.conf` to:

- Add SSL/TLS
- Configure caching
- Add security headers
- Set up custom routes

### GitHub Actions:

Edit `.github/workflows/ci-cd.yml` to:

- Add deployment steps
- Configure different environments
- Add security scanning
- Set up notifications

## 🎯 Next Steps

### Immediate:

1. **Install Docker Desktop**
2. **Test local build**: `./docker-helper.sh build`
3. **Push to GitHub**: Let CI/CD run

### Soon:

1. **Configure deployment** to your hosting provider
2. **Set up monitoring** for your application
3. **Add SSL certificates** for production

### Later:

1. **Add database** if needed
2. **Set up CDN** for static assets
3. **Implement caching** strategies

## 🆘 Troubleshooting

### Docker Issues:

```bash
# Check Docker status
docker --version
docker info

# Clean up if needed
docker system prune -f
```

### Build Failures:

```bash
# Check build locally first
npm run build

# Test Docker build step by step
docker build --no-cache -t test .
```

### GitHub Actions Issues:

1. Check the Actions tab for error logs
2. Verify repository permissions
3. Ensure all files are committed

## 📞 Support

If you encounter issues:

1. **Check the logs** in GitHub Actions
2. **Test locally** with Docker
3. **Review the documentation** in `DOCKER_GUIDE.md`

## 🎉 Benefits You'll Get

### Performance:

- **Faster deployments** with Docker
- **Consistent environments** across dev/prod
- **Optimized builds** with caching

### Quality:

- **Automated testing** on every push
- **Code quality checks** with ESLint
- **Security best practices** built-in

### Productivity:

- **One-command deployment**
- **Automatic builds** on GitHub
- **Easy local development**

Happy coding! 🚀
