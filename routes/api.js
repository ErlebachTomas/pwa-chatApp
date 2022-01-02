﻿'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controller/chatController');

var Message = require('../model/Message');
var User = require('../model/User');
var Conversation = require('../model/Conversation');

/* api/... */
router.post('/', function (req, res) {   
    res.send({ "req.body": req.body }); //pro kontrolu
});
router.get('/', function (req, res) {
    res.send(req.body);
});

router.get('/getAllUsers', controller.getAllUsers );

// uložit zprávu...
router.post('/newMessage', async (req, res) => {
    const { message } = req.body;
    let msg = new Message({ message });
    try {
        savedMsg = await msg.save();
        res.json(savedMsg);
    } catch (err) {
        res.status(500).json(err);
    }


});

// todo načíst zprávy (ošetření ?)
router.get("/conversation/:id", async (req, res) => {
    try {
        let query = { "_id": req.params.id };
        let messages = await Message.find(query);
        res.json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
