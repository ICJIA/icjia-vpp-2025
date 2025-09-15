# Comprehensive Website Accessibility Audit Prompt

**Date:** September 13, 2025  
**Version:** 1.0  
**Compliance Target:** WCAG 2.1 AA + Government Standards

---

## 🎯 **Audit Objective**

Conduct a comprehensive accessibility evaluation of the provided website to ensure full WCAG 2.1 AA compliance, with special emphasis on government/public sector requirements. Provide actionable remediation strategies and implementation guidance.

---

## 📋 **Pre-Audit Setup**

### **Required Tools Installation**

```bash
# Automated Testing Tools
npm install -g @axe-core/cli
npm install @axe-core/puppeteer axe-core puppeteer

# Additional Testing Dependencies
npm install pa11y lighthouse-cli
```

### **Testing Environment**

- **Browsers**: Chrome, Firefox, Safari, Edge
- **Viewports**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **Assistive Technology**: Screen readers (NVDA, JAWS, VoiceOver)
- **Network Conditions**: Test on slow connections (3G simulation)

---

## 🔍 **Comprehensive Audit Methodology**

### **Phase 1: Automated Testing (Foundation)**

#### **1.1 Axe-core Analysis**

```javascript
// Comprehensive Axe-core test script
const { AxePuppeteer } = require("@axe-core/puppeteer");
const puppeteer = require("puppeteer");

const auditPage = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const results = await new AxePuppeteer(page)
    .configure({
      rules: {
        "color-contrast": { enabled: true },
        "keyboard-navigation": { enabled: true },
        "focus-order-semantics": { enabled: true },
      },
    })
    .analyze();

  return results;
};
```

**Test Coverage:**

- All public pages and user flows
- Dynamic content and interactive elements
- Form submissions and error states
- Modal dialogs and overlays

#### **1.2 Google Lighthouse Audit**

```bash
lighthouse [URL] --only-categories=accessibility --output=json --output-path=./lighthouse-report.json
```

#### **1.3 Pa11y Command Line Testing**

```bash
pa11y [URL] --standard WCAG2AA --reporter json > pa11y-report.json
```

### **Phase 2: Manual Testing (Critical)**

#### **2.1 Skip Link Implementation & Testing**

**Requirements:**

- Skip links must be first focusable elements
- Must be visible when focused
- Must move focus to target elements
- Must work across all pages

**Implementation Example:**

```html
<!-- Correct Skip Link Structure -->
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <a href="#navigation" class="skip-link">Skip to navigation</a>

  <nav id="navigation" tabindex="-1">...</nav>
  <main id="main" tabindex="-1">...</main>
</body>
```

```css
/* Skip Link CSS */
.skip-link {
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: #000;
  color: #fff;
  padding: 12px 20px;
  text-decoration: none;
  z-index: 99999;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 0;
  outline: 3px solid #fff;
}
```

**Testing Protocol:**

1. Press Tab key - first skip link should receive focus and become visible
2. Press Enter - focus should move to target element
3. Verify on all page types (homepage, forms, search results, etc.)
4. Test with screen readers for proper announcement

#### **2.2 Keyboard Navigation Testing**

**Critical Tests:**

- **Tab Order**: Logical, sequential navigation through all interactive elements
- **Focus Indicators**: Visible focus states on all focusable elements
- **Keyboard Traps**: No infinite loops, users can escape all elements
- **Custom Controls**: All interactive elements accessible via keyboard

**Testing Checklist:**

```
□ Tab through entire page without mouse
□ Shift+Tab works in reverse order
□ Enter/Space activates buttons and links
□ Arrow keys work in menus and carousels
□ Escape key closes modals and menus
□ Focus never disappears or becomes trapped
```

#### **2.3 Screen Reader Compatibility**

**Test with multiple screen readers:**

- **NVDA** (Windows) - Free, widely used
- **JAWS** (Windows) - Professional standard
- **VoiceOver** (macOS/iOS) - Built-in Apple solution

**Key Testing Areas:**

- Page structure and headings (H1-H6 hierarchy)
- Form labels and error messages
- Image alternative text
- Table headers and data relationships
- ARIA labels and descriptions

---

## 🎯 **WCAG 2.1 AA Compliance Checklist**

### **Principle 1: Perceivable**

