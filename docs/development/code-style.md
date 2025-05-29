# Code Style Guide

This document outlines the coding standards and conventions for the portfolio website project.

## 📋 General Principles

1. **Consistency**: Follow established patterns throughout the codebase
2. **Readability**: Write code that is easy to read and understand
3. **Maintainability**: Structure code for easy maintenance and updates
4. **Performance**: Consider performance implications of coding decisions
5. **Accessibility**: Ensure code supports accessibility requirements

## 🎯 TypeScript Guidelines

### File Naming

```
// Components (PascalCase)
HeroSection.tsx
AboutSection.tsx
ErrorBoundary.tsx

// Hooks (camelCase with 'use' prefix)
useTheme.ts
useLocalStorage.ts
useDebounce.ts

// Utilities (camelCase)
errorTracking.ts
performance.ts
logger.ts

// Types (camelCase)
index.ts
api.ts
common.ts

// Constants (camelCase)
index.ts
navigation.ts
```

### Variable Naming

```typescript
// Use camelCase for variables and functions
const userName = 'john_doe';
const isAuthenticated = true;
const handleSubmit = () => {};

// Use PascalCase for components and classes
const UserProfile = () => {};
class ApiClient {}

// Use SCREAMING_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// Use descriptive names
// ❌ Bad
const d = new Date();
const u = users.filter(x => x.active);

// ✅ Good
const currentDate = new Date();
const activeUsers = users.filter(user => user.isActive);
```

### Type Definitions

```typescript
// Define interfaces for component props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Use generic types when appropriate
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Prefer interfaces over types for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Use types for unions and computed types
type Theme = 'light' | 'dark';
type UserKeys = keyof User;
```

### Function Declarations

```typescript
// Use arrow functions for simple functions
const add = (a: number, b: number): number => a + b;

// Use function declarations for complex functions
function processUserData(users: User[]): ProcessedUser[] {
  // Complex logic here
  return users.map(user => ({
    ...user,
    displayName: `${user.firstName} ${user.lastName}`,
  }));
}

// Use async/await instead of promises
// ❌ Bad
function fetchUser(id: string) {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => data.user);
}

// ✅ Good
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data.user;
}
```

## ⚛️ React Guidelines

### Component Structure

```typescript
// 1. Imports (external libraries first, then internal)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useTheme } from '@/shared/hooks';
import { Button } from '@/shared/components';
import { User } from '@/shared/types';

// 2. Types and interfaces
interface ComponentProps {
  user: User;
  onUpdate: (user: User) => void;
}

// 3. Component implementation
const UserProfile: React.FC<ComponentProps> = ({ user, onUpdate }) => {
  // 4. Hooks (state first, then effects)
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Effect logic
  }, [user.id]);

  // 5. Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Save logic
    setIsEditing(false);
  };

  // 6. Render
  return (
    <div className="user-profile">
      {/* Component JSX */}
    </div>
  );
};

// 7. Export
export default UserProfile;
```

### JSX Guidelines

```typescript
// Use semantic HTML elements
<main>
  <section>
    <h1>Page Title</h1>
    <article>Content</article>
  </section>
</main>

// Break long attribute lists
<Button
  variant="primary"
  size="large"
  disabled={isLoading}
  onClick={handleSubmit}
  className="w-full mt-4"
>
  Submit Form
</Button>

// Use fragments to avoid unnecessary divs
<>
  <Header />
  <Main />
  <Footer />
</>

// Conditional rendering patterns
// ❌ Bad
{isVisible && <Component />}

// ✅ Good (when you need to handle falsy values)
{isVisible ? <Component /> : null}

// ✅ Good (for simple boolean conditions)
{isVisible && <Component />}

// ✅ Good (for multiple conditions)
{isLoading ? (
  <Loading />
) : error ? (
  <Error message={error.message} />
) : (
  <Content data={data} />
)}
```

### Hooks Guidelines

```typescript
// Custom hooks should start with 'use'
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};

// Use dependency arrays correctly
useEffect(() => {
  // Effect with dependencies
}, [dependency1, dependency2]);

useEffect(() => {
  // Effect that runs once
}, []);

// Use useCallback for event handlers passed to children
const handleClick = useCallback(
  (id: string) => {
    onItemClick(id);
  },
  [onItemClick]
);
```

## 🎨 CSS/Styling Guidelines

### Tailwind CSS Classes

```typescript
// Group related classes
<div className="
  flex items-center justify-between
  p-4 m-2
  bg-white dark:bg-gray-900
  border border-gray-200 dark:border-gray-700
  rounded-lg shadow-sm
">

// Use responsive prefixes consistently
<div className="
  grid
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
  gap-4 sm:gap-6 lg:gap-8
">

// Prefer Tailwind utilities over custom CSS
// ❌ Bad
<div style={{ marginTop: '16px', color: '#3B82F6' }}>

// ✅ Good
<div className="mt-4 text-blue-500">
```

### CSS Custom Properties

```css
/* Use CSS custom properties for theme values */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --spacing-unit: 0.25rem;
}

.dark {
  --color-primary: #60a5fa;
  --color-secondary: #9ca3af;
}
```

## 📁 File Organization

### Import Order

```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// 2. Internal imports (features)
import { HeroSection } from '@/features/hero';
import { AboutSection } from '@/features/about';

// 3. Shared imports
import { useTheme, useLocalStorage } from '@/shared/hooks';
import { ErrorBoundary, Loading } from '@/shared/components';
import { User, ApiResponse } from '@/shared/types';

// 4. Relative imports
import './Component.css';
```

### Export Patterns

```typescript
// Named exports for utilities
export const formatDate = (date: Date) => {};
export const validateEmail = (email: string) => {};

// Default export for components
const Component: React.FC = () => {};
export default Component;

// Re-exports in index files
export { default as HeroSection } from './HeroSection';
export { default as AboutSection } from './AboutSection';
export * from './types';
```

## 🧪 Testing Guidelines

### Test File Naming

```
Component.test.tsx
utils.test.ts
hooks.test.ts
```

### Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-blue-600');
  });
});
```

## 📝 Documentation Guidelines

### Component Documentation

````typescript
/**
 * Button component with multiple variants and sizes
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="large" onClick={handleClick}>
 *   Submit Form
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Button variant affecting color scheme */
  variant: 'primary' | 'secondary' | 'danger';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Click event handler */
  onClick?: () => void;
  /** Button content */
  children: React.ReactNode;
}
````

### Function Documentation

````typescript
/**
 * Formats a date string for display
 *
 * @param date - The date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date(), { year: 'numeric', month: 'long' })
 * // Returns: "January 2024"
 * ```
 */
export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  // Implementation
};
````

## 🔧 Linting and Formatting

### ESLint Configuration

The project uses ESLint with TypeScript and React rules:

```javascript
// config/eslint.config.js
export default [
  {
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🚀 Performance Guidelines

1. **Use React.memo** for components that receive stable props
2. **Implement useCallback** for event handlers passed to children
3. **Use useMemo** for expensive calculations
4. **Lazy load** components that aren't immediately needed
5. **Optimize images** and use appropriate formats
6. **Minimize bundle size** by importing only what you need

## ✅ Code Review Checklist

- [ ] Code follows naming conventions
- [ ] TypeScript types are properly defined
- [ ] Components are properly structured
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Performance considerations are addressed
- [ ] Accessibility requirements are met
- [ ] Error handling is implemented

Following these guidelines ensures consistent, maintainable, and high-quality code across the project.
