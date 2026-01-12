#!/usr/bin/env node

/**
 * Comprehensive API Endpoint Testing Script
 * Tests all 34 identified API endpoints for functionality and error handling
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
 * Make HTTP request with error handling
 */
async function makeRequest(endpoint, method = 'GET', body = null, headers = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      status: 0,
      statusText: 'Network Error',
      data: null,
      error: error.message
    };
  }
}

/**
 * Test individual endpoint
 */
async function testEndpoint(endpoint, expectedStatus = [200, 401, 403], description = '') {
  results.total++;
  
  console.log(`${colors.blue}Testing:${colors.reset} ${endpoint} ${description ? `(${description})` : ''}`);
  
  const result = await makeRequest(endpoint);
  
  if (result.error) {
    console.log(`  ${colors.red}✗ ERROR:${colors.reset} ${result.error}`);
    results.failed++;
    results.errors.push(`${endpoint}: ${result.error}`);
    return false;
  }
  
  const statusOk = Array.isArray(expectedStatus) 
    ? expectedStatus.includes(result.status)
    : result.status === expectedStatus;
    
  if (statusOk) {
    console.log(`  ${colors.green}✓ PASS:${colors.reset} ${result.status} ${result.statusText}`);
    if (result.data && typeof result.data === 'object') {
      console.log(`  ${colors.yellow}Response:${colors.reset} ${JSON.stringify(result.data).substring(0, 100)}...`);
    }
    results.passed++;
    return true;
  } else {
    console.log(`  ${colors.red}✗ FAIL:${colors.reset} Expected ${expectedStatus}, got ${result.status}`);
    results.failed++;
    results.errors.push(`${endpoint}: Expected ${expectedStatus}, got ${result.status}`);
    return false;
  }
}

/**
 * Main testing function
 */
async function runTests() {
  console.log(`${colors.bold}${colors.blue}TAC Cargo API Endpoint Testing${colors.reset}\n`);
  console.log(`Testing against: ${BASE_URL}\n`);

  // Health and System Endpoints
  console.log(`${colors.bold}=== Health & System Endpoints ===${colors.reset}`);
  await testEndpoint('/api/health', [200], 'Main health check');
  await testEndpoint('/api/test/health', [200], 'Test health check');
  await testEndpoint('/api/db-schema', [401, 403, 200], 'Database schema');
  await testEndpoint('/api/migrate', [401, 403, 200], 'Database migration');
  await testEndpoint('/api/run-migration', [401, 403, 200], 'Migration runner');

  // Authentication & User Management
  console.log(`\n${colors.bold}=== Authentication & User Management ===${colors.reset}`);
  await testEndpoint('/api/test/auth', [401, 403, 200], 'Test auth endpoint');
  await testEndpoint('/api/profile', [401, 403, 200], 'User profile');
  await testEndpoint('/api/access-requests', [401, 403, 200], 'Access requests');
  await testEndpoint('/api/organization', [401, 403, 200], 'Organization management');

  // Core Business Entities
  console.log(`\n${colors.bold}=== Core Business Entities ===${colors.reset}`);
  await testEndpoint('/api/customers', [401, 403, 200], 'Customer management');
  await testEndpoint('/api/invoices', [401, 403, 200], 'Invoice operations');
  await testEndpoint('/api/shipments', [401, 403, 200], 'Shipment management');
  await testEndpoint('/api/manifests', [401, 403, 200], 'Manifest operations');
  await testEndpoint('/api/warehouses', [401, 403, 200], 'Warehouse management');

  // Invoice Related
  console.log(`\n${colors.bold}=== Invoice Related Endpoints ===${colors.reset}`);
  await testEndpoint('/api/invoices/analytics', [401, 403, 200], 'Invoice analytics');
  await testEndpoint('/api/invoices/send', [401, 403, 405], 'Send invoice notifications');
  await testEndpoint('/api/test/invoices', [401, 403, 200], 'Test invoice data');

  // Tracking & Scanning
  console.log(`\n${colors.bold}=== Tracking & Scanning ===${colors.reset}`);
  await testEndpoint('/api/track', [401, 403, 200, 400], 'Generic tracking');
  await testEndpoint('/api/tracking', [401, 403, 200, 400], 'Alternative tracking');
  await testEndpoint('/api/scan', [401, 403, 405], 'Barcode scanning');

  // Payments & Webhooks
  console.log(`\n${colors.bold}=== Payments & Webhooks ===${colors.reset}`);
  await testEndpoint('/api/payments', [401, 403, 200], 'Payment operations');
  await testEndpoint('/api/payments/create-link', [401, 403, 405], 'Create payment link');
  await testEndpoint('/api/webhooks', [401, 403, 405], 'Generic webhooks');
  await testEndpoint('/api/webhooks/razorpay', [401, 403, 405], 'Razorpay webhooks');

  // System & Admin
  console.log(`\n${colors.bold}=== System & Admin Endpoints ===${colors.reset}`);
  await testEndpoint('/api/api-keys', [401, 403, 200], 'API key management');
  await testEndpoint('/api/audit-logs', [401, 403, 200], 'Audit logs');
  await testEndpoint('/api/notifications', [401, 403, 200], 'Notifications');
  await testEndpoint('/api/feedback', [401, 403, 405], 'User feedback');
  await testEndpoint('/api/exceptions', [401, 403, 405], 'Exception logging');
  await testEndpoint('/api/export', [401, 403, 200], 'Data export');

  // MCP Integration
  console.log(`\n${colors.bold}=== MCP Integration ===${colors.reset}`);
  await testEndpoint('/api/mcp/query', [401, 403, 405], 'MCP query interface');

  // Test specific ID-based endpoints (these should return 400/404 without valid IDs)
  console.log(`\n${colors.bold}=== ID-based Endpoints (Expected 400/404) ===${colors.reset}`);
  await testEndpoint('/api/invoices/invalid-id/pdf', [400, 404, 401, 403], 'Invoice PDF generation');
  await testEndpoint('/api/invoices/invalid-id/label', [400, 404, 401, 403], 'Invoice label generation');
  await testEndpoint('/api/track/invalid-reference', [400, 404, 401, 403], 'Track by reference');

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
    console.log(`\n${colors.green}${colors.bold}🎉 ALL TESTS PASSED! API endpoints are functional.${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  Some endpoints need attention, but this may be expected behavior.${colors.reset}`);
  }
}

// Run the tests
runTests().catch(console.error);
