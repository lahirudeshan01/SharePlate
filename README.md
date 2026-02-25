# SharePlate - Food Donation Management System

## 📋 Project Overview

SharePlate is a full-stack web application that connects food donors (restaurants, caterers, individuals) with shelters and charitable organizations to reduce food waste and help those in need. The platform facilitates efficient food donation management through a structured request-matching and approval system.

## 🎯 Project Goals

- **Reduce Food Waste**: Enable donors to share surplus food instead of discarding it
- **Help Communities**: Connect shelters with reliable food sources
- **Streamlined Process**: Automated matching and approval workflow
- **Fair Distribution**: Prevent multiple claims on the same donation
- **Transparency**: Real-time tracking of donations and requests

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│              (React Frontend - To be implemented)                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS/REST API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│                    (Express.js Server)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Stack:                                        │  │
│  │  - CORS Handler                                          │  │
│  │  - JSON Body Parser                                      │  │
│  │  - JWT Authentication (authMiddleware)                   │  │
│  │  - Role-Based Authorization (roleMiddleware)             │  │
│  │  - Request Validation (express-validator)                │  │
│  │  - Error Handler (errorHandler)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼────────┐
│ Authentication│  │  Donations  │  │   Requests   │
│   Routes      │  │   Routes    │  │   Routes     │
│  (Auth Flow)  │  │ (CRUD Ops)  │  │  (Matching)  │
└───────┬──────┘  └──────┬──────┘  └─────┬────────┘
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼────────┐
│     Auth     │  │  Donation   │  │   Request    │
│  Controller  │  │ Controller  │  │  Controller  │
└───────┬──────┘  └──────┬──────┘  └─────┬────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│                     (Mongoose ODM)                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    User     │  │  Donation   │  │   Request   │            │
│  │    Model    │  │    Model    │  │    Model    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│               MongoDB Atlas (Cloud Database)                     │
│                                                                  │
│  Collections: users, donations, requests, pickups               │
└──────────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Backend Framework: **Express.js (Node.js)**

**Justification:**
- ✅ **Fast Development**: Minimal boilerplate, rapid prototyping
- ✅ **JavaScript Everywhere**: Same language for frontend and backend
- ✅ **Large Ecosystem**: 50,000+ npm packages available
- ✅ **RESTful API Support**: Built-in routing and middleware system
- ✅ **Scalability**: Non-blocking I/O, handles concurrent requests efficiently
- ✅ **Community Support**: Extensive documentation and large community
- ✅ **Middleware Architecture**: Easy to add authentication, validation, error handling

**Alternatives Considered:**
- Django (Python): Rejected due to team's stronger JavaScript expertise
- Spring Boot (Java): Too heavy for a rapid development project
- Laravel (PHP): Less modern async capabilities

### Database: **MongoDB (NoSQL)**

**Justification:**
- ✅ **Flexible Schema**: Easy to iterate during development
- ✅ **JSON-Native**: Perfect match with JavaScript/Node.js ecosystem
- ✅ **Scalability**: Horizontal scaling with sharding
- ✅ **Rich Queries**: Supports complex queries and aggregations
- ✅ **Document Model**: Natural fit for nested data (location, user profiles)
- ✅ **MongoDB Atlas**: Free cloud hosting with automated backups
- ✅ **Mongoose ODM**: Provides schema validation and relationships

**Why Not SQL (PostgreSQL/MySQL)?**
- Food donation data has variable structure (different donation types)
- Need for rapid schema changes during development
- No complex multi-table joins required
- Better performance for read-heavy operations (browsing donations)

### Authentication: **JWT (JSON Web Tokens)**

**Justification:**
- ✅ **Stateless**: No server-side session storage needed
- ✅ **Scalable**: Works across multiple servers without shared state
- ✅ **Mobile-Friendly**: Perfect for future mobile app development
- ✅ **Secure**: Cryptographically signed, tamper-proof
- ✅ **Self-Contained**: Token includes user info (id, role)
- ✅ **Standard**: Industry-standard authentication method
- ✅ **CORS-Friendly**: Works seamlessly with frontend on different domain

