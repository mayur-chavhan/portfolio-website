/**
 * Application constants
 */

// Application metadata
export const APP_CONFIG = {
  name: 'Mayur Chavhan Portfolio',
  version: '1.0.0',
  description: 'DevOps Engineer & Cloud Architect Portfolio',
  author: 'Mayur Chavhan',
  url: 'https://mayurchavhan.com',
  email: 'mayur@example.com',
} as const;

// Social media links
export const SOCIAL_LINKS = {
  github: 'https://github.com/mayurchavhan',
  linkedin: 'https://linkedin.com/in/mayurchavhan',
  twitter: 'https://twitter.com/mayurchavhan',
  email: 'mailto:mayur@example.com',
} as const;

// Navigation items
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'blog', label: 'Blog', href: '#blog' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const;

// Theme configuration
export const THEME_CONFIG = {
  defaultTheme: 'light',
  storageKey: 'theme',
  themes: ['light', 'dark'] as const,
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 1000,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  analytics: '/api/analytics',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  validation: 'Please check your input and try again.',
  notFound: 'The requested resource was not found.',
  unauthorized: 'You are not authorized to perform this action.',
  serverError: 'Server error. Please try again later.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  contactForm: "Thank you for your message! I'll get back to you soon.",
  newsletter: 'Successfully subscribed to the newsletter!',
  copy: 'Copied to clipboard!',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'portfolio-theme',
  preferences: 'portfolio-preferences',
  visitCount: 'portfolio-visit-count',
  lastVisit: 'portfolio-last-visit',
} as const;

// Feature flags
export const FEATURES = {
  analytics: false,
  contactForm: true,
  blog: true,
  darkMode: true,
  animations: true,
  serviceWorker: false,
} as const;

// Performance thresholds
export const PERFORMANCE = {
  imageLoadTimeout: 10000,
  apiTimeout: 5000,
  debounceDelay: 300,
  throttleDelay: 100,
} as const;

// SEO configuration
export const SEO_CONFIG = {
  defaultTitle: 'Mayur Chavhan | DevOps Engineer & Cloud Architect',
  titleTemplate: '%s | Mayur Chavhan',
  defaultDescription:
    'DevOps Engineer and Cloud Architect specializing in AWS, Kubernetes, and Automation. Building scalable infrastructure and CI/CD pipelines.',
  keywords: [
    'DevOps',
    'Cloud Architect',
    'AWS',
    'Kubernetes',
    'Docker',
    'CI/CD',
    'Infrastructure',
    'Automation',
    'Terraform',
    'Jenkins',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mayurchavhan.com',
    siteName: 'Mayur Chavhan Portfolio',
  },
  twitter: {
    handle: '@mayurchavhan',
    site: '@mayurchavhan',
    cardType: 'summary_large_image',
  },
} as const;

// Contact form configuration
export const CONTACT_CONFIG = {
  maxMessageLength: 1000,
  requiredFields: ['name', 'email', 'message'] as const,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Skills categories
export const SKILL_CATEGORIES = {
  cloud: 'Cloud Platforms',
  devops: 'DevOps Tools',
  programming: 'Programming Languages',
  databases: 'Databases',
  monitoring: 'Monitoring & Logging',
  security: 'Security',
} as const;

// Project types
export const PROJECT_TYPES = {
  infrastructure: 'Infrastructure',
  automation: 'Automation',
  application: 'Application',
  opensource: 'Open Source',
} as const;

// Experience levels
export const EXPERIENCE_LEVELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
} as const;

// File size limits
export const FILE_LIMITS = {
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxDocumentSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  allowedDocumentTypes: ['application/pdf', 'text/plain'],
} as const;
