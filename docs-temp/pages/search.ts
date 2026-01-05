/**
 * @module search
 * @fileoverview Vue component: search
 */

import { ref, watch, computed } from "vue";
import { useHead, useSeoMeta } from "#imports";
import { useConsoleLogger } from "~/composables/useConsoleLogger";
import {
  sanitizeString,
  sanitizeSearchQuery,
  safeHighlightMatches,
  createHighlightedSnippets,
  createFallbackExcerpt,
  validateSearchResults,
  containsDangerousContent,
} from "~/utils/sanitize";
import PageTitleSection from "~/components/content/PageTitleSection.vue";
import StructuredData from "~/components/seo/StructuredData.vue";
import IntersectionSection from "~/components/IntersectionSection.vue";

// Lazy load search interface with heavy Vuetify components
const LazySearchInterface = defineAsyncComponent(
  () => import("~/components/content/SearchInterface.vue")
);

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
const isInitializing = ref(false); // Changed: Start as false, only initialize when needed
const isSearching = ref(false);
const fuseInstance = ref(null);
const searchInitialized = ref(false); // New: Track if search has been initialized

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
const fuseOptions = ref(null);

// Load configuration from fuse.config.json
async function loadFuseConfig() {
  try {
    // Add cache-busting parameter to force fresh load (client-side only to prevent hydration mismatch)
    const cacheBuster = typeof window !== "undefined" ? `?t=${Date.now()}` : "";

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

    // Extract Fuse options from config
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
    } else {
      throw new Error(
        "Invalid config file structure - missing search.fuseOptions"
      );
    }
  } catch (error) {
    console.error("❌ Error loading Fuse config:", error);
    log(
      "search",
      "Failed to load Fuse.js configuration - search will not work"
    );
    // Don't provide fallback - force proper config file usage
    throw new Error("Search configuration is required but could not be loaded");
  }
}

// Lazy load Fuse.js and initialize search functionality
async function initializeSearch() {
  if (searchInitialized.value) {
    return; // Already initialized
  }

  try {
    isInitializing.value = true;
    console.log("🔍 Lazy loading search functionality...");
    log("search", "Initializing search on demand");

    // Dynamically import Fuse.js only when needed
    const { default: Fuse } = await import("fuse.js");
    console.log("✅ Fuse.js loaded dynamically");

    // Load search index and configuration
    await loadSearchIndex(Fuse);

    searchInitialized.value = true;
    console.log("✅ Search functionality fully initialized");
  } catch (error) {
    console.error("❌ Error initializing search:", error);
    log("search", "Failed to initialize search functionality");
    isInitializing.value = false;
  }
}

// Load search index (now accepts Fuse as parameter)
async function loadSearchIndex(Fuse) {
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

    // Add cache-busting parameter to force fresh load (client-side only to prevent hydration mismatch)
    const cacheBuster = typeof window !== "undefined" ? `?t=${Date.now()}` : "";
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
          `🏠 Homepage content preview: "${homepage.content.substring(0, 100)}..."`
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
    if (
      searchIndex.value &&
      searchIndex.value.length > 0 &&
      fuseOptions.value
    ) {
      fuseInstance.value = new Fuse(searchIndex.value, fuseOptions.value);
      console.log(`🔍 Fuse.js initialized with options:`, fuseOptions.value);
      console.log("✅ Search index loading completed successfully!");
    } else {
      console.error(
        "❌ Cannot initialize Fuse.js - search index is empty, invalid, or config not loaded"
      );
    }

    isInitializing.value = false;
  } catch (error) {
    console.error("❌ Error loading search index:", error);
    isInitializing.value = false;
  }
}

