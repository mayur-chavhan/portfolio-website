import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Simple cache middleware (in-memory for basic caching)
const cache = new Map();

function cacheMiddleware(duration = 300) {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < duration * 1000) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached.data);
    }

    // Store original json method
    const originalJson = res.json;
    res.json = function (data) {
      // Cache the response
      if (res.statusCode === 200) {
        cache.set(key, {
          data,
          timestamp: Date.now(),
        });
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson.call(this, data);
    };

    next();
  };
}

// Trust proxy for proper IP forwarding
app.set('trust proxy', true);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        workerSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : '*',
    credentials: true,
  })
);

// Compression middleware
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';

    console.log(
      `${new Date().toISOString()} - ${ip} - "${req.method} ${req.originalUrl}" ${res.statusCode} - ${duration}ms - "${userAgent}"`
    );
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    pid: process.pid,
    cache: {
      type: 'in-memory',
      size: cache.size,
    },
  };

  res.status(200).json(health);
});

// Metrics endpoint for monitoring
app.get('/metrics', cacheMiddleware(60), (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    pid: process.pid,
    platform: process.platform,
    nodeVersion: process.version,
    environment: NODE_ENV,
    cache: {
      type: 'in-memory',
      size: cache.size,
      entries: Array.from(cache.keys()),
    },
  };

  res.status(200).json(metrics);
});

// Static file serving with proper headers
app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: NODE_ENV === 'production' ? '1y' : '0',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Set cache headers based on file type
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (filePath.match(/\.(js|css|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.match(/\.(png|jpg|jpeg|gif|ico|svg|webp)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
      }

      // Security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    },
  })
);

// Handle client-side routing (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
function startServer() {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `🚀 Portfolio server running on port ${PORT} in ${NODE_ENV} mode`
    );
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
    console.log(`📈 Metrics available at http://localhost:${PORT}/metrics`);
    console.log(`💾 In-memory caching enabled`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });

  return server;
}

// Start the server
startServer();

export default app;
