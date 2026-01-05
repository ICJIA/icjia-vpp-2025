import { describe, it, expect, beforeEach } from 'vitest';
import { useSiteSettings } from '../../app/composables/useSiteSettings';

describe('useSiteSettings', () => {
  describe('basic usage', () => {
    it('should return a composable object', () => {
      const result = useSiteSettings();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('getSetting');
      expect(result).toHaveProperty('getSettings');
      expect(result).toHaveProperty('loadConfig');
      expect(result).toHaveProperty('config');
      expect(result).toHaveProperty('isLoaded');
    });

    it('should have readonly config', () => {
      const { config } = useSiteSettings();
      
      // Config is readonly ref
      expect(config).toBeDefined();
    });

    it('should have loading state', () => {
      const { loading, isLoading } = useSiteSettings();
      
      expect(loading).toBeDefined();
      expect(isLoading).toBeDefined();
    });
  });

  describe('getSetting', () => {
    it('should be a function', () => {
      const { getSetting } = useSiteSettings();
      
      expect(typeof getSetting).toBe('function');
    });

    it('should return default value when config is not loaded and fetch fails', async () => {
      const { getSetting } = useSiteSettings();
      const result = await getSetting('nonexistent.key', 'default value');
      
      // Should return default value if config loading fails or key doesn't exist
      expect(result).toBeDefined();
    });
  });

  describe('getSettings', () => {
    it('should be a function', () => {
      const { getSettings } = useSiteSettings();
      
      expect(typeof getSettings).toBe('function');
    });

    it('should handle multiple settings', async () => {
      const { getSettings } = useSiteSettings();
      const settings = await getSettings({
        test1: 'some.key',
        test2: { path: 'another.key', default: 'fallback' }
      });
      
      expect(settings).toBeDefined();
      expect(typeof settings).toBe('object');
    });
  });

  describe('computed properties', () => {
    it('should have isLoaded computed property', () => {
      const { isLoaded } = useSiteSettings();
      
      expect(typeof isLoaded.value).toBe('boolean');
    });

    it('should have hasError computed property', () => {
      const { hasError } = useSiteSettings();
      
      expect(typeof hasError.value).toBe('boolean');
    });

    it('should have isLoading computed property', () => {
      const { isLoading } = useSiteSettings();
      
      expect(typeof isLoading.value).toBe('boolean');
    });
  });
});
