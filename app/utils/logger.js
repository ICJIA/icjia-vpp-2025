/**
 * Unified Logging System
 *
 * A comprehensive logging utility that works consistently in both Node.js (server-side)
 * and browser environments with configurable verbosity levels and color coding.
 *
 * Features:
 * - Environment detection (Node.js vs Browser)
 * - Configurable verbosity levels (DETAILED, NORMAL, CONCISE)
 * - Color-coded output with consistent scheme
 * - Message grouping for build processes
 * - Timestamp support
 * - Data object logging
 * - Performance timing
 * - Error tracking
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 */

/**
 * Verbosity levels for controlling log output
 * @enum {string}
 */
export const LogLevel = {
  /** Show all logs including debug information */
  DETAILED: "DETAILED",
  /** Show standard logs (info, warning, error, success) */
  NORMAL: "NORMAL",
  /** Show only essential logs (error, success, summary) */
  CONCISE: "CONCISE",
};

/**
 * Log message types
 * @enum {string}
 */
export const LogType = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  DEBUG: "debug",
};

/**
 * Environment detection
 * @returns {boolean} True if running in Node.js environment
 */
const isNodeEnvironment = () => {
  return (
    typeof process !== "undefined" && process.versions && process.versions.node
  );
};

/**
 * Color schemes for different environments
 */
const Colors = {
  // ANSI color codes for Node.js terminal output
  node: {
    reset: "\x1b[0m",
    success: "\x1b[32m", // Green
    error: "\x1b[31m", // Red
    warning: "\x1b[33m", // Yellow
    info: "\x1b[36m", // Cyan
    debug: "\x1b[90m", // Gray
  },

  // CSS color codes for browser console output
  browser: {
    success: "#27ae60", // Green
    error: "#e74c3c", // Red
    warning: "#f39c12", // Orange/Yellow
    info: "#3498db", // Blue/Cyan
    debug: "#7f8c8d", // Gray
  },
};

/**
 * Default configuration
 */
const defaultConfig = {
  level: LogLevel.NORMAL,
  showTimestamp: true,
  showPrefix: true,
  groupMessages: false,
  environment: isNodeEnvironment() ? "node" : "browser",
};

/**
 * Unified Logger Class
 *
 * Provides consistent logging across Node.js and browser environments
 * with configurable verbosity and color coding.
 */
