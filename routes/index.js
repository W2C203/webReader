var express = require('express');
var app = express.Router();

app.get('/', function (req, res) {
    res.render('index', { title: 'webReader' });
});

module.exports = app;