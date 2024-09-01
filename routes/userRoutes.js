const { signUp, login, getCurrentUser, getAllUsers, forgetPassword, resetPassword } = require("../controllers/userController")
const { verifyToken } = require("../middlewares/authMiddleware")


module.exports = (app) => {
    app.post("/register", signUp)
    app.post("/login", login)
    app.get("/user", [verifyToken], getCurrentUser)
    app.patch("/forgetPassword", forgetPassword)
    app.patch("/resetPassword", resetPassword)
    app.get("/users/all", getAllUsers)
}