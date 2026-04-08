const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SharePlate API',
      version: '1.0.0',
      description:
        'REST API for SharePlate — a food waste management platform that connects restaurants with food banks and shelters. ' +
        'All protected endpoints require a valid JWT Bearer token.',
      contact: {
        name: 'SharePlate Team',
        email: 'noreply@shareplate.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.shareplate.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: **Bearer &lt;token&gt;**',
        },
      },
      schemas: {
        // ─── Address ──────────────────────────────────────────────────────────
        Address: {
          type: 'object',
          properties: {
            street: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'New York' },
            state: { type: 'string', example: 'NY' },
            zipCode: { type: 'string', example: '10001' },
            country: { type: 'string', example: 'USA' },
          },
        },

        // ─── Precise Map Location (Google Maps coordinates) ──────────────────
        PreciseLocation: {
          type: 'object',
          properties: {
            latitude: { type: 'number', format: 'float', minimum: -90, maximum: 90, example: 6.9271 },
            longitude: { type: 'number', format: 'float', minimum: -180, maximum: 180, example: 79.8612 },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── User (public shape — no password) ────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64b8f3c2a1e4a20012345678' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: {
              type: 'string',
              enum: ['restaurant', 'shelter', 'admin'],
              example: 'restaurant',
            },
            phone: { type: 'string', example: '0771234567' },
            organizationName: { type: 'string', example: 'The Food Place' },
            address: { $ref: '#/components/schemas/Address' },
            preciseLocation: { $ref: '#/components/schemas/PreciseLocation' },
            isActive: { type: 'boolean', example: true },
            isVerified: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ─── Auth token response ───────────────────────────────────────────────
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            data: { $ref: '#/components/schemas/User' },
          },
        },

        // ─── Standard success response ─────────────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },

        // ─── Error response ────────────────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred' },
          },
        },

        // ─── Register request ──────────────────────────────────────────────────
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            role: {
              type: 'string',
              enum: ['restaurant', 'shelter', 'admin'],
              example: 'restaurant',
            },
            phone: { type: 'string', example: '0771234567' },
            organizationName: { type: 'string', example: 'The Food Place' },
            address: { $ref: '#/components/schemas/Address' },
          },
        },

        // ─── Login request ─────────────────────────────────────────────────────
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },

        // ─── Forgot password request ───────────────────────────────────────────
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
          },
        },

        // ─── Reset password request ────────────────────────────────────────────
        ResetPasswordRequest: {
          type: 'object',
          required: ['password'],
          properties: {
            password: { type: 'string', minLength: 6, example: 'newpassword123' },
          },
        },

        // ─── Update password request ───────────────────────────────────────────
        UpdatePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', example: 'oldpassword123' },
            newPassword: { type: 'string', minLength: 6, example: 'newpassword456' },
          },
        },

        // ─── Update profile request ────────────────────────────────────────────
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            phone: { type: 'string', example: '0779876543' },
            organizationName: { type: 'string', example: 'Updated Org Name' },
            address: { $ref: '#/components/schemas/Address' },
            preciseLocation: { $ref: '#/components/schemas/PreciseLocation' },
          },
        },

        // ─── Admin update user request ─────────────────────────────────────────
        AdminUpdateUserRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            role: {
              type: 'string',
              enum: ['restaurant', 'shelter', 'admin'],
              example: 'shelter',
            },
            isActive: { type: 'boolean', example: true },
            isVerified: { type: 'boolean', example: true },
            phone: { type: 'string', example: '0779876543' },
            organizationName: { type: 'string', example: 'Updated Org' },
            address: { $ref: '#/components/schemas/Address' },
            preciseLocation: { $ref: '#/components/schemas/PreciseLocation' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication and authorization endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints (admin-only where noted)',
      },
    ],
  },
  // Glob pattern(s) pointing to route files that contain JSDoc @swagger comments
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
