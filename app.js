const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

/************/
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload');
    },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var upload = multer({storage: storage});
app.post('/single', upload.single('profile'), (req, res) => {
    try {
        res.send(req.file);
    }catch(err) {
        res.send(400);
    }
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
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
const forumRoute = require("./src/routes/forumRoute");
const eventRoute = require("./src/routes/eventRoute");
app.use("/user", usersRoutes);
app.use("/club", clubRoute);
app.use("/forum", forumRoute);
app.use("/event", eventRoute);

app.get('*', function(req, res){
     return res.status(404).json({message: "404 Not Found"});
});

module.exports = app;
