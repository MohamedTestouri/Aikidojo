const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());
app.use(express.json());


/*app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});*/
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const usersRoutes = require("./src/routes/userRoute");
const clubRoute = require("./src/routes/clubRoute");
const postRoute = require("./src/routes/postRoute");
const eventRoute = require("./src/routes/eventRoute");
app.use("/user", usersRoutes);
app.use("/club", clubRoute);
app.use("/post", postRoute);
app.use("/event", eventRoute);
app.use("/uploads", express.static("./src/uploads/"));

app.get('*', function (req, res) {
    return res.status(404).json({ message: "404 Not Found" });
});

module.exports = app;
