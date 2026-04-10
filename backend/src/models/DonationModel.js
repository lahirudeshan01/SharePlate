const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodName: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },

    pickupAddress: {
      type: String,
      trim: true,
    },

    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },

    status: {
      type: String,
      enum: ["available", "reserved", "collected", "expired"],
      default: "available",
    },

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reservedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Donation", DonationSchema);
