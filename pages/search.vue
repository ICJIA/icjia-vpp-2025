<template>
  <div class="search-page">
    <!-- SEO Structured Data for Search Page -->
    <StructuredData
      :content="{
        title: 'Search - Violence Prevention Plan for Illinois: 2025-2029',
        description:
          'Search through all content in the Violence Prevention Plan for Illinois: 2025-2029 to find specific information, resources, and guidance.',
      }"
      page-type="search"
      :path="'/search'"
    />

    <!-- Use PageTitleSection for consistent styling -->
    <PageTitleSection
      title="Search"
      description="Search through all content in the Violence Prevention Plan for Illinois: 2025-2029 to find specific information, resources, and guidance."
      :show-border="true"
    />

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <v-row>
          <v-col cols="12" md="10" lg="8" class="mx-auto">
            <!-- Search input -->
            <v-card class="mb-8" elevation="2">
              <v-card-text>
                <v-text-field
                  v-model="searchQuery"
                  label="Search content"
                  :placeholder="searchQuery ? '' : 'Enter search terms...'"
                  variant="outlined"
                  hide-details
                  clearable
                  @click:clear="clearSearch"
                  prepend-inner-icon="mdi-magnify"
                  :loading="isSearching"
                  aria-label="Search content"
                  class="search-input"
                  autofocus
                ></v-text-field>
              </v-card-text>
            </v-card>

            <!-- Search results -->
            <!-- Loading state -->
            <div
              v-if="isInitializing"
              class="text-center py-8"
              role="status"
              aria-live="polite"
            >
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
                aria-label="Loading search index"
              ></v-progress-circular>
              <div class="mt-4 text-body-1">Loading search index...</div>
            </div>

            <!-- No results state -->
            <div
              v-else-if="
                searchQuery && !isSearching && searchResults.length === 0
              "
              class="text-center py-8"
              role="status"
              aria-live="polite"
            >
              <v-icon
                icon="mdi-file-search-outline"
                size="64"
                color="grey-lighten-1"
                class="mb-4"
                aria-hidden="true"
              ></v-icon>
              <h2 class="text-h5 mb-2">No results found</h2>
              <p class="text-body-1 text-medium-emphasis">
                No content matches your search for "{{
                  sanitizedSearchDisplay
                }}". Try different keywords or check your spelling.
              </p>
            </div>

            <!-- Search results -->
            <div
              v-else-if="searchQuery && !isSearching"
              role="region"
              aria-label="Search results"
            >
              <div class="mb-4 text-subtitle-1" aria-live="polite">
                {{ searchResults.length }}
                {{ searchResults.length === 1 ? "result" : "results" }} found
              </div>

              <!-- Results list -->
              <ul
                class="search-results-list pa-0"
                aria-label="Search results list"
              >
                <li
                  v-for="(result, index) in searchResults"
                  :key="index"
                  class="mb-4"
                  style="list-style-type: none"
                >
                  <v-card
                    elevation="1"
                    :to="result.path"
                    class="search-result-card"
                    tabindex="0"
                  >
                    <v-card-title class="text-h6">
                      {{ result.title }}
                    </v-card-title>
                    <v-card-text>
                      <p class="text-body-2 text-medium-emphasis mb-2">
                        <v-icon
                          icon="mdi-link-variant"
                          size="small"
                          class="me-1"
                          aria-hidden="true"
                        ></v-icon>
                        <span class="sr-only">Path: </span>{{ result.path }}
                      </p>
                      <div
                        v-html="safeHighlight(result.excerpt)"
                        class="search-result-excerpt"
                        aria-label="Result excerpt"
                      ></div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        variant="text"
                        color="primary"
                        :to="result.path"
                        class="text-none"
                        aria-label="View content for {{ result.title }}"
                      >
                        View content
                        <v-icon
                          icon="mdi-arrow-right"
                          size="small"
                          class="ms-1"
                          aria-hidden="true"
                        ></v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </li>
              </ul>
            </div>

            <!-- Empty search state -->
            <div
              v-else-if="!searchQuery"
              class="text-center py-8"
              role="status"
            >
              <v-icon
                icon="mdi-text-search"
                size="64"
                color="grey-lighten-1"
                class="mb-4"
                aria-hidden="true"
              ></v-icon>
              <h2 class="text-h5 mb-2">Search content</h2>
              <p class="text-body-1 text-medium-emphasis">
                Enter keywords above to search through all content.
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useHead, useSeoMeta } from "#imports";
import Fuse from "fuse.js";
import { useConsoleLogger } from "~/composables/useConsoleLogger";
import {
  sanitizeString,
  sanitizeSearchQuery,
  safeHighlightMatches,
  validateSearchResults,
  containsDangerousContent,
} from "~/utils/sanitize";
import PageTitleSection from "~/components/content/PageTitleSection.vue";
import StructuredData from "~/components/seo/StructuredData.vue";

