import { test, expect } from '@playwright/test';

/**
 * Real E2E Navigation Tests
 *
 * Tests actual navigation behavior including:
 * - Page routing
 * - Menu interactions
 * - Mobile navigation
 * - Breadcrumbs
 * - Report navigation (next/previous)
 */

test.describe('Navigation E2E Tests', () => {
  test.describe('Homepage', () => {
    test('loads homepage successfully', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveTitle(/Violence Prevention Plan/i);

      // Check for main content
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeVisible();
    });

    test('homepage has working navigation menu', async ({ page }) => {
      await page.goto('/');

      // Desktop navigation should exist
      const nav = page.locator('#site-navigation');
      await expect(nav).toBeAttached();
    });
  });

  test.describe('Desktop Navigation', () => {
    test('can navigate to Contact page', async ({ page }) => {
      await page.goto('/');

      // Click Contact link in navigation
      const contactLink = page.locator('nav a', { hasText: 'Contact' }).first();
      await contactLink.click();

      // Should navigate to contact page
      await expect(page).toHaveURL(/.*\/contact/);

      // Page should have contact form
      const form = page.locator('form, [role="form"]');
      await expect(form).toBeVisible({ timeout: 5000 });
    });

    test('can navigate to Plan section', async ({ page }) => {
      await page.goto('/');

      // Look for "The Plan" or "Plan" link
      const planLinks = page.locator('nav a');
      const planLink = planLinks.filter({ hasText: /Plan|Executive Summary/i }).first();

      if (await planLink.count() > 0) {
        await planLink.click();
        await page.waitForURL(/.*\/plan.*/);
        expect(page.url()).toContain('/plan');
      }
    });

    test('navigation highlights current page', async ({ page }) => {
      await page.goto('/contact');

      // The active navigation item should have some indicator (class, aria-current, etc.)
      const activeNav = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('nav a'));
        return links.some(link => {
          const ariaCurrent = link.getAttribute('aria-current');
          const classes = link.className;
          return ariaCurrent === 'page' || classes.includes('active') || classes.includes('router-link-active');
        });
      });

      expect(activeNav).toBe(true);
    });

    test('logo click navigates to homepage', async ({ page }) => {
      await page.goto('/contact');

      // Click the branding/logo link
      const logoLink = page.locator('.brand-link, .logo a').first();
      await logoLink.click();

      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('mobile menu opens and closes', async ({ page }) => {
      await page.goto('/');

      // Mobile menu button should be visible
      const menuBtn = page.locator('#mobile-menu-trigger');
      await expect(menuBtn).toBeVisible();

      // Click to open menu
      await menuBtn.click();
      await page.waitForTimeout(500);

      // Drawer should be open (check for navigation drawer visibility)
      const drawer = page.locator('.v-navigation-drawer');
      const isVisible = await drawer.isVisible();

      expect(isVisible).toBe(true);

      // Click again to close
      await menuBtn.click();
      await page.waitForTimeout(500);
    });

    test('can navigate using mobile menu', async ({ page }) => {
      await page.goto('/');

      // Open mobile menu
      const menuBtn = page.locator('#mobile-menu-trigger');
      await menuBtn.click();
      await page.waitForTimeout(500);

      // Click a menu item (e.g., Contact)
      const contactLink = page.locator('.v-navigation-drawer a', { hasText: 'Contact' }).first();

      if (await contactLink.count() > 0) {
        await contactLink.click();
        await page.waitForURL(/.*\/contact/);
        expect(page.url()).toContain('/contact');
      }
    });

    test('mobile menu button has proper ARIA label', async ({ page }) => {
      await page.goto('/');

      const menuBtn = page.locator('#mobile-menu-trigger');
      const ariaLabel = await menuBtn.getAttribute('aria-label');

      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toContain('menu');
    });
  });

  test.describe('Plan Section Navigation', () => {
    test('can navigate to Executive Summary', async ({ page }) => {
      await page.goto('/');

      // Navigate to plan section
      await page.goto('/plan/executive-summary');
      await expect(page).toHaveURL(/.*\/plan\/executive-summary/);

      // Page should have content
      const content = page.locator('#main-content, main');
      await expect(content).toBeVisible();
    });

    test('sidebar navigation exists on plan pages', async ({ page }) => {
      await page.goto('/plan/executive-summary');

      // Check for sidebar or table of contents
      const sidebar = page.locator('aside, [role="complementary"], .sidebar, .toc');

      // Sidebar should exist (might be hidden on mobile)
      const exists = await sidebar.count();
      expect(exists).toBeGreaterThan(0);
    });

    test('report navigation (prev/next) works', async ({ page }) => {
      await page.goto('/plan/executive-summary');

      // Look for next button
      const nextBtn = page.locator('a, button').filter({ hasText: /Next|›|→/i });

      if (await nextBtn.count() > 0) {
        const firstNext = nextBtn.first();
        await firstNext.click();

        // Should navigate to next section
        await page.waitForTimeout(500);
        expect(page.url()).not.toContain('/executive-summary');
      }
    });

    test('all plan sections are accessible', async ({ page }) => {
      const sections = [
        '/plan/front-cover',
        '/plan/executive-summary',
        '/plan/public-health-approach',
        '/plan/guiding-principles',
        '/plan/goals-and-recommendations',
        '/plan/planning-process',
        '/plan/references'
      ];

      for (const section of sections) {
        await page.goto(section);
        await expect(page).toHaveURL(section);

        // Each section should have main content
        const main = page.locator('#main-content, main');
        await expect(main).toBeVisible();
      }
    });
  });

  test.describe('Footer Navigation', () => {
    test('footer links work', async ({ page }) => {
      await page.goto('/');

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Find privacy policy link
      const privacyLink = page.locator('footer a, [role="contentinfo"] a').filter({ hasText: /Privacy/i }).first();

      if (await privacyLink.count() > 0) {
        await privacyLink.click();
        await page.waitForURL(/.*\/legal\/privacy.*/);
        expect(page.url()).toContain('/legal/privacy');
      }
    });

    test('footer has proper role', async ({ page }) => {
      await page.goto('/');

      const footer = page.locator('footer, [role="contentinfo"]');
      await expect(footer).toBeAttached();
    });
  });

  test.describe('Scroll Behavior', () => {
    test('navigating to a new page scrolls to top', async ({ page }) => {
      await page.goto('/');

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));

      // Navigate to another page
      await page.goto('/contact');

      // Check scroll position (should be near top)
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(100);
    });

    test('hash navigation scrolls to element', async ({ page }) => {
      await page.goto('/plan/executive-summary');

      // If there are hash links on the page, test them
      const hashLinks = page.locator('a[href^="#"]');

      if (await hashLinks.count() > 0) {
        const firstHashLink = hashLinks.first();
        const href = await firstHashLink.getAttribute('href');

        await firstHashLink.click();
        await page.waitForTimeout(500);

        // URL should include hash
        expect(page.url()).toContain('#');
      }
    });
  });

  test.describe('404 Error Handling', () => {
    test('non-existent page shows error', async ({ page }) => {
      const response = await page.goto('/this-page-does-not-exist-12345');

      // Should get 404 response or show error page
      expect(response?.status()).toBe(404);
    });
  });

  test.describe('Back/Forward Navigation', () => {
    test('browser back button works', async ({ page }) => {
      await page.goto('/');
      await page.goto('/contact');

      // Go back
      await page.goBack();

      await expect(page).toHaveURL('/');
    });

    test('browser forward button works', async ({ page }) => {
      await page.goto('/');
      await page.goto('/contact');
      await page.goBack();

      // Go forward
      await page.goForward();

      await expect(page).toHaveURL(/.*\/contact/);
    });
  });

  test.describe('External Links', () => {
    test('external links open in new tab', async ({ page, context }) => {
      await page.goto('/resources');

      // Look for external links (those with target="_blank")
      const externalLinks = page.locator('a[target="_blank"]');

      if (await externalLinks.count() > 0) {
        const firstExternal = externalLinks.first();

        // Check that it has rel="noopener" or rel="noreferrer" for security
        const rel = await firstExternal.getAttribute('rel');
        expect(rel).toBeTruthy();
        expect(rel?.includes('noopener') || rel?.includes('noreferrer')).toBe(true);
      }
    });
  });
});
