# Testing Guide

This document outlines the testing strategy and best practices for the portfolio website project.

## 🧪 Testing Philosophy

Our testing approach follows the testing pyramid:

1. **Unit Tests** (70%): Test individual components and functions
2. **Integration Tests** (20%): Test component interactions
3. **End-to-End Tests** (10%): Test complete user workflows

## 🛠️ Testing Stack

- **Test Runner**: Vitest
- **Testing Library**: React Testing Library
- **Mocking**: Vitest mocks
- **Coverage**: Vitest coverage (v8)
- **UI Testing**: Vitest UI for interactive testing

## 📁 Test File Organization

```
src/
├── features/
│   ├── hero/
│   │   ├── HeroSection.tsx
│   │   ├── HeroSection.test.tsx
│   │   └── index.ts
│   └── about/
│       ├── AboutSection.tsx
│       ├── AboutSection.test.tsx
│       └── index.ts
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useTheme.test.ts
│   │   └── index.ts
│   └── utils/
│       ├── formatDate.ts
│       ├── formatDate.test.ts
│       └── index.ts
└── test/
    ├── setup.ts
    ├── utils.tsx
    └── mocks/
```

## 🎯 Unit Testing

### Component Testing

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-2 py-1');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3');
  });
});
```

### Hook Testing

```typescript
// useTheme.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTheme Hook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('initializes with light theme by default', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });

  it('loads theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('toggles theme correctly', () => {
    localStorageMock.getItem.mockReturnValue('light');

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('sets specific theme', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});
```

### Utility Function Testing

```typescript
// formatDate.test.ts
import { formatDate } from './formatDate';

describe('formatDate Utility', () => {
  it('formats date with default options', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toBe('January 15, 2024');
  });

  it('formats date with custom options', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, {
      year: 'numeric',
      month: 'short',
    });
    expect(result).toBe('Jan 2024');
  });

  it('handles string dates', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBe('January 15, 2024');
  });

  it('handles invalid dates gracefully', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('Invalid Date');
  });
});
```

## 🔗 Integration Testing

### Component Integration

```typescript
// HeroSection.test.tsx
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

// Mock the ParticlesBackground component
vi.mock('@/shared/components/ParticlesBackground', () => ({
  default: () => <div data-testid="particles-background" />,
}));

describe('HeroSection Integration', () => {
  it('renders all hero content', () => {
    render(<HeroSection />);

    // Check for main heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Check for subtitle
    expect(screen.getByText(/DevOps Engineer/)).toBeInTheDocument();

    // Check for CTA buttons
    expect(screen.getByRole('button', { name: /view my work/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /contact me/i })).toBeInTheDocument();

    // Check for particles background
    expect(screen.getByTestId('particles-background')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<HeroSection />);

    const section = screen.getByRole('banner');
    expect(section).toHaveAttribute('aria-label', 'Hero section');
  });
});
```

### Feature Integration

```typescript
// ContactSection.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactSection } from './ContactSection';

// Mock fetch
global.fetch = vi.fn();

describe('ContactSection Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactSection />);

    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there!');

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello there!',
        }),
      });
    });

    // Verify success message
    expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
  });

  it('displays validation errors', async () => {
    const user = userEvent.setup();

    render(<ContactSection />);

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Check for validation errors
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
  });
});
```

## 🎭 Mocking

### Component Mocks

```typescript
// Mock external components
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock custom hooks
vi.mock('@/shared/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
    setTheme: vi.fn(),
  }),
}));
```

### API Mocks

```typescript
// Mock fetch globally
global.fetch = vi.fn();

// Mock specific API responses
const mockApiResponse = (data: any, ok = true) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: async () => data,
  });
};

// Usage in tests
mockApiResponse({ success: true });
```

### Module Mocks

```typescript
// Mock entire modules
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));
```

## 📊 Test Coverage

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### Coverage Goals

- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

## 🚀 Running Tests

### Available Scripts

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Test Patterns

```bash
# Run specific test file
npm run test HeroSection.test.tsx

# Run tests matching pattern
npm run test -- --grep "Button"

# Run tests in specific directory
npm run test src/features/

# Run tests with verbose output
npm run test -- --reporter=verbose
```

## 🔧 Test Utilities

### Custom Render Function

```typescript
// test/utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Add providers if needed
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Test Data Factories

```typescript
// test/factories.ts
export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: '1',
  title: 'Test Project',
  description: 'A test project',
  technologies: ['React', 'TypeScript'],
  ...overrides,
});
```

## 📝 Testing Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
3. **Arrange, Act, Assert**: Structure tests with clear setup, action, and verification phases
4. **Test Edge Cases**: Include tests for error conditions and edge cases
5. **Keep Tests Independent**: Each test should be able to run in isolation
6. **Use Real User Interactions**: Prefer user events over direct function calls
7. **Mock External Dependencies**: Mock APIs, external libraries, and complex dependencies
8. **Maintain Test Data**: Use factories or fixtures for consistent test data

## 🐛 Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode
npm run test -- --inspect-brk

# Run specific test in debug mode
npm run test -- --inspect-brk HeroSection.test.tsx
```

### Console Debugging

```typescript
import { screen, debug } from '@testing-library/react';

it('debugs component output', () => {
  render(<Component />);

  // Print entire DOM
  debug();

  // Print specific element
  debug(screen.getByRole('button'));
});
```

### Visual Debugging

```typescript
// Use data-testid for easier element selection
<button data-testid="submit-button">Submit</button>

// In tests
screen.getByTestId('submit-button');
```

This comprehensive testing strategy ensures reliable, maintainable code and catches issues early in the development process.
