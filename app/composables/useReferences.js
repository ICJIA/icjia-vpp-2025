/**
 * References Composable - Simplified Version
 *
 * Simple reference loader with no caching - fetches fresh data every time.
 * This avoids race conditions and complex state management.
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 2.0.0
 * @since 2025-06-04
 */

/**
 * Simple reference loader - no caching, just fetch every time
 *
 * Loads a single reference from the references.json file. This function
 * fetches fresh data on every call to avoid caching issues and race conditions.
 * The reference ID is trimmed of whitespace before lookup.
 *
 * @param {string} referenceId - The reference ID to lookup (will be trimmed)
 * @returns {Promise<Object|null>} Reference object with citation data or null if not found
 * @returns {Promise<Object>} returns.id - The reference ID
 * @returns {Promise<Object>} returns.shortCitation - Short form citation
 * @returns {Promise<Object>} returns.fullCitation - Full form citation
 * @returns {Promise<Object>} returns.url - URL if available
 * @returns {Promise<Object>} returns.type - Reference type (e.g., 'report', 'article')
 *
 * @throws {Error} If fetch fails or response format is invalid
 *
 * @example
 * const ref = await loadReference('cdc-2023-violence-prevention');
 * if (ref) {
 *   console.log(ref.shortCitation); // "CDC (2023)"
 *   console.log(ref.fullCitation); // "Centers for Disease Control..."
 * }
 */
const loadReference = async (referenceId) => {
  try {
    console.log(`🔍 Loading reference: "${referenceId}"`);

    // Fetch the data fresh every time
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

    console.log(
      `📄 Loaded ${Object.keys(data.references).length} total references`,
    );

    const trimmedId = referenceId.trim();
    const reference = data.references[trimmedId];

    if (!reference) {
      console.warn(`❌ Reference not found: ${referenceId}`);
      return null;
    }

    console.log(`✅ Found reference: ${reference.shortCitation}`);
    return reference;
  } catch (error) {
    console.error(`❌ Error loading reference ${referenceId}:`, error);
    return null;
  }
};

/**
 * Load multiple references from comma-separated IDs
 *
 * Parses a comma-separated string of reference IDs and loads each reference.
 * Missing references are logged as warnings but don't cause the function to fail.
 * Each ID is trimmed of whitespace before lookup.
 *
 * @param {string} referenceIds - Comma-separated reference IDs (e.g., "ref1, ref2, ref3")
 * @returns {Promise<Array<Object>>} Array of reference objects (excludes not found references)
 * @returns {Promise<Array<Object>>} returns[].id - The reference ID
 * @returns {Promise<Array<Object>>} returns[].shortCitation - Short form citation
 * @returns {Promise<Array<Object>>} returns[].fullCitation - Full form citation
 *
 * @throws {Error} If fetch fails or response format is invalid
 *
 * @example
 * const refs = await loadMultipleReferences('cdc-2023, who-2024, local-study');
 * console.log(`Found ${refs.length} references`);
 * refs.forEach(ref => console.log(ref.shortCitation));
 */
const loadMultipleReferences = async (referenceIds) => {
  try {
    console.log(`🔍 Loading multiple references: "${referenceIds}"`);

    // Fetch the data fresh every time
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

    // Split by comma and clean up whitespace
    const ids = referenceIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const references = [];
    for (const id of ids) {
      const reference = data.references[id];
      if (reference) {
        references.push(reference);
      } else {
        console.warn(`❌ Reference not found: ${id}`);
      }
    }

    console.log(`✅ Found ${references.length} of ${ids.length} references`);
    return references;
  } catch (error) {
    console.error(
      `❌ Error loading multiple references ${referenceIds}:`,
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
