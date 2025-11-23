# Testing Guide

This project uses Jest and React Testing Library for unit testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are organized in `__tests__` directories next to the files they test:

- `lib/__tests__/` - Utility function tests
- `components/__tests__/` - Component tests

## Test Files

### Utility Tests
- `slugify.test.ts` - Tests for slug generation and deslugification
- `utils.test.ts` - Tests for className utility function
- `exportUtils.test.ts` - Tests for data export functions (JSON, CSV, Markdown)

### Component Tests
- `Container.test.tsx` - Tests for Container component
- `DarkModeToggle.test.tsx` - Tests for dark mode toggle functionality

## Writing New Tests

1. Create a `__tests__` directory next to your file
2. Name your test file `*.test.ts` or `*.test.tsx`
3. Import the functions/components you want to test
4. Use Jest and React Testing Library APIs

## Example Test

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Configuration

- Jest config: `jest.config.js`
- Test setup: `jest.setup.js`
- Uses `jest-environment-jsdom` for DOM testing
- Mocks Next.js router and Clerk authentication

