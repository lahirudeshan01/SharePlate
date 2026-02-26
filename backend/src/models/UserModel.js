const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["donor", "shelter", "admin"] },
  phone: String,
  address: String,
}, { timestamps: true });

module.exports = mongoose.model(
    "UserModel", //File name
     UserSchema //Function name
);