// Initialize logger
const { log } = useConsoleLogger();

// Set page title and meta
useHead({
  title: "Search - Violence Prevention Plan for Illinois: 2025-2029",
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  title: "Search - Violence Prevention Plan for Illinois: 2025-2029",
  description:
    "Search through all content in the Violence Prevention Plan for Illinois: 2025-2029",
});

// State
const searchQuery = ref("");
const searchIndex = ref([]);
const searchResults = ref([]);
const isInitializing = ref(true);
const isSearching = ref(false);
const fuseInstance = ref(null);

// Computed properties
const sanitizedSearchQuery = computed(() => {
  return sanitizeSearchQuery(searchQuery.value);
});

// Safe display version of the search query for UI display
const sanitizedSearchDisplay = computed(() => {
  return sanitizeString(searchQuery.value);
});

// Load Fuse.js configuration from config file
const fuseConfig = ref(null);
const fuseOptions = ref({
  /**
   * Default Fuse.js configuration options
   * These will be used if the config file cannot be loaded
   */
  keys: [
    { name: "title", weight: 1.0 },
    { name: "content", weight: 1.0 },
    { name: "description", weight: 0.6 },
    { name: "path", weight: 0.3 },
  ],
  includeScore: true,
  isCaseSensitive: false,
  threshold: 0.6,
  distance: 150,
  useExtendedSearch: false,
  includeMatches: true,
});

