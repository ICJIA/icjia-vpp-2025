/**
 * Error Handler Plugin
 * 
 * Intercepts and handles common errors in a more graceful way.
 * Specifically targets 404 "Page not found" errors to prevent console noise in production.
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Original console.error function
  const originalConsoleError = console.error;
  
  // Override console.error to filter out expected 404 errors
  console.error = (...args) => {
    // Check if this is a "Page not found" error
    const errorString = args.join(' ');
    const is404Error = 
      (typeof errorString === 'string' && 
       (errorString.includes('Page not found:') || 
        errorString.includes('[nuxt] error caught during app initialization') && 
        errorString.includes('Page not found:')));
    
    // In production, suppress 404 errors from the console
    // They're expected when users navigate to non-existent pages
    if (process.env.NODE_ENV === 'production' && is404Error) {
      // Optionally, we could log a more friendly message here
      // console.info('User navigated to a non-existent page, showing 404 page');
      return;
    }
    
    // For all other errors, or in development mode, use the original console.error
    originalConsoleError.apply(console, args);
  };
  
  // No need to provide anything to the app
});
