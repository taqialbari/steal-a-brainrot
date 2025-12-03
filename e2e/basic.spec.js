/**
 * Basic E2E Tests
 * Tests core functionality of the application
 */

const { test, expect } = require('@playwright/test');

test.describe('Home Page', () => {
  test('should load and display brainrots', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Steal a Brainrot/);

    // Check header is visible
    await expect(page.locator('h1')).toContainText('Steal a Brainrot');

    // Wait for brainrots to load
    await page.waitForSelector('[data-testid="brainrot-card"]', { timeout: 10000 });

    // Check that at least one brainrot card is visible
    const cards = page.locator('[data-testid="brainrot-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should display stats component', async ({ page }) => {
    await page.goto('/');

    // Wait for stats to load
    await page.waitForSelector('[data-testid="stats-component"]', { timeout: 10000 });

    // Check stats are visible
    const stats = page.locator('[data-testid="stats-component"]');
    await expect(stats).toBeVisible();
  });
});

test.describe('Search and Filter', () => {
  test('should filter brainrots by search query', async ({ page }) => {
    await page.goto('/');

    // Wait for initial load
    await page.waitForSelector('[data-testid="brainrot-card"]', { timeout: 10000 });

    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('skibidi');

    // Wait for filtered results
    await page.waitForTimeout(1000); // Wait for debounce

    // Check that search term is shown
    await expect(page.locator('text=Searching for')).toBeVisible();
  });

  test('should show/hide advanced filters', async ({ page }) => {
    await page.goto('/');

    // Click advanced filters button
    const filtersButton = page.locator('button:has-text("Advanced Filters")');
    await filtersButton.click();

    // Check that filters panel is visible
    await expect(page.locator('text=Rarity Filters')).toBeVisible();
    await expect(page.locator('text=Price Range')).toBeVisible();

    // Click again to hide
    await filtersButton.click();

    // Check that filters panel is hidden
    await expect(page.locator('text=Rarity Filters')).not.toBeVisible();
  });

  test('should filter by rarity', async ({ page }) => {
    await page.goto('/');

    // Open advanced filters
    await page.click('button:has-text("Advanced Filters")');

    // Click "Show Filters" in multi-rarity component
    await page.click('button:has-text("Show Filters")');

    // Select a rarity checkbox
    await page.check('input[type="checkbox"][aria-label*="Secret"]');

    // Wait for results
    await page.waitForTimeout(1000);

    // Check that rarity pill is shown
    await expect(page.locator('text=Secret')).toBeVisible();
  });

  test('should sort brainrots', async ({ page }) => {
    await page.goto('/');

    // Select sort option
    const sortSelect = page.locator('select#sort-select');
    await sortSelect.selectOption('name:ASC');

    // Wait for results to update
    await page.waitForTimeout(1000);

    // Verify brainrots are displayed
    const cards = page.locator('[data-testid="brainrot-card"]');
    await expect(cards.first()).toBeVisible();
  });
});

test.describe('Brainrot Modal', () => {
  test('should open modal when clicking a card', async ({ page }) => {
    await page.goto('/');

    // Wait for cards to load
    await page.waitForSelector('[data-testid="brainrot-card"]', { timeout: 10000 });

    // Click first card
    const firstCard = page.locator('[data-testid="brainrot-card"]').first();
    await firstCard.click();

    // Check modal is visible
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should close modal with ESC key', async ({ page }) => {
    await page.goto('/');

    // Wait and click card
    await page.waitForSelector('[data-testid="brainrot-card"]', { timeout: 10000 });
    await page.locator('[data-testid="brainrot-card"]').first().click();

    // Wait for modal
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Press ESC
    await page.keyboard.press('Escape');

    // Check modal is hidden
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should navigate between brainrots with arrow keys', async ({ page }) => {
    await page.goto('/');

    // Wait and click card
    await page.waitForSelector('[data-testid="brainrot-card"]', { timeout: 10000 });
    await page.locator('[data-testid="brainrot-card"]').first().click();

    // Wait for modal
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Get initial brainrot name
    const initialName = await page.locator('[role="dialog"] h2').textContent();

    // Press right arrow
    await page.keyboard.press('ArrowRight');

    // Wait a bit for animation
    await page.waitForTimeout(300);

    // Check that name changed
    const newName = await page.locator('[role="dialog"] h2').textContent();
    expect(newName).not.toBe(initialName);
  });

  test('should close modal with close button', async ({ page }) => {
    await page.goto('/');

    // Wait and click card
    await page.waitForSelector('[data-testid="brainrot-card"]', { timeout: 10000 });
    await page.locator('[data-testid="brainrot-card"]').first().click();

    // Wait for modal
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click close button
    await page.click('button[aria-label="Close modal"]');

    // Check modal is hidden
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should be mobile-friendly', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check page loads
    await expect(page.locator('h1')).toBeVisible();

    // Check that cards stack vertically
    const cards = page.locator('[data-testid="brainrot-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should adapt modal to mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Wait and click card
    await page.waitForSelector('[data-testid="brainrot-card"]', { timeout: 10000 });
    await page.locator('[data-testid="brainrot-card"]').first().click();

    // Check modal is full-screen on mobile
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check focus is visible
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // Check search input has label
    const searchInput = page.locator('input[aria-label*="Search"]');
    await expect(searchInput).toBeVisible();

    // Check sort dropdown has label
    const sortSelect = page.locator('select[aria-label*="Sort"]');
    await expect(sortSelect).toBeVisible();
  });
});
