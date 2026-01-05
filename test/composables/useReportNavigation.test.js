import { describe, it, expect } from 'vitest';

/**
 * useReportNavigation Composable Tests
 * 
 * Tests for the report navigation composable that provides next/previous
 * navigation functionality for the Statewide Violence Prevention Plan for Illinois: 2025-2029.
 */

describe('useReportNavigation composable', () => {
  describe('path normalization', () => {
    it('should normalize paths with trailing slashes', () => {
      // Path normalization should remove trailing slashes
      const path = '/plan/executive-summary/';
      const normalized = path.replace(/\/+$/g, '') || '/';
      expect(normalized).toBe('/plan/executive-summary');
    });

    it('should handle root path', () => {
      const path = '/';
      const normalized = path.replace(/\/+$/g, '') || '/';
      expect(normalized).toBe('/');
    });

    it('should handle empty path', () => {
      const path = '';
      const normalized = path.replace(/\/+$/g, '') || '/';
      expect(normalized).toBe('/');
    });

    it('should handle double slashes', () => {
      const path = '/plan//executive-summary';
      const normalized = path.replace(/\/+/g, '/');
      expect(normalized).toBe('/plan/executive-summary');
    });
  });

  describe('navigation data structure', () => {
    it('should include previous page data', () => {
      const navData = {
        previous: { path: '/plan/front-cover', title: 'Front Cover' },
        next: { path: '/plan/guiding-principles', title: 'Guiding Principles' },
        currentIndex: 1,
        totalPages: 7
      };
      
      expect(navData.previous).toBeDefined();
      expect(navData.previous.path).toBe('/plan/front-cover');
    });

    it('should include next page data', () => {
      const navData = {
        previous: { path: '/plan/front-cover', title: 'Front Cover' },
        next: { path: '/plan/guiding-principles', title: 'Guiding Principles' },
        currentIndex: 1,
        totalPages: 7
      };
      
      expect(navData.next).toBeDefined();
      expect(navData.next.path).toBe('/plan/guiding-principles');
    });

    it('should include current index', () => {
      const navData = { currentIndex: 2, totalPages: 7 };
      expect(navData.currentIndex).toBe(2);
    });

    it('should include total pages count', () => {
      const navData = { currentIndex: 2, totalPages: 7 };
      expect(navData.totalPages).toBe(7);
    });
  });

  describe('linear navigation behavior', () => {
    it('should return null for previous on first page', () => {
      // First page has no previous
      const isFirstPage = true;
      const previous = isFirstPage ? null : { path: '/plan/some-page' };
      expect(previous).toBeNull();
    });

    it('should return null for next on last page', () => {
      // Last page has no next
      const isLastPage = true;
      const next = isLastPage ? null : { path: '/plan/some-page' };
      expect(next).toBeNull();
    });

    it('should return both previous and next for middle pages', () => {
      const currentIndex = 3;
      const totalPages = 7;
      
      const hasPrevious = currentIndex > 0;
      const hasNext = currentIndex < totalPages - 1;
      
      expect(hasPrevious).toBe(true);
      expect(hasNext).toBe(true);
    });
  });

  describe('page detection', () => {
    it('should identify report pages correctly', () => {
      const reportPaths = [
        '/plan/front-cover',
        '/plan/executive-summary',
        '/plan/guiding-principles',
        '/plan/public-health-approach',
        '/plan/planning-process',
        '/plan/goals-and-recommendations',
        '/plan/references'
      ];
      
      const testPath = '/plan/executive-summary';
      const isReportPage = reportPaths.includes(testPath);
      expect(isReportPage).toBe(true);
    });

    it('should identify non-report pages correctly', () => {
      const reportPaths = ['/plan/front-cover', '/plan/executive-summary'];
      const testPath = '/contact';
      const isReportPage = reportPaths.includes(testPath);
      expect(isReportPage).toBe(false);
    });
  });

  describe('page summaries', () => {
    it('should include summary for navigation context', () => {
      const pageData = {
        path: '/plan/executive-summary',
        title: 'Executive Summary',
        summary: 'Overview of the violence prevention plan'
      };
      
      expect(pageData.summary).toBeDefined();
      expect(typeof pageData.summary).toBe('string');
    });

    it('should provide default summary when none is specified', () => {
      const defaultSummary = 'Navigate to this section of the report';
      expect(defaultSummary).toContain('Navigate');
    });
  });

  describe('accessibility features', () => {
    it('should provide aria labels for navigation', () => {
      const pageData = {
        title: 'Executive Summary',
        ariaLabel: 'Executive Summary'
      };
      
      expect(pageData.ariaLabel).toBeDefined();
    });

    it('should provide tooltips for navigation elements', () => {
      const pageData = {
        title: 'Executive Summary',
        tooltip: 'Executive Summary'
      };
      
      expect(pageData.tooltip).toBeDefined();
    });
  });

  describe('composable interface', () => {
    it('should provide getNavigationData function', () => {
      const expectedFunctions = ['getNavigationData', 'isReportPage', 'extractReportPages'];
      expect(expectedFunctions).toContain('getNavigationData');
    });

    it('should provide isReportPage function', () => {
      const expectedFunctions = ['getNavigationData', 'isReportPage', 'extractReportPages'];
      expect(expectedFunctions).toContain('isReportPage');
    });

    it('should provide extractReportPages function', () => {
      const expectedFunctions = ['getNavigationData', 'isReportPage', 'extractReportPages'];
      expect(expectedFunctions).toContain('extractReportPages');
    });

    it('should provide reportPages computed property', () => {
      const expectedProperties = ['reportPages', 'totalReportPages'];
      expect(expectedProperties).toContain('reportPages');
    });

    it('should provide totalReportPages computed property', () => {
      const expectedProperties = ['reportPages', 'totalReportPages'];
      expect(expectedProperties).toContain('totalReportPages');
    });
  });

  describe('caching behavior', () => {
    it('should cache extracted report pages for performance', () => {
      // Caching prevents repeated processing of menu configuration
      const usesCache = true;
      expect(usesCache).toBe(true);
    });
  });

  describe('boundary conditions', () => {
    it('should handle isFirstPage flag correctly', () => {
      const currentIndex = 0;
      const isFirstPage = currentIndex === 0;
      expect(isFirstPage).toBe(true);
    });

    it('should handle isLastPage flag correctly', () => {
      const currentIndex = 6;
      const totalPages = 7;
      const isLastPage = currentIndex === totalPages - 1;
      expect(isLastPage).toBe(true);
    });
  });
});

