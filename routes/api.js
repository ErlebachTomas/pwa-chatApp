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
