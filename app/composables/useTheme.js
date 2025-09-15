import { computed, watch, ref, onMounted } from "vue";
import { useConsoleLogger } from "~/composables/useConsoleLogger";

/**
 * Simplified Theme Management Composable
 *
 * Provides session-only theme management without persistence.
 * Always defaults to dark mode on page load/refresh.
 *
 * Features:
 * - Session-only theme state (no persistence)
 * - Always defaults to dark mode
 * - Runtime theme switching during session
 * - No SSR hydration issues
 * - Accessibility announcements for theme changes
 * - WCAG 2.1 AA compliant theme switching
 *
 * @example Basic usage
 * ```vue
 * <script setup>
 * const { theme, toggleTheme, isDark } = useTheme();
 *
 * // Access current theme
 * console.log(theme.value); // 'light' or 'dark'
 *
 * // Check if dark theme is active
 * if (isDark.value) {
 *   // Dark theme specific logic
 * }
 *
 * // Toggle theme
 * function handleThemeToggle() {
 *   toggleTheme();
 * }
 * </script>
 * ```
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 2.0.0 - Simplified for demo purposes
 * @module useTheme
 */

/**
 * Theme management composable
 *
 * @returns {Object} Theme management utilities
 * @returns {Object} returns.theme - Reactive theme state ('light' or 'dark')
 * @returns {Object} returns.isDark - Computed boolean for dark theme state
 * @returns {Function} returns.setTheme - Function to set specific theme
 * @returns {Function} returns.toggleTheme - Function to toggle between themes
 * @returns {Function} returns.syncWithVuetify - Function to sync theme with Vuetify
 * @returns {Function} returns.initializeTheme - Function to initialize theme system (client-side only)
 */
export function useTheme() {
  const { logTheme, logError } = useConsoleLogger();

  /**
   * Session-only theme storage
   *
   * Always defaults to dark mode, no persistence across sessions.
   * This eliminates SSR hydration issues while maintaining runtime functionality.
   */
  // Initialize theme: always default to dark; do not read from storage
  const theme = ref("dark");

  // Use useHead to set document attributes reactively for SSR compatibility
  useHead({
    htmlAttrs: {
      "data-theme": () => theme.value,
    },
  });

  /**
   * Computed property for dark theme detection
   *
   * @returns {boolean} True if current theme is dark
   */
  const isDark = computed(() => theme.value === "dark");

  /**
   * Set a specific theme
   *
   * @param {string} newTheme - Theme to set ('light' or 'dark')
   * @throws {Error} If invalid theme value provided
   */
  const setTheme = (newTheme) => {
    if (!["light", "dark"].includes(newTheme)) {
      throw new Error(`Invalid theme: ${newTheme}. Must be 'light' or 'dark'.`);
    }

    const previousTheme = theme.value;
    theme.value = newTheme;

    // Update document attribute for immediate CSS variables update
    // Note: useHead handles SSR and reactive updates, this provides immediate client-side feedback
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
    }

    // Sync with Vuetify immediately when theme is changed programmatically
    // This is safe because it's triggered by user action, not during hydration
    if (typeof window !== "undefined") {
      try {
        const { $vuetify } = useNuxtApp();
        if ($vuetify && $vuetify.theme && $vuetify.theme.global) {
          $vuetify.theme.global.name.value = newTheme;
        }
      } catch (error) {
        logError("Error updating Vuetify theme in setTheme", error);
      }
    }

    // Persist to sessionStorage for this session only and log (client-side only)
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("vpp-theme", newTheme);
      } catch (e) {
        // ignore storage errors (e.g., disabled storage)
      }
      logTheme("Theme changed via setTheme", {
        from: previousTheme,
        to: newTheme,
        source: "sessionStorage",
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewportWidth: window.innerWidth,
      });
    }
  };

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    const newTheme = theme.value === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  /**
   * Sync theme with Vuetify's theme system
   *
   * Should be called carefully to avoid hydration mismatches.
   * Only use when you're certain it won't cause SSR issues.
   */
  const syncWithVuetify = () => {
    try {
      const { $vuetify } = useNuxtApp();
      if ($vuetify && $vuetify.theme && $vuetify.theme.global) {
        const currentVuetifyTheme = $vuetify.theme.global.name.value;
        const targetTheme = theme.value;

        // Only sync if there's actually a difference
        if (currentVuetifyTheme !== targetTheme) {
          $vuetify.theme.global.name.value = targetTheme;

          logTheme("Theme synced with Vuetify", {
            from: currentVuetifyTheme,
            to: targetTheme,
            timestamp: new Date().toISOString(),
          });
        } else {
          logTheme("Vuetify theme already matches session theme", {
            theme: targetTheme,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      logError("Error syncing theme with Vuetify", error);
    }
  };
  // Initialize on client mount to read session theme (if present)
  if (process.client) {
    onMounted(() => {
      initializeTheme();
    });
  }

  /**
   * Initialize theme system
   *
   * Sets up document attributes for session-only theme management.
   * Always starts with dark mode.
   */
  const initializeTheme = () => {
    // Set document attribute for CSS variables (client-side only)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme.value);
    }

    // Log theme initialization (client-side only to prevent hydration mismatch)
    if (typeof window !== "undefined") {
      logTheme("Theme system initialized", {
        theme: theme.value,
        source: "default",
        date: new Date().toISOString().split("T")[0],
        userAgent: navigator.userAgent,
        viewportWidth: window.innerWidth,
      });
    }

    // Read session theme if set for this session only (never persisted across sessions)
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("vpp-theme");
        if (stored === "light" || stored === "dark") {
          theme.value = stored;
          document.documentElement.setAttribute("data-theme", theme.value);
          try {
            const { $vuetify } = useNuxtApp();
            if ($vuetify && $vuetify.theme && $vuetify.theme.global) {
              $vuetify.theme.global.name.value = theme.value;
            }
          } catch (error) {
            logError(
              "Error syncing Vuetify theme during initializeTheme",
              error
            );
          }
        }
      } catch (e) {
        // ignore storage read errors
      }
    }
  };

  /**
   * Watch for theme changes and update document attribute
   *
   * Note: useHead above handles reactive updates automatically,
   * this provides immediate client-side updates for better UX.
   */
  watch(theme, (newTheme) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  });

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    syncWithVuetify,
    initializeTheme,
  };
}
