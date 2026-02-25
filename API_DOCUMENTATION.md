# SharePlate API Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Authentication Endpoints](#authentication-endpoints)
5. [Donation Endpoints](#donation-endpoints)
6. [Request Endpoints](#request-endpoints)
7. [Testing Examples](#testing-examples)

---

## Getting Started

### Base URL
```
Development: http://localhost:5000
Production: TBD (To be deployed)
```

### API Documentation
```
Swagger UI: http://localhost:5000/api-docs
```

### Content Type
All requests and responses use JSON format:
```
Content-Type: application/json
```

### Authentication Header
Protected endpoints require JWT token:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication

### How It Works

1. **Register or Login** to receive a JWT token
2. **Include the token** in the Authorization header for protected routes
3. **Token expires** after 7 days (configurable)

### Token Format
```json
{
  "id": "user_id_here",
  "role": "donor" | "shelter",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description here",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (wrong role) |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Authentication Endpoints

### 1. Register User

Create a new user account (donor or shelter).

**Endpoint:** `POST /api/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "donor",
  "organizationName": "John's Restaurant",
  "location": {
    "address": "123 Main Street, City",
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

**Validation Rules:**
- `name`: Required, string
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `role`: Required, must be "donor" or "shelter"
- `organizationName`: Optional, string
- `location`: Optional, object

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def456789",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. Login User

Authenticate user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def456789",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get User Profile

Get current authenticated user's profile.

**Endpoint:** `GET /api/auth/profile`

**Access:** Protected (requires authentication)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "65abc123def456789",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor",
    "organizationName": "John's Restaurant",
    "location": {
      "address": "123 Main Street, City",
      "lat": 40.7128,
      "lng": -74.0060
    },
    "createdAt": "2026-02-25T10:00:00.000Z",
    "updatedAt": "2026-02-25T10:00:00.000Z"
  }
}
```

---

## Donation Endpoints

### 1. Create Donation

Create a new food donation (donor only).

**Endpoint:** `POST /api/donations`

**Access:** Protected (Donor role only)

**Headers:**
```
Authorization: Bearer <donor_jwt_token>
```

**Request Body:**
```json
{
  "foodName": "Fresh Pizza",
  "quantity": 10,
  "expiryDate": "2026-02-28",
  "location": {
    "address": "123 Main Street, City",
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

**Validation Rules:**
- `foodName`: Required, non-empty string
- `quantity`: Required, positive integer (min: 1)
- `expiryDate`: Required, valid ISO 8601 date format
- `location`: Optional, object with address, lat, lng

**Success Response (201):**
```json
{
  "success": true,
  "message": "Donation created successfully",
  "donation": {
    "_id": "65xyz789abc123456",
    "donor": "65abc123def456789",
    "foodName": "Fresh Pizza",
    "quantity": 10,
    "expiryDate": "2026-02-28T00:00:00.000Z",
    "status": "available",
    "location": {
      "address": "123 Main Street, City",
      "lat": 40.7128,
      "lng": -74.0060
    },
    "createdAt": "2026-02-25T10:00:00.000Z",
    "updatedAt": "2026-02-25T10:00:00.000Z"
  }
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "quantity",
      "message": "Quantity must be a positive number"
    }
  ]
}
```

---

### 2. Get Available Donations

Browse all available donations.

**Endpoint:** `GET /api/donations/available`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "donations": [
    {
      "_id": "65xyz789abc123456",
      "foodName": "Fresh Pizza",
      "quantity": 10,
      "expiryDate": "2026-02-28T00:00:00.000Z",
      "status": "available",
      "location": {
        "address": "123 Main Street, City",
        "lat": 40.7128,
        "lng": -74.0060
      },
      "donor": {
        "_id": "65abc123def456789",
        "name": "John Doe",
        "email": "john@example.com",
        "organizationName": "John's Restaurant"
      },
      "createdAt": "2026-02-25T10:00:00.000Z"
    },
    {
      "_id": "65xyz789abc123457",
      "foodName": "Sandwiches",
      "quantity": 20,
      "expiryDate": "2026-02-27T00:00:00.000Z",
      "status": "available",
      "donor": {
        "_id": "65abc123def456788",
        "name": "Jane's Cafe",
        "email": "jane@cafe.com"
      },
      "createdAt": "2026-02-25T09:00:00.000Z"
    }
  ]
}
```

---

### 3. Get My Donations

Get all donations created by the logged-in donor.

**Endpoint:** `GET /api/donations/my-donations`

**Access:** Protected (Donor role only)

**Headers:**
```
Authorization: Bearer <donor_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "donations": [
    {
      "_id": "65xyz789abc123456",
      "foodName": "Fresh Pizza",
      "quantity": 10,
      "expiryDate": "2026-02-28T00:00:00.000Z",
      "status": "approved",
      "createdAt": "2026-02-25T10:00:00.000Z"
    }
  ]
}
```

---

### 4. Get Donation by ID

Get details of a specific donation.

**Endpoint:** `GET /api/donations/:id`

**Access:** Public

**Parameters:**
- `id`: Donation ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "donation": {
    "_id": "65xyz789abc123456",
    "foodName": "Fresh Pizza",
    "quantity": 10,
    "expiryDate": "2026-02-28T00:00:00.000Z",
    "status": "available",
    "donor": {
      "_id": "65abc123def456789",
      "name": "John Doe",
      "organizationName": "John's Restaurant"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Donation not found"
}
```

---

### 5. Get All Donations

Get all donations (authenticated users).

**Endpoint:** `GET /api/donations`

**Access:** Protected (requires authentication)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "donations": [...]
}
```

---

## Request Endpoints

### 1. Create Request

Create a request for a donation (shelter only).

**Endpoint:** `POST /api/requests`

**Access:** Protected (Shelter role only)

**Headers:**
```
Authorization: Bearer <shelter_jwt_token>
```

**Request Body:**
```json
{
  "donationId": "65xyz789abc123456",
  "message": "We need this for 50 people at our shelter tonight"
}
```

**Validation Rules:**
- `donationId`: Required, valid MongoDB ObjectId
- `message`: Optional, max 500 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Request created successfully",
  "request": {
    "_id": "65req123abc456789",
    "donation": "65xyz789abc123456",
    "shelter": "65shelter123456",
    "status": "pending",
    "message": "We need this for 50 people at our shelter tonight",
    "createdAt": "2026-02-25T11:00:00.000Z"
  }
}
```

**Error Responses:**

**400 - Donation Not Available:**
```json
{
  "success": false,
  "message": "Donation not available"
}
```

**400 - Duplicate Request:**
```json
{
  "success": false,
  "message": "You have already requested this donation"
}
```

**403 - Wrong Role:**
```json
{
  "success": false,
  "message": "Access denied"
}
```

---

### 2. Approve Request

Approve a request for your donation (donor only).

**Endpoint:** `PUT /api/requests/:id/approve`

**Access:** Protected (Donor role only, must own the donation)

**Headers:**
```
Authorization: Bearer <donor_jwt_token>
```

**Parameters:**
- `id`: Request ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "message": "Request approved and other requests rejected",
  "request": {
    "_id": "65req123abc456789",
    "donation": {
      "_id": "65xyz789abc123456",
      "foodName": "Fresh Pizza",
      "status": "approved"
    },
    "shelter": {
      "_id": "65shelter123456",
      "name": "Hope Shelter",
      "email": "hope@shelter.org"
    },
    "status": "approved",
    "message": "We need this for 50 people",
    "updatedAt": "2026-02-25T12:00:00.000Z"
  }
}
```

**Behavior:**
- Updates request status to "approved"
- Updates donation status to "approved"
- Auto-rejects all other pending requests for same donation

**Error Responses:**

**404 - Request Not Found:**
```json
{
  "success": false,
  "message": "Request not found"
}
```

**403 - Not Your Donation:**
```json
{
  "success": false,
  "message": "You are not authorized to approve this request"
}
```

---

### 3. Reject Request

Reject a request for your donation (donor only).

**Endpoint:** `PUT /api/requests/:id/reject`

**Access:** Protected (Donor role only, must own the donation)

**Headers:**
```
Authorization: Bearer <donor_jwt_token>
```

**Parameters:**
- `id`: Request ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "message": "Request rejected",
  "request": {
    "_id": "65req123abc456789",
    "status": "rejected",
    "updatedAt": "2026-02-25T12:00:00.000Z"
  }
}
```

