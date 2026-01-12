#!/usr/bin/env node

/**
 * Dashboard Pages Validation Script
 * Tests all dashboard routes load correctly with proper rendering
 */

const BASE_URL = 'http://localhost:3001';

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

/**
 * Test page loading
 */
async function testPage(path, description = '') {
  results.total++;
  
  console.log(`${colors.blue}Testing:${colors.reset} ${path} ${description ? `(${description})` : ''}`);
  
  try {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TAC-Test/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    const contentType = response.headers.get('content-type');
    const isHtml = contentType && contentType.includes('text/html');
    
    if (response.status === 200 && isHtml) {
      const html = await response.text();
      
      // Basic HTML validation
      const hasDoctype = html.includes('<!DOCTYPE html>') || html.includes('<!doctype html>');
      const hasTitle = html.includes('<title>') || html.includes('TAC Cargo');
      const hasBody = html.includes('<body') || html.includes('<div');
      const hasReactRoot = html.includes('__next') || html.includes('react');
      
      if (hasDoctype && hasTitle && hasBody) {
        console.log(`  ${colors.green}✓ PASS:${colors.reset} ${response.status} - HTML page loaded successfully`);
        if (hasReactRoot) {
          console.log(`  ${colors.yellow}Info:${colors.reset} React/Next.js detected`);
        }
        results.passed++;
        return true;
      } else {
        console.log(`  ${colors.red}✗ FAIL:${colors.reset} HTML structure incomplete`);
        results.failed++;
        results.errors.push(`${path}: HTML structure incomplete`);
        return false;
      }
    } else if (response.status === 302 || response.status === 307) {
      const location = response.headers.get('location');
      console.log(`  ${colors.yellow}→ REDIRECT:${colors.reset} ${response.status} to ${location}`);
      results.passed++;
      return true;
    } else if (response.status === 401 || response.status === 403) {
      console.log(`  ${colors.yellow}🔒 AUTH REQUIRED:${colors.reset} ${response.status} - Authentication needed`);
      results.passed++;
      return true;
    } else {
      console.log(`  ${colors.red}✗ FAIL:${colors.reset} ${response.status} ${response.statusText}`);
      results.failed++;
      results.errors.push(`${path}: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`  ${colors.red}✗ ERROR:${colors.reset} ${error.message}`);
    results.failed++;
    results.errors.push(`${path}: ${error.message}`);
    return false;
  }
}

/**
 * Main testing function
 */
async function runTests() {
  console.log(`${colors.bold}${colors.blue}TAC Cargo Dashboard Pages Testing${colors.reset}\n`);
  console.log(`Testing against: ${BASE_URL}\n`);

  // Public Pages
  console.log(`${colors.bold}=== Public Pages ===${colors.reset}`);
  await testPage('/', 'Home page');
  await testPage('/login', 'Login page');
  await testPage('/register', 'Registration page');
  await testPage('/request-access', 'Access request page');

  // Payment Pages
  console.log(`\n${colors.bold}=== Payment Pages ===${colors.reset}`);
  await testPage('/payment/success', 'Payment success');
  await testPage('/payment/failed', 'Payment failed');

  // Dashboard Main Pages
  console.log(`\n${colors.bold}=== Dashboard Main Pages ===${colors.reset}`);
  await testPage('/dashboard', 'Main dashboard');
  await testPage('/dashboard/analytics', 'Analytics dashboard');
  await testPage('/dashboard/inventory', 'Inventory management');
  await testPage('/dashboard/tracking', 'Shipment tracking');
  await testPage('/dashboard/settings', 'Settings page');
  await testPage('/dashboard/feedback', 'Feedback page');
  await testPage('/dashboard/support', 'Support page');

  // Customer Management
  console.log(`\n${colors.bold}=== Customer Management ===${colors.reset}`);
  await testPage('/dashboard/customers', 'Customer list');
  await testPage('/dashboard/customers/new', 'New customer form');

  // Shipment Management
  console.log(`\n${colors.bold}=== Shipment Management ===${colors.reset}`);
  await testPage('/dashboard/shipments', 'Shipment list');
  await testPage('/dashboard/shipments/new', 'New shipment form');

  // Invoice Management
  console.log(`\n${colors.bold}=== Invoice Management ===${colors.reset}`);
  await testPage('/dashboard/invoices', 'Invoice list');
  await testPage('/dashboard/invoices/new', 'New invoice form');

  // Manifest Management
  console.log(`\n${colors.bold}=== Manifest Management ===${colors.reset}`);
  await testPage('/dashboard/manifests', 'Manifest list');
  await testPage('/dashboard/manifests/new', 'New manifest form');

  // Scanner Pages
  console.log(`\n${colors.bold}=== Scanner Pages ===${colors.reset}`);
  await testPage('/dashboard/scanner', 'Barcode scanner');
  await testPage('/dashboard/scanner/bulk', 'Bulk scanner');

  // Admin Pages
  console.log(`\n${colors.bold}=== Admin Pages ===${colors.reset}`);
  await testPage('/dashboard/admin', 'Admin dashboard');
  await testPage('/dashboard/admin/users', 'User management');
  await testPage('/dashboard/admin/audit', 'Audit logs');

  // Print summary
  console.log(`\n${colors.bold}=== TEST SUMMARY ===${colors.reset}`);
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  
  if (results.errors.length > 0) {
    console.log(`\n${colors.bold}${colors.red}ERRORS:${colors.reset}`);
    results.errors.forEach(error => console.log(`  ${colors.red}•${colors.reset} ${error}`));
  }
  
  const successRate = ((results.passed / results.total) * 100).toFixed(1);
  console.log(`\n${colors.bold}Success Rate: ${successRate}%${colors.reset}`);
  
  if (results.failed === 0) {
    console.log(`\n${colors.green}${colors.bold}🎉 ALL PAGES ACCESSIBLE! Dashboard is functional.${colors.reset}`);
  } else if (successRate >= 80) {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  Most pages working, some may need authentication or have expected redirects.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bold}❌ Significant issues found. Dashboard needs attention.${colors.reset}`);
  }
}

// Run the tests
runTests().catch(console.error);
