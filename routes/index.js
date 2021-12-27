'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Chat app' });
});


/* Login */ 
router.get('/login', function (req, res) {
    res.render('loginForm', { title: 'Login' });
});

module.exports = router;
