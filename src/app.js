const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const requestRoutes = require("./routes/requestRoutes");
const pickupRoutes = require("./routes/pickupRoutes");

const app = express();

// Middleware
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
    res.send("API Running...");
});

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/pickups", pickupRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
