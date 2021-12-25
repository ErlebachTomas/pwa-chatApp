'use strict';
const express = require('express');
const router = express.Router();


var Message = require('../model/Message');

/* api/... */
router.post('/', function (req, res) {   
    res.send({ "req.body": req.body }); //pro kontrolu
});
router.get('/', function (req, res) {
    res.send(req.body);
});

//todo API + apiary.io


module.exports = router;