#### **1.1 Text Alternatives**

- [ ] All images have appropriate alt text
- [ ] Decorative images have empty alt attributes
- [ ] Complex images have detailed descriptions
- [ ] Audio/video content has transcripts

#### **1.2 Time-based Media**

- [ ] Videos have captions
- [ ] Audio descriptions provided for video content
- [ ] Live captions for live audio content

#### **1.3 Adaptable**

- [ ] Content structure is programmatically determinable
- [ ] Reading sequence is logical
- [ ] Instructions don't rely solely on sensory characteristics

#### **1.4 Distinguishable**

- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] No information conveyed by color alone

### **Principle 2: Operable**

#### **2.1 Keyboard Accessible**

- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Skip links implemented and functional

#### **2.2 Enough Time**

- [ ] Time limits can be extended or disabled
- [ ] Auto-updating content can be paused
- [ ] No content flashes more than 3 times per second

#### **2.3 Seizures and Physical Reactions**

- [ ] No content causes seizures
- [ ] Motion can be disabled

#### **2.4 Navigable**

- [ ] Skip links bypass repetitive content
- [ ] Page titles are descriptive
- [ ] Focus order is logical
- [ ] Link purposes are clear from context

### **Principle 3: Understandable**

#### **3.1 Readable**

- [ ] Page language is identified
- [ ] Language changes are identified
- [ ] Unusual words are defined

#### **3.2 Predictable**

- [ ] Navigation is consistent
- [ ] Components behave consistently
- [ ] Changes of context are user-initiated

#### **3.3 Input Assistance**

- [ ] Form errors are identified and described
- [ ] Labels and instructions are provided
- [ ] Error suggestions are provided

### **Principle 4: Robust**

#### **4.1 Compatible**

- [ ] Valid HTML markup
- [ ] Proper ARIA implementation
- [ ] Compatible with assistive technologies

---

## 🚨 **Priority Classification System**

### **Critical (Fix Immediately)**

- Complete keyboard inaccessibility
- Missing skip links on government sites
- Color contrast below 3:1
- Form submission without error handling
- Missing page titles or main headings

### **Serious (Fix Within 1 Week)**

- Color contrast between 3:1-4.5:1
- Missing form labels
- Improper heading hierarchy
- Images without alt text
- Focus order issues

### **Moderate (Fix Within 1 Month)**

- Missing ARIA labels
- Inconsistent navigation
- Non-descriptive link text
- Missing language declarations
- Minor keyboard navigation issues

### **Minor (Fix in Next Release)**

- Redundant ARIA labels
- Non-essential decorative improvements
- Enhanced error messaging
- Additional keyboard shortcuts

---

## 📊 **Government Website Requirements**

### **Section 508 Compliance**

- [ ] Electronic documents are accessible (PDFs, Word docs)
- [ ] Video content has captions and audio descriptions
- [ ] Software and web applications are fully accessible
- [ ] Procurement includes accessibility requirements

### **Additional Government Standards**

- [ ] Plain language requirements met
- [ ] Multi-language support implemented
- [ ] Emergency information is accessible
- [ ] Public forms are fully accessible
- [ ] Contact information includes accessibility coordinator

---

## 🔧 **Common Implementation Patterns**

### **Accessible Form Implementation**

```html
<form>
  <div class="form-group">
    <label for="email">Email Address *</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      aria-describedby="email-error"
      aria-invalid="false"
    />
    <div id="email-error" class="error" aria-live="polite"></div>
  </div>
</form>
```

### **Accessible Modal Dialog**

```html
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
  aria-modal="true"
>
  <h2 id="modal-title">Confirmation</h2>
  <p id="modal-desc">Are you sure you want to delete this item?</p>
  <button type="button" onclick="closeModal()">Cancel</button>
  <button type="button" onclick="confirmDelete()">Delete</button>
</div>
```

### **Accessible Data Table**

```html
<table>
  <caption>
    Monthly Sales Report
  </caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Sales</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">January</th>
      <td>$50,000</td>
      <td>+5%</td>
    </tr>
  </tbody>
</table>
```

---

## 📈 **Testing Commands Reference**

### **Automated Testing Scripts**