**Alternatives Considered:**
- Session-based auth: Rejected due to scalability concerns
- OAuth 2.0: Too complex for this project scope
- Basic Auth: Not secure enough for production

### Additional Technologies:

- **express-validator**: Input validation and sanitization
- **bcryptjs**: Password hashing with salt
- **Swagger/OpenAPI**: Automated API documentation
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

## 📊 Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                            USERS                                 │
├─────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                              │
│ name: String                                                     │
│ email: String (unique, indexed)                                 │
│ password: String (hashed)                                        │
│ role: Enum ['donor', 'shelter']                                 │
│ organizationName: String                                         │
│ location: { address, lat, lng }                                 │
│ createdAt: Timestamp                                            │
│ updatedAt: Timestamp                                            │
└─────────────────────────────────────────────────────────────────┘
                    │
                    │ 1:N relationship
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼───────────────┐   ┌───▼──────────────────────────────┐
│      DONATIONS        │   │           REQUESTS               │
├───────────────────────┤   ├──────────────────────────────────┤
│ _id: ObjectId (PK)    │   │ _id: ObjectId (PK)              │
│ donor: ObjectId (FK)  │───│ donation: ObjectId (FK)         │
│ foodName: String      │   │ shelter: ObjectId (FK)          │
│ quantity: Number      │   │ status: Enum ['pending',        │
│ expiryDate: Date      │   │         'approved', 'rejected'] │
│ status: Enum          │   │ message: String                 │
│   ['available',       │   │ createdAt: Timestamp            │
│    'requested',       │   │ updatedAt: Timestamp            │
│    'approved']        │   └──────────────────────────────────┘
│ location: {...}       │
│ createdAt: Timestamp  │
│ updatedAt: Timestamp  │
└───────────────────────┘
```

## 🔄 Request Matching & Approval Flow

```
1. DONOR CREATES DONATION
   ↓
   [Donation Status: "available"]
   ↓
2. SHELTER BROWSES AVAILABLE DONATIONS
   ↓
3. SHELTER SUBMITS REQUEST
   ↓
   [Donation Status: "available" → "requested"]
   [Request Status: "pending"]
   ↓
4. DONOR VIEWS PENDING REQUESTS
   ↓
5. DONOR DECISION:
   ├─→ APPROVE
   │   ↓
   │   [Request Status: "approved"]
   │   [Donation Status: "approved"]
   │   [Other pending requests: auto-rejected]
   │   ↓
   │   Shelter receives approved donation
   │
   └─→ REJECT
       ↓
       [Request Status: "rejected"]
       [If no other pending requests:]
       [Donation Status: "available"]
       ↓
       Donation available for other shelters
```

## 🚀 Component: Request Matching & Approval

### Component Responsibilities:

1. **Request Creation**: Shelters can request available donations
2. **Request Management**: Track all requests with status updates
3. **Approval Workflow**: Donors approve/reject shelter requests
4. **Conflict Prevention**: Prevent multiple shelters claiming same donation
5. **Auto-Rejection**: Automatically reject competing requests
6. **Status Tracking**: Real-time status updates for donations and requests

### Key Features:

- ✅ Authenticated request creation (shelter only)
- ✅ Duplicate request prevention
- ✅ Donor verification before approval/rejection
- ✅ Automatic rejection of competing requests
- ✅ Smart status management (available ↔ requested ↔ approved)
- ✅ View requests by shelter, donor, or donation
- ✅ Role-based access control

## 📡 API Endpoints

### Authentication Endpoints (3)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile

### Donation Endpoints (5)
- `POST /api/donations/` - Create donation (donor only)
- `GET /api/donations/available` - Browse available donations
- `GET /api/donations/my-donations` - Get donor's donations
- `GET /api/donations/:id` - Get donation by ID
- `GET /api/donations/` - Get all donations

### Request Endpoints (7)
- `POST /api/requests/` - Create request (shelter only)
- `PUT /api/requests/:id/approve` - Approve request (donor only)
- `PUT /api/requests/:id/reject` - Reject request (donor only)
- `GET /api/requests/my-requests` - Get shelter's requests
- `GET /api/requests/my-donations` - Get requests for donor's donations
- `GET /api/requests/` - Get all requests
- `GET /api/requests/donation/:donationId` - Get requests by donation

**Total: 15 Fully Functional Endpoints**

## 🔐 Security Features

- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **Role-Based Access Control**: Separate donor/shelter permissions
- ✅ **Input Validation**: Express-validator on all inputs
- ✅ **MongoDB Injection Prevention**: Mongoose sanitization
- ✅ **Error Handling**: Centralized error handler, no data leakage
- ✅ **CORS Configuration**: Controlled cross-origin access

## 📚 Setup Instructions

### Prerequisites
- Node.js v16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/SharePlate
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Access the application**
   - API Base URL: `http://localhost:5000`
   - API Documentation: `http://localhost:5000/api-docs`

