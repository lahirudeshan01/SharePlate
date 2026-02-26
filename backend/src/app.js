//username - glahirudeshan_db_user
//String - mongodb+srv://glahirudeshan_db_user:1BvOhExcpVXgTcT7@cluster2.umsahnk.mongodb.net/?appName=Cluster2
//Pasword - 1BvOhExcpVXgTcT7

const express = require('express');
const mongoose = require('mongoose');
const router = require("./routes/donationRoutes")

const app = express();

//Middleware
app.use("/donations",router);
 

//Connect to MongoDB
mongoose.connect("mongodb+srv://glahirudeshan_db_user:1BvOhExcpVXgTcT7@cluster2.umsahnk.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    //Start the server
    app.listen(5000);
})
.catch((err) => console.log((err)));

