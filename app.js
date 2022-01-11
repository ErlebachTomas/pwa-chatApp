'use strict';
const dotenv = require('dotenv').config();
const debug = require('debug')('myApp');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const ObjectId = require('mongodb').ObjectId;
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

var Message = require('./model/Message');
var User = require('./model/User');
var Conversation = require('./model/Conversation');
var controller = require('./controller/chatController');


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
let local = false;
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
    ws.on('message', async function (message) {
          
        let data = JSON.parse(message.toString());
        debug("prijem " + data.type);


        switch (data.type) {

            case "init":
                ws.id = data.username;
                online.set(ws.id, ws);
                debug("id " + ws.id);
                break;
            case "text":
                try {                   
                    let cid = data.msg.conversation;
                    let sid = data.msg.sender; //username 

                    debug(data.msg); //todo time bug fix

                    let newMsg = new Message({
                        message: data.msg.message,
                        type: data.msg.type,
                        timestamp: data.msg.time,
                        conversation: cid,
                        sender: sid
                    });
                
                    let savedMsg = await newMsg.save(); //todo ošetření? 
                    debug("přeposílám dál...");
                    sendDatatoParticipants(cid, data.msg);
                                        
                } catch (err) {
                    debug(err);
                }

                break;
            default:
                ws.send(JSON.stringify(data));
        }
            
        
    });

    ws.on('close', function () {

        online.delete(ws.id);
        debug("connection closed " + ws.id);
    })
});


/**
 z konverzace vezme seznam lidi a pokud jsou online pošle přes ws 
 * @param {any} cid
 * @param {any} msg
 */
async function sendDatatoParticipants(cid, msg) {

    let conv = await controller.getConversation(cid);
    let participants = conv.participants;

    debug(participants);

    participants.forEach(function (user, index) {

        if (online.has(user)) {
            debug("posílám " + user);
            sendData(user, msg);
        } else {
            debug(user + " je offline");
        }
    });

}



/**
 * Odešle data příslušnému clienovi jako json
 * @param {any} username unikatni id uživatele
 * @param {any} data data
 */
function sendData(username, data) {

    let ws = online.get(username);

    if (ws) {
        ws.send(JSON.stringify(data));
    }        
}
