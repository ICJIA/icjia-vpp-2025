# Violence Prevention Plan for Illinois: 2025-2029

A modern web application built with Nuxt 3, Vue 3, and Vuetify 3 for the Illinois Criminal Justice Information Authority.

## Project Overview

This project serves as the official web presence for the Violence Prevention Plan for Illinois: 2025-2029. It features:

- Modern, responsive design using Vuetify 3 components
- Accessibility-first development approach (WCAG 2.1 AA compliant)
- Comprehensive documentation for developers and users
- Subtle animations with reduced motion support
- Dark/light theme with persistent user preferences

## Setup

Make sure to install the dependencies:

```bash
# Using Yarn (recommended)
yarn install

# Using npm
npm install
```

## Development Server

Start the development server on http://localhost:8000 (automatically opens in browser):

```bash
# Using Yarn
yarn dev

# Using npm
npm run dev
```

## Production Build

Generate a static site for production:

```bash
# Using Yarn
yarn generate

# Using npm
npm run generate
```

Build the application for server-side rendering:

```bash
# Using Yarn
yarn build

# Using npm
npm run build
```

Locally preview production build:

```bash
# Using Yarn
yarn preview

# Using npm
npm run preview
```

## Testing

The project includes a comprehensive test suite using Vitest and Vue Test Utils:

```bash
# Run all tests
yarn test

# Run tests in watch mode during development
yarn test:watch

# Run tests with coverage report
yarn test:coverage
```

## Audit Logs

This project maintains detailed audit logs to track all significant changes made to the codebase. The audit logs serve as chronological records providing transparency and accountability for external reviewers and future developers.

- [Project Audit Log](./audit-log-project.md)  Tracks all development changes, features, and improvements
- [Accessibility Audit Log](./audit-log-accessibility.md)  Documents accessibility assessments and compliance status

## Development Practices

### Code Documentation

The project follows strict documentation standards to ensure maintainability and knowledge transfer:

- Comprehensive JSDoc comments for all components, composables, and functions
- Detailed inline comments explaining complex logic
- CSS documentation explaining the purpose of style rules
- Accessibility considerations documented throughout the codebase
- Usage examples for reusable components and composables

### VueUse Integration

The project leverages [VueUse](https://vueuse.org/) composables for common functionality:

- `useLocalStorage` for persistent state management
- Timing utilities for animations and interactions
- DOM utilities for event handling and element interactions
- Sensor hooks for responsive design

### Console Logging

During development, the project uses a custom console logging system:

- Color-coded logs for different categories (UI, API, routes, etc.)
- Global enable/disable functionality
- Development-only console logger component
- Automatic disabling in production

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Accessibility

The Violence Prevention Plan for Illinois: 2025-2029 is committed to providing an accessible experience for all users. The project targets WCAG 2.1 AA compliance as its primary standard, with many aspects exceeding AA requirements.

### Key Accessibility Features

- Skip-to-content functionality for keyboard users
- Proper semantic structure with appropriate ARIA landmarks
- Keyboard navigation for all interactive elements
- High contrast ratios (minimum 4.5:1, with many elements exceeding 7:1)
- Screen reader announcements for dynamic content
- Support for reduced motion preferences
- Consistent focus management across all components
- Accessible image loading with proper ARIA attributes
- Comprehensive JSDoc documentation of accessibility features

### Developer Documentation

The codebase includes comprehensive JSDoc comments and inline documentation that explain:

- How accessibility features are implemented
- The purpose of ARIA attributes and roles
- Reduced motion accommodations for animations
- Screen reader considerations for dynamic content
- Focus management techniques
- Color contrast requirements

This documentation helps ensure that future development maintains the project's high accessibility standards.

### Accessibility Resources

- [Accessibility Documentation](./accessibility-documentation.md): User guide to accessibility features
- [Accessibility Audit Log](./audit-log-accessibility.md): Technical assessment of compliance status

These resources are also available as HTML pages directly accessible via URL:
- `/accessibility-documentation.html`: User-facing documentation
- `/audit-log-accessibility.html`: Technical audit log
