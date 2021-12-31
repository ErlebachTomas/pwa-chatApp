'use strict';
const express = require('express');
const router = express.Router();


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

//todo API + apiary.io
// https://docs.mongodb.com/manual/reference/sql-comparison/#select


router.get('/getAllUsers', async (req, res) => {

    try {
        let data = await User.find({}, { login: 1, name: 1, profilePicture: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }

});

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
