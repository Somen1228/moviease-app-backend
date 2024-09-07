const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cors = require('cors')
const rateLimit = require("express-rate-limit")
const mongoSanitize = require('express-mongo-sanitize');
const path = require("path")

require('dotenv').config()
require('./config/dbConfig')
const PORT = process.env.PORT;
const movieRoutes = require("./routes/movieRoutes")
const theatreRoutes = require("./routes/theatreRoutes")
const userRoutes = require("./routes/userRoutes")
const showRoutes = require("./routes/showRoutes")
const bookingRoutes = require('./routes/bookingRoutes')

const apiLimiter = rateLimit({
  windowsMs: 5*60*1000,
  max: 100,
  message: "Too many requests from this IP. Please try again after some time"
})


app.use(apiLimiter);
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, 'public')));

movieRoutes(app)
theatreRoutes(app)
userRoutes(app)
showRoutes(app)
bookingRoutes(app)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\nServer is running successfully in: ${PORT}`);
})



