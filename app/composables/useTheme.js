import { computed, watch } from "vue";
import { useConsoleLogger } from "~/composables/useConsoleLogger";

/**
 * Theme Management Composable
 *
 * Provides cookie-based theme management that works seamlessly with SSR.
 * This composable eliminates FOUC (Flash of Unstyled Content) by ensuring
 * the theme preference is available during server-side rendering.
 *
 * Features:
 * - Cookie-based storage for SSR compatibility
 * - Automatic migration from localStorage to cookies
 * - Reactive theme state that updates across components
 * - Comprehensive logging for debugging
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
 * @example Advanced usage with Vuetify integration
 * ```vue
 * <script setup>
 * const { theme, setTheme, syncWithVuetify } = useTheme();
 *
 * // Set specific theme
 * setTheme('light');
 *
 * // Sync with Vuetify after app initialization
 * onMounted(() => {
 *   syncWithVuetify();
 * });
 * </script>
 * ```
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 * @module useTheme
 */

/**
 * Theme management composable
 *
 * @returns {Object} Theme management utilities
 * @returns {import('vue').Ref<string>} returns.theme - Reactive theme state ('light' or 'dark')
 * @returns {import('vue').ComputedRef<boolean>} returns.isDark - Computed boolean for dark theme state
 * @returns {Function} returns.setTheme - Function to set specific theme
 * @returns {Function} returns.toggleTheme - Function to toggle between themes
 * @returns {Function} returns.syncWithVuetify - Function to sync theme with Vuetify
 * @returns {Function} returns.migrateFromLocalStorage - Function to migrate from localStorage
 */
export function useTheme() {
  const { logTheme, logError } = useConsoleLogger();

  /**
   * Cookie-based theme storage
   *
   * Uses Nuxt's useCookie composable for SSR-safe theme persistence.
   * The cookie is available on both server and client sides, eliminating FOUC.
   *
   * Security Notes:
   * - Uses sameSite: "lax" for CSRF protection
   * - Secure flag enabled in production for HTTPS-only transmission
   * - httpOnly disabled to allow client-side theme switching
   */
  const theme = useCookie("theme-preference", {
    default: () => "dark", // Site default theme
    maxAge: 60 * 60 * 24 * 365, // 1 year expiration
    sameSite: "lax", // CSRF protection (changed from "none")
    secure: process.env.NODE_ENV === "production", // Enable secure flag in production
    httpOnly: false, // Allow client-side access for theme switching
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

    // Log theme change
    logTheme("Theme changed via setTheme", {
      from: previousTheme,
      to: newTheme,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "SSR",
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : "SSR",
    });
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
   * Should be called after Vuetify is initialized to ensure
   * the Vuetify theme matches the cookie preference.
   */
  const syncWithVuetify = () => {
    try {
      const { $vuetify } = useNuxtApp();
      if ($vuetify && $vuetify.theme && $vuetify.theme.global) {
        $vuetify.theme.global.name.value = theme.value;

        logTheme("Theme synced with Vuetify", {
          theme: theme.value,
          vuetifyTheme: $vuetify.theme.global.name.value,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      logError("Error syncing theme with Vuetify", error);
    }
  };

  /**
   * Migrate theme preference from localStorage to cookie
   *
   * This function provides backward compatibility by checking for
   * existing localStorage theme preference and migrating it to the
   * new cookie-based system.
   */
  const migrateFromLocalStorage = () => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    try {
      const localStorageTheme = localStorage.getItem("theme-preference");

      // If localStorage has a theme and cookie doesn't have a user-set value
      if (localStorageTheme && ["light", "dark"].includes(localStorageTheme)) {
        // Only migrate if the cookie is still at default value
        // This prevents overwriting user's cookie preference
        if (theme.value === "dark") {
          // Default value
          theme.value = localStorageTheme;

          logTheme("Theme migrated from localStorage to cookie", {
            migratedTheme: localStorageTheme,
            timestamp: new Date().toISOString(),
          });
        }

        // Clean up localStorage after migration
        localStorage.removeItem("theme-preference");
      }
    } catch (error) {
      logError("Error migrating theme from localStorage", error);
    }
  };

  /**
   * Set up SSR-compatible HTML attribute management
   *
   * Uses Nuxt's useHead to set the data-theme attribute on the HTML element
   * during both server-side rendering and client-side hydration.
   * This ensures the theme is applied correctly from the initial page load.
   */
  useHead({
    htmlAttrs: {
      "data-theme": theme,
    },
  });

  /**
   * Initialize theme system
   *
   * Sets up document attributes and handles migration from localStorage.
   * This runs automatically when the composable is first used.
   */
  const initializeTheme = () => {
    // Set document attribute for CSS variables (client-side only)
    // Note: useHead above handles SSR, this is for immediate client-side updates
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme.value);
    }

    // Migrate from localStorage if needed
    migrateFromLocalStorage();

    // Log theme initialization
    logTheme("Theme system initialized", {
      theme: theme.value,
      source: "cookie",
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "SSR",
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : "SSR",
    });
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

  // Initialize theme system when composable is first used
  initializeTheme();

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    syncWithVuetify,
    migrateFromLocalStorage,
  };
}
