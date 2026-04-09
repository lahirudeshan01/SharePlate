const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const requestRoutes = require("./routes/requestRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
const defaultAllowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const configuredOrigin = process.env.FRONTEND_URL;
const allowedOrigins = configuredOrigin
    ? [...defaultAllowedOrigins, configuredOrigin]
    : defaultAllowedOrigins;

const localDevOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

const corsOptions = {
    origin: (origin, callback) => {
        // Allow non-browser tools (like Postman/curl) and same-origin requests.
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || localDevOriginRegex.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
};

app.use(cors(corsOptions));
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
app.use("/api/users", userRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
