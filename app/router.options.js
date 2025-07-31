/**
 * Router options for Nuxt 3
 *
 * This file configures the router behavior for the application,
 * specifically setting the scroll behavior to always scroll to the top
 * on route changes and page refresh.
 */

// https://router.vuejs.org/api/#routeroptions
export default {
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top (0, 0) on route changes and page refresh
    return { top: 0, left: 0, behavior: "auto" };
  },
};
