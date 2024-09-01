const { addMovie, getAllMovies, getMovieById, updateMovieById, deleteMovieById } = require("../controllers/movieController")

module.exports = (app) => {
    // create a movie
    app.post("/movie", addMovie)
    // get all the movies
    app.get("/movies", getAllMovies)
    // get a movie by id
    app.get("/movie/:id", getMovieById)
    //update a movie
    app.put("/movie/:id", updateMovieById)
    //delete a movie
    app.delete("/movie/:id", deleteMovieById)
}
