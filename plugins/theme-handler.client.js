// This plugin runs only on the client side
// It sets the theme before Vue hydration to prevent flash of incorrect theme

export default defineNuxtPlugin(() => {
  // This code runs before the app is mounted
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Try to get theme from localStorage
    try {
      const savedTheme = localStorage.getItem('theme-preference');
      
      // If there's a saved theme, apply it immediately
      if (savedTheme) {
        // Apply to document for potential CSS usage
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Add a class to the body to prevent flash
        document.body.classList.add(`theme-${savedTheme}`);
      } else {
        // Default to light theme if no preference
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.add('theme-light');
      }
    } catch (e) {
      console.error('Error accessing localStorage in plugin:', e);
    }
  }
});
