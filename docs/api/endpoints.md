# API Documentation

This document describes the available API endpoints for the portfolio website.

## 🌐 Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://mayurchavhan.com`

## 📋 API Overview

The portfolio website provides a RESTful API for:

- Contact form submissions
- Health checks
- Performance metrics
- Development tools (dev environment only)

## 🔗 Endpoints

### Health Check

#### GET /health

Returns the health status of the application.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "redis": "connected",
    "database": "connected"
  }
}
```

**Status Codes:**

- `200 OK` - Service is healthy
- `503 Service Unavailable` - Service is unhealthy

---

### Contact Form

#### POST /api/contact

Submits a contact form message.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a potential project..."
}
```

**Validation Rules:**

- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `subject`: Optional, max 200 characters
- `message`: Required, 10-2000 characters

**Response (Success):**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "id": "msg_1234567890"
}
```

**Response (Validation Error):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "message": "Message is too short"
  }
}
```

**Status Codes:**

- `200 OK` - Message sent successfully
- `400 Bad Request` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

### Performance Metrics

#### GET /api/metrics

Returns application performance metrics.

**Query Parameters:**

- `timeframe`: `1h`, `24h`, `7d`, `30d` (default: `1h`)
- `metric`: `response_time`, `memory`, `cpu`, `requests` (default: all)

**Response:**

```json
{
  "timeframe": "1h",
  "metrics": {
    "response_time": {
      "avg": 120,
      "min": 45,
      "max": 350,
      "p95": 280
    },
    "memory": {
      "used": 256,
      "total": 512,
      "percentage": 50
    },
    "cpu": {
      "usage": 15.5,
      "load_avg": [0.8, 0.9, 1.1]
    },
    "requests": {
      "total": 1250,
      "per_minute": 20.8,
      "errors": 5
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Metrics retrieved successfully
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Authentication required (production)

---

### Error Tracking

#### POST /api/errors

Reports client-side errors for tracking.

**Request Body:**

```json
{
  "message": "TypeError: Cannot read property 'map' of undefined",
  "stack": "Error stack trace...",
  "url": "https://mayurchavhan.com/projects",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userId": "anonymous",
  "metadata": {
    "component": "ProjectsSection",
    "props": {}
  }
}
```

**Response:**

```json
{
  "success": true,
  "errorId": "err_1234567890"
}
```

**Status Codes:**

- `200 OK` - Error reported successfully
- `400 Bad Request` - Invalid error data
- `429 Too Many Requests` - Rate limit exceeded

---

### Cache Management

#### DELETE /api/cache

Clears application cache (development only).

**Query Parameters:**

- `type`: `all`, `redis`, `memory` (default: `all`)

**Response:**

```json
{
  "success": true,
  "message": "Cache cleared successfully",
  "cleared": ["redis", "memory"]
}
```

**Status Codes:**

- `200 OK` - Cache cleared successfully
- `403 Forbidden` - Not available in production
- `500 Internal Server Error` - Cache clear failed

---

## 🔒 Authentication

### Development Environment

No authentication required for most endpoints in development.

### Production Environment

- **Public endpoints**: `/health`, `/api/contact`, `/api/errors`
- **Protected endpoints**: `/api/metrics`, `/api/cache`

Protected endpoints require API key authentication:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://mayurchavhan.com/api/metrics
```

## 📊 Rate Limiting

Rate limits are applied to prevent abuse:

| Endpoint       | Limit         | Window     |
| -------------- | ------------- | ---------- |
| `/api/contact` | 5 requests    | 15 minutes |
| `/api/errors`  | 100 requests  | 15 minutes |
| `/api/metrics` | 60 requests   | 15 minutes |
| Global         | 1000 requests | 15 minutes |

**Rate Limit Headers:**

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1642248600
```

**Rate Limit Exceeded Response:**

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests, please try again later",
  "retryAfter": 900
}
```

## 🔧 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "details": {
    "field": "Additional error details"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_1234567890"
}
```

### Common Error Codes

| Code                  | Description                     |
| --------------------- | ------------------------------- |
| `VALIDATION_ERROR`    | Request validation failed       |
| `RATE_LIMIT_EXCEEDED` | Too many requests               |
| `INTERNAL_ERROR`      | Server error                    |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |
| `UNAUTHORIZED`        | Authentication required         |
| `FORBIDDEN`           | Access denied                   |

## 📝 Request/Response Examples

### Contact Form Submission

```bash
curl -X POST https://mayurchavhan.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Collaboration Opportunity",
    "message": "Hi Mayur, I came across your portfolio and would love to discuss a potential collaboration on a DevOps project."
  }'
```

### Health Check

```bash
curl https://mayurchavhan.com/health
```

### Performance Metrics

```bash
curl "https://mayurchavhan.com/api/metrics?timeframe=24h&metric=response_time" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 🧪 Testing the API

### Using curl

```bash
# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'

# Test health endpoint
curl http://localhost:3000/health
```

### Using Postman

Import the following collection:

```json
{
  "info": {
    "name": "Portfolio API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Contact Form",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"message\": \"Test message\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/contact",
          "host": ["{{baseUrl}}"],
          "path": ["api", "contact"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

## 📚 SDK and Libraries

### JavaScript/TypeScript SDK

```typescript
// api-client.ts
class PortfolioAPI {
  constructor(
    private baseUrl: string,
    private apiKey?: string
  ) {}

  async submitContact(data: ContactFormData): Promise<ContactResponse> {
    const response = await fetch(`${this.baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

// Usage
const api = new PortfolioAPI('https://mayurchavhan.com');
const result = await api.submitContact({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello!',
});
```

This API documentation provides comprehensive information for integrating with the portfolio website's backend services.
