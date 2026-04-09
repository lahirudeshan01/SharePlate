const dotenv = require("dotenv");

// Load environment variables FIRST (before other imports read process.env)
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

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
