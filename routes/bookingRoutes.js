const { makePayment, createBooking, getAllBookings } = require("../controllers/bookingController")
const { verifyAdmin, verifyToken } = require("../middlewares/authMiddleware")

module.exports = (app) => {
    app.post("/payment", [verifyToken], makePayment)
    app.post("/bookings", [verifyToken], createBooking)
    app.get("/bookings", [verifyToken], getAllBookings)
}