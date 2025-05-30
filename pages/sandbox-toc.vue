<template>
  <div>
    <!-- Main content layout with responsive TOC -->
    <v-container>
      <v-row>
        <!-- Main content area -->
        <v-col
          :cols="contentColumnWidth.cols"
          :sm="contentColumnWidth.sm"
          :md="contentColumnWidth.md"
          :lg="contentColumnWidth.lg"
          :xl="contentColumnWidth.xl"
        >
          <ContentRenderer v-if="about" :value="about" />
          <div v-else>About not found</div>
        </v-col>

        <!-- TOC Sidebar -->
        <v-col v-if="showTOC && about" cols="12" sm="12" md="4" lg="3" xl="3">
          <div style="position: fixed; top: 80px; height: fit-content">
            <v-card elevation="2">
              <v-card-title class="text-h6 pb-2"> TOC JSON Data </v-card-title>
              <v-card-text class="pt-0">
                <!-- Try different possible TOC data paths -->
                <div v-if="about.body?.toc">
                  <h5>Found at: about.body.toc</h5>
                  <pre class="toc-json-display">{{
                    JSON.stringify(about.body.toc, null, 2)
                  }}</pre>
                </div>
                <div v-else-if="about.toc">
                  <h5>Found at: about.toc</h5>
                  <pre class="toc-json-display">{{
                    JSON.stringify(about.toc, null, 2)
                  }}</pre>
                </div>
                <div v-else-if="about._toc">
                  <h5>Found at: about._toc</h5>
                  <pre class="toc-json-display">{{
                    JSON.stringify(about._toc, null, 2)
                  }}</pre>
                </div>
                <div v-else>
                  <p class="text-body-2 text-medium-emphasis">
                    No TOC data found in content structure.
                  </p>
                  <p class="text-caption">Checked paths: body.toc, toc, _toc</p>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Toggle for testing TOC visibility -->
    <v-container>
      <v-row>
        <v-col
          :cols="contentColumnWidth.cols"
          :sm="contentColumnWidth.sm"
          :md="contentColumnWidth.md"
          :lg="contentColumnWidth.lg"
          :xl="contentColumnWidth.xl"
        >
          <v-card>
            <v-card-text class="py-3">
              <v-switch
                v-model="showTOC"
                :label="`TOC ${showTOC ? 'Enabled' : 'Disabled'}`"
                color="primary"
                inset
                hide-details
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Fetch content from Nuxt Content v3 system
const { data: about } = await useAsyncData(() =>
  queryCollection("content").path("/about").first()
);

// Reactive state for TOC visibility (initialize to true for testing)
const showTOC = ref(true);

/**
 * Compute responsive column widths for main content based on TOC toggle state
 * @returns {Object} Object with responsive column widths
 */
const contentColumnWidth = computed(() => {
  const hasTOC = showTOC.value; // Use showTOC for layout, not shouldShowTOC
  return {
    cols: 12, // Always full width on mobile
    sm: 12, // Always full width on small screens
    md: hasTOC ? 8 : 12, // 8 cols when TOC enabled, 12 when disabled on tablet
    lg: hasTOC ? 9 : 12, // 9 cols when TOC enabled, 12 when disabled on desktop
    xl: hasTOC ? 9 : 12, // 9 cols when TOC enabled, 12 when disabled on large desktop
  };
});

// Set page title
useHead({
  title: "TOC Layout Test - Violence Prevention Plan",
});
</script>

<style scoped>
.toc-json-display {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  font-family: "Courier New", Consolas, monospace;
  font-size: 12px;
  line-height: 1.4;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}

/* Dark theme support for JSON display */
.v-theme--dark .toc-json-display {
  background-color: #2d2d2d;
  border-color: #404040;
  color: #e0e0e0;
}
</style>
