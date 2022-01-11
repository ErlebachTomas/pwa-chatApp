/* server pro spousteni testu */
const express = require('express');
const mongoose = require('mongoose');


const routes = require('../routes/index');
const apiRouter = require('../routes/api');

const server = express();
server.use(express.json());

server.use('/', routes);
server.use('/api', apiRouter);

// dbs conn
mongoDBUrl = "mongodb://localhost:27017/Chat";
mongoose.connect(mongoDBUrl);
mongoose.Promise = global.Promise;


module.exports = server;