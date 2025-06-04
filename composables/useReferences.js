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
 * @param {string} referenceId - The reference ID to lookup
 * @returns {Promise<Object|null>} Reference object or null if not found
 */
const loadReference = async (referenceId) => {
  try {
    console.log(`🔍 Loading reference: "${referenceId}"`);

    // Fetch the data fresh every time
    const response = await fetch('/data/references.json');

    if (!response.ok) {
      throw new Error(`Failed to load references: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.references) {
      throw new Error('Invalid reference data format');
    }

    console.log(`📄 Loaded ${Object.keys(data.references).length} total references`);

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
 * Load multiple references
 *
 * @param {string} referenceIds - Comma-separated reference IDs
 * @returns {Promise<Array>} Array of reference objects
 */
const loadMultipleReferences = async (referenceIds) => {
  try {
    console.log(`🔍 Loading multiple references: "${referenceIds}"`);

    // Fetch the data fresh every time
    const response = await fetch('/data/references.json');

    if (!response.ok) {
      throw new Error(`Failed to load references: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.references) {
      throw new Error('Invalid reference data format');
    }

    // Split by comma and clean up whitespace
    const ids = referenceIds.split(',').map(id => id.trim()).filter(Boolean);

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
    console.error(`❌ Error loading multiple references ${referenceIds}:`, error);
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
    if (!referenceId || typeof referenceId !== 'string') {
      console.warn('Invalid reference ID provided:', referenceId);
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
    if (!referenceIds || typeof referenceIds !== 'string') {
      console.warn('Invalid reference IDs provided:', referenceIds);
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
      return 'References not found';
    }

    if (references.length === 1) {
      return references[0].fullCitation || references[0].shortCitation || 'Citation unavailable';
    }

    // For multiple references, show full citations separated by double line breaks
    const fullCitations = references
      .map((ref, index) => {
        const citation = ref.fullCitation || ref.shortCitation || `Citation unavailable for ${ref.id}`;
        return `${index + 1}. ${citation}`;
      })
      .join('\n\n');

    return `Multiple References:\n\n${fullCitations}`;
  };

  return {
    // Methods
    getReference,
    getMultipleReferences,
    formatMultipleReferences
  };
};
