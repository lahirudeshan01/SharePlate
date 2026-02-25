# SharePlate Testing Documentation

## Overview

This document provides comprehensive information about the testing suite for the SharePlate Request Matching & Approval component. Our testing strategy includes both unit tests and integration tests to ensure code quality, reliability, and maintainability.

## Table of Contents

- [Testing Framework](#testing-framework)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Files Overview](#test-files-overview)
- [Writing New Tests](#writing-new-tests)
- [Troubleshooting](#troubleshooting)

## Testing Framework

### Technologies Used

- **Jest**: JavaScript testing framework for unit and integration tests
- **Supertest**: HTTP assertion library for API integration testing
- **MongoDB Memory Server**: In-memory MongoDB for isolated testing (optional)

### Installed Packages

```json
{
  "jest": "^29.7.0",
  "supertest": "^7.0.0",
  "@types/jest": "^29.5.14"
}
```

## Test Structure

```
tests/
├── unit/
│   ├── requestController.test.js    # Request controller unit tests
│   └── authMiddleware.test.js       # Auth middleware unit tests
└── integration/
    ├── request.api.test.js          # Request API integration tests
    ├── auth.api.test.js             # Auth API integration tests
    └── donation.api.test.js         # Donation API integration tests
```

### Unit Tests

Unit tests focus on individual functions and modules in isolation. They use mocked dependencies to test business logic independently.

**Location**: `tests/unit/`

**Files**:
- `requestController.test.js`: Tests for request controller functions
- `authMiddleware.test.js`: Tests for JWT authentication middleware

**Coverage**:
- createRequest() with duplicate prevention
- approveRequest() with auto-rejection mechanism
- rejectRequest() with smart status management
- getRequestsByDonation() with validation
- Authentication token verification
- Error handling scenarios

### Integration Tests

Integration tests verify the complete API workflows including HTTP requests, responses, database operations, and middleware chains.

**Location**: `tests/integration/`

**Files**:
- `request.api.test.js`: Complete request API workflow tests
- `auth.api.test.js`: Authentication flow tests
- `donation.api.test.js`: Donation management tests

**Coverage**:
- Complete HTTP request/response cycles
- Authentication & authorization flows
- Database CRUD operations
- Role-based access control
- Input validation
- Error responses (401, 403, 404, 400, 500)

## Running Tests

### All Tests

Run all unit and integration tests:

```bash
npm test
```

### Unit Tests Only

Run only unit tests:

```bash
npm run test:unit
```

### Integration Tests Only

Run only integration tests:

```bash
npm run test:integration
```

### Watch Mode

Run tests in watch mode (re-runs on file changes):

```bash
npm run test:watch
```

### With Coverage Report

Generate test coverage report:

```bash
npm test -- --coverage
```

### Specific Test File

Run a specific test file:

```bash
npm test tests/unit/requestController.test.js
```

### Specific Test Suite

Run a specific describe block:

```bash
npm test -- --testNamePattern="POST /api/requests"
```

## Test Coverage

### Current Coverage Areas

#### Request API (15+ integration tests)
- ✅ Create request (POST /api/requests)
  - Valid request creation
  - Authentication requirement
  - Role-based access (shelter only)
  - Invalid donation ID
  - Unavailable donations
  - Duplicate request prevention
  - Message validation
  
- ✅ Approve request (PUT /api/requests/:id/approve)
  - Successful approval by donor
  - Auto-rejection of other requests
  - Authorization checks
  - Non-existent request handling
  - Ownership verification
  
- ✅ Reject request (PUT /api/requests/:id/reject)
  - Successful rejection
  - Smart donation status management
  - Authorization checks
  
- ✅ Get my requests (GET /api/requests/my-requests)
  - Shelter's own requests
  - Authentication requirement
  - Role-based access
  
- ✅ Get requests for my donations (GET /api/requests/my-donations)
  - Donor's donation requests
  - Authorization checks
  
- ✅ Get requests by donation (GET /api/requests/donation/:donationId)
  - Valid donation ID
  - Invalid donation ID handling

#### Authentication API (15+ integration tests)
- ✅ Register (POST /api/auth/register)
  - Donor registration
  - Shelter registration
  - Duplicate email handling
  - Password mismatch
  - Invalid email format
  - Weak password detection
  - Invalid role
  - Required field validation
  - Password hashing verification
  
- ✅ Login (POST /api/auth/login)
  - Successful login
  - Non-existent user
  - Incorrect password
  - Missing credentials
  - JWT token generation
  
- ✅ Profile (GET /api/auth/profile)
  - Valid token access
  - Missing token
  - Invalid token
  - Malformed header
  - Deleted user handling

#### Donation API (20+ integration tests)
- ✅ Create donation (POST /api/donations)
  - Valid donation creation
  - Authentication requirement
  - Role-based access (donor only)
  - Missing required fields
  - Negative quantity
  - Past expiry date
  - Input sanitization
  
- ✅ Browse donations (GET /api/donations)
  - Available donations only
  - No authentication required
  - Donor information population
  - Empty results
  
- ✅ Get donation by ID (GET /api/donations/:id)
  - Valid ID
  - Non-existent donation
  - Invalid ID format
  
- ✅ Get my donations (GET /api/donations/my-donations)
  - Owner's donations only
  - Authentication requirement
  - Role-based access
  
- ✅ Update donation (PUT /api/donations/:id)
  - Successful update by owner
  - Authorization checks
  - Ownership verification
  - Non-existent donation
  
- ✅ Delete donation (DELETE /api/donations/:id)
  - Successful deletion
  - Authorization checks
  - Ownership verification

#### Controller Unit Tests (20+ tests)
- ✅ Request Controller
  - createRequest with mocked models
  - approveRequest with auto-rejection logic
  - rejectRequest with status management
  - getRequestsByDonation with validation
  - getMyRequests with filtering
  - Error handling
  
- ✅ Auth Middleware
  - Valid token verification
  - Missing token rejection
  - Invalid token handling
  - User not found scenario
  - Malformed token format

### Coverage Metrics

To view detailed coverage metrics:

```bash
npm test -- --coverage
```

**Coverage report includes**:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

Coverage reports are generated in the `coverage/` directory and can be viewed as HTML:

```bash
# Open coverage report (Windows)
start coverage/lcov-report/index.html

# Open coverage report (Mac/Linux)
open coverage/lcov-report/index.html
```

## Test Files Overview

### tests/unit/requestController.test.js

**Purpose**: Unit tests for request controller business logic

**Test Suites**:
1. `createRequest()` - Request creation with validation
2. `approveRequest()` - Approval with auto-rejection
3. `rejectRequest()` - Rejection with status management
4. `getRequestsByDonation()` - Retrieval with validation
5. `getMyRequests()` - User-specific requests

**Key Features**:
- Mocked Mongoose models
- Isolated function testing
- Error scenario coverage
- Input validation testing

**Example Test**:
```javascript
it('should auto-reject other pending requests when approving', async () => {
  // Test implementation
});
```

### tests/unit/authMiddleware.test.js

**Purpose**: Unit tests for JWT authentication middleware

**Test Suites**:
1. Valid authentication flow
2. Missing token handling
3. Invalid token scenarios
4. User lookup failures
5. Token format validation

**Example Test**:
```javascript
it('should verify valid token and attach user to request', async () => {
  // Test implementation
});
```

### tests/integration/request.api.test.js

**Purpose**: Integration tests for complete request API workflows

**Setup**:
- Test database connection
- Test user creation (donor & shelter)
- Test donation creation
- Cleanup after tests

**Test Suites**:
1. POST /api/requests - Create request
2. PUT /api/requests/:id/approve - Approve request
3. PUT /api/requests/:id/reject - Reject request
4. GET /api/requests/my-requests - Get shelter's requests
5. GET /api/requests/my-donations - Get donor's requests
6. GET /api/requests/donation/:donationId - Get requests by donation
7. Complete workflow test

**Example Test**:
```javascript
it('should complete full request lifecycle: create → approve → auto-reject', async () => {
  // Multi-step workflow test
});
```

### tests/integration/auth.api.test.js

**Purpose**: Integration tests for authentication API

**Test Suites**:
1. POST /api/auth/register - User registration
2. POST /api/auth/login - User login
3. GET /api/auth/profile - Get user profile
4. Complete auth workflow

**Example Test**:
```javascript
it('should complete full auth cycle: register → login → access protected route', async () => {
  // Complete authentication flow
});
```

### tests/integration/donation.api.test.js

**Purpose**: Integration tests for donation management API

**Test Suites**:
1. POST /api/donations - Create donation
2. GET /api/donations - Browse donations
3. GET /api/donations/:id - Get donation by ID
4. GET /api/donations/my-donations - Get owner's donations
5. PUT /api/donations/:id - Update donation
6. DELETE /api/donations/:id - Delete donation
7. Complete workflow test

**Example Test**:
```javascript
it('should complete full donation lifecycle: create → browse → update → delete', async () => {
  // Complete CRUD workflow
});
```

## Writing New Tests

### Unit Test Template

```javascript
const YourController = require('../../src/controllers/YourController');
const Model = require('../../src/models/Model');

jest.mock('../../src/models/Model');

describe('YourController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 'userId', role: 'donor' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('yourFunction()', () => {
    it('should handle success case', async () => {
      Model.someMethod.mockResolvedValue({ data: 'result' });

      await YourController.yourFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should handle error case', async () => {
      Model.someMethod.mockRejectedValue(new Error('Error'));

      await YourController.yourFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
```

### Integration Test Template

```javascript
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Model = require('../../src/models/Model');

describe('API Endpoint - Integration Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    }
  });

  beforeEach(async () => {
    await Model.deleteMany({});
    // Setup test data
  });

  afterAll(async () => {
    await Model.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/endpoint', () => {
    it('should return data successfully', async () => {
      const response = await request(app)
        .get('/api/endpoint')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
```

### Best Practices

1. **Descriptive Test Names**: Use clear, specific test names
   ```javascript
   ✅ it('should return 403 if shelter tries to approve request', ...)
   ❌ it('should fail', ...)
   ```

2. **Arrange-Act-Assert Pattern**:
   ```javascript
   it('should create request', async () => {
     // Arrange: Setup test data
     const testData = { ... };
     
     // Act: Perform action
     const response = await request(app).post('/api/requests').send(testData);
     
     // Assert: Verify results
     expect(response.status).toBe(201);
   });
   ```

3. **Test Independence**: Each test should run independently
   - Use `beforeEach` for setup
   - Clean up data after tests
   - Don't rely on test execution order

4. **Mock External Dependencies**: Mock databases, APIs, and services in unit tests
   ```javascript
   jest.mock('../../src/models/Model');
   ```

5. **Test Error Cases**: Don't just test happy paths
   ```javascript
   it('should handle database errors gracefully', async () => {
     Model.find.mockRejectedValue(new Error('DB Error'));
     // Test error handling
   });
   ```

## Troubleshooting

### Common Issues

#### 1. Tests Timing Out

**Problem**: Tests exceed default timeout (5000ms)

**Solution**: Increase timeout in jest.config.js or specific test:
```javascript
jest.setTimeout(10000); // Global
// or
it('slow test', async () => { ... }, 10000); // Per test
```

#### 2. Database Connection Errors

**Problem**: Cannot connect to MongoDB

**Solution**: 
- Ensure MongoDB is running
- Check MONGO_URI environment variable
- Use test database URI: `mongodb://localhost:27017/shareplate-test`

#### 3. Port Already in Use

**Problem**: Server port 5000 already in use

**Solution**: 
- Ensure tests don't start the server (NODE_ENV=test)
- Close existing server instances
- Use dynamic ports in tests

#### 4. Authentication Token Invalid

**Problem**: JWT_SECRET mismatch in tests

**Solution**:
```javascript
const token = jwt.sign(
  { id: userId, role: 'donor' },
  process.env.JWT_SECRET || 'test-secret',
  { expiresIn: '1h' }
);
```

#### 5. Mock Not Working

**Problem**: Mock functions not being called

**Solution**:
- Clear mocks between tests: `jest.clearAllMocks()`
- Check mock implementation: `mockResolvedValue()` vs `mockReturnValue()`
- Verify import paths

#### 6. Coverage Not Generated

**Problem**: No coverage report

**Solution**:
```bash
npm test -- --coverage --coverageReporters=text --coverageReporters=lcov
```

### Debug Mode

Run tests with debugging:

```bash
# Node.js debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Verbose output
npm test -- --verbose

# Show console.log output
npm test -- --silent=false
```

### Environment Variables

Create `.env.test` file for test-specific configuration:

```env
NODE_ENV=test
MONGO_URI=mongodb://localhost:27017/shareplate-test
JWT_SECRET=test-secret-key-for-testing
PORT=5001
```

Load in tests:
```javascript
require('dotenv').config({ path: '.env.test' });
```

## Test Maintenance

### When to Update Tests

- ✅ After adding new features
- ✅ After fixing bugs (add regression tests)
- ✅ After changing API endpoints
- ✅ After modifying business logic
- ✅ Before major refactoring

### Test Review Checklist

- [ ] All tests pass
- [ ] Coverage metrics meet standards (>80%)
- [ ] Tests are independent
- [ ] Error cases are covered
- [ ] Authentication/Authorization tested
- [ ] Edge cases handled
- [ ] Documentation updated

## Presentation Guide

When demonstrating tests to evaluators:

### 1. Run All Tests
```bash
npm test
```
Show that all tests pass successfully.

### 2. Show Test Coverage
```bash
npm test -- --coverage
```
Highlight high coverage percentages.

### 3. Explain Test Structure
- Unit tests for business logic
- Integration tests for API workflows
- Comprehensive coverage of all endpoints

### 4. Demo Specific Test
```bash
npm test tests/integration/request.api.test.js
```
Walk through request lifecycle test.

### 5. Show Test Files
Open and explain:
- Test organization
- Mocking strategies
- Assertion patterns

### 6. Explain Testing Strategy
- Isolated unit tests
- Complete integration workflows
- Authentication/Authorization coverage
- Error handling verification

## Continuous Integration

### GitHub Actions Example (Future Enhancement)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Additional Resources

### Jest Documentation
- Official Docs: https://jestjs.io/docs/getting-started
- Matchers: https://jestjs.io/docs/expect
- Mock Functions: https://jestjs.io/docs/mock-functions

### Supertest Documentation
- Official Docs: https://github.com/ladjs/supertest#readme
- Examples: https://github.com/ladjs/supertest/tree/master/test

### Best Practices
- Testing Express APIs: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
- Jest Best Practices: https://github.com/goldbergyoni/javascript-testing-best-practices

---

## Summary

Our testing suite provides comprehensive coverage of the SharePlate Request Matching & Approval component:

✅ **60+ Tests** covering all functionality  
✅ **Unit Tests** for isolated business logic  
✅ **Integration Tests** for complete API workflows  
✅ **High Coverage** of controllers, routes, and middleware  
✅ **Authentication & Authorization** thoroughly tested  
✅ **Error Handling** verified across all scenarios  

Run `npm test` to execute the entire test suite and verify system integrity.

For questions or issues, refer to the troubleshooting section or contact the development team.