export class UnifiedLogger {
  /**
   * Create a new logger instance
   * @param {Object} config - Logger configuration
   * @param {LogLevel} config.level - Verbosity level
   * @param {boolean} config.showTimestamp - Whether to show timestamps
   * @param {boolean} config.showPrefix - Whether to show log type prefixes
   * @param {boolean} config.groupMessages - Whether to group related messages
   * @param {string} config.environment - Force environment ('node' or 'browser')
   */
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };
    this.isNode = this.config.environment === "node";
    this.colors = this.isNode ? Colors.node : Colors.browser;
    this.messageGroups = new Map();
    this.timers = new Map();
  }

  /**
   * Set the verbosity level
   * @param {LogLevel} level - New verbosity level
   */
  setLevel(level) {
    this.config.level = level;
  }

  /**
   * Check if a message should be logged based on current verbosity level
   * @param {LogType} type - Message type
   * @returns {boolean} Whether to log the message
   */
  shouldLog(type) {
    switch (this.config.level) {
      case LogLevel.CONCISE:
        return type === LogType.ERROR || type === LogType.SUCCESS;
      case LogLevel.NORMAL:
        return type !== LogType.DEBUG;
      case LogLevel.DETAILED:
        return true;
      default:
        return true;
    }
  }

  /**
   * Format a log message with timestamp and prefix
   * @param {LogType} type - Message type
   * @param {string} message - Log message
   * @returns {Object} Formatted message components
   */
  formatMessage(type, message) {
    const timestamp = this.config.showTimestamp
      ? `[${new Date().toLocaleTimeString()}]`
      : "";

    const prefix = this.config.showPrefix ? `[${type.toUpperCase()}]` : "";

    return { timestamp, prefix, message };
  }

  /**
   * Output a log message to the console
   * @param {LogType} type - Message type
   * @param {string} message - Log message
   * @param {any} data - Optional data object
   */
  output(type, message, data = null) {
    if (!this.shouldLog(type)) return;

    const { timestamp, prefix } = this.formatMessage(type, message);
    const color = this.colors[type] || this.colors.info;

    if (this.isNode) {
      // Node.js terminal output with ANSI colors
      const formattedMessage = `${color}${timestamp}${prefix}${this.colors.reset} ${message}`;
      console.log(formattedMessage);
      if (data) {
        console.log(data);
      }
    } else {
      // Browser console output with CSS colors
      const formattedMessage = `${timestamp}${prefix} ${message}`;
      if (data) {
        console.log(
          `%c${formattedMessage}`,
          `color: ${color}; font-weight: bold;`,
          data,
        );
      } else {
        console.log(
          `%c${formattedMessage}`,
          `color: ${color}; font-weight: bold;`,
        );
      }
    }
  }

  /**
   * Log a success message
   * @param {string} message - Success message
   * @param {any} data - Optional data object
   */
  success(message, data) {
    this.output(LogType.SUCCESS, message, data);
  }

  /**
   * Log an error message
   * @param {string} message - Error message
   * @param {any} data - Optional data object
   */
  error(message, data) {
    this.output(LogType.ERROR, message, data);
  }

  /**
   * Log a warning message
   * @param {string} message - Warning message
   * @param {any} data - Optional data object
   */
  warning(message, data) {
    this.output(LogType.WARNING, message, data);
  }

  /**
   * Log an info message
   * @param {string} message - Info message
   * @param {any} data - Optional data object
   */
  info(message, data) {
    this.output(LogType.INFO, message, data);
  }

  /**
   * Log a debug message
   * @param {string} message - Debug message
   * @param {any} data - Optional data object
   */
  debug(message, data) {
    this.output(LogType.DEBUG, message, data);
  }

  /**
   * Start a performance timer
   * @param {string} name - Timer name
   */
  time(name) {
    this.timers.set(name, Date.now());
    this.debug(`Timer started: ${name}`);
  }

  /**
   * End a performance timer and log the duration
   * @param {string} name - Timer name
   * @param {string} message - Optional message to include
   */
  timeEnd(name, message = "") {
    const startTime = this.timers.get(name);
    if (startTime) {
      const duration = Date.now() - startTime;
      const logMessage = message
        ? `${message} (${duration}ms)`
        : `Timer ${name}: ${duration}ms`;
      this.info(logMessage);
      this.timers.delete(name);
    } else {
      this.warning(`Timer '${name}' was not started`);
    }
  }

  /**
   * Add a message to a group for later summary
   * @param {string} groupName - Group name
   * @param {LogType} type - Message type
   * @param {string} message - Message content
   */
  addToGroup(groupName, type, message) {
    if (!this.messageGroups.has(groupName)) {
      this.messageGroups.set(groupName, []);
    }
    this.messageGroups
      .get(groupName)
      .push({ type, message, timestamp: Date.now() });
  }

  /**
   * Output a summary of grouped messages
   * @param {string} groupName - Group name
   * @param {string} summaryMessage - Summary message template
   */
  summarizeGroup(groupName, summaryMessage = "") {
    const messages = this.messageGroups.get(groupName);
    if (!messages || messages.length === 0) return;

    const counts = messages.reduce((acc, msg) => {
      acc[msg.type] = (acc[msg.type] || 0) + 1;
      return acc;
    }, {});

    const summary =
      summaryMessage ||
      `${groupName}: ${messages.length} operations (${counts.success || 0} success, ${counts.error || 0} errors, ${counts.warning || 0} warnings)`;

    // Determine overall status based on message types
    const hasErrors = counts.error > 0;
    const hasWarnings = counts.warning > 0;
    const overallType = hasErrors
      ? LogType.ERROR
      : hasWarnings
        ? LogType.WARNING
        : LogType.SUCCESS;

    this.output(overallType, summary);

    // Clear the group
    this.messageGroups.delete(groupName);
  }

  /**
   * Enhanced development workflow utilities
   */

  /**
   * Log with enhanced debugging context including source location
   * @param {LogType} type - Message type
   * @param {string} message - Log message
   * @param {any} data - Optional data object
   * @param {Object} options - Enhanced logging options
   */
  logWithContext(type, message, data = null, options = {}) {
    if (!this.shouldLog(type)) return;

    // Enhanced message with context
    let enhancedMessage = message;

    if (options.source) {
      enhancedMessage = `[${options.source}] ${message}`;
    }

    if (options.operation) {
      enhancedMessage = `${enhancedMessage} (${options.operation})`;
    }

    this.output(type, enhancedMessage, data);
  }

  /**
   * Enhanced performance monitoring with nested timing
   * @param {string} name - Timer name
   * @param {string} category - Timer category for grouping
   */
  timeWithCategory(name, category = "general") {
    const fullName = `${category}:${name}`;
    this.timers.set(fullName, {
      startTime: Date.now(),
      category,
      name,
    });
    this.debug(`⏱️  Timer started: ${name} (${category})`);
  }

  /**
   * End categorized timer with enhanced reporting
   * @param {string} name - Timer name
   * @param {string} category - Timer category
   * @param {string} message - Optional message
   */
  timeEndWithCategory(name, category = "general", message = "") {
    const fullName = `${category}:${name}`;
    const timerData = this.timers.get(fullName);

    if (timerData) {
      const duration = Date.now() - timerData.startTime;
      const logMessage = message
        ? `⏱️  ${message} - ${name}: ${duration}ms (${category})`
        : `⏱️  ${name}: ${duration}ms (${category})`;

      // Use different log levels based on duration
      if (duration > 5000) {
        this.warning(logMessage);
      } else if (duration > 1000) {
        this.info(logMessage);
      } else {
        this.debug(logMessage);
      }

      this.timers.delete(fullName);
    } else {
      this.warning(`Timer '${name}' in category '${category}' was not started`);
    }
  }

  /**
   * Enhanced error reporting with actionable insights
   * @param {string} message - Error message
   * @param {Error|any} error - Error object or data
   * @param {Object} context - Additional context for debugging
   */
  errorWithContext(message, error = null, context = {}) {
    let enhancedMessage = `❌ ${message}`;

    if (context.suggestion) {
      enhancedMessage += `\n💡 Suggestion: ${context.suggestion}`;
    }

    if (context.documentation) {
      enhancedMessage += `\n📖 See: ${context.documentation}`;
    }

    this.output(LogType.ERROR, enhancedMessage);

    if (error) {
      if (error.stack && this.config.level === LogLevel.DETAILED) {
        this.debug("Stack trace:", error.stack);
      } else if (error.message) {
        this.debug("Error details:", error.message);
      } else {
        this.debug("Error data:", error);
      }
    }
  }

  /**
   * Create an enhanced scoped logger for a specific context with development optimizations
   * @param {string} context - Context name (e.g., 'SearchIndex', 'SiteConfig')
   * @returns {Object} Enhanced scoped logger methods
   */
  createScope(context) {
    return {
      success: (message, data) => this.success(`[${context}] ${message}`, data),
      error: (message, data) => this.error(`[${context}] ${message}`, data),
      warning: (message, data) => this.warning(`[${context}] ${message}`, data),
      info: (message, data) => this.info(`[${context}] ${message}`, data),
      debug: (message, data) => this.debug(`[${context}] ${message}`, data),
      time: (name) => this.timeWithCategory(name, context),
      timeEnd: (name, message) =>
        this.timeEndWithCategory(name, context, message),
      addToGroup: (type, message) => this.addToGroup(context, type, message),
      summarize: (summaryMessage) =>
        this.summarizeGroup(context, summaryMessage),
      // Enhanced methods
      errorWithContext: (message, error, contextData) =>
        this.errorWithContext(`[${context}] ${message}`, error, contextData),
      logWithContext: (type, message, data, options) =>
        this.logWithContext(type, message, data, {
          ...options,
          source: context,
        }),
    };
  }
}

/**
 * Create a logger instance with environment-specific defaults
 * @param {Object} config - Logger configuration
 * @returns {UnifiedLogger} Logger instance
 */
export function createLogger(config = {}) {
  return new UnifiedLogger(config);
}

/**
 * Default logger instance for immediate use
 */
export const logger = createLogger();

/**
 * Legacy compatibility functions for existing code
 */
export const log = {
  success: (message, data) => logger.success(message, data),
  error: (message, data) => logger.error(message, data),
  warning: (message, data) => logger.warning(message, data),
  info: (message, data) => logger.info(message, data),
  debug: (message, data) => logger.debug(message, data),
};
