const { addTheatre, getAllTheatres } = require("../controllers/theatreController")
const { verifyToken} = require("../middlewares/authMiddleware")

module.exports = (app) => {
    app.post("/theatre", addTheatre)
    app.get("/theatres", [verifyToken], getAllTheatres)
}