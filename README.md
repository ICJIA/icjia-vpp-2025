# Illinois Violent Prevention Project 2025

A modern web application built with Nuxt 3, Vue 3, and Vuetify 3 for the Illinois Criminal Justice Information Authority.

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

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Accessibility

The Illinois Violent Prevention Project is committed to providing an accessible experience for all users. The project follows WCAG 2.1 AAA compliance standards, which is higher than the commonly implemented AA standard.

### Key Accessibility Features

- Skip-to-content functionality for keyboard users
- Proper semantic structure with appropriate ARIA landmarks
- Keyboard navigation for all interactive elements
- High contrast ratio (8:1) exceeding WCAG AAA requirements
- Screen reader announcements for dynamic content
- Support for reduced motion preferences
- Consistent focus management across all components

### Accessibility Resources

- [Accessibility Documentation](./accessibility-documentation.md): User guide to accessibility features
- [Accessibility Audit Log](./audit-log-accessibility.md): Technical assessment of compliance status

These resources are also available as HTML pages directly accessible via URL:
- `/accessibility-documentation.html`: User-facing documentation
- `/audit-log-accessibility.html`: Technical audit log
