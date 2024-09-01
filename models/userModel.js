const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false
    },
    otp: {
        type: Number
    },
    otpExpiry: {
        type: Date
    }
},
{
    timestamps: true
})

const User = mongoose.model("userLLDMarch", userSchema)

module.exports = User;