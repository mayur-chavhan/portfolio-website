/**
 * Environment configuration and validation
 * This file centralizes all environment variable access and provides type safety
 */

interface EnvironmentConfig {
  // Application
  NODE_ENV: 'development' | 'production' | 'test';
  APP_NAME: string;
  APP_VERSION: string;
  APP_DESCRIPTION: string;

  // API Configuration
  API_BASE_URL: string;
  API_TIMEOUT: number;

  // Analytics
  GOOGLE_ANALYTICS_ID?: string;
  GOOGLE_TAG_MANAGER_ID?: string;

  // Social Media
  GITHUB_URL: string;
  LINKEDIN_URL: string;
  TWITTER_URL: string;
  EMAIL: string;

  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_CONTACT_FORM: boolean;
  ENABLE_BLOG: boolean;
  ENABLE_DARK_MODE: boolean;
  ENABLE_PWA: boolean;
  ENABLE_SERVICE_WORKER: boolean;

  // Development
  DEV_TOOLS: boolean;
  SHOW_PERFORMANCE_METRICS: boolean;

  // Build
  BUILD_SOURCEMAP: boolean;
  BUILD_ANALYZE: boolean;

  // Security
  CSP_ENABLED: boolean;
  SECURITY_HEADERS: boolean;

  // Monitoring
  SENTRY_DSN?: string;
  SENTRY_ENVIRONMENT: string;

  // CDN
  CDN_URL?: string;
  ASSETS_CDN_URL?: string;

  // Redis
  REDIS_URL: string;
  REDIS_PASSWORD?: string;
  REDIS_DB: number;
  REDIS_TTL_DEFAULT: number;
}

/**
 * Parse boolean environment variables
 */
const parseBoolean = (
  value: string | undefined,
  defaultValue = false
): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

/**
 * Parse number environment variables
 */
const parseNumber = (
  value: string | undefined,
  defaultValue: number
): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Get environment variable with fallback
 */
const getEnvVar = (key: string, defaultValue = ''): string => {
  return import.meta.env[`VITE_${key}`] || defaultValue;
};

/**
 * Validate required environment variables
 */
const validateRequiredEnvVars = () => {
  const required = ['APP_NAME', 'APP_VERSION'];
  const missing = required.filter(key => !getEnvVar(key));

  if (missing.length > 0) {
    console.warn(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

// Validate environment variables in development
if (import.meta.env.DEV) {
  validateRequiredEnvVars();
}

/**
 * Environment configuration object
 */
export const env: EnvironmentConfig = {
  // Application
  NODE_ENV:
    (import.meta.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) ||
    'development',
  APP_NAME: getEnvVar('APP_NAME', 'Mayur Chavhan Portfolio'),
  APP_VERSION: getEnvVar('APP_VERSION', '1.0.0'),
  APP_DESCRIPTION: getEnvVar(
    'APP_DESCRIPTION',
    'DevOps Engineer & Cloud Architect Portfolio'
  ),

  // API Configuration
  API_BASE_URL: getEnvVar('API_BASE_URL', 'https://api.mayurchavhan.com'),
  API_TIMEOUT: parseNumber(getEnvVar('API_TIMEOUT'), 10000),

  // Analytics
  GOOGLE_ANALYTICS_ID: getEnvVar('GOOGLE_ANALYTICS_ID'),
  GOOGLE_TAG_MANAGER_ID: getEnvVar('GOOGLE_TAG_MANAGER_ID'),

  // Social Media
  GITHUB_URL: getEnvVar('GITHUB_URL', 'https://github.com/mayurchavhan'),
  LINKEDIN_URL: getEnvVar(
    'LINKEDIN_URL',
    'https://linkedin.com/in/mayurchavhan'
  ),
  TWITTER_URL: getEnvVar('TWITTER_URL', 'https://twitter.com/mayurchavhan'),
  EMAIL: getEnvVar('EMAIL', 'mayur@example.com'),

  // Feature Flags
  ENABLE_ANALYTICS: parseBoolean(getEnvVar('ENABLE_ANALYTICS'), false),
  ENABLE_CONTACT_FORM: parseBoolean(getEnvVar('ENABLE_CONTACT_FORM'), true),
  ENABLE_BLOG: parseBoolean(getEnvVar('ENABLE_BLOG'), true),
  ENABLE_DARK_MODE: parseBoolean(getEnvVar('ENABLE_DARK_MODE'), true),
  ENABLE_PWA: parseBoolean(getEnvVar('ENABLE_PWA'), false),
  ENABLE_SERVICE_WORKER: parseBoolean(
    getEnvVar('ENABLE_SERVICE_WORKER'),
    false
  ),

  // Development
  DEV_TOOLS: parseBoolean(getEnvVar('DEV_TOOLS'), import.meta.env.DEV),
  SHOW_PERFORMANCE_METRICS: parseBoolean(
    getEnvVar('SHOW_PERFORMANCE_METRICS'),
    false
  ),

  // Build
  BUILD_SOURCEMAP: parseBoolean(getEnvVar('BUILD_SOURCEMAP'), true),
  BUILD_ANALYZE: parseBoolean(getEnvVar('BUILD_ANALYZE'), false),

  // Security
  CSP_ENABLED: parseBoolean(getEnvVar('CSP_ENABLED'), true),
  SECURITY_HEADERS: parseBoolean(getEnvVar('SECURITY_HEADERS'), true),

  // Monitoring
  SENTRY_DSN: getEnvVar('SENTRY_DSN'),
  SENTRY_ENVIRONMENT: getEnvVar('SENTRY_ENVIRONMENT', 'development'),

  // CDN
  CDN_URL: getEnvVar('CDN_URL'),
  ASSETS_CDN_URL: getEnvVar('ASSETS_CDN_URL'),

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: parseNumber(process.env.REDIS_DB, 0),
  REDIS_TTL_DEFAULT: parseNumber(process.env.REDIS_TTL_DEFAULT, 1800),
};

/**
 * Check if we're in development mode
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if we're in production mode
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if we're in test mode
 */
export const isTest = env.NODE_ENV === 'test';

export default env;
