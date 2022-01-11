'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controller/chatController');

var Message = require('../model/Message');
var User = require('../model/User');
var Conversation = require('../model/Conversation');

const debug = require('debug')('myApp');

/* api/... */
router.post('/', function (req, res) {   
    res.send({ "req.body": req.body }); //pro kontrolu
});
router.get('/', function (req, res) {
    res.send(req.body);    
});

router.get('/getAllUsers', controller.getAllUsers );

router.get('/getUserContactList', async function (req, res) {
    let username = req.query.username;
    let contactList = await controller.getUserContactList(username);
    
    res.json(contactList);
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

router.get('/conversation', async function (req, res) {

   /*  req.query.username,
       req.query.participant
   */

    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [req.query.username, req.query.participant] },
        });

        if (conversation == null) {
            // pokud ještě neexistuje založí novou 
            conversation = new Conversation({ participants: [req.query.username, req.query.participant] });
            await conversation.save();
        }
                
        debug("cid: " + conversation._id);
        let cid = conversation._id;
        let messages = await Message.find({ "conversation": cid });              

        res.json({ conversation: conversation, messages: messages });

        
    } catch (err) {
        res.status(500).json(err);
    }
    
});


router.get("/hash/:psw", async (req, res) => {
    let hash = controller.hash(req.params.psw);
    res.send({"psw": hash });
});

module.exports = router;
