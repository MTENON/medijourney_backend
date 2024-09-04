require("dotenv").config();

require('./models/connection'); //connection mongoose

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// function pour verifier la validitée du token
const validateToken = async (req, res, next) => {
    try {
        const user = await User.findOne({ token: req.headers.authorization });
        if (user === null || user === undefined) {
            return res.json({ result: false, error: "Token invalide" });
        }
        req.body._id = user._id;
        next();
    } catch (error) {
        console.error(error);
        res.status(401)
        res.json({ result: false, error: "Internal server error" });
    }
};

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
