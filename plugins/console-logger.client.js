/**
 * Console Logger Plugin
 *
 * Initializes the console logger and provides it to the Nuxt app.
 * Only runs on the client side and automatically tracks route changes.
 *
 * This plugin hooks into Nuxt's lifecycle events to log important application
 * events such as route changes, app initialization, mounting, and errors.
 * It makes the logger available globally through Nuxt's provide/inject system.
 */

import { useConsoleLogger } from '~/composables/useConsoleLogger';
import { useRoute, useRouter } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize logger and get route information
  const logger = useConsoleLogger();
  const route = useRoute();
  const router = useRouter();

  // Log initial route
  logger.logRoute('Initial route', {
    path: route.path,
    name: route.name,
    params: route.params,
    query: route.query
  });

  // Log app initialization
  logger.logLifecycle('Nuxt app initialized');

  // Track route changes
  router.beforeEach((to, from) => {
    logger.logRoute('Route change', {
      from: {
        path: from.path,
        name: from.name
      },
      to: {
        path: to.path,
        name: to.name
      }
    });
    return true;
  });

  // Track app lifecycle events
  nuxtApp.hook('app:created', () => {
    logger.logLifecycle('App created');
  });

  nuxtApp.hook('app:beforeMount', () => {
    logger.logLifecycle('App before mount');
  });

  nuxtApp.hook('app:mounted', () => {
    logger.logLifecycle('App mounted');
  });

  nuxtApp.hook('page:start', () => {
    logger.logLifecycle('Page navigation started');
  });

  nuxtApp.hook('page:finish', () => {
    logger.logLifecycle('Page navigation finished');
  });

  nuxtApp.hook('app:error', (error) => {
    logger.logError('App error', error);
  });

  nuxtApp.hook('vue:error', (error) => {
    logger.logError('Vue error', error);
  });

  // Make logger available globally
  return {
    provide: {
      logger
    }
  };
});
