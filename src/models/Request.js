const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation",
    required: true,
  },

  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

    message: {
        type: String,
        maxlength: 500,
    },


}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
