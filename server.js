const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const { errorHandler } = require("./src/middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

const donationRoutes = require("./src/routes/donationRoutes");
const requestRoutes = require("./src/routes/requestRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
connectDB();

// Test Route
app.get("/", (req, res) => {
    res.send("API Running...");
});

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register Routes
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);

app.use(errorHandler);

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});