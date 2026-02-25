const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Donation API",
      version: "1.0.0",
      description: "API for managing food donations and requests between donors and shelters",
      contact: {
        name: "API Support"
      }
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints"
      },
      {
        name: "Donations",
        description: "Donation management endpoints"
      },
      {
        name: "Requests",
        description: "Request matching and approval endpoints"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsDoc(options);
