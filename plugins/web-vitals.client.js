/**
 * Core Web Vitals Tracking Plugin
 *
 * Client-side plugin for tracking Core Web Vitals metrics in the Illinois Violence
 * Prevention Project (ICJIA VPP 2025). This plugin automatically measures and reports
 * performance metrics to help monitor and optimize user experience.
 *
 * Tracks the following Core Web Vitals:
 * - Largest Contentful Paint (LCP) - Loading performance
 * - Interaction to Next Paint (INP) - Interactivity (replaces FID in v5)
 * - Cumulative Layout Shift (CLS) - Visual stability
 * - First Contentful Paint (FCP) - Loading performance
 * - Time to First Byte (TTFB) - Server response time
 *
 * @see https://web.dev/vitals/
 * @see https://github.com/GoogleChrome/web-vitals
 * @author Illinois Criminal Justice Information Authority
 * @license MIT
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from "web-vitals";

/**
 * Performance metrics storage for batch reporting
 * @type {Array<Object>}
 */
let performanceMetrics = [];

/**
 * Configuration for Core Web Vitals tracking
 * @type {Object}
 */
const webVitalsConfig = {
  // Enable/disable tracking based on environment
  enabled: true,

  // Batch size for metric reporting
  batchSize: 10,

  // Reporting interval in milliseconds (5 minutes)
  reportingInterval: 5 * 60 * 1000,

  // Debug mode for development
  debug: process.env.NODE_ENV === "development",

  // Performance thresholds per project guidelines
  thresholds: {
    LCP: { good: 2500, poor: 4000 }, // <2.5s good, >4s poor
    INP: { good: 200, poor: 500 }, // <200ms good, >500ms poor (replaces FID)
    CLS: { good: 0.1, poor: 0.25 }, // <0.1 good, >0.25 poor
    FCP: { good: 1800, poor: 3000 }, // <1.8s good, >3s poor
    TTFB: { good: 800, poor: 1800 }, // <800ms good, >1.8s poor
  },
};

/**
 * Determines performance rating based on thresholds
 * @param {string} metricName - Name of the metric (LCP, FID, CLS, etc.)
 * @param {number} value - Metric value
 * @returns {string} Rating: 'good', 'needs-improvement', or 'poor'
 */
function getPerformanceRating(metricName, value) {
  const threshold = webVitalsConfig.thresholds[metricName];
  if (!threshold) return "unknown";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

/**
 * Logs performance metrics to console in development mode
 * @param {Object} metric - Web Vitals metric object
 */
function logMetricToConsole(metric) {
  if (!webVitalsConfig.debug) return;

  const rating = getPerformanceRating(metric.name, metric.value);
  const emoji =
    rating === "good" ? "✅" : rating === "needs-improvement" ? "⚠️" : "❌";

  console.group(`${emoji} Core Web Vitals: ${metric.name}`);
  console.log(`Value: ${metric.value}${metric.name === "CLS" ? "" : "ms"}`);
  console.log(`Rating: ${rating}`);
  console.log(`ID: ${metric.id}`);
  console.log(`Delta: ${metric.delta}`);
  if (metric.entries?.length) {
    console.log("Entries:", metric.entries);
  }
  console.groupEnd();
}

/**
 * Sends performance metrics to analytics or monitoring service
 * @param {Object} metric - Web Vitals metric object
 */
function sendMetricToAnalytics(metric) {
  try {
    // Add performance rating
    const rating = getPerformanceRating(metric.name, metric.value);

    // Enhanced metric object with additional context
    const enhancedMetric = {
      ...metric,
      rating,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: navigator.connection?.effectiveType || "unknown",
      deviceMemory: navigator.deviceMemory || "unknown",
      hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
    };

    // Store metric for batch reporting
    performanceMetrics.push(enhancedMetric);

    // Send to Plausible Analytics if available (custom events)
    if (window.plausible && typeof window.plausible === "function") {
      window.plausible("Core Web Vitals", {
        props: {
          metric: metric.name,
          value: Math.round(metric.value),
          rating: rating,
          page: window.location.pathname,
        },
      });
    }

    // Log to console in development
    logMetricToConsole(enhancedMetric);

    // Batch reporting when threshold is reached
    if (performanceMetrics.length >= webVitalsConfig.batchSize) {
      reportMetricsBatch();
    }
  } catch (error) {
    console.error("Error sending Core Web Vitals metric:", error);
  }
}

/**
 * Reports a batch of performance metrics
 */
function reportMetricsBatch() {
  if (performanceMetrics.length === 0) return;

  try {
    // In a real implementation, you might send to:
    // - Google Analytics 4
    // - Custom analytics endpoint
    // - Performance monitoring service (e.g., Sentry, DataDog)

    if (webVitalsConfig.debug) {
      console.group("📊 Core Web Vitals Batch Report");
      console.table(
        performanceMetrics.map((m) => ({
          Metric: m.name,
          Value: `${m.value}${m.name === "CLS" ? "" : "ms"}`,
          Rating: m.rating,
          Page: new URL(m.url).pathname,
          Timestamp: new Date(m.timestamp).toLocaleTimeString(),
        }))
      );
      console.groupEnd();
    }

    // Clear the batch
    performanceMetrics = [];
  } catch (error) {
    console.error("Error reporting Core Web Vitals batch:", error);
  }
}

/**
 * Initializes Core Web Vitals tracking
 */
function initWebVitalsTracking() {
  if (!webVitalsConfig.enabled) {
    console.log("Core Web Vitals tracking is disabled");
    return;
  }

  try {
    // Track Core Web Vitals
    onCLS(sendMetricToAnalytics);
    onINP(sendMetricToAnalytics);
    onFCP(sendMetricToAnalytics);
    onLCP(sendMetricToAnalytics);
    onTTFB(sendMetricToAnalytics);

    // Set up periodic batch reporting
    setInterval(reportMetricsBatch, webVitalsConfig.reportingInterval);

    // Report any remaining metrics when page is about to unload
    window.addEventListener("beforeunload", reportMetricsBatch);

    if (webVitalsConfig.debug) {
      console.log("✅ Core Web Vitals tracking initialized");
    }
  } catch (error) {
    console.error("Failed to initialize Core Web Vitals tracking:", error);
  }
}

/**
 * Nuxt plugin definition
 */
export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (process.client) {
    // Initialize tracking when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initWebVitalsTracking);
    } else {
      initWebVitalsTracking();
    }
  }
});
