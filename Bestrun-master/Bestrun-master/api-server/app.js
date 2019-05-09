var express = require('express');
var cors = require('cors');
var logger = require('morgan');
var api = require('./routes/api.route');
var bluebird = require('bluebird');
var User = require('./models/user.model');

var app = express();
require('dotenv').config();

var mongoose = require('mongoose');
mongoose.Promise = bluebird;
mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log(`Succesfully Connected to the Mongodb Database  at URL : mongodb://127.0.0.1:27017/bestrun`);
    })
    .catch((err) => {
        console.log(err);
        console.log(`Error Connecting to the Mongodb Database at URL : mongodb://127.0.0.1:27017/bestrun`)
    });

// //Create superadmin
var user = new User({
    "name": "miguel",
    "surnames": "donaire",
    "email": "mdonaireparra@gmail.com",
    "password": "$2a$10$fjGqfhbIlkwJRIUOxoXewOqDLjZNSb//ssd1Kbx87/9CmQIAyCJ0.", //password
    "role": "Superadmin",
    "accessProvider": "Password"
});
user.save();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded());

app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({error: err});
});

module.exports = app;
