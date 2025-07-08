/**
 * Lighthouse CI Configuration
 *
 * Configures Lighthouse CI for automated performance and accessibility auditing
 * of the Illinois Violence Prevention Project (ICJIA VPP 2025).
 *
 * This configuration enforces:
 * - Performance budgets per project guidelines (<250KB bundle, <1.8s FCP, etc.)
 * - WCAG 2.1 AA accessibility compliance
 * - Core Web Vitals monitoring
 * - Automated regression detection
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 * @author Illinois Criminal Justice Information Authority
 * @license MIT
 */

module.exports = {
  ci: {
    // Build configuration
    collect: {
      // Static site directory after build
      staticDistDir: "./.output/public",

      // URLs to audit (will be served from staticDistDir)
      url: [
        "http://localhost/index.html",
        "http://localhost/plan/index.html",
        "http://localhost/plan/executive-summary/index.html",
        "http://localhost/plan/introduction/index.html",
        "http://localhost/plan/goals/index.html",
        "http://localhost/plan/implementation/index.html",
        "http://localhost/accessibility/index.html",
      ],

      // Number of runs per URL for more reliable results
      numberOfRuns: 3,

      // Chrome settings for consistent testing
      settings: {
        // Emulate mobile device for mobile-first testing
        emulatedFormFactor: "mobile",

        // Throttling settings to simulate 4G connection
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
        },

        // Skip certain audits that aren't relevant for static sites
        skipAudits: ["uses-http2", "canonical"],
      },
    },

    // Performance and accessibility assertions
    assert: {
      // Performance budgets per project guidelines
      assertions: {
        // Core Web Vitals targets
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }], // <2.5s
        "first-contentful-paint": ["error", { maxNumericValue: 1800 }], // <1.8s on 4G
        "speed-index": ["error", { maxNumericValue: 3500 }], // <3.5s TTI equivalent
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }], // <0.1
        "max-potential-fid": ["error", { maxNumericValue: 100 }], // <100ms FID (legacy)

        // Performance scores
        "categories:performance": ["error", { minScore: 0.9 }], // 90+ performance score
        "categories:accessibility": ["error", { minScore: 1.0 }], // 100% accessibility (WCAG 2.1 AA)
        "categories:best-practices": ["error", { minScore: 0.9 }], // 90+ best practices
        "categories:seo": ["error", { minScore: 0.9 }], // 90+ SEO score

        // Resource budgets
        "resource-summary:document:size": ["error", { maxNumericValue: 50000 }], // 50KB HTML
        "resource-summary:stylesheet:size": [
          "error",
          { maxNumericValue: 100000 },
        ], // 100KB CSS
        "resource-summary:script:size": ["error", { maxNumericValue: 250000 }], // 250KB JS (compressed)
        "resource-summary:image:size": ["error", { maxNumericValue: 500000 }], // 500KB images
        "resource-summary:font:size": ["error", { maxNumericValue: 200000 }], // 200KB fonts

        // Accessibility requirements (WCAG 2.1 AA compliance)
        "color-contrast": "error", // Color contrast ratios
        "heading-order": "error", // Proper heading hierarchy
        "html-has-lang": "error", // HTML lang attribute
        "image-alt": "error", // Alt text for images
        label: "error", // Form labels
        "link-name": "error", // Link accessibility names
        "meta-viewport": "error", // Viewport meta tag
        "button-name": "error", // Button accessibility names
        "aria-allowed-attr": "error", // Valid ARIA attributes
        "aria-required-attr": "error", // Required ARIA attributes
        "aria-valid-attr-value": "error", // Valid ARIA values
        "aria-valid-attr": "error", // Valid ARIA attributes
        bypass: "error", // Skip navigation links
        "document-title": "error", // Page titles
        "duplicate-id-aria": "error", // Unique ARIA IDs
        "duplicate-id-active": "error", // Unique active element IDs
        "focus-traps": "error", // Focus management
        "focusable-controls": "error", // Focusable controls
        "interactive-element-affordance": "error", // Interactive element styling
        "logical-tab-order": "error", // Logical tab order
        "managed-focus": "error", // Focus management
        "offscreen-content-hidden": "error", // Hidden offscreen content
        "use-landmarks": "error", // Landmark regions
        "valid-lang": "error", // Valid language codes

        // Performance best practices
        "unused-css-rules": ["warn", { maxLength: 10 }], // Minimize unused CSS
        "unused-javascript": ["warn", { maxLength: 10 }], // Minimize unused JS
        "modern-image-formats": "warn", // Use WebP/AVIF
        "efficient-animated-content": "warn", // Optimize animations
        "preload-lcp-image": "warn", // Preload LCP image
        "total-byte-weight": ["error", { maxNumericValue: 1600000 }], // 1.6MB total

        // Security and best practices
        "is-on-https": "error", // HTTPS usage
        "external-anchors-use-rel-noopener": "error", // Secure external links
        "no-vulnerable-libraries": "error", // No vulnerable dependencies
        "csp-xss": "warn", // Content Security Policy
      },
    },

    // Upload configuration (for CI/CD integration)
    upload: {
      // Target can be 'temporary-public-storage', 'lhci', or custom server
      target: "temporary-public-storage",

      // GitHub integration (if running in GitHub Actions)
      githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN,
      githubToken: process.env.GITHUB_TOKEN,
    },

    // Server configuration (if using LHCI server)
    server: {
      // Uncomment and configure if using dedicated LHCI server
      // port: 9001,
      // storage: {
      //   storageMethod: 'sql',
      //   sqlDialect: 'sqlite',
      //   sqlDatabasePath: './lhci.db'
      // }
    },
  },
};
