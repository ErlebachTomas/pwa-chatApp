'use strict';
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const debug = require('debug')('myApp');
const User = require("../model/User");


const controller = require('../controller/chatController');
/* Login */ 
router.get('/login', function (req, res) {
    res.render('loginFormPage', { title: 'Přihlášení' });
});


router.post('/login', async function (req, res) {    
        
    let id = req.body.login;
    let psw = req.body.password;

    debug(id, psw);

    let user = await User.findOne({ login: id }, {}).lean(); // lean convertuje js object
    let pswCheck = controller.compare(psw, user.password);

    debug( pswCheck, psw, user.password);


    if (user != null && pswCheck) {
        
        req.session.userId = user._id.toString();

        res.redirect("/");

    } else {
       // res.json({ psw: "wrong" });
       res.redirect("/login");
    }

      
});

/* HOME page */
router.get('/', async function (req, res) {
       
    if (req.session.userId) {
        
        let oid = new ObjectId(req.session.userId);      
        let user = await User.findOne({ _id: oid }, {}).lean();
          
        /* todo render */
        res.render('chatPage', {
            authorised: true,
            title: 'Chat app',
            login: user.login,
            avatar: user.profilePicture,
            name: user.name,            
            online: user.status
        });

    } else {
        res.redirect("/login");
    }

});

router.get('/logout', function (req, res) {
        
    debug('Destroy session for' + req.session.userId);

    req.session.destroy();

    res.redirect("/login");

});

module.exports = router;
