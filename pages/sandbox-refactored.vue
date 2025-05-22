<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <h1 class="text-h4 mb-4">Simple Content Display</h1>
        <p class="text-subtitle-1 mb-6">A clean, minimal approach to displaying markdown content</p>

        <!-- Simple Content Display -->
        <v-card class="mb-6 rounded-lg" elevation="1">
          <v-card-text>
            <SimpleContentDisplay :path="contentPath" />
          </v-card-text>
        </v-card>

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

            <ul class="mb-4">
              <li class="mb-2">Uses a minimal component that only shows the content itself</li>
              <li class="mb-2">No frontmatter display, no icons, no extra UI elements</li>
              <li class="mb-2">Just the raw markdown content rendered as HTML</li>
              <li class="mb-2">Maintains proper styling and accessibility</li>
            </ul>

            <v-divider class="my-4"></v-divider>

            <p class="font-weight-bold">The component code is simple:</p>
            <pre class="code-block pa-4 rounded">
// SimpleContentDisplay.vue
&lt;template&gt;
  &lt;div class="simple-content-display"&gt;
    &lt;ContentRenderer
      v-if="content"
      :value="content"
      class="content-renderer"
    /&gt;
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
 */
import { useRoute, useHead } from '#imports';
import SimpleContentDisplay from '~/components/SimpleContentDisplay.vue';

// Get the current route
const route = useRoute();

// Get the content path based on the route name
const contentPath = `/${route.name?.toString() || 'sandbox-refactored'}`;

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
