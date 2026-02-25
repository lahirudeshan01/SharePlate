const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

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

// Register Routes
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});