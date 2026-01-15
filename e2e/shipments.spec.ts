import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Shipment Workflows
 * Tests the complete shipment lifecycle from creation to delivery
 */

test.describe("Shipment Workflows", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || "test@taccargo.com");
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || "testpassword");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard/**");
  });

  test("should display shipments list page", async ({ page }) => {
    await page.goto("/dashboard/shipments");
    await expect(page.locator("h1")).toContainText(/shipment/i);
  });

  test("should create a new shipment", async ({ page }) => {
    await page.goto("/dashboard/shipments");
    
    // Click create button
    await page.click('button:has-text("New Shipment")');
    
    // Fill shipment form
    await page.fill('[name="consignee_name"]', "Test Consignee");
    await page.fill('[name="consignee_phone"]', "9876543210");
    await page.fill('[name="consignee_address"]', "123 Test Street");
    await page.fill('[name="consignee_city"]', "Mumbai");
    await page.fill('[name="consignee_state"]', "Maharashtra");
    await page.fill('[name="consignee_pincode"]', "400001");
    
    // Select transport mode
    await page.click('[name="transport_mode"]');
    await page.click('text=Surface');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator(".toast, [role='alert']")).toContainText(/created|success/i);
  });

  test("should search shipments by reference", async ({ page }) => {
    await page.goto("/dashboard/shipments");
    
    // Search for a shipment
    await page.fill('input[placeholder*="search" i]', "SHP-");
    await page.waitForTimeout(500); // Debounce
    
    // Verify results update
    await expect(page.locator("table tbody tr, [data-testid='shipment-card']")).toBeVisible();
  });

  test("should filter shipments by status", async ({ page }) => {
    await page.goto("/dashboard/shipments");
    
    // Click status filter
    await page.click('button:has-text("Status"), [data-testid="status-filter"]');
    await page.click('text=In Transit');
    
    // Verify filtered results
    await page.waitForTimeout(300);
  });

  test("should update shipment status", async ({ page }) => {
    await page.goto("/dashboard/shipments");
    
    // Click on first shipment row actions
    await page.click('button[aria-label="More actions"], button:has(svg.lucide-more-horizontal)');
    
    // Click update status
    await page.click('text=Update Status');
    
    // Select new status
    await page.click('text=Picked Up');
    
    // Verify update
    await expect(page.locator(".toast, [role='alert']")).toContainText(/updated|success/i);
  });
});

test.describe("Manifest Workflows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || "test@taccargo.com");
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || "testpassword");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard/**");
  });

  test("should display manifests page with kanban board", async ({ page }) => {
    await page.goto("/dashboard/manifests");
    
    // Verify kanban columns are visible
    await expect(page.locator("text=Unassigned")).toBeVisible();
    await expect(page.locator("text=Open")).toBeVisible();
  });

  test("should create a new manifest", async ({ page }) => {
    await page.goto("/dashboard/manifests");
    
    // Click create button
    await page.click('button:has-text("Create Manifest")');
    
    // Wait for dialog
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Select origin warehouse
    await page.click('select:has-text("Select origin")');
    await page.selectOption('select:has-text("Select origin")', { index: 1 });
    
    // Select destination warehouse
    await page.click('select:has-text("Select destination")');
    await page.selectOption('select:has-text("Select destination")', { index: 2 });
    
    // Submit
    await page.click('button[type="submit"]:has-text("Create")');
    
    // Verify success
    await expect(page.locator(".toast, [role='alert']")).toContainText(/created|success/i);
  });
});

test.describe("Invoice Workflows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || "test@taccargo.com");
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || "testpassword");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard/**");
  });

  test("should display invoices list", async ({ page }) => {
    await page.goto("/dashboard/invoices");
    await expect(page.locator("h1, h2")).toContainText(/invoice/i);
  });

  test("should navigate to create invoice page", async ({ page }) => {
    await page.goto("/dashboard/invoices");
    
    // Click create button
    await page.click('a:has-text("Create"), button:has-text("New Invoice")');
    
    // Verify navigation to create page
    await expect(page).toHaveURL(/invoices\/create/);
  });

  test("should filter invoices by status", async ({ page }) => {
    await page.goto("/dashboard/invoices");
    
    // Click status filter
    const filterButton = page.locator('button:has-text("Status"), [data-testid="invoice-status-filter"]');
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.click('text=Paid');
    }
  });
});

test.describe("Route Tracker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || "test@taccargo.com");
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || "testpassword");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard/**");
  });

  test("should display route tracker with stats", async ({ page }) => {
    await page.goto("/dashboard/route-tracker");
    
    // Verify stats cards are visible
    await expect(page.locator("text=Active Routes")).toBeVisible();
    await expect(page.locator("text=Completed Today")).toBeVisible();
    await expect(page.locator("text=Pending Dispatch")).toBeVisible();
  });

  test("should filter routes by status", async ({ page }) => {
    await page.goto("/dashboard/route-tracker");
    
    // Use status filter
    await page.click('button:has-text("Filter"), [data-testid="route-status-filter"]');
    await page.click('text=In Transit');
  });

  test("should display route details on selection", async ({ page }) => {
    await page.goto("/dashboard/route-tracker");
    
    // Click on a route card
    const routeCard = page.locator('[class*="cursor-pointer"]').first();
    if (await routeCard.isVisible()) {
      await routeCard.click();
      
      // Verify details panel shows
      await expect(page.locator("text=Route Details")).toBeVisible();
    }
  });
});

test.describe("Tracking Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || "test@taccargo.com");
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || "testpassword");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard/**");
  });

  test("should display tracking page with status pipeline", async ({ page }) => {
    await page.goto("/dashboard/tracking");
    
    // Verify page loaded
    await expect(page.locator("body")).toContainText(/track/i);
  });

  test("should search shipment by reference", async ({ page }) => {
    await page.goto("/dashboard/tracking");
    
    // Enter tracking number
    await page.fill('input[placeholder*="search" i], input[placeholder*="track" i]', "SHP-");
    await page.waitForTimeout(500);
  });
});

test.describe("Public Tracking", () => {
  test("should allow public tracking without login", async ({ page }) => {
    await page.goto("/track");
    
    // Verify tracking page is accessible
    await expect(page.locator("body")).toContainText(/track/i);
  });

  test("should show tracking results for valid reference", async ({ page }) => {
    await page.goto("/track");
    
    // Enter a tracking reference
    await page.fill('input[placeholder*="tracking" i], input[name="reference"]', "TAC88291");
    await page.click('button[type="submit"], button:has-text("Track")');
    
    // Wait for results
    await page.waitForTimeout(1000);
  });
});