// Load configuration from fuse.config.json
async function loadFuseConfig() {
  try {
    // Add cache-busting parameter to force fresh load
    const cacheBuster = `?t=${Date.now()}`;

    console.log("🔧 Loading Fuse config...");

    // Try to load from public directory first with cache busting
    let response = await fetch(`/config/fuse.config.json${cacheBuster}`, {
      cache: "no-cache",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    // If that fails, try the fallback path
    if (!response.ok) {
      console.log("⚠️ Config not found in /config, trying fallback path");
      log("search", "Config not found in /config, trying fallback path");
      response = await fetch(`/data/fuse.config.json${cacheBuster}`, {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load Fuse config: ${response.status} ${response.statusText}`
        );
      }
    }

    fuseConfig.value = await response.json();
    console.log("✅ Loaded Fuse.js configuration:", fuseConfig.value);
    log("search", "Loaded Fuse.js configuration from config file");

    // Update Fuse options from config
    if (
      fuseConfig.value &&
      fuseConfig.value.search &&
      fuseConfig.value.search.fuseOptions
    ) {
      fuseOptions.value = fuseConfig.value.search.fuseOptions;
      console.log(
        "✅ Using Fuse.js options from config file:",
        fuseOptions.value
      );
      log("search", "Using Fuse.js options from config file");
    }
  } catch (error) {
    console.error("❌ Error loading Fuse config:", error);
    log("search", "Using default Fuse.js configuration");
  }
}

// Load search index
async function loadSearchIndex() {
  try {
    isInitializing.value = true;
    console.log("🔍 Starting search index loading...");
    log("search", "Loading search index");

    // First load the configuration
    await loadFuseConfig();

    // Determine the index path from config or use default
    const indexPath =
      fuseConfig.value?.search?.indexPath || "/data/search-index.json";
    console.log(`📊 Using search index path: ${indexPath}`);
    log("search", `Using search index path: ${indexPath}`);

    // Add cache-busting parameter to force fresh load
    const cacheBuster = `?t=${Date.now()}`;
    const fullIndexPath = `${indexPath}${cacheBuster}`;

    console.log(`📥 Fetching search index from: ${fullIndexPath}`);

    const response = await fetch(fullIndexPath, {
      cache: "no-cache",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to load search index: ${response.status} ${response.statusText}`
      );
    }

    const rawIndex = await response.json();
    console.log(`✅ Search index loaded successfully:`, rawIndex);

    // Validate and sanitize the search index for security
    searchIndex.value = validateSearchResults(rawIndex);
    console.log(`🔒 Search index validated: ${searchIndex.value.length} items`);

    // Check for any dangerous content in the index
    const dangerousItems = searchIndex.value.filter(
      (item) =>
        containsDangerousContent(item.title) ||
        containsDangerousContent(item.content) ||
        containsDangerousContent(item.description)
    );

    if (dangerousItems.length > 0) {
      console.warn(
        `⚠️ Found ${dangerousItems.length} potentially dangerous items in search index`
      );
      log(
        "search",
        `Security warning: ${dangerousItems.length} items flagged for review`
      );
    }

    // Check for "Rex adipiscing" specifically
    const homepage = searchIndex.value.find(
      (item) => item.path === "/" || item.path === "/index"
    );
    console.log(`🏠 Homepage found:`, homepage);

    if (homepage) {
      console.log(`🏠 Homepage title: "${homepage.title}"`);
      console.log(`🏠 Homepage content type: ${typeof homepage.content}`);
      console.log(
        `🏠 Homepage content length: ${
          homepage.content ? homepage.content.length : "undefined"
        }`
      );

      const hasRexAdipiscing = homepage.content
        ? homepage.content.includes("Rex adipiscing")
        : false;
      console.log(`🏠 Contains "Rex adipiscing": ${hasRexAdipiscing}`);

      if (homepage.content) {
        console.log(
          `🏠 Homepage content preview: "${homepage.content.substring(
            0,
            100
          )}..."`
        );
      } else {
        console.log(`🏠 Homepage content is undefined or null`);
      }
    } else {
      console.log(`🏠 No homepage found in search index`);
    }

    log(
      "search",
      `Search index loaded with ${searchIndex.value.length} validated items`
    );

    // Initialize Fuse.js with the validated index and options
    if (searchIndex.value && searchIndex.value.length > 0) {
      fuseInstance.value = new Fuse(searchIndex.value, fuseOptions.value);
      console.log(`🔍 Fuse.js initialized with options:`, fuseOptions.value);
      console.log("✅ Search index loading completed successfully!");
    } else {
      console.error(
        "❌ Cannot initialize Fuse.js - search index is empty or invalid"
      );
    }

    isInitializing.value = false;
  } catch (error) {
    console.error("❌ Error loading search index:", error);
    isInitializing.value = false;
  }
}

// Perform search with debouncing
let debounceTimeout = null;
function performSearch() {
  // Clear any existing timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Get debounce time from config or use default
  const debounceMs = fuseConfig.value?.search?.debounceMs || 300;

  // Get minimum term length from config or use default
  const minTermLength = fuseConfig.value?.search?.minTermLength || 3;

  // Get excerpt context size from config or use default
  const excerptContextChars =
    fuseConfig.value?.search?.excerptContextChars || 50;

  // Set a new timeout
  debounceTimeout = setTimeout(() => {
    // Use the sanitized query for searching
    const safeQuery = sanitizedSearchQuery.value;

    // Additional security checks
    if (containsDangerousContent(searchQuery.value)) {
      console.warn(
        "⚠️ Potentially dangerous search query blocked:",
        searchQuery.value
      );
      log("search", "Blocked dangerous search query");
      searchResults.value = [];
      return;
    }

    // Check if query is empty or too short
    if (!safeQuery || safeQuery.length <= minTermLength) {
      searchResults.value = [];
      return;
    }

    // Limit query length to prevent DoS attacks
    if (safeQuery.length > 100) {
      console.warn("⚠️ Search query too long, truncating");
      log("search", "Query truncated for security");
    }

    isSearching.value = true;
    console.log(`🔍 Performing search for: "${safeQuery}"`);
    log("search", `Searching for: "${safeQuery}"`);

    try {
      // Check if Fuse instance is available
      if (!fuseInstance.value) {
        console.error(
          "❌ Fuse instance is null - search index may not have loaded properly"
        );
        searchResults.value = [];
        return;
      }

      // Perform search using Fuse.js with sanitized query
      const results = fuseInstance.value.search(safeQuery);
      console.log(`📊 Search results:`, results);

      // Process results to add excerpts with context
      const processedResults = results.map((result) => {
        const item = result.item;

        // Create excerpt from content, focusing on the first match
        let excerpt = item.description || "";
        if (result.matches && result.matches.length > 0) {
          // Find matches in content
          const contentMatches = result.matches.find(
            (match) => match.key === "content"
          );
          if (contentMatches && contentMatches.indices.length > 0) {
            // Get the first match position
            const firstMatch = contentMatches.indices[0];
            const start = Math.max(0, firstMatch[0] - excerptContextChars);
            const end = Math.min(
              item.content.length,
              firstMatch[1] + excerptContextChars
            );

            // Create excerpt with context around the match
            excerpt =
              (start > 0 ? "..." : "") +
              item.content.substring(start, end) +
              (end < item.content.length ? "..." : "");
          }
        }

        return {
          title: sanitizeString(item.title || ""),
          path: sanitizeString(item.path || ""),
          excerpt: sanitizeString(excerpt),
          score: typeof result.score === "number" ? result.score : 0,
          type: sanitizeString(item.type || ""), // Include content type for potential filtering
        };
      });

      // Validate the processed results for security
      searchResults.value = validateSearchResults(processedResults);
      console.log(
        `✅ Final search results (${searchResults.value.length}):`,
        searchResults.value
      );

      log("search", `Found ${searchResults.value.length} results`);
    } catch (error) {
      console.error("❌ Error performing search:", error);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  }, debounceMs);
}

// Watch for changes in search query
watch(searchQuery, () => {
  performSearch();
});

// Clear search
function clearSearch() {
  searchQuery.value = "";
  searchResults.value = [];
}

// Safely highlight matched terms in search results
function safeHighlight(text) {
  if (!text) return "";

  // Get minimum term length from config or use default
  const minTermLength = fuseConfig.value?.search?.minTermLength || 2;

  // Use our safe highlighting function from the sanitize utility
  return safeHighlightMatches(text, searchQuery.value, minTermLength);
}

// Initialize on component mount
onMounted(() => {
  loadSearchIndex();
});
</script>

<style lang="scss" scoped>
/**
 * Search Page Styling - Consistent with PageTitleSection System
 *
 * Implements the standardized page layout with soft light theme background,
 * consistent spacing, and proper content structure to match other pages
 * using the PageTitleSection component. Features enhanced visual contrast
 * for search result cards to improve readability and user experience.
 */

/* Page structure with soft light theme background */
.search-page {
  min-height: 100vh;
  padding-top: 60px; /* Account for sticky header */
  /* Soft light theme background to reduce eye strain */
  background: #fafafa;
}

/* Dark theme background override */
:root[data-theme="dark"] .search-page {
  background: rgb(var(--v-theme-surface));
}

/* Container styling for content areas */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Main content spacing */
.page-content {
  padding: 4.5rem 0; /* Consistent with other pages */
}

/* Search input styling */
.search-input {
  transition: all 0.3s ease;

  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .search-page {
    padding-top: 50px; /* Smaller header offset on mobile */
  }

  .page-content {
    padding: 3rem 0; /* Responsive spacing - reduced from 4.5rem for mobile */
  }

  .container {
    padding: 0 1rem;
  }
}

:deep(.search-result-excerpt) {
  mark {
    background-color: rgba(var(--v-theme-primary), 0.15);
    color: inherit;
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 500;
  }
}

/* Accessibility styles */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.search-result-card {
  /* Enhanced background for better contrast against page backgrounds */
  background: #ffffff !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease,
    background-color 0.3s ease;

  &:focus {
    outline: 2px solid rgba(var(--v-theme-primary), 0.7);
    outline-offset: 2px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
}

/* Dark mode styling with enhanced contrast */
:root[data-theme="dark"] .search-result-card {
  /* Lighter surface color for better contrast against dark page backgrounds */
  background: #2a3441 !important;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
}

/* Ensure highlighted text is accessible */
:deep(.search-result-excerpt mark) {
  /* Ensure sufficient contrast for highlighted text */
  color: rgb(var(--v-theme-on-surface));
  font-weight: 500;
}
</style>
