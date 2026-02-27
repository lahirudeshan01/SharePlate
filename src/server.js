const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

// Load environment variables
dotenv.config();

// MongoDB Connection
connectDB();

// Start Server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
}

// Export app for testing
module.exports = app;
