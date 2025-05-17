# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Illinois Violent Prevention Project is a modern web application built with Nuxt 3, Vue 3, and Vuetify 3 for the Illinois Criminal Justice Information Authority. The project follows Nuxt 3 conventions and leverages the Vue 3 Composition API with TypeScript support.

## Core Technologies

- **Framework**: Nuxt 3
- **UI Library**: Vuetify 3
- **State Management**: Vue 3 Composition API
- **Styling**: SCSS + Vuetify theming
- **Content Management**: @nuxt/content
- **Testing**: Vitest + JSDOM

## Development Commands

### Setup & Installation

```bash
# Using Yarn (recommended)
yarn install

# Using npm
npm install
```

### Development Server

```bash
# Using Yarn
yarn dev  # Starts dev server on http://localhost:8000 and auto-opens browser

# Using npm
npm run dev
```

### Building & Deployment

```bash
# Generate static site (for static hosting)
yarn generate
npm run generate

# Generate and preview static site locally
yarn generate:serve
npm run generate:serve

# Build for SSR deployment
yarn build
npm run build

# Preview SSR build locally
yarn preview
npm run preview
```

### Testing

```bash
# Run all tests
yarn test
npm run test

# Run tests in watch mode
yarn test:watch
npm run test:watch

# Run tests with coverage
yarn test:coverage
npm run test:coverage
```

## Key Architecture Patterns

### Project Structure

The project follows standard Nuxt 3 directory structure:
- `components/`: Vue components (auto-imported)
- `layouts/`: Page layouts including default layout with theme handling
- `pages/`: Application routes with proper meta information
- `plugins/`: Vuetify setup and theme handling plugins
- `assets/`: SCSS styles and other assets
- `public/`: Static files served at root path

### Theme Handling

The application implements a light/dark theme system with the following characteristics:

1. **Theme Configuration**: Defined in `plugins/vuetify.ts` with custom color palettes
2. **Theme Persistence**: User preferences saved to localStorage
3. **SSR Compatibility**: Client-only theme detection to prevent flash of wrong theme
4. **Accessibility**: Proper ARIA attributes and tooltips for theme toggle

Key files:
- `components/content/ThemeSwitch.vue`: Theme toggle component with accessibility features
- `layouts/default.vue`: Theme state management and persistence
- `plugins/theme-handler.client.js`: Client-side initialization to prevent theme flash

### Image Loading

The application uses a custom ImageWithSpinner component to improve user experience during image loading:

- `components/content/ImageWithSpinner.vue`: Wrapper for Vuetify's v-img with loading indicator

## Testing Approach

The project uses Vitest for testing Vue components and plugins:

- Component rendering and functionality tests
- Plugin behavior tests
- Proper mocking of browser APIs (localStorage, DOM)
- Theme switching functionality tests

## Audit Log

The project maintains a detailed audit log in `audit-log-vpp.md` that tracks all significant changes to the codebase, providing transparency and accountability for external reviewers and future developers.

## Common Patterns to Follow

1. **Component Structure**: Use Vue 3 Composition API with `<script setup>` syntax
2. **Accessibility**: Ensure all interactive elements have proper ARIA attributes and tooltips
3. **Responsive Design**: Use Vuetify's responsive utilities for different screen sizes
4. **Theme Awareness**: Components should respect both light and dark themes
5. **Testing**: Add tests for new components and functionality using the existing test patterns

## License

This project is licensed under the MIT License - see the LICENSE file for details.