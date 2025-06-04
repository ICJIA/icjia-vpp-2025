# Statewide Violence Prevention Plan for Illinois: 2025-2029

The first Statewide Violence Prevention Plan, for 2020-2024, was released in 2021. Since then, a
variety of implementation, research, and activities have taken place. The Ad Hoc Violence Prevention
Committee and its workgroups reviewed these activities, reports, and research, discussing ways in
which this work could be used to inform the next violence prevention plan, collectively writing the
2025-2029 goals and recommendations.

## Project Overview

This project serves as the official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029. It features:

- Modern, responsive design using Vuetify 3 components
- Accessibility-first development approach (WCAG 2.1 AA compliant)
- Dynamic content rendering with Nuxt Content
- Comprehensive documentation for developers and users
- Subtle animations with reduced motion support
- Dark/light theme with persistent user preferences
- Full-text search functionality across all content with Defuddle-enhanced content extraction




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
# Using Yarn (recommended)
yarn dev

# Using npm
npm run dev
```

## Production Build

Generate a static site for production:

```bash
# Using Yarn (recommended)
yarn generate

# Using npm
npm run generate
```

### Verbose and Quiet Builds

The project now supports configurable logging levels for all build operations:

```bash
# Detailed logging (DETAILED level)
yarn dev:verbose
yarn build:verbose
yarn generate:verbose

# Minimal logging (CONCISE level)
yarn dev:quiet
yarn build:quiet
yarn generate:quiet
```



Build the application for server-side rendering:

```bash
# Using Yarn (recommended)
yarn build

# Using npm
npm run build
```

Locally preview production build:

```bash
# Using Yarn (recommended)
yarn preview

# Using npm
npm run preview
```



### Accessibility Resources

- [Accessibility Documentation](/accessibility/documentation): User guide to accessibility features
- [Accessibility Audit Log](/accessibility/audit-log): Technical assessment of compliance status

These resources are available through the Nuxt Content v3 system:
- `/accessibility/documentation`: User-facing documentation
- `/accessibility/audit-log`: Technical audit log
