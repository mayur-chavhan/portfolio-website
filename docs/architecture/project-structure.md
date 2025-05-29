# Project Structure

This document outlines the comprehensive project structure and organization of the portfolio website.

## 📁 Root Directory Structure

```
portfolio-website/
├── 📁 config/                    # Configuration files
│   ├── eslint.config.js         # ESLint configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── vitest.config.ts         # Vitest testing configuration
├── 📁 docs/                     # Documentation
│   ├── 📁 api/                  # API documentation
│   ├── 📁 architecture/         # Architecture documentation
│   ├── 📁 deployment/           # Deployment guides
│   └── 📁 development/          # Development guides
├── 📁 public/                   # Static assets
│   └── favicon.svg              # Site favicon
├── 📁 scripts/                  # Utility scripts
│   ├── 📁 deployment/           # Deployment scripts
│   └── 📁 utilities/            # Utility scripts
├── 📁 src/                      # Source code
│   ├── 📁 assets/               # Static assets (images, icons)
│   ├── 📁 config/               # Application configuration
│   ├── 📁 features/             # Feature-based components
│   ├── 📁 shared/               # Shared utilities and components
│   ├── 📁 styles/               # Global styles
│   ├── 📁 test/                 # Test utilities
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts           # Vite type definitions
├── 📄 .github/                  # GitHub configuration
├── 📄 .lighthouserc.json        # Lighthouse CI configuration
├── 📄 CHANGELOG.md              # Project changelog
├── 📄 README.md                 # Project overview
├── 📄 SECURITY.md               # Security policy
├── 📄 docker-compose.yml        # Docker Compose configuration
├── 📄 Dockerfile                # Production Docker image
├── 📄 Dockerfile.dev            # Development Docker image
├── 📄 nginx.conf                # Nginx configuration
├── 📄 package.json              # Node.js dependencies and scripts
├── 📄 server.js                 # Express server
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 tsconfig.app.json         # App-specific TypeScript config
├── 📄 tsconfig.node.json        # Node-specific TypeScript config
└── 📄 vite.config.ts            # Vite build configuration
```

## 🎯 Source Code Organization

### Feature-Based Architecture

The `src/` directory follows a feature-based architecture for better maintainability:

```
src/
├── 📁 features/                 # Feature modules
│   ├── 📁 about/               # About section
│   ├── 📁 blog/                # Blog section
│   ├── 📁 contact/             # Contact section
│   ├── 📁 dev-tools/           # Development tools
│   ├── 📁 experience/          # Experience section
│   ├── 📁 footer/              # Footer component
│   ├── 📁 hero/                # Hero section
│   ├── 📁 monitoring/          # Monitoring dashboard
│   ├── 📁 navigation/          # Navigation components
│   ├── 📁 projects/            # Projects section
│   └── 📁 skills/              # Skills section
├── 📁 shared/                  # Shared resources
│   ├── 📁 components/          # Reusable components
│   ├── 📁 constants/           # Application constants
│   ├── 📁 data/                # Static data
│   ├── 📁 hooks/               # Custom React hooks
│   ├── 📁 types/               # TypeScript type definitions
│   └── 📁 utils/               # Utility functions
├── 📁 assets/                  # Static assets
├── 📁 config/                  # App configuration
├── 📁 styles/                  # Global styles
└── 📁 test/                    # Test utilities
```

## 🔧 Configuration Directory

The `config/` directory centralizes all configuration files:

- **eslint.config.js**: ESLint rules and settings
- **postcss.config.js**: PostCSS plugins and configuration
- **tailwind.config.js**: Tailwind CSS customization
- **vitest.config.ts**: Testing framework configuration

## 📜 Scripts Directory

The `scripts/` directory contains utility scripts organized by purpose:

- **deployment/**: Scripts for deployment processes
- **utilities/**: General utility scripts (health checks, Docker helpers)

## 📚 Documentation Structure

The `docs/` directory provides comprehensive documentation:

- **api/**: API endpoint documentation
- **architecture/**: System architecture and design decisions
- **deployment/**: Deployment guides and configurations
- **development/**: Development setup and guidelines

## 🎨 Shared Resources

### Components (`src/shared/components/`)

Reusable UI components used across multiple features:

- ErrorBoundary
- Loading
- ThemeToggle
- ParticlesBackground

### Hooks (`src/shared/hooks/`)

Custom React hooks for common functionality:

- useDebounce
- useIntersectionObserver
- useLocalStorage
- useTheme

### Utils (`src/shared/utils/`)

Utility functions and helpers:

- Error tracking
- Performance monitoring
- Logger utilities
- Redis integration

## 🏗️ TypeScript Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Instead of relative imports
import { ErrorBoundary } from '../../../shared/components/ErrorBoundary';

// Use clean aliases
import { ErrorBoundary } from '@/shared/components';
```

Available aliases:

- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/features/*` → `src/features/*`
- `@/shared/*` → `src/shared/*`
- `@/hooks/*` → `src/hooks/*`
- `@/utils/*` → `src/utils/*`
- `@/types/*` → `src/types/*`
- `@/config/*` → `src/config/*`
- `@/constants/*` → `src/constants/*`
- `@/data/*` → `src/data/*`
- `@/assets/*` → `src/assets/*`
- `@/styles/*` → `src/styles/*`

## 📦 Module Exports

Each directory includes an `index.ts` file for clean exports:

```typescript
// features/index.ts
export * from './hero';
export * from './about';
export * from './skills';
// ... other features

// shared/index.ts
export * from './components';
export * from './hooks';
export * from './utils';
// ... other shared modules
```

## 🔄 Benefits of This Structure

1. **Scalability**: Easy to add new features without affecting existing code
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: Shared components and utilities
4. **Developer Experience**: Clean imports and intuitive organization
5. **Testing**: Isolated features are easier to test
6. **Documentation**: Comprehensive and organized documentation

## 🚀 Getting Started

To work with this structure:

1. **Adding a new feature**: Create a new directory in `src/features/`
2. **Adding shared utilities**: Place in appropriate `src/shared/` subdirectory
3. **Configuration changes**: Update files in `config/` directory
4. **Documentation**: Add relevant docs in `docs/` directory

This structure follows industry best practices and scales well as the project grows.
