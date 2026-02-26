const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
}, { _id: false }); // prevent separate _id for location

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  foodName: {
    type: String,
    required: true,
    trim: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  expiryDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["available", "reserved", "collected", "expired"],
    default: "available"
  },

  location: {
    type: LocationSchema,
    required: true
  }

}, { timestamps: true }); // automatically adds createdAt & updatedAt


module.exports = mongoose.model(
    "DonationModel", //File name
     DonationSchema //Function name
);