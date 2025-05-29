# Production Deployment Guide

This document outlines the production deployment strategies and best practices for the portfolio website.

## 🚀 Deployment Options

### 1. Docker Deployment (Recommended)

#### Prerequisites

- Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)

#### Quick Deployment

```bash
# Clone the repository
git clone https://github.com/mayurchavhan/portfolio-website.git
cd portfolio-website

# Build and start production containers
docker-compose up -d

# Check container status
docker-compose ps
```

#### Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '80:80'
      - '443:443'
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

### 2. Cloud Platform Deployment

#### Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### Netlify (Frontend Only)

```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload dist/ folder to Netlify dashboard
# or use Netlify CLI
```

#### AWS EC2 Deployment

```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-instance

# Install Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu

# Clone and deploy
git clone https://github.com/mayurchavhan/portfolio-website.git
cd portfolio-website
docker-compose -f docker-compose.prod.yml up -d
```

#### DigitalOcean Droplet

```bash
# Create droplet with Docker pre-installed
# SSH into droplet
ssh root@your-droplet-ip

# Clone and deploy
git clone https://github.com/mayurchavhan/portfolio-website.git
cd portfolio-website
docker-compose up -d
```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=3000

# API Configuration
API_BASE_URL=https://api.mayurchavhan.com
API_TIMEOUT=10000

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-secure-password

# Security
SESSION_SECRET=your-super-secure-session-secret
CORS_ORIGIN=https://mayurchavhan.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Contact Form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### SSL Configuration

#### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d mayurchavhan.com -d www.mayurchavhan.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Manual SSL Setup

```nginx
# nginx.conf SSL configuration
server {
    listen 443 ssl http2;
    server_name mayurchavhan.com www.mayurchavhan.com;

    ssl_certificate /etc/ssl/certs/mayurchavhan.com.crt;
    ssl_certificate_key /etc/ssl/private/mayurchavhan.com.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name mayurchavhan.com www.mayurchavhan.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 Performance Optimization

### Build Optimization

```typescript
// vite.config.ts production optimizations
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          particles: ['react-particles', 'tsparticles-slim'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### Nginx Optimization

```nginx
# nginx.conf performance settings
http {
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Browser caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

## 🔍 Monitoring and Logging

### Application Monitoring

```typescript
// Production monitoring setup
import { errorTracker } from '@/shared/utils/errorTracking';
import { performanceTracker } from '@/shared/utils/performance';

// Initialize monitoring in production
if (process.env.NODE_ENV === 'production') {
  errorTracker.initialize({
    dsn: process.env.SENTRY_DSN,
    environment: 'production',
  });

  performanceTracker.initialize({
    apiKey: process.env.PERFORMANCE_API_KEY,
  });
}
```

### Server Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor system resources
htop                    # CPU and memory usage
iotop                   # Disk I/O
nethogs                 # Network usage
docker stats            # Container resource usage
```

### Log Management

```bash
# View application logs
docker-compose logs -f app

# View Nginx logs
docker-compose logs -f nginx

# Rotate logs
sudo logrotate -f /etc/logrotate.conf
```

## 🔒 Security Hardening

### Server Security

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### Application Security

```typescript
// server.js security configuration
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
```

## 📈 Scaling Considerations

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
version: '3.8'

services:
  app:
    build: .
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

### Load Balancer Configuration

```nginx
# nginx-lb.conf
upstream app_servers {
    server app_1:3000;
    server app_2:3000;
    server app_3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://app_servers;
    }
}
```

## 🔄 Deployment Automation

### GitHub Actions Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/portfolio-website
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

### Deployment Script

```bash
#!/bin/bash
# scripts/deployment/deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Build and deploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Health check
sleep 10
curl -f http://localhost/health || exit 1

echo "✅ Deployment completed successfully!"
```

## 🆘 Troubleshooting

### Common Issues

1. **Container won't start**

   ```bash
   docker-compose logs app
   docker-compose down && docker-compose up -d
   ```

2. **SSL certificate issues**

   ```bash
   sudo certbot renew --dry-run
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **High memory usage**

   ```bash
   docker stats
   docker system prune -a
   ```

4. **Database connection issues**
   ```bash
   docker-compose logs redis
   docker-compose restart redis
   ```

### Health Checks

```bash
# Application health
curl https://mayurchavhan.com/health

# SSL certificate check
openssl s_client -connect mayurchavhan.com:443

# Performance check
curl -w "@curl-format.txt" -o /dev/null -s https://mayurchavhan.com
```

This production deployment guide ensures a robust, secure, and scalable deployment of the portfolio website.
