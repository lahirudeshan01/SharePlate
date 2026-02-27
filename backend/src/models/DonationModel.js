const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "reserved", "collected", "expired"],
      default: "available",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "Donation", //File name
  DonationSchema, //Function name
);
