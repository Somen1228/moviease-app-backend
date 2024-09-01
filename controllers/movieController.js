const { Movies } = require("../models/movieModel")

const addMovie = async (req,res) => {
    try {
        const newMovie = new Movies(req.body);
        await newMovie.save();


        return res.status(201).send({
            success: true,
            message: "New movie has been added successfully"
        })
    } catch(err) {
        return res.status(500).send({
            message: err.message,
            success: false
        })
    }
}

const getAllMovies = async (req,res) => {
    try {
        const allMovies = await Movies.find();

        return res.status(200).send({
            success: true,
            message: "All movies have been fetched successfully",
            data: allMovies
        })
    } catch(err) {
        return res.status(500).send({
            message: err.message,
            success: false
        })
    }
}
const getMovieById = async (req,res) => {
    try {
        const id = req.params.id;
        const movie = await Movies.findById(id);

        return res.status(200).send({
            success: true,
            message: "Movie fetched successfully",
            data: movie
        }) 
    } catch(err) {
        return res.status(500).send({
            message: err.message,
            success: false
        })
    }
}
const updateMovieById = async (req,res) => {
    try {
        const movie = await Movies.findByIdAndUpdate(req.params.id, req.body, {new:true});

        return res.status(200).send({
            success: true,
            message: "Movie updated successfully",
            data: movie
        }) 
    } catch(err) {
        return res.status(500).send({
            message: err.message,
            success: false
        })
    }
}
const deleteMovieById = async (req,res) => {
    try {
        const movie = await Movies.findByIdAndDelete(req.params.id, req.body);

        return res.status(200).send({
            success: true,
            message: "Movie deleted successfully",
            data: movie
        }) 
    } catch(err) {
        return res.status(500).send({
            message: err.message,
            success: false
        })
    }
}


module.exports = {
    addMovie, getAllMovies, getMovieById, updateMovieById, deleteMovieById
}