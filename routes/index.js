'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/index', function (req, res) {
    res.render('index', { title: 'Chat app' });
});


/* Login */ 
router.get('/login', function (req, res) {
    res.render('loginForm', { title: 'Login' });
});

/* CSS demo */
router.get('/demo', function (req, res) {
    res.render('demo', { title: 'CSS demo' });
});

/* todo / */
router.get('/', function (req, res) {
    res.render('chat', {
        title: 'Chat app',
        avatar: '/images/avatar.png',
        name:'Karel Novák',
        online: 'před 50 minutami'
    });
});

module.exports = router;
