const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    donor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    foodName: String,
    quantity: Number,
    
    expiryDate: {
        type: Date,
        required: [true, 'Please provide an expiry date'],
    },

    status:{
        type:String,
        enum: ["available", "requested", "approved"],
        default: "available"
    },

    location: {
        address: String,
        lat: Number,
        lng: Number,
    },

  

}, {timestamps: true});
    

module.exports= mongoose.model("Donation", donationSchema);