```bash
# Full site audit with Axe-core
axe [URL] --tags wcag2a,wcag2aa --save audit-results.json

# Lighthouse accessibility audit
lighthouse [URL] --only-categories=accessibility --view

# Pa11y with custom rules
pa11y [URL] --standard WCAG2AA --ignore "color-contrast"

# Multiple page testing
axe-crawler [DOMAIN] --depth 3 --output results/
```

### **Manual Testing Checklist**

```bash
# Keyboard navigation test
# 1. Disconnect mouse
# 2. Navigate entire site using only:
#    - Tab/Shift+Tab (navigation)
#    - Enter/Space (activation)
#    - Arrow keys (menus/carousels)
#    - Escape (close dialogs)

# Screen reader test
# 1. Enable screen reader
# 2. Navigate by headings (H key)
# 3. Navigate by landmarks (D key)
# 4. Navigate by forms (F key)
# 5. Test form completion and submission
```

---

## 📋 **Audit Report Template**

### **Executive Summary**

- Overall compliance status (% WCAG 2.1 AA compliant)
- Critical issues count and impact
- Estimated remediation effort
- Risk assessment for non-compliance

### **Detailed Findings**

For each violation:

- **Issue**: Description of the problem
- **Impact**: How it affects users with disabilities
- **Location**: Specific pages/components affected
- **Code Example**: Current problematic code
- **Solution**: Corrected code implementation
- **Priority**: Critical/Serious/Moderate/Minor
- **Effort**: Hours/days estimated for fix

### **Implementation Roadmap**

- **Phase 1 (Immediate)**: Critical fixes
- **Phase 2 (1-2 weeks)**: Serious issues
- **Phase 3 (1 month)**: Moderate improvements
- **Phase 4 (Ongoing)**: Minor enhancements and monitoring

### **Maintenance Recommendations**

- Automated testing integration in CI/CD pipeline
- Regular manual testing schedule
- Staff training on accessibility best practices
- Accessibility review process for new features
- User feedback collection from disability community

---

## 🎯 **Success Criteria**

**Audit Complete When:**

- [ ] Zero critical accessibility violations
- [ ] All WCAG 2.1 AA criteria met
- [ ] Skip links functional on all pages
- [ ] Keyboard navigation works throughout site
- [ ] Screen reader compatibility verified
- [ ] Color contrast meets standards
- [ ] Forms are fully accessible
- [ ] Government-specific requirements met
- [ ] Automated testing pipeline established
- [ ] Team training completed

**Deliverables:**

1. Comprehensive audit report with findings and solutions
2. Prioritized remediation roadmap with timelines
3. Code examples and implementation guides
4. Automated testing setup and configuration
5. Ongoing maintenance and monitoring plan

---

## 🛠️ **Advanced Testing Techniques**

### **Multi-Tool Validation Strategy**

#### **Tool 1: Axe-core (Automated Foundation)**

```javascript
// Advanced Axe-core configuration
const axeConfig = {
  rules: {
    "color-contrast": { enabled: true },
    "focus-order-semantics": { enabled: true },
    "keyboard-navigation": { enabled: true },
    "landmark-unique": { enabled: true },
    "skip-link": { enabled: true },
  },
  tags: ["wcag2a", "wcag2aa", "section508", "best-practice"],
};
```

#### **Tool 2: Google Lighthouse (Performance + Accessibility)**

- Real-world performance impact of accessibility features
- Mobile accessibility optimization
- Progressive enhancement validation

#### **Tool 3: SiteImprove (Expert Manual Review)**

- Complex user interaction scenarios
- Advanced WCAG criteria validation
- Government compliance verification

### **Cross-Browser Testing Matrix**

```
Desktop Testing:
├── Chrome (Latest + 2 versions back)
├── Firefox (Latest + ESR)
├── Safari (Latest)
├── Edge (Latest)
└── Internet Explorer 11 (if required)

Mobile Testing:
├── iOS Safari (Latest)
├── Android Chrome (Latest)
├── Samsung Internet
└── Firefox Mobile
```

### **Assistive Technology Testing**

```
Screen Readers:
├── NVDA + Chrome (Windows)
├── JAWS + Chrome (Windows)
├── VoiceOver + Safari (macOS)
├── TalkBack + Chrome (Android)
└── VoiceOver + Safari (iOS)

Other AT:
├── Dragon NaturallySpeaking (Voice control)
├── Switch navigation devices
├── Eye-tracking software
└── Magnification software (ZoomText)
```

