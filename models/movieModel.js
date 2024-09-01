const { default: mongoose } = require("mongoose");

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    duration: {
        type: Number,
        require: true
    },
    genre: {
        type: String,
        require: true
    },
    language: {
        type: String,
        require: true
    },
    realeaseDate: {
        type: Date,
        require: true
    },
    poster: {
        type: String,
        require: true
    }
})

const Movies = mongoose.model("moviesLLDMarch", movieSchema)

module.exports = {
    Movies
}