**Behavior:**
- Updates request status to "rejected"
- If no other pending requests exist, donation becomes "available" again
- If other pending requests exist, donation stays "requested"

---

### 4. Get My Requests

Get all requests made by the logged-in shelter.

**Endpoint:** `GET /api/requests/my-requests`

**Access:** Protected (Shelter role only)

**Headers:**
```
Authorization: Bearer <shelter_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "requests": [
    {
      "_id": "65req123abc456789",
      "donation": {
        "_id": "65xyz789abc123456",
        "foodName": "Fresh Pizza",
        "quantity": 10,
        "status": "approved",
        "donor": {
          "name": "John Doe",
          "email": "john@example.com",
          "organizationName": "John's Restaurant"
        }
      },
      "status": "approved",
      "message": "We need this for 50 people",
      "createdAt": "2026-02-25T11:00:00.000Z"
    }
  ]
}
```

---

### 5. Get Requests for My Donations

Get all requests for the logged-in donor's donations.

**Endpoint:** `GET /api/requests/my-donations`

**Access:** Protected (Donor role only)

**Headers:**
```
Authorization: Bearer <donor_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "requests": [
    {
      "_id": "65req123abc456789",
      "shelter": {
        "_id": "65shelter123456",
        "name": "Hope Shelter",
        "email": "hope@shelter.org",
        "organizationName": "Hope Shelter Inc."
      },
      "donation": {
        "_id": "65xyz789abc123456",
        "foodName": "Fresh Pizza",
        "quantity": 10,
        "status": "requested"
      },
      "status": "pending",
      "message": "We need this for 50 people tonight",
      "createdAt": "2026-02-25T11:00:00.000Z"
    }
  ]
}
```

