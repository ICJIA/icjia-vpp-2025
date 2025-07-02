import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Example function for demonstrating unit testing
 *
 * This function retrieves the user's theme preference from localStorage.
 * It includes error handling for cases where localStorage is unavailable
 * or throws an error, defaulting to 'light' theme in those cases.
 */
function getThemePreference() {
  try {
    const savedTheme = window.localStorage.getItem("theme-preference");
    return savedTheme || "light";
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return "light";
  }
}

describe("Theme Preference Helper", () => {
  /**
   * Set up test environment before each test
   *
   * This setup:
   * 1. Clears all previous mock data and function calls
   * 2. Creates a mock localStorage object with Jest mock functions
   * 3. Mocks console.error to prevent actual error output during tests
   */
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock localStorage with all required methods
    window.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
    };

    // Mock console.error to prevent actual error output
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it('returns dark theme when "dark" is in localStorage', () => {
    window.localStorage.getItem.mockReturnValue("dark");

    const theme = getThemePreference();

    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "theme-preference",
    );
    expect(theme).toBe("dark");
  });

  it('returns light theme when "light" is in localStorage', () => {
    window.localStorage.getItem.mockReturnValue("light");

    const theme = getThemePreference();

    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "theme-preference",
    );
    expect(theme).toBe("light");
  });

  it("defaults to light theme when no value is in localStorage", () => {
    window.localStorage.getItem.mockReturnValue(null);

    const theme = getThemePreference();

    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "theme-preference",
    );
    expect(theme).toBe("light");
  });

  it("handles localStorage errors gracefully", () => {
    window.localStorage.getItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });

    const theme = getThemePreference();

    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "theme-preference",
    );
    expect(console.error).toHaveBeenCalled();
    expect(theme).toBe("light");
  });
});
