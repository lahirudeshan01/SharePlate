const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique: true,
        match:[/^\S+@\S+\.\S+$/,
      "Please enter a valid email"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: {
            validation: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value);
      },
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        }
    },

    role: {
        type:String,
        required: true,
        enum: {
            values: ["donor", "shelter"],
            message: "Role must be either donor or shelter"
        }
    },

    organizationName:{
        type: String, 
    },

    location: {
        adress: String,
        lat: Number,
        lng: Number,
    },

}, {timestamps: true});

module.exports= mongoose.model("User", userSchema);