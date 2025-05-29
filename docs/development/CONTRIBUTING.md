# Contributing to Mayur Chavhan Portfolio

Thank you for your interest in contributing to this portfolio website! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a professional environment

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- Git
- Basic knowledge of React, TypeScript, and modern web development

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Run tests to ensure everything works**
   ```bash
   npm run test:run
   ```

## 📝 Development Guidelines

### Code Style

We use automated tools to maintain code quality:

- **ESLint**: For code linting and best practices
- **Prettier**: For consistent code formatting
- **TypeScript**: For type safety
- **Husky**: For pre-commit hooks

#### Running Code Quality Checks

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check
```

### Commit Guidelines

We follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(components): add new loading spinner component"
git commit -m "fix(api): handle network timeout errors"
git commit -m "docs(readme): update installation instructions"
```

### Branch Naming

Use descriptive branch names:

- `feature/component-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/section-name` - Documentation updates
- `refactor/module-name` - Code refactoring

## 🧪 Testing

### Writing Tests

- Write tests for all new features and bug fixes
- Use React Testing Library for component tests
- Follow the existing test patterns
- Aim for good test coverage (80%+)

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/utils';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    render(<YourComponent />);
    // Test user interactions
  });
});
```

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run all tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- YourComponent.test.tsx
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ComponentName.tsx
│   └── ComponentName.test.tsx
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── config/             # Configuration files
├── constants/          # Application constants
└── test/               # Test utilities
```

### Component Guidelines

- Use functional components with hooks
- Follow the single responsibility principle
- Add proper TypeScript types
- Include comprehensive tests
- Document complex logic with comments

### File Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` (prefixed with `use`)
- Utils: `camelCase.ts`
- Tests: `ComponentName.test.tsx`
- Types: `types.ts` or inline with components

## 🐳 Docker Development

### Development with Docker

```bash
# Start development environment
docker-compose --profile dev up

# Start production environment
docker-compose --profile prod up

# View logs
docker-compose logs -f portfolio-dev
```

### Docker Guidelines

- Test both development and production Docker builds
- Ensure health checks pass
- Verify environment variables work correctly
- Test with Redis enabled and disabled

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows our guidelines**

   ```bash
   npm run lint
   npm run format:check
   npm run type-check
   npm run test:run
   ```

2. **Update documentation if needed**

   - Update README.md for new features
   - Add JSDoc comments for complex functions
   - Update environment variable documentation

3. **Test thoroughly**
   - Test in development mode
   - Test production build
   - Test with Docker
   - Verify responsive design

### Pull Request Template

When creating a pull request, include:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing

- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Tested in development mode
- [ ] Tested production build
- [ ] Tested with Docker

## Screenshots (if applicable)

Add screenshots for UI changes

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Verify functionality works as expected
4. **Documentation**: Ensure documentation is updated

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Environment information**

   - OS and version
   - Browser and version
   - Node.js version
   - Docker version (if applicable)

2. **Steps to reproduce**

   - Clear, numbered steps
   - Expected vs actual behavior
   - Screenshots or videos if helpful

3. **Additional context**
   - Error messages
   - Console logs
   - Network requests (if relevant)

### Feature Requests

For feature requests, include:

1. **Problem description**

   - What problem does this solve?
   - Who would benefit from this feature?

2. **Proposed solution**

   - Detailed description of the feature
   - How should it work?
   - Any design considerations?

3. **Alternatives considered**
   - Other solutions you've considered
   - Why this approach is preferred

## 📚 Resources

### Learning Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://typescriptlang.org/docs)
- [Testing Library Docs](https://testing-library.com/docs)
- [Vite Guide](https://vitejs.dev/guide)

### Project-Specific Resources

- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 💬 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: mayur@example.com for direct contact

## 🎉 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for contributing to make this portfolio website better! 🚀
