console.log("Starting backend server...");
const express = require("express");
const cors = require("cors");

const deliveryRoutes = require("./Routes/deliveryRoutes");
require("./models/UserModel");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/delivery", deliveryRoutes);

module.exports = app;
