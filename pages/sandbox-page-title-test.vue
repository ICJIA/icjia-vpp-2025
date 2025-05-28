<template>
  <div class="test-page">
    <!-- Test the PageTitleSection component -->
    <PageTitleSection
      title="Page Title System Test"
      description="This page demonstrates the reusable PageTitleSection component with infographic-style typography, professional animations, and full accessibility compliance."
      :show-border="true"
    />

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <div class="content-section">
          <h2>Component Features Demonstrated</h2>
          
          <div class="feature-grid">
            <div class="feature-card">
              <h3>Infographic-Style Typography</h3>
              <p>Large, impactful 5rem font size with professional styling and tight letter spacing for modern appearance.</p>
            </div>
            
            <div class="feature-card">
              <h3>Professional Animations</h3>
              <p>Staggered fade-in animations with title appearing at 0.2s and description at 0.4s for polished entrance.</p>
            </div>
            
            <div class="feature-card">
              <h3>Responsive Design</h3>
              <p>Proportional scaling across all devices: 5rem desktop, 4rem tablet, 3rem mobile, 2.25rem small mobile.</p>
            </div>
            
            <div class="feature-card">
              <h3>Theme Compatibility</h3>
              <p>Seamless adaptation between light and dark themes using CSS custom properties.</p>
            </div>
            
            <div class="feature-card">
              <h3>Accessibility Compliance</h3>
              <p>WCAG 2.1 AA standards with proper semantic HTML, focus management, and reduced motion support.</p>
            </div>
            
            <div class="feature-card">
              <h3>Visual Separator</h3>
              <p>Optional border separator (enabled on this page) for clear visual hierarchy between title and content.</p>
            </div>
          </div>
        </div>

        <div class="content-section">
          <h2>Usage Examples</h2>
          
          <div class="code-example">
            <h3>Basic Implementation</h3>
            <pre><code>&lt;PageTitleSection
  title="Your Page Title"
  description="Your page description"
  :show-border="true"
/&gt;</code></pre>
          </div>
          
          <div class="code-example">
            <h3>Advanced with Slots</h3>
            <pre><code>&lt;PageTitleSection :show-border="true"&gt;
  &lt;template #title&gt;
    Custom &lt;strong&gt;Title&lt;/strong&gt; with Formatting
  &lt;/template&gt;
  &lt;template #description&gt;
    &lt;p&gt;Custom description with formatting.&lt;/p&gt;
  &lt;/template&gt;
&lt;/PageTitleSection&gt;</code></pre>
          </div>
        </div>

        <div class="content-section">
          <h2>Implementation Status</h2>
          
          <div class="status-grid">
            <div class="status-item completed">
              <v-icon icon="mdi-check-circle" color="success" size="24" class="mr-2" />
              <span>News page implementation</span>
            </div>
            
            <div class="status-item completed">
              <v-icon icon="mdi-check-circle" color="success" size="24" class="mr-2" />
              <span>Reusable component created</span>
            </div>
            
            <div class="status-item completed">
              <v-icon icon="mdi-check-circle" color="success" size="24" class="mr-2" />
              <span>Documentation provided</span>
            </div>
            
            <div class="status-item pending">
              <v-icon icon="mdi-clock-outline" color="warning" size="24" class="mr-2" />
              <span>About page migration (optional)</span>
            </div>
            
            <div class="status-item pending">
              <v-icon icon="mdi-clock-outline" color="warning" size="24" class="mr-2" />
              <span>Other pages migration (as needed)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Page Title System Test Page
 * 
 * This page demonstrates the PageTitleSection component implementation
 * and serves as a testing ground for the reusable page title system.
 * 
 * @page
 */
import PageTitleSection from '~/components/content/PageTitleSection.vue';

/**
 * SEO meta configuration
 */
useSeoMeta({
  title: 'Page Title System Test - Violence Prevention Plan for Illinois: 2025-2029',
  description: 'Test page demonstrating the reusable PageTitleSection component with infographic-style typography and professional animations.',
});
</script>

<style scoped>
/* Page background matching the news page */
.test-page {
  min-height: 100vh;
  padding-top: 60px;
  background: #FAFAFA;
}

/* Dark theme background override */
:root[data-theme="dark"] .test-page {
  background: rgb(var(--v-theme-surface));
}

/* Container styling */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Main content spacing */
.page-content {
  padding: 4.5rem 0;
}

/* Content sections */
.content-section {
  margin-bottom: 3rem;
}

.content-section h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

/* Feature grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-card {
  background: rgba(var(--v-theme-surface), 1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.feature-card p {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin: 0;
}

/* Code examples */
.code-example {
  margin-bottom: 2rem;
}

.code-example h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.code-example pre {
  background: rgba(var(--v-theme-on-surface), 0.05);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Status grid */
.status-grid {
  display: grid;
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: rgba(var(--v-theme-surface), 1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 0.5rem;
}

.status-item.completed {
  border-left: 4px solid rgb(var(--v-theme-success));
}

.status-item.pending {
  border-left: 4px solid rgb(var(--v-theme-warning));
}

/* Responsive design */
@media (max-width: 768px) {
  .test-page {
    padding-top: 50px;
  }

  .page-content {
    padding: 3rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Dark theme adjustments */
:root[data-theme="dark"] .feature-card,
:root[data-theme="dark"] .status-item {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-color: rgba(var(--v-theme-on-surface), 0.12);
}

:root[data-theme="dark"] .code-example pre {
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-color: rgba(var(--v-theme-on-surface), 0.15);
}
</style>
