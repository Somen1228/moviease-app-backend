const mongoose = require("mongoose")

const bookingSchema = mongoose.Schema({
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "showsLLDMarch"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userLLDMarch"
    },  
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theatreLLDMarch"
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "moviesLLDMarch"
    }, 
    seats: {
        type: Array,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Bookings = mongoose.model("bookingsLLDMarch", bookingSchema)

module.exports = Bookings;
