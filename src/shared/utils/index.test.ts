import {
  capitalize,
  cn,
  debounce,
  formatDate,
  formatFileSize,
  generateId,
  getContrastColor,
  isBrowser,
  isValidEmail,
  safeJsonParse,
  sleep,
  storage,
  throttle,
} from '@/shared/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('filters out falsy values', () => {
      expect(cn('class1', null, undefined, false, 'class2')).toBe(
        'class1 class2'
      );
    });

    it('handles empty input', () => {
      expect(cn()).toBe('');
    });
  });

  describe('debounce', () => {
    it('delays function execution', async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(150);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls', async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      await sleep(150);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('limits function calls', async () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(150);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date);
      expect(formatted).toContain('December');
      expect(formatted).toContain('25');
      expect(formatted).toContain('2023');
    });

    it('handles string input', () => {
      const formatted = formatDate('2023-12-25');
      expect(formatted).toContain('December');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('HELLO');
      expect(capitalize('')).toBe('');
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^id-/);
    });

    it('uses custom prefix', () => {
      const id = generateId('test');
      expect(id).toMatch(/^test-/);
    });
  });

  describe('isBrowser', () => {
    it('returns true in test environment', () => {
      expect(isBrowser()).toBe(true);
    });
  });

  describe('safeJsonParse', () => {
    it('parses valid JSON', () => {
      const result = safeJsonParse('{"key": "value"}', {});
      expect(result).toEqual({ key: 'value' });
    });

    it('returns fallback for invalid JSON', () => {
      const fallback = { default: true };
      const result = safeJsonParse('invalid json', fallback);
      expect(result).toBe(fallback);
    });
  });

  describe('storage utilities', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('stores and retrieves values', () => {
      const testData = { test: 'value' };
      storage.set('test-key', testData);
      const retrieved = storage.get('test-key', {});
      expect(retrieved).toEqual(testData);
    });

    it('returns fallback for missing keys', () => {
      const fallback = { default: true };
      const result = storage.get('missing-key', fallback);
      expect(result).toBe(fallback);
    });

    it('removes values', () => {
      storage.set('test-key', 'value');
      storage.remove('test-key');
      const result = storage.get('test-key', 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('formats file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
    });
  });

  describe('getContrastColor', () => {
    it('returns correct contrast colors', () => {
      expect(getContrastColor('#ffffff')).toBe('#000000');
      expect(getContrastColor('#000000')).toBe('#ffffff');
      expect(getContrastColor('ffffff')).toBe('#000000'); // without #
    });
  });

  describe('sleep', () => {
    it('waits for specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(90); // Allow some tolerance
    });
  });
});
