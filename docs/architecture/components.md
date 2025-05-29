# Component Architecture

This document outlines the component architecture and design patterns used in the portfolio website.

## 🏗️ Component Hierarchy

```
App
├── ErrorBoundary (Shared)
├── Navbar (Feature)
├── Main Content
│   ├── HeroSection (Feature)
│   ├── AboutSection (Feature)
│   ├── SkillsSection (Feature)
│   ├── ProjectsSection (Feature)
│   ├── ExperienceSection (Feature)
│   ├── BlogSection (Feature)
│   └── ContactSection (Feature)
├── Footer (Feature)
└── DevTools (Feature)
```

## 📁 Component Organization

### Feature Components (`src/features/`)

Each feature is self-contained with its own directory:

```
features/
├── hero/
│   ├── HeroSection.tsx
│   ├── index.ts
│   └── types.ts (if needed)
├── about/
│   ├── AboutSection.tsx
│   └── index.ts
└── ...
```

### Shared Components (`src/shared/components/`)

Reusable components used across multiple features:

```
shared/components/
├── ErrorBoundary.tsx
├── Loading.tsx
├── ThemeToggle.tsx
├── ParticlesBackground.tsx
└── index.ts
```

## 🎨 Component Design Patterns

### 1. Functional Components with Hooks

All components use functional components with React hooks:

```typescript
import React, { useState, useEffect } from 'react';

const ExampleComponent: React.FC = () => {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // Side effects
  }, []);

  return <div>{state}</div>;
};

export default ExampleComponent;
```

### 2. TypeScript Props Interface

Each component defines its props interface:

```typescript
interface ComponentProps {
  title: string;
  isVisible?: boolean;
  onAction?: () => void;
}

const Component: React.FC<ComponentProps> = ({
  title,
  isVisible = true,
  onAction,
}) => {
  // Component implementation
};
```

### 3. Custom Hooks Integration

Components leverage custom hooks for shared logic:

```typescript
import { useTheme, useIntersectionObserver } from '@/shared/hooks';

const Component: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div ref={ref} className={theme === 'dark' ? 'dark' : 'light'}>
      {/* Component content */}
    </div>
  );
};
```

## 🔄 State Management

### Local State

Components manage local state using `useState`:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

### Global State

Global state is managed through:

- **Theme**: Custom `useTheme` hook with localStorage persistence
- **Error Tracking**: Context-based error boundary system
- **Performance**: Performance monitoring utilities

### State Lifting

When state needs to be shared between components, it's lifted to the nearest common ancestor:

```typescript
// Parent component manages shared state
const ParentComponent: React.FC = () => {
  const [sharedState, setSharedState] = useState('');

  return (
    <>
      <ChildA state={sharedState} onUpdate={setSharedState} />
      <ChildB state={sharedState} />
    </>
  );
};
```

## 🎭 Component Patterns

### 1. Container/Presentational Pattern

**Container Components** (Smart Components):

- Manage state and side effects
- Handle data fetching
- Contain business logic

**Presentational Components** (Dumb Components):

- Focus on UI rendering
- Receive data via props
- Minimal or no state

### 2. Compound Components

For complex UI patterns:

```typescript
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children }) => <div className="modal-header">{children}</div>;
Modal.Body = ({ children }) => <div className="modal-body">{children}</div>;
Modal.Footer = ({ children }) => <div className="modal-footer">{children}</div>;
```

### 3. Render Props Pattern

For sharing logic between components:

```typescript
interface RenderPropsComponent {
  children: (data: any) => React.ReactNode;
}

const DataProvider: React.FC<RenderPropsComponent> = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data
  }, []);

  return <>{children(data)}</>;
};

// Usage
<DataProvider>
  {data => <div>{data ? 'Loaded' : 'Loading...'}</div>}
</DataProvider>
```

## 🎨 Styling Approach

### Tailwind CSS Classes

Components use Tailwind CSS for styling:

```typescript
const Button: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Responsive Design

All components are built with mobile-first responsive design:

```typescript
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
  p-4
">
  {/* Responsive grid content */}
</div>
```

### Dark Mode Support

Components support dark mode through CSS classes:

```typescript
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  border border-gray-200 dark:border-gray-700
">
  {/* Content adapts to theme */}
</div>
```

## 🔧 Component Testing

### Unit Tests

Each component includes unit tests:

```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const onAction = jest.fn();
    render(<Component onAction={onAction} />);

    // Test interactions
  });
});
```

### Integration Tests

Feature components include integration tests:

```typescript
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

describe('HeroSection Integration', () => {
  it('displays all hero content', () => {
    render(<HeroSection />);

    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByText(/DevOps Engineer/)).toBeInTheDocument();
  });
});
```

## 📊 Performance Optimization

### React.memo

Prevent unnecessary re-renders:

```typescript
const ExpensiveComponent = React.memo<ComponentProps>(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});
```

### useMemo and useCallback

Optimize expensive calculations and function references:

```typescript
const Component: React.FC = ({ items, onSelect }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.value, 0);
  }, [items]);

  const handleSelect = useCallback((id: string) => {
    onSelect(id);
  }, [onSelect]);

  return <div>{/* Component content */}</div>;
};
```

### Lazy Loading

Load components only when needed:

```typescript
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
};
```

## 🚀 Best Practices

1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Error Boundaries**: Wrap components that might fail
4. **Accessibility**: Include ARIA attributes and semantic HTML
5. **Performance**: Use React.memo, useMemo, and useCallback appropriately
6. **Testing**: Write tests for all components
7. **Documentation**: Document complex components and their usage

## 🔄 Component Lifecycle

### Mounting

1. Component initialization
2. Props validation
3. State initialization
4. Effect execution
5. Render

### Updating

1. Props/state change
2. Re-render decision (React.memo)
3. Effect cleanup
4. Re-render
5. Effect execution

### Unmounting

1. Effect cleanup
2. Component removal

This architecture ensures maintainable, scalable, and performant components throughout the application.