---

## 🎨 **Design System Accessibility**

### **Color and Contrast Standards**

```css
/* WCAG AA Compliant Color Palette */
:root {
  /* High contrast combinations */
  --primary-bg: #ffffff; /* Background */
  --primary-text: #212529; /* Text (contrast ratio: 16.75:1) */
  --secondary-bg: #f8f9fa; /* Light background */
  --secondary-text: #495057; /* Secondary text (contrast ratio: 9.35:1) */

  /* Interactive elements */
  --link-color: #0056b3; /* Links (contrast ratio: 7.00:1) */
  --link-hover: #004085; /* Link hover (contrast ratio: 9.75:1) */
  --focus-outline: #0066cc; /* Focus indicators */

  /* Status colors */
  --success: #155724; /* Success messages (contrast ratio: 12.6:1) */
  --warning: #856404; /* Warning messages (contrast ratio: 5.9:1) */
  --error: #721c24; /* Error messages (contrast ratio: 11.4:1) */
}
```

### **Typography Accessibility**

```css
/* Accessible typography scale */
body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 16px; /* Minimum base size */
  line-height: 1.5; /* WCAG recommended */
  letter-spacing: 0.02em;
}

/* Heading hierarchy */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
}
h2 {
  font-size: 2rem;
  font-weight: 600;
}
h3 {
  font-size: 1.75rem;
  font-weight: 600;
}
h4 {
  font-size: 1.5rem;
  font-weight: 500;
}
h5 {
  font-size: 1.25rem;
  font-weight: 500;
}
h6 {
  font-size: 1rem;
  font-weight: 500;
}

/* Interactive element sizing */
button,
input,
select,
textarea {
  min-height: 44px; /* WCAG AAA target size */
  min-width: 44px;
  padding: 12px 16px;
}
```

---

## 🔍 **Specialized Testing Scenarios**

### **Dynamic Content Testing**

```javascript
// Test ARIA live regions
const testLiveRegions = async (page) => {
  // Trigger dynamic content update
  await page.click("#update-button");

  // Verify screen reader announcement
  const liveRegion = await page.$('[aria-live="polite"]');
  const content = await liveRegion.textContent();

  // Validate announcement timing and content
  return {
    hasLiveRegion: !!liveRegion,
    content: content,
    timing: "immediate", // or 'polite'
  };
};
```

### **Form Validation Testing**

```javascript
// Comprehensive form accessibility test
const testFormAccessibility = async (page) => {
  const results = {
    labels: [],
    errors: [],
    required: [],
    instructions: [],
  };

  // Test all form fields
  const fields = await page.$$("input, select, textarea");

  for (const field of fields) {
    const id = await field.getAttribute("id");
    const label = await page.$(`label[for="${id}"]`);
    const required = await field.getAttribute("required");
    const ariaLabel = await field.getAttribute("aria-label");

    results.labels.push({
      field: id,
      hasLabel: !!label || !!ariaLabel,
      labelText: label ? await label.textContent() : ariaLabel,
    });

    if (required !== null) {
      results.required.push({
        field: id,
        indicated: (await field.getAttribute("aria-required")) === "true",
      });
    }
  }

  return results;
};
```

### **Navigation Structure Testing**

```javascript
// Test heading hierarchy and landmarks
const testPageStructure = async (page) => {
  const structure = await page.evaluate(() => {
    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ).map((h) => ({
      level: parseInt(h.tagName.charAt(1)),
      text: h.textContent.trim(),
      id: h.id,
    }));

    const landmarks = Array.from(
      document.querySelectorAll("[role], main, nav, aside, header, footer")
    ).map((l) => ({
      role: l.getAttribute("role") || l.tagName.toLowerCase(),
      label: l.getAttribute("aria-label") || l.getAttribute("aria-labelledby"),
      id: l.id,
    }));

    return { headings, landmarks };
  });

  // Validate heading hierarchy (no skipped levels)
  const headingIssues = [];
  for (let i = 1; i < structure.headings.length; i++) {
    const current = structure.headings[i];
    const previous = structure.headings[i - 1];

    if (current.level > previous.level + 1) {
      headingIssues.push(
        `Heading level skipped: H${previous.level} to H${current.level}`
      );
    }
  }

  return {
    ...structure,
    headingIssues,
    hasH1: structure.headings.some((h) => h.level === 1),
    uniqueLandmarks:
      new Set(structure.landmarks.map((l) => l.role)).size ===
      structure.landmarks.length,
  };
};
```

