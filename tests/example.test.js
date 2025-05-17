import { describe, it, expect, vi, beforeEach } from 'vitest';

// Very simple function to test localStorage theme access
function getThemePreference() {
  try {
    const savedTheme = window.localStorage.getItem('theme-preference');
    return savedTheme || 'light';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'light';
  }
}

describe('Theme Preference Helper', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Mock localStorage
    window.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
    };
    
    // Mock console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns dark theme when "dark" is in localStorage', () => {
    window.localStorage.getItem.mockReturnValue('dark');
    
    const theme = getThemePreference();
    
    expect(window.localStorage.getItem).toHaveBeenCalledWith('theme-preference');
    expect(theme).toBe('dark');
  });

  it('returns light theme when "light" is in localStorage', () => {
    window.localStorage.getItem.mockReturnValue('light');
    
    const theme = getThemePreference();
    
    expect(window.localStorage.getItem).toHaveBeenCalledWith('theme-preference');
    expect(theme).toBe('light');
  });

  it('defaults to light theme when no value is in localStorage', () => {
    window.localStorage.getItem.mockReturnValue(null);
    
    const theme = getThemePreference();
    
    expect(window.localStorage.getItem).toHaveBeenCalledWith('theme-preference');
    expect(theme).toBe('light');
  });

  it('handles localStorage errors gracefully', () => {
    window.localStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const theme = getThemePreference();
    
    expect(window.localStorage.getItem).toHaveBeenCalledWith('theme-preference');
    expect(console.error).toHaveBeenCalled();
    expect(theme).toBe('light');
  });
}); 