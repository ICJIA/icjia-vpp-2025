<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <div class="d-flex align-center mb-6">
          <v-icon icon="mdi-magnify" size="x-large" class="me-3" aria-hidden="true"></v-icon>
          <h1 class="text-h4 font-weight-bold">Search</h1>
        </div>

        <!-- Search input -->
        <v-card class="mb-8" elevation="2">
          <v-card-text>
            <v-text-field
              v-model="searchQuery"
              label="Search content"
              placeholder="Enter search terms..."
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
        <div v-if="isInitializing" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="mt-4 text-body-1">Loading search index...</div>
        </div>

        <div v-else-if="searchQuery && !isSearching && searchResults.length === 0" class="text-center py-8">
          <v-icon icon="mdi-file-search-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
          <h2 class="text-h5 mb-2">No results found</h2>
          <p class="text-body-1 text-medium-emphasis">
            No content matches your search for "{{ searchQuery }}". Try different keywords or check your spelling.
          </p>
        </div>

        <div v-else-if="searchQuery && !isSearching">
          <div class="mb-4 text-subtitle-1">
            {{ searchResults.length }} {{ searchResults.length === 1 ? 'result' : 'results' }} found
          </div>

          <v-card v-for="(result, index) in searchResults" :key="index" class="mb-4" elevation="1" :to="result.path">
            <v-card-title class="text-h6">
              {{ result.title }}
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 text-medium-emphasis mb-2">
                <v-icon icon="mdi-link-variant" size="small" class="me-1"></v-icon>
                {{ result.path }}
              </p>
              <div v-html="highlightMatches(result.excerpt)" class="search-result-excerpt"></div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                variant="text"
                color="primary"
                :to="result.path"
                class="text-none"
                aria-label="View content"
              >
                View content
                <v-icon icon="mdi-arrow-right" size="small" class="ms-1"></v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>

        <div v-else-if="!searchQuery" class="text-center py-8">
          <v-icon icon="mdi-text-search" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
          <h2 class="text-h5 mb-2">Search content</h2>
          <p class="text-body-1 text-medium-emphasis">
            Enter keywords above to search through all content.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useHead, useSeoMeta } from '#imports';
import Fuse from 'fuse.js';
import { useConsoleLogger } from '~/composables/useConsoleLogger';

// Initialize logger
const { log } = useConsoleLogger();

// Set page title and meta
useHead({
  title: 'Search - Violence Prevention Plan for Illinois: 2025-2029',
  htmlAttrs: {
    lang: 'en'
  }
});

useSeoMeta({
  title: 'Search - Violence Prevention Plan for Illinois: 2025-2029',
  description: 'Search through all content in the Violence Prevention Plan for Illinois: 2025-2029'
});

// State
const searchQuery = ref('');
const searchIndex = ref([]);
const searchResults = ref([]);
const isInitializing = ref(true);
const isSearching = ref(false);
const fuseInstance = ref(null);

// Fuse.js configuration options
const fuseOptions = {
  /**
   * Keys to search in, with weights to prioritize matches
   * - title: highest priority (weight 1.0)
   * - content: medium priority (weight 0.6)
   * - description: medium priority (weight 0.6)
   * - path: lowest priority (weight 0.3)
   */
  keys: [
    { name: 'title', weight: 1.0 },
    { name: 'content', weight: 0.6 },
    { name: 'description', weight: 0.6 },
    { name: 'path', weight: 0.3 }
  ],
  // Include score in results to show relevance
  includeScore: true,
  // Match similar terms (fuzzy matching)
  isCaseSensitive: false,
  // Fuzzy matching threshold (0.0 = exact match, 1.0 = anything matches)
  // Lower values = stricter matching
  threshold: 0.3,
  // Determine if the match should be included in the result set
  // Lower values = more exact matches
  distance: 100,
  // Will search all fields by default
  useExtendedSearch: false,
  // Include matches information for highlighting
  includeMatches: true
};

// Load search index
async function loadSearchIndex() {
  try {
    isInitializing.value = true;
    log('search', 'Loading search index');

    const response = await fetch('/data/search-index.json');
    if (!response.ok) {
      throw new Error(`Failed to load search index: ${response.status} ${response.statusText}`);
    }

    searchIndex.value = await response.json();
    log('search', `Search index loaded with ${searchIndex.value.length} items`);

    // Initialize Fuse.js with the loaded index
    fuseInstance.value = new Fuse(searchIndex.value, fuseOptions);

    isInitializing.value = false;
  } catch (error) {
    console.error('Error loading search index:', error);
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

  // Set a new timeout
  debounceTimeout = setTimeout(() => {
    if (!searchQuery.value.trim()) {
      searchResults.value = [];
      return;
    }

    isSearching.value = true;
    log('search', `Searching for: "${searchQuery.value}"`);

    try {
      // Perform search using Fuse.js
      const results = fuseInstance.value.search(searchQuery.value);

      // Process results to add excerpts with context
      searchResults.value = results.map(result => {
        const item = result.item;

        // Create excerpt from content, focusing on the first match
        let excerpt = item.description;
        if (result.matches && result.matches.length > 0) {
          // Find matches in content
          const contentMatches = result.matches.find(match => match.key === 'content');
          if (contentMatches && contentMatches.indices.length > 0) {
            // Get the first match position
            const firstMatch = contentMatches.indices[0];
            const start = Math.max(0, firstMatch[0] - 50);
            const end = Math.min(item.content.length, firstMatch[1] + 50);

            // Create excerpt with context around the match
            excerpt = (start > 0 ? '...' : '') +
                      item.content.substring(start, end) +
                      (end < item.content.length ? '...' : '');
          }
        }

        return {
          title: item.title,
          path: item.path,
          excerpt: excerpt,
          score: result.score
        };
      });

      log('search', `Found ${searchResults.value.length} results`);
    } catch (error) {
      console.error('Error performing search:', error);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  }, 300); // 300ms debounce delay
}

// Watch for changes in search query
watch(searchQuery, () => {
  performSearch();
});

// Clear search
function clearSearch() {
  searchQuery.value = '';
  searchResults.value = [];
}

// Highlight matched terms in search results
function highlightMatches(text) {
  if (!searchQuery.value.trim() || !text) return text;

  // Simple highlighting implementation
  // For more complex needs, consider using a dedicated library
  const terms = searchQuery.value.trim().split(/\s+/);
  let highlightedText = text;

  terms.forEach(term => {
    if (term.length < 3) return; // Skip short terms

    // Case-insensitive global replace
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });

  return highlightedText;
}

// Initialize on component mount
onMounted(() => {
  loadSearchIndex();
});
</script>

<style lang="scss" scoped>
.search-input {
  transition: all 0.3s ease;

  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
</style>