// Perform search with debouncing and lazy initialization
let debounceTimeout = null;
async function performSearch() {
  // Clear any existing timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Initialize search functionality if not already done
  if (!searchInitialized.value) {
    await initializeSearch();
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

      // Process results to add excerpts with context using enhanced highlighting
      const processedResults = results
        .map((result) => {
          const item = result.item;

          // Create highlighted excerpt using Fuse.js match data
          let excerpt = "";

          // Always try to create highlighted snippets if we have matches
          // We'll check if highlighting actually worked later
          if (result.matches && result.matches.length > 0) {
            excerpt = createHighlightedSnippets(
              result,
              "content",
              excerptContextChars,
              2,
              safeQuery
            );

            // If no content matches, try title matches
            if (!excerpt) {
              excerpt = createHighlightedSnippets(
                result,
                "title",
                excerptContextChars,
                1,
                safeQuery
              );
            }

            // If no title matches, try description matches
            if (!excerpt) {
              excerpt = createHighlightedSnippets(
                result,
                "description",
                excerptContextChars,
                1,
                safeQuery
              );
            }
          }

          // If no highlighted excerpts were created, use fallback
          if (!excerpt) {
            excerpt = createFallbackExcerpt(
              item,
              "content",
              excerptContextChars * 2
            );

            // If still no excerpt, try description
            if (!excerpt) {
              excerpt = createFallbackExcerpt(
                item,
                "description",
                excerptContextChars * 2
              );
            }
          }

          // Highlight search terms in the title as well
          const highlightedTitle = safeHighlightMatches(
            item.title || "",
            searchQuery.value,
            2 // Use minimum term length of 2 for title highlighting
          );

          // Calculate adjusted score - prioritize exact matches over partial matches
          const searchTerms = safeQuery
            .toLowerCase()
            .split(/\s+/)
            .filter((term) => term.length >= 2);
          const itemText = [
            item.title || "",
            item.content || "",
            item.description || "",
          ]
            .join(" ")
            .toLowerCase();

          // Check for exact word matches (highest priority)
          // Only consider text that would actually be highlighted by Fuse.js
          const hasExactMatch = searchTerms.some((term) => {
            if (term.length < 2) return false; // Skip very short terms

            // Check if any of the Fuse.js matched fields contain exact word matches
            if (result.matches && result.matches.length > 0) {
              return result.matches.some((match) => {
                const matchText = match.value.toLowerCase();
                const wordBoundaryRegex = new RegExp(
                  `\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
                  "i"
                );
                return wordBoundaryRegex.test(matchText);
              });
            }

            return false;
          });

          // Check for partial matches (lower priority)
          // Only consider text that would actually be highlighted by Fuse.js
          const hasPartialMatch =
            !hasExactMatch &&
            searchTerms.some((term) => {
              if (term.length < 2) return false; // Skip very short terms

              // Check if any of the Fuse.js matched fields contain the search term as substring
              if (result.matches && result.matches.length > 0) {
                return result.matches.some((match) => {
                  const matchText = match.value.toLowerCase();

                  // Check if search term is contained in matched content
                  if (matchText.includes(term)) {
                    // Make sure it's not already counted as an exact match
                    const wordBoundaryRegex = new RegExp(
                      `\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
                      "i"
                    );
                    return !wordBoundaryRegex.test(matchText);
                  }

                  // Check if search term is a prefix of any word in matched content
                  const words = matchText.split(/\s+/);
                  return words.some(
                    (word) => word.startsWith(term) && word !== term
                  );
                });
              }

              return false;
            });
          // Create tiered scoring system:
          // Fuse.js scores: 0 = perfect match, 1 = poor match
          // We want: exact matches first, then partial matches, then fuzzy-only
          const originalScore =
            typeof result.score === "number" ? result.score : 1;
          let adjustedScore;

          if (hasExactMatch) {
            adjustedScore = 0 + originalScore; // Tier 1: 0.0 - 1.0 range
          } else if (hasPartialMatch) {
            adjustedScore = 10 + originalScore; // Tier 2: 10.0 - 11.0 range
          } else {
            adjustedScore = 20 + originalScore; // Tier 3: 20.0 - 21.0 range
          }

          return {
            title: sanitizeString(item.title || ""), // Plain text title without highlighting
            titlePlain: sanitizeString(item.title || ""), // Plain text version for accessibility
            path: sanitizeString(item.path || ""),
            excerpt: excerpt, // Already sanitized by the highlighting functions
            score: typeof result.score === "number" ? result.score : 0, // Original score for debugging
            adjustedScore: adjustedScore, // Score used for sorting
            type: sanitizeString(item.type || ""), // Include content type for potential filtering
            matches: result.matches || [], // Include match data for potential debugging
            hasExactMatch: hasExactMatch, // Track if result has exact match
            hasPartialMatch: hasPartialMatch, // Track if result has partial match
          };
        })
        // Sort by adjusted score (lower scores = better matches)
        // Tier 1: 0.0-1.0 (exact matches), Tier 2: 10.0-11.0 (partial), Tier 3: 20.0-21.0 (fuzzy)
        .sort((a, b) => a.adjustedScore - b.adjustedScore);

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

// Search is now initialized lazily when user starts typing
// No need for onMounted initialization
