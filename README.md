# Violence Prevention Plan for Illinois: 2025-2029

The first Statewide Violence Prevention Plan, for 2020-2024, was released in 2021. Since then, a
variety of implementation, research, and activities have taken place. The Ad Hoc Violence Prevention
Committee and its workgroups reviewed these activities, reports, and research, discussing ways in
which this work could be used to inform the next violence prevention plan, collectively writing the
2025-2029 goals and recommendations.

## Project Overview

This project serves as the official web presence for the Violence Prevention Plan for Illinois: 2025-2029. It features:

- Modern, responsive design using Vuetify 3 components
- Accessibility-first development approach (WCAG 2.1 AA compliant)
- Dynamic content rendering with Nuxt Content
- Comprehensive documentation for developers and users
- Subtle animations with reduced motion support
- Dark/light theme with persistent user preferences
- Full-text search functionality across all content

## Dev Site

The development version of this site is available at:

**[https://vpp-2025.netlify.app](https://vpp-2025.netlify.app)**

This development site is automatically updated with the latest changes from the main branch and serves as a preview environment before production deployment.

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

This command will:
1. Generate accessibility documentation HTML files
2. Create a fresh search index based on the latest content
3. Build the static site with Nuxt

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

### Project Structure

The project follows a structured organization pattern:

- **Pages**: Follows the same structure as the content directory for proper routing
  - `/pages/projects/` contains pages that render content from `/content/projects/`
  - This alignment ensures proper Vue Router navigation and content fetching
- **Content**: Organized in a hierarchical structure that matches the routing
  - `/content/projects/` contains markdown files for project-related pages
  - Content files include frontmatter for metadata (title, description, etc.)
- **Components**: Reusable UI elements organized by function
  - `ContentDisplay.vue` provides a standardized way to render markdown content
  - `ImageWithSpinner.vue` handles image loading with accessibility features

### Content Management

The project uses Nuxt Content for dynamic content rendering:

- Markdown files in the `/content` directory are automatically available as routes
- Content is fetched using the `useContentFetcher` composable
- Dynamic rendering with proper loading states and error handling
- Fallback content displayed when content fetching fails
- SEO metadata derived from content frontmatter
- Search functionality with automatically generated search index

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

The project uses a custom console logging system:

- Color-coded logs for different categories (UI, API, routes, etc.)
- Global enable/disable functionality
- Interactive console logger component
- Detailed state information for debugging

**Note:** Console logging is currently enabled in all environments (including production) during the pre-launch phase for monitoring and debugging purposes. This will be revisited before the official launch.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Accessibility

The Violence Prevention Plan for Illinois: 2025-2029 is committed to providing an accessible experience for all users. The project targets WCAG 2.1 AA compliance as its primary standard, with many aspects exceeding AA requirements.

### Current Accessibility Compliance Status

Our project maintains excellent WCAG 2.1 AA compliance across all implemented components. Recent accessibility assessments confirm that:

- All components meet or exceed WCAG 2.1 AA standards
- Many elements exceed AA requirements, approaching AAA levels where feasible
- All interactive elements are fully keyboard accessible with visible focus states
- All content maintains proper color contrast ratios (minimum 4.5:1, with many elements exceeding 7:1)
- The site is fully compatible with major screen readers and assistive technologies
- Specialized accessibility components ensure consistent behavior across the application

### Key Accessibility Features

- Skip-to-content functionality for keyboard users
- Proper semantic structure with appropriate ARIA landmarks and roles
- Keyboard navigation for all interactive elements with visible focus states
- High contrast ratios (minimum 4.5:1, with many elements exceeding 7:1)
- Screen reader announcements for dynamic content using ARIA live regions
- Support for reduced motion preferences via CSS media queries
- Consistent focus management across all components
- Accessible image loading with proper ARIA attributes and loading states
- Accessible tooltips with auto-dismiss functionality on mobile devices
- Comprehensive JSDoc documentation of accessibility features

### Specialized Accessibility Components

- **AccessibleTooltip**: Enhanced tooltips with proper ARIA attributes and mobile auto-dismiss
- **Screen Reader Announcer**: System for announcing dynamic content changes to screen readers
- **Accessibility Documentation Utilities**: Tools for accessing and generating accessibility documentation

### Developer Documentation

The codebase includes comprehensive JSDoc comments and inline documentation that explain:

- How accessibility features are implemented
- The purpose of ARIA attributes and roles
- Reduced motion accommodations for animations
- Screen reader considerations for dynamic content
- Focus management techniques
- Color contrast requirements
- Mobile-specific accessibility considerations

This documentation helps ensure that future development maintains the project's high accessibility standards.

### Accessibility Resources

- [Accessibility Documentation](./accessibility-documentation.md): User guide to accessibility features
- [Accessibility Audit Log](./audit-log-accessibility.md): Technical assessment of compliance status

These resources are also available as HTML pages directly accessible via URL:
- `/accessibility-documentation.html`: User-facing documentation
- `/audit-log-accessibility.html`: Technical audit log
