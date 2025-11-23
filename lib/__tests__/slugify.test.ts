import { slugify, deslugify } from '../slugify';

describe('slugify', () => {
  it('should convert text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
    expect(slugify('Test@#$%^&*()')).toBe('test');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('Hello World Test')).toBe('hello-world-test');
  });

  it('should replace underscores with hyphens', () => {
    expect(slugify('hello_world')).toBe('hello-world');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('-hello-world-')).toBe('hello-world');
    expect(slugify('---hello---')).toBe('hello');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('hello    world')).toBe('hello-world');
  });

  it('should handle empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('should handle special characters only', () => {
    expect(slugify('!@#$%')).toBe('');
  });

  it('should handle mixed case with special characters', () => {
    expect(slugify('Hello, World! This is a Test.')).toBe('hello-world-this-is-a-test');
  });
});

describe('deslugify', () => {
  it('should convert slug back to title case', () => {
    expect(deslugify('hello-world')).toBe('Hello World');
  });

  it('should handle single word', () => {
    expect(deslugify('hello')).toBe('Hello');
  });

  it('should handle multiple words', () => {
    expect(deslugify('hello-world-test')).toBe('Hello World Test');
  });

  it('should handle empty string', () => {
    expect(deslugify('')).toBe('');
  });

  it('should handle single character', () => {
    expect(deslugify('a')).toBe('A');
  });

  it('should handle numbers in slug', () => {
    expect(deslugify('test-123')).toBe('Test 123');
  });
});