---

## 📱 **Mobile Accessibility Considerations**

### **Touch Target Guidelines**

- Minimum 44x44 CSS pixels for all interactive elements
- Adequate spacing between touch targets (8px minimum)
- Gesture alternatives for complex interactions
- Orientation support (portrait and landscape)

### **Mobile-Specific Testing**

```javascript
// Mobile accessibility test suite
const mobileAccessibilityTest = async () => {
  const viewport = { width: 375, height: 667 }; // iPhone SE
  await page.setViewport(viewport);

  // Test touch target sizes
  const touchTargets = await page.$$eval(
    "button, a, input, select",
    (elements) =>
      elements.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          element: el.tagName,
          width: rect.width,
          height: rect.height,
          meetsMinimum: rect.width >= 44 && rect.height >= 44,
        };
      })
  );

  // Test zoom functionality
  await page.setViewport({ ...viewport, deviceScaleFactor: 2 });
  const zoomTest = await page.evaluate(() => {
    return {
      textReadable: window.getComputedStyle(document.body).fontSize,
      layoutIntact: !document.querySelector('[style*="overflow: hidden"]'),
    };
  });

  return { touchTargets, zoomTest };
};
```

---

## 🎯 **Continuous Monitoring Setup**

### **CI/CD Integration**

```yaml
# GitHub Actions accessibility testing
name: Accessibility Audit
on: [push, pull_request]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16"

      - name: Install dependencies
        run: npm install @axe-core/cli lighthouse-ci

      - name: Run accessibility tests
        run: |
          axe http://localhost:3000 --tags wcag2aa --exit
          lhci autorun

      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: accessibility-reports
          path: ./reports/
```

### **Automated Monitoring Script**

```javascript
// Daily accessibility monitoring
const scheduleAccessibilityCheck = () => {
  const cron = require("node-cron");

  // Run daily at 2 AM
  cron.schedule("0 2 * * *", async () => {
    const results = await runFullAccessibilityAudit();

    if (results.violations.length > 0) {
      await sendAlertEmail({
        to: "accessibility-team@company.com",
        subject: "Accessibility Violations Detected",
        body: generateViolationReport(results),
      });
    }

    await saveResultsToDatabase(results);
  });
};
```

---

## �️ **Framework-Specific Implementation Guides**

### **Vue 3 + Nuxt 3 Accessibility**

#### **Vue 3 Accessibility Patterns**

```vue
<!-- Accessible Vue Component Template -->
<template>
  <div>
    <!-- Skip Links (app.vue) -->
    <a
      class="skip-to-content-link"
      href="#main"
      @click.prevent="skipToMain"
      @keydown.enter.prevent="skipToMain"
    >
      Skip to main content
    </a>

    <!-- Accessible Form Component -->
    <form @submit.prevent="handleSubmit" novalidate>
      <div class="form-group">
        <label :for="fieldId"
          >{{ label }}
          <span v-if="required" aria-label="required">*</span></label
        >
        <input
          :id="fieldId"
          v-model="value"
          :type="type"
          :required="required"
          :aria-describedby="hasError ? `${fieldId}-error` : undefined"
          :aria-invalid="hasError"
          @blur="validateField"
        />
        <div
          v-if="hasError"
          :id="`${fieldId}-error`"
          class="error-message"
          role="alert"
          aria-live="polite"
        >
          {{ errorMessage }}
        </div>
      </div>
    </form>

    <!-- Accessible Modal Component -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click="closeModal"
        @keydown.esc="closeModal"
      >
        <div
          ref="modalRef"
          role="dialog"
          :aria-labelledby="titleId"
          :aria-describedby="descId"
          aria-modal="true"
          class="modal-content"
          @click.stop
        >
          <h2 :id="titleId">{{ title }}</h2>
          <p :id="descId">{{ description }}</p>
          <button @click="closeModal" aria-label="Close modal">×</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";

// Props and reactive data
const props = defineProps({
  label: String,
  type: { type: String, default: "text" },
  required: Boolean,
  title: String,
  description: String,
});

const value = ref("");
const isOpen = ref(false);
const modalRef = ref(null);
const fieldId = computed(
  () => `field-${Math.random().toString(36).substr(2, 9)}`
);
const titleId = computed(
  () => `title-${Math.random().toString(36).substr(2, 9)}`
);
const descId = computed(
  () => `desc-${Math.random().toString(36).substr(2, 9)}`
);

// Accessibility methods
const skipToMain = () => {
  const mainElement = document.getElementById("main");
  if (mainElement) {
    mainElement.setAttribute("tabindex", "-1");
    mainElement.focus({ preventScroll: true });
    mainElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const closeModal = () => {
  isOpen.value = false;
  // Return focus to trigger element
  nextTick(() => {
    const trigger = document.querySelector("[data-modal-trigger]");
    if (trigger) trigger.focus();
  });
};

// Focus management for modals
const trapFocus = (e) => {
  if (!modalRef.value) return;

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
};

// Lifecycle hooks for accessibility
onMounted(() => {
  if (isOpen.value) {
    document.addEventListener("keydown", trapFocus);
    nextTick(() => modalRef.value?.focus());
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", trapFocus);
});
</script>
```

