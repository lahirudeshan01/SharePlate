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
        required: [true, "Password is required"]
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
