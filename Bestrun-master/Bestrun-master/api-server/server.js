#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('api-server:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}








// #!/usr/bin/env node
// // Get dependencies
// var express = require('express');
// var path = require('path');
// var http = require('http');
// var debug = require('debug')('bestrunapi:server');
// var bodyParser = require('body-parser');
// var logger = require('morgan');
//
// var config = require('./config/config');
// var mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');
// var User = require('./models/user');
//
// // Get our API routes
// var api = require('./routes/index');
//
// var app = express();
//
// app.use(logger('dev'));
// // Parsers for POST data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
//
//
// // mongoose.connect(config.database);
// mongoose.connect(config.database_local).then(() => {
//     console.log("Connected to Database");
//
//     // Set our api routes
//     app.use('/', api);
//     //
//     // //Create superadmin
//     // let user = new User({
//     //     "name": "miguel",
//     //     "surnames": "donaire",
//     //     "email": "mdonaireparra@gmail.com",
//     //     "password": "password",
//     //     "role": "Superadmin"
//     // });
//     // User.save(user).then((res) => {
//     //     console.log(res);
//     //     return null;
//     // }).catch(err => {
//     //     console.log("error creating superadmin", err)
//     // });
//
// }).catch((err) => {
//     console.log("Not Connected to Database ERROR! ", err);
// });
//
// // Cross Origin middleware
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next()
// });
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
//
// /**
//  * Get port from environment and store in Express.
//  */
// var port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);
//
// /**
//  * Create HTTP server.
//  */
// const server = http.createServer(app);
//
// /**
//  * Listen on provided port, on all network interfaces.
//  */
//
// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);
//
// /**
//  * Normalize a port into a number, string, or false.
//  */
//
// function normalizePort(val) {
//     var port = parseInt(val, 10);
//
//     if (isNaN(port)) {
//         // named pipe
//         return val;
//     }
//
//     if (port >= 0) {
//         // port number
//         return port;
//     }
//
//     return false;
// }
//
// /**
//  * Event listener for HTTP server "error" event.
//  */
//
// function onError(error) {
//     if (error.syscall !== 'listen') {
//         throw error;
//     }
//
//     var bind = typeof port === 'string'
//         ? 'Pipe ' + port
//         : 'Port ' + port;
//
//     // handle specific listen errors with friendly messages
//     switch (error.code) {
//         case 'EACCES':
//             console.error(bind + ' requires elevated privileges');
//             process.exit(1);
//             break;
//         case 'EADDRINUSE':
//             console.error(bind + ' is already in use');
//             process.exit(1);
//             break;
//         default:
//             throw error;
//     }
// }
//
// /**
//  * Event listener for HTTP server "listening" event.
//  */
//
// function onListening() {
//     var addr = server.address();
//     var bind = typeof addr === 'string'
//         ? 'pipe ' + addr
//         : 'port ' + addr.port;
//     debug('Listening on ' + bind);
// }