#### **Nuxt 3 Accessibility Configuration**

```javascript
// nuxt.config.js - Accessibility optimizations
export default defineNuxtConfig({
  // Disable dev tools in production for accessibility
  devtools: { enabled: false },

  // SEO and accessibility meta
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#391856" },
      ],
    },
  },

  // CSS configuration for accessibility
  css: ["@/assets/css/accessibility.css"],

  // Modules for accessibility
  modules: [
    "@nuxtjs/color-mode", // Respects user's color scheme preference
    "@nuxtjs/google-fonts", // Optimized font loading
  ],

  // Runtime config for accessibility features
  runtimeConfig: {
    public: {
      skipLinksEnabled: true,
      highContrastMode: false,
      reducedMotion: false,
    },
  },
});
```

### **Vuetify 3 Accessibility Enhancements**

#### **Vuetify Component Accessibility Fixes**

```vue
<!-- Accessible Vuetify Navigation -->
<template>
  <v-app>
    <!-- Skip links before Vuetify components -->
    <a class="skip-link" href="#main">Skip to main content</a>

    <v-app-bar
      color="primary"
      app
      role="banner"
      aria-label="Main site navigation"
    >
      <!-- Accessible hamburger menu -->
      <v-btn
        v-if="mobile"
        icon
        @click="drawer = !drawer"
        :aria-label="drawer ? 'Close navigation menu' : 'Open navigation menu'"
        :aria-expanded="drawer"
        aria-controls="navigation-drawer"
        style="min-height: 44px; min-width: 44px"
      >
        <v-icon>{{ drawer ? "mdi-close" : "mdi-menu" }}</v-icon>
      </v-btn>

      <!-- Accessible logo/title -->
      <v-btn
        text
        @click="$router.push('/')"
        aria-label="Go to homepage"
        style="min-height: 44px; min-width: 44px"
      >
        <v-img src="/logo.png" alt="Company Logo" max-height="40" contain />
      </v-btn>

      <v-spacer />

      <!-- Accessible navigation items -->
      <v-btn
        v-for="item in navigationItems"
        :key="item.title"
        text
        :to="item.to"
        :aria-label="item.title"
        style="min-height: 44px; min-width: 44px"
      >
        {{ item.title }}
      </v-btn>
    </v-app-bar>

    <!-- Accessible navigation drawer -->
    <v-navigation-drawer
      v-model="drawer"
      id="navigation-drawer"
      role="navigation"
      aria-label="Mobile navigation menu"
      temporary
    >
      <v-list nav>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.title"
          :to="item.to"
          @click="drawer = false"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main content with proper landmark -->
    <v-main id="main" tabindex="-1" aria-label="Main content">
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>

    <!-- Accessible footer -->
    <v-footer color="primary" app role="contentinfo" aria-label="Site footer">
      <v-container>
        <v-row>
          <v-col>
            <p>&copy; 2025 Company Name. All rights reserved.</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>
```

#### **Accessible Vuetify Form Components**

