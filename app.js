'use strict';
const dotenv = require('dotenv').config();
const debug = require('debug')('myApp');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const express = require('express');
const WebSocketServer = require('ws').Server;

// dbs 
const mongoose = require('mongoose');

// middleware
var routes = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', apiRouter);

// error handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// mongoose setup
let local = true //todo upravit
let mongoDBUrl;

if (local) {
    mongoDBUrl = "mongodb://localhost:27017/Chat";
    
} else {
    mongoDBUrl = process.env.DB_CONNECTION;     
}
mongoose.connect(mongoDBUrl);
mongoose.Promise = global.Promise;
   



// Server  
app.set('port', process.env.PORT || 3000);

const server = require('http').createServer(app);

server.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
    debug('DB:' + mongoDBUrl);
});


// WebSocketServer
let wss = new WebSocketServer({ server: server });

wss.on('connection', function (ws) {

    debug('ws client pripojen');
    ws.send('pripojen');

    // ws prijem 
    ws.on('message', function (message) {
       
        let msg = message.toString();
        debug(msg);
        ws.send(msg);

    });

    ws.on('close', function () {
        debug("connection closed");
    })
});
