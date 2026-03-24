/**
 * References Composable
 *
 * Reference loader with in-memory caching to avoid redundant fetches.
 * Caches references.json after first load for the lifetime of the page.
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 3.0.0
 * @since 2025-06-04
 */

// Module-level cache — shared across all composable instances, lives for the page session
let _referencesCache = null;
let _referencesFetchPromise = null;

/**
 * Fetch and cache references data. Returns cached data on subsequent calls.
 * Uses a shared promise to prevent duplicate concurrent fetches.
 *
 * @returns {Promise<Object|null>} The references map or null on failure
 */
const fetchReferencesData = async () => {
  // Return cached data immediately if available
  if (_referencesCache) {
    return _referencesCache;
  }

  // If a fetch is already in progress, reuse it to avoid duplicate requests
  if (_referencesFetchPromise) {
    return _referencesFetchPromise;
  }

  _referencesFetchPromise = (async () => {
    try {
      const response = await fetch("/data/references.json");

      if (!response.ok) {
        throw new Error(
          `Failed to load references: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data || !data.references) {
        throw new Error("Invalid reference data format");
      }

      _referencesCache = data.references;
      return _referencesCache;
    } catch (error) {
      console.error("Error fetching references data:", error);
      return null;
    } finally {
      _referencesFetchPromise = null;
    }
  })();

  return _referencesFetchPromise;
};

/**
 * Load a single reference by ID, using cached data.
 *
 * @param {string} referenceId - The reference ID to lookup (will be trimmed)
 * @returns {Promise<Object|null>} Reference object or null if not found
 */
const loadReference = async (referenceId) => {
  try {
    const references = await fetchReferencesData();

    if (!references) {
      return null;
    }

    const trimmedId = referenceId.trim();
    const reference = references[trimmedId];

    if (!reference) {
      console.warn(`Reference not found: ${referenceId}`);
      return null;
    }

    return reference;
  } catch (error) {
    console.error(`Error loading reference ${referenceId}:`, error);
    return null;
  }
};

/**
 * Load multiple references from comma-separated IDs, using cached data.
 *
 * @param {string} referenceIds - Comma-separated reference IDs
 * @returns {Promise<Array<Object>>} Array of found reference objects
 */
const loadMultipleReferences = async (referenceIds) => {
  try {
    const references = await fetchReferencesData();

    if (!references) {
      return [];
    }

    const ids = referenceIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const results = [];
    for (const id of ids) {
      const reference = references[id];
      if (reference) {
        results.push(reference);
      } else {
        console.warn(`Reference not found: ${id}`);
      }
    }

    return results;
  } catch (error) {
    console.error(
      `Error loading multiple references ${referenceIds}:`,
      error,
    );
    return [];
  }
};

/**
 * References composable function
 *
 * @returns {Object} References management utilities
 */
export const useReferences = () => {
  /**
   * Get a single reference by ID
   *
   * @param {string} referenceId - The reference ID to lookup
   * @returns {Promise<Object|null>} Reference object or null if not found
   */
  const getReference = async (referenceId) => {
    if (!referenceId || typeof referenceId !== "string") {
      console.warn("Invalid reference ID provided:", referenceId);
      return null;
    }

    return await loadReference(referenceId);
  };

  /**
   * Get multiple references by comma-separated IDs
   *
   * @param {string} referenceIds - Comma-separated reference IDs
   * @returns {Promise<Array>} Array of reference objects
   */
  const getMultipleReferences = async (referenceIds) => {
    if (!referenceIds || typeof referenceIds !== "string") {
      console.warn("Invalid reference IDs provided:", referenceIds);
      return [];
    }

    return await loadMultipleReferences(referenceIds);
  };

  /**
   * Format multiple references for display
   *
   * @param {Array} references - Array of reference objects
   * @returns {string} Formatted citation text
   */
  const formatMultipleReferences = (references) => {
    if (!references || references.length === 0) {
      return "References not found";
    }

    if (references.length === 1) {
      return (
        references[0].fullCitation ||
        references[0].shortCitation ||
        "Citation unavailable"
      );
    }

    // For multiple references, show full citations separated by double line breaks
    const fullCitations = references
      .map((ref, index) => {
        const citation =
          ref.fullCitation ||
          ref.shortCitation ||
          `Citation unavailable for ${ref.id}`;
        return `${index + 1}. ${citation}`;
      })
      .join("\n\n");

    return `Multiple References:\n\n${fullCitations}`;
  };

  return {
    // Methods
    getReference,
    getMultipleReferences,
    formatMultipleReferences,
  };
};