```vue
<!-- Accessible Vuetify Forms -->
<template>
  <v-form @submit.prevent="handleSubmit" novalidate>
    <!-- Text Input with proper labeling -->
    <v-text-field
      v-model="email"
      :label="emailLabel"
      type="email"
      :error-messages="emailErrors"
      :aria-describedby="emailErrors.length ? 'email-error' : undefined"
      :aria-invalid="emailErrors.length > 0"
      required
      outlined
      style="min-height: 44px"
    >
      <template #label>
        {{ emailLabel }} <span aria-label="required">*</span>
      </template>
    </v-text-field>

    <!-- Select with proper ARIA -->
    <v-select
      v-model="category"
      :items="categories"
      label="Category"
      :error-messages="categoryErrors"
      outlined
      :aria-describedby="categoryErrors.length ? 'category-error' : undefined"
      style="min-height: 44px"
    />

    <!-- Checkbox with proper labeling -->
    <v-checkbox v-model="agreement" :error-messages="agreementErrors" required>
      <template #label>
        <span>
          I agree to the
          <a
            href="/terms"
            target="_blank"
            aria-label="Terms of Service (opens in new window)"
          >
            Terms of Service
          </a>
          <span aria-label="required">*</span>
        </span>
      </template>
    </v-checkbox>

    <!-- Accessible submit button -->
    <v-btn
      type="submit"
      color="primary"
      :disabled="!isFormValid"
      :loading="isSubmitting"
      style="min-height: 44px; min-width: 44px"
      aria-describedby="submit-help"
    >
      Submit Form
    </v-btn>

    <div id="submit-help" class="text-caption mt-2">
      Press Enter or click to submit the form
    </div>
  </v-form>
</template>
```

#### **Vuetify Data Table Accessibility**

```vue
<!-- Accessible Vuetify Data Table -->
<template>
  <div>
    <h2 id="table-title">User Data</h2>
    <p id="table-description">
      A table showing user information with sortable columns
    </p>

    <v-data-table
      :headers="headers"
      :items="users"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      role="table"
      :aria-labelledby="'table-title'"
      :aria-describedby="'table-description'"
      class="elevation-1"
    >
      <!-- Accessible header slots -->
      <template #header="{ props }">
        <thead>
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.value"
              :class="header.class"
              scope="col"
              :aria-sort="getSortDirection(header.value)"
              @click="sort(header.value)"
              @keydown.enter="sort(header.value)"
              @keydown.space.prevent="sort(header.value)"
              tabindex="0"
              role="columnheader"
            >
              {{ header.text }}
              <v-icon v-if="header.sortable" small>
                {{ getSortIcon(header.value) }}
              </v-icon>
            </th>
          </tr>
        </thead>
      </template>

      <!-- Accessible action buttons -->
      <template #item.actions="{ item }">
        <v-btn
          icon
          small
          @click="editUser(item)"
          :aria-label="`Edit user ${item.name}`"
          style="min-height: 44px; min-width: 44px"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          small
          @click="deleteUser(item)"
          :aria-label="`Delete user ${item.name}`"
          style="min-height: 44px; min-width: 44px"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
```

### **Vue 3 Accessibility Testing**

#### **Vue Component Accessibility Test**

```javascript
// Vue component accessibility test with Vue Test Utils
import { mount } from "@vue/test-utils";
import { axe, toHaveNoViolations } from "jest-axe";
import AccessibleForm from "@/components/AccessibleForm.vue";

expect.extend(toHaveNoViolations);

describe("AccessibleForm", () => {
  test("should not have accessibility violations", async () => {
    const wrapper = mount(AccessibleForm, {
      props: {
        label: "Email Address",
        required: true,
      },
    });

    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });

  test("should have proper ARIA attributes", () => {
    const wrapper = mount(AccessibleForm, {
      props: {
        label: "Email Address",
        required: true,
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("aria-required")).toBe("true");
    expect(input.attributes("id")).toBeDefined();

    const label = wrapper.find("label");
    expect(label.attributes("for")).toBe(input.attributes("id"));
  });

  test("should handle keyboard navigation", async () => {
    const wrapper = mount(AccessibleForm);
    const input = wrapper.find("input");

    await input.trigger("keydown.tab");
    expect(document.activeElement).toBe(input.element);
  });
});
```

