'use strict';
const dotenv = require('dotenv').config();
const debug = require('debug')('myApp');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const express = require('express');
const session = require('express-session');
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

//setup
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET    
}));

//routes
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
        res.render('errorPage', {
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('errorPage', {
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
const online = new Map(); // online ws user list 

wss.on('connection', function (ws) {

    debug('client connect');
                 
    // ws prijem 
    ws.on('message', function (message) {
          
        let msg = JSON.parse(message.toString());
        debug("prijem " + msg.type);


        switch (msg.type) {

            case "init":
                ws.id = msg.username;
                online.set(ws.id, ws);
                debug("id " + ws.id);
                break;

            default:
                ws.send(JSON.stringify(msg));
        }
            
        
        //todo controller + DB a ssesion + user list conn

    });

    ws.on('close', function () {

        online.delete(ws.id);
        debug("connection closed " + ws.id);
    })
});


/**
 * Odešle data příslušnému clienovi 
 * @param {any} username unikatni id uživatele
 * @param {any} data json
 */
function sendData(username, data) {

    let ws = online.get(username);

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(data);
    }        
}
