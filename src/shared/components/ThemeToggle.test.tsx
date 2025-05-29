import { fireEvent, mockLocalStorage, render, screen } from '@/test/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './index';

describe('ThemeToggle', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>;

  beforeEach(() => {
    localStorageMock = mockLocalStorage();
    // Reset document classes
    document.documentElement.classList.remove('dark');

    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false, // Default to light mode
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('renders theme toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label');
  });

  it('shows moon icon in light mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    // Moon icon should be present (we can't easily test the icon itself, but we can test the aria-label)
  });

  it('initializes with saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    render(<ThemeToggle />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('initializes with system preference when no saved theme', () => {
    localStorageMock.getItem.mockReturnValue(null);

    // Mock matchMedia to return dark preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles theme when clicked', () => {
    // Ensure localStorage returns null initially
    localStorageMock.getItem.mockReturnValue(null);

    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    // Wait for initial render to complete
    expect(button).toBeInTheDocument();

    // Initially in light mode (since matchMedia returns false and no saved theme)
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Click to switch to dark mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

    // Click again to switch back to light mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('has proper accessibility attributes', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('applies correct CSS classes', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass(
      'p-2',
      'rounded-full',
      'transition-colors',
      'duration-200'
    );
  });
});