---

### 6. Get All Requests

Get all requests in the system (authenticated users).

**Endpoint:** `GET /api/requests`

**Access:** Protected (requires authentication)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "requests": [...]
}
```

---

### 7. Get Requests by Donation

Get all requests for a specific donation.

**Endpoint:** `GET /api/requests/donation/:donationId`

**Access:** Protected (requires authentication)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `donationId`: Donation ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "requests": [
    {
      "_id": "65req123abc456789",
      "shelter": {
        "name": "Hope Shelter",
        "email": "hope@shelter.org"
      },
      "donation": {
        "foodName": "Fresh Pizza",
        "quantity": 10,
        "status": "requested"
      },
      "status": "pending",
      "createdAt": "2026-02-25T11:00:00.000Z"
    }
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid donation ID"
}
```

---

## Testing Examples

### Using cURL

#### 1. Register a Donor
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@restaurant.com",
    "password": "SecurePass123",
    "role": "donor",
    "organizationName": "Johns Restaurant"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@restaurant.com",
    "password": "SecurePass123"
  }'
```

#### 3. Create Donation (use token from login)
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "foodName": "Fresh Pizza",
    "quantity": 10,
    "expiryDate": "2026-02-28"
  }'
```

#### 4. Browse Donations (no auth needed)
```bash
curl -X GET http://localhost:5000/api/donations/available
```

#### 5. Create Request (shelter token)
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SHELTER_TOKEN_HERE" \
  -d '{
    "donationId": "DONATION_ID_HERE",
    "message": "We need this for our shelter"
  }'
```

#### 6. Approve Request (donor token)
```bash
curl -X PUT http://localhost:5000/api/requests/REQUEST_ID_HERE/approve \
  -H "Authorization: Bearer DONOR_TOKEN_HERE"
```

---

### Using Postman

1. **Import Collection**: Use Swagger UI to export collection
2. **Set Environment Variables**:
   - `base_url`: `http://localhost:5000`
   - `donor_token`: (paste token after login)
   - `shelter_token`: (paste token after login)

3. **Test Workflow**:
   - Register Donor → Save token
   - Register Shelter → Save token
   - Create Donation (donor)
   - Browse Donations
   - Create Request (shelter)
   - Approve Request (donor)

---

## Rate Limiting (Future Implementation)

To prevent abuse, rate limiting will be implemented:

```
- Authentication endpoints: 5 requests/minute
- General API: 100 requests/minute
- Admin endpoints: 50 requests/minute
```

---

## Pagination (Future Implementation)

For list endpoints, pagination will be supported:

```
GET /api/donations?page=1&limit=20

Response:
{
  "success": true,
  "count": 20,
  "totalCount": 150,
  "page": 1,
  "totalPages": 8,
  "donations": [...]
}
```

---

## API Versioning (Future)

API versioning will be introduced:

```
Current: /api/donations
Future:  /api/v1/donations
         /api/v2/donations
```

---

**Document Version**: 1.0  
**Last Updated**: February 25, 2026  
**API Status**: Stable for Evaluation 1