#### **Nuxt 3 Accessibility Testing Setup**

```javascript
// nuxt.config.js - Testing configuration
export default defineNuxtConfig({
  // Test environment configuration
  nitro: {
    esbuild: {
      options: {
        target: "es2020",
      },
    },
  },

  // Accessibility testing modules
  modules: ["@nuxt/test-utils/module"],

  // Build configuration for testing
  build: {
    transpile: ["@axe-core/puppeteer"],
  },
});
```

```javascript
// tests/accessibility.test.js - Nuxt accessibility tests
import { setup, $fetch } from "@nuxt/test-utils";
import { AxePuppeteer } from "@axe-core/puppeteer";
import puppeteer from "puppeteer";

describe("Nuxt Accessibility Tests", async () => {
  await setup({
    // Nuxt config overrides
  });

  test("homepage should be accessible", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("http://localhost:3000");

    const results = await new AxePuppeteer(page)
      .configure({
        rules: {
          "color-contrast": { enabled: true },
          "keyboard-navigation": { enabled: true },
        },
      })
      .analyze();

    expect(results.violations).toHaveLength(0);

    await browser.close();
  });

  test("skip links should work", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("http://localhost:3000");

    // Test skip link functionality
    await page.keyboard.press("Tab");
    const skipLinkFocused = await page.evaluate(() => {
      return document.activeElement.id === "skip-link";
    });

    expect(skipLinkFocused).toBe(true);

    await page.keyboard.press("Enter");
    const mainFocused = await page.evaluate(() => {
      return document.activeElement.id === "main";
    });

    expect(mainFocused).toBe(true);

    await browser.close();
  });
});
```

### **Framework-Specific Accessibility Checklist**

#### **Vue 3 Specific**

- [ ] Proper use of `ref` and `reactive` for accessibility state management
- [ ] Correct implementation of `watch` and `watchEffect` for ARIA updates
- [ ] Proper use of `nextTick` for focus management after DOM updates
- [ ] Accessible use of `Teleport` for modals and overlays
- [ ] Correct lifecycle hook usage for accessibility setup/cleanup

#### **Nuxt 3 Specific**

- [ ] Server-side rendering accessibility (SSR)
- [ ] Proper meta tag management with `useSeoMeta`
- [ ] Accessible routing with `navigateTo` and focus management
- [ ] Proper use of `useState` for accessibility preferences
- [ ] Correct implementation of `useHead` for accessibility metadata

#### **Vuetify 3 Specific**

- [ ] Override Vuetify component ARIA labels where needed
- [ ] Ensure minimum touch target sizes (44x44px) for all interactive elements
- [ ] Proper color contrast with Vuetify theme customization
- [ ] Accessible use of Vuetify icons with proper labels
- [ ] Correct implementation of Vuetify form validation with accessibility
- [ ] Proper landmark roles for Vuetify layout components

---

## �📚 **Training and Documentation**

### **Team Training Checklist**

- [ ] WCAG 2.1 guidelines overview
- [ ] Screen reader demonstration and hands-on practice
- [ ] Keyboard navigation testing techniques
- [ ] Color contrast and visual design principles
- [ ] ARIA implementation best practices
- [ ] Form accessibility requirements
- [ ] Testing tools setup and usage
- [ ] Legal compliance requirements

### **Documentation Standards**

```markdown
# Accessibility Documentation Template

## Component: [Component Name]

**Accessibility Level:** WCAG 2.1 AA Compliant

### Keyboard Support

- Tab: Moves focus to next interactive element
- Shift+Tab: Moves focus to previous interactive element
- Enter/Space: Activates the component
- Escape: Closes modal/dropdown (if applicable)

### Screen Reader Support

- Proper ARIA labels and descriptions
- State changes announced automatically
- Instructions provided for complex interactions

### Implementation Notes

[Specific implementation details and code examples]

### Testing Checklist

- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces all necessary information
- [ ] Color contrast meets WCAG standards
- [ ] Component works at 200% zoom
- [ ] Touch targets meet minimum size requirements
```

---

_This comprehensive prompt ensures thorough accessibility evaluation across all aspects of web development, from initial design through ongoing maintenance, providing actionable guidance for achieving and maintaining full WCAG 2.1 AA compliance with government website standards._
