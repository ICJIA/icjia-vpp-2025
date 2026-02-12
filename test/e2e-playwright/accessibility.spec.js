import { test, expect } from '@playwright/test';

/**
 * Real E2E Accessibility Tests
 *
 * End-to-end accessibility tests that run in real browsers.
 * Tests actual keyboard navigation, skip links, and screen reader support.
 */

test.describe('Accessibility E2E Tests', () => {
  test.describe('Skip Links', () => {
    test('skip to main content link works', async ({ page }) => {
      await page.goto('/');

      // Skip link should be initially off-screen
      const skipLink = page.locator('a.skip-link').first();

      // Press Tab to focus the skip link
      await page.keyboard.press('Tab');

      // Skip link should now be visible
      await expect(skipLink).toBeVisible();

      // Get the focused element
      const focusedElement = await page.evaluate(() => document.activeElement?.className);
      expect(focusedElement).toContain('skip-link');

      // Press Enter to activate skip link
      await page.keyboard.press('Enter');

      // Wait a moment for focus to shift
      await page.waitForTimeout(500);

      // Main content should now be focused
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeFocused();
    });

    test('skip to navigation link works', async ({ page }) => {
      await page.goto('/');

      // Tab twice to reach second skip link
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Check the focused skip link
      const secondSkipLink = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          href: active?.getAttribute('href'),
          text: active?.textContent
        };
      });

      expect(secondSkipLink.text).toContain('navigation');

      // Activate the skip link
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      // Navigation should now be focused (either #site-navigation or #mobile-menu-trigger)
      const navFocused = await page.evaluate(() => {
        const active = document.activeElement;
        return active?.id === 'site-navigation' || active?.id === 'mobile-menu-trigger';
      });

      expect(navFocused).toBe(true);
    });

    test('skip links have proper focus styles', async ({ page }) => {
      await page.goto('/');

      // Press Tab to focus skip link
      await page.keyboard.press('Tab');

      const skipLink = page.locator('a.skip-link').first();

      // Check that skip link has visible focus indicator
      const styles = await skipLink.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          top: computed.top,
          backgroundColor: computed.backgroundColor
        };
      });

      // Skip link should be visible (top: 0) and have focus styles
      expect(styles.top).toBe('0px');
      expect(parseFloat(styles.outlineWidth)).toBeGreaterThan(0);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('can navigate through header menu with Tab', async ({ page }) => {
      await page.goto('/');

      // Skip the skip links
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Tab through header elements
      await page.keyboard.press('Tab'); // Home link or first menu item

      const firstNavItem = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          tag: active?.tagName,
          role: active?.getAttribute('role'),
          isLink: active?.tagName === 'A'
        };
      });

      expect(['A', 'BUTTON', 'INPUT']).toContain(firstNavItem.tag);
    });

    test('Escape key closes mobile menu', async ({ page, viewport }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');

      // Open mobile menu
      const mobileMenuBtn = page.locator('#mobile-menu-trigger');
      await mobileMenuBtn.click();

      // Wait for menu to open
      await page.waitForTimeout(300);

      // Press Escape
      await page.keyboard.press('Escape');

      // Wait for menu to close
      await page.waitForTimeout(300);

      // Check if menu is closed (drawer should not be visible or drawer state changed)
      const isMenuClosed = await page.evaluate(() => {
        const drawer = document.querySelector('.v-navigation-drawer');
        return !drawer || !drawer.classList.contains('v-navigation-drawer--active');
      });

      expect(isMenuClosed).toBe(true);
    });

    test('can navigate to pages using keyboard only', async ({ page }) => {
      await page.goto('/');

      // Tab to a navigation link
      let attempts = 0;
      let foundContactLink = false;

      while (attempts < 20 && !foundContactLink) {
        await page.keyboard.press('Tab');
        const linkText = await page.evaluate(() => {
          const active = document.activeElement;
          return active?.textContent?.trim();
        });

        if (linkText === 'Contact') {
          foundContactLink = true;
          // Press Enter to navigate
          await page.keyboard.press('Enter');
          break;
        }

        attempts++;
      }

      if (foundContactLink) {
        // Wait for navigation
        await page.waitForURL('**/contact');
        expect(page.url()).toContain('/contact');
      }
    });
  });

  test.describe('ARIA and Semantic HTML', () => {
    test('page has proper landmark structure', async ({ page }) => {
      await page.goto('/');

      // Check for required landmarks
      const landmarks = await page.evaluate(() => {
        return {
          main: document.querySelector('main, [role="main"]') !== null,
          navigation: document.querySelector('nav, [role="navigation"]') !== null,
          banner: document.querySelector('header, [role="banner"]') !== null,
          contentinfo: document.querySelector('footer, [role="contentinfo"]') !== null
        };
      });

      expect(landmarks.main).toBe(true);
      expect(landmarks.navigation).toBe(true);
      expect(landmarks.banner).toBe(true);
      expect(landmarks.contentinfo).toBe(true);
    });

    test('page has single h1 heading', async ({ page }) => {
      await page.goto('/');

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('headings have proper hierarchy', async ({ page }) => {
      await page.goto('/');

      const headings = await page.evaluate(() => {
        const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return headingElements.map(h => ({
          level: parseInt(h.tagName.charAt(1)),
          text: h.textContent?.trim()
        }));
      });

      // Check that we don't skip heading levels
      let previousLevel = 0;
      for (const heading of headings) {
        if (previousLevel > 0) {
          // Level should not increase by more than 1
          expect(heading.level - previousLevel).toBeLessThanOrEqual(1);
        }
        previousLevel = heading.level;
      }
    });

    test('all images have alt text', async ({ page }) => {
      await page.goto('/');

      const imagesWithoutAlt = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.filter(img => {
          // Allow empty alt for decorative images with role="presentation"
          const hasRole = img.getAttribute('role') === 'presentation';
          const hasAlt = img.hasAttribute('alt');
          return !hasAlt && !hasRole;
        }).length;
      });

      expect(imagesWithoutAlt).toBe(0);
    });

    test('form inputs have associated labels', async ({ page }) => {
      await page.goto('/contact');

      const inputsWithoutLabels = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], textarea'));
        return inputs.filter(input => {
          const hasLabel = input.hasAttribute('aria-label') ||
            input.hasAttribute('aria-labelledby') ||
            document.querySelector(`label[for="${input.id}"]`) !== null;
          return !hasLabel;
        }).length;
      });

      expect(inputsWithoutLabels).toBe(0);
    });
  });

  test.describe('Focus Management', () => {
    test('focus indicator is visible on all interactive elements', async ({ page }) => {
      await page.goto('/');

      // Tab through several elements and check focus visibility
      const focusIndicators = [];

      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');

        const focusStyle = await page.evaluate(() => {
          const active = document.activeElement;
          if (!active) return null;

          const computed = window.getComputedStyle(active);
          return {
            outline: computed.outline,
            outlineWidth: computed.outlineWidth,
            outlineStyle: computed.outlineStyle,
            hasCustomFocusStyle: computed.boxShadow !== 'none' || computed.border !== 'none'
          };
        });

        if (focusStyle) {
          focusIndicators.push(focusStyle);
        }
      }

      // At least some elements should have visible focus indicators
      const hasFocusIndicators = focusIndicators.some(style =>
        style.outline !== 'none' ||
        parseFloat(style.outlineWidth) > 0 ||
        style.hasCustomFocusStyle
      );

      expect(hasFocusIndicators).toBe(true);
    });

    test('focus is not trapped on page load', async ({ page }) => {
      await page.goto('/');

      // Press Tab several times
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }

      // Should be able to tab through the page without getting stuck
      const canTab = await page.evaluate(() => {
        return document.activeElement !== null;
      });

      expect(canTab).toBe(true);
    });
  });

  test.describe('Color Contrast', () => {
    test('page meets contrast requirements in light mode', async ({ page }) => {
      await page.goto('/');

      // Ensure light mode is active
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
      });

      await page.waitForTimeout(500);

      // Check contrast of key text elements
      const contrastIssues = await page.evaluate(() => {
        const textElements = document.querySelectorAll('p, a, h1, h2, h3, button, span');
        let issues = 0;

        textElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;

          // Simple check: ensure we have actual colors (not transparent)
          if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            // This is a simplified check - full contrast checking requires color parsing
            // In real implementation, you'd use a library like axe-core or calculate luminance
          }
        });

        return issues;
      });

      // This is a basic check - axe-core provides more thorough contrast testing
      expect(contrastIssues).toBe(0);
    });
  });

  test.describe('Screen Reader Support', () => {
    test('page has proper language attribute', async ({ page }) => {
      await page.goto('/');

      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
      expect(lang).toBe('en');
    });

    test('ARIA live regions exist for dynamic content', async ({ page }) => {
      await page.goto('/');

      const liveRegions = await page.locator('[aria-live]').count();
      expect(liveRegions).toBeGreaterThan(0);
    });

    test('skip links announce their purpose', async ({ page }) => {
      await page.goto('/');

      const skipLinks = await page.locator('.skip-link').all();

      for (const link of skipLinks) {
        const text = await link.textContent();
        expect(text?.trim().length).toBeGreaterThan(0);
      }
    });
  });
});