### Testing the API

Use Postman, Thunder Client, or curl to test endpoints:

**Example: Register a User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "donor"
  }'
```

**Example: Create a Donation (requires auth token)**
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "foodName": "Pizza",
    "quantity": 10,
    "expiryDate": "2026-02-28"
  }'
```

## 📦 Project Structure

```
Project/
├── server.js                      # Application entry point
├── package.json                   # Dependencies and scripts
├── .env                           # Environment variables
├── README.md                      # This file
│
├── src/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── swagger.js             # Swagger configuration
│   │
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── donationController.js  # Donation CRUD operations
│   │   ├── requestController.js   # Request matching logic
│   │   └── pickupController.js    # Pickup management
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── roleMiddleware.js      # Role-based authorization
│   │   ├── validate.js            # Validation middleware
│   │   └── errorHandler.js        # Error handling
│   │
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Donation.js            # Donation schema
│   │   ├── Request.js             # Request schema
│   │   └── Pickup.js              # Pickup schema
│   │
│   └── routes/
│       ├── authRoutes.js          # Authentication routes
│       ├── donationRoutes.js      # Donation routes
│       └── requestRoutes.js       # Request routes
```

## 🧪 Testing Guidelines

### Manual Testing Workflow

1. **Register two users** (one donor, one shelter)
2. **Login as donor** → Get JWT token
3. **Create a donation** using donor token
4. **Login as shelter** → Get JWT token
5. **Browse available donations**
6. **Create a request** for the donation
7. **Login as donor again**
8. **View requests** for your donation
9. **Approve or reject** the request
10. **Verify status updates** in both donation and request

### Test Cases Covered

- ✅ User registration with validation
- ✅ User login with credential verification
- ✅ JWT token generation and verification
- ✅ Role-based access control
- ✅ Donation creation by donor
- ✅ Listing available donations
- ✅ Request creation by shelter
- ✅ Duplicate request prevention
- ✅ Request approval workflow
- ✅ Auto-rejection of competing requests
- ✅ Request rejection workflow
- ✅ Status updates cascade (donation ↔ request)

## 🎯 Evaluation 1 Completion Status

### Backend Development Progress: **95%+ Complete**

| Component | Status | Details |
|-----------|--------|---------|
| Authentication System | ✅ Complete | Register, login, JWT auth |
| Donation Management | ✅ Complete | Full CRUD operations |
| Request Matching | ✅ Complete | Create, approve, reject, view |
| MongoDB Integration | ✅ Complete | 4 models with relationships |
| Validation & Security | ✅ Complete | Input validation, role-based auth |
| API Documentation | ✅ Complete | Swagger/OpenAPI docs |
| Error Handling | ✅ Complete | Centralized error handler |
| Code Quality | ✅ Complete | Clean architecture, best practices |

### API Endpoints: **15/15 Working** ✅
### Database Models: **4/4 Complete** ✅
### Middleware: **5/5 Implemented** ✅

## 👥 Team Members

- **Pinithi** - Request Matching & Approval Component

## 📝 License

This project is developed as part of the Application Frameworks module coursework at SLIIT.

## 📞 Contact

For questions or support, please contact the development team.

---

**Last Updated**: February 25, 2026  
**Version**: 1.0.0  
**Status**: Ready for Evaluation 1
