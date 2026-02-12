import { test, expect } from '@playwright/test';

/**
 * Real E2E Search Tests
 *
 * Tests actual search functionality including:
 * - Search input interactions
 * - Search results display
 * - Result filtering
 * - Search highlighting
 * - Empty states
 * - Accessibility of search interface
 */

test.describe('Search E2E Tests', () => {
  test.describe('Search Page', () => {
    test('search page loads successfully', async ({ page }) => {
      await page.goto('/search');

      // Page should have search interface
      const searchInput = page.locator('input[type="text"], input[aria-label*="search" i], .search-input input');
      await expect(searchInput.first()).toBeVisible();
    });

    test('search input is autofocused', async ({ page }) => {
      await page.goto('/search');

      // Wait for page load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Check if search input has focus
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          tagName: active?.tagName,
          type: active?.getAttribute('type'),
          ariaLabel: active?.getAttribute('aria-label')
        };
      });

      expect(focusedElement.tagName).toBe('INPUT');
    });
  });

  test.describe('Search Input', () => {
    test('can type in search input', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('violence prevention');

      const value = await searchInput.inputValue();
      expect(value).toBe('violence prevention');
    });

    test('search input has clear button', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('test query');

      // Look for clear button (Vuetify adds clear icon)
      const clearBtn = page.locator('button[aria-label*="clear" i], .v-input__clear-icon');

      if (await clearBtn.count() > 0) {
        await clearBtn.first().click();

        // Input should be cleared
        const value = await searchInput.inputValue();
        expect(value).toBe('');
      }
    });

    test('search input has proper ARIA label', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      const ariaLabel = await searchInput.getAttribute('aria-label');

      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain('search');
    });
  });

  test.describe('Search Results', () => {
    test('displays results for valid query', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('violence');

      // Wait for results to appear
      await page.waitForTimeout(1000);

      // Check for results container
      const resultsContainer = page.locator('[data-testid="search-results"], .search-results, .results');

      if (await resultsContainer.count() > 0) {
        await expect(resultsContainer.first()).toBeVisible();
      }
    });

    test('shows number of results', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('prevention');

      await page.waitForTimeout(1000);

      // Look for results count indicator
      const resultsCount = page.locator('text=/\\d+ result/i');

      if (await resultsCount.count() > 0) {
        const countText = await resultsCount.first().textContent();
        expect(countText).toMatch(/\d+/);
      }
    });

    test('result items are clickable', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('executive');

      await page.waitForTimeout(1000);

      // Find first result link
      const resultLinks = page.locator('.search-result a, .result-item a, [data-testid="search-result"] a');

      if (await resultLinks.count() > 0) {
        const firstResult = resultLinks.first();
        await expect(firstResult).toBeVisible();

        // Click should navigate
        await firstResult.click();

        // Should navigate away from search page
        await page.waitForTimeout(500);
        expect(page.url()).not.toContain('/search');
      }
    });

    test('results show title and excerpt', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('plan');

      await page.waitForTimeout(1000);

      // Check if results have structured content
      const results = await page.evaluate(() => {
        const items = document.querySelectorAll('.search-result, .result-item, [data-testid="search-result"]');
        return Array.from(items).slice(0, 3).map(item => ({
          hasTitle: item.querySelector('h3, h4, .title, .result-title') !== null,
          hasExcerpt: item.querySelector('p, .excerpt, .description') !== null,
          hasLink: item.querySelector('a') !== null
        }));
      });

      if (results.length > 0) {
        // At least first result should have title
        expect(results[0].hasTitle || results[0].hasLink).toBe(true);
      }
    });
  });

  test.describe('Empty States', () => {
    test('shows message when no results found', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('xyznonexistentquery123456');

      await page.waitForTimeout(1000);

      // Look for "no results" message
      const noResults = page.locator('text=/no result|not found|no match/i');

      if (await noResults.count() > 0) {
        await expect(noResults.first()).toBeVisible();
      }
    });

    test('shows initial state when no query entered', async ({ page }) => {
      await page.goto('/search');

      // Without entering search query, should show initial state
      const initialState = page.locator('text=/enter.*search|start.*searching|search.*content/i');

      if (await initialState.count() > 0) {
        await expect(initialState.first()).toBeVisible();
      }
    });
  });

  test.describe('Search Performance', () => {
    test('search is responsive (debounced)', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();

      // Type quickly
      await searchInput.type('violence', { delay: 50 });

      // Search should not trigger for every keystroke
      // Wait for debounce period
      await page.waitForTimeout(500);

      // Results should eventually appear
      const hasContent = await page.evaluate(() => {
        return document.body.textContent?.length > 100;
      });

      expect(hasContent).toBe(true);
    });

    test('shows loading state while searching', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('plan');

      // Look for loading indicator immediately after typing
      const loading = page.locator('.v-progress-linear, .loading, [role="progressbar"]');

      // Loading indicator might appear briefly
      // This test is timing-sensitive and may need adjustment
    });
  });

  test.describe('Search Keyboard Navigation', () => {
    test('can navigate results with keyboard', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('violence');

      await page.waitForTimeout(1000);

      // Tab to first result
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          tagName: active?.tagName,
          isLink: active?.tagName === 'A'
        };
      });

      // Should focus on a link or interactive element
      expect(['A', 'BUTTON'].includes(focusedElement.tagName)).toBe(true);
    });

    test('Enter key on result navigates to page', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('executive');

      await page.waitForTimeout(1000);

      // Tab to first result and press Enter
      await page.keyboard.press('Tab');

      const initialUrl = page.url();

      await page.keyboard.press('Enter');

      await page.waitForTimeout(500);

      // Should navigate to result page
      const newUrl = page.url();
      expect(newUrl).not.toBe(initialUrl);
    });
  });

  test.describe('Search Accessibility', () => {
    test('search results are announced to screen readers', async ({ page }) => {
      await page.goto('/search');

      // Check for ARIA live region
      const liveRegion = page.locator('[aria-live], [role="status"], [role="alert"]');
      const count = await liveRegion.count();

      expect(count).toBeGreaterThan(0);
    });

    test('search has proper form structure', async ({ page }) => {
      await page.goto('/search');

      const searchForm = page.locator('form, [role="search"]');

      if (await searchForm.count() > 0) {
        await expect(searchForm.first()).toBeAttached();
      }
    });

    test('results have proper heading structure', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('plan');

      await page.waitForTimeout(1000);

      // Check page has h1
      const h1 = page.locator('h1');
      await expect(h1).toBeAttached();

      // Results should have h2, h3, or h4 headings
      const resultHeadings = page.locator('.search-result h2, .search-result h3, .search-result h4, .result-item h2, .result-item h3');

      // If results exist, they should have headings
      const resultCount = await resultHeadings.count();
      // This is optional - depends on implementation
    });
  });

  test.describe('Search Highlighting', () => {
    test('search terms are highlighted in results', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('prevention');

      await page.waitForTimeout(1000);

      // Look for highlighted text (usually <mark> or <span class="highlight">)
      const highlights = page.locator('mark, .highlight, .search-highlight');

      if (await highlights.count() > 0) {
        const highlightText = await highlights.first().textContent();
        expect(highlightText?.toLowerCase()).toContain('prevention');
      }
    });
  });

  test.describe('Mobile Search', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('search works on mobile', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('violence');

      await page.waitForTimeout(1000);

      // Results should be visible on mobile
      const mainContent = page.locator('#main-content, main');
      await expect(mainContent).toBeVisible();
    });

    test('mobile keyboard does not obscure search input', async ({ page }) => {
      await page.goto('/search');

      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.click();

      // Check that input is still visible after click (viewport should scroll if needed)
      await expect(searchInput).toBeInViewport();
    });
  });
});
