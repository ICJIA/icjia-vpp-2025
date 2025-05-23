<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <h1 class="text-h4 mb-4">Simple Content Display</h1>
        <p class="text-subtitle-1 mb-6">A clean, minimal approach to displaying markdown content</p>

        <!-- Simple Content Display -->
        <v-card class="mb-6 rounded-lg" elevation="1">
          <v-card-text>
            <SimpleContentDisplay
              :path="contentPath"
              :debug="showDebug"
            />
          </v-card-text>
        </v-card>

        <!-- Debug Toggle -->
        <div class="text-right mb-4">
          <v-switch
            v-model="showDebug"
            label="Show Debug Information"
            color="primary"
            hide-details
            density="compact"
          ></v-switch>
        </div>

        <!-- Explanation -->
        <v-card class="mt-6 rounded-lg" color="primary-lighten-5" elevation="1">
          <v-card-item>
            <v-card-title class="text-h5">
              <v-icon icon="mdi-lightbulb-outline" class="me-2" aria-hidden="true"></v-icon>
              How It Works
            </v-card-title>
          </v-card-item>

          <v-card-text>
            <p class="mb-4">
              This page demonstrates a simplified approach to content display:
            </p>

            <v-timeline density="compact" align="start">
              <v-timeline-item
                dot-color="primary"
                size="small"
              >
                <div class="mb-2 font-weight-bold">Step 1: Store Content</div>
                <p>Content is stored in <code>/content/sandbox-refactored.md</code> with frontmatter</p>
              </v-timeline-item>

              <v-timeline-item
                dot-color="primary"
                size="small"
              >
                <div class="mb-2 font-weight-bold">Step 2: Determine Content Path</div>
                <p>We dynamically determine the content path based on the current route name</p>
              </v-timeline-item>

              <v-timeline-item
                dot-color="primary"
                size="small"
              >
                <div class="mb-2 font-weight-bold">Step 3: Fetch Content</div>
                <p>We fetch it using our simplified <code>useContentFetcher</code> composable</p>
              </v-timeline-item>

              <v-timeline-item
                dot-color="primary"
                size="small"
              >
                <div class="mb-2 font-weight-bold">Step 4: Handle States</div>
                <p>We implement loading, error, and empty states for better UX</p>
              </v-timeline-item>

              <v-timeline-item
                dot-color="primary"
                size="small"
              >
                <div class="mb-2 font-weight-bold">Step 5: Render Content</div>
                <p>The content is rendered with <code>&lt;ContentRenderer&gt;</code> component</p>
              </v-timeline-item>
            </v-timeline>

            <v-divider class="my-4"></v-divider>

            <p class="font-weight-bold">The component code is simple:</p>
            <pre class="code-block pa-4 rounded">
// SimpleContentDisplay.vue
&lt;template&gt;
  &lt;div class="simple-content-display"&gt;
    &lt;!-- Content Display --&gt;
    &lt;div v-if="content" class="content-container"&gt;
      &lt;ContentRenderer :value="content" class="content-renderer" /&gt;

      &lt;!-- Debug Information (only shown when debug=true) --&gt;
      &lt;div v-if="props.debug" class="debug-container mt-6"&gt;
        &lt;v-divider class="my-4"&gt;&lt;/v-divider&gt;
        &lt;h3 class="text-h6 font-weight-bold mb-3"&gt;
          &lt;v-icon icon="mdi-code-json" class="me-2" aria-hidden="true"&gt;&lt;/v-icon&gt;
          Debug: Raw Content Data
        &lt;/h3&gt;
        &lt;v-card class="debug-card" variant="outlined"&gt;
          &lt;v-card-text class="pa-0"&gt;
            &lt;pre class="debug-content"&gt;&#123;&#123; JSON.stringify(content, null, 2) &#125;&#125;&lt;/pre&gt;
          &lt;/v-card-text&gt;
        &lt;/v-card&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div v-else-if="pending"&gt;Loading...&lt;/div&gt;
    &lt;div v-else-if="error"&gt;Error: &#123;&#123; error.message &#125;&#125;&lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ContentRenderer } from '#components';
import useContentFetcher from '~/composables/useContentFetcher';

const props = defineProps({
  path: {
    type: String,
    required: true
  },
  debug: {
    type: Boolean,
    default: false
  }
});

const { content, pending, error } = useContentFetcher({
  path: props.path
});
&lt;/script&gt;</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
/**
 * Sandbox Refactored Page
 *
 * Demonstrates a simplified approach to content display with minimal UI.
 * Now includes a debug mode toggle to demonstrate the debug prop.
 */
import { ref } from 'vue';
import { useRoute, useHead } from '#imports';
import SimpleContentDisplay from '~/components/SimpleContentDisplay.vue';

// Get the current route
const route = useRoute();

// Get the content path based on the route name
const contentPath = `/${route.name?.toString() || 'sandbox-refactored'}`;

// Debug mode toggle (defaulted to true for demonstration)
const showDebug = ref(true);

// Set page metadata
useHead({
  title: 'Simple Content Display - Violence Prevention Plan for Illinois',
  meta: [
    { name: 'description', content: 'A demonstration of simplified content display' }
  ]
});
</script>

<style lang="scss" scoped>
.code-block {
  background-color: rgba(0, 0, 0, 0.03);
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

// Dark mode support
:deep(.v-theme--dark) {
  .code-block {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>
