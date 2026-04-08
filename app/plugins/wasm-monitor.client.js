/**
 * WASM Loading Monitor Plugin
 *
 * This client-side plugin monitors for WASM file loading and provides
 * console logging to track when SQLite WASM files are loaded by Nuxt Content.
 * 
 * Features:
 * - Detects WASM file loading via network monitoring
 * - Logs WASM loading events with file sizes and timing
 * - Monitors for SQLite-specific WASM files
 * - Provides performance insights for optimization
 *
 * @module WASMMonitorPlugin
 */

import { useConsoleLogger } from "~/composables/useConsoleLogger";

export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (process.server) return;

  const { log, logPerf } = useConsoleLogger();

  /**
   * Monitor for WASM file loading using Performance Observer
   */
  function setupWASMMonitoring() {
    // Check if PerformanceObserver is available
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('⚠️ PerformanceObserver not available - WASM monitoring disabled');
      return;
    }

    try {
      // Create performance observer to monitor resource loading
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          // Check if this is a WASM file
          if (entry.name.includes('.wasm') || entry.name.includes('sqlite')) {
            const fileSize = entry.transferSize || entry.encodedBodySize || 'unknown';
            const loadTime = entry.duration || (entry.responseEnd - entry.startTime);
            
            // Log WASM loading event
            false && console.log(
              `🔧 WASM LOADED: ${entry.name.split('/').pop()}`,
              `\n📦 Size: ${formatBytes(fileSize)}`,
              `\n⏱️ Load Time: ${loadTime.toFixed(2)}ms`,
              `\n🔗 URL: ${entry.name}`
            );
            
            // Use project's logging system
            logPerf('WASM file loaded', {
              filename: entry.name.split('/').pop(),
              size: fileSize,
              loadTime: loadTime.toFixed(2),
              url: entry.name,
              timestamp: new Date().toISOString()
            });

            // Special handling for SQLite WASM files
            if (entry.name.includes('sqlite')) {
              false && console.log(
                `🗄️ SQLite WASM detected - this is from Nuxt Content v3`,
                `\n📊 Impact: ${formatBytes(fileSize)} added to bundle`,
                `\n💡 Note: Your search uses Fuse.js, not SQLite`
              );
              
              log('content', 'SQLite WASM loaded by Nuxt Content', {
                filename: entry.name.split('/').pop(),
                size: fileSize,
                note: 'This is from Nuxt Content, not used by search functionality'
              });
            }
          }
        });
      });

      // Start observing resource loading
      observer.observe({ entryTypes: ['resource'] });
      
      false && console.log('🔍 WASM monitoring active - will log when WASM files are loaded');
      log('perf', 'WASM monitoring initialized');

    } catch (error) {
      console.warn('⚠️ Failed to setup WASM monitoring:', error);
    }
  }

  /**
   * Monitor for existing WASM files that may have already loaded
   */
  function checkExistingWASM() {
    try {
      // Check performance entries for already loaded WASM files
      const entries = performance.getEntriesByType('resource');
      const wasmEntries = entries.filter(entry => 
        entry.name.includes('.wasm') || entry.name.includes('sqlite')
      );

      if (wasmEntries.length > 0) {
        false && console.log(`🔧 Found ${wasmEntries.length} WASM file(s) already loaded:`);
        
        wasmEntries.forEach((entry) => {
          const fileSize = entry.transferSize || entry.encodedBodySize || 'unknown';
          const loadTime = entry.duration || (entry.responseEnd - entry.startTime);
          
          false && console.log(
            `📦 ${entry.name.split('/').pop()}: ${formatBytes(fileSize)} (${loadTime.toFixed(2)}ms)`
          );
        });
      }
    } catch (error) {
      console.warn('⚠️ Failed to check existing WASM files:', error);
    }
  }

  /**
   * Format bytes into human-readable format
   * @param {number} bytes - Number of bytes
   * @returns {string} Formatted string
   */
  function formatBytes(bytes) {
    if (bytes === 'unknown' || !bytes) return 'unknown size';
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Initialize monitoring when DOM is ready
   */
  function initialize() {
    false && console.log('🔧 WASM Monitor: Initializing...');
    
    // Check for already loaded WASM files
    checkExistingWASM();
    
    // Setup monitoring for future WASM loads
    setupWASMMonitoring();
    
    false && console.log('🔧 WASM Monitor: Ready');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM is already ready
    setTimeout(initialize, 100); // Small delay to ensure other plugins are loaded
  }
});
