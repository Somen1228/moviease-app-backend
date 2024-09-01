const mongoose = require("mongoose")


const showSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theatreLLDMarch',
        require: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'moviesLLDMarch',
        require: true
    },
    totalSeats: {
        type: Number,
        required: true,
    },
    bookedSeats: {
        type: Array,
        default: []
    },
    ticketPrice: {
        type: Number,
        required: true
    }
}, {timeStamps: true})


const Shows = mongoose.model('showsLLDMarch', showSchema)


module.exports